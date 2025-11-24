// Frontend service stubs for reporting MVP
// These wrappers will be expanded with actual fetch logic and error handling.

export interface PreviewResponse {
  columns: string[];
  rows: string[][];
  total: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export async function fetchReportTypes() {
  const res = await fetch(`${API_BASE}/reports/types`);
  if (!res.ok) throw new Error('Failed report types');
  return res.json();
}

export async function fetchReportFilters(type: string) {
  const url = new URL(`${API_BASE}/reports/filters`, window.location.origin);
  url.searchParams.set('type', type);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed filters');
  return res.json();
}

export async function previewReport(body: unknown): Promise<PreviewResponse> {
  const res = await fetch(`${API_BASE}/reports/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Failed preview');
  return res.json();
}

export async function exportReport(body: unknown): Promise<Blob> {
  const res = await fetch(`${API_BASE}/reports/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Failed export');
  return res.blob();
}
