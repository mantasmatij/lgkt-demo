"use client";
import React, { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/LocaleProvider';
import { ReportSelector } from '../../components/reports/ReportSelector';
import { FiltersPanel } from '../../components/reports/FiltersPanel';
import { CompanySelect } from '../../components/reports/CompanySelect';
import { AuthGate } from '../admin/forms/AuthGate';
import { useReportExport } from '../../services/reports/useReportExport';
import { useReportPreview } from '../../services/reports/useReportPreview';
import { ReportTable } from '../../components/reports/ReportTable';

interface ReportTypeOption { id: string; name: string }

export default function ReportsPage() {
  const [types, setTypes] = useState<ReportTypeOption[]>([]);
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [companyCode, setCompanyCode] = useState<string | undefined>(undefined);
  const preview = useReportPreview({ type: selectedType, dateRange, companyCode });
  const exporter = useReportExport({ type: selectedType, dateRange, companyCode });

  // Load report types
  useEffect(() => {
    (async () => {
      const API_BASE = '' as const;
      const res = await fetch(`${API_BASE}/api/reports/types`, { credentials: 'include' });
      if (!res.ok) return; // keep silent for now
      const json = await res.json();
      setTypes(json.types || []);
    })();
  }, []);

  const { t } = useI18n();
  const tadmin = t('admin');

  return (
    <main className="p-6 space-y-4" aria-labelledby="reports-title">
      <AuthGate />
      <h1 id="reports-title" className="text-xl font-semibold">{tadmin('reports_page_title')}</h1>
      <div className="flex flex-wrap items-end gap-4 bg-white border-2 rounded p-4">
        <ReportSelector types={types} value={selectedType} onChange={setSelectedType} />
        {selectedType === 'forms-list' && (
          <div className="flex items-end gap-3">
            <FiltersPanel dateRange={dateRange} onChange={setDateRange} />
          </div>
        )}
        {selectedType === 'companies-list' && (
          <CompanySelect value={companyCode} onChange={setCompanyCode} disabled={!selectedType} />
        )}
        <div className="flex items-end gap-3 ml-auto">
          <button
            type="button"
            className="px-4 py-2 border-2 border-black rounded-full bg-black text-white hover:bg-white hover:text-black hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedType && !companyCode && !dateRange.from && !dateRange.to}
            onClick={() => {
              setSelectedType(undefined);
              setCompanyCode(undefined);
              setDateRange({});
            }}
          >
            {tadmin('reports_clear')}
          </button>
          <button
            type="button"
            className="px-4 py-2 border-2 border-black rounded-full bg-black text-white hover:bg-white hover:text-black hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedType || exporter.downloading}
            onClick={() => exporter.download()}
          >
            {exporter.downloading ? tadmin('exporting') : tadmin('reports_csv_button')}
          </button>
        </div>
      </div>
      {preview.error && <p className="text-red-600 text-sm" role="alert">{preview.error}</p>}
      {exporter.error && <p className="text-red-600 text-sm" role="alert">{exporter.error}</p>}
      {/* Preview section without outer border or heading text */}
      <div aria-label="Report data preview" className="mt-2">
        {preview.loading && selectedType && (
          <p className="text-xs text-gray-600">{tadmin('reports_loading')}</p>
        )}
        {!preview.loading && preview.data && preview.data.rows.length === 0 && selectedType && (
          <p className="text-xs text-gray-500">{tadmin('reports_no_rows_match_filters')}</p>
        )}
        {preview.data && preview.data.rows.length > 0 && (
          <ReportTable
            columns={preview.data.columns}
            rows={preview.data.rows}
            emptyMessage={tadmin('reports_no_data')}
            permissionInfo={tadmin('reports_permission_note')}
          />
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">{tadmin('reports_row_limit_hint')}</p>
    </main>
  );
}
