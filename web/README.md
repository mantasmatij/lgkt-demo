# Web App (Next.js)

## Reports
- Entry: `src/app/reports/page.tsx` (also reused under admin).
- UI: `src/components/reports/ReportSelector.tsx`, `FiltersPanel.tsx`, `ReportTable.tsx`, `ExportGuidance.tsx`.
- Hooks: `src/services/reports/useReportPreview.ts`, `useReportExport.ts`.
- Behavior: Preview and export reflect filters, sorting, and user permissions.
- Limits: Hard cap ~50k rows; on 413, UI surfaces `limitInfo` and shows guidance.

### Usage
- Select a report type, set date range, review preview, click Download CSV.
- If export is too large, narrow filters; `ExportGuidance` shows projected size.

### Accessibility
- Components include labels, `scope="col"` headers, and live regions for export guidance.
- Main content is focusable via skip link in `src/app/layout.tsx`.

### Styling
- Tailwind CSS configured in `tailwind.config.ts`.
- Brand fonts/colors via `src/app/global.css` → `src/styles/fontAndColour.css`.

### Dev Tips
- API endpoints reside in `api/src/routes/reports.*`.
- For large export checks, see `api/src/utils/exportSizeEstimator.ts`.
- CSV builder lives in `api/src/utils/csvExporter.ts`.
