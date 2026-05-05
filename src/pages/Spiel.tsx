import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BildPanel } from "../components/BildPanel";
import { GuessMap } from "../components/GuessMap";
import { RoundResult } from "../components/RoundResult";
import { pickRandomLocations } from "../lib/locations";
import { haversineKm, pointsFromDistance } from "../lib/scoring";
import type { GameResult, Location, Round } from "../lib/types";

const TOTAL_ROUNDS = 5;

type Phase = "guessing" | "result";

export function Spiel() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const stateNickname =
    (routerLocation.state as { nickname?: string } | null)?.nickname ?? "Anonym";

  // Locations werden nur einmal beim Mount gezogen
  const locations = useMemo<Location[]>(() => pickRandomLocations(TOTAL_ROUNDS), []);

  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null);
  const [phase, setPhase] = useState<Phase>("guessing");
  const [completedRounds, setCompletedRounds] = useState<Round[]>([]);

  const current = locations[roundIndex];

  // Berechne Resultat fuer diese Runde, sobald getippt + abgegeben
  const [currentResult, setCurrentResult] = useState<{
    distanceKm: number;
    points: number;
  } | null>(null);

  function handleSubmit() {
    if (guess === null) return;
    const distanceKm = haversineKm(guess.lat, guess.lng, current.lat, current.lng);
    const points = pointsFromDistance(distanceKm);
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
      navigate("/victory", { state: { result } });
      return;
    }

    setCompletedRounds(nextCompleted);
    setRoundIndex(roundIndex + 1);
    setGuess(null);
    setCurrentResult(null);
    setPhase("guessing");
  }

  // Falls direkt /spiel ohne Nickname-State aufgerufen wird, Locations existieren immer
  useEffect(() => {
    if (locations.length === 0) {
      navigate("/");
    }
  }, [locations, navigate]);

  const isLastRound = roundIndex + 1 >= TOTAL_ROUNDS;
  const totalSoFar = completedRounds.reduce((sum, r) => sum + r.points, 0);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-stone-600 dark:text-stone-400">
          Spieler: <strong className="text-stone-900 dark:text-stone-100">{stateNickname}</strong>
        </span>
        <span className="text-stone-600 dark:text-stone-400">
          Punkte bisher: <strong className="text-stone-900 dark:text-stone-100">
            {totalSoFar.toLocaleString("de-DE")}
          </strong>
        </span>
      </div>

      <div className="grid h-[70vh] grid-cols-1 gap-4 lg:grid-cols-2">
        <BildPanel
          location={current}
          roundIndex={roundIndex}
          totalRounds={TOTAL_ROUNDS}
        />
        <GuessMap
          guess={guess}
          truth={phase === "result" ? { lat: current.lat, lng: current.lng } : null}
          onMapClick={phase === "guessing" ? (lat, lng) => setGuess({ lat, lng }) : null}
        />
      </div>

      {phase === "guessing" ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={guess === null}
          className="self-end rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow hover:bg-sky-700 active:bg-sky-800 disabled:cursor-not-allowed disabled:bg-stone-400 dark:disabled:bg-stone-700"
        >
          Tipp abgeben
        </button>
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
