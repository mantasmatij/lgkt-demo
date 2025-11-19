"use client";
import { useState } from 'react';

interface DateRange { from?: string; to?: string }
interface ExportParams {
  type?: string;
  dateRange?: DateRange;
}

export function useReportExport(params: ExportParams) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitInfo, setLimitInfo] = useState<{ estimatedSize?: string; code?: string } | null>(null);

  async function download() {
    if (!params.type) return;
    setDownloading(true);
    setError(null);
    try {
      const body: { type: string; filters?: { dateRange: DateRange } } = { type: params.type };
      if (params.dateRange?.from || params.dateRange?.to) {
        body.filters = { dateRange: { from: params.dateRange.from, to: params.dateRange.to } };
      }
      const res = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.status === 413) {
        const j = await res.json();
        setLimitInfo({ estimatedSize: j.estimatedSize, code: j.code });
        throw new Error(j.message || 'Export exceeds limits');
      }
      if (!res.ok) {
        try {
          const j = await res.json();
          const msg = j?.message ? (typeof j.message === 'string' ? j.message : JSON.stringify(j.message)) : undefined;
          throw new Error(msg || `Export failed (${res.status})`);
        } catch {
          throw new Error(`Export failed (${res.status})`);
        }
      }
      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition');
      let filename = 'report.csv';
      if (disposition) {
        const match = /filename="?(.*?)"?$/.exec(disposition);
        if (match) filename = match[1];
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Export error';
      setError(message);
    } finally {
      setDownloading(false);
    }
  }

  return { download, downloading, error, limitInfo };
}
