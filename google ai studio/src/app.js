import { Viewer } from 'mapillary-js';

const MAPILLARY_TOKEN = 'MLY|26496846323328879|b026fe3c6c98fbe1eeccfdecaea5f541';

let LOCATIONS = [];

async function loadLocations() {
  try {
    const response = await fetch('/src/locations.json');
    LOCATIONS = await response.json();
    log(`Daten geladen: ${LOCATIONS.length} Orte`);
    startRound();
  } catch (err) {
    log(`Ladefehler JSON: ${err.message}`);
  }
}

let map;
let marker;
let mlyViewer;
let currentGuess = null;
let currentRound = 1;
let totalScore = 0;
let currentLoc = null;
let usedLocations = [];
let drawnItems = [];

const roundNumEl = document.getElementById('round-num');
const totalScoreEl = document.getElementById('total-score');
const guessBtn = document.getElementById('guess-btn');
const resultsModal = document.getElementById('results-modal');
const distText = document.getElementById('dist-text');
const roundScoreEl = document.getElementById('round-score');
const nextBtn = document.getElementById('next-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const debugPanel = document.getElementById('debug-panel');
const debugInfo = document.getElementById('debug-info');
const debugLogEl = document.getElementById('debug-log');
const fallbackViewer = document.getElementById('fallback-viewer');
const fallbackImg = document.getElementById('fallback-img');
const loginOverlay = document.getElementById('login-overlay');
const playerNameInput = document.getElementById('player-name-input');
const startGameBtn = document.getElementById('start-game-btn');
const displayNameEl = document.getElementById('display-name');
const copyDebugBtn = document.getElementById('copy-debug-btn');

let debugMode = true;

function copyToClipboard() {
  if (!currentLoc) return;
  const text = `${currentLoc.name}: ${currentLoc.lat.toFixed(6)}, ${currentLoc.lng.toFixed(6)}`;
  navigator.clipboard.writeText(text).then(() => {
    const originalText = copyDebugBtn.textContent;
    copyDebugBtn.textContent = 'Kopiert!';
    copyDebugBtn.style.borderColor = '#22c55e';
    setTimeout(() => {
      copyDebugBtn.textContent = originalText;
      copyDebugBtn.style.borderColor = '#4f46e5';
    }, 2000);
    log("In Zwischenablage kopiert");
  });
}

if (copyDebugBtn) {
  copyDebugBtn.addEventListener('click', copyToClipboard);
}

let playerName = 'Gast';

function log(msg) {
  console.log(msg);
  if (!debugLogEl) return;
  const entry = document.createElement('div');
  entry.textContent = `> ${msg}`;
  debugLogEl.prepend(entry);
  if (debugLogEl.children.length > 10) debugLogEl.lastChild.remove();
}

function handleLogin() {
  const name = playerNameInput.value.trim();
  if (name) {
    playerName = name;
    displayNameEl.textContent = playerName;
  }
  loginOverlay.style.display = 'none';
  log(`Willkommen, ${playerName}!`);
  loadLocations();
}

startGameBtn.addEventListener('click', handleLogin);
playerNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleLogin();
});

function updateDebugInfo() {
  if (debugMode && currentLoc) {
    debugPanel.style.display = 'block';
    debugInfo.innerHTML = `
      ORT: ${currentLoc.name}<br>
      LAT/LNG: ${currentLoc.lat.toFixed(4)}, ${currentLoc.lng.toFixed(4)}<br>
      RUNDE: ${currentRound}/5
    `;
  } else {
    debugPanel.style.display = 'none';
  }
}

window.addEventListener('keydown', (e) => {
  // Shortcut Strg + G (G is keyCode 71)
  if (e.ctrlKey && e.key.toLowerCase() === 'g') {
    e.preventDefault();
    debugMode = !debugMode;
    updateDebugInfo();
    log(`Debug ${debugMode ? 'AN' : 'AUS'}`);
  }
});

function initMap() {
  map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 1,
    worldCopyJump: true,
    zoomControl: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map);

  map.on('click', (e) => {
    if (resultsModal.style.display === 'flex') return;
    currentGuess = e.latlng;
    if (marker) {
      marker.setLatLng(currentGuess);
    } else {
      marker = L.marker(currentGuess).addTo(map);
    }
    guessBtn.disabled = false;
  });
}

function initMapillary() {
  log("Starte Viewer...");
  mlyViewer = new Viewer({
    accessToken: MAPILLARY_TOKEN,
    container: 'mly-viewer',
    component: {
      cover: false,
      direction: false,
      sequence: false,
      zoom: true,
    }
  });

  mlyViewer.on('image', () => {
    log("Bild geladen!");
    mlyViewer.resize();
    hideLoading();
  });

  mlyViewer.on('error', (e) => {
    log(`Viewer Fehler: ${e.message}`);
  });
}

