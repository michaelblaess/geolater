import { Link, NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

export function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-800 dark:bg-stone-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="inline-block h-6 w-6 rounded-full bg-sky-500" />
            geolater
          </Link>
          <nav className="flex items-center gap-1 text-sm">
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
          <span>Privates Schuelerprojekt — keine kommerzielle Nutzung.</span>
          <div className="flex gap-4">
            <Link to="/datenschutz" className="hover:underline">Datenschutz</Link>
            <Link to="/impressum" className="hover:underline">Impressum</Link>
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
