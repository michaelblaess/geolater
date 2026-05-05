import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { totalLocations } from "../lib/locations";

const NICKNAME_KEY = "geolater:lastNickname";

export function Start() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(() => {
    try {
      return localStorage.getItem(NICKNAME_KEY) ?? "";
    } catch {
      return "";
    }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nickname.trim().slice(0, 30);
    const finalName = trimmed.length > 0 ? trimmed : "Anonym";
    try {
      localStorage.setItem(NICKNAME_KEY, finalName);
    } catch {
      // ignorieren
    }
    navigate("/spiel", { state: { nickname: finalName } });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center">
      <h1 className="mb-3 text-5xl font-extrabold tracking-tight">
        geo<span className="text-sky-500">later</span>
      </h1>
      <p className="mb-10 text-lg text-stone-600 dark:text-stone-400">
        Du siehst ein Bild — wo wurde es aufgenommen? Klicke auf die Karte und rate die
        Position. Je naeher dein Tipp, desto mehr Punkte. 5 Runden, max. 25.000 Punkte.
      </p>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname (optional)"
          maxLength={30}
          className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-base shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-stone-700 dark:bg-stone-900"
        />
        <button
          type="submit"
          className="rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-sky-700 active:bg-sky-800"
        >
          Spiel starten
        </button>
      </form>

      <p className="mt-8 text-sm text-stone-500 dark:text-stone-500">
        {totalLocations()} Standorte verfuegbar — Bilder werden zufaellig gezogen.
      </p>
    </div>
  );
}
