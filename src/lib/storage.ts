import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

// Storage is optional: private browsing and malformed saved data must not break the portal.
export function readSaved<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    if (Array.isArray(fallback)) return Array.isArray(value) ? value as T : fallback;
    return typeof value === typeof fallback && value !== null ? value : fallback;
  } catch { return fallback; }
}
export function useSavedState<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readSaved(key, fallback));
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* The current session remains usable when storage is unavailable. */ }
  }, [key, value]);
  return [value, setValue];
}
