import React from 'react';
import '../globals.css'; // assuming global styles
import '../../../fontAndColour.css'; // ensure font/color stylesheet (T010)
import AdminSidebar from './components/AdminSidebar';

// Admin layout injection point (T003, T010)
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row min-h-screen" data-layout="admin">
      <main className="flex-1" data-content>
        {children}
      </main>
      <AdminSidebar />
    </div>
  );
}
