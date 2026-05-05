import locationsData from "../data/locations.json";
import type { Location } from "./types";

const LOCATIONS = locationsData as Location[];

// Gibt eine zufaellige, nicht-wiederholende Auswahl von n Locations zurueck
export function pickRandomLocations(n: number): Location[] {
  if (n >= LOCATIONS.length) {
    return [...LOCATIONS].sort(() => Math.random() - 0.5);
  }
  const pool = [...LOCATIONS];
  const out: Location[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return out;
}

// Gesamtzahl der verfuegbaren Locations (fuer Anzeige im UI)
export function totalLocations(): number {
  return LOCATIONS.length;
}

// Gibt den Pfad zum Bild zurueck (Pfad-Praefix inkl. Vite base)
export function imageUrl(image: string): string {
  return `${import.meta.env.BASE_URL}locations/${image}`;
}
