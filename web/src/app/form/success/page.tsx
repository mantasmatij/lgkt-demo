'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function FormSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pranešimas pateiktas sėkmingai
        </h1>
        
        <p className="text-lg text-gray-700 mb-8">
          Jūsų įmonės duomenys ir darbo aplinkos informacija buvo sėkmingai gauti. 
          Dėkojame už dalyvavimą lyčių lygybės iniciatyvoje.
        </p>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Jei turite klausimų, susisiekite su mumis:
          </p>
          <p className="text-gray-600 font-medium">
            El. paštas: info@lgkt.lt
          </p>
        </div>
        
        <div className="mt-8">
          <Button
            as={Link}
            href="/form"
            color="primary"
            size="lg"
          >
            Pateikti kitą pranešimą
          </Button>
        </div>
      </div>
    </div>
  );
}
