import React from 'react';
import '../global.css'; // corrected filename
import '../../styles/fontAndColour.css'; // use in-project styles copy
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
