import apiClient from '@/lib/apiClient';
import { StudentProgram } from '@/types';

export const studentProgramApi = {
  getByStudent: async (studentId: string): Promise<StudentProgram[]> => {
    const res = await apiClient.get<{ studentPrograms: StudentProgram[] }>(
      `/api/student-programs/student/${studentId}`
    );
    return res.studentPrograms || [];
  },

  changeProgram: async (
    studentId: string,
    data: { newProgramId: string; note?: string }
  ): Promise<StudentProgram> => {
    const res = await apiClient.post<{ studentProgram: StudentProgram }>(
      `/api/student-programs/student/${studentId}/change`,
      data
    );
    return res.studentProgram;
  },

  enroll: async (
    studentId: string,
    data: { programId: string; note?: string }
  ): Promise<StudentProgram> => {
    const res = await apiClient.post<{ studentProgram: StudentProgram }>(
      `/api/student-programs/student/${studentId}/enroll`,
      data
    );
    return res.studentProgram;
  },

  complete: async (id: string): Promise<StudentProgram> => {
    const res = await apiClient.patch<{ studentProgram: StudentProgram }>(
      `/api/student-programs/${id}/complete`,
      {}
    );
    return res.studentProgram;
  },
};

