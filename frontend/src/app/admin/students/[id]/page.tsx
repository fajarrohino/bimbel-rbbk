'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmModal from '@/components/common/ConfirmModal';
import { mockStore } from '@/lib/mockData';
import { Student, StudentProgram, Program, StudentStatus, StudentGender, ScheduleSession } from '@/types';

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [studentPrograms, setStudentPrograms] = useState<StudentProgram[]>([]);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);

  // Edit fields
  const [name, setName] = useState('');
  const [gender, setGender] = useState<StudentGender>('Laki-laki');
  const [birthDate, setBirthDate] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [parentName, setParentName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preferredSession, setPreferredSession] = useState<ScheduleSession>(1);
  const [note, setNote] = useState('');

  // Switch Program Modal state
  const [showSwitchProgramModal, setShowSwitchProgramModal] = useState(false);
  const [selectedNewProgramId, setSelectedNewProgramId] = useState('');
  const [switchNote, setSwitchNote] = useState('');

  // Reject Modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('Ditolak');

  // Soft Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Success / Error alerts
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = useCallback(() => {
    const allStudents = mockStore.getStudents();
    const found = allStudents.find((s) => s.id === studentId && !s.isDeleted);
    if (!found) {
      router.push('/admin/students');
      return;
    }
    setStudent(found);
    setName(found.name);
    setGender(found.gender);
    setBirthDate(found.birthDate);
    setGrade(found.grade);
    setSchool(found.school);
    setParentName(found.parentName);
    setWhatsapp(found.whatsapp);
    setPreferredSession(found.preferredSession);
    setNote(found.note || '');

    // Load Student Programs
    const allSP = mockStore.getStudentPrograms().filter((sp) => sp.studentId === studentId);
    allSP.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setStudentPrograms(allSP);

    // Load Available Active Programs
    const progs = mockStore.getPrograms().filter((p) => p.isActive && !p.isDeleted);
    setAvailablePrograms(progs);
    if (progs.length > 0) {
      setSelectedNewProgramId(progs[0].id);
    }
  }, [studentId, router]);

  useEffect(() => {
    if (!mockStore.getIsLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [loadData, router]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Update Student Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    const all = mockStore.getStudents();
    const updated = all.map((s) =>
      s.id === student.id
        ? {
            ...s,
            name: name.trim(),
            gender,
            birthDate,
            grade: grade.trim(),
            school: school.trim(),
            parentName: parentName.trim(),
            whatsapp: mockStore.normalizeWhatsApp(whatsapp),
            preferredSession,
            note: note.trim() || null,
            updatedAt: new Date().toISOString(),
          }
        : s
    );

    mockStore.saveStudents(updated);
    showToast('Data identitas siswa berhasil diperbarui!');
    loadData();
  };

  // 2. Accept Student (Pending -> Aktif, rejectionReason -> NULL) (PRD 6.3)
  const handleAcceptStudent = () => {
    if (!student) return;
    const all = mockStore.getStudents();
    const updated = all.map((s) =>
      s.id === student.id
        ? {
            ...s,
            status: 'Aktif' as StudentStatus,
            rejectionReason: null,
            updatedAt: new Date().toISOString(),
          }
        : s
    );
    mockStore.saveStudents(updated);
    showToast(`Pendaftaran ${student.name} berhasil diterima sebagai siswa Aktif!`);
    loadData();
  };

  // 3. Reject Student (Pending -> Nonaktif, rejectionReason disimpan) (PRD 6.3)
  const handleRejectStudent = () => {
    if (!student) return;
    const reason = rejectionReasonInput.trim() || 'Ditolak';
    const all = mockStore.getStudents();
    const updated = all.map((s) =>
      s.id === student.id
        ? {
            ...s,
            status: 'Nonaktif' as StudentStatus,
            rejectionReason: reason,
            updatedAt: new Date().toISOString(),
          }
        : s
    );
    mockStore.saveStudents(updated);
    setShowRejectModal(false);
    showToast(`Pendaftaran ${student.name} ditolak (Status: Nonaktif). Alasan: ${reason}`);
    loadData();
  };

  // 4. Deactivate Student (Aktif -> Nonaktif)
  const handleDeactivateStudent = () => {
    if (!student) return;
    const reason = prompt('Masukkan alasan penonaktifan (opsional):', 'Berhenti bimbingan') || 'Nonaktif';
    const all = mockStore.getStudents();
    const updated = all.map((s) =>
      s.id === student.id
        ? {
            ...s,
            status: 'Nonaktif' as StudentStatus,
            rejectionReason: reason,
            updatedAt: new Date().toISOString(),
          }
        : s
    );
    mockStore.saveStudents(updated);
    showToast(`Status siswa ${student.name} diubah menjadi Nonaktif.`);
    loadData();
  };

  // 5. Reactivate Student (Nonaktif -> Aktif, rejectionReason -> NULL)
  const handleReactivateStudent = () => {
    if (!student) return;
    const all = mockStore.getStudents();
    const updated = all.map((s) =>
      s.id === student.id
        ? {
            ...s,
            status: 'Aktif' as StudentStatus,
            rejectionReason: null,
            updatedAt: new Date().toISOString(),
          }
        : s
    );
    mockStore.saveStudents(updated);
    showToast(`Siswa ${student.name} berhasil diaktifkan kembali!`);
    loadData();
  };

  // 6. Switch Program (PRD 6.5)
  const handleSwitchProgram = () => {
    if (!student || !selectedNewProgramId) return;

    const chosenProg = availablePrograms.find((p) => p.id === selectedNewProgramId);
    if (!chosenProg) return;

    const now = new Date().toISOString();
    const allSP = mockStore.getStudentPrograms();

    // Mark current active programs of this student as 'Selesai'
    const updatedSP = allSP.map((sp) => {
      if (sp.studentId === student.id && sp.status === 'Aktif') {
        return {
          ...sp,
          status: 'Selesai' as const,
          updatedAt: now,
        };
      }
      return sp;
    });

    // Create new active program record with current snapshot name & fee
    const newRecord: StudentProgram = {
      id: 'sp-' + Date.now(),
      studentId: student.id,
      programId: chosenProg.id,
      programNameAtRegistration: chosenProg.name,
      feeAtRegistration: chosenProg.fee,
      status: 'Aktif',
      startedAt: now.split('T')[0],
      note: switchNote.trim() || 'Pindah program belajar',
      createdAt: now,
      updatedAt: now,
    };

    mockStore.saveStudentPrograms([newRecord, ...updatedSP]);
    setShowSwitchProgramModal(false);
    setSwitchNote('');
    showToast(`Berhasil memindahkan siswa ke program ${chosenProg.name}. Riwayat lama telah disimpan sebagai Selesai.`);
    loadData();
  };

  // 7. Soft Delete (Hanya jika Nonaktif) (PRD 6.3)
  const handleSoftDelete = () => {
    if (!student) return;
    if (student.status !== 'Nonaktif') {
      showToast('Hanya siswa berstatus Nonaktif yang dapat dihapus secara logis.', 'error');
      setShowDeleteModal(false);
      return;
    }
    const all = mockStore.getStudents();
    const updated = all.map((s) =>
      s.id === student.id
        ? { ...s, isDeleted: true, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        : s
    );
    mockStore.saveStudents(updated);
    router.push('/admin/students');
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          title={`Detail Siswa: ${student.name}`}
        />

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full">
          {/* Notification Toast */}
          {notification && (
            <div
              className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold shadow-sm ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  {notification.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{notification.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="font-bold text-lg leading-none"
              >
                &times;
              </button>
            </div>
          )}

          {/* Top Info Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <Link
                href="/admin/students"
                className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1 mb-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Kembali ke Daftar Siswa</span>
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <StatusBadge status={student.status} size="md" />
              </div>
              <p className="text-xs text-slate-500">
                Terdaftar sejak: {new Date(student.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Quick Actions based on status */}
            <div className="flex flex-wrap items-center gap-2.5">
              {student.status === 'Pending' && (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptStudent}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Terima Pendaftaran (Jadikan Aktif)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectionReasonInput('Ditolak');
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    <span>Tolak Pendaftaran</span>
                  </button>
                </>
              )}

              {student.status === 'Aktif' && (
                <button
                  type="button"
                  onClick={handleDeactivateStudent}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">person_off</span>
                  <span>Nonaktifkan Siswa</span>
                </button>
              )}

              {student.status === 'Nonaktif' && (
                <>
                  <button
                    type="button"
                    onClick={handleReactivateStudent}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_check</span>
                    <span>Aktifkan Kembali</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    <span>Soft Delete</span>
                  </button>
                </>
              )}

              <a
                href={`https://wa.me/${student.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600">chat</span>
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Rejection / Note Warning banner if available */}
          {student.rejectionReason && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
              <span className="material-symbols-outlined text-rose-600 text-[20px]">info</span>
              <div>
                <p className="font-bold">Alasan Penolakan / Status Terakhir:</p>
                <p className="mt-0.5">{student.rejectionReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Edit Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0284c7]">badge</span>
                  <h2 className="text-base font-bold text-slate-900">Edit Data Identitas Siswa</h2>
                </div>
                <span className="text-xs text-slate-400">Menimpa data langsung</span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="stdName">
                    Nama Siswa *
                  </label>
                  <input
                    id="stdName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="stdGender">
                      Jenis Kelamin
                    </label>
                    <select
                      id="stdGender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as StudentGender)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="stdBirthDate">
                      Tanggal Lahir
                    </label>
                    <input
                      id="stdBirthDate"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="stdGrade">
                      Kelas
                    </label>
                    <input
                      id="stdGrade"
                      type="text"
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="stdSchool">
                      Asal Sekolah
                    </label>
                    <input
                      id="stdSchool"
                      type="text"
                      required
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="stdParentName">
                      Nama Orang Tua
                    </label>
                    <input
                      id="stdParentName"
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="stdPhone">
                      WhatsApp
                    </label>
                    <input
                      id="stdPhone"
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="stdSession">
                    Preferensi Sesi
                  </label>
                  <select
                    id="stdSession"
                    value={preferredSession}
                    onChange={(e) => setPreferredSession(Number(e.target.value) as ScheduleSession)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  >
                    <option value={1}>Sesi 1 (14.00 – 15.00 WIB)</option>
                    <option value={2}>Sesi 2 (16.00 – 17.00 WIB)</option>
                    <option value={3}>Sesi 3 (19.00 – 20.00 WIB)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="stdNote">
                    Catatan Khusus
                  </label>
                  <textarea
                    id="stdNote"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Simpan Perubahan Identitas</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Riwayat Program Belajar (5 Cols) (PRD Section 6.5) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-700">history_edu</span>
                  <h2 className="text-base font-bold text-slate-900">Riwayat Program Bimbingan</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSwitchProgramModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  <span>Pindah Program</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Setiap periode keikutsertaan dicatat terpisah. Nama program dan biaya tersimpan sebagai snapshot historis.
              </p>

              <div className="space-y-3">
                {studentPrograms.map((sp) => (
                  <div
                    key={sp.id}
                    className={`p-4 rounded-xl border transition-all ${
                      sp.status === 'Aktif'
                        ? 'bg-teal-50/60 border-teal-200'
                        : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        {sp.programNameAtRegistration}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sp.status === 'Aktif'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {sp.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Biaya Snapshot:</span>
                        <span className="font-bold text-slate-800">
                          Rp {sp.feeAtRegistration.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tanggal Mulai:</span>
                        <span>{sp.startedAt}</span>
                      </div>
                      {sp.note && (
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                          Catatan: {sp.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {studentPrograms.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Belum ada riwayat program tercatat.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Tolak Pendaftaran Siswa</h3>
            <p className="text-xs text-slate-600">
              Status siswa akan diubah menjadi <strong>Nonaktif</strong>. Silakan masukkan alasan penolakan (PRD 6.3):
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alasan Penolakan (Default: Ditolak)
              </label>
              <input
                type="text"
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="Contoh: Kuota sesi penuh / Jadwal tidak cocok"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRejectStudent}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Tolak Pendaftaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Program Modal (PRD Section 6.5) */}
      {showSwitchProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="material-symbols-outlined text-teal-600">swap_horiz</span>
              <h3 className="text-base font-bold text-slate-900">Pindah Program Bimbingan</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sesuai aturan PRD 6.5, program saat ini akan ditandai <strong>Selesai</strong> dan program baru akan dibuat sebagai <strong>Aktif</strong> dengan snapshot nama dan biaya saat ini.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Program Baru:
                </label>
                <select
                  value={selectedNewProgramId}
                  onChange={(e) => setSelectedNewProgramId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                >
                  {availablePrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Rp {p.fee.toLocaleString('id-ID')} ({p.gradeLevels})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Perpindahan (Opsional):
                </label>
                <input
                  type="text"
                  value={switchNote}
                  onChange={(e) => setSwitchNote(e.target.value)}
                  placeholder="Contoh: Naik jenjang dari Calistung ke Tematik SD"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSwitchProgramModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSwitchProgram}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
              >
                Konfirmasi Pindah Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soft Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Konfirmasi Soft Delete Siswa"
        message={`Hapus siswa "${student.name}" secara logis? Data akan disembunyikan dari daftar antarmuka namun seluruh riwayat pembelajaran masa lalu tetap aman di database.`}
        confirmText="Hapus Siswa"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleSoftDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
