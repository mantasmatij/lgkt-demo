'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { useI18n } from '../../providers/i18n-provider';

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
  const { t } = useI18n();
  const ta = t('admin');
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
          setError(ta('failed_load_companies'));
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
  <h1 className="text-3xl font-bold">{ta('companies_title')}</h1>

        {isEmpty ? (
          <Card className="p-6 text-center">
            <p className="text-gray-600 text-lg">{ta('no_companies_yet')}</p>
            <p className="text-gray-500 mt-2">{ta('companies_empty_hint')}</p>
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <p className="text-gray-700">
                <span className="font-semibold">{data.items.length}</span> {ta('companies_suffix')}
              </p>
            </Card>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <Table aria-label={ta('companies_table_aria')}>
                  <TableHeader>
                    <TableColumn>{ta('companies_columns_company_code')}</TableColumn>
                    <TableColumn>{ta('companies_columns_company_name')}</TableColumn>
                    <TableColumn>{ta('companies_columns_country')}</TableColumn>
                    <TableColumn>{ta('companies_columns_submissions')}</TableColumn>
                    <TableColumn>{ta('companies_columns_latest_submission')}</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((company) => (
                      <TableRow key={company.code}>
                        <TableCell>{company.code}</TableCell>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>{company.country}</TableCell>
                        <TableCell>{company.submissionCount}</TableCell>
                        <TableCell>
                          {company.latestSubmission ? (() => {
                            const d = new Date(company.latestSubmission);
                            if (Number.isNaN(d.getTime())) return ta('not_available');
                            const y = d.getFullYear();
                            const m = String(d.getMonth() + 1).padStart(2, '0');
                            const day = String(d.getDate()).padStart(2, '0');
                            return `${y}-${m}-${day}`;
                          })() : ta('not_available')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
