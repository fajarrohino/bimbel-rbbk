import apiClient from '@/lib/apiClient';
import { Program } from '@/types';

export interface CreateProgramInput {
  name: string;
  description: string;
  gradeLevels: string;
  subjects: string;
  fee: number;
  isActive: boolean;
}

export type UpdateProgramInput = Partial<CreateProgramInput>;

export const programApi = {
  getPublicPrograms: async (): Promise<Program[]> => {
    const res = await apiClient.get<{ programs: Program[] }>('/api/public/programs');
    return res.programs || [];
  },

  getAll: async (): Promise<Program[]> => {
    const res = await apiClient.get<{ programs: Program[] }>('/api/programs');
    return res.programs || [];
  },

  getById: async (id: string): Promise<Program> => {
    const res = await apiClient.get<{ program: Program }>(`/api/programs/${id}`);
    return res.program;
  },

  create: async (data: CreateProgramInput): Promise<Program> => {
    const res = await apiClient.post<{ program: Program }>('/api/programs', data);
    return res.program;
  },

  update: async (id: string, data: UpdateProgramInput): Promise<Program> => {
    const res = await apiClient.put<{ program: Program }>(`/api/programs/${id}`, data);
    return res.program;
  },

  toggleActive: async (id: string): Promise<Program> => {
    const res = await apiClient.patch<{ program: Program }>(`/api/programs/${id}/toggle-active`, {});
    return res.program;
  },

  delete: (id: string): Promise<void> =>
    apiClient.delete_(`/api/programs/${id}`),
};

