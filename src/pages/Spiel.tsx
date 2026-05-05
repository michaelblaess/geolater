import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BildPanel } from "../components/BildPanel";
import { GuessMap } from "../components/GuessMap";
import { RoundResult } from "../components/RoundResult";
import { pickRandomLocations } from "../lib/locations";
import { haversineKm, pointsFromDistance } from "../lib/scoring";
import { debugGroup, debugLog, isDebugActive } from "../lib/debug";
import type { GameResult, Location, Round } from "../lib/types";

const TOTAL_ROUNDS = 5;

type Phase = "guessing" | "result";

export function Spiel() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const stateNickname =
    (routerLocation.state as { nickname?: string } | null)?.nickname ?? "Anonym";

  // Locations werden nur einmal beim Mount gezogen
  const locations = useMemo<Location[]>(() => {
    const picked = pickRandomLocations(TOTAL_ROUNDS);
    debugGroup("Spiel gestartet", () => {
      debugLog("Spieler", stateNickname);
      debugLog("Gezogene Locations", picked);
    });
    return picked;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null);
  const [phase, setPhase] = useState<Phase>("guessing");
  const [completedRounds, setCompletedRounds] = useState<Round[]>([]);
  const [currentResult, setCurrentResult] = useState<{
    distanceKm: number;
    points: number;
  } | null>(null);

  const current = locations[roundIndex];

  // Beim Wechsel der Runde loggen
  useEffect(() => {
    if (current === undefined) return;
    debugLog(`Runde ${roundIndex + 1} beginnt`, {
      label: current.label,
      lat: current.lat,
      lng: current.lng,
      image: current.image,
    });
  }, [roundIndex, current]);

  function handleSubmit() {
    if (guess === null) return;
    const distanceKm = haversineKm(guess.lat, guess.lng, current.lat, current.lng);
    const points = pointsFromDistance(distanceKm);
    debugGroup(`Runde ${roundIndex + 1} ausgewertet`, () => {
      debugLog("Tipp", guess);
      debugLog("Wahrheit", { lat: current.lat, lng: current.lng });
      debugLog("Distanz (km)", distanceKm);
      debugLog("Punkte", points);
    });
    setCurrentResult({ distanceKm, points });
    setPhase("result");
  }

  function handleContinue() {
    if (currentResult === null) return;
    const finishedRound: Round = {
      location: current,
      guessLat: guess?.lat ?? 0,
      guessLng: guess?.lng ?? 0,
      distanceKm: currentResult.distanceKm,
      points: currentResult.points,
    };
    const nextCompleted = [...completedRounds, finishedRound];

    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      const result: GameResult = {
        nickname: stateNickname,
        totalPoints: nextCompleted.reduce((sum, r) => sum + r.points, 0),
        rounds: nextCompleted,
        playedAt: new Date().toISOString(),
      };
      debugLog("Spiel beendet", { totalPoints: result.totalPoints, rounds: result.rounds.length });
      navigate("/victory", { state: { result } });
      return;
    }

    setCompletedRounds(nextCompleted);
    setRoundIndex(roundIndex + 1);
    setGuess(null);
    setCurrentResult(null);
    setPhase("guessing");
  }

  // Debug-Funktion: Runde mit 0 Punkten ueberspringen
  function handleDebugSkip() {
    if (current === undefined) return;
    const skippedRound: Round = {
      location: current,
      guessLat: 0,
      guessLng: 0,
      distanceKm: -1,
      points: 0,
    };
    const nextCompleted = [...completedRounds, skippedRound];
    debugLog(`Runde ${roundIndex + 1} uebersprungen (DEBUG)`);

    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      const result: GameResult = {
        nickname: stateNickname,
        totalPoints: nextCompleted.reduce((sum, r) => sum + r.points, 0),
        rounds: nextCompleted,
        playedAt: new Date().toISOString(),
      };
      navigate("/victory", { state: { result } });
      return;
    }

    setCompletedRounds(nextCompleted);
    setRoundIndex(roundIndex + 1);
    setGuess(null);
    setCurrentResult(null);
    setPhase("guessing");
  }

  useEffect(() => {
    if (locations.length === 0) {
      navigate("/");
    }
  }, [locations, navigate]);

  const isLastRound = roundIndex + 1 >= TOTAL_ROUNDS;
  const totalSoFar = completedRounds.reduce((sum, r) => sum + r.points, 0);
  const debug = isDebugActive();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-stone-600 dark:text-stone-400">
          Spieler: <strong className="text-stone-900 dark:text-stone-100">{stateNickname}</strong>
        </span>
        <span className="text-stone-600 dark:text-stone-400">
          Punkte bisher:{" "}
          <strong className="text-stone-900 dark:text-stone-100">
            {totalSoFar.toLocaleString("de-DE")}
          </strong>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[42vh] sm:h-[50vh] lg:h-[70vh]">
          <BildPanel
            location={current}
            roundIndex={roundIndex}
            totalRounds={TOTAL_ROUNDS}
          />
        </div>
        <div className="h-[42vh] sm:h-[50vh] lg:h-[70vh]">
          <GuessMap
            guess={guess}
            truth={phase === "result" ? { lat: current.lat, lng: current.lng } : null}
            debugTruth={
              debug && phase === "guessing" ? { lat: current.lat, lng: current.lng } : null
            }
            onMapClick={phase === "guessing" ? (lat, lng) => setGuess({ lat, lng }) : null}
          />
        </div>
      </div>

      {phase === "guessing" ? (
        <div className="flex flex-wrap items-center justify-end gap-3">
          {debug ? (
            <button
              type="button"
              onClick={handleDebugSkip}
              className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900"
            >
              Runde überspringen (DEBUG)
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={guess === null}
            className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:from-sky-700 hover:to-sky-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-stone-400 disabled:to-stone-400 disabled:shadow-none sm:w-auto dark:disabled:from-stone-700 dark:disabled:to-stone-700"
          >
            Tipp abgeben
          </button>
        </div>
      ) : currentResult !== null ? (
        <RoundResult
          location={current}
          distanceKm={currentResult.distanceKm}
          points={currentResult.points}
          isLastRound={isLastRound}
          onContinue={handleContinue}
        />
      ) : null}
    </div>
  );
}
