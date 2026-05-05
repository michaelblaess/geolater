import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { isDebugActive } from "../lib/debug";
import { hasActiveGame } from "../lib/gameSession";

export function Layout() {
  const debug = isDebugActive();
  const location = useLocation();
  const showResume = location.pathname !== "/spiel" && hasActiveGame();

  return (
    <div className="relative flex min-h-full flex-col bg-cream text-ink">
      <header className="sticky top-0 z-20 border-b border-paper-rule bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="group flex items-baseline gap-3">
            <span aria-hidden className="block h-2 w-2 rounded-full bg-rust transition-transform group-hover:scale-125" />
            <span className="font-headline text-2xl font-semibold tracking-tight text-ink">
              geo
              <em className="font-medium not-italic text-rust" style={{ fontStyle: "italic" }}>later</em>
            </span>
          </Link>

          <nav className="flex items-center gap-1 text-sm">
            {showResume ? (
              <Link
                to="/spiel"
                className="group mr-2 inline-flex items-center gap-2 bg-rust px-3 py-1.5 text-cream transition-colors hover:bg-rust-deep"
              >
                <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-cream animate-pulse-soft" />
                <span className="small-caps text-[10px]">Reise läuft</span>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </Link>
            ) : null}
            {debug ? (
              <span className="mr-2 rounded-full border border-gold/60 bg-gold-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
                Debug
              </span>
            ) : null}
            <NavItem to="/highscore">Tafel</NavItem>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-paper-rule bg-cream-deep/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-ink-muted">
          <span className="small-caps">Privates Schülerprojekt · Nicht kommerziell</span>
          <div className="flex gap-5">
            <Link to="/datenschutz" className="hover:text-rust hover:underline underline-offset-4">
              Datenschutz
            </Link>
            <Link to="/impressum" className="hover:text-rust hover:underline underline-offset-4">
              Impressum
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-3 py-1.5 text-sm font-medium transition-colors ${
          isActive ? "text-rust" : "text-ink-soft hover:text-ink"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="small-caps">{children}</span>
          {isActive ? (
            <span className="absolute inset-x-3 -bottom-0.5 h-px bg-rust" aria-hidden />
          ) : null}
        </>
      )}
    </NavLink>
  );
}
