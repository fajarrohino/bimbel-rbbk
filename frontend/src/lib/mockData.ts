import { Program, Student, StudentProgram, ScheduleAssignment, ScheduleSession } from '@/types';

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'prog-1',
    name: 'Calistung (Baca, Tulis, Hitung)',
    description: 'Bimbingan pondasi membaca suku kata, menulis rapi, dan berhitung angka dasar secara ramah dan menyenangkan untuk anak usia dini.',
    gradeLevels: 'TK B - Kelas 1 SD',
    subjects: 'Membaca, Menulis, Berhitung Dasar',
    fee: 150000,
    isActive: true,
    displayOrder: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'prog-2',
    name: 'Matematika Dasar & Logika',
    description: 'Pendalaman konsep dasar hitung, pecahan, logika matematika, serta latihan trik cepat pengerjaan soal secara bertahap.',
    gradeLevels: 'Kelas 1 - 6 SD',
    subjects: 'Matematika, Pecahan, Logika',
    fee: 150000,
    isActive: true,
    displayOrder: 2,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-11T08:00:00Z',
    updatedAt: '2026-01-11T08:00:00Z',
  },
  {
    id: 'prog-3',
    name: 'Pendampingan PR & Tugas Sekolah',
    description: 'Bimbingan harian mendampingi siswa menuntaskan PR, tugas tematik sekolah, dan pemahaman materi yang diajarkan pada hari berjalan.',
    gradeLevels: 'Kelas 1 - 6 SD / MI',
    subjects: 'Semua Mata Pelajaran Sekolah SD',
    fee: 200000,
    isActive: true,
    displayOrder: 3,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'prog-4',
    name: 'Penguatan Materi & Kurikulum',
    description: 'Program intensif penguatan konsep kurikulum sekolah untuk mata pelajaran utama seperti IPAS dan Bahasa Indonesia.',
    gradeLevels: 'Kelas 2 - 6 SD',
    subjects: 'Pendalaman Konsep & Pemantapan Soal',
    fee: 200000,
    isActive: true,
    displayOrder: 4,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-13T08:00:00Z',
    updatedAt: '2026-01-13T08:00:00Z',
  },
  {
    id: 'prog-5',
    name: 'Persiapan ASTS, ASAS & Ujian',
    description: 'Pembahasan kisi-kisi soal Asesmen Sumatif Tengah Semester & Akhir Semester serta try out rutin persiapan ujian akhir sekolah.',
    gradeLevels: 'Kelas 3 - 6 SD',
    subjects: 'Simulasi Ujian & Bahas Tuntas Bank Soal',
    fee: 250000,
    isActive: true,
    displayOrder: 5,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-14T08:00:00Z',
    updatedAt: '2026-01-14T08:00:00Z',
  },
  {
    id: 'prog-6',
    name: 'Komputer Dasar',
    description: 'Pengenalan perangkat keras komputer, ketik 10 jari ceria, pengoperasian dasar software edukasi, dan literasi internet sehat.',
    gradeLevels: 'Kelas 3 - 6 SD',
    subjects: 'Literasi Digital & Komputer Dasar',
    fee: 200000,
    isActive: true,
    displayOrder: 6,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'prog-7',
    name: 'Bahasa Inggris Dasar',
    description: 'Pengenalan kosa kata bahasa Inggris sehari-hari, pelafalan sederhana, serta percakapan ringan melalui dongeng bergambar.',
    gradeLevels: 'Kelas 1 - 6 SD',
    subjects: 'Vocabulary & Basic English Conversation',
    fee: 175000,
    isActive: false,
    displayOrder: 7,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-01-16T08:00:00Z',
  },
  {
    id: 'prog-8',
    name: 'Sains & Percobaan Sederhana',
    description: 'Eksplorasi eksperimen sains kreatif dan aman dengan media peraga di sekitar untuk menumbuhkan rasa ingin tahu anak.',
    gradeLevels: 'Kelas 2 - 6 SD',
    subjects: 'Eksperimen & Percobaan Sains Sederhana',
    fee: 175000,
    isActive: false,
    displayOrder: 8,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-17T08:00:00Z',
    updatedAt: '2026-01-17T08:00:00Z',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Nabila Putri',
    gender: 'Perempuan',
    birthDate: '2016-04-12',
    grade: 'Kelas 4 SD',
    school: 'SD Negeri Trangsan 01',
    parentName: 'Ibu Nur Hasanah',
    whatsapp: '6281234567890',
    preferredSession: 2,
    status: 'Aktif',
    note: 'Anak rajin dan aktif bertanya',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'std-2',
    name: 'Dimas Bagus Pratama',
    gender: 'Laki-laki',
    birthDate: '2015-08-20',
    grade: 'Kelas 5 SD',
    school: 'SD Negeri 1 Purbalingga',
    parentName: 'Bpk. Tri Wibowo',
    whatsapp: '6281399887766',
    preferredSession: 2,
    status: 'Aktif',
    note: 'Butuh pendampingan fokus berhitung',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-16T10:00:00Z',
    updatedAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'std-3',
    name: 'Fathan Al-Ghifari',
    gender: 'Laki-laki',
    birthDate: '2017-03-14',
    grade: 'Kelas 3 SD',
    school: 'SD Islam Al-Azhar',
    parentName: 'Ibu Dewi Kartika',
    whatsapp: '6285712345678',
    preferredSession: 1,
    status: 'Aktif',
    note: 'Fokus calistung dan pemahaman kalimat',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-17T11:00:00Z',
    updatedAt: '2026-01-17T11:00:00Z',
  },
  {
    id: 'std-4',
    name: 'Zahra Amira',
    gender: 'Perempuan',
    birthDate: '2016-10-25',
    grade: 'Kelas 4 SD',
    school: 'SD Negeri 2 Bojong',
    parentName: 'Ibu Endang S.',
    whatsapp: '6281577889900',
    preferredSession: 3,
    status: 'Aktif',
    note: 'Sangat menyukai komputer dasar & ketik',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-18T08:30:00Z',
    updatedAt: '2026-01-18T08:30:00Z',
  },
  {
    id: 'std-5',
    name: 'Rizky Ramadhan',
    gender: 'Laki-laki',
    birthDate: '2015-05-18',
    grade: 'Kelas 5 SD',
    school: 'SD Negeri 1 Trangsan',
    parentName: 'Bpk. Agus Santoso',
    whatsapp: '6282111223344',
    preferredSession: 3,
    status: 'Aktif',
    note: 'Pendampingan tugas harian',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-19T09:15:00Z',
    updatedAt: '2026-01-19T09:15:00Z',
  },
  {
    id: 'std-6',
    name: 'Aisyah Humaira',
    gender: 'Perempuan',
    birthDate: '2018-01-30',
    grade: 'Kelas 2 SD',
    school: 'SDIT Harapan Umat',
    parentName: 'Ibu Fitriani',
    whatsapp: '6289654321098',
    preferredSession: 1,
    status: 'Aktif',
    note: 'Belajar calistung tingkat lanjut',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'std-7',
    name: 'Bima Arya Pratama',
    gender: 'Laki-laki',
    birthDate: '2014-06-18',
    grade: 'Kelas 6 SD',
    school: 'SD Negeri Trangsan 01',
    parentName: 'Bpk. Joko Susilo',
    whatsapp: '6287811998844',
    preferredSession: 2,
    status: 'Aktif',
    note: 'Siswa cerdas dan aktif berhitung cepat',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-21T08:00:00Z',
    updatedAt: '2026-01-21T08:00:00Z',
  },
  {
    id: 'std-8',
    name: 'Zahra Aurelia',
    gender: 'Perempuan',
    birthDate: '2017-09-05',
    grade: 'Kelas 3 SD',
    school: 'SD Negeri 2 Purbalingga Lor',
    parentName: 'Ibu Endang S.',
    whatsapp: '6281577889901',
    preferredSession: 2,
    status: 'Aktif',
    note: 'Ceria dan cepat tanggap',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-21T09:00:00Z',
    updatedAt: '2026-01-21T09:00:00Z',
  },

  // Siswa Pending (Calon Siswa yang menunggu verifikasi admin)
  {
    id: 'std-pending-1',
    name: 'Arka Radityaaaaa',
    gender: 'Laki-laki',
    birthDate: '2018-05-19',
    grade: 'Kelas 2 SD',
    school: 'SD Negeri 3 Bojong',
    parentName: 'Bpk. Agus Santoso',
    whatsapp: '6282111223344',
    preferredSession: 1,
    status: 'Pending',
    note: 'Daftar melalui formulir web, menunggu konfirmasi pendaftaran',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-25T14:15:00Z',
    updatedAt: '2026-01-25T14:15:00Z',
  },
  {
    id: 'std-pending-2',
    name: 'Kiki Ramadhani',
    gender: 'Perempuan',
    birthDate: '2019-11-10',
    grade: 'TK B',
    school: 'TK Pertiwi Trangsan',
    parentName: 'Ibu Sulastri',
    whatsapp: '6289654321098',
    preferredSession: 1,
    status: 'Pending',
    note: 'Ingin persiapan masuk SD & belajar calistung',
    rejectionReason: null,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-01-26T07:45:00Z',
    updatedAt: '2026-01-26T07:45:00Z',
  },
];

