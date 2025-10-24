'use client';

import { Button, Card, Input } from '@heroui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || 'Sign in failed');
        setLoading(false);
        return;
      }

      // Redirect to dashboard on success
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <Card className="p-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold mb-2 text-center">Admin Sign In</h1>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            label="Email"
            value={email}
            onValueChange={setEmail}
            required
            autoComplete="username"
          />
          
          <Input
            type="password"
            label="Password"
            value={password}
            onValueChange={setPassword}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            color="primary"
            className="w-full"
            isLoading={loading}
            isDisabled={loading}
          >
            Sign In
          </Button>
        </form>
        </div>
      </Card>
    </div>
  );
}
