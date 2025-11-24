"use client";
import React, { useEffect, useState } from 'react';
import '../global.css';
import '../../styles/fontAndColour.css';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('overflow-hidden', mobileOpen);
  }, [mobileOpen]);

  return (
    <div className="min-h-screen" data-layout="admin">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(o => !o)}
        className="md:hidden fixed top-3 left-3 z-[200] pointer-events-auto rounded-full border-2 border-black bg-white px-3 py-2 text-sm font-semibold shadow"
        aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>
      <div className="flex" data-sidebar-state={mobileOpen ? 'open' : 'closed'}>
        <AdminSidebar mobileOpen={mobileOpen} />
        <main className="flex-1 admin-content-inner">
          {children}
        </main>
      </div>
    </div>
  );
}
