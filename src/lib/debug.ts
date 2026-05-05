// Debug-Mode wird ueber URL ?debug=1 oder localStorage aktiviert.
// Wenn aktiv, gibt das Spiel Statusinformationen in der Browser-Konsole aus.

const STORAGE_KEY = "geolater:debug";
const URL_PARAM = "debug";

// Liest URL- oder localStorage-Flag und persistiert die Wahl
export function initDebugFromUrl(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has(URL_PARAM)) {
      const value = params.get(URL_PARAM);
      const enable = value === "1" || value === "true";
      localStorage.setItem(STORAGE_KEY, enable ? "1" : "0");
      return enable;
    }
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

// Singleton-Status fuer den aktuellen Run
let active = false;

export function setDebugActive(value: boolean): void {
  active = value;
}

export function isDebugActive(): boolean {
  return active;
}

// Praegnante Console-Logs mit gemeinsamem Prefix
export function debugLog(label: string, data?: unknown): void {
  if (!active) return;
  if (data === undefined) {
    console.log(`%c[geolater]%c ${label}`, "color:#0ea5e9;font-weight:bold", "color:inherit");
  } else {
    console.log(`%c[geolater]%c ${label}`, "color:#0ea5e9;font-weight:bold", "color:inherit", data);
  }
}

export function debugGroup(label: string, run: () => void): void {
  if (!active) {
    run();
    return;
  }
  console.group(`%c[geolater]%c ${label}`, "color:#0ea5e9;font-weight:bold", "color:inherit");
  try {
    run();
  } finally {
    console.groupEnd();
  }
}
