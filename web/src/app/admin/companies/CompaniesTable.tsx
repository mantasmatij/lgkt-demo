'use client';

import React from 'react';
import { COMPANY_TYPE_LABEL_KEYS } from '../../../lib/constants/companyType';
import { useRouter } from 'next/navigation';
import type { EnDict } from '../../../i18n/dictionaries/en';
import type { LtDict } from '../../../i18n/dictionaries/lt';

type Dict = EnDict | LtDict;

interface CompanyItem {
  id: string;
  name: string;
  code: string;
  type?: string | null;
  address?: string | null;
  eDeliveryAddress?: string | null;
}

interface CompaniesTableProps {
  items: CompanyItem[];
  dict: Dict; // dictionary object (lt/en) passed from server component
}

export function CompaniesTable({ items, dict }: CompaniesTableProps) {
  const router = useRouter();
  const tadmin = (k: keyof typeof dict.admin) => dict.admin[k];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-gray-300">
      <table className="min-w-full border-separate border-spacing-0">
        <caption className="sr-only">{tadmin('companies_table_aria')}</caption>
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th scope="col" aria-sort="descending" className="py-2 pr-4 pl-6">{dict.admin.companies_columns_company_name}</th>
            <th scope="col" className="py-2 pr-4">{dict.admin.companies_columns_company_code}</th>
            <th scope="col" className="py-2 pr-4">{dict.admin.table_col_type}</th>
            <th scope="col" className="py-2 pr-4">{dict.fields.address}</th>
            <th scope="col" className="py-2 pr-4">{dict.fields.e_delivery_address}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => {
            const typeKey = c.type as keyof typeof COMPANY_TYPE_LABEL_KEYS | undefined;
            const labelKey = typeKey && COMPANY_TYPE_LABEL_KEYS[typeKey];
            // Fallback logic: if mapping fails, show raw type or em dash if absent
            const typeLabel = labelKey ? (dict.fields as Record<string,string>)[labelKey] : (c.type ?? '—');
            return (
              <tr
                key={c.id}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/admin/companies/${c.id}`)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/admin/companies/${c.id}`); } }}
                className="border-b last:border-b-0 border-gray-200 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                aria-label={`${c.name} (${c.code})`}
              >
                <td className="py-2 pr-4 pl-6">{c.name}</td>
                <td className="py-2 pr-4">{c.code}</td>
                <td className="py-2 pr-4">{typeLabel}</td>
                <td className="py-2 pr-4">{c.address ?? ''}</td>
                <td className="py-2 pr-4">{c.eDeliveryAddress ?? ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
