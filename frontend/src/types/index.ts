export type StudentGender = 'Laki-laki' | 'Perempuan';

export type StudentStatus = 'Pending' | 'Aktif' | 'Nonaktif' | 'Lulus';

export type ProgramParticipationStatus = 'Aktif' | 'Selesai';

export type ScheduleSession = 1 | 2 | 3;

export interface Program {
  id: string;
  name: string;
  description: string;
  gradeLevels: string; // e.g. "Kelas 1-3 SD"
  subjects: string; // e.g. "Membaca, Menulis, Berhitung"
  fee: number; // in IDR
  isActive: boolean;
  displayOrder: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  gender: StudentGender;
  birthDate: string; // YYYY-MM-DD
  grade: string;
  school: string;
  parentName: string;
  whatsapp: string;
  preferredSession: ScheduleSession;
  status: StudentStatus;
  note?: string | null;
  rejectionReason?: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgram {
  id: string;
  studentId: string;
  programId: string;
  programNameAtRegistration: string;
  feeAtRegistration: number;
  status: ProgramParticipationStatus;
  startedAt: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleAssignment {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  session: ScheduleSession; // 1 | 2 | 3
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'owner';
  isActive: boolean;
}
