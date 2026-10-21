'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Route matches
  const isDashboardActive = pathname === '/admin';
  const isStudentsActive = pathname.startsWith('/admin/students');
  const isProgramsActive = pathname.startsWith('/admin/programs');
  const isSchedulesGroupActive = pathname.startsWith('/admin/schedules');
  const isJadwalSiswaActive = pathname === '/admin/schedules/students';
  const isAturJadwalActive =
    pathname === '/admin/schedules/setting' ||
    (pathname === '/admin/schedules' && !isJadwalSiswaActive);

  // Jadwal dropdown state: default open if currently on any schedule page
  const [isJadwalDropdownOpen, setIsJadwalDropdownOpen] = useState(isSchedulesGroupActive);

  useEffect(() => {
    if (isSchedulesGroupActive) {
      setIsJadwalDropdownOpen(true);
    }
  }, [isSchedulesGroupActive]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ==================== SIDEBAR ==================== */}
      <aside
        id="sidebar"
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between shrink-0 shadow-sm transition-transform duration-200 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Bagian Atas: Logo & Navigasi */}
        <div className="flex flex-col">
          {/* Logo Container */}
          <div className="h-24 px-6 flex items-center justify-between border-b border-slate-100 gap-3">
            <Link href="/admin" onClick={onClose} className="flex items-center gap-3">
              <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
                <Image
                  src="/logo-rbbk.png"
                  alt="Logo Rumah Belajar Bu Khotimah"
                  width={48}
                  height={48}
                  priority
                  className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-[#0284c7] leading-tight">
                  Rumah Belajar
                </span>
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  Bu Khotimah
                </span>
              </div>
            </Link>

            {onClose && (
              <button
                onClick={onClose}
                type="button"
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                aria-label="Tutup menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Menu Navigasi - Sesuai PRD Point 12.4 & assets-rbbk sidebar */}
          <nav className="px-4 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)]">
            {/* 1. Dashboard — /admin */}
            <Link
              href="/admin"
              onClick={onClose}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-colors group ${
                isDashboardActive
                  ? 'font-semibold text-[#0284c7] bg-[#f0f7ff] border border-[#bae6fd]/50'
                  : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <svg
                className={`w-5 h-5 ${
                  isDashboardActive ? 'text-[#0284c7]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span>Dashboard</span>
            </Link>

            {/* 2. Data Siswa — /admin/students */}
            <Link
              href="/admin/students"
              onClick={onClose}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-colors group ${
                isStudentsActive
                  ? 'font-semibold text-[#0284c7] bg-[#f0f7ff] border border-[#bae6fd]/50'
                  : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <svg
                className={`w-5 h-5 ${
                  isStudentsActive ? 'text-[#0284c7]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Data Siswa</span>
            </Link>

            {/* 3. Jadwal Bimbingan (Dropdown dengan Submenu) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsJadwalDropdownOpen((prev) => !prev)}
                id="btn-jadwal"
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors group ${
                  isSchedulesGroupActive
                    ? 'font-semibold text-[#0284c7] bg-[#f0f7ff] border border-[#bae6fd]/50'
                    : 'font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <svg
                    className={`w-5 h-5 ${
                      isSchedulesGroupActive
                        ? 'text-[#0284c7]'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Jadwal Bimbingan</span>
                </div>
                <svg
                  id="arrow-jadwal"
                  className={`w-4 h-4 transition-transform duration-200 transform ${
                    isJadwalDropdownOpen ? 'rotate-180 text-[#0284c7]' : 'text-slate-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Sub-menu Jadwal Bimbingan */}
              {isJadwalDropdownOpen && (
                <div id="submenu-jadwal" className="mt-1 pl-10 pr-2 space-y-1 block transition-all duration-200">
                  {/* Submenu 3a: Jadwal Siswa — /admin/schedules/students */}
                  <Link
                    href="/admin/schedules/students"
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                      isJadwalSiswaActive
                        ? 'font-semibold text-[#0284c7] bg-[#f0f7ff]'
                        : 'font-medium text-slate-600 hover:text-[#0284c7] hover:bg-[#f0f7ff]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isJadwalSiswaActive ? 'bg-[#0284c7]' : 'bg-slate-300'
                      }`}
                    />
                    <span>Jadwal Siswa</span>
                  </Link>

                  {/* Submenu 3b: Atur Jadwal — /admin/schedules/setting */}
                  <Link
                    href="/admin/schedules/setting"
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                      isAturJadwalActive
                        ? 'font-semibold text-[#0284c7] bg-[#f0f7ff]'
                        : 'font-medium text-slate-600 hover:text-[#0284c7] hover:bg-[#f0f7ff]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAturJadwalActive ? 'bg-[#0284c7]' : 'bg-slate-300'
                      }`}
                    />
                    <span>Atur Jadwal</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Note: Modul Absensi & Pembayaran TIDAK ditampilkan di menu MVP sesuai PRD 12.3 & 12.4 */}

            {/* 4. Program Belajar — /admin/programs */}
            <Link
              href="/admin/programs"
              onClick={onClose}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-colors group ${
                isProgramsActive
                  ? 'font-semibold text-[#0284c7] bg-[#f0f7ff] border border-[#bae6fd]/50'
                  : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <svg
                className={`w-5 h-5 ${
                  isProgramsActive ? 'text-[#0284c7]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Program Belajar</span>
            </Link>
          </nav>
        </div>

        {/* Bagian Bawah: Bersih tanpa profile/logout sesuai acuan assets-rbbk */}
        <div className="p-4 border-t border-slate-100" />
      </aside>
    </>
  );
}

