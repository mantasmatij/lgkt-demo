export function formatDateISO(date: string | Date | null | undefined): string {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!d || Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

export function formatDateTimeISO(date: string | Date | null | undefined): string {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!d || Number.isNaN(d.getTime())) return '';
    return d.toISOString().replace('T', ' ').slice(0, 16);
  } catch {
    return '';
  }
}
