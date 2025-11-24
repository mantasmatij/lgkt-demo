import React from 'react';
import { useI18n } from '../../i18n/LocaleProvider';

export interface ExportGuidanceProps {
  rows?: number;
  estimatedSize?: string;
  limit?: number;
  exceeded?: boolean;
  onAdjustFilters?: () => void;
}

export function ExportGuidance({ rows, estimatedSize, limit = 50000, exceeded, onAdjustFilters }: ExportGuidanceProps) {
  const { t } = useI18n();
  const tadmin = t('admin');
  if (!rows) return null;
  return (
    <div className={`rounded-md border p-3 text-xs ${exceeded ? 'border-red-400 bg-red-50 text-red-700' : 'border-blue-300 bg-blue-50 text-blue-700'}`}
         role={exceeded ? 'alert' : 'status'} aria-live={exceeded ? 'assertive' : 'polite'}>
      {exceeded ? (
        <>
          <strong>{tadmin('reports_export_too_large')}</strong> {tadmin('reports_projected_rows_exceed')
            .replace('{rows}', rows.toLocaleString())
            .replace('{limit}', limit.toLocaleString())}
          {estimatedSize && <> {tadmin('reports_estimated_size').replace('{size}', estimatedSize)} </>}
          <button type="button" onClick={onAdjustFilters} className="underline ml-1">{tadmin('reports_adjust_filters')}</button>
        </>
      ) : (
        <>
          {tadmin('reports_projected_rows_of_limit')
            .replace('{rows}', rows.toLocaleString())
            .replace('{limit}', limit.toLocaleString())} {estimatedSize && <>{tadmin('reports_estimated_size').replace('{size}', estimatedSize)}</>}
        </>
      )}
    </div>
  );
}

export default ExportGuidance;
