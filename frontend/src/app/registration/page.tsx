'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { mockStore } from '@/lib/mockData';
import { StudentGender, ScheduleSession, Student, StudentProgram } from '@/types';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    question: 'Apakah ada tes masuk sebelum diterima di RBBK?',
    answer:
      'Tidak ada tes seleksi yang menegangkan. Kami hanya melakukan tes pemetaan santai (diagnostic assessment) pada pertemuan awal untuk mengenali kemampuan dasar, gaya belajar anak, dan materi pelajaran yang paling membutuhkan bimbingan intensif.',
  },
  {
    question: 'Bagaimana sistem pembayaran dan berapa biayanya?',
    answer:
      'Sistem pembayaran sangat fleksibel. Orang tua dapat memilih pembayaran per pertemuan (mulai dari Rp10.000) atau paket bulanan yang lebih hemat. Tidak ada biaya administrasi pendaftaran atau uang gedung tersembunyi.',
  },
  {
    question: 'Apakah bimbingan belajar berbentuk les privat atau kelompok?',
    answer:
      'Rumah Belajar mengutamakan kelompok kecil (3 hingga 5 siswa per sesi) agar anak tetap bersosialisasi dan bertukar pikiran namun tetap mendapatkan perhatian personal penuh dari pengajar. Layanan privat 1-on-1 juga tersedia atas permintaan khusus orang tua.',
  },
  {
    question: 'Bagaimana jika anak berhalangan hadir di jadwal tertentu?',
    answer:
      'Cukup kabari Bu Khotimah melalui WhatsApp paling lambat 2 jam sebelum sesi bimbingan dimulai. Anak dapat mengikuti sesi pengganti di kelompok lain atau mendapatkan rangkuman tugas mandiri tanpa dikenakan denda.',
  },
];

const AVAILABLE_PROGRAMS = [
  'Calistung Dasar',
  'Pendampingan PR Harian',
  'Kurikulum Sekolah (SD/MI)',
  'Penguatan Materi',
  'Persiapan ASTS / ASAS',
  'Komputer Dasar Siswa',
];

