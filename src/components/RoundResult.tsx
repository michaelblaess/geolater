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
    <div className="animate-fade-up rounded-2xl border border-stone-200 bg-white p-5 shadow-xl ring-1 ring-stone-900/5 dark:border-stone-800 dark:bg-stone-900 dark:ring-white/5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold">
          <span className="text-gradient-brand">{points.toLocaleString("de-DE")}</span>{" "}
          <span className="text-stone-700 dark:text-stone-300">Punkte</span>
        </h2>
        <span className="text-sm text-stone-500 dark:text-stone-400">
          {formatDistance(distanceKm)} entfernt
        </span>
      </div>
      <p className="mb-4 text-stone-700 dark:text-stone-300">
        Das war: <strong>{location.label}</strong>
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-sky-700 hover:to-sky-600 active:scale-[0.99]"
      >
        {isLastRound ? "Endergebnis ansehen" : "Nächste Runde"}
      </button>
    </div>
  );
}
