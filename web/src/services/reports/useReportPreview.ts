"use client";
import { useCallback, useEffect, useState } from 'react';

interface DateRange { from?: string; to?: string }
interface PreviewParams {
  type?: string;
  dateRange?: DateRange;
}

interface PreviewData {
  columns: string[];
  rows: string[][];
  total: number;
}

export function useReportPreview(params: PreviewParams) {
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(async () => {
    if (!params.type) return;
    setLoading(true);
    setError(null);
    try {
      const body: { type: string; filters?: { dateRange: DateRange } } = { type: params.type };
      if (params.dateRange?.from || params.dateRange?.to) {
        body.filters = { dateRange: { from: params.dateRange.from, to: params.dateRange.to } };
      }
      const res = await fetch('/api/reports/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        try {
          const j = await res.json();
          const msg = j?.message ? (typeof j.message === 'string' ? j.message : JSON.stringify(j.message)) : undefined;
          throw new Error(msg || `Preview failed (${res.status})`);
        } catch {
          throw new Error(`Preview failed (${res.status})`);
        }
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Preview error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params.type, params.dateRange?.from, params.dateRange?.to]);

  useEffect(() => { fetchPreview(); }, [fetchPreview]);

  return { data, loading, error, refresh: fetchPreview };
}