export default function RegisterPage() {
  // Form State
  const [childName, setChildName] = useState('');
  const [childBirthDate, setChildBirthDate] = useState('');
  const [childGender, setChildGender] = useState<StudentGender | ''>('');
  const [childGrade, setChildGrade] = useState('');
  const [childSchool, setChildSchool] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentWA, setParentWA] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(['Pendampingan PR Harian']);
  const [studyTime, setStudyTime] = useState<string>('Sesi 1 (14:00 - 15:00)');
  const [childNotes, setChildNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // first item open by default

  const toggleProgram = (program: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(program) ? prev.filter((p) => p !== program) : [...prev, program]
    );
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!childName.trim()) {
      setErrorMessage('Nama lengkap anak wajib diisi');
      return;
    }
    if (!childGender) {
      setErrorMessage('Pilih jenis kelamin anak');
      return;
    }
    if (!childBirthDate) {
      setErrorMessage('Tanggal lahir anak wajib diisi');
      return;
    }
    if (!childGrade) {
      setErrorMessage('Pilih kelas anak');
      return;
    }
    if (!childSchool.trim()) {
      setErrorMessage('Asal sekolah wajib diisi');
      return;
    }
    if (!parentName.trim()) {
      setErrorMessage('Nama orang tua / wali wajib diisi');
      return;
    }
    if (!parentWA.trim()) {
      setErrorMessage('Nomor WhatsApp wajib diisi');
      return;
    }
    if (selectedPrograms.length === 0) {
      setErrorMessage('Pilih minimal satu program bimbingan');
      return;
    }

    setIsSubmitting(true);

    try {
      const studentId = 'std-' + Date.now();
      const now = new Date().toISOString();
      const cleanPhone = mockStore.normalizeWhatsApp(parentWA);

      // Determine preferred session number (1, 2, or 3)
      let sessionNum: ScheduleSession = 1;
      if (studyTime.includes('Sesi 2')) sessionNum = 2;
      if (studyTime.includes('Sesi 3')) sessionNum = 3;

      // 1. Save new Student in mockStore with status Pending (PRD 6.2)
      const newStudent: Student = {
        id: studentId,
        name: childName.trim(),
        gender: childGender as StudentGender,
        birthDate: childBirthDate,
        grade: childGrade,
        school: childSchool.trim(),
        parentName: parentName.trim(),
        whatsapp: cleanPhone,
        preferredSession: sessionNum,
        status: 'Pending',
        note: childNotes.trim() || undefined,
        rejectionReason: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      const existingStudents = mockStore.getStudents();
      mockStore.saveStudents([newStudent, ...existingStudents]);

      // 2. Associate with first matched program or placeholder
      const allPrograms = mockStore.getPrograms();
      const matchedProgram = allPrograms.find((p) =>
        selectedPrograms.some((sp) => p.name.toLowerCase().includes(sp.toLowerCase().split(' ')[0]))
      ) || allPrograms[0];

      if (matchedProgram) {
        const studentProgram: StudentProgram = {
          id: 'sp-' + Date.now(),
          studentId: studentId,
          programId: matchedProgram.id,
          programNameAtRegistration: matchedProgram.name,
          feeAtRegistration: matchedProgram.fee,
          status: 'Aktif',
          startedAt: now,
          note: null,
          createdAt: now,
          updatedAt: now,
        };
        const existingSP = mockStore.getStudentPrograms();
        mockStore.saveStudentPrograms([...existingSP, studentProgram]);
      }

      // 3. Compose WhatsApp message
      const programList = selectedPrograms.join(', ');
      const rawWa = parentWA.startsWith('0') ? parentWA.slice(1) : parentWA;
      const notesFormatted = childNotes.trim() || '-';

      const waText =
        `Halo Bu Khotimah, saya ingin mendaftarkan anak saya di Rumah Belajar:%0A%0A` +
        `*Data Anak:*%0A` +
        `- Nama Anak: ${encodeURIComponent(childName.trim())}%0A` +
        `- Jenis Kelamin: ${encodeURIComponent(childGender)}%0A` +
        `- Tanggal Lahir: ${encodeURIComponent(childBirthDate)}%0A` +
        `- Kelas: ${encodeURIComponent(childGrade)}%0A` +
        `- Asal Sekolah: ${encodeURIComponent(childSchool.trim())}%0A%0A` +
        `*Data Orang Tua:*%0A` +
        `- Nama Wali: ${encodeURIComponent(parentName.trim())}%0A` +
        `- No. WhatsApp: +62${encodeURIComponent(rawWa)}%0A%0A` +
        `*Program Pilihan:* ${encodeURIComponent(programList)}%0A` +
        `*Pilihan Waktu:* ${encodeURIComponent(studyTime)}%0A` +
        `*Catatan Anak:* ${encodeURIComponent(notesFormatted)}%0A%0A` +
        `Mohon info ketersediaan jadwal belajar terdekat. Terima kasih!`;

      setSuccessNotice(true);

      // Open WhatsApp after short delay
      setTimeout(() => {
        window.open(`https://wa.me/6285865777636?text=${waText}`, '_blank');
        setIsSubmitting(false);
      }, 700);
    } catch {
      setErrorMessage('Terjadi kesalahan saat memproses pendaftaran. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full flex-1">
        <div className="flex flex-col w-full">
          {/* Top Decorative Ambient Aura */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-primary-fixed/40 via-secondary-container/20 to-transparent blur-3xl pointer-events-none rounded-full"></div>
            
            {/* Hero / Lead Introduction */}
            <section className="relative max-w-[1200px] mx-auto px-margin-mobile lg:px-margin pt-10 pb-12 lg:pt-14 lg:pb-16 text-center">
              <h1 className="font-display-hero text-3xl sm:text-4xl md:text-5xl lg:text-display-hero max-w-4xl mx-auto text-on-surface tracking-tight leading-tight mb-5 font-extrabold">
                Mulai Langkah Cerdas Putra-Putri Anda Bersama{' '}
                <span className="text-primary underline decoration-secondary decoration-wavy decoration-2 underline-offset-8">
                  Bu Khotimah
                </span>
              </h1>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest shadow-sm text-on-surface font-label-md text-label-md">
                  <span className="text-tertiary material-symbols-outlined text-[18px]">group</span>
                  <span>Kuota Terbatas (Maks. 5-6 Siswa)</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest shadow-sm text-on-surface font-label-md text-label-md">
                  <span className="text-secondary material-symbols-outlined text-[18px]">verified</span>
                  <span>Pendampingan Personal</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest shadow-sm text-on-surface font-label-md text-label-md">
                  <span className="text-tertiary-container material-symbols-outlined text-[18px]">payments</span>
                  <span>Mulai 10ribuan/ pertemuan</span>
                </div>
              </div>
            </section>
          </div>

          {/* Alur Pendaftaran (3 Langkah Praktis) */}
          <section className="w-full bg-surface-container-low py-12">
            <div className="max-w-[1200px] mx-auto px-margin-mobile lg:px-margin">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    3 Langkah Mudah Pendaftaran
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Step 1 */}
                <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm relative group hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-lg bg-primary-fixed text-primary font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                      01
                    </span>
                    <span className="material-symbols-outlined text-primary text-[24px]">edit_note</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">
                    Isi Formulir Online
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Lengkapi profil anak, jenjang kelas, serta program dan preferensi jam bimbingan yang diinginkan.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm relative group hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-lg bg-secondary-container text-secondary font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                      02
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[24px]">forum</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">
                    Konfirmasi &amp; Konsultasi
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Bu Khotimah akan menghubungi via WhatsApp untuk menyelaraskan jadwal dan asesmen materi awal.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm relative group hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-lg bg-tertiary-fixed text-tertiary font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                      03
                    </span>
                    <span className="material-symbols-outlined text-tertiary text-[24px]">celebration</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">
                    Siap Belajar Menyenangkan
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Anak siap mengikuti sesi bimbingan perdana dalam kelompok kecil yang nyaman dan memotivasi.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Registration Section: Split 7:5 Layout */}
          <section className="max-w-[1200px] mx-auto px-margin-mobile lg:px-margin py-14 lg:py-20 w-full" id="form-daftar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Interactive Form (7 Cols) */}
              <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 lg:p-10 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-6 pb-4">
                  <div>
                    <span className="text-secondary font-label-sm text-label-sm uppercase tracking-wider block font-semibold">
                      Registrasi Digital
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Formulir Peserta Didik Baru
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed/50 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">assignment</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-error">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form className="flex flex-col gap-6" id="regForm" onSubmit={handleSubmit}>
                  {/* Bagian Data Siswa */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        1. Data Siswa
                      </h3>
                    </div>

                    {/* Nama Lengkap Anak */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="childName">
                        Nama Lengkap Anak <span className="text-error">*</span>
                      </label>
                      <input
                        className="w-full h-12 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006194] transition-all"
                        id="childName"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="Contoh: Muhammad Rayyan Firdaus"
                        required
                        type="text"
                      />
                    </div>

                    {/* Jenis Kelamin */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="childGender">
                        Jenis Kelamin <span className="text-error">*</span>
                      </label>
                      <select
                        className="w-full h-12 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006194] transition-all"
                        id="childGender"
                        value={childGender}
                        onChange={(e) => setChildGender(e.target.value as StudentGender)}
                        required
                      >
                        <option disabled value="">
                          Pilih Jenis Kelamin
                        </option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    {/* Tanggal Lahir & Pilihan Kelas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="childBirthDate">
                          Tanggal Lahir <span className="text-error">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-full h-12 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006194] transition-all"
                          id="childBirthDate"
                          value={childBirthDate}
                          onChange={(e) => setChildBirthDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="childGrade">
                          Kelas <span className="text-error">*</span>
                        </label>
                        <select
                          className="w-full h-12 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006194] transition-all"
                          id="childGrade"
                          value={childGrade}
                          onChange={(e) => setChildGrade(e.target.value)}
                          required
                        >
                          <option disabled value="">
                            Pilih Kelas
                          </option>
                          <option value="Kelas 1">Kelas 1</option>
                          <option value="Kelas 2">Kelas 2</option>
                          <option value="Kelas 3">Kelas 3</option>
                          <option value="Kelas 4">Kelas 4</option>
                          <option value="Kelas 5">Kelas 5</option>
                          <option value="Kelas 6">Kelas 6</option>
                        </select>
                      </div>
                    </div>

                    {/* Asal Sekolah */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="childSchool">
                        Asal Sekolah SD / MI <span className="text-error">*</span>
                      </label>
                      <input
                        className="w-full h-12 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006194] transition-all"
                        id="childSchool"
                        value={childSchool}
                        onChange={(e) => setChildSchool(e.target.value)}
                        placeholder="Contoh: SDN 1 Sumingkir / MIM Bantarbarang"
                        required
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Bagian Data Orang Tua */}
                  <div className="flex flex-col gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        2. Kontak Orang Tua / Wali
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="parentName">
                          Nama Orang Tua / Wali <span className="text-error">*</span>
                        </label>
                        <input
                          className="w-full h-12 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006194] transition-all"
                          id="parentName"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          placeholder="Nama Ibu atau Ayah"
                          required
                          type="text"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="parentWA">
                          Nomor WhatsApp Aktif <span className="text-error">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 font-label-md text-label-md text-on-surface-variant font-bold">
                            +62
                          </span>
                          <input
                            className="w-full h-12 pl-14 pr-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006194] transition-all"
                            id="parentWA"
                            value={parentWA}
                            onChange={(e) => setParentWA(e.target.value)}
                            placeholder="812-3456-7890"
                            required
                            type="tel"
                          />
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Konfirmasi jadwal dan rincian bimbingan dikirim ke nomor ini.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bagian Pilihan Program Belajar */}
                  <div className="flex flex-col gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          3. Program Bimbingan Pilihan
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="programOptions">
                      {AVAILABLE_PROGRAMS.map((prog) => {
                        const isChecked = selectedPrograms.includes(prog);
                        return (
                          <label
                            key={prog}
                            className={`program-chip flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                              isChecked
                                ? 'bg-primary-fixed/30 border-primary text-primary font-semibold'
                                : 'bg-surface-container-low border-transparent hover:bg-surface-container text-on-surface'
                            }`}
                          >
                            <input
                              className="mt-1 accent-primary w-4 h-4 rounded"
                              name="program"
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleProgram(prog)}
                            />
                            <div className="flex flex-col">
                              <span className="font-label-lg text-label-md">{prog}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferensi Waktu & Catatan */}
                  <div className="flex flex-col gap-5 pt-2">
                    <div className="flex flex-col gap-2.5 w-full">
                      <label className="font-label-md text-label-md text-on-surface flex items-center justify-between font-medium">
                        <span>Pilihan Waktu Belajar <span className="text-error">*</span></span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="studyTimeContainer">
                        {[
                          { session: 'Sesi 1', time: '14:00 - 15:00', val: 'Sesi 1 (14:00 - 15:00)' },
                          { session: 'Sesi 2', time: '16:00 - 17:00', val: 'Sesi 2 (16:00 - 17:00)' },
                          { session: 'Sesi 3', time: '19:00 - 20:00', val: 'Sesi 3 (19:00 - 20:00)' },
                        ].map((item) => {
                          const isSelected = studyTime === item.val;
                          return (
                            <label
                              key={item.session}
                              className={`flex flex-col items-start justify-center p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all shadow-sm text-left ${
                                isSelected
                                  ? 'bg-primary-fixed/50 border-primary ring-1 ring-primary'
                                  : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                              }`}
                            >
                              <input
                                className="sr-only"
                                name="studyTime"
                                required
                                type="radio"
                                value={item.val}
                                checked={isSelected}
                                onChange={() => setStudyTime(item.val)}
                              />
                              <span className="text-base text-primary font-bold mb-1">{item.session}</span>
                              <span className="text-sm font-medium text-on-surface">{item.time}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="childNotes">
                        Catatan Khusus Kebutuhan Anak
                      </label>
                      <input
                        className="w-full h-12 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006194] transition-all"
                        id="childNotes"
                        value={childNotes}
                        onChange={(e) => setChildNotes(e.target.value)}
                        placeholder="Misal: Pemalu, butuh dibimbing berhitung pembagian, atau preferensi belajar lain"
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Privacy statement & Submit CTA Button */}
                  <div className="flex flex-col gap-4 pt-4">
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">lock</span>
                      <span>
                        Data anak dan kontak orang tua terlindungi secara aman hanya untuk keperluan bimbingan.
                      </span>
                    </div>

                    <button
                      className="w-full h-14 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span className="material-symbols-outlined text-[24px]">send</span>
                      <span>
                        {isSubmitting
                          ? 'Memproses Pendaftaran...'
                          : 'Kirim Pendaftaran & Konfirmasi ke WhatsApp'}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Feedback Success Notice */}
                {successNotice && (
                  <div className="mt-6 p-6 rounded-xl bg-secondary-container text-on-secondary-container animate-fadeIn" id="successNotice">
                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-[32px] text-secondary shrink-0">check_circle</span>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-headline-sm text-headline-sm font-bold">Pendaftaran Berhasil Dikirim!</h4>
                        <p className="font-body-md text-body-md">
                          Menghubungkan ke WhatsApp Bu Khotimah untuk pencocokan kuota dan pengenalan materi pertama anak Anda...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Visual Summary, Image & Trust Badges (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Image Card Hero Superhero Anak */}
                <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-fixed to-secondary-container p-6 relative shadow-md">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-40 h-48 shrink-0 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-surface-container-lowest/40 rounded-full blur-xl"></div>
                      <Image
                        src="/hero.png"
                        alt="Semangat Belajar Anak RBBK"
                        width={160}
                        height={192}
                        className="relative z-10 max-h-48 object-contain drop-shadow-lg"
                      />
                    </div>
                    <div className="flex flex-col text-on-background">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                        Generasi Percaya Diri
                      </span>
                      <h3 className="font-headline-sm text-headline-sm font-bold mt-1 text-on-background">
                        Anak Cerdas, Orang Tua Tenang
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                        Setiap anak adalah pahlawan kecil dengan potensi besar yang butuh bimbingan penuh kasih sayang.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mengapa Memilih RBBK Box */}
                <div className="rounded-xl bg-surface-container p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
                    <span>Mengapa Memilih RBBK?</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">cottage</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg text-label-md text-on-surface font-semibold">
                          Suasana Hangat Seperti di Rumah
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Ruang belajar tenang, tidak intimidatif, membuat anak betah bertanya tanpa takut salah.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-secondary-container text-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">favorite</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg text-label-md text-on-surface font-semibold">
                          Pengajar Ramah &amp; Penuh Kesabaran
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Dibimbing langsung oleh Bu Khotimah dengan teknik pedagogik yang disukai anak SD.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">insights</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg text-label-md text-on-surface font-semibold">
                          Evaluasi &amp; Laporan Berkala
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Orang tua selalu mendapat update perkembangan pemahaman dan kemandirian anak.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">savings</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg text-label-md text-on-surface font-semibold">
                          Biaya Fleksibel &amp; Terjangkau
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Komitmen kami adalah membantu pendidikan anak desa dengan biaya yang sangat bersahabat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bantuan Cepat WhatsApp */}
                <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">contact_support</span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Butuh Konsultasi Awal?
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Respon ramah dalam &lt; 15 menit
                      </p>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Jika ada keraguan mengenai program yang cocok atau ingin menanyakan jadwal khusus, silakan mengobrol langsung dengan Bu Khotimah.
                  </p>
                  <a
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-secondary text-on-secondary font-label-lg text-label-md font-semibold hover:opacity-95 transition-all shadow-sm"
                    href="https://wa.me/6285865777636?text=Halo%20Bu%20Khotimah,%20saya%20ingin%20tanya%20info%20pendaftaran%20bimbingan%20belajar%20RBBK"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>Tanya Admin via WhatsApp</span>
                  </a>
                </div>

                {/* Box Alamat Lokasi */}
                <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary font-label-md text-label-md font-semibold">
                    <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                    <span>Lokasi Bimbingan Belajar</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface font-semibold">
                    Rumah Belajar Bu Khotimah
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Sumingkir, Bantarbarang RT 03 RW 09 No 48, Kec. Rembang, Kabupaten Purbalingga, Jawa Tengah 53356.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Pendaftaran */}
          <section className="w-full bg-surface-container-low py-14 lg:py-20">
            <div className="max-w-[960px] mx-auto px-margin-mobile lg:px-margin">
              <div className="text-center mb-10">
                <span className="text-primary font-label-sm text-label-sm uppercase tracking-wider block mb-1 font-semibold">
                  Pertanyaan Seputar Pendaftaran
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Tanya Jawab Pendaftaran (FAQ)
                </h2>
              </div>

              <div className="flex flex-col gap-4" id="faqList">
                {FAQ_LIST.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.question}
                      className="faq-item rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-all duration-200"
                    >
                      <button
                        className="w-full text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                        onClick={() => toggleFaq(idx)}
                        type="button"
                      >
                        <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                          {faq.question}
                        </span>
                        <span
                          className={`material-symbols-outlined text-primary faq-icon transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="faq-content mt-3 pt-3 border-t border-slate-100 text-on-surface-variant font-body-md text-body-md leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
