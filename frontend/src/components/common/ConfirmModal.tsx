import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-4 animate-scale-up">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              variant === 'danger'
                ? 'bg-rose-50 text-rose-600'
                : 'bg-sky-50 text-sky-600'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {variant === 'danger' ? 'warning' : 'help'}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-sm transition-colors ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                : 'bg-[#0284c7] hover:bg-[#0369a1] shadow-sky-500/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
