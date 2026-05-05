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
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-lg dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold">{points.toLocaleString("de-DE")} Punkte</h2>
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
        className="w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white shadow hover:bg-sky-700 active:bg-sky-800"
      >
        {isLastRound ? "Endergebnis ansehen" : "Naechste Runde"}
      </button>
    </div>
  );
}
