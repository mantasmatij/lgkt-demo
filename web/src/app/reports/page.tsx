import React from 'react';

// Placeholder reports entry page for Expand Reporting MVP (Feature 008)
// Will be expanded in US1 with selectors, filters, preview table, and export button.

export default function ReportsPage() {
  return (
    <main className="p-6 space-y-4" aria-labelledby="reports-title">
      <h1 id="reports-title" className="text-xl font-semibold">Reports (MVP Placeholder)</h1>
      <p className="text-sm text-gray-600">
        This page will provide a unified entry point for Companies and Forms list reports.
        CSV export (50k row limit) and preview functionality will be added in subsequent tasks.
      </p>
      <ul className="list-disc pl-6 text-sm">
        <li>Scope: Companies list & Forms list reports</li>
        <li>Upcoming: Filters panel, preview table, export action</li>
        <li>Extensible: Future XLSX/PDF/DOCX formats without changing workflow</li>
      </ul>
      <p className="text-xs text-gray-500">Feature 008 – Expand Reporting MVP</p>
    </main>
  );
}
