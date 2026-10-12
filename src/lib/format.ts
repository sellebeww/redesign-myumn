import type { Lang } from './preferences';

const DAY_LABELS: Record<string, string> = {
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: 'Jumat',
  Saturday: 'Sabtu',
  Sunday: 'Minggu'
};

export const WEEKDAYS = Object.keys(DAY_LABELS);

/** Course days are stored as English weekday names. */
export const dayLabel = (day: string, lang: Lang = 'id') => (lang === 'en' ? day : DAY_LABELS[day] ?? day);

/** Formats an ISO date (YYYY-MM-DD, optionally followed by a time) as "8 Juni 2026" / "8 June 2026". */
export function formatDate(value: string, lang: Lang = 'id'): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export const formatRupiah = (amount: number) => 'Rp ' + amount.toLocaleString('id-ID');

/** Random id that also works on non-secure origins where crypto.randomUUID is missing. */
export function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID().slice(0, 8).toUpperCase();
  } catch { /* fall through */ }
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

/** Current Jakarta time as "YYYY-MM-DD HH:mm". */
export const nowStamp = () => new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16);
