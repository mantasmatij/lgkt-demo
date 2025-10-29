"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Input } from '@heroui/react';
import { pillButtonClass } from 'ui';
import { useI18n } from '../../providers/i18n-provider';

export default function ReportsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const ta = t('admin');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (e: FormEvent) => {
    e.preventDefault();

    if (!from || !to) {
      alert(ta('select_both_dates_alert'));
      return;
    }

    setIsExporting(true);

    try {
      const params = new URLSearchParams({ from, to });
      const response = await fetch(`/api/admin/reports/export.csv?${params}`, {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/sign-in');
        return;
      }

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions-${from}-to-${to}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert(ta('export_failed_alert'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
  <h1 className="text-3xl font-bold mb-6">{ta('reports_page_title')}</h1>

      <Card className="max-w-md">
        <CardHeader>
          <h2 className="text-xl font-semibold">{ta('reports_csv_export')}</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleExport} className="space-y-4">
            <Input
              type="date"
              label={ta('start_date_label')}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              isRequired
            />
            <Input
              type="date"
              label={ta('end_date_label')}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              isRequired
            />
            <button
              type="submit"
              className={`${pillButtonClass} w-full`}
              disabled={isExporting}
              aria-busy={isExporting}
            >
              {isExporting ? ta('exporting') : ta('export_csv')}
            </button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
