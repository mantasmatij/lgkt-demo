'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from '@heroui/react';

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
  const [data, setData] = useState<SubmissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`/api/admin/submissions?page=${page}&limit=50`, {
          credentials: 'include',
        });

        if (res.status === 401) {
          // Redirect to sign-in if not authenticated
          router.push('/admin/sign-in');
          return;
        }

        if (!res.ok) {
          setError('Failed to load submissions');
          setLoading(false);
          return;
        }

        const result = await res.json();
        setData(result);
      } catch {
        setError('Network error');
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
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      </div>
    );
  }

  const isEmpty = !data || data.items.length === 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold" tabIndex={-1} id="page-title">Admin Dashboard</h1>

        {isEmpty ? (
          <Card className="p-6 text-center" role="status" aria-live="polite">
            <p className="text-gray-600 text-lg">No submissions yet.</p>
            <p className="text-gray-500 mt-2">Submissions will appear here once companies start submitting forms.</p>
          </Card>
        ) : (
          <>
            <Card className="p-6" role="status" aria-live="polite">
              <p className="text-gray-700">
                <span className="font-semibold">{data.total}</span> total submissions
              </p>
            </Card>

            <Card className="p-6">
              <Table 
                aria-label="Submissions table"
                aria-describedby="submissions-description"
              >
                <TableHeader>
              <TableColumn>Company Code</TableColumn>
              <TableColumn>Company Name</TableColumn>
              <TableColumn>Country</TableColumn>
              <TableColumn>Contact Email</TableColumn>
              <TableColumn>Submitted At</TableColumn>
            </TableHeader>
            <TableBody>
              {data.items.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.companyCode}</TableCell>
                  <TableCell>{sub.nameAtSubmission}</TableCell>
                  <TableCell>{sub.country}</TableCell>
                  <TableCell>{sub.contactEmail}</TableCell>
                  <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
                </TableBody>
              </Table>
              <p id="submissions-description" className="sr-only">
                Table showing all company form submissions with company code, name, country, contact email, and submission date.
              </p>
            </Card>

            {data.pages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  total={data.pages}
                  page={page}
                  onChange={setPage}
                  showControls
                  aria-label="Submissions pagination"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}