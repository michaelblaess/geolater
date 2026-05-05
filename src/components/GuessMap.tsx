import { useEffect, useRef } from "react";
import maplibregl, { type Map as MapLibreMap, type Marker, type LngLatLike } from "maplibre-gl";

type Props = {
  // Tipp-Marker (klickbar setzen). null = noch kein Tipp.
  guess: { lat: number; lng: number } | null;
  // Wahre Position (wird erst nach Tipp-Abgabe sichtbar). null = nicht zeigen.
  truth?: { lat: number; lng: number } | null;
  // Klick-Handler — null bedeutet "Karte ist gelockt"
  onMapClick: ((lat: number, lng: number) => void) | null;
};

const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap-Mitwirkende",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

export function GuessMap({ guess, truth, onMapClick }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const guessMarkerRef = useRef<Marker | null>(null);
  const truthMarkerRef = useRef<Marker | null>(null);
  const lineSourceAdded = useRef(false);
  const onMapClickRef = useRef(onMapClick);

  // Ref aktuell halten, damit der einmal registrierte Listener immer den aktuellen Handler nutzt
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Karte einmalig initialisieren
  useEffect(() => {
    if (containerRef.current === null || mapRef.current !== null) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: [10, 30],
      zoom: 1.2,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.on("click", (e) => {
      const handler = onMapClickRef.current;
      if (handler === null) return;
      handler(e.lngLat.lat, e.lngLat.lng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Tipp-Marker aktualisieren
  useEffect(() => {
    const map = mapRef.current;
    if (map === null) return;

    if (guess === null) {
      if (guessMarkerRef.current !== null) {
        guessMarkerRef.current.remove();
        guessMarkerRef.current = null;
      }
      return;
    }

    const lngLat: LngLatLike = [guess.lng, guess.lat];
    if (guessMarkerRef.current === null) {
      guessMarkerRef.current = new maplibregl.Marker({ color: "#0ea5e9" })
        .setLngLat(lngLat)
        .addTo(map);
    } else {
      guessMarkerRef.current.setLngLat(lngLat);
    }
  }, [guess]);

  // Wahrheits-Marker + Linie aktualisieren
  useEffect(() => {
    const map = mapRef.current;
    if (map === null) return;

    if (truthMarkerRef.current !== null) {
      truthMarkerRef.current.remove();
      truthMarkerRef.current = null;
    }
    if (lineSourceAdded.current && map.getLayer("guess-line") !== undefined) {
      map.removeLayer("guess-line");
    }
    if (lineSourceAdded.current && map.getSource("guess-line") !== undefined) {
      map.removeSource("guess-line");
      lineSourceAdded.current = false;
    }

    if (truth === undefined || truth === null) return;

    truthMarkerRef.current = new maplibregl.Marker({ color: "#16a34a" })
      .setLngLat([truth.lng, truth.lat])
      .addTo(map);

    if (guess !== null) {
      const ensureSource = () => {
        if (map.getSource("guess-line") !== undefined) return;
        map.addSource("guess-line", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [guess.lng, guess.lat],
                [truth.lng, truth.lat],
              ],
            },
          },
        });
        map.addLayer({
          id: "guess-line",
          type: "line",
          source: "guess-line",
          paint: {
            "line-color": "#dc2626",
            "line-width": 2,
            "line-dasharray": [2, 2],
          },
        });
        lineSourceAdded.current = true;
      };

      if (map.isStyleLoaded()) {
        ensureSource();
      } else {
        map.once("load", ensureSource);
      }

      // Auf beide Punkte zoomen
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([guess.lng, guess.lat]);
      bounds.extend([truth.lng, truth.lat]);
      map.fitBounds(bounds, { padding: 60, maxZoom: 8, duration: 800 });
    }
  }, [truth, guess]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800">
      <div ref={containerRef} className="h-full w-full" />
      {onMapClick !== null && guess === null ? (
        <div className="pointer-events-none absolute inset-x-0 top-3 mx-auto w-fit rounded-full bg-black/60 px-4 py-1 text-sm text-white backdrop-blur-sm">
          Klicke auf die Karte, um zu raten
        </div>
      ) : null}
    </div>
  );
}
