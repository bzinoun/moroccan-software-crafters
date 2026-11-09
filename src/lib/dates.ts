// Calendar days as `YYYY-MM-DD` text, the form of a date control.

const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** The local day after `now`, as `YYYY-MM-DD`: the `min` of the date fields. */
export function tomorrowIso(now: Date): string {
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * The local day at noon, or null when the text is not a day of the calendar
 * ("2027-02-30" is not). Noon keeps the day stable across a time zone shift.
 */
export function parseIsoDay(iso: string): Date | null {
  const match = ISO_DAY.exec(iso);
  if (!match) return null;
  const [year, month, day] = [match[1], match[2], match[3]].map(Number);
  if (year === undefined || month === undefined || day === undefined) {
    return null;
  }
  const date = new Date(year, month - 1, day, 12);
  const real =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return real ? date : null;
}
