'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from '@heroui/react';
import { useI18n } from '../../providers/i18n-provider';

type Submission = {
  id: string;
  companyCode: string;
  nameAtSubmission: string;
  country: string;
  contactEmail: string;
  createdAt: string;
};

type SubmissionsResponse = {
  items: Submission[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t } = useI18n();
  const ta = t('admin');
  const [data, setData] = useState<SubmissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      setError('');

      try {
        const API_BASE = '' as const;
        const res = await fetch(`${API_BASE}/api/admin/submissions?page=${page}&limit=50`, {
          credentials: 'include',
        });

        if (res.status === 401) {
          // Redirect to sign-in if not authenticated
          router.push('/admin/sign-in');
          return;
        }

        if (!res.ok) {
          setError(ta('failed_load_submissions'));
          setLoading(false);
          return;
        }

        const result = await res.json();
        setData(result);
      } catch {
        setError(ta('network_error'));
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [page, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      </div>
    );
  }

  const isEmpty = !data || data.items.length === 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
  <h1 className="text-3xl font-bold" tabIndex={-1} id="page-title">{ta('dashboard_title')}</h1>

        {isEmpty ? (
          <Card className="p-6 text-center" role="status" aria-live="polite">
            <p className="text-gray-600 text-lg">{ta('no_submissions_yet')}</p>
            <p className="text-gray-500 mt-2">{ta('submissions_empty_hint')}</p>
          </Card>
        ) : (
          <>
            <Card className="p-6" role="status" aria-live="polite">
              <p className="text-gray-700">
                <span className="font-semibold">{data.total}</span> {ta('total_submissions_suffix')}
              </p>
            </Card>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <Table 
                  aria-label={ta('submissions_table_aria')}
                  aria-describedby="submissions-description"
                >
                  <TableHeader>
                    <TableColumn>{ta('submissions_columns_company_code')}</TableColumn>
                    <TableColumn>{ta('submissions_columns_company_name')}</TableColumn>
                    <TableColumn>{ta('submissions_columns_country')}</TableColumn>
                    <TableColumn>{ta('submissions_columns_contact_email')}</TableColumn>
                    <TableColumn>{ta('submissions_columns_submitted_at')}</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.companyCode}</TableCell>
                        <TableCell>{sub.nameAtSubmission}</TableCell>
                        <TableCell>{sub.country}</TableCell>
                        <TableCell>{sub.contactEmail}</TableCell>
                        <TableCell>{(() => { const d = new Date(sub.createdAt); if (Number.isNaN(d.getTime())) return ''; const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; })()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p id="submissions-description" className="sr-only">
                {ta('submissions_table_aria')}
              </p>
            </Card>

            {data.pages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  total={data.pages}
                  page={page}
                  onChange={setPage}
                  showControls
                  aria-label={ta('submissions_pagination_aria')}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}