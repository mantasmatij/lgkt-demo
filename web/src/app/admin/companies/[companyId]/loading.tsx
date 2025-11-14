export default function LoadingCompanyDetail() {
  return (
    <main className="p-6" aria-busy="true" aria-live="polite">
      <div className="h-6 w-72 bg-gray-200 animate-pulse rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
      <div className="h-6 w-52 bg-gray-200 animate-pulse rounded mb-3" />
      <div className="h-48 bg-gray-200 animate-pulse rounded" />
    </main>
  );
}
