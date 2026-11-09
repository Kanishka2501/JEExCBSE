/**
 * Indian Standard Time (IST = UTC+5:30) Utilities
 * Ensures all day counts, clocks, and deadlines operate strictly on IST.
 */

export const IST_OFFSET_MINUTES = 330; // 5 hours 30 minutes

/**
 * Returns a Date object adjusted to IST components
 */
export function getCurrentISTDate(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + IST_OFFSET_MINUTES * 60000);
}

/**
 * Formats a Date into YYYY-MM-DD string in IST
 */
export function getISTDateString(d: Date = getCurrentISTDate()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates preparation day number starting from 10 November 2026 as Day 01
 * If the current IST date is before 2026-11-10, returns 1.
 */
export function getPreparationDayNumber(
  startDateStr: string = '2026-11-10',
  currentDateStr: string = getISTDateString()
): number {
  const [sy, sm, sd] = startDateStr.split('-').map(Number);
  const [cy, cm, cd] = currentDateStr.split('-').map(Number);

  const startUtc = Date.UTC(sy, sm - 1, sd);
  const currentUtc = Date.UTC(cy, cm - 1, cd);

  const diffMs = currentUtc - startUtc;
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  return Math.max(1, diffDays + 1);
}

/**
 * Calculates days remaining from current IST date to target date (YYYY-MM-DD)
 */
export function getDaysRemaining(targetDateStr: string, fromDateStr: string = getISTDateString()): number {
  const [ty, tm, td] = targetDateStr.split('-').map(Number);
  const [fy, fm, fd] = fromDateStr.split('-').map(Number);

  const targetUtc = Date.UTC(ty, tm - 1, td);
  const fromUtc = Date.UTC(fy, fm - 1, fd);

  const diffMs = targetUtc - fromUtc;
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

/**
 * Formats date into readable string e.g. "Tuesday, 10 Nov 2026"
 */
export function formatReadableIST(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
