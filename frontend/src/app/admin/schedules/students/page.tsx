'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { mockStore } from '@/lib/mockData';
import { Student, ScheduleAssignment } from '@/types';

export default function AdminScheduleStudentsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real-time current date
  const now = new Date();
  const getFormattedDate = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayStr = getFormattedDate(now);

  // State
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
  const [sessionFilter, setSessionFilter] = useState<'all' | 'sesi-1' | 'sesi-2' | 'sesi-3'>('all');

  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<ScheduleAssignment[]>([]);

  useEffect(() => {
    if (!mockStore.getIsLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = () => {
    setStudents(mockStore.getStudents().filter((s) => !s.isDeleted));
    setSchedules(mockStore.getSchedules());
  };

  // Map student ID to student object for quick lookup
  const studentsMap = React.useMemo(() => {
    const map: Record<string, Student> = {};
    students.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [students]);

  // Initial generator helper
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  };

  // Students for the currently selected date (defaults to today)
  const selectedDateSchedules = schedules.filter((sch) => sch.date === selectedDate);

  const session1Students = selectedDateSchedules
    .filter((sch) => sch.session === 1)
    .map((sch) => studentsMap[sch.studentId])
    .filter(Boolean);

  const session2Students = selectedDateSchedules
    .filter((sch) => sch.session === 2)
    .map((sch) => studentsMap[sch.studentId])
    .filter(Boolean);

  const session3Students = selectedDateSchedules
    .filter((sch) => sch.session === 3)
    .map((sch) => studentsMap[sch.studentId])
    .filter(Boolean);

  // Selected date parsed & formatted (dd-mm-yyyy)
  const isSelectedToday = selectedDate === todayStr;
  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const dayName = selectedDateObj.toLocaleDateString('id-ID', { weekday: 'long' });
  const dd = String(selectedDateObj.getDate()).padStart(2, '0');
  const mm = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
  const yyyy = selectedDateObj.getFullYear();
  const formattedScheduleTitle = isSelectedToday
    ? `Hari Ini (${dayName})`
    : `Jadwal Hari ${dayName}, ${dd}-${mm}-${yyyy}`;

  // Calendar calculations (Monday start)
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();

  const calMonthLabel = calendarDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => {
    setCalendarDate(new Date(calYear, calMonth - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calYear, calMonth + 1, 1));
  };

  const jumpToToday = () => {
    const current = new Date();
    setCalendarDate(new Date(current.getFullYear(), current.getMonth(), 1));
    setSelectedDate(todayStr);
  };

  // Monday start: 0 = Senin, ..., 6 = Minggu
  const firstDayOfWeek = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
  const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPreviousMonth = new Date(calYear, calMonth, 0).getDate();

  // Leading days
  const leadingDaysCount = firstDayOfWeek;
  const leadingDays = Array.from({ length: leadingDaysCount }, (_, i) => {
    const day = daysInPreviousMonth - leadingDaysCount + 1 + i;
    const prevDate = new Date(calYear, calMonth - 1, day);
    const prevMonthName = prevDate.toLocaleDateString('id-ID', { month: 'short' });
    return { day, label: `${day} ${prevMonthName}` };
  });

  // Trailing days
  const totalSlotsUsed = leadingDaysCount + daysInCurrentMonth;
  const trailingDaysCount = totalSlotsUsed % 7 === 0 ? 0 : 7 - (totalSlotsUsed % 7);
  const trailingDays = Array.from({ length: trailingDaysCount }, (_, i) => {
    const day = i + 1;
    const nextDate = new Date(calYear, calMonth + 1, day);
    const nextMonthName = nextDate.toLocaleDateString('id-ID', { month: 'short' });
    return { day, label: `${day} ${nextMonthName}` };
  });

  // Handle clicking a day in the calendar
  const handleSelectCalendarDay = (dayNum: number) => {
    const dStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setSelectedDate(dStr);
    // Smooth scroll to top section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-800 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 sm:px-8 py-8 w-full space-y-8">
          {/* Top Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Jadwal Siswa
            </h1>
          </div>

          <section className="flex flex-col">
            {/* Header Bagian: Hari Ini (atau Jadwal [Hari], [dd-mm-yyyy] jika klik tanggal selain hari ini) */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-7 rounded-full bg-[#0284c7]" />
              <h2 className="text-2xl font-bold text-slate-900">
                {formattedScheduleTitle}
              </h2>
            </div>

            {/* 3 Kolom Sesi Simetris */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ================= KOLOM 1: Sesi 1 (Aksen Amber) ================= */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col transition-all hover:shadow-md">
                {/* Session Header */}
                <div className="flex items-center justify-between pb-4 mb-4 bg-amber-50/70 -mx-5 -mt-5 p-5 rounded-t-2xl border-b border-amber-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M7.05 7.05L5.636 5.636M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-base text-slate-900 block leading-tight">Sesi 1</span>
                      <span className="text-[11px] text-amber-800/80 font-medium">14.00 - 15.00</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                    {session1Students.length} Siswa
                  </span>
                </div>

                {/* Daftar Siswa Sesi 1 */}
                <div className="flex flex-col gap-2.5 flex-1">
                  {session1Students.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-100 rounded-xl">
                      <p className="text-xs font-semibold text-slate-400">Belum ada siswa di Sesi 1</p>
                      <Link
                        href="/admin/schedules/setting"
                        className="mt-2 text-xs font-bold text-[#0284c7] hover:underline"
                      >
                        + Jadwalkan Siswa
                      </Link>
                    </div>
                  ) : (
                    session1Students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {getInitials(student.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-slate-800 truncate">{student.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{student.school || student.grade}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ================= KOLOM 2: Sesi 2 (Aksen Biru) ================= */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col transition-all hover:shadow-md">
                {/* Session Header */}
                <div className="flex items-center justify-between pb-4 mb-4 bg-sky-50/70 -mx-5 -mt-5 p-5 rounded-t-2xl border-b border-sky-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0284c7] flex items-center justify-center font-bold">
                      <svg className="w-5 h-5 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-base text-slate-900 block leading-tight">Sesi 2</span>
                      <span className="text-[11px] text-[#0284c7]/80 font-medium">16.00 - 17.00</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-[#0284c7] font-bold">
                    {session2Students.length} Siswa
                  </span>
                </div>

                {/* Daftar Siswa Sesi 2 */}
                <div className="flex flex-col gap-2.5 flex-1">
                  {session2Students.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-100 rounded-xl">
                      <p className="text-xs font-semibold text-slate-400">Belum ada siswa di Sesi 2</p>
                      <Link
                        href="/admin/schedules/setting"
                        className="mt-2 text-xs font-bold text-[#0284c7] hover:underline"
                      >
                        + Jadwalkan Siswa
                      </Link>
                    </div>
                  ) : (
                    session2Students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#0284c7] flex items-center justify-center font-bold text-xs shrink-0">
                          {getInitials(student.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-slate-800 truncate">{student.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{student.school || student.grade}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ================= KOLOM 3: Sesi 3 (Aksen Toska) ================= */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col transition-all hover:shadow-md">
                {/* Session Header */}
                <div className="flex items-center justify-between pb-4 mb-4 bg-teal-50/70 -mx-5 -mt-5 p-5 rounded-t-2xl border-b border-teal-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                      <svg className="w-5 h-5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-base text-slate-900 block leading-tight">Sesi 3</span>
                      <span className="text-[11px] text-teal-800/80 font-medium">19.00 - 20.00</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-bold">
                    {session3Students.length} Siswa
                  </span>
                </div>

                {/* Daftar Siswa Sesi 3 */}
                <div className="flex flex-col gap-2.5 flex-1">
                  {session3Students.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-100 rounded-xl">
                      <p className="text-xs font-semibold text-slate-400">Belum ada siswa di Sesi 3</p>
                      <Link
                        href="/admin/schedules/setting"
                        className="mt-2 text-xs font-bold text-[#0284c7] hover:underline"
                      >
                        + Jadwalkan Siswa
                      </Link>
                    </div>
                  ) : (
                    session3Students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {getInitials(student.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-slate-800 truncate">{student.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{student.school || student.grade}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* LAYOUT KEDUA: KALENDER JADWAL SISWA BULANAN & KONTROL FILTER LENGKAP */}
          {/* ========================================================================= */}
          <section className="flex flex-col bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 mb-12">
            {/* Header Kalender & Navigasi Bulan */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-[#0284c7]">
                  <svg className="w-5 h-5 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Kalender Jadwal Siswa Bulanan
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {calMonthLabel} • Jadwal Reguler Kelas Tatap Muka
                  </span>
                </div>
              </div>

              {/* Navigasi Bulan & Hari Ini Button */}
              <div className="flex items-center gap-2 self-start lg:self-auto">
                <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                  <button
                    onClick={prevMonth}
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                    title="Bulan Sebelumnya"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-xs font-bold px-3 text-slate-800">
                    {calMonthLabel}
                  </span>
                  <button
                    onClick={nextMonth}
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                    title="Bulan Berikutnya"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={jumpToToday}
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
                >
                  Hari Ini
                </button>
              </div>
            </div>

            {/* Toolbar Filter Interaktif (Sesi Selector) */}
            <div className="bg-[#f8fafc] p-4 sm:p-5 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-800">Sesi:</span>
                <div className="relative min-w-[180px]">
                  <select
                    value={sessionFilter}
                    onChange={(e) => setSessionFilter(e.target.value as 'all' | 'sesi-1' | 'sesi-2' | 'sesi-3')}
                    className="w-full h-10 pl-3 pr-8 rounded-xl bg-white text-xs text-slate-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#0284c7] shadow-xs border border-slate-200/80 cursor-pointer"
                    id="session-filter-select"
                  >
                    <option value="all">Semua Sesi</option>
                    <option value="sesi-1">Sesi 1 (14.00 - 15.00)</option>
                    <option value="sesi-2">Sesi 2 (16.00 - 17.00)</option>
                    <option value="sesi-3">Sesi 3 (19.00 - 20.00)</option>
                  </select>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                <span>Klik pada tanggal mana pun untuk melihat rincian sesi di atas</span>
              </div>
            </div>

            {/* Kalender Grid: 7 Kolom (Senin s/d Minggu) */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[840px] flex flex-col">
                {/* Header Hari Kalender */}
                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                  <div className="py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Senin</div>
                  <div className="py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Selasa</div>
                  <div className="py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Rabu</div>
                  <div className="py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Kamis</div>
                  <div className="py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Jumat</div>
                  <div className="py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">Sabtu</div>
                  <div className="py-2 rounded-xl bg-rose-50 text-xs font-semibold text-rose-600">Minggu</div>
                </div>

                {/* Matrix Tanggal Kalender */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Leading Days (Previous Month) */}
                  {leadingDays.map((ld, idx) => (
                    <div
                      key={`leading-${idx}`}
                      className="min-h-[140px] p-2.5 rounded-2xl bg-slate-50/40 opacity-40 flex flex-col border border-transparent"
                    >
                      <span className="text-xs font-semibold text-slate-400">{ld.label}</span>
                    </div>
                  ))}

                  {/* Active Month Days */}
                  {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dayOfWeek = (leadingDaysCount + i) % 7; // 0 = Senin, ..., 6 = Minggu
                    const isSunday = dayOfWeek === 6;

                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const isDayToday = dateStr === todayStr;
                    const isDaySelected = dateStr === selectedDate;

                    // Data bimbingan nyata dari schedules
                    const dayAssignments = schedules.filter((sch) => sch.date === dateStr);

                    const s1Assigned = dayAssignments
                      .filter((sch) => sch.session === 1)
                      .map((sch) => studentsMap[sch.studentId]?.name)
                      .filter(Boolean);

                    const s2Assigned = dayAssignments
                      .filter((sch) => sch.session === 2)
                      .map((sch) => studentsMap[sch.studentId]?.name)
                      .filter(Boolean);

                    const s3Assigned = dayAssignments
                      .filter((sch) => sch.session === 3)
                      .map((sch) => studentsMap[sch.studentId]?.name)
                      .filter(Boolean);

                    const showS1 = (sessionFilter === 'all' || sessionFilter === 'sesi-1') && s1Assigned.length > 0;
                    const showS2 = (sessionFilter === 'all' || sessionFilter === 'sesi-2') && s2Assigned.length > 0;
                    const showS3 = (sessionFilter === 'all' || sessionFilter === 'sesi-3') && s3Assigned.length > 0;

                    // Minggu: Libur Mingguan
                    if (isSunday) {
                      return (
                        <div
                          key={`day-${dayNum}`}
                          className="min-h-[140px] p-2.5 rounded-2xl bg-rose-50/40 flex flex-col justify-between items-center text-center border border-rose-100/30"
                        >
                          <div className="flex items-center justify-end w-full mb-1.5">
                            <span className="text-xs font-bold text-rose-500">{dayNum}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center flex-1 text-rose-500/80">
                            <svg
                              className="w-5 h-5 text-rose-500 mb-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3v1m0 16a2 2 0 100-4 2 2 0 000 4zm0-16C6.477 3 2 7.477 2 13h20C22 7.477 17.523 3 12 3z"
                              />
                            </svg>
                            <span className="text-[11px] font-semibold text-rose-500">
                              Libur Mingguan
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // Hari Ini: Highlight Spesial dinamis real-time
                    if (isDayToday) {
                      return (
                        <div
                          key={`day-${dayNum}`}
                          onClick={() => handleSelectCalendarDay(dayNum)}
                          className={`min-h-[140px] p-2.5 rounded-2xl bg-sky-50/70 border-2 border-[#0284c7] shadow-sm flex flex-col justify-between transition-all cursor-pointer hover:shadow-md ${isDaySelected ? 'ring-2 ring-[#0284c7]/50' : ''
                            }`}
                          id="today-cell"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-6 h-6 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-xs font-bold">
                                {dayNum}
                              </span>
                              <span className="text-[10px] text-[#0284c7] font-bold uppercase tracking-wider">
                                Hari Ini
                              </span>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-ping" />
                          </div>

                          <div className="flex flex-col gap-1 w-full flex-1">
                            {showS1 && (
                              <div className="px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-900 text-[11px] truncate font-semibold shadow-2xs">
                                <span className="font-bold mr-1">S1:</span>
                                <span>{s1Assigned.join(', ')}</span>
                              </div>
                            )}
                            {showS2 && (
                              <div className="px-2 py-0.5 rounded-md bg-sky-200/90 text-[#0284c7] text-[11px] truncate font-semibold shadow-2xs">
                                <span className="font-bold mr-1">S2:</span>
                                <span>{s2Assigned.join(', ')}</span>
                              </div>
                            )}
                            {showS3 && (
                              <div className="px-2 py-0.5 rounded-md bg-teal-100/90 text-teal-900 text-[11px] truncate font-semibold shadow-2xs">
                                <span className="font-bold mr-1">S3:</span>
                                <span>{s3Assigned.join(', ')}</span>
                              </div>
                            )}
                            {!showS1 && !showS2 && !showS3 && (
                              <div className="text-[10px] text-slate-400 italic py-2">
                                Belum ada jadwal
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Hari Biasa
                    return (
                      <div
                        key={`day-${dayNum}`}
                        onClick={() => handleSelectCalendarDay(dayNum)}
                        className={`min-h-[140px] p-2.5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between border ${isDaySelected
                            ? 'bg-sky-50/50 border-[#0284c7] shadow-xs ring-1 ring-[#0284c7]/30'
                            : 'bg-[#f8fafc] hover:bg-slate-100/80 border-transparent hover:border-slate-200/60'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-bold ${isDaySelected ? 'text-[#0284c7]' : 'text-slate-800'}`}>
                            {dayNum}
                          </span>
                          {dayAssignments.length > 0 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {dayAssignments.length} sesi
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 w-full flex-1">
                          {showS1 && s1Assigned.map((name, sIdx) => (
                            <div
                              key={`s1-${sIdx}`}
                              className="px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-900 text-[11px] truncate font-medium"
                            >
                              <span className="font-bold mr-1">S1:</span>
                              <span>{name}</span>
                            </div>
                          ))}
                          {showS2 && s2Assigned.map((name, sIdx) => (
                            <div
                              key={`s2-${sIdx}`}
                              className="px-2 py-0.5 rounded-md bg-sky-100 text-[#0284c7] text-[11px] truncate font-medium"
                            >
                              <span className="font-bold mr-1">S2:</span>
                              <span>{name}</span>
                            </div>
                          ))}
                          {showS3 && s3Assigned.map((name, sIdx) => (
                            <div
                              key={`s3-${sIdx}`}
                              className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 text-[11px] truncate font-medium"
                            >
                              <span className="font-bold mr-1">S3:</span>
                              <span>{name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Trailing Days (Next Month) */}
                  {trailingDays.map((td, idx) => (
                    <div
                      key={`trailing-${idx}`}
                      className="min-h-[140px] p-2.5 rounded-2xl bg-slate-50/40 opacity-40 flex flex-col border border-transparent"
                    >
                      <span className="text-xs font-semibold text-slate-400">{td.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kalender Footer Legend & Information */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Keterangan:
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-amber-200" />
                  <span className="text-xs text-slate-700 font-medium">Sesi 1 (Aksen Amber)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-sky-200" />
                  <span className="text-xs text-slate-700 font-medium">Sesi 2 (Aksen Biru)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-teal-200" />
                  <span className="text-xs text-slate-700 font-medium">Sesi 3 (Aksen Toska)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-rose-200" />
                  <span className="text-xs text-slate-700 font-medium">Minggu Libur</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200/60"
                >
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Cetak Jadwal</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
