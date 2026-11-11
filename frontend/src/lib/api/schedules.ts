import apiClient from '@/lib/apiClient';
import { ScheduleAssignment } from '@/types';

export interface TodayScheduleItem {
  id: string;
  studentId: string;
  date: string;
  session: number;
  student?: {
    id: string;
    name: string;
    status: string;
    preferredSession: number;
    grade?: string;
  };
}

export interface TodayScheduleResponse {
  date: string;
  sessions: Record<string | number, TodayScheduleItem[]> | Array<{
    session: number;
    students: Array<{
      id: string;
      scheduleId?: string;
      name: string;
      grade?: string;
      school?: string;
      preferredSession?: number;
    }>;
  }>;
}

export interface ActiveStudent {
  id: string;
  name: string;
  grade: string;
  school: string;
  preferredSession: number;
  status: string;
}

export const scheduleApi = {
  getToday: (): Promise<TodayScheduleResponse> =>
    apiClient.get('/api/schedules/today'),

  getByDate: async (date: string): Promise<ScheduleAssignment[]> => {
    const res = await apiClient.get<{ schedules: ScheduleAssignment[] }>('/api/schedules', { date });
    return res.schedules || [];
  },

  getByMonth: async (month: string): Promise<ScheduleAssignment[]> => {
    const res = await apiClient.get<{ schedules: ScheduleAssignment[] }>('/api/schedules', { month });
    return res.schedules || [];
  },

  getActiveStudents: async (): Promise<ActiveStudent[]> => {
    const res = await apiClient.get<{ students: ActiveStudent[] }>('/api/schedules/active-students');
    return res.students || [];
  },

  create: (data: {
    studentId: string;
    date: string;
    session: number;
  }): Promise<ScheduleAssignment> =>
    apiClient.post('/api/schedules', data),

  bulkCreate: (
    assignments: Array<{ studentId: string; date: string; session: number }>
  ): Promise<{ created: number; skipped: number }> =>
    apiClient.post('/api/schedules/bulk', { assignments }),

  delete: (id: string): Promise<void> =>
    apiClient.delete_(`/api/schedules/${id}`),

  deleteByKey: (studentId: string, date: string, session: number): Promise<void> =>
    apiClient.delete_(`/api/schedules/student/${studentId}/date/${date}/session/${session}`),
};