export const INITIAL_STUDENT_PROGRAMS: StudentProgram[] = [
  // Program untuk 7 Siswa Aktif Utama Sesuai Gambar
  {
    id: 'sp-1',
    studentId: 'std-1',
    programId: 'prog-2',
    programNameAtRegistration: 'Pendampingan PR',
    feeAtRegistration: 150000,
    status: 'Aktif',
    startedAt: '2026-01-15',
    note: 'Paket reguler bulanan',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'sp-2',
    studentId: 'std-2',
    programId: 'prog-2',
    programNameAtRegistration: 'Pendampingan PR',
    feeAtRegistration: 150000,
    status: 'Aktif',
    startedAt: '2026-01-16',
    note: null,
    createdAt: '2026-01-16T10:00:00Z',
    updatedAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'sp-3',
    studentId: 'std-3',
    programId: 'prog-1',
    programNameAtRegistration: 'Calistung',
    feeAtRegistration: 150000,
    status: 'Aktif',
    startedAt: '2026-01-17',
    note: 'Calistung dasar',
    createdAt: '2026-01-17T11:00:00Z',
    updatedAt: '2026-01-17T11:00:00Z',
  },
  {
    id: 'sp-4',
    studentId: 'std-4',
    programId: 'prog-6',
    programNameAtRegistration: 'Komputer Dasar',
    feeAtRegistration: 200000,
    status: 'Aktif',
    startedAt: '2026-01-18',
    note: null,
    createdAt: '2026-01-18T08:30:00Z',
    updatedAt: '2026-01-18T08:30:00Z',
  },
  {
    id: 'sp-5',
    studentId: 'std-5',
    programId: 'prog-2',
    programNameAtRegistration: 'Pendampingan PR',
    feeAtRegistration: 150000,
    status: 'Aktif',
    startedAt: '2026-01-19',
    note: null,
    createdAt: '2026-01-19T09:15:00Z',
    updatedAt: '2026-01-19T09:15:00Z',
  },
  {
    id: 'sp-6',
    studentId: 'std-6',
    programId: 'prog-1',
    programNameAtRegistration: 'Calistung',
    feeAtRegistration: 150000,
    status: 'Aktif',
    startedAt: '2026-01-20',
    note: null,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'sp-7',
    studentId: 'std-7',
    programId: 'prog-3',
    programNameAtRegistration: 'Matematika Logis',
    feeAtRegistration: 200000,
    status: 'Aktif',
    startedAt: '2026-01-21',
    note: null,
    createdAt: '2026-01-21T08:00:00Z',
    updatedAt: '2026-01-21T08:00:00Z',
  },

  // Program untuk calon siswa pending
  {
    id: 'sp-pending-1',
    studentId: 'std-pending-1',
    programId: 'prog-1',
    programNameAtRegistration: 'Calistung Dasar',
    feeAtRegistration: 150000,
    status: 'Aktif',
    startedAt: '2026-01-25',
    note: 'Pendaftaran mandiri melalui website',
    createdAt: '2026-01-25T14:15:00Z',
    updatedAt: '2026-01-25T14:15:00Z',
  },
  {
    id: 'sp-pending-2',
    studentId: 'std-pending-2',
    programId: 'prog-1',
    programNameAtRegistration: 'Calistung Dasar',
    feeAtRegistration: 150000,
    status: 'Aktif',
    startedAt: '2026-01-26',
    note: 'Persiapan masuk SD',
    createdAt: '2026-01-26T07:45:00Z',
    updatedAt: '2026-01-26T07:45:00Z',
  },
];