function hideLoading() {
  loadingOverlay.style.opacity = '0';
  setTimeout(() => {
    loadingOverlay.style.visibility = 'hidden';
  }, 300);
}

function getRandomLocation() {
  if (LOCATIONS.length === 0) return null;
  const available = LOCATIONS.filter(l => !usedLocations.includes(l.id));
  if (available.length === 0) {
    usedLocations = [];
    return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  }
  const loc = available[Math.floor(Math.random() * available.length)];
  usedLocations.push(loc.id);
  return loc;
}

async function fetchNearbyImage(lat, lng) {
  const controller = new AbortController();
  // Geändert von 8s auf 2000ms wie angefragt
  const timeoutId = setTimeout(() => controller.abort(), 2000);
  
  const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id&point=${lng},${lat}&radius=2000&limit=1`;
  
  log(`Suche API (Radius 2000)...`);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      log(`API-CODE ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0].id;
    }
    return null;
  } catch (err) {
    clearTimeout(timeoutId);
    log(`Fetch: ${err.name === 'AbortError' ? 'Timeout 2s' : err.name}`);
    return null;
  }
}

let loadingTimeout;
let retryCount = 0;

async function activateMockMode() {
  log("AKTIVIERE MOCK-MODUS...");
  fallbackViewer.style.display = 'flex';
  fallbackImg.src = currentLoc.fallback;
  hideLoading();
}

async function startRound(newLevel = true) {
  if (loadingTimeout) clearTimeout(loadingTimeout);
  if (LOCATIONS.length === 0) return;
  
  loadingOverlay.style.visibility = 'visible';
  loadingOverlay.style.opacity = '1';
  fallbackViewer.style.display = 'none';
  
  loadingTimeout = setTimeout(() => {
    if (loadingOverlay.style.visibility !== 'hidden') {
      log("Auto-Hide Loading");
      hideLoading();
    }
  }, 10000);

  if (newLevel) {
    currentLoc = getRandomLocation();
    retryCount = 0;
    log(`Ziel: ${currentLoc.name}`);
  } else {
    retryCount++;
    log(`Retry #${retryCount}`);
    
    if (retryCount >= 3) {
      await activateMockMode();
      return;
    }
  }

  currentGuess = null;
  if (marker) map.removeLayer(marker);
  drawnItems.forEach(item => map.removeLayer(item));
  drawnItems = [];
  marker = null;
  
  guessBtn.disabled = true;
  roundNumEl.textContent = currentRound;
  resultsModal.style.display = 'none';
  map.setView([20, 0], 2);
  
  updateDebugInfo();

  const imageId = await fetchNearbyImage(currentLoc.lat, currentLoc.lng);
  
  if (imageId) {
    log(`Navigiere zu ${imageId}...`);
    try {
      await mlyViewer.moveTo(imageId);
    } catch (err) {
      log("MoveTo fehlgeschlagen.");
      setTimeout(() => startRound(false), 2000);
    }
  } else {
    log("API fand nichts.");
    setTimeout(() => startRound(false), 2000);
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateScore(distance) {
  const maxScore = 5000;
  const maxDist = 5000;
  if (distance >= maxDist) return 0;
  return Math.round(maxScore * (1 - (distance / maxDist)));
}

function showResults() {
  const distance = calculateDistance(
    currentGuess.lat, currentGuess.lng,
    currentLoc.lat, currentLoc.lng
  );
  const score = calculateScore(distance);
  
  const actualMarker = L.marker([currentLoc.lat, currentLoc.lng], {
    icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  }).addTo(map).bindPopup(`<b>${currentLoc.name}</b>`).openPopup();
  drawnItems.push(actualMarker);

  const polyline = L.polyline([currentGuess, [currentLoc.lat, currentLoc.lng]], {color: 'white', dashArray: '5, 10'}).addTo(map);
  drawnItems.push(polyline);
  map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

  totalScore += score;
  totalScoreEl.textContent = totalScore;
  roundScoreEl.textContent = score;
  distText.textContent = `Du warst ${Math.round(distance).toLocaleString('de-DE')} km entfernt.`;
  
  if (currentRound === 5) {
    nextBtn.textContent = 'Erneut spielen';
  } else {
    nextBtn.textContent = 'Nächste Runde';
  }
  
  resultsModal.style.display = 'flex';
}

guessBtn.addEventListener('click', showResults);

nextBtn.addEventListener('click', () => {
  if (currentRound === 5) {
    currentRound = 1;
    totalScore = 0;
    usedLocations = [];
    totalScoreEl.textContent = '0';
  } else {
    currentRound++;
  }
  startRound();
});

initMap();
initMapillary();
