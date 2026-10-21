import React from 'react';
import { StudentStatus } from '@/types';

interface StatusBadgeProps {
  status: StudentStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm font-semibold';

  switch (status) {
    case 'Pending':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Pending
        </span>
      );
    case 'Aktif':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Aktif
        </span>
      );
    case 'Nonaktif':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Nonaktif
        </span>
      );
    case 'Lulus':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          Lulus
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
}
