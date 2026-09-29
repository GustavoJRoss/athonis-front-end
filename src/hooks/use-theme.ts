"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function resolveSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute(
    "data-theme",
    theme === "system" ? resolveSystemTheme() : theme,
  );
}

/** Lê/grava a preferência de tema (claro/escuro/sistema), sincronizada com o
 * script inline anti-flash em `src/app/layout.tsx`. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");

  // Reaplica a escolha salva no mount — corrige também o Strict Mode (dev)
  // resetando o <html> ao atributo padrão no remount.
  useLayoutEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  // Em "sistema", acompanha mudanças ao vivo na preferência do SO.
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    applyTheme(next);
  }, []);

  return { theme, setTheme };
}
