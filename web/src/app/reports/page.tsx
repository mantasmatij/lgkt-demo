"use client";
import React, { useEffect, useState } from 'react';
import { ReportSelector } from '../../components/reports/ReportSelector';
import { FiltersPanel } from '../../components/reports/FiltersPanel';
import { useReportPreview } from '../../services/reports/useReportPreview';
import { useReportExport } from '../../services/reports/useReportExport';
import { ReportTable } from '../../components/reports/ReportTable';

interface ReportTypeOption { id: string; name: string }

export default function ReportsPage() {
  const [types, setTypes] = useState<ReportTypeOption[]>([]);
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const preview = useReportPreview({ type: selectedType, dateRange });
  const exporter = useReportExport({ type: selectedType, dateRange });

  // Load report types
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/reports/types');
      if (!res.ok) return; // keep silent for now
      const json = await res.json();
      setTypes(json.types || []);
    })();
  }, []);

  return (
    <main className="p-6 space-y-4" aria-labelledby="reports-title">
      <h1 id="reports-title" className="text-xl font-semibold">Reports</h1>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <ReportSelector types={types} value={selectedType} onChange={setSelectedType} />
        <FiltersPanel dateRange={dateRange} onChange={setDateRange} disabled={!selectedType} />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="bg-blue-600 text-white text-sm px-3 py-2 rounded disabled:opacity-50"
            disabled={!selectedType || preview.loading}
            onClick={() => preview.refresh()}
          >
            {preview.loading ? 'Refreshing…' : 'Refresh Preview'}
          </button>
          <button
            type="button"
            className="bg-green-600 text-white text-sm px-3 py-2 rounded disabled:opacity-50"
            disabled={!selectedType || preview.loading || exporter.downloading}
            onClick={() => exporter.download()}
          >
            {exporter.downloading ? 'Exporting…' : 'Download CSV'}
          </button>
        </div>
      </div>
      {preview.error && <p className="text-red-600 text-sm" role="alert">{preview.error}</p>}
      {exporter.error && <p className="text-red-600 text-sm" role="alert">{exporter.error}</p>}
      <section className="border rounded p-3" aria-label="Preview">
        <h2 className="text-sm font-medium mb-2">Preview</h2>
        {preview.loading && <p className="text-xs">Loading preview…</p>}
        {!preview.loading && preview.data && preview.data.rows.length === 0 && (
          <p className="text-xs text-gray-500">No rows match current filters.</p>
        )}
        {preview.data && preview.data.rows.length > 0 && (
          <ReportTable columns={preview.data.columns} rows={preview.data.rows} />
        )}
      </section>
      <p className="text-xs text-gray-500">Row limit: 50k; larger exports require narrowing filters.</p>
    </main>
  );
}
