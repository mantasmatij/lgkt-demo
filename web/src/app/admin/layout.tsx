import React from 'react';
import { cookies } from 'next/headers';
import '../global.css'; // corrected filename
import '../../styles/fontAndColour.css'; // use in-project styles copy
import AdminSidebar from './components/AdminSidebar';

// Admin layout injection point (T003, T010)
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const collapsedCookie = cookieStore.get('adminSidebarCollapsed')?.value === 'true';
  return (
    <div className="flex flex-row min-h-screen" data-layout="admin">
      <main className="flex-1" data-content>
        {children}
      </main>
      <AdminSidebar defaultCollapsed={collapsedCookie} />
    </div>
  );
}
