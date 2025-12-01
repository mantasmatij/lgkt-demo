"use client";

import { Card } from '@heroui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pillButtonClass, InputField } from 'ui';

const API_BASE = '' as const;
import { useI18n } from '../../providers/i18n-provider';

export default function AdminSignInPage() {
  const router = useRouter();
  const { t } = useI18n();
  const ta = t('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || ta('sign_in_failed'));
        setLoading(false);
        return;
      }

  // Redirect to forms list on success (default admin landing)
  router.push('/admin/forms');
    } catch {
      setError(ta('network_error'));
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <Card className="p-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold mb-2 text-center">{ta('sign_in_title')}</h1>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <InputField
            id="admin-email"
            name="email"
            type="email"
            label={ta('sign_in_email_label')}
            value={email}
            onChange={(e) => setEmail((e as React.ChangeEvent<HTMLInputElement>).target.value)}
            isRequired
            autoComplete="username"
          />
          
          <InputField
            id="admin-password"
            name="password"
            type="password"
            label={ta('sign_in_password_label')}
            value={password}
            onChange={(e) => setPassword((e as React.ChangeEvent<HTMLInputElement>).target.value)}
            isRequired
            autoComplete="current-password"
          />

          <button
            type="submit"
            className={`${pillButtonClass} w-full`}
            aria-busy={loading}
            disabled={loading}
          >
            {loading ? ta('signing_in') : ta('sign_in_button')}
          </button>
        </form>
        </div>
      </Card>
    </div>
  );
}
