import React from 'react';

export interface ExportGuidanceProps {
  rows?: number;
  estimatedSize?: string;
  limit?: number;
  exceeded?: boolean;
  onAdjustFilters?: () => void;
}

export function ExportGuidance({ rows, estimatedSize, limit = 50000, exceeded, onAdjustFilters }: ExportGuidanceProps) {
  if (!rows) return null;
  return (
    <div className={`rounded-md border p-3 text-xs ${exceeded ? 'border-red-400 bg-red-50 text-red-700' : 'border-blue-300 bg-blue-50 text-blue-700'}`}
         role={exceeded ? 'alert' : 'status'} aria-live={exceeded ? 'assertive' : 'polite'}>
      {exceeded ? (
        <>
          <strong>Export too large.</strong> Projected rows {rows.toLocaleString()} exceed the limit of {limit.toLocaleString()}.
          {estimatedSize && <> Estimated size: {estimatedSize}. </>}
          <button type="button" onClick={onAdjustFilters} className="underline ml-1">Adjust filters</button>
        </>
      ) : (
        <>
          Projected rows: {rows.toLocaleString()} / {limit.toLocaleString()}. {estimatedSize && <>Estimated size: {estimatedSize}.</>}
        </>
      )}
    </div>
  );
}

export default ExportGuidance;