// Helper to generate dynamic schedules for today and the current month
function createInitialSchedules(): ScheduleAssignment[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthStr = String(month).padStart(2, '0');

  // Format a date string in YYYY-MM-DD
  const makeDate = (day: number) => {
    return `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
  };

  const todayDay = today.getDate();
  const todayStr = makeDate(todayDay);

  const schedules: ScheduleAssignment[] = [];
  let idCounter = 1;

  // 0. Plotting Sample Oktober 2025 sesuai Desain
  const oct2025Plots = [
    { studentId: 'std-1', date: '2025-10-01', session: 1 as ScheduleSession },
    { studentId: 'std-24', date: '2025-10-01', session: 2 as ScheduleSession },
    { studentId: 'std-2', date: '2025-10-02', session: 2 as ScheduleSession },
    { studentId: 'std-25', date: '2025-10-03', session: 1 as ScheduleSession },
    { studentId: 'std-26', date: '2025-10-03', session: 3 as ScheduleSession },
    { studentId: 'std-21', date: '2025-10-04', session: 2 as ScheduleSession },
    { studentId: 'std-24', date: '2025-10-30', session: 3 as ScheduleSession },
  ];
  oct2025Plots.forEach((plot) => {
    schedules.push({
      id: `sch-${idCounter++}`,
      studentId: plot.studentId,
      date: plot.date,
      session: plot.session,
      createdAt: '2025-10-01T00:00:00Z',
      updatedAt: '2025-10-01T00:00:00Z',
    });
  });

  // 1. Jadwal Hari Ini (6 siswa per sesi)
  // Sesi 1
  ['std-1', 'std-2', 'std-3', 'std-4', 'std-5', 'std-6'].forEach((studentId) => {
    schedules.push({
      id: `sch-${idCounter++}`,
      studentId,
      date: todayStr,
      session: 1,
      createdAt: '2026-10-18T00:00:00Z',
      updatedAt: '2026-10-18T00:00:00Z',
    });
  });

  // Sesi 2
  ['std-7', 'std-8', 'std-9', 'std-10', 'std-11', 'std-12'].forEach((studentId) => {
    schedules.push({
      id: `sch-${idCounter++}`,
      studentId,
      date: todayStr,
      session: 2,
      createdAt: '2026-10-18T00:00:00Z',
      updatedAt: '2026-10-18T00:00:00Z',
    });
  });

  // Sesi 3
  ['std-13', 'std-14', 'std-15', 'std-16', 'std-17', 'std-18'].forEach((studentId) => {
    schedules.push({
      id: `sch-${idCounter++}`,
      studentId,
      date: todayStr,
      session: 3,
      createdAt: '2026-10-18T00:00:00Z',
      updatedAt: '2026-10-18T00:00:00Z',
    });
  });

  // 2. Sample jadwal pada tanggal-tanggal lain di bulan ini (bukan hari Minggu)
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    if (d === todayDay) continue; // Sudah ada di atas
    const dateObj = new Date(year, month - 1, d);
    if (dateObj.getDay() === 0) continue; // Lewati hari Minggu (Libur)

    const dateStr = makeDate(d);

    // Variasi jadwal teratur
    if (d % 2 === 1) {
      schedules.push({
        id: `sch-${idCounter++}`,
        studentId: 'std-1',
        date: dateStr,
        session: 1,
        createdAt: '2026-10-18T00:00:00Z',
        updatedAt: '2026-10-18T00:00:00Z',
      });
      schedules.push({
        id: `sch-${idCounter++}`,
        studentId: 'std-7',
        date: dateStr,
        session: 2,
        createdAt: '2026-10-18T00:00:00Z',
        updatedAt: '2026-10-18T00:00:00Z',
      });
      if (d % 3 === 0) {
        schedules.push({
          id: `sch-${idCounter++}`,
          studentId: 'std-13',
          date: dateStr,
          session: 3,
          createdAt: '2026-10-18T00:00:00Z',
          updatedAt: '2026-10-18T00:00:00Z',
        });
      }
    } else {
      schedules.push({
        id: `sch-${idCounter++}`,
        studentId: 'std-2',
        date: dateStr,
        session: 1,
        createdAt: '2026-10-18T00:00:00Z',
        updatedAt: '2026-10-18T00:00:00Z',
      });
      schedules.push({
        id: `sch-${idCounter++}`,
        studentId: 'std-8',
        date: dateStr,
        session: 2,
        createdAt: '2026-10-18T00:00:00Z',
        updatedAt: '2026-10-18T00:00:00Z',
      });
      schedules.push({
        id: `sch-${idCounter++}`,
        studentId: 'std-14',
        date: dateStr,
        session: 3,
        createdAt: '2026-10-18T00:00:00Z',
        updatedAt: '2026-10-18T00:00:00Z',
      });
    }
  }

  return schedules;
}

export const INITIAL_SCHEDULES: ScheduleAssignment[] = createInitialSchedules();

// Local Storage Helper Store
class MockStore {
  private isBrowser = typeof window !== 'undefined';
  private STORAGE_VERSION = 'v6';

  getPrograms(): Program[] {
    if (!this.isBrowser) return INITIAL_PROGRAMS;
    const stored = localStorage.getItem(`rbbk_programs_${this.STORAGE_VERSION}`);
    if (!stored) {
      localStorage.setItem(`rbbk_programs_${this.STORAGE_VERSION}`, JSON.stringify(INITIAL_PROGRAMS));
      return INITIAL_PROGRAMS;
    }
    return JSON.parse(stored);
  }

  savePrograms(programs: Program[]) {
    if (this.isBrowser) {
      localStorage.setItem(`rbbk_programs_${this.STORAGE_VERSION}`, JSON.stringify(programs));
    }
  }

  getStudents(): Student[] {
    if (!this.isBrowser) return INITIAL_STUDENTS;
    const stored = localStorage.getItem(`rbbk_students_${this.STORAGE_VERSION}`);
    if (!stored) {
      localStorage.setItem(`rbbk_students_${this.STORAGE_VERSION}`, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed: Student[] = JSON.parse(stored);
    const existingIds = new Set(parsed.map((s) => s.id));
    let hasNew = false;
    INITIAL_STUDENTS.forEach((initS) => {
      if (!existingIds.has(initS.id)) {
        parsed.push(initS);
        hasNew = true;
      }
    });
    if (hasNew) {
      localStorage.setItem(`rbbk_students_${this.STORAGE_VERSION}`, JSON.stringify(parsed));
    }
    return parsed;
  }

  saveStudents(students: Student[]) {
    if (this.isBrowser) {
      localStorage.setItem(`rbbk_students_${this.STORAGE_VERSION}`, JSON.stringify(students));
    }
  }

  getStudentPrograms(): StudentProgram[] {
    if (!this.isBrowser) return INITIAL_STUDENT_PROGRAMS;
    const stored = localStorage.getItem(`rbbk_student_programs_${this.STORAGE_VERSION}`);
    if (!stored) {
      localStorage.setItem(`rbbk_student_programs_${this.STORAGE_VERSION}`, JSON.stringify(INITIAL_STUDENT_PROGRAMS));
      return INITIAL_STUDENT_PROGRAMS;
    }
    return JSON.parse(stored);
  }

  saveStudentPrograms(items: StudentProgram[]) {
    if (this.isBrowser) {
      localStorage.setItem(`rbbk_student_programs_${this.STORAGE_VERSION}`, JSON.stringify(items));
    }
  }

  getSchedules(): ScheduleAssignment[] {
    if (!this.isBrowser) return INITIAL_SCHEDULES;
    const stored = localStorage.getItem(`rbbk_schedules_${this.STORAGE_VERSION}`);
    if (!stored) {
      localStorage.setItem(`rbbk_schedules_${this.STORAGE_VERSION}`, JSON.stringify(INITIAL_SCHEDULES));
      return INITIAL_SCHEDULES;
    }
    const parsed: ScheduleAssignment[] = JSON.parse(stored);
    const existingKeys = new Set(parsed.map((s) => `${s.studentId}-${s.date}-${s.session}`));
    let hasNew = false;
    INITIAL_SCHEDULES.forEach((initSch) => {
      const key = `${initSch.studentId}-${initSch.date}-${initSch.session}`;
      if (!existingKeys.has(key)) {
        parsed.push(initSch);
        hasNew = true;
      }
    });
    if (hasNew) {
      localStorage.setItem(`rbbk_schedules_${this.STORAGE_VERSION}`, JSON.stringify(parsed));
    }
    return parsed;
  }

  saveSchedules(schedules: ScheduleAssignment[]) {
    if (this.isBrowser) {
      localStorage.setItem(`rbbk_schedules_${this.STORAGE_VERSION}`, JSON.stringify(schedules));
    }
  }

  // Session / Auth mock
  getIsLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem('rbbk_admin_auth') === 'true';
  }

  setLoggedIn(status: boolean) {
    if (this.isBrowser) {
      if (status) {
        localStorage.setItem('rbbk_admin_auth', 'true');
        localStorage.setItem('rbbk_admin_user', JSON.stringify({
          id: 'adm-1',
          username: 'bukhotimah',
          role: 'owner',
          isActive: true
        }));
      } else {
        localStorage.removeItem('rbbk_admin_auth');
        localStorage.removeItem('rbbk_admin_user');
      }
    }
  }

  // Normalize WhatsApp Phone to International format
  normalizeWhatsApp(phone: string): string {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (!clean.startsWith('62')) {
      clean = '62' + clean;
    }
    return clean;
  }
}

export const mockStore = new MockStore();
