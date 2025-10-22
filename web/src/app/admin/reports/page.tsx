'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';

export default function ReportsPage() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (e: FormEvent) => {
    e.preventDefault();

    if (!from || !to) {
      alert('Please select both start and end dates');
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
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Export Reports</h1>

      <Card className="max-w-md">
        <CardHeader>
          <h2 className="text-xl font-semibold">CSV Export</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleExport} className="space-y-4">
            <Input
              type="date"
              label="Start Date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              isRequired
            />
            <Input
              type="date"
              label="End Date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              isRequired
            />
            <Button
              type="submit"
              color="primary"
              isLoading={isExporting}
              className="w-full"
            >
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
