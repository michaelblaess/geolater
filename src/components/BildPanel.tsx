import type { Location } from "../lib/types";
import { imageUrl } from "../lib/locations";

type Props = {
  location: Location;
  roundIndex: number;
  totalRounds: number;
};

export function BildPanel({ location, roundIndex, totalRounds }: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900">
      <img
        src={imageUrl(location.image)}
        alt={`Standortbild Runde ${roundIndex + 1}`}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
        Runde {roundIndex + 1} / {totalRounds}
      </div>
    </div>
  );
}
