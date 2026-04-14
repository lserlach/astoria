/** Day-granular date helpers for search / calendar (local date, no TZ shift). */

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, days: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + days);
  return x;
}

/** Arrival date → departure date (exclusive last night = morning of departure). */
export function nightsBetween(arrival: Date, departure: Date): number {
  const a = startOfDay(arrival).getTime();
  const b = startOfDay(departure).getTime();
  const n = Math.round((b - a) / 86400000);
  return Math.max(1, n);
}

export function compareDay(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

export function isSameDay(a: Date, b: Date): boolean {
  return compareDay(a, b) === 0;
}

export function isDayInOpenRange(
  day: Date,
  start: Date | null,
  end: Date | null,
): boolean {
  if (!start || !end) return false;
  const t = startOfDay(day).getTime();
  const s = startOfDay(start).getTime();
  const e = startOfDay(end).getTime();
  const lo = Math.min(s, e);
  const hi = Math.max(s, e);
  return t >= lo && t <= hi;
}

export function formatIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIsoDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

/** Deterministic mock price for demo (Tourvisor-style grid). */
export function mockTourPriceRub(d: Date): number {
  const t = Math.floor(startOfDay(d).getTime() / 86400000);
  const base = 24000 + ((t * 7919 + 1337) % 22000);
  return Math.round(base / 100) * 100;
}

export function isPastDay(d: Date): boolean {
  return compareDay(d, new Date()) < 0;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, months: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + months, 1);
}

/** Default “+2 weeks, 7 nights” for home search bar. */
export function defaultSearchDateRange(): { start: Date; end: Date } {
  const start = addDays(new Date(), 14);
  return { start, end: addDays(start, 7) };
}
