export function parseDate(dateStr: string | undefined): Date {
  if (!dateStr) {
    const d = new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }
  return new Date(dateStr + 'T00:00:00.000Z');
}

export function dateRange(dayStr: string) {
  const start = new Date(dayStr + 'T00:00:00.000Z');
  const end = new Date(dayStr + 'T23:59:59.999Z');
  return { startOfDay: start, endOfDay: end };
}

export function dayStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayStr(): string {
  return dayStr(new Date());
}
