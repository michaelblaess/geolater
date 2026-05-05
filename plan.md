# geolater — Projektplan

> Ein GeoGuessr-ähnliches Browser-Spiel. Komplett kostenlos, ohne Zahlungsdaten,
> als Schülerprojekt von Michael Blaess. **Statisch, gehostet auf GitHub Pages.**

---

## 1. Projektziel

Der Spieler landet in einem zufälligen Street-Level-Panorama irgendwo auf der Welt
und muss auf einer Weltkarte raten, wo er sich befindet. Punkte richten sich nach
der Distanz zwischen Tipp und echter Position.

**Inspiration:** GeoGuessr — aber kostenlos, ohne Account, ohne Backend,
ohne Paywall.

---

## 2. Harte Randbedingungen

- **Keine Kreditkarte / keine Zahlungsdaten** — Michael ist Schüler.
- **Keine kostenpflichtigen APIs.**
- **Kein Supabase, kein Vercel** — Anforderung von Michael, weniger
  Account-Komplexität.
- **Hosting: GitHub Pages** (kostenlos, statisch, mit GitHub-Account vorhanden).
- **Code-Basis:** Von Null aufgebaut. Eine AI-Studio-Codebase war als
  Ausgangspunkt geplant, wurde aber verworfen (Michael: "mach wie du meinst").

---

## 3. Stack

| Schicht         | Technologie                          | Frei?              |
|-----------------|--------------------------------------|--------------------|
| Build-Tool      | **Vite 7**                           | ja, Open Source    |
| Frontend        | **React 19 + TypeScript**            | ja, Open Source    |
| Routing         | **React Router 7**                   | ja, Open Source    |
| Styling         | **Tailwind CSS 4** (mit Dark Mode)   | ja, Open Source    |
| Bildanzeige     | Plain `<img>`-Element                | ja                 |
| Bildquelle      | **Lokale Bilder** in `public/locations/` (JPG/PNG, mit metadata.json) | ja |
| Rate-Karte      | **MapLibre GL JS** + OSM-Tiles       | ja, kein Key       |
| "Datenbank"     | **`localStorage`** im Browser        | ja, kein Server    |
| Hosting         | **GitHub Pages**                     | ja                 |
| Musik (später)  | **Suno**-AI-generierte MP3-Dateien   | ja (Free-Plan)     |

### Warum Vite + React statt Next.js?

- GitHub Pages ist statisches Hosting → Vite buildet zu plain HTML/CSS/JS,
  keine Server-Komponenten / API-Routes nötig
- Next.js wäre jetzt Overkill (wir haben kein Backend mehr)
- Vite startet schneller im Dev-Modus, einfachere Konfiguration
- React 19 + TypeScript für sauberen Spielzustand (5 Runden, Scoring, Theme)

### Warum kein Backend / kein Supabase?

Michael will die Account-Komplexität rausnehmen. Folgen:
- **Highscore nur lokal** (`localStorage`) — kein globales Leaderboard.
  Ist für Phase 1 ok, kann in Phase 3 nachgerüstet werden, wenn er es will.
- **Keine API-Routes** — alles läuft client-seitig.
- **Kein Server-Validation** — Anti-Cheat = nicht Phase 1.

### Warum GitHub Pages statt Vercel?

- Michael will keinen Vercel-Account dafür.
- GitHub-Account hat er. Mit `gh-pages`-Branch oder GitHub Actions deployen.
- Statisches Hosting reicht, weil keine Server-Logik nötig ist.

### Warum lokale Bilder statt Mapillary / Street View?

- **Komplett offline-fähig & ohne API** — kein Token, kein Service-Limit
- **Maximale Kontrolle** über Bildqualität und Kuratierung
- **Schnelles Laden** (statisch ausgeliefert, von GitHub-Pages-CDN)
- **Trade-off:** kein interaktives 360°-Panorama. Spieler sieht nur ein Standbild
  pro Runde. Das ist weniger "GeoGuessr-like", aber für ein Schülerprojekt
  völlig ausreichend und macht die Implementierung dramatisch einfacher.
- **Bildquelle:** Michael liefert die Bilder ins Repo (eigene Fotos,
  CC-BY-Bilder von Wikimedia Commons, AI-generiert mit Standortbezug, …).
  Pro Bild: Dateiname + reale Lat/Lng + Label.

---

## 4. Free-Tier-Limits (Stand 2026-05)

### GitHub Pages
- Soft-Limit: 100 GB Bandbreite / Monat, max. 1 GB Repo-Größe
- Build-Limit: 10 Builds / Stunde
- Reicht für ein Schülerprojekt locker

### OSM-Tiles
- Tile Usage Policy: faire Nutzung, keine harte Grenze
- Bei viel Traffic später eigenen Tile-Server / MapTiler Free-Tier

