'use client';

import React from 'react';
import { Student } from '@/types';

export type StudentApprovalStep = 'confirm' | 'loading' | 'success' | 'error';
export type StudentApprovalAction = 'approve' | 'reject';

export interface StudentApprovalModalProps {
  isOpen: boolean;
  student: Student | null;
  programName?: string;
  action: StudentApprovalAction;
  step: StudentApprovalStep;
  rejectReason: string;
  errorMessage?: string;
  onRejectReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function StudentApprovalModal({
  isOpen,
  student,
  programName = '-',
  action,
  step,
  rejectReason,
  errorMessage,
  onRejectReasonChange,
  onConfirm,
  onClose,
}: StudentApprovalModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        {/* ================= 1. CONFIRM STEP ================= */}
        {step === 'confirm' && (
          <>
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${action === 'approve'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
                  }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {action === 'approve' ? 'how_to_reg' : 'person_cancel'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {action === 'approve' ? 'Persetujuan Siswa Baru' : 'Penolakan Siswa Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {action === 'approve'
                    ? 'Verifikasi pendaftaran menjadi Siswa Aktif'
                    : 'Penolakan siswa ini akan mengubah statusnya menjadi Nonaktif'}
                </p>
              </div>
            </div>

            {/* Info Card Siswa */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Nama Siswa:</span>
                <span className="font-bold text-slate-800 text-sm">{student.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Program Belajar:</span>
                <span className="font-semibold text-slate-700">{programName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Sekolah:</span>
                <span className="font-medium text-slate-700">{student.school || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Kelas:</span>
                <span className="font-medium text-slate-700">{student.grade || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Pilihan Sesi:</span>
                <span className="px-2 py-0.5 bg-sky-50 text-[#006194] font-bold rounded border border-sky-100">
                  Sesi {student.preferredSession}
                </span>
              </div>
            </div>

            {/* Input Alasan jika Reject */}
            {action === 'reject' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Alasan Penolakan:</span>
                  <span className="text-[11px] font-normal text-rose-500">*wajib diisi</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => onRejectReasonChange(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                  placeholder="Masukkan alasan penolakan pendaftaran..."
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={action === 'reject' && !rejectReason.trim()}
                onClick={onConfirm}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 ${action === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
                  }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {action === 'approve' ? 'check' : 'close'}
                </span>
                <span>{action === 'approve' ? 'Approve' : 'Reject'}</span>
              </button>
            </div>
          </>
        )}

        {/* ================= 2. LOADING STEP ================= */}
        {step === 'loading' && (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center gap-4">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-14 h-14 rounded-full animate-ping absolute ${action === 'approve' ? 'bg-emerald-400/20' : 'bg-rose-400/20'
                  }`}
              />
              <div
                className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin relative z-10 ${action === 'approve'
                  ? 'border-emerald-500 border-t-emerald-200'
                  : 'border-rose-500 border-t-rose-200'
                  }`}
              />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-slate-800">
                {action === 'approve'
                  ? 'Memproses Persetujuan Siswa...'
                  : 'Memproses Penolakan Pendaftaran...'}
              </h4>
            </div>
          </div>
        )}

        {/* ================= 3. SUCCESS STEP ================= */}
        {step === 'success' && (
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action === 'approve'
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-amber-100 text-amber-700'
                }`}
            >
              <span className="material-symbols-outlined text-3xl">
                {action === 'approve' ? 'check_circle' : 'task_alt'}
              </span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-lg text-slate-900">
                {action === 'approve' ? 'Persetujuan Berhasil!' : 'Pendaftaran Telah Ditolak'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                {action === 'approve' ? (
                  <>
                    Siswa <span className="font-bold text-slate-800">{student.name}</span> telah resmi
                    menjadi <strong>Siswa Aktif</strong>.
                  </>
                ) : (
                  <>
                    Pendaftaran siswa <span className="font-bold text-slate-800">{student.name}</span> telah
                    ditolak dan dialihkan ke status <strong>Nonaktif</strong>.
                  </>
                )}
              </p>
            </div>
            <div className="pt-2 w-full">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#006194] hover:bg-[#004d77] text-white transition-colors shadow-xs"
              >
                Ok
              </button>
            </div>
          </div>
        )}

        {/* ================= 4. ERROR STEP ================= */}
        {step === 'error' && (
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">error</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-lg text-slate-900">
                {action === 'approve' ? 'Persetujuan Gagal' : 'Penolakan Gagal'}
              </h4>
              <p className="text-xs text-rose-600 font-medium leading-relaxed max-w-sm bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {errorMessage || 'Terjadi kesalahan pada server. Silakan coba kembali.'}
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
