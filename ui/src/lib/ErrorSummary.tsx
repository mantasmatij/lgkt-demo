import * as React from 'react';
import { Card } from '@heroui/react';

interface ErrorSummaryProps {
  errors: Record<string, string[]>;
  title?: string;
}

/**
 * Accessible error summary component that displays validation errors
 * and allows keyboard navigation to error fields
 */
export function ErrorSummary({ errors, title = 'Please correct the following errors:' }: ErrorSummaryProps) {
  const errorEntries = Object.entries(errors).filter(([, messages]) => messages && messages.length > 0);

  if (errorEntries.length === 0) {
    return null;
  }

  const errorCount = errorEntries.reduce((sum, [, messages]) => sum + messages.length, 0);

  return (
    <Card
      className="p-4 bg-red-50 border-2 border-red-500"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2 
        className="text-red-900 font-semibold text-lg mb-3"
        id="error-summary-title"
        tabIndex={-1}
      >
        {title}
      </h2>
      <p className="text-red-800 mb-3">
        There {errorCount === 1 ? 'is' : 'are'} <strong>{errorCount}</strong> error{errorCount === 1 ? '' : 's'} on this page.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        {errorEntries.map(([field, messages]) =>
          messages.map((message, idx) => (
            <li key={`${field}-${idx}`} className="text-red-800">
              <a
                href={`#${field}`}
                className="underline hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(field) || document.querySelector(`[name="${field}"]`);
                  if (element) {
                    element.focus();
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                <strong>{formatFieldName(field)}:</strong> {message}
              </a>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}

/**
 * Format field names for display (camelCase to Title Case)
 */
function formatFieldName(field: string): string {
  // Handle nested fields (e.g., "submitter.name" -> "Submitter Name")
  const parts = field.split('.');
  return parts
    .map((part) =>
      part
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    )
    .join(' - ');
}
