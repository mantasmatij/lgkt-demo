'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

type Company = {
  code: string;
  name: string;
  country: string;
  submissionCount: number;
  latestSubmission: string;
};

type CompaniesResponse = {
  items: Company[];
};

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [data, setData] = useState<CompaniesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('/api/admin/companies', {
          credentials: 'include',
        });

        if (res.status === 401) {
          router.push('/admin/sign-in');
          return;
        }

        if (!res.ok) {
          setError('Failed to load companies');
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

    fetchCompanies();
  }, [router]);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Companies</h1>

      {isEmpty ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 text-lg">No companies yet.</p>
          <p className="text-gray-500 mt-2">Companies will appear here once submissions are received.</p>
        </Card>
      ) : (
        <>
          <Card className="p-4 mb-4">
            <p className="text-gray-700">
              <span className="font-semibold">{data.items.length}</span> companies
            </p>
          </Card>

          <Table aria-label="Companies table">
            <TableHeader>
              <TableColumn>Company Code</TableColumn>
              <TableColumn>Company Name</TableColumn>
              <TableColumn>Country</TableColumn>
              <TableColumn>Submissions</TableColumn>
              <TableColumn>Latest Submission</TableColumn>
            </TableHeader>
            <TableBody>
              {data.items.map((company) => (
                <TableRow key={company.code}>
                  <TableCell>{company.code}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.country}</TableCell>
                  <TableCell>{company.submissionCount}</TableCell>
                  <TableCell>
                    {company.latestSubmission 
                      ? new Date(company.latestSubmission).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
