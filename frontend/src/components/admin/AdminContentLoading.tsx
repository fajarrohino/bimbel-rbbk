'use client';

import React from 'react';

interface AdminContentLoadingProps {
  message?: string;
  submessage?: string;
}

export default function AdminContentLoading({
  message = 'Memuat data...',
  submessage = 'Mohon tunggu sebentar, sedang mengambil data dari server...',
}: AdminContentLoadingProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[55vh] py-16 gap-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse ring */}
        <div className="w-12 h-12 rounded-full bg-[#0284c7]/10 animate-ping absolute" />
        {/* Spinner */}
        <div className="w-11 h-11 border-4 border-[#bae6fd] border-t-[#0284c7] rounded-full animate-spin relative z-10" />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-bold text-slate-700 tracking-tight">
          {message}
        </p>
        <p className="text-xs text-slate-400 font-medium">
          {submessage}
        </p>
      </div>
    </div>
  );
}
