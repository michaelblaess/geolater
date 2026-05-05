import { Link, NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { isDebugActive } from "../lib/debug";

export function Layout() {
  const debug = isDebugActive();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-stone-200/60 bg-white/70 backdrop-blur-md dark:border-stone-800/60 dark:bg-stone-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span className="inline-block h-6 w-6 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 shadow-sm shadow-sky-500/50" />
            <span>
              geo<span className="text-gradient-brand">later</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {debug ? (
              <span className="mr-2 rounded-full bg-amber-300 px-2.5 py-0.5 text-xs font-bold text-amber-900 shadow-sm">
                DEBUG
              </span>
            ) : null}
            <NavItem to="/highscore">Highscore</NavItem>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 bg-white/60 dark:border-stone-800 dark:bg-stone-900/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm text-stone-600 dark:text-stone-400">
          <span>Privates Schülerprojekt — keine kommerzielle Nutzung.</span>
          <div className="flex gap-4">
            <Link to="/datenschutz" className="hover:underline">
              Datenschutz
            </Link>
            <Link to="/impressum" className="hover:underline">
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
        `rounded-lg px-3 py-1.5 transition-colors ${
          isActive
            ? "bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-100"
            : "hover:bg-stone-100 dark:hover:bg-stone-800"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
