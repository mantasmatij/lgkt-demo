export default function AdminIndexPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      <p className="mb-2">Welcome to the admin area.</p>
      <ul className="list-disc list-inside">
        <li>
          <a className="text-blue-600 underline" href="/admin/forms">Go to Forms</a>
        </li>
      </ul>
    </main>
  );
}
