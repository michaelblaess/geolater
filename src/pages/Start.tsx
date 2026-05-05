import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { totalLocations } from "../lib/locations";
import { CompassRose } from "../components/CompassRose";
import { log } from "../lib/debug";

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
    log("Spiel startet", { nickname: finalName });
    navigate("/spiel", { state: { nickname: finalName } });
  }

  return (
    <div className="topo-bg relative overflow-hidden">
      {/* dezenter Compass-Rose-Hintergrund, sehr leise */}
      <CompassRose
        size={520}
        className="pointer-events-none absolute -right-32 -top-24 hidden text-ink/5 sm:block"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
        {/* Hero links */}
        <div>
          <p className="animate-rise small-caps text-xs text-rust">
            Vol. I &nbsp;·&nbsp; Editorial Travel Almanac
          </p>

          <h1 className="animate-rise-1 mt-5 font-headline text-[16vw] leading-[0.9] sm:text-7xl lg:text-[7.5rem]">
            <span className="font-semibold text-ink">geo</span>
            <span className="italic font-medium text-rust">later</span>
            <span className="text-rust">.</span>
          </h1>

          <p className="animate-rise-2 mt-7 max-w-xl font-display text-xl leading-relaxed text-ink-soft sm:text-[1.35rem]">
            Du betrittst einen unbekannten Ort. Deine einzige Aufgabe:{" "}
            <em className="text-ink">die Welt deuten.</em> Klicke auf die Karte und
            rate, wo du bist — fünf Etappen, höchstens fünfundzwanzigtausend Punkte.
          </p>

          <div className="animate-rise-3 mt-10 rule">
            <span className="small-caps text-[10px]">Tritt ein</span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="animate-rise-3 mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Nom de plume"
              maxLength={30}
              className="flex-1 rounded-none border-b-2 border-ink/30 bg-transparent px-1 py-3 font-display text-lg text-ink placeholder:text-ink-muted/70 placeholder:italic focus:border-rust focus:outline-none"
            />
            <button
              type="submit"
              className="group relative inline-flex items-center justify-center gap-3 bg-ink px-6 py-3.5 font-medium tracking-wide text-cream transition-all hover:bg-rust active:translate-y-px"
            >
              <span className="small-caps text-xs">Spiel beginnen</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </button>
          </form>

          <p className="animate-rise-4 mt-12 text-sm text-ink-muted">
            <span className="small-caps text-rust">{totalLocations()} Orte</span> &nbsp;im
            aktuellen Almanach &nbsp;—&nbsp; jede Reise zieht fünf zufällige Etappen.
          </p>
        </div>

        {/* Compass-Rose rechts (sichtbar) */}
        <div className="animate-rise-2 relative hidden lg:flex lg:items-center lg:justify-center">
          <CompassRose size={360} className="animate-spin-slow text-rust/85" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-headline text-5xl italic text-ink">Terra</span>
            <span className="font-headline text-5xl italic text-rust">incognita</span>
            <span className="small-caps mt-2 text-[10px] text-ink-soft">finde deinen ort</span>
          </div>
        </div>
      </div>
    </div>
  );
}
