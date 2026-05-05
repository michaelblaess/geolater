import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clearScores, loadScores } from "../lib/highscore";
import type { StoredScore } from "../lib/types";

export function Highscore() {
  const [scores, setScores] = useState<StoredScore[]>([]);

  useEffect(() => {
    setScores(loadScores());
  }, []);

  function handleReset() {
    if (!confirm("Wirklich alle lokalen Highscores loeschen?")) return;
    clearScores();
    setScores([]);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Highscore (lokal)</h1>
        {scores.length > 0 ? (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
          >
            Liste loeschen
          </button>
        ) : null}
      </div>

      {scores.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-600 dark:text-stone-400">
            Noch keine Spiele gespielt. Los geht's!
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-xl bg-sky-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-sky-700"
          >
            Zum Start
          </Link>
        </div>
      ) : (
        <ol className="divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
          {scores.map((s, i) => (
            <li key={s.playedAt} className="flex items-center gap-4 px-4 py-3">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                i === 0
                  ? "bg-amber-300 text-amber-900"
                  : i === 1
                    ? "bg-stone-300 text-stone-800"
                    : i === 2
                      ? "bg-orange-300 text-orange-900"
                      : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
              }`}>
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{s.nickname}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {new Date(s.playedAt).toLocaleString("de-DE")}
                </p>
              </div>
              <p className="text-right font-bold text-sky-600 dark:text-sky-400">
                {s.totalPoints.toLocaleString("de-DE")}
              </p>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-6 text-sm text-stone-500 dark:text-stone-500">
        Diese Liste wird ausschliesslich in deinem Browser gespeichert (localStorage).
        Sie verlaesst dein Geraet nicht.
      </p>
    </div>
  );
}
