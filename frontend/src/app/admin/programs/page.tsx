'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmModal from '@/components/common/ConfirmModal';
import { mockStore, INITIAL_PROGRAMS } from '@/lib/mockData';
import { Program } from '@/types';

export default function AdminProgramsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>(INITIAL_PROGRAMS);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);

  // Detail Modal State
  const [detailTarget, setDetailTarget] = useState<Program | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mockStore.getIsLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    loadPrograms();
  }, [router]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const loadPrograms = () => {
    const all = mockStore.getPrograms().filter((p) => !p.isDeleted);
    // Sort by displayOrder ascending
    all.sort((a, b) => a.displayOrder - b.displayOrder);
    setPrograms(all);
  };

  const handleToggleActive = (prog: Program) => {
    const all = mockStore.getPrograms();
    const nextStatus = !prog.isActive;
    const updated = all.map((p) =>
      p.id === prog.id ? { ...p, isActive: nextStatus, updatedAt: new Date().toISOString() } : p
    );
    mockStore.savePrograms(updated);
    loadPrograms();
    showToast(`Status "${prog.name}" diubah ke ${nextStatus ? 'Enable' : 'Disable'}`);
  };

  const handleSoftDelete = () => {
    if (!deleteTarget) return;
    const all = mockStore.getPrograms();
    const updated = all.map((p) =>
      p.id === deleteTarget.id
        ? { ...p, isDeleted: true, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        : p
    );
    mockStore.savePrograms(updated);
    showToast(`Program "${deleteTarget.name}" berhasil dihapus`);
    setDeleteTarget(null);
    loadPrograms();
  };

  const activeCount = programs.filter((p) => p.isActive).length;
  const inactiveCount = programs.filter((p) => !p.isActive).length;
  const totalCount = programs.length;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Header (Top bar with Notifikasi & Profil) */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
        // title="Kelola Program Belajar"
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full">
          {/* Header Title & Tambah Program Button */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Program Belajar
            </h1>
            <Link
              href="/admin/programs/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm shadow-sm transition-all active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Tambah Program Baru</span>
            </Link>
          </div>

          {/* 3 Metric Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Program Aktif */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Program Aktif
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {activeCount} Program
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
            </div>

            {/* Card 2: Program Non Aktif */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Program Non Aktif
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {inactiveCount} Program
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">pause_circle</span>
              </div>
            </div>

            {/* Card 3: Total Program */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Total Program
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0284c7]">
                  {totalCount} Program
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">menu_book</span>
              </div>
            </div>
          </div>

          {/* Table Container (4 columns: NO, NAMA PROGRAM, STATUS, AKSI) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-white text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 text-center w-20">NO</th>
                    <th className="py-4 px-6">NAMA PROGRAM</th>
                    <th className="py-4 px-6 text-center w-52">STATUS</th>
                    <th className="py-4 px-6 text-center w-44">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {programs.map((item, index) => {
                    const isEnable = item.isActive;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-4 px-6 text-center text-slate-500 font-semibold text-sm">
                          {index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900 text-sm sm:text-[15px]">
                            {item.name}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            title="Klik untuk ubah status Enable / Disable"
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${isEnable
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isEnable ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}
                            />
                            <span>{isEnable ? 'Enable' : 'Disable'}</span>
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center justify-center gap-1.5">
                            {/* Detail Icon Button (Mata) */}
                            <button
                              type="button"
                              onClick={() => setDetailTarget(item)}
                              title="Lihat Detail Program"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#0284c7] hover:bg-sky-50 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                visibility
                              </span>
                            </button>

                            {/* Edit Icon Button (Pensil) */}
                            <Link
                              href={`/admin/programs/${item.id}/edit`}
                              title="Edit Program"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                edit
                              </span>
                            </Link>

                            {/* Hapus Icon Button (Tempat Sampah) */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              title="Hapus Program"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {programs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                        Belum ada program belajar yang ditambahkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DETAIL PROGRAM */}
      {detailTarget && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-200"
          onClick={() => setDetailTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform scale-100 transition-all flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284c7] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                </div>
                <h3 className="font-bold text-slate-800 text-base">Detail Program Belajar</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailTarget(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Nama Program
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {detailTarget.name}
                </h4>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${detailTarget.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${detailTarget.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                  />
                  <span>{detailTarget.isActive ? 'Enable' : 'Disable'}</span>
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Deskripsi Program
                </span>
                <p className="text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {detailTarget.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-medium text-slate-400 block mb-0.5">
                    Biaya Bulanan
                  </span>
                  <span className="text-xs font-bold text-[#0284c7] block">
                    Rp {detailTarget.fee.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-medium text-slate-400 block mb-0.5">
                    Jenjang Target
                  </span>
                  <span className="text-xs font-bold text-slate-800 block">
                    {detailTarget.gradeLevels}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-medium text-slate-400 block mb-0.5">
                    Mata Pelajaran
                  </span>
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    {detailTarget.subjects}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-medium text-slate-400 block mb-0.5">
                    Terakhir Diperbarui
                  </span>
                  <span className="text-xs font-bold text-slate-800 block">
                    {new Date(detailTarget.updatedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailTarget(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soft Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Konfirmasi Hapus Program"
        message={`Apakah Anda yakin ingin menghapus program "${deleteTarget?.name}"? Data akan disembunyikan dari antarmuka tetapi riwayat historis keikutsertaan siswa terdahulu tetap aman tersimpan di database.`}
        confirmText="Hapus Program"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleSoftDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 transition-all duration-300 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">
            check_circle
          </span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
