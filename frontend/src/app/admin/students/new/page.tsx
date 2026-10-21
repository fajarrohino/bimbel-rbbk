'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { mockStore } from '@/lib/mockData';
import { Student, StudentGender, ScheduleSession, Program, StudentProgram } from '@/types';

export default function NewStudentPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<StudentGender>('Laki-laki');
  const [birthDate, setBirthDate] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [parentName, setParentName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preferredSession, setPreferredSession] = useState<ScheduleSession>(1);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!mockStore.getIsLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    const allProg = mockStore.getPrograms().filter((p) => p.isActive && !p.isDeleted);
    setPrograms(allProg);
    if (allProg.length > 0) {
      setSelectedProgramId(allProg[0].id);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama siswa wajib diisi');
      return;
    }
    if (!birthDate) {
      setError('Tanggal lahir wajib diisi');
      return;
    }
    if (!grade.trim()) {
      setError('Kelas wajib diisi');
      return;
    }
    if (!school.trim()) {
      setError('Asal sekolah wajib diisi');
      return;
    }
    if (!parentName.trim()) {
      setError('Nama orang tua wajib diisi');
      return;
    }
    if (!whatsapp.trim()) {
      setError('Nomor WhatsApp wajib diisi');
      return;
    }
    if (!selectedProgramId) {
      setError('Pilih program belajar awal');
      return;
    }

    setIsSubmitting(true);

    try {
      const studentId = 'std-' + Date.now();
      const now = new Date().toISOString();
      const cleanPhone = mockStore.normalizeWhatsApp(whatsapp);
      const chosenProgram = programs.find((p) => p.id === selectedProgramId);

      // PRD 6.3: Siswa yang ditambahkan admin berstatus "Aktif"
      const newStudent: Student = {
        id: studentId,
        name: name.trim(),
        gender,
        birthDate,
        grade: grade.trim(),
        school: school.trim(),
        parentName: parentName.trim(),
        whatsapp: cleanPhone,
        preferredSession,
        status: 'Aktif',
        note: note.trim() || null,
        rejectionReason: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      const existingStudents = mockStore.getStudents();
      mockStore.saveStudents([newStudent, ...existingStudents]);

      // Snapshot program di student_programs (PRD 6.5)
      if (chosenProgram) {
        const newSP: StudentProgram = {
          id: 'sp-' + Date.now(),
          studentId: studentId,
          programId: chosenProgram.id,
          programNameAtRegistration: chosenProgram.name,
          feeAtRegistration: chosenProgram.fee,
          status: 'Aktif',
          startedAt: now.split('T')[0],
          note: 'Ditambahkan langsung oleh Admin',
          createdAt: now,
          updatedAt: now,
        };
        const existingSP = mockStore.getStudentPrograms();
        mockStore.saveStudentPrograms([newSP, ...existingSP]);
      }

      router.push('/admin/students');
    } catch {
      setError('Gagal menambahkan siswa. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          title="Tambah Siswa Baru"
        />

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-4xl w-full">
          <div>
            <Link
              href="/admin/students"
              className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1 mb-2"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Kembali ke Daftar Siswa</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Tambah Siswa Baru (Status: Aktif)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Sesuai aturan PRD, siswa yang ditambahkan langsung oleh admin otomatis berstatus <strong>Aktif</strong> dan langsung dapat dijadwalkan pada menu Atur Jadwal.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bagian Data Siswa */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
                  Data Diri Siswa
                </h2>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="name">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Dimas Bagus Wibowo"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="gender">
                      Jenis Kelamin *
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as StudentGender)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="birthDate">
                      Tanggal Lahir *
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="grade">
                      Jenjang / Kelas *
                    </label>
                    <input
                      id="grade"
                      type="text"
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Contoh: Kelas 5 SD"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="school">
                      Asal Sekolah *
                    </label>
                    <input
                      id="school"
                      type="text"
                      required
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Contoh: SD Negeri 1 Purbalingga"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>
              </div>

              {/* Data Orang Tua & Kontak */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
                  Data Orang Tua &amp; Kontak WhatsApp
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="parentName">
                      Nama Orang Tua / Wali *
                    </label>
                    <input
                      id="parentName"
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Contoh: Bpk. Tri Wibowo"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="whatsapp">
                      Nomor WhatsApp *
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Contoh: 081399887766"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>
              </div>

              {/* Program & Sesi */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
                  Program Bimbingan &amp; Sesi
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="program">
                      Program Belajar Awal *
                    </label>
                    <select
                      id="program"
                      value={selectedProgramId}
                      onChange={(e) => setSelectedProgramId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Rp {p.fee.toLocaleString('id-ID')})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="preferredSession">
                      Preferensi Sesi *
                    </label>
                    <select
                      id="preferredSession"
                      value={preferredSession}
                      onChange={(e) => setPreferredSession(Number(e.target.value) as ScheduleSession)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    >
                      <option value={1}>Sesi 1 (14.00 – 15.00 WIB)</option>
                      <option value={2}>Sesi 2 (16.00 – 17.00 WIB)</option>
                      <option value={3}>Sesi 3 (19.00 – 20.00 WIB)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="note">
                    Catatan Guru / Penyesuaian (Opsional)
                  </label>
                  <textarea
                    id="note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Catatan tambahan mengenai kondisi atau target belajar siswa..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href="/admin/students"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-70"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Siswa Aktif'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
