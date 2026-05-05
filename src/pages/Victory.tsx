import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { saveScore, loadScores } from "../lib/highscore";
import { formatDistance } from "../lib/scoring";
import type { GameResult, StoredScore } from "../lib/types";

export function Victory() {
  const navigate = useNavigate();
  const routerLoc = useLocation();
  const result = (routerLoc.state as { result?: GameResult } | null)?.result;

  // Wenn die Seite direkt ohne Spielergebnis aufgerufen wird, zurueck zur Startseite
  useEffect(() => {
    if (result === undefined) {
      navigate("/", { replace: true });
    }
  }, [result, navigate]);

  // Score genau einmal speichern, wenn das Result da ist
  const [savedScores, setSavedScores] = useState<StoredScore[] | null>(null);
  useEffect(() => {
    if (result === undefined || savedScores !== null) return;
    setSavedScores(saveScore(result));
  }, [result, savedScores]);

  const rank = useMemo(() => {
    if (savedScores === null || result === undefined) return null;
    const idx = savedScores.findIndex(
      (s) => s.playedAt === result.playedAt && s.totalPoints === result.totalPoints,
    );
    return idx >= 0 ? idx + 1 : null;
  }, [savedScores, result]);

  if (result === undefined) return null;

  // Bewertung des Endscores fuer eine sinnvolle Ueberschrift
  const ratio = result.totalPoints / 25000;
  let headline = "Geschafft!";
  if (ratio >= 0.8) headline = "Weltreisender!";
  else if (ratio >= 0.5) headline = "Gut gespielt!";
  else if (ratio >= 0.2) headline = "Solide Runde!";
  else headline = "Noch ein Versuch?";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-xl dark:border-stone-800 dark:bg-stone-900">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-widest text-sky-600 dark:text-sky-400">
            Endergebnis
          </p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight">{headline}</h1>
          <p className="mt-2 text-lg text-stone-600 dark:text-stone-400">
            <strong>{result.nickname}</strong> hat insgesamt
          </p>
          <p className="my-4 text-7xl font-extrabold text-sky-600 dark:text-sky-400">
            {result.totalPoints.toLocaleString("de-DE")}
          </p>
          <p className="text-stone-600 dark:text-stone-400">
            Punkte erreicht (von 25.000 moeglichen).
            {rank !== null ? (
              <>
                {" "}
                Lokaler Highscore-Platz: <strong>#{rank}</strong>
              </>
            ) : null}
          </p>
        </div>

        <div className="mb-6 space-y-2">
          <h2 className="text-lg font-semibold">Deine Runden</h2>
          <ul className="divide-y divide-stone-200 dark:divide-stone-800">
            {result.rounds.map((r, i) => (
              <li key={i} className="flex items-center justify-between py-2">
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-sm font-bold dark:bg-stone-800">
                    {i + 1}
                  </span>
                  <span className="text-stone-700 dark:text-stone-300">{r.location.label}</span>
                </span>
                <span className="text-right text-sm">
                  <span className="block font-semibold">
                    {r.points.toLocaleString("de-DE")} Pkt
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {formatDistance(r.distanceKm)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/spiel", { state: { nickname: result.nickname } })}
            className="flex-1 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow hover:bg-sky-700 active:bg-sky-800"
          >
            Nochmal spielen
          </button>
          <Link
            to="/highscore"
            className="flex-1 rounded-xl border border-stone-300 px-6 py-3 text-center font-semibold hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
          >
            Highscore-Liste
          </Link>
        </div>
      </div>
    </div>
  );
}

// Hilfsfunktion, damit loadScores oben geladen wird (Tree-Shaking-Schutz);
// in der Praxis wird saveScore aufgerufen, was loadScores bereits intern nutzt.
void loadScores;
