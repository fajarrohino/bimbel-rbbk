import { z } from 'zod';

// ============================================================
// AUTH
// ============================================================
export const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi.'),
  password: z.string().min(1, 'Password wajib diisi.'),
});

// ============================================================
// PROGRAMS
// ============================================================
export const createProgramSchema = z.object({
  name: z.string().min(1, 'Nama program wajib diisi.'),
  description: z.string().min(1, 'Deskripsi wajib diisi.'),
  gradeLevels: z.string().min(1, 'Level kelas wajib diisi.'),
  subjects: z.string().min(1, 'Mata pelajaran wajib diisi.'),
  fee: z.number().nonnegative('Biaya tidak boleh negatif.'),
  isActive: z.boolean().optional().default(true),
});

export const updateProgramSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  gradeLevels: z.string().min(1).optional(),
  subjects: z.string().min(1).optional(),
  fee: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

// ============================================================
// STUDENTS
// ============================================================
const genderValues = ['Laki-laki', 'Perempuan'] as const;

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Nama siswa wajib diisi.'),
  gender: z.enum(genderValues, { message: 'Gender harus Laki-laki atau Perempuan.' }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir: YYYY-MM-DD.'),
  grade: z.string().min(1, 'Kelas wajib diisi.'),
  school: z.string().min(1, 'Sekolah wajib diisi.'),
  parentName: z.string().min(1, 'Nama orang tua wajib diisi.'),
  whatsapp: z.string().min(1, 'Nomor WhatsApp wajib diisi.'),
  preferredSession: z.number().int().min(1).max(3).nullable().optional(),
  note: z.string().optional(),
  programId: z.string().uuid('Program ID tidak valid.').optional(),
});

export const updateStudentSchema = z.object({
  name: z.string().min(1).optional(),
  gender: z.enum(genderValues).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  grade: z.string().min(1).optional(),
  school: z.string().min(1).optional(),
  parentName: z.string().min(1).optional(),
  whatsapp: z.string().min(1).optional(),
  preferredSession: z.number().int().min(1).max(3).nullable().optional(),
  note: z.string().optional(),
});

export const updateStudentStatusSchema = z.object({
  status: z.enum(['Pending', 'Aktif', 'Nonaktif', 'Lulus']),
  rejectionReason: z.string().optional(),
});

// ============================================================
// REGISTRASI PUBLIK
// ============================================================
export const publicRegistrationSchema = z.object({
  name: z.string().min(1, 'Nama siswa wajib diisi.'),
  gender: z.enum(genderValues, { message: 'Gender harus Laki-laki atau Perempuan.' }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir: YYYY-MM-DD.'),
  grade: z.string().min(1, 'Kelas wajib diisi.'),
  school: z.string().min(1, 'Sekolah wajib diisi.'),
  parentName: z.string().min(1, 'Nama orang tua wajib diisi.'),
  whatsapp: z.string().min(1, 'Nomor WhatsApp wajib diisi.'),
  preferredSession: z.number().int().min(1).max(3).nullable().optional(),
  note: z.string().optional(),
  programId: z.string().uuid('Program ID tidak valid.'),
});

// ============================================================
// STUDENT PROGRAMS
// ============================================================
export const changeStudentProgramSchema = z.object({
  newProgramId: z.string().uuid('Program ID tidak valid.'),
  note: z.string().optional(),
});

// ============================================================
// SCHEDULES
// ============================================================
export const createScheduleSchema = z.object({
  studentId: z.string().uuid('Student ID tidak valid.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal: YYYY-MM-DD.'),
  session: z.number().int().min(1).max(3, 'Sesi harus 1, 2, atau 3.'),
});

export const bulkCreateScheduleSchema = z.object({
  assignments: z.array(createScheduleSchema).min(1),
});

export const deleteScheduleSchema = z.object({
  studentId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  session: z.number().int().min(1).max(3),
});
