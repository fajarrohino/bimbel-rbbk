'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { mockStore } from '@/lib/mockData';
import { Student, Program, ScheduleAssignment } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hari-ini' | 'besok'>('hari-ini');

  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [schedules, setSchedules] = useState<ScheduleAssignment[]>([]);

  useEffect(() => {
    if (!mockStore.getIsLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    setStudents(mockStore.getStudents().filter((s) => !s.isDeleted));
    setPrograms(mockStore.getPrograms().filter((p) => !p.isDeleted));
    setSchedules(mockStore.getSchedules());
  }, [router]);

  const activeStudents = students.filter((s) => s.status === 'Aktif');
  const pendingStudents = students.filter((s) => s.status === 'Pending');
  const activePrograms = programs.filter((p) => p.isActive);

  // Current date helpers (YYYY-MM-DD)
  const getFormattedDate = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const now = new Date();
  const todayStr = getFormattedDate(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getFormattedDate(tomorrow);

  const selectedDateStr = activeTab === 'hari-ini' ? todayStr : tomorrowStr;

  // Filter schedules by selected date tab, ensuring only active students
  const activeStudentMap = React.useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach((s) => {
      if (s.status === 'Aktif') {
        map.set(s.id, s);
      }
    });
    return map;
  }, [students]);

  // Today's total scheduled (for top card statistic)
  const todayScheduleAssignments = schedules.filter(
    (sch) => sch.date === todayStr && activeStudentMap.has(sch.studentId)
  );
  // Get unique students scheduled today for clean count
  const uniqueTodayStudentIds = new Set(todayScheduleAssignments.map((s) => s.studentId));
  const totalScheduledToday = uniqueTodayStudentIds.size;

  // Schedules for currently selected tab (hari-ini or besok)
  const currentTabAssignments = schedules.filter(
    (sch) => sch.date === selectedDateStr && activeStudentMap.has(sch.studentId)
  );

  const session1Students = currentTabAssignments
    .filter((sch) => sch.session === 1)
    .map((sch) => activeStudentMap.get(sch.studentId)!)
    .filter(Boolean);

  const session2Students = currentTabAssignments
    .filter((sch) => sch.session === 2)
    .map((sch) => activeStudentMap.get(sch.studentId)!)
    .filter(Boolean);

  const session3Students = currentTabAssignments
    .filter((sch) => sch.session === 3)
    .map((sch) => activeStudentMap.get(sch.studentId)!)
    .filter(Boolean);

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
                  {activeStudents.length} <span className="text-xs font-medium text-slate-500">Siswa</span>
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
                  {pendingStudents.length} <span className="text-xs font-medium text-slate-500">Menunggu</span>
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
                  {activePrograms.length} <span className="text-xs font-medium text-slate-500">Program</span>
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
          {pendingStudents.length > 0 && (
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
                  </div>
                </div>
                <Link
                  href="/admin/students"
                  className="text-xs font-bold text-[#0284c7] hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Nama</th>
                      <th className="py-3 px-4">Kelas</th>
                      <th className="py-3 px-4">Orang Tua</th>
                      <th className="py-3 px-4">WhatsApp</th>
                      <th className="py-3 px-4">Sesi ke</th>
                      <th className="py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {pendingStudents.slice(0, 3).map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{std.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{std.grade}</td>
                        <td className="py-3.5 px-4 text-slate-600">{std.parentName}</td>
                        <td className="py-3.5 px-4 text-slate-600">{std.whatsapp}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-sky-50 text-[#0284c7] font-semibold">
                            Sesi {std.preferredSession}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/admin/students/${std.id}`}
                            className="px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs"
                          >
                            Preview
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
