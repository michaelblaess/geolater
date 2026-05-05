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

export function totalLocations(): number {
  return LOCATIONS.length;
}

// Nimmt eine externe URL direkt; bei lokalem Dateinamen wird BASE_URL vorangestellt.
export function imageUrl(image: string): string {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${import.meta.env.BASE_URL}locations/${image}`;
}
