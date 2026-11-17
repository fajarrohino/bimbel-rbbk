'use client';

import React from 'react';

export type ActionModalStep = 'confirm' | 'loading' | 'success' | 'error';
export type ActionModalVariant = 'primary' | 'danger' | 'success' | 'warning';

export interface ActionModalProps {
  isOpen: boolean;
  step: ActionModalStep;
  variant?: ActionModalVariant;
  icon?: string;

  // Confirm Step
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;

  // Loading Step
  loadingTitle?: string;
  // loadingMessage?: string;

  // Success Step
  successTitle?: string;
  successMessage?: React.ReactNode;
  successButtonText?: string;
  onSuccessClose?: () => void;

  // Error Step
  errorTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onErrorClose?: () => void;
}

export default function ActionModal({
  isOpen,
  step,
  variant = 'primary',
  icon,
  title,
  description,
  children,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmDisabled = false,
  onConfirm,
  onCancel,
  loadingTitle = 'Memproses...',
  // loadingMessage = 'Mohon tunggu sebentar, sedang memperbarui data ke server...',
  successTitle = 'Berhasil!',
  successMessage = 'Tindakan telah berhasil diproses.',
  successButtonText = 'Selesai',
  onSuccessClose,
  errorTitle = 'Gagal Memproses',
  errorMessage = 'Terjadi kesalahan saat menghubungi server.',
  onRetry,
  onErrorClose,
}: ActionModalProps) {
  if (!isOpen) return null;

  // Variant styling helpers
  const getIconStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-50 text-rose-600';
      case 'success':
        return 'bg-emerald-50 text-emerald-600';
      case 'warning':
        return 'bg-amber-50 text-amber-600';
      default:
        return 'bg-sky-50 text-[#006194]';
    }
  };

  const getConfirmButtonStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20';
      default:
        return 'bg-[#006194] hover:bg-[#004d77] shadow-sky-500/20';
    }
  };

  const getLoadingSpinnerStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          ping: 'bg-rose-400/20',
          spinner: 'border-rose-500 border-t-rose-200',
        };
      case 'success':
        return {
          ping: 'bg-emerald-400/20',
          spinner: 'border-emerald-500 border-t-emerald-200',
        };
      case 'warning':
        return {
          ping: 'bg-amber-400/20',
          spinner: 'border-amber-500 border-t-amber-200',
        };
      default:
        return {
          ping: 'bg-sky-400/20',
          spinner: 'border-[#006194] border-t-sky-200',
        };
    }
  };

  const defaultIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'danger':
        return 'warning';
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'info';
      default:
        return 'help';
    }
  };

  const spinner = getLoadingSpinnerStyles();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in zoom-in-95">
        {/* ================= 1. CONFIRM STEP ================= */}
        {step === 'confirm' && (
          <>
            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getIconStyles()}`}>
                <span className="material-symbols-outlined text-2xl">{defaultIcon()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
                {description && (
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {description}
                  </div>
                )}
              </div>
            </div>

            {children && <div className="space-y-3">{children}</div>}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                disabled={confirmDisabled}
                onClick={onConfirm}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 ${getConfirmButtonStyles()}`}
              >
                <span>{confirmText}</span>
              </button>
            </div>
          </>
        )}

        {/* ================= 2. LOADING STEP ================= */}
        {step === 'loading' && (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className={`w-14 h-14 rounded-full animate-ping absolute ${spinner.ping}`} />
              <div className={`w-12 h-12 border-4 rounded-full animate-spin relative z-10 ${spinner.spinner}`} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-slate-800">{loadingTitle}</h4>
              {/* <p className="text-xs text-slate-500 max-w-xs leading-relaxed">{loadingMessage}</p> */}
            </div>
          </div>
        )}

        {/* ================= 3. SUCCESS STEP ================= */}
        {step === 'success' && (
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-lg text-slate-900">{successTitle}</h4>
              <div className="text-xs text-slate-600 leading-relaxed max-w-sm">
                {successMessage}
              </div>
            </div>
            <div className="pt-2 w-full">
              <button
                type="button"
                onClick={onSuccessClose || onCancel}
                className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#006194] hover:bg-[#004d77] text-white transition-colors shadow-xs"
              >
                {successButtonText}
              </button>
            </div>
          </div>
        )}

        {/* ================= 4. ERROR STEP ================= */}
        {step === 'error' && (
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-3xl">error</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-lg text-slate-900">{errorTitle}</h4>
              <p className="text-xs text-rose-600 font-medium leading-relaxed max-w-sm bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {errorMessage}
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full pt-2">
              <button
                type="button"
                onClick={onErrorClose || onCancel}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Tutup
              </button>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
                >
                  Coba Lagi
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
