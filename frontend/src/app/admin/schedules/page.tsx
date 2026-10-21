'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSchedulesIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // PRD 12.3 & 12.4: /admin/schedules mengarah ke submenu pertama (Jadwal Siswa)
    router.replace('/admin/schedules/students');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-500 text-sm">
        <div className="w-5 h-5 border-2 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
        <span>Memuat Jadwal Siswa...</span>
      </div>
    </div>
  );
}