### Suno
- Free-Plan: 50 Songs / Monat (Stand 2026)
- Lizenz: Free-Tier-Songs sind **CC-BY-NC** — nur non-commercial nutzbar.
  Passt zum Schülerprojekt, aber wenn Werbung dazukommt, brauchen wir Pro.

---

## 5. Phase 1 — MVP-Scope

### Entscheidungen (mit Michael abgestimmt)

| Frage                  | Antwort                                              |
|------------------------|------------------------------------------------------|
| Login?                 | **Nein** — nicht mehr nötig (kein Backend)           |
| Highscore-Speicherung? | **`localStorage`** lokal                             |
| Region?                | **Weltweit** (kuratiert)                             |
| UI-Sprache & Code?     | **Deutsch**                                          |
| Bildquelle             | **Lokale Bilder im Repo** (`public/locations/`)      |
| Rate-Karte             | **MapLibre + OSM**                                   |
| Hosting                | **GitHub Pages**                                     |
| Musik                  | **Suno**-AI-generiert                                |
| Theme                  | **Dark + Light Mode** (umschaltbar)                  |
| Rechtsseiten           | **Datenschutz + Impressum** (DSGVO-Pflicht)          |
| Musik                  | **Verschoben** — kommt in Phase 1.5, sobald Tracks da |

### Features

- [ ] Startseite mit Button "Spiel starten" + Nickname-Eingabe (optional)
- [ ] 5 Runden pro Spiel
- [ ] Pro Runde: Standbild der Location (links) + Weltkarte zum Tippen (rechts)
- [ ] Button "Tipp abgeben" → zeigt Distanz + Punkte für die Runde
- [ ] Nach Runde 5: **Victory-Screen** mit Endscore + Animation
- [ ] **Highscore-Liste lokal** (`localStorage`, Top 10 dieses Browsers)
- [ ] ~~**Hintergrundmusik** (Suno-Tracks, Mute-Toggle)~~ — auf Phase 1.5 verschoben, Tracks noch nicht generiert
- [ ] **Dark/Light-Mode-Toggle**, Auswahl in `localStorage` merken
- [ ] **Datenschutz**-Seite (was wird gespeichert: nichts außer localStorage)
- [ ] **Impressum**-Seite (Schüler-Impressum mit Name + Kontakt)

### Bewusst NICHT in Phase 1

- Globales Multiplayer-Leaderboard (kein Backend)
- Login / User-Accounts
- Multiplayer
- Mobile-optimiertes UI
- Schwierigkeitsgrade
- Zeitlimit pro Runde

---

## 6. Architektur

### Verzeichnisstruktur — vorläufig (final, sobald AI-Studio-Code da)

```
geolater/
├── plan.md                     ← dieses Dokument
├── README.md                   ← für GitHub
├── LICENSE                     ← MIT o.ä.
├── .github/
│   └── workflows/
│       └── deploy.yml          ← Auto-Deploy auf GitHub Pages
├── public/
│   ├── locations/              ← Standortbilder (JPG/PNG)
│   │   ├── berlin-01.jpg
│   │   ├── paris-01.jpg
│   │   └── ...
│   └── musik/                  ← Phase 1.5
│       └── (leer, kommt später)
├── src/
│   ├── pages/
│   │   ├── Start              ← Nickname + Start-Button
│   │   ├── Spiel              ← Hauptspiel (5 Runden)
│   │   ├── Victory            ← End-/Sieges-Screen
│   │   ├── Highscore          ← Lokale Top-10
│   │   ├── Datenschutz        ← Privacy
│   │   └── Impressum          ← Imprint
│   ├── components/
│   │   ├── BildPanel          ← Bild der Location
│   │   ├── GuessMap           ← MapLibre + Click
│   │   ├── RoundResult        ← Distanz/Punkte
│   │   ├── VictoryScreen      ← Animierter Endscreen
│   │   ├── MusicPlayer        ← Phase 1.5 (leer reserviert)
│   │   └── ThemeToggle        ← Dark/Light
│   ├── lib/
│   │   ├── locations.ts       ← Pool laden + zufällig ziehen
│   │   ├── scoring.ts         ← Haversine + Punkte
│   │   ├── highscore.ts       ← localStorage R/W
│   │   └── theme.ts           ← Dark/Light State
│   └── data/
│       └── locations.json     ← Bild-Metadaten (Datei + Lat/Lng + Label)
└── (kein .env nötig — keine API-Keys mehr!)
```

### "Datenbank" — `localStorage`

Statt SQL-Tabelle:

```ts
// Schlüssel: "geolater:scores"
type StoredScore = {
  nickname: string;
  totalPoints: number;
  rounds: Array<{ distanceKm: number; points: number; locationLabel: string }>;
  playedAt: string; // ISO
};

// Wir speichern Array von StoredScore, sortiert nach totalPoints desc, max 10
```

```ts
// Schlüssel: "geolater:settings"
type Settings = {
  theme: "dark" | "light";
  musicMuted: boolean;
  musicVolume: number; // 0..1
};
```

### Scoring-Formel

