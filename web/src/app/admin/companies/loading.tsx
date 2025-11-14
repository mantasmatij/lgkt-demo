export default function LoadingCompanies() {
  return (
    <main className="p-6" aria-busy="true" aria-live="polite">
      <div className="h-6 w-64 bg-gray-200 animate-pulse rounded mb-4" />
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
        <div className="h-8 bg-gray-200 animate-pulse rounded" />
        <div className="h-64 bg-gray-200 animate-pulse rounded" />
        <div className="h-8 bg-gray-200 animate-pulse rounded" />
      </div>
    </main>
  );
}
