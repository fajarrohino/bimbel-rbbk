'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { scheduleApi, TodayScheduleResponse } from '@/lib/api/schedules';
import { studentApi } from '@/lib/api/students';
import { programApi } from '@/lib/api/programs';
import { Student } from '@/types';

function AdminDashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hari-ini' | 'besok'>('hari-ini');

  const [todaySchedule, setTodaySchedule] = useState<TodayScheduleResponse | null>(null);
  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Current date helpers (YYYY-MM-DD)
  const getFormattedDate = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const now = new Date();
  const todayStr = getFormattedDate(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getFormattedDate(tomorrow);

  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      try {
        const [todayData, activeRes, pendingRes, programsRes] = await Promise.allSettled([
          scheduleApi.getToday(),
          studentApi.getAll({ status: 'Aktif' }),
          studentApi.getAll({ status: 'Pending' }),
          programApi.getAll(),
        ]);

        if (todayData.status === 'fulfilled') setTodaySchedule(todayData.value);
        if (activeRes.status === 'fulfilled') {
          const res = activeRes.value as any;
          setActiveCount(res.pagination?.total ?? res.total ?? res.students?.length ?? 0);
        }
        if (pendingRes.status === 'fulfilled') {
          const res = pendingRes.value as any;
          setPendingCount(res.pagination?.total ?? res.total ?? res.students?.length ?? 0);
        }
        if (programsRes.status === 'fulfilled') {
          const list = Array.isArray(programsRes.value) ? programsRes.value : (programsRes.value as any)?.programs || [];
          setProgramCount(list.filter((p: any) => p.isActive).length);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

  // Build session student lists from todaySchedule response
  const getSessionStudents = (sessionNum: number): Array<{ id: string; name: string; grade: string }> => {
    if (!todaySchedule || !todaySchedule.sessions) return [];

    // Jika sessions berbentuk Object { 1: [...], 2: [...], 3: [...] } (format Fastify)
    if (!Array.isArray(todaySchedule.sessions)) {
      const sessionList = (todaySchedule.sessions as Record<string | number, any[]>)[sessionNum] || [];
      return sessionList.map((item: any) => ({
        id: item.student?.id || item.studentId || item.id,
        name: item.student?.name || 'Siswa',
        grade: item.student?.grade || '',
      }));
    }

    // Fallback jika sessions berbentuk Array [{ session: 1, students: [...] }]
    const sess = (todaySchedule.sessions as any[]).find((s: any) => s.session === sessionNum);
    return (sess?.students || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      grade: s.grade || '',
    }));
  };

  // For tomorrow, we don't have data from API in this setup (getToday only returns today)
  // Show today data only; tomorrow tab shows empty state
  const session1Students = activeTab === 'hari-ini' ? getSessionStudents(1) : [];
  const session2Students = activeTab === 'hari-ini' ? getSessionStudents(2) : [];
  const session3Students = activeTab === 'hari-ini' ? getSessionStudents(3) : [];

  const totalScheduledToday = (getSessionStudents(1).length + getSessionStudents(2).length + getSessionStudents(3).length);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          title="Dashboard"
        />

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full">
          {/* Welcome Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#006194] to-[#0284c7] p-6 sm:p-8 text-white shadow-sm">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Selamat Datang, Bu Khotimah! ✨
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/students/new"
                  className="px-4 py-2.5 rounded-xl bg-white text-[#006194] font-bold text-xs hover:bg-sky-50 shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Tambah Siswa</span>
                </Link>
                <Link
                  href="/admin/schedules"
                  className="px-4 py-2.5 rounded-xl bg-sky-700/60 hover:bg-sky-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>Atur Jadwal</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Metric Statistics Cards (PRD Section 12) - Entire Cards Clickable with Hover Effect */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Siswa Aktif */}
            <Link
              href="/admin/students"
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0284c7]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Siswa Aktif</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {activeCount} <span className="text-xs font-medium text-slate-500">Siswa</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">groups</span>
              </div>
            </Link>

            {/* Pendaftaran Pending */}
            <Link
              href="/admin/students"
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-400/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">Pendaftaran Pending</p>
                <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                  {pendingCount} <span className="text-xs font-medium text-slate-500">Menunggu</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">pending_actions</span>
              </div>
            </Link>

            {/* Total Program Aktif */}
            <Link
              href="/admin/programs"
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0284c7]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">Program Belajar Aktif</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {programCount} <span className="text-xs font-medium text-slate-500">Program</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284c7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">menu_book</span>
              </div>
            </Link>

            {/* Jadwal Hari Ini */}
            <Link
              href="/admin/schedules"
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-400/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">Siswa Terjadwal Hari Ini</p>
                <p className="text-2xl sm:text-3xl font-black text-teal-700 mt-1">
                  {totalScheduledToday} <span className="text-xs font-medium text-slate-500">Siswa (3 Sesi)</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">event_available</span>
              </div>
            </Link>
          </section>

          {/* Pending Applications Alert (if any) */}
          {pendingCount > 0 && (
            <section className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">mark_email_unread</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Menunggu Persetujuan Siswa Baru
                    </h2>
                    <p className="text-xs text-slate-500">{pendingCount} pendaftaran menunggu review</p>
                  </div>
                </div>
                <Link
                  href="/admin/students"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors"
                >
                  Lihat & Proses
                </Link>
              </div>
            </section>
          )}

          {/* Jadwal Siswa Harian (Design layout matching dashboard.html) */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">schedule</span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Jadwal Bimbel Siswa
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 rounded-xl bg-slate-100 flex text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('hari-ini')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'hari-ini'
                      ? 'bg-white text-[#0284c7] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Hari Ini (Aktif)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('besok')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'besok'
                      ? 'bg-white text-[#0284c7] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Besok
                  </button>
                </div>

                {/* <Link
                  href="/admin/schedules"
                  className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-xs flex items-center gap-1"
                >
                  <span>Atur Jadwal</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link> */}
              </div>
            </div>

            {/* 3 Sesi Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sesi 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Sesi 1</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-[#0284c7] font-bold text-xs">
                    {session1Students.length} Siswa
                  </span>
                </div>

                <div className="space-y-2">
                  {session1Students.map((std, idx) => (
                    <Link
                      key={`${std.id}-${idx}`}
                      href={`/admin/students/${std.id}`}
                      className="p-3 rounded-xl bg-white border border-slate-200/70 shadow-xs flex items-center justify-between text-xs hover:border-[#0284c7]/40 hover:bg-sky-50/30 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sky-600 text-[18px]">person</span>
                        <span className="font-bold text-slate-800 group-hover:text-[#0284c7] transition-colors">{std.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{std.grade}</span>
                    </Link>
                  ))}
                  {session1Students.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">Belum ada siswa di Sesi 1</p>
                  )}
                </div>
              </div>

              {/* Sesi 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Sesi 2</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs">
                    {session2Students.length} Siswa
                  </span>
                </div>

                <div className="space-y-2">
                  {session2Students.map((std, idx) => (
                    <Link
                      key={`${std.id}-${idx}`}
                      href={`/admin/students/${std.id}`}
                      className="p-3 rounded-xl bg-white border border-slate-200/70 shadow-xs flex items-center justify-between text-xs hover:border-teal-400/50 hover:bg-teal-50/30 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-teal-600 text-[18px]">person</span>
                        <span className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{std.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{std.grade}</span>
                    </Link>
                  ))}
                  {session2Students.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">Belum ada siswa di Sesi 2</p>
                  )}
                </div>
              </div>

              {/* Sesi 3 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Sesi 3</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs">
                    {session3Students.length} Siswa
                  </span>
                </div>

                <div className="space-y-2">
                  {session3Students.map((std, idx) => (
                    <Link
                      key={`${std.id}-${idx}`}
                      href={`/admin/students/${std.id}`}
                      className="p-3 rounded-xl bg-white border border-slate-200/70 shadow-xs flex items-center justify-between text-xs hover:border-indigo-400/50 hover:bg-indigo-50/30 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-600 text-[18px]">person</span>
                        <span className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{std.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{std.grade}</span>
                    </Link>
                  ))}
                  {session3Students.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">Belum ada siswa di Sesi 3</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
