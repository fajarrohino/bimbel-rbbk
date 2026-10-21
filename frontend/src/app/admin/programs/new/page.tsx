'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { mockStore } from '@/lib/mockData';
import { Program } from '@/types';

export default function NewProgramPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gradeLevels, setGradeLevels] = useState('');
  const [subjects, setSubjects] = useState('');
  const [fee, setFee] = useState<number | ''>('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama program wajib diisi');
      return;
    }
    if (!description.trim()) {
      setError('Deskripsi program wajib diisi');
      return;
    }
    if (!gradeLevels.trim()) {
      setError('Jenjang target wajib diisi');
      return;
    }
    if (!subjects.trim()) {
      setError('Mata pelajaran wajib diisi');
      return;
    }
    if (fee === '' || Number(fee) <= 0) {
      setError('Biaya bimbingan wajib diisi dengan nominal valid');
      return;
    }

    setIsSubmitting(true);

    try {
      const all = mockStore.getPrograms();
      // Calculate displayOrder automatically: max(displayOrder) of active and non-deleted + 1 (PRD 6.4)
      const activeNonDeleted = all.filter((p) => p.isActive && !p.isDeleted);
      const maxDisplayOrder = activeNonDeleted.reduce(
        (max, p) => (p.displayOrder > max ? p.displayOrder : max),
        0
      );
      const nextDisplayOrder = maxDisplayOrder + 1;

      const now = new Date().toISOString();
      const newProgram: Program = {
        id: 'prog-' + Date.now(),
        name: name.trim(),
        description: description.trim(),
        gradeLevels: gradeLevels.trim(),
        subjects: subjects.trim(),
        fee: Number(fee),
        isActive,
        displayOrder: nextDisplayOrder,
        isDeleted: false,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      mockStore.savePrograms([...all, newProgram]);
      router.push('/admin/programs');
    } catch {
      setError('Gagal menyimpan program. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          title="Tambah Program Baru"
        />

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-4xl w-full">
          {/* Breadcrumb & Title */}
          <div>
            <Link
              href="/admin/programs"
              className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1 mb-2"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Kembali ke Daftar Program</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Formulir Tambah Program Belajar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Nomor urut tampilan (displayOrder) akan otomatis ditentukan oleh sistem pada posisi terakhir.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="name">
                  Nama Program Belajar *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Matematika Logis & Menyenangkan"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="description">
                  Deskripsi Lengkap Program *
                </label>
                <textarea
                  id="description"
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan fokus bimbingan, manfaat belajar, dan pendekatan yang digunakan..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="gradeLevels">
                    Jenjang Siswa Target * (Teks bebas)
                  </label>
                  <input
                    id="gradeLevels"
                    type="text"
                    required
                    value={gradeLevels}
                    onChange={(e) => setGradeLevels(e.target.value)}
                    placeholder="Contoh: Kelas 3 - 6 SD"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="subjects">
                    Mata Pelajaran Bimbingan * (Teks bebas)
                  </label>
                  <input
                    id="subjects"
                    type="text"
                    required
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                    placeholder="Contoh: Matematika Dasar, Logika Berhitung"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="fee">
                    Biaya Bimbingan Bulanan (Rp) *
                  </label>
                  <input
                    id="fee"
                    type="number"
                    required
                    min={0}
                    step={5000}
                    value={fee}
                    onChange={(e) => setFee(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Contoh: 200000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Status Program
                  </label>
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#0284c7] rounded focus:ring-[#0284c7]"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Aktifkan Program (Tampil di Home &amp; Formulir)
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href="/admin/programs"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-70"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Program Baru'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
