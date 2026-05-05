import { useState } from "react";
import { getCurrentTheme, toggleTheme } from "../lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => getCurrentTheme());

  function handleClick() {
    const next = toggleTheme();
    setTheme(next);
  }

  const isDark = theme === "dark";
  const label = isDark ? "Lichtmodus aktivieren" : "Dunkelmodus aktivieren";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-stone-700 hover:bg-stone-200 dark:text-stone-200 dark:hover:bg-stone-800 transition-colors"
    >
      {isDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
