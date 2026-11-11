import apiClient from '@/lib/apiClient';
import { Student, StudentGender, ScheduleSession } from '@/types';

export interface CreateStudentInput {
  name: string;
  gender: StudentGender;
  birthDate: string;
  grade: string;
  school: string;
  parentName: string;
  whatsapp: string;
  preferredSession: ScheduleSession;
  programId: string;
  note?: string;
}

export interface UpdateStudentInput {
  name?: string;
  gender?: StudentGender;
  birthDate?: string;
  grade?: string;
  school?: string;
  parentName?: string;
  whatsapp?: string;
  preferredSession?: ScheduleSession;
  note?: string;
}

export interface UpdateStatusInput {
  status: string;
  rejectionReason?: string;
}

export interface PublicRegistrationInput {
  name: string;
  gender: StudentGender;
  birthDate: string;
  grade: string;
  school: string;
  parentName: string;
  whatsapp: string;
  programId: string;
  preferredSession: ScheduleSession;
  note?: string;
}

export interface StudentsListResponse {
  students: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data?: Student[];
  total?: number;
}

export const studentApi = {
  getAll: async (params?: { status?: string; page?: number; limit?: number }): Promise<StudentsListResponse> => {
    const res = await apiClient.get<{
      students: Student[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>('/api/students', params as Record<string, string | number | boolean | undefined>);
    return {
      students: res.students || [],
      pagination: res.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 },
      data: res.students || [],
      total: res.pagination?.total ?? res.students?.length ?? 0,
    };
  },

  getById: async (id: string): Promise<Student> => {
    const res = await apiClient.get<{ student: Student }>(`/api/students/${id}`);
    return res.student;
  },

  create: async (data: CreateStudentInput): Promise<Student> => {
    const res = await apiClient.post<{ student: Student }>('/api/students', data);
    return res.student;
  },

  update: async (id: string, data: UpdateStudentInput): Promise<Student> => {
    const res = await apiClient.put<{ student: Student }>(`/api/students/${id}`, data);
    return res.student;
  },

  updateStatus: async (id: string, data: UpdateStatusInput): Promise<Student> => {
    const res = await apiClient.patch<{ student: Student }>(`/api/students/${id}/status`, data);
    return res.student;
  },

  delete: (id: string): Promise<void> =>
    apiClient.delete_(`/api/students/${id}`),

  register: (data: PublicRegistrationInput): Promise<{ message: string; whatsAppUrl: string }> =>
    apiClient.post('/api/public/register', data),
};

