'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmModal from '@/components/common/ConfirmModal';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminContentLoading from '@/components/admin/AdminContentLoading';
import { programApi } from '@/lib/api/programs';
import { Program } from '@/types';

function AdminProgramsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [detailTarget, setDetailTarget] = useState<Program | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'aktif' | 'nonaktif'>('all');

  useEffect(() => {
    loadPrograms();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const loadPrograms = async () => {
    const startTime = Date.now();
    setIsLoading(true);
    try {
      const all = await programApi.getAll();
      all.sort((a, b) => a.displayOrder - b.displayOrder);
      setPrograms(all);
    } catch (err) {
      console.error('Failed to load programs', err);
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1200 - elapsed);
      if (remaining > 0) {
        await new Promise((res) => setTimeout(res, remaining));
      }
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (prog: Program) => {
    try {
      await programApi.toggleActive(prog.id);
      await loadPrograms();
      showToast(`Status "${prog.name}" diubah ke ${!prog.isActive ? 'Enable' : 'Disable'}`);
    } catch {
      showToast(`Gagal mengubah status program`);
    }
  };

  const handleSoftDelete = async () => {
    if (!deleteTarget) return;
    try {
      await programApi.delete(deleteTarget.id);
      showToast(`Program "${deleteTarget.name}" berhasil dihapus`);
      setDeleteTarget(null);
      await loadPrograms();
    } catch {
      showToast(`Gagal menghapus program`);
      setDeleteTarget(null);
    }
  };

  const activeCount = useMemo(() => programs.filter((p) => p.isActive).length, [programs]);
  const inactiveCount = useMemo(() => programs.filter((p) => !p.isActive).length, [programs]);
  const totalCount = programs.length;

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      if (statusFilter === 'aktif') return p.isActive;
      if (statusFilter === 'nonaktif') return !p.isActive;
      return true;
    });
  }, [programs, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          title='Program Belajar'
        />
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full">
          {isLoading ? (
            <AdminContentLoading />
          ) : (
            <>
              {toastMessage && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                    <span>{toastMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToastMessage(null)}
                    className="font-bold hover:opacity-70 text-base leading-none"
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Statistics Cards - Desain persis seperti Data Siswa */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xs border border-slate-200/70">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Card 1: Program Aktif */}
                  <button
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === 'aktif' ? 'all' : 'aktif')}
                    className={`p-4 sm:p-4.5 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer w-full group ${
                      statusFilter === 'aktif'
                        ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/50 border-slate-200/70 hover:border-emerald-300 hover:shadow-xs'
                    }`}
                    title="Klik untuk memfilter Program Aktif"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Program Aktif
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">check_circle</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#131b2e]">
                        {activeCount}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        Program Aktif
                      </span>
                    </div>
                  </button>

                  {/* Card 2: Program Non Aktif */}
                  <button
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === 'nonaktif' ? 'all' : 'nonaktif')}
                    className={`p-4 sm:p-4.5 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer w-full group ${
                      statusFilter === 'nonaktif'
                        ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-500/20 shadow-xs'
                        : 'bg-gradient-to-br from-purple-50/40 via-white to-slate-50/50 border-slate-200/70 hover:border-purple-300 hover:shadow-xs'
                    }`}
                    title="Klik untuk memfilter Program Non Aktif"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        Program Non Aktif
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">pause_circle</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#131b2e]">
                        {inactiveCount}
                      </span>
                      <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                        Nonaktif
                      </span>
                    </div>
                  </button>

                  {/* Card 3: Total Program */}
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`p-4 sm:p-4.5 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer w-full group ${
                      statusFilter === 'all'
                        ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                        : 'bg-gradient-to-br from-sky-50/40 via-white to-slate-50/50 border-slate-200/70 hover:border-sky-300 hover:shadow-xs'
                    }`}
                    title="Klik untuk menampilkan Semua Program"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                        Total Program
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#006194] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">menu_book</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#131b2e]">
                        {totalCount}
                      </span>
                      <span className="text-xs font-bold text-[#006194] bg-sky-100/70 px-2 py-0.5 rounded-md">
                        Semua Program
                      </span>
                    </div>
                  </button>

                  {/* Card 4: Action Card Tambah Program */}
                  <Link
                    href="/admin/programs/new"
                    className="p-4 sm:p-4.5 rounded-xl bg-gradient-to-br from-[#006194] to-[#0284c7] hover:from-[#004b73] hover:to-[#006194] text-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-sky-100 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">add_circle</span>
                        Program Baru
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-sky-200 group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between w-full">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                          Tambah Program
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">add</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Tabel Program */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                {statusFilter !== 'all' && (
                  <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">
                      Filter aktif:{' '}
                      <strong className="text-slate-900 font-bold">
                        {statusFilter === 'aktif' ? 'Program Aktif' : 'Program Non Aktif'}
                      </strong>{' '}
                      ({filteredPrograms.length} program ditemukan)
                    </span>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      className="text-[#006194] hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                      <span>Reset Filter</span>
                    </button>
                  </div>
                )}
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
                      {filteredPrograms.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-400 text-sm font-semibold">
                            {statusFilter !== 'all'
                              ? `Tidak ada program dengan status "${statusFilter === 'aktif' ? 'Aktif' : 'Non Aktif'}".`
                              : 'Belum ada program belajar yang ditambahkan.'}
                          </td>
                        </tr>
                      ) : (
                        filteredPrograms.map((item, index) => {
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
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                                    isEnable
                                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isEnable ? 'bg-emerald-500' : 'bg-slate-400'
                                    }`}
                                  />
                                  <span>{isEnable ? 'Enable' : 'Disable'}</span>
                                </button>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="inline-flex items-center justify-center gap-1.5">
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

                                  <Link
                                    href={`/admin/programs/${item.id}/edit`}
                                    title="Edit Program"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[20px]">
                                      edit
                                    </span>
                                  </Link>

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
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {detailTarget && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-200"
          onClick={() => setDetailTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform scale-100 transition-all flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
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
                    Biaya Perhari
                  </span>
                  <span className="text-xs font-bold text-[#0284c7] block">
                    Rp {detailTarget.fee.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-medium text-slate-400 block mb-0.5">
                    Jenjang
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

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Konfirmasi Hapus Program"
        message={`Apakah Anda yakin ingin menghapus program "${deleteTarget?.name}"?`}
        confirmText="Hapus"
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

export default function AdminProgramsPage() {
  return (
    <ProtectedRoute>
      <AdminProgramsContent />
    </ProtectedRoute>
  );
}
