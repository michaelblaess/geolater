import { formatDistance } from "../lib/scoring";
import type { Location } from "../lib/types";

type Props = {
  location: Location;
  distanceKm: number;
  points: number;
  isLastRound: boolean;
  onContinue: () => void;
};

export function RoundResult({ location, distanceKm, points, isLastRound, onContinue }: Props) {
  return (
    <div className="animate-rise relative w-full overflow-hidden border border-ink/15 bg-cream-deep/80 backdrop-blur">
      <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        {/* Punkte */}
        <div className="border-b border-ink/10 pb-4 sm:border-b-0 sm:border-r sm:pr-6 sm:pb-0">
          <p className="small-caps text-[10px] text-rust">Etappenwertung</p>
          <p className="mt-1 font-headline text-5xl font-semibold tracking-tight text-ink">
            {points.toLocaleString("de-DE")}
          </p>
          <p className="mt-1 small-caps text-[10px] text-ink-soft">Punkte</p>
        </div>

        {/* Mittlere Spalte: Ort + Distanz */}
        <div>
          <p className="small-caps text-[10px] text-ink-soft">Das war</p>
          <p className="mt-1 font-headline text-2xl italic leading-tight text-ink">
            {location.label}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            <span className="small-caps text-[10px]">Distanz</span>
            <span className="mx-2 text-ink/30">·</span>
            <span className="font-display">{formatDistance(distanceKm)}</span>
          </p>
        </div>

        {/* Aktion */}
        <button
          type="button"
          onClick={onContinue}
          className="group inline-flex items-center justify-center gap-3 self-stretch bg-ink px-6 py-4 text-cream transition-colors hover:bg-rust active:translate-y-px"
        >
          <span className="small-caps text-xs">
            {isLastRound ? "Endergebnis" : "Weiter"}
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </button>
      </div>
    </div>
  );
}
