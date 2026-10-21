'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmModal from '@/components/common/ConfirmModal';
import { mockStore } from '@/lib/mockData';
import { Student, StudentProgram, StudentStatus } from '@/types';

export default function AdminStudentsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentPrograms, setStudentPrograms] = useState<StudentProgram[]>([]);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  // Actions states
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  // Quick action confirmation for pending approval / rejection
  const [pendingActionTarget, setPendingActionTarget] = useState<{
    student: Student;
    action: 'approve' | 'reject';
  } | null>(null);
  const [rejectReason, setRejectReason] = useState('Pendaftaran ditolak oleh admin');

  useEffect(() => {
    if (!mockStore.getIsLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = () => {
    const all = mockStore.getStudents().filter((s) => !s.isDeleted);
    // Sort pending first, then by createdAt desc
    all.sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setStudents(all);
    setStudentPrograms(mockStore.getStudentPrograms());
  };

  // Map latest active or registered program name for each student
  const studentProgramMap = useMemo(() => {
    const map: Record<string, string> = {};
    students.forEach((s) => {
      // Find active program first
      const activeProg = studentPrograms.find(
        (sp) => sp.studentId === s.id && sp.status === 'Aktif'
      );
      if (activeProg) {
        map[s.id] = activeProg.programNameAtRegistration;
      } else {
        // Fallback to latest registered program
        const latestProg = studentPrograms
          .filter((sp) => sp.studentId === s.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        map[s.id] = latestProg ? latestProg.programNameAtRegistration : '-';
      }
    });
    return map;
  }, [students, studentPrograms]);

  // Statistics counts (Dynamic from current active/non-deleted data)
  const stats = useMemo(() => {
    const totalAktif = students.filter((s) => s.status === 'Aktif').length;
    const totalLulus = students.filter((s) => s.status === 'Lulus').length;
    const totalTidakAktif = students.filter((s) => s.status === 'Nonaktif').length;
    const totalPending = students.filter((s) => s.status === 'Pending').length;
    return { totalAktif, totalLulus, totalTidakAktif, totalPending };
  }, [students]);

  // Separate Pending students list (for separate table above main table)
  const pendingStudents = useMemo(() => {
    return students.filter((s) => s.status === 'Pending');
  }, [students]);

  // Main table students list (Non-pending, filtered by search, session, and status)
  const nonPendingStudents = useMemo(() => {
    return students.filter((s) => s.status !== 'Pending');
  }, [students]);

  const filteredMainStudents = useMemo(() => {
    return nonPendingStudents.filter((s) => {
      const q = search.toLowerCase().trim();
      const progName = (studentProgramMap[s.id] || '').toLowerCase();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q) ||
        s.school.toLowerCase().includes(q) ||
        s.whatsapp.includes(q) ||
        progName.includes(q);

      const matchesSession =
        sessionFilter === 'all' ? true : String(s.preferredSession) === sessionFilter;

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'aktif'
            ? s.status === 'Aktif'
            : statusFilter === 'lulus'
              ? s.status === 'Lulus'
              : statusFilter === 'tidak-aktif'
                ? s.status === 'Nonaktif'
                : s.status === statusFilter;

      return matchesSearch && matchesSession && matchesStatus;
    });
  }, [nonPendingStudents, search, sessionFilter, statusFilter, studentProgramMap]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sessionFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredMainStudents.length / itemsPerPage));
  const paginatedStudents = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredMainStudents.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredMainStudents, currentPage, itemsPerPage]);

  const startRecord = filteredMainStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * itemsPerPage, filteredMainStudents.length);

  // Soft delete handler
  const handleRequestDelete = (std: Student) => {
    if (std.status !== 'Nonaktif') {
      setAlertMessage({
        text: `Hanya siswa berstatus "Nonaktif" yang dapat dihapus secara logis. Siswa "${std.name}" saat ini berstatus "${std.status}". Ubah status ke Nonaktif terlebih dahulu jika ingin menghapusnya.`,
        type: 'error',
      });
      return;
    }
    setAlertMessage(null);
    setDeleteTarget(std);
  };

  const handleSoftDelete = () => {
    if (!deleteTarget) return;
    const all = mockStore.getStudents();
    const updated = all.map((s) =>
      s.id === deleteTarget.id
        ? { ...s, isDeleted: true, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        : s
    );
    mockStore.saveStudents(updated);
    setDeleteTarget(null);
    setAlertMessage({
      text: `Data siswa "${deleteTarget.name}" berhasil dihapus secara logis.`,
      type: 'success',
    });
    loadData();
  };

  // Pending quick action approval / rejection
  const handleApprovePending = (std: Student) => {
    const all = mockStore.getStudents();
    const updated = all.map((s) =>
      s.id === std.id
        ? {
          ...s,
          status: 'Aktif' as StudentStatus,
          rejectionReason: null,
          updatedAt: new Date().toISOString(),
        }
        : s
    );
    mockStore.saveStudents(updated);
    setPendingActionTarget(null);
    setAlertMessage({
      text: `Siswa "${std.name}" berhasil disetujui & diaktifkan!`,
      type: 'success',
    });
    loadData();
  };

  const handleRejectPending = (std: Student) => {
    const all = mockStore.getStudents();
    const updated = all.map((s) =>
      s.id === std.id
        ? {
          ...s,
          status: 'Nonaktif' as StudentStatus,
          rejectionReason: rejectReason.trim() || 'Pendaftaran ditolak',
          updatedAt: new Date().toISOString(),
        }
        : s
    );
    mockStore.saveStudents(updated);
    setPendingActionTarget(null);
    setAlertMessage({
      text: `Pendaftaran "${std.name}" telah ditolak (Status: Nonaktif).`,
      type: 'success',
    });
    loadData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSessionFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Header Bar */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
        // title="Data Siswa"
        />

        <main className="flex-1 p-4 sm:p-8 space-y-6 w-full">
          {/* Notification Alert */}
          {alertMessage && (
            <div
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs sm:text-sm transition-all ${alertMessage.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {alertMessage.type === 'error' ? 'info' : 'check_circle'}
                </span>
                <span>{alertMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setAlertMessage(null)}
                className="font-bold hover:opacity-70 text-base leading-none"
              >
                &times;
              </button>
            </div>
          )}

          {/* Top Page Title & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
              Data Siswa
            </h1>

            <Link
              href="/admin/students/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Tambah Siswa Manual</span>
            </Link>
          </div>

          {/* Metric Statistics Cards (Design Ref: 3 Primary Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Total Siswa Aktif */}
            <div className="p-5 rounded-2xl bg-white shadow-xs border border-slate-200/70 flex items-center justify-between transition-all hover:shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-[13px] font-medium text-slate-500">
                  Total Siswa Aktif
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#131b2e]">
                    {stats.totalAktif}
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-emerald-600">
                    Siswa
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">person_check</span>
              </div>
            </div>

            {/* Card 2: Total Siswa Lulus */}
            <div className="p-5 rounded-2xl bg-white shadow-xs border border-slate-200/70 flex items-center justify-between transition-all hover:shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-[13px] font-medium text-slate-500">
                  Total Siswa Lulus
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#131b2e]">
                    {stats.totalLulus}
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-[#006194]">
                    Siswa
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-[#006194] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
            </div>

            {/* Card 3: Total Siswa Tidak Aktif */}
            <div className="p-5 rounded-2xl bg-white shadow-xs border border-slate-200/70 flex items-center justify-between transition-all hover:shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-[13px] font-medium text-slate-500">
                  Total Siswa Tidak Aktif
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#131b2e]">
                    {stats.totalTidakAktif}
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-slate-400">
                    Siswa
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">person_off</span>
              </div>
            </div>
          </div>


          {pendingStudents.length > 0 && (
            <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-2">
                    <span>Verifikasi Siswa Baru</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black">
                      {pendingStudents.length}
                    </span>
                  </h2>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-amber-200/60 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-amber-100/50 text-amber-900 uppercase tracking-wider font-bold text-[11px] border-b border-amber-200/60">
                        <th className="py-3 px-4">Nama Calon Siswa</th>
                        <th className="py-3 px-4">Orang Tua</th>
                        <th className="py-3 px-4">Kontak</th>
                        <th className="py-3 px-4">Program Belajar</th>
                        <th className="py-3 px-4">Sesi</th>
                        {/* <th className="py-3 px-4 text-center">Status</th> */}
                        <th className="py-3 px-4 text-right">Verifikasi Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100/60">
                      {pendingStudents.map((std) => (
                        <tr key={std.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <Link
                              href={`/admin/students/${std.id}`}
                              className="font-bold text-[#131b2e] hover:text-[#006194] transition-colors block"
                            >
                              {std.name}
                            </Link>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            {std.parentName}
                          </td>
                          <td className="py-3.5 px-4">
                            <a
                              href={`https://wa.me/${std.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-emerald-700 hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              <span className="material-symbols-outlined text-[15px]">chat</span>
                              <span>+{std.whatsapp}</span>
                            </a>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            {studentProgramMap[std.id] || '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-sky-50 text-[#006194] font-semibold text-xs border border-sky-100">
                              Sesi {std.preferredSession}
                            </span>
                          </td>
                          {/* <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                              Pending
                            </span>
                          </td> */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Setujui */}
                              <button
                                type="button"
                                onClick={() => handleApprovePending(std)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs transition-colors"
                                title="Setujui pendaftaran menjadi Siswa Aktif"
                              >
                                <span className="material-symbols-outlined text-[15px]">check</span>
                                <span>Approv</span>
                              </button>

                              {/* Tolak */}
                              <button
                                type="button"
                                onClick={() => {
                                  setPendingActionTarget({ student: std, action: 'reject' });
                                  setRejectReason('Kuota bimbingan penuh / Tidak memenuhi syarat');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs inline-flex items-center gap-1 border border-rose-200 transition-colors"
                                title="Tolak pendaftaran"
                              >
                                <span className="material-symbols-outlined text-[15px]">close</span>
                                <span>Tolak</span>
                              </button>

                              {/* Detail */}
                              <Link
                                href={`/admin/students/${std.id}`}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#006194] hover:bg-slate-100 transition-colors"
                                title="Lihat detail lengkap"
                              >
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Search & Multi-Filter Bar (Design Sesuai Gambar Figma/HTML) */}
          <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-200/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Input Search */}
            <div className="relative flex-1 min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 text-[#131b2e] placeholder:text-slate-400 text-xs sm:text-sm border border-transparent focus:border-[#006194] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006194]/20 transition-all"
              />
            </div>

            {/* Filter Sesi & Status & Reset Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Dropdown Sesi */}
              <div className="relative min-w-[140px]">
                <select
                  value={sessionFilter}
                  onChange={(e) => setSessionFilter(e.target.value)}
                  className="w-full h-11 pl-3 pr-8 rounded-xl bg-slate-50 text-[#131b2e] text-xs sm:text-sm font-medium appearance-none border border-transparent focus:border-[#006194] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006194]/20 cursor-pointer transition-all"
                >
                  <option value="all">Semua Sesi</option>
                  <option value="1">Sesi 1 (14:00 - 15:00)</option>
                  <option value="2">Sesi 2 (16:00 - 17:00)</option>
                  <option value="3">Sesi 3 (19:00 - 20:00)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>

              {/* Dropdown Status */}
              <div className="relative min-w-[140px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-11 pl-3 pr-8 rounded-xl bg-slate-50 text-[#131b2e] text-xs sm:text-sm font-medium appearance-none border border-transparent focus:border-[#006194] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006194]/20 cursor-pointer transition-all"
                >
                  <option value="all">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="lulus">Lulus</option>
                  <option value="tidak-aktif">Tidak Aktif</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-11 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                title="Reset semua filter"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TABEL DATA SISWA UTAMA (SUSUNAN: NAMA, ORANG TUA, KONTAK, PROGRAM, SESI, STATUS, AKSI) */}
          {/* ========================================================================= */}
          <div className="rounded-2xl bg-white shadow-xs border border-slate-200/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-bold text-[11px] border-b border-slate-200/70">
                    <th className="py-4 px-5">Nama</th>
                    <th className="py-4 px-4">Orang Tua</th>
                    <th className="py-4 px-4">Kontak</th>
                    <th className="py-4 px-4">Program Belajar</th>
                    <th className="py-4 px-4">Sesi</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. Nama */}
                      <td className="py-4 px-5">
                        <Link
                          href={`/admin/students/${std.id}`}
                          className="font-bold text-[#131b2e] hover:text-[#006194] transition-colors block text-sm"
                        >
                          {std.name}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                          {std.grade} &bull; {std.school}
                        </span>
                      </td>

                      {/* 2. Orang Tua */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#131b2e]">
                          {std.parentName}
                        </span>
                      </td>

                      {/* 3. Kontak */}
                      <td className="py-4 px-4">
                        <a
                          href={`https://wa.me/${std.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#131b2e] hover:text-emerald-700 transition-colors font-medium text-xs sm:text-sm"
                        >
                          {/* Format telepon rapi seperti 0812-3456-7890 jika lokal */}
                          {std.whatsapp.startsWith('62')
                            ? '0' + std.whatsapp.slice(2).replace(/(\d{3,4})(\d{4})(\d{3,4})?/, '$1-$2-$3')
                            : std.whatsapp}
                        </a>
                      </td>

                      {/* 4. Program Belajar */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-[#131b2e]">
                          {studentProgramMap[std.id] || '-'}
                        </span>
                      </td>

                      {/* 5. Sesi */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-[#131b2e] font-semibold text-xs">
                          Sesi {std.preferredSession}
                        </span>
                      </td>

                      {/* 6. Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${std.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : std.status === 'Nonaktif'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : std.status === 'Lulus'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                        >
                          {std.status}
                        </span>
                      </td>

                      {/* 7. Aksi (Aktif: Detail & Edit | Nonaktif: Detail, Edit & Hapus) */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* 1. Detail (Icon Visibility) */}
                          <Link
                            href={`/admin/students/${std.id}`}
                            className="p-2 rounded-lg text-slate-400 hover:text-[#006194] hover:bg-slate-100 transition-colors"
                            title="Detail Siswa"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </Link>

                          {/* 2. Edit (Icon Edit) */}
                          <Link
                            href={`/admin/students/${std.id}`}
                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                            title="Edit Data Siswa"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </Link>

                          {/* 3. Delete (Hanya jika status Nonaktif) */}
                          {std.status === 'Nonaktif' && (
                            <button
                              type="button"
                              onClick={() => handleRequestDelete(std)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Hapus Siswa (Soft Delete)"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                        Tidak ada data siswa yang cocok dengan filter atau kata kunci pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer Bar (Design Persis Sesuai Gambar) */}
            <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-slate-500">
                Menampilkan{' '}
                <strong className="text-[#131b2e] font-semibold">
                  {startRecord}-{endRecord}
                </strong>{' '}
                dari{' '}
                <strong className="text-[#131b2e] font-semibold">
                  {filteredMainStudents.length}
                </strong>{' '}
                siswa
              </span>

              <div className="flex items-center gap-1">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${currentPage === 1
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
                    }`}
                  aria-label="Halaman sebelumnya"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isActive = currentPage === page;
                  // Show current, first, last, or close neighbours
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center transition-colors ${isActive
                          ? 'bg-[#006194] text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  // Ellipsis
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-1 text-slate-400 text-xs">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${currentPage === totalPages || totalPages === 0
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
                    }`}
                  aria-label="Halaman berikutnya"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Reject Modal for Pending Student */}
      {pendingActionTarget && pendingActionTarget.action === 'reject' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">cancel</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Tolak Pendaftaran Siswa</h3>
                <p className="text-xs text-slate-500">{pendingActionTarget.student.name}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Alasan Penolakan:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Masukkan alasan penolakan pendaftaran..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingActionTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleRejectPending(pendingActionTarget.student)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Tolak Pendaftaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Soft Delete Modal (PRD Section 6.3 & 13.4) */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Konfirmasi Hapus Siswa (Soft Delete)"
        message={`Apakah Anda yakin ingin menghapus data siswa "${deleteTarget?.name}"? Siswa berstatus Nonaktif ini akan disembunyikan dari daftar antarmuka, namun riwayat keikutsertaan program dan jadwal terdahulu tetap tersimpan di database.`}
        confirmText="Hapus Siswa"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleSoftDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
