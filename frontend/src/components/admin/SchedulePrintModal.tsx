'use client';

import React, { useState } from 'react';
import { Student, ScheduleAssignment } from '@/types';

export type PrintFormat = 'calendar' | 'table' | 'daily';

export interface SchedulePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendarDate: Date;
  selectedDate: string;
  schedules: ScheduleAssignment[];
  studentsMap: Record<string, Student>;
  initialSessionFilter?: 'all' | 'sesi-1' | 'sesi-2' | 'sesi-3';
}

interface SchedulePrintDocumentProps {
  format: PrintFormat;
  sessionFilter: 'all' | 'sesi-1' | 'sesi-2' | 'sesi-3';
  calendarDate: Date;
  selectedDate: string;
  schedules: ScheduleAssignment[];
  studentsMap: Record<string, Student>;
  isPrintPreview?: boolean;
  useQrSignature?: boolean;
}

/**
 * Helper untuk memastikan setiap kata pada nama siswa diawali huruf kapital (Title Case)
 */
export function capitalizeWords(text?: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Komponen Dokumen Cetak Resmi Jadwal Siswa
 * Digunakan baik untuk pratinjau live di modal maupun saat dicetak / disimpan ke PDF via window.print()
 */
export function SchedulePrintDocument({
  format,
  sessionFilter,
  calendarDate,
  selectedDate,
  schedules,
  studentsMap,
  isPrintPreview = false,
  useQrSignature = true,
}: SchedulePrintDocumentProps) {
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const calMonthLabel = calendarDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPreviousMonth = new Date(calYear, calMonth, 0).getDate();
  const firstDayOfWeek = (new Date(calYear, calMonth, 1).getDay() + 6) % 7; // 0 = Senin, ..., 6 = Minggu

  const leadingDaysCount = firstDayOfWeek;
  const totalSlotsUsed = leadingDaysCount + daysInCurrentMonth;
  const trailingDaysCount = totalSlotsUsed % 7 === 0 ? 0 : 7 - (totalSlotsUsed % 7);

  // Parse Selected Date untuk format harian
  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const selectedDayName = selectedDateObj.toLocaleDateString('id-ID', { weekday: 'long' });
  const selectedDateFormatted = selectedDateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Current Print Date (Titimangsa)
  const todayPrintFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className={`bg-white text-slate-900 ${isPrintPreview ? 'text-xs p-6' : 'p-4 print:p-0'
        }`}
      style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
    >
      {/* Dynamic @page media rules for Landscape (calendar) vs Portrait (table/daily) */}
      {!isPrintPreview && (
        <style dangerouslySetInnerHTML={{
          __html: `
          @media print {
            @page {
              size: ${format === 'calendar' ? 'landscape' : 'portrait'};
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}} />
      )}

      {/* ========================================================================= */}
      {/* 1. KOP SURAT RESMI RUMAH BELAJAR BU KHOTIMAH */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 gap-4">
        {/* Logo Resmi */}
        <div className="w-16 h-16 shrink-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-rbbk.png"
            alt="Logo Rumah Belajar Bu Khotimah"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Teks Identitas Lembaga */}
        <div className="flex-1 text-center">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900 leading-tight">
            Rumah Belajar Bu Khotimah
          </h1>
          <p className="text-xs sm:text-sm font-bold text-sky-800 tracking-wide mt-0.5">
            Generasi Percaya Diri, Anak Cerdas
          </p>
          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
            Alamat: Bantarbarang RT 03 RW 09 No 48, Kec. Rembang, Kab. Purbalingga, Jawa Tengah. Kode Pos : 53356
          </p>
          <p className="text-[10px] text-slate-500">
            Website: {process.env.NEXT_PUBLIC_WEB_URL}
          </p>
        </div>

        {/* Placeholder penyeimbang kop */}
        <div className="w-16 h-16 shrink-0 hidden sm:block opacity-0" aria-hidden="true" />
      </div>
      {/* Garis Ganda Kop Surat */}
      <div className="border-b border-slate-900 mt-[2px] mb-4" />

      {/* ========================================================================= */}
      {/* 2. JUDUL DOKUMEN & METADATA PERIODE */}
      {/* ========================================================================= */}
      <div className="text-center mb-4">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900 underline underline-offset-4 decoration-2">
          {format === 'daily'
            ? 'JADWAL ' + selectedDayName + ', ' + selectedDateFormatted
            : 'JADWAL BULAN ' + calMonthLabel}
        </h2>
      </div>

      {/* ========================================================================= */}
      {/* 3. KONTEN JADWAL SESUAI FORMAT TERPILIH */}
      {/* ========================================================================= */}

      {/* -------------------- FORMAT A: KALENDER BULANAN -------------------- */}
      {format === 'calendar' && (
        <div className="mb-4">
          <div className="border border-slate-400 rounded-lg overflow-hidden">
            {/* Header Nama Hari */}
            <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-400 text-center font-bold text-xs text-slate-800 py-1.5 divide-x divide-slate-400">
              <div>Senin</div>
              <div>Selasa</div>
              <div>Rabu</div>
              <div>Kamis</div>
              <div>Jumat</div>
              <div>Sabtu</div>
              <div className="text-rose-600 bg-rose-50/80">Minggu</div>
            </div>

            {/* Matriks Kotak Tanggal */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-300">
              {/* Leading days (Bulan Lalu) */}
              {Array.from({ length: leadingDaysCount }).map((_, idx) => {
                const day = daysInPreviousMonth - leadingDaysCount + 1 + idx;
                return (
                  <div
                    key={`lead-${idx}`}
                    className="min-h-[80px] p-1.5 bg-slate-50/60 text-slate-300 flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-semibold text-slate-300 text-right block">{day}</span>
                  </div>
                );
              })}

              {/* Active Month Days */}
              {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dayOfWeek = (leadingDaysCount + i) % 7;
                const isSunday = dayOfWeek === 6;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

                const dayAssignments = schedules.filter((sch) => sch.date === dateStr);

                const s1 = dayAssignments
                  .filter((sch) => sch.session === 1)
                  .map((sch) => capitalizeWords(studentsMap[sch.studentId]?.name))
                  .filter(Boolean);

                const s2 = dayAssignments
                  .filter((sch) => sch.session === 2)
                  .map((sch) => capitalizeWords(studentsMap[sch.studentId]?.name))
                  .filter(Boolean);

                const s3 = dayAssignments
                  .filter((sch) => sch.session === 3)
                  .map((sch) => capitalizeWords(studentsMap[sch.studentId]?.name))
                  .filter(Boolean);

                const showS1 = (sessionFilter === 'all' || sessionFilter === 'sesi-1') && s1.length > 0;
                const showS2 = (sessionFilter === 'all' || sessionFilter === 'sesi-2') && s2.length > 0;
                const showS3 = (sessionFilter === 'all' || sessionFilter === 'sesi-3') && s3.length > 0;

                if (isSunday) {
                  return (
                    <div
                      key={`day-${dayNum}`}
                      className="min-h-[80px] p-1.5 bg-rose-50/40 flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-rose-600 text-right block">{dayNum}</span>
                      <div className="text-center py-2 text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                        Libur
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`day-${dayNum}`}
                    className="min-h-[80px] p-1.5 bg-white flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">{dayNum}</span>
                      {(showS1 || showS2 || showS3) && (
                        <span className="text-[9px] text-slate-400 font-medium">
                          {(showS1 ? s1.length : 0) + (showS2 ? s2.length : 0) + (showS3 ? s3.length : 0)} Siswa
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      {showS1 && (
                        <div className="px-1.5 py-0.5 rounded bg-amber-100/90 text-amber-950 text-[10px] leading-snug font-medium border border-amber-200">
                          <span className="font-bold text-amber-800 mr-1 shrink-0">S1:</span>
                          <span className="break-words capitalize">{s1.join(', ')}</span>
                        </div>
                      )}
                      {showS2 && (
                        <div className="px-1.5 py-0.5 rounded bg-sky-100/90 text-sky-950 text-[10px] leading-snug font-medium border border-sky-200">
                          <span className="font-bold text-[#0284c7] mr-1 shrink-0">S2:</span>
                          <span className="break-words capitalize">{s2.join(', ')}</span>
                        </div>
                      )}
                      {showS3 && (
                        <div className="px-1.5 py-0.5 rounded bg-teal-100/90 text-teal-950 text-[10px] leading-snug font-medium border border-teal-200">
                          <span className="font-bold text-teal-800 mr-1 shrink-0">S3:</span>
                          <span className="break-words capitalize">{s3.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Trailing days (Bulan Depan) */}
              {Array.from({ length: trailingDaysCount }).map((_, idx) => (
                <div
                  key={`trail-${idx}`}
                  className="min-h-[80px] p-1.5 bg-slate-50/60 text-slate-300 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-semibold text-slate-300 text-right block">{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legenda Jam Sesi */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2 px-1 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-700">Keterangan Sesi:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-200 border border-amber-300" />
                <span>Sesi 1: 14.00 - 15.00 WIB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-sky-200 border border-sky-300" />
                <span>Sesi 2: 16.00 - 17.00 WIB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-teal-200 border border-teal-300" />
                <span>Sesi 3: 19.00 - 20.00 WIB</span>
              </div>
            </div>
            <div className="text-slate-400 italic text-[10px]">
              * Waktu pelaksanaan bimbingan ditentukan oleh Guru Pengajar
            </div>
          </div>
        </div>
      )}

      {/* -------------------- FORMAT B: REKAP TABEL BULANAN -------------------- */}
      {format === 'table' && (
        <div className="mb-4">
          <table className="w-full border-collapse border border-slate-400 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border-b border-slate-400 font-bold">
                <th className="border border-slate-400 p-2 text-center w-10">No</th>
                <th className="border border-slate-400 p-2 text-left w-36">Hari, Tanggal</th>
                {(sessionFilter === 'all' || sessionFilter === 'sesi-1') && (
                  <th className="border border-slate-400 p-2 text-left bg-amber-50/60">
                    Sesi 1 (14.00 - 15.00)
                  </th>
                )}
                {(sessionFilter === 'all' || sessionFilter === 'sesi-2') && (
                  <th className="border border-slate-400 p-2 text-left bg-sky-50/60">
                    Sesi 2 (16.00 - 17.00)
                  </th>
                )}
                {(sessionFilter === 'all' || sessionFilter === 'sesi-3') && (
                  <th className="border border-slate-400 p-2 text-left bg-teal-50/60">
                    Sesi 3 (19.00 - 20.00)
                  </th>
                )}
                <th className="border border-slate-400 p-2 text-center w-20">Total Siswa</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dayDate = new Date(calYear, calMonth, dayNum);
                const dayName = dayDate.toLocaleDateString('id-ID', { weekday: 'long' });
                const isSunday = dayDate.getDay() === 0;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

                const dayAssignments = schedules.filter((sch) => sch.date === dateStr);

                const s1 = dayAssignments
                  .filter((sch) => sch.session === 1)
                  .map((sch) => capitalizeWords(studentsMap[sch.studentId]?.name))
                  .filter(Boolean);

                const s2 = dayAssignments
                  .filter((sch) => sch.session === 2)
                  .map((sch) => capitalizeWords(studentsMap[sch.studentId]?.name))
                  .filter(Boolean);

                const s3 = dayAssignments
                  .filter((sch) => sch.session === 3)
                  .map((sch) => capitalizeWords(studentsMap[sch.studentId]?.name))
                  .filter(Boolean);

                const totalStudentCount = s1.length + s2.length + s3.length;

                if (isSunday) {
                  return (
                    <tr key={`tbl-${dayNum}`} className="bg-rose-50/40 text-rose-800">
                      <td className="border border-slate-300 p-1.5 text-center font-semibold">{dayNum}</td>
                      <td className="border border-slate-300 p-1.5 font-bold">
                        {dayName}, {dayNum} {calendarDate.toLocaleDateString('id-ID', { month: 'short' })}
                      </td>
                      <td
                        colSpan={
                          sessionFilter === 'all'
                            ? 4
                            : 2
                        }
                        className="border border-slate-300 p-1.5 text-center italic text-rose-500 font-semibold"
                      >
                        Libur Mingguan
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={`tbl-${dayNum}`} className="hover:bg-slate-50/50">
                    <td className="border border-slate-300 p-1.5 text-center text-slate-600">{dayNum}</td>
                    <td className="border border-slate-300 p-1.5 font-semibold text-slate-800">
                      {dayName}, {dayNum} {calendarDate.toLocaleDateString('id-ID', { month: 'short' })}
                    </td>
                    {(sessionFilter === 'all' || sessionFilter === 'sesi-1') && (
                      <td className="border border-slate-300 p-1.5 text-slate-800">
                        {s1.length > 0 ? (
                          <div className="font-medium text-slate-900 break-words capitalize">{s1.join(', ')}</div>
                        ) : (
                          <span className="text-slate-300 italic">-</span>
                        )}
                      </td>
                    )}
                    {(sessionFilter === 'all' || sessionFilter === 'sesi-2') && (
                      <td className="border border-slate-300 p-1.5 text-slate-800">
                        {s2.length > 0 ? (
                          <div className="font-medium text-slate-900 break-words capitalize">{s2.join(', ')}</div>
                        ) : (
                          <span className="text-slate-300 italic">-</span>
                        )}
                      </td>
                    )}
                    {(sessionFilter === 'all' || sessionFilter === 'sesi-3') && (
                      <td className="border border-slate-300 p-1.5 text-slate-800">
                        {s3.length > 0 ? (
                          <div className="font-medium text-slate-900 break-words capitalize">{s3.join(', ')}</div>
                        ) : (
                          <span className="text-slate-300 italic">-</span>
                        )}
                      </td>
                    )}
                    <td className="border border-slate-300 p-1.5 text-center font-bold text-slate-700">
                      {totalStudentCount > 0 ? `${totalStudentCount} Siswa` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* -------------------- FORMAT C: JADWAL HARIAN -------------------- */}
      {format === 'daily' && (
        <div className="mb-6 space-y-4">
          {/* <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg text-center mb-4">
              <p className="text-sm font-bold text-sky-900">
                Jadwal Bimbingan untuk: {selectedDayName}, {selectedDateFormatted}
              </p>
            </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Box Sesi 1 */}
            {(sessionFilter === 'all' || sessionFilter === 'sesi-1') && (
              <div className="border border-amber-300 rounded-lg p-3 bg-amber-50/30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
                  <h4 className="font-bold text-amber-900">Sesi 1 (14.00 - 15.00)</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    {schedules.filter((s) => s.date === selectedDate && s.session === 1).length} Siswa
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {schedules
                    .filter((s) => s.date === selectedDate && s.session === 1)
                    .map((s, idx) => {
                      const st = studentsMap[s.studentId];
                      return (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-800">
                          <span className="font-bold text-amber-700 w-4">{idx + 1}.</span>
                          <div className="flex-1">
                            <span className="font-bold block capitalize">{capitalizeWords(st?.name) || 'Siswa'}</span>
                            {/* <span className="text-[10px] text-slate-500">{st?.school || st?.grade || '-'}</span> */}
                          </div>
                        </li>
                      );
                    })}
                  {schedules.filter((s) => s.date === selectedDate && s.session === 1).length === 0 && (
                    <li className="text-slate-400 italic text-center py-4">Tidak ada jadwal siswa</li>
                  )}
                </ul>
              </div>
            )}

            {/* Box Sesi 2 */}
            {(sessionFilter === 'all' || sessionFilter === 'sesi-2') && (
              <div className="border border-sky-300 rounded-lg p-3 bg-sky-50/30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-200">
                  <h4 className="font-bold text-sky-900">Sesi 2 (16.00 - 17.00)</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-200 text-sky-900">
                    {schedules.filter((s) => s.date === selectedDate && s.session === 2).length} Siswa
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {schedules
                    .filter((s) => s.date === selectedDate && s.session === 2)
                    .map((s, idx) => {
                      const st = studentsMap[s.studentId];
                      return (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-800">
                          <span className="font-bold text-sky-700 w-4">{idx + 1}.</span>
                          <div className="flex-1">
                            <span className="font-bold block capitalize">{capitalizeWords(st?.name) || 'Siswa'}</span>
                            <span className="text-[10px] text-slate-500">{st?.school || st?.grade || '-'}</span>
                          </div>
                        </li>
                      );
                    })}
                  {schedules.filter((s) => s.date === selectedDate && s.session === 2).length === 0 && (
                    <li className="text-slate-400 italic text-center py-4">Tidak ada jadwal siswa</li>
                  )}
                </ul>
              </div>
            )}

            {/* Box Sesi 3 */}
            {(sessionFilter === 'all' || sessionFilter === 'sesi-3') && (
              <div className="border border-teal-300 rounded-lg p-3 bg-teal-50/30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-teal-200">
                  <h4 className="font-bold text-teal-900">Sesi 3 (19.00 - 20.00)</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-200 text-teal-900">
                    {schedules.filter((s) => s.date === selectedDate && s.session === 3).length} Siswa
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {schedules
                    .filter((s) => s.date === selectedDate && s.session === 3)
                    .map((s, idx) => {
                      const st = studentsMap[s.studentId];
                      return (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-800">
                          <span className="font-bold text-teal-700 w-4">{idx + 1}.</span>
                          <div className="flex-1">
                            <span className="font-bold block capitalize">{capitalizeWords(st?.name) || 'Siswa'}</span>
                            <span className="text-[10px] text-slate-500">{st?.school || st?.grade || '-'}</span>
                          </div>
                        </li>
                      );
                    })}
                  {schedules.filter((s) => s.date === selectedDate && s.session === 3).length === 0 && (
                    <li className="text-slate-400 italic text-center py-4">Tidak ada jadwal siswa</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CATATAN & LEMBAR PENGESAHAN TANDA TANGAN */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 mt-4 break-inside-avoid">
        {/* Catatan Penting */}
        <div className="text-[10px] text-slate-600 space-y-1">
          <p className="font-bold text-slate-800 uppercase tracking-wider">Catatan:</p>
          <p>1. Siswa diharapkan hadir 5 - 10 menit sebelum jam sesi bimbingan dimulai.</p>
          <p>2. Membawa buku tugas sekolah atau PR dan alat tulis masing-masing.</p>
          <p>3. Konfirmasi izin atau perubahan jadwal dapat menghubungi nomor pengelola.</p>
        </div>

        {/* Kolom Tanda Tangan Resmi */}
        <div className="text-center text-xs flex flex-col items-center ml-auto min-w-[200px]">
          <p className="text-slate-700 font-medium">
            Purbalingga, {todayPrintFormatted}
          </p>
          <p className="text-slate-800 font-bold mt-0.5">
            Pengelola Rumah Belajar Bu Khotimah,
          </p>
          {/* Ruang Tanda Tangan: QR Code Digital atau Manual */}
          {useQrSignature ? (
            <div className="my-1.5 flex flex-col items-center justify-center">
              <div className="w-16 h-16 p-1 bg-white flex items-center justify-center shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/qr-signature.png"
                  alt="QR Code Tanda Tangan Digital Khotimah, S.Pd."
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="h-16 flex items-center justify-center">
              <span className="text-slate-300 italic text-[11px] select-none">( Tanda Tangan / Stempel )</span>
            </div>
          )}
          <p className="font-extrabold text-slate-900 border-b border-slate-900 pb-0.5 inline-block min-w-[150px]">
            Khotimah, S.Pd.
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Guru Pengajar
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal Interaktif Cetak Jadwal
 * Memberikan opsi pemilihan format (Kalender, Tabel, Harian), filter sesi, dan Live Preview
 */
export default function SchedulePrintModal({
  isOpen,
  onClose,
  calendarDate,
  selectedDate,
  schedules,
  studentsMap,
  initialSessionFilter = 'all',
}: SchedulePrintModalProps) {
  const [format, setFormat] = useState<PrintFormat>('calendar');
  const [sessionFilter, setSessionFilter] = useState<'all' | 'sesi-1' | 'sesi-2' | 'sesi-3'>(
    initialSessionFilter
  );
  const [useQrSignature, setUseQrSignature] = useState(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    // Membuka print dialog browser
    window.print();
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* MODAL DIALOG (HANYA DITAMPILKAN DI LAYAR, DISEMBUNYIKAN SAAT CETAK) */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:hidden animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#0284c7] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  Cetak Jadwal Siswa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesuaikan format desain dokumen, filter sesi, dan tinjau sebelum mencetak ke kertas atau PDF.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Tutup"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body: Controls & Live Preview */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Control Bar: Pilihan Format & Sesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              {/* Opsi 1: Pilihan Format Template */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Pilih Format Template Dokumen:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Format Kalender */}
                  <button
                    type="button"
                    onClick={() => setFormat('calendar')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${format === 'calendar'
                      ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Kalender Bulanan</span>
                  </button>

                  {/* Format Rekap Tabel */}
                  <button
                    type="button"
                    onClick={() => setFormat('table')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${format === 'table'
                      ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Rekap Tabel</span>
                  </button>

                  {/* Format Harian */}
                  <button
                    type="button"
                    onClick={() => setFormat('daily')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${format === 'daily'
                      ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Jadwal Harian</span>
                  </button>
                </div>
              </div>

              {/* Opsi 2: Filter Sesi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Filter Sesi yang Dicetak:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSessionFilter('all')}
                    className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all ${sessionFilter === 'all'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Semua Sesi
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionFilter('sesi-1')}
                    className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all ${sessionFilter === 'sesi-1'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Sesi 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionFilter('sesi-2')}
                    className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all ${sessionFilter === 'sesi-2'
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Sesi 2
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionFilter('sesi-3')}
                    className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all ${sessionFilter === 'sesi-3'
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Sesi 3
                  </button>
                </div>
              </div>

              {/* Opsi 3: Tanda Tangan QR Code vs Manual */}
              <div className="md:col-span-2 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    Tanda Tangan Pengesahan:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Pilih menggunakan QR Code digital atau ruang kosong tanda tangan basah.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUseQrSignature(true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${useQrSignature
                      ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <span>QR Code Digital</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseQrSignature(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${!useQrSignature
                      ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Manual</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Document Preview Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Preview
                </span>
                <span>Ukuran Kertas: <strong>{format === 'calendar' ? 'A4 Landscape' : 'A4 Portrait'}</strong></span>
              </div>

              <div className="bg-slate-200/70 p-3 sm:p-6 rounded-2xl border border-slate-300 max-h-[52vh] overflow-y-auto flex justify-center shadow-inner">
                <div
                  className={`bg-white shadow-xl rounded-lg w-full transition-all border border-slate-300 ${format === 'calendar' ? 'max-w-4xl' : 'max-w-2xl'
                    }`}
                >
                  <SchedulePrintDocument
                    format={format}
                    sessionFilter={sessionFilter}
                    calendarDate={calendarDate}
                    selectedDate={selectedDate}
                    schedules={schedules}
                    studentsMap={studentsMap}
                    isPrintPreview={true}
                    useQrSignature={useQrSignature}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/80 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] shadow-md shadow-sky-500/20 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ELEMEN CETAK MURNI (HANYA MUNCUL KETIKA BROWSER DI MODE CETAK / PDF) */}
      {/* ========================================================================= */}
      <div className="hidden print:block w-full">
        <SchedulePrintDocument
          format={format}
          sessionFilter={sessionFilter}
          calendarDate={calendarDate}
          selectedDate={selectedDate}
          schedules={schedules}
          studentsMap={studentsMap}
          isPrintPreview={false}
          useQrSignature={useQrSignature}
        />
      </div>
    </>
  );
}
