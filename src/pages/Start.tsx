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
    <div className="hero-bg relative overflow-hidden">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <span className="animate-fade-up rounded-full border border-sky-200 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-sky-700 shadow-sm backdrop-blur dark:border-sky-900 dark:bg-stone-900/70 dark:text-sky-300">
          Schülerprojekt &middot; F2P &middot; Open Source
        </span>

        <h1 className="animate-fade-up mt-6 text-6xl font-black tracking-tight sm:text-7xl">
          geo<span className="text-gradient-brand">later</span>
        </h1>

        <p className="animate-fade-up-delay mt-6 max-w-xl text-lg text-stone-600 dark:text-stone-400">
          Du siehst ein Bild — wo wurde es aufgenommen? Klicke auf die Karte und rate die
          Position. Je näher dein Tipp, desto mehr Punkte.
        </p>

        <p className="animate-fade-up-delay mt-2 text-sm text-stone-500 dark:text-stone-500">
          5 Runden &middot; max. 25.000 Punkte
        </p>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up-delay mt-10 flex w-full flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname (optional)"
            maxLength={30}
            className="flex-1 rounded-xl border border-stone-300 bg-white/90 px-4 py-3 text-base shadow-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-stone-700 dark:bg-stone-900/90"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-fuchsia-500 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:shadow-sky-500/50 active:scale-[0.98]"
          >
            Spiel starten
          </button>
        </form>

        <p className="animate-fade-up-delay mt-12 text-sm text-stone-500 dark:text-stone-500">
          {totalLocations()} Standorte verfügbar — Bilder werden zufällig gezogen.
        </p>
      </div>
    </div>
  );
}