```ts
const points = Math.round(5000 * Math.exp(-distanceKm / 2000));
// 0 km → 5000, 1000 km → ~3032, 5000 km → ~410, 20000 km → ~0
// Maximum pro Spiel: 25.000 Punkte
```

### Location-Pool (lokale Bilder)

```json
[
  {
    "image": "berlin-01.jpg",
    "lat": 52.5163,
    "lng": 13.3777,
    "label": "Berlin, Deutschland",
    "credit": "Foto: Wikimedia Commons / CC-BY-SA 4.0"
  }
]
```

Pro Runde: zufällig einen Eintrag ziehen, `image` aus `public/locations/`
laden, Lat/Lng als "echte Position" für Distanzberechnung.

**Aufbau:** ~20–50 Bilder, manuell kuratiert. Quellen z. B.
- Wikimedia Commons (CC-BY oder CC-BY-SA, Attribution beachten)
- Eigene Fotos
- AI-generierte Bilder mit Standortbezug

Mischung pro Kontinent (Vorschlag, kann Michael anpassen):
- Europa: 10 · Nordamerika: 5 · Südamerika: 3 · Asien: 7 · Afrika: 3 · Ozeanien: 2

---

## 7. Aufgabenliste (Phase 1)

| # | Aufgabe                              | Wer      | Status      |
|---|--------------------------------------|----------|-------------|
| 3 | Stack in plan.md konsolidieren       | Claude   | erledigt    |
|12 | GitHub-Repo + Pages-Deployment       | Claude   | in Arbeit   |
|13 | Vite + React + TS + Tailwind scaffolden | Claude| offen       |
| 4 | Location-Pool & Bilder kuratieren    | Michael+C| offen       |
| 5 | Game-UI bauen (Split-Screen)         | Claude   | offen       |
| 6 | Scoring + Rundenlogik                | Claude   | offen       |
| 7 | Lokale Highscore-Liste               | Claude   | offen       |
| 8 | Victory-Screen                       | Claude   | offen       |
| 9 | Dark/Light-Mode                      | Claude   | offen       |
|11 | Datenschutz + Impressum              | Claude   | offen       |
|10 | Musik-Player (Phase 1.5)             | Claude+M | verschoben  |

---

## 8. Roadmap (nach MVP)

### Phase 2 — Politur
- Mobile-optimiertes UI
- Zeitlimit pro Runde (optional)
- "Bewegung erlaubt / verboten"-Modus
- Animationen polieren

### Phase 3 — Globales Leaderboard (optional)
- Falls Michael es will: leichtes Backend
  (z. B. Cloudflare Workers Free + KV oder GitHub Issues als Quasi-DB)
- Validierung server-seitig

### Phase 4 — Multiplayer
- WebRTC oder leichter WebSocket-Server
- Räume mit Code

### Phase 5 — Custom Content
- Eigene Location-Sets
- Themen-Maps

---

## 9. Datenschutz / Impressum (Phase 1)

### Was wird gespeichert?
- **Im Browser (`localStorage`):** Nickname, Highscores, Theme-Wahl,
  Musik-Lautstärke. Verlässt das Gerät nie.
- **Server-seitig:** nichts. Wir haben keinen Server.
- **Cookies:** keine.
- **Tracking:** keines.

### Drittanbieter
- **OpenStreetMap-Tile-Server** lädt Karten-Tiles → IP wird an OSM übermittelt
- **GitHub Pages** loggt IPs beim Seitenaufruf

→ Diese Drittanbieter müssen in der Datenschutzerklärung erwähnt werden.
Bilder kommen direkt aus dem Repo (kein externer Image-Service).

### Impressum (Schüler)

Verantwortlich i.S.d. § 5 DDG / § 18 Abs. 2 MStV:

```
Stefan Waßmann
Quellweg 36A
15345 Rehfelde
Deutschland

E-Mail: st.ar.wassmann@gmx.de
```

Hinweis: "Privates Schülerprojekt, nicht kommerziell."

> Stefan Waßmann ist als ladungsfähige Kontaktperson eingetragen, da Michael
> minderjährig ist. So in Impressum-Page einbauen.

---

## 10. Offene Fragen / Risiken

- [ ] **Bild-Lizenzen sauber dokumentieren** — pro Bild Quelle + Lizenz
      im `credit`-Feld der locations.json (wichtig bei Wikimedia-Bildern)
- [ ] **Suno-Lizenz** — Free-Tier ist CC-BY-NC, später Namensnennung im Impressum
- [x] ~~Adresse fürs Impressum~~ → Stefan Waßmann, Rehfelde (entschieden)
- [ ] **Anti-Cheat** — Phase 1 ignorieren (kein Backend ohnehin)

---

## 11. Designnotizen

> Dieser Abschnitt wird von Michael befüllt, während er die UI designt.

(Platzhalter — Mockups, Farbpalette, Logo-Ideen, Suno-Track-Stil hier ergänzen)
