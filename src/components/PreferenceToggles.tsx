import { Moon, Sun } from "lucide-react";
import { usePrefs, type Lang } from "../lib/preferences";

const LANGS: { id: Lang; label: string; name: string }[] = [
  { id: "id", label: "ID", name: "Bahasa Indonesia" },
  { id: "en", label: "EN", name: "English" }
];

export function LanguageSwitch({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  const { lang, setLang, tr } = usePrefs();
  return (
    <div className={`seg ${onDark ? "on-dark" : ""} ${className}`} role="group" aria-label={tr("Bahasa", "Language")}>
      {LANGS.map(option => (
        <button key={option.id} type="button" lang={option.id} aria-pressed={lang === option.id} aria-label={option.name} title={option.name} onClick={() => setLang(option.id)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  const { theme, toggleTheme, tr } = usePrefs();
  const dark = theme === "dark";
  const label = dark ? tr("Gunakan mode terang", "Switch to light mode") : tr("Gunakan mode gelap", "Switch to dark mode");
  return (
    <button type="button" onClick={toggleTheme} aria-label={label} title={label} aria-pressed={dark} className={`icon-btn ${onDark ? "on-dark" : ""} ${className}`}>
      {dark ? <Sun className="w-[18px] h-[18px]" aria-hidden="true" /> : <Moon className="w-[18px] h-[18px]" aria-hidden="true" />}
    </button>
  );
}
