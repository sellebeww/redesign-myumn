import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "id" | "en";
export type Theme = "light" | "dark";
export interface Bilingual { id: string; en: string }
/** Plain strings (user input, older saved data) are shown as-is in both languages. */
export type Text = string | Bilingual;

export const pick = (text: Text, lang: Lang) => (typeof text === "string" ? text : text[lang]);

const LANG_KEY = "myumn_lang";
const THEME_KEY = "myumn_theme";

function readChoice<T extends string>(key: string, allowed: readonly T[], fallback: () => T): T {
  try {
    const value = localStorage.getItem(key);
    if (value && (allowed as readonly string[]).includes(value)) return value as T;
  } catch { /* storage unavailable */ }
  return fallback();
}

const systemTheme = (): Theme => {
  try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch { return "light"; }
};

interface Preferences {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  /** Returns the Indonesian or English variant of a UI string. */
  tr: (id: string, en: string) => string;
  /** Resolves bilingual data to the active language. */
  tx: (text: Text) => string;
  locale: string;
}

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readChoice(LANG_KEY, ["id", "en"] as const, () => "id"));
  const [theme, setThemeState] = useState<Theme>(() => readChoice(THEME_KEY, ["light", "dark"] as const, systemTheme));

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* keep in memory */ }
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a1122" : "#2346c8");
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* keep in memory */ }
  }, [theme]);

  // Printed pages always use the light palette.
  useEffect(() => {
    const before = () => { document.documentElement.dataset.theme = "light"; };
    const after = () => { document.documentElement.dataset.theme = theme; };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => { window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); };
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    setThemeState(next);
    window.setTimeout(() => root.classList.remove("theme-switching"), 350);
  }, []);

  const value = useMemo<Preferences>(() => ({
    lang,
    setLang: setLangState,
    theme,
    setTheme,
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    tr: (id, en) => (lang === "en" ? en : id),
    tx: text => pick(text, lang),
    locale: lang === "en" ? "en-GB" : "id-ID"
  }), [lang, theme, setTheme]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePrefs(): Preferences {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("usePrefs must be used inside PreferencesProvider");
  return value;
}
