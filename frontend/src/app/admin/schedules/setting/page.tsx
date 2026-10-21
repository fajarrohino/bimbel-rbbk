'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { mockStore } from '@/lib/mockData';
import { Student, ScheduleAssignment, ScheduleSession } from '@/types';

interface DragPayload {
  type: 'student-pool' | 'calendar-badge';
  studentId: string;
  studentName: string;
  sourceDate?: string;
  sourceSession?: ScheduleSession;
  sourceAssignmentId?: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'warning' | 'info';
}

export default function AdminAturJadwalPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Month state - default to CURRENT REAL-TIME MONTH AND YEAR (mengikuti hari ini)
  const todayDateObj = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    const y = todayDateObj.getFullYear();
    const m = String(todayDateObj.getMonth() + 1).padStart(2, '0');
    const d = String(todayDateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [todayDateObj]);

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Data state
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<ScheduleAssignment[]>([]);

  // Search filter for student distribution columns
  const [searchQuery, setSearchQuery] = useState('');

  // Drag state
  const [draggedItem, setDraggedItem] = useState<DragPayload | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  // Quick Assign Modal state (for click-to-assign / mobile accessibility)
  const [quickAssignModal, setQuickAssignModal] = useState<{
    isOpen: boolean;
    date: string;
    session: ScheduleSession;
    dateLabel: string;
  } | null>(null);
  const [selectedStudentToAssign, setSelectedStudentToAssign] = useState<string>('');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth & Data loading
  useEffect(() => {
    if (!mockStore.getIsLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = () => {
    // Only active students
    const activeList = mockStore.getStudents().filter((s) => !s.isDeleted && s.status === 'Aktif');
    setStudents(activeList);
    setSchedules(mockStore.getSchedules());
  };

  // ==================== AUTO-SCROLL ENGINE WHILE DRAGGING ====================
  // Memungkinkan layar otomatis scroll ke atas saat menyeret siswa menuju Tanggal 1
  useEffect(() => {
    if (!draggedItem) return;

    let animationFrameId: number | null = null;
    let currentScrollSpeed = 0; // negative = scroll up, positive = scroll down

    const scrollLoop = () => {
      if (currentScrollSpeed < 0 && window.scrollY <= 0) {
        currentScrollSpeed = 0;
        animationFrameId = null;
        return;
      }
      if (
        currentScrollSpeed > 0 &&
        window.innerHeight + window.scrollY >= (document.documentElement.scrollHeight || document.body.scrollHeight) - 2
      ) {
        currentScrollSpeed = 0;
        animationFrameId = null;
        return;
      }
      if (currentScrollSpeed !== 0) {
        window.scrollBy({ top: currentScrollSpeed, left: 0, behavior: 'auto' });
        animationFrameId = requestAnimationFrame(scrollLoop);
      } else {
        animationFrameId = null;
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      // Do NOT call e.preventDefault() here: this ensures only calendar session dropzones
      // (which explicitly call e.preventDefault()) are recognized by the browser as valid drop targets.
      const clientY = e.clientY;
      const viewportHeight = window.innerHeight;

      // Zona sensitif:
      // Area atas (240px pertama dari layar) otomatis scroll naik ke arah Tanggal 1 kalender
      // Area bawah (160px dari dasar layar) otomatis scroll turun
      const topThreshold = 240;
      const bottomThreshold = 160;
      const maxSpeed = 30;

      if (clientY < topThreshold && window.scrollY > 0) {
        // Semakin dekat ke tepi atas layar, semakin cepat kecepatan scroll naik
        const intensity = Math.max(0.3, (topThreshold - clientY) / topThreshold);
        currentScrollSpeed = -Math.round(intensity * maxSpeed);
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(scrollLoop);
        }
      } else if (clientY > viewportHeight - bottomThreshold) {
        const intensity = Math.max(0.3, (clientY - (viewportHeight - bottomThreshold)) / bottomThreshold);
        currentScrollSpeed = Math.round(intensity * maxSpeed);
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(scrollLoop);
        }
      } else {
        currentScrollSpeed = 0;
      }
    };

    const stopScroll = () => {
      currentScrollSpeed = 0;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    window.addEventListener('dragover', handleWindowDragOver, { passive: false });
    window.addEventListener('dragend', stopScroll);
    window.addEventListener('drop', stopScroll);

    return () => {
      stopScroll();
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragend', stopScroll);
      window.removeEventListener('drop', stopScroll);
    };
  }, [draggedItem]);

  // Student lookup map
  const studentsMap = useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach((s) => map.set(s.id, s));
    return map;
  }, [students]);

  // Schedules indexed by date and session for instant lookup
  const scheduleLookup = useMemo(() => {
    const map = new Map<string, ScheduleAssignment[]>();
    schedules.forEach((sch) => {
      const key = `${sch.date}_${sch.session}`;
      const existing = map.get(key) || [];
      existing.push(sch);
      map.set(key, existing);
    });
    return map;
  }, [schedules]);

  // Grouped students for Distribusi Siswa Menurut Sesi
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, searchQuery]);

  const session1Pool = useMemo(
    () => filteredStudents.filter((s) => s.preferredSession === 1),
    [filteredStudents]
  );
  const session2Pool = useMemo(
    () => filteredStudents.filter((s) => s.preferredSession === 2),
    [filteredStudents]
  );
  const session3Pool = useMemo(
    () => filteredStudents.filter((s) => s.preferredSession === 3),
    [filteredStudents]
  );

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isCurrentMonth = useMemo(() => {
    return (
      currentMonthDate.getFullYear() === todayDateObj.getFullYear() &&
      currentMonthDate.getMonth() === todayDateObj.getMonth()
    );
  }, [currentMonthDate, todayDateObj]);

  const handleJumpToToday = () => {
    setCurrentMonthDate(new Date(todayDateObj.getFullYear(), todayDateObj.getMonth(), 1));
    addToast(
      `Menampilkan kalender hari ini (${todayDateObj.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      })})`,
      'info'
    );
  };

  // Month label formatted
  const monthYearLabel = useMemo(() => {
    return currentMonthDate.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentMonthDate]);

  // Calendar matrix calculation (Monday start: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu)
  const calendarCells = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth(); // 0-indexed

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // In JS: Sunday is 0, Monday is 1, ... Saturday is 6
    // Monday start: Monday is index 0, ..., Sunday is index 6
    const firstDayIndex = (firstDay.getDay() + 6) % 7;

    // Previous month info for offset days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDateObj = new Date(year, month - 1, 1);
    const prevMonthName = prevMonthDateObj.toLocaleDateString('id-ID', { month: 'short' });

    // Next month info for offset days
    const nextMonthDateObj = new Date(year, month + 1, 1);
    const nextMonthName = nextMonthDateObj.toLocaleDateString('id-ID', { month: 'short' });

    type CalendarCell =
      | {
        type: 'prev-offset';
        key: string;
        dayNum: number;
        label: string;
      }
      | {
        type: 'current-day';
        key: string;
        dayNum: number;
        dayStr: string;
        dateStr: string;
        isSunday: boolean;
        dayName: string;
      }
      | {
        type: 'next-offset';
        key: string;
        dayNum: number;
        label: string;
      };

    const cells: CalendarCell[] = [];

    // Prefix offset days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      cells.push({
        type: 'prev-offset',
        key: `prev-${dayNum}`,
        dayNum,
        label: `${dayNum} ${prevMonthName}`,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dObj = new Date(year, month, d);
      const isSunday = dObj.getDay() === 0;
      const dayStr = String(d).padStart(2, '0');
      const monthStr = String(month + 1).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      const dayName = dObj.toLocaleDateString('id-ID', { weekday: 'long' });

      cells.push({
        type: 'current-day',
        key: `day-${dateStr}`,
        dayNum: d,
        dayStr,
        dateStr,
        isSunday,
        dayName,
      });
    }

    // Postfix offset days to round to complete weeks (multiples of 7)
    const totalCells = Math.ceil(cells.length / 7) * 7;
    const nextDaysNeeded = totalCells - cells.length;
    for (let n = 1; n <= nextDaysNeeded; n++) {
      const nStr = String(n).padStart(2, '0');
      cells.push({
        type: 'next-offset',
        key: `next-${n}`,
        dayNum: n,
        label: `${nStr} ${nextMonthName}`,
      });
    }

    return cells;
  }, [currentMonthDate]);

  // ==================== DRAG & DROP HANDLERS ====================

  const handleDragStartFromPool = (e: React.DragEvent, student: Student) => {
    const payload: DragPayload = {
      type: 'student-pool',
      studentId: student.id,
      studentName: student.name,
    };
    setDraggedItem(payload);
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragStartFromCalendar = (
    e: React.DragEvent,
    assignment: ScheduleAssignment,
    studentName: string
  ) => {
    const payload: DragPayload = {
      type: 'calendar-badge',
      studentId: assignment.studentId,
      studentName,
      sourceDate: assignment.date,
      sourceSession: assignment.session,
      sourceAssignmentId: assignment.id,
    };
    setDraggedItem(payload);
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverKey(null);
  };

  // Drop onto a Calendar Day Session Dropzone
  const handleDropOnCalendarSession = (
    e: React.DragEvent,
    dateStr: string,
    sessionNum: ScheduleSession
  ) => {
    e.preventDefault();
    setDragOverKey(null);

    let payload = draggedItem;
    if (!payload) {
      try {
        const raw = e.dataTransfer.getData('application/json');
        if (raw) payload = JSON.parse(raw);
      } catch {
        payload = null;
      }
    }
    if (!payload) return;

    const { studentId, studentName, type, sourceAssignmentId, sourceDate, sourceSession } = payload;

    // Check if already assigned to this date and session
    const isAlreadyInTarget = schedules.some(
      (sch) =>
        sch.studentId === studentId &&
        sch.date === dateStr &&
        sch.session === sessionNum &&
        sch.id !== sourceAssignmentId
    );

    if (isAlreadyInTarget) {
      addToast(
        `${studentName} sudah terdaftar pada tanggal ${dateStr} (Sesi ${sessionNum})`,
        'warning'
      );
      return;
    }

    if (type === 'calendar-badge' && sourceAssignmentId) {
      // Move within calendar
      if (sourceDate === dateStr && sourceSession === sessionNum) {
        return; // No-op
      }
      const updated = schedules.map((sch) =>
        sch.id === sourceAssignmentId
          ? { ...sch, date: dateStr, session: sessionNum, updatedAt: new Date().toISOString() }
          : sch
      );
      setSchedules(updated);
      mockStore.saveSchedules(updated);
      addToast(
        `Berhasil memindahkan ${studentName} ke Tanggal ${dateStr} - Sesi ${sessionNum}`,
        'success'
      );
    } else {
      // Add from pool
      const newAssignment: ScheduleAssignment = {
        id: 'sch-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        studentId,
        date: dateStr,
        session: sessionNum,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [...schedules, newAssignment];
      setSchedules(updated);
      mockStore.saveSchedules(updated);
      addToast(
        `Berhasil menjadwalkan ${studentName} ke Tanggal ${dateStr} - Sesi ${sessionNum}`,
        'success'
      );
    }
  };



  // Quick remove from calendar badge button
  const handleRemoveAssignment = (assignmentId: string, studentName: string, dateStr: string) => {
    const updated = schedules.filter((sch) => sch.id !== assignmentId);
    setSchedules(updated);
    mockStore.saveSchedules(updated);
    addToast(`${studentName} dihapus dari jadwal tanggal ${dateStr}`, 'info');
  };

  // Quick modal assign
  const handleOpenQuickAssign = (dateStr: string, sessionNum: ScheduleSession) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const label = `${dateObj.getDate()} ${dateObj.toLocaleDateString('id-ID', {
      month: 'short',
      year: 'numeric',
    })}`;

    // Default select first available student for this session or first active student
    const existingIds = new Set(
      (scheduleLookup.get(`${dateStr}_${sessionNum}`) || []).map((s) => s.studentId)
    );
    const available = students.filter((s) => !existingIds.has(s.id));

    setSelectedStudentToAssign(available[0]?.id || '');
    setQuickAssignModal({
      isOpen: true,
      date: dateStr,
      session: sessionNum,
      dateLabel: label,
    });
  };

  const handleConfirmQuickAssign = () => {
    if (!quickAssignModal || !selectedStudentToAssign) return;

    const { date, session } = quickAssignModal;
    const studentObj = studentsMap.get(selectedStudentToAssign);
    const studentName = studentObj?.name || 'Siswa';

    const newAssignment: ScheduleAssignment = {
      id: 'sch-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      studentId: selectedStudentToAssign,
      date,
      session,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...schedules, newAssignment];
    setSchedules(updated);
    mockStore.saveSchedules(updated);
    addToast(`Berhasil menjadwalkan ${studentName} ke Tanggal ${date} - Sesi ${session}`, 'success');
    setQuickAssignModal(null);
  };

  // Save Schedule Button
  const handleSaveSchedule = () => {
    mockStore.saveSchedules(schedules);
    mockStore.saveStudents(students);
    addToast('Perubahan jadwal & plotting siswa berhasil disimpan ke sistem pusat!', 'success');
  };

  return (
    <div className="min-h-screen bg-background font-sans text-on-surface flex flex-col">
      {/* Toast Notification Container (Top Right - Matching Prototype) */}
      <div
        id="toast-container"
        className="fixed top-24 right-6 sm:right-8 z-50 flex flex-col gap-2.5 pointer-events-none max-w-md w-full"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl shadow-lg bg-surface-container-lowest text-on-surface border-l-4 border-primary transition-all duration-300 animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`material-symbols-outlined text-[20px] shrink-0 ${toast.type === 'warning'
                    ? 'text-amber-500'
                    : toast.type === 'info'
                      ? 'text-sky-500'
                      : 'text-secondary'
                  }`}
              >
                {toast.type === 'warning'
                  ? 'warning'
                  : toast.type === 'info'
                    ? 'info'
                    : 'check_circle'}
              </span>
              <span className="font-semibold text-xs sm:text-sm tracking-tight text-on-surface truncate">
                {toast.message}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-outline hover:text-on-surface p-1 rounded-md transition-colors shrink-0"
              aria-label="Tutup notifikasi"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>

      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Floating Auto-Scroll Drag Helper Strip saat menyeret siswa */}
        {draggedItem && (
          <div
            className="sticky top-20 z-40 bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0284c7] text-white py-2.5 px-6 shadow-lg backdrop-blur-xs flex items-center justify-between text-xs sm:text-sm font-semibold transition-all animate-in fade-in slide-in-from-top-2 border-b border-sky-400/40 select-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] animate-bounce text-amber-300">
                arrow_upward
              </span>
              <span>
                Menyeret: <span className="bg-white/20 px-2 py-0.5 rounded font-bold">{draggedItem.studentName}</span> • Dekatkan kursor ke area atas untuk menggulir otomatis ke Tanggal 1 kalender
              </span>
            </div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              ⬆ Ke Tanggal 1
            </button>
          </div>
        )}

        <main className="relative bg-background min-h-[calc(100vh-80px)] w-full px-4 sm:px-8 pb-16 pt-6 sm:pt-8">
          <div className="flex flex-col w-full gap-6 max-w-[1600px] mx-auto">
            {/* Top Action & Period Bar - Exact match with HTML Prototype */}
            <div className="flex flex-col gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-xs border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                    Atur Jadwal
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Plotting kalender interaktif siswa Rumah Belajar Bu Khotimah dengan sistem seret
                    dan lepas (drag and drop).
                  </p>
                </div>

                {/* Current Date Badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto bg-sky-50 border border-sky-200/80 px-4 py-2 rounded-xl text-xs font-semibold text-[#0284c7] shadow-2xs">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>
                    Hari ini:{' '}
                    {todayDateObj.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* LAYOUT PERTAMA: Kalender Plotting Bulanan */}
            <section className="flex flex-col bg-surface-container-lowest rounded-xl p-6 shadow-xs gap-4 border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                      Kalender Plotting Bulanan
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Month Navigator with Hari Ini Reset Button */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-surface-container rounded-xl p-1 shadow-xs border border-slate-200/60">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          id="prev-month-btn"
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary transition-all active:scale-95"
                          title="Bulan sebelumnya"
                        >
                          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <div className="px-4 flex items-center gap-2 select-none min-w-[150px] justify-center">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            calendar_today
                          </span>
                          <span className="font-label-lg font-bold text-sm text-on-surface capitalize">
                            {monthYearLabel}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          id="next-month-btn"
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary transition-all active:scale-95"
                          title="Bulan berikutnya"
                        >
                          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                      </div>

                      {!isCurrentMonth && (
                        <button
                          type="button"
                          onClick={handleJumpToToday}
                          className="px-3 py-2 rounded-xl text-xs font-semibold bg-sky-50 text-[#0284c7] hover:bg-sky-100 border border-sky-200/80 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          title="Kembali ke bulan dan tahun sekarang"
                        >
                          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                          <span>Hari Ini</span>
                        </button>
                      )}
                    </div>

                    {/* Simpan Jadwal Button */}
                    <button
                      type="button"
                      onClick={handleSaveSchedule}
                      id="btn-save-schedule"
                      className="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-xs flex items-center gap-2 font-label-lg font-semibold text-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>Simpan Jadwal</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions banner */}
              <div className="bg-sky-50/70 border border-sky-100 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-sky-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-600 text-[18px]">touch_app</span>
                  <span>
                    <strong>Tips:</strong> Seret siswa dari kartu sesi di bawah langsung ke slot sesi
                    pada tanggal kalender. Anda juga dapat memindahkan siswa antar tanggal atau
                    mengklik tanda <strong>+</strong> untuk memilih manual.
                  </span>
                </div>
              </div>

              {/* Calendar Grid Table Container */}
              <div className="overflow-x-auto pb-4 -mx-2 px-2">
                <div className="min-w-[1100px] flex flex-col gap-2.5">
                  {/* Day Names Header (Senin - Minggu) */}
                  <div className="grid grid-cols-7 gap-2.5 text-center py-1 font-label-lg font-semibold text-sm">
                    <div className="py-2.5 rounded-lg bg-surface-container-low text-on-surface">
                      Senin
                    </div>
                    <div className="py-2.5 rounded-lg bg-surface-container-low text-on-surface">
                      Selasa
                    </div>
                    <div className="py-2.5 rounded-lg bg-surface-container-low text-on-surface">
                      Rabu
                    </div>
                    <div className="py-2.5 rounded-lg bg-surface-container-low text-on-surface">
                      Kamis
                    </div>
                    <div className="py-2.5 rounded-lg bg-surface-container-low text-on-surface">
                      Jumat
                    </div>
                    <div className="py-2.5 rounded-lg bg-surface-container-low text-on-surface">
                      Sabtu
                    </div>
                    <div className="py-2.5 rounded-lg bg-surface-container-low text-error font-bold">
                      Minggu
                    </div>
                  </div>

                  {/* Calendar Grid Cells */}
                  <div className="grid grid-cols-7 gap-2.5">
                    {calendarCells.map((cell) => {
                      // ================= 1. Bulan Lalu Offset Cell =================
                      if (cell.type === 'prev-offset') {
                        return (
                          <div
                            key={cell.key}
                            className="bg-surface-container-low/40 rounded-xl p-3 min-h-[185px] opacity-40 flex flex-col justify-between border border-dashed border-slate-200/60 select-none"
                          >
                            <span className="font-label-md font-semibold text-xs text-outline">
                              {cell.label}
                            </span>
                            <span className="text-center font-body-sm text-xs text-outline italic">
                              Bulan Lalu
                            </span>
                          </div>
                        );
                      }

                      // ================= 2. Bulan Depan Offset Cell =================
                      if (cell.type === 'next-offset') {
                        return (
                          <div
                            key={cell.key}
                            className="bg-surface-container-low/40 rounded-xl p-3 min-h-[185px] opacity-40 flex flex-col justify-between border border-dashed border-slate-200/60 select-none"
                          >
                            <span className="font-label-md font-semibold text-xs text-outline">
                              {cell.label}
                            </span>
                            <span className="text-center font-body-sm text-xs text-outline italic">
                              Bulan Depan
                            </span>
                          </div>
                        );
                      }

                      // ================= 3. Minggu (Libur) Cell =================
                      if (cell.isSunday) {
                        const isToday = cell.dateStr === todayStr;
                        return (
                          <div
                            key={cell.key}
                            className={`bg-surface-container rounded-xl p-2.5 flex flex-col gap-2 min-h-[185px] border ${isToday
                                ? 'border-2 border-error ring-2 ring-error/20 bg-rose-50/40 relative'
                                : 'border-slate-200/50'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-7 h-7 rounded-lg bg-error-container text-on-error-container flex items-center justify-center font-label-lg font-bold text-xs">
                                  {cell.dayStr}
                                </span>
                                {isToday && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-error text-white uppercase tracking-wider">
                                    Hari Ini
                                  </span>
                                )}
                              </div>
                              <span className="font-label-sm text-xs text-error font-bold">
                                Libur
                              </span>
                            </div>
                            <div className="flex-1 flex items-center justify-center bg-surface-container-high/50 rounded-lg p-3 text-center border border-dashed border-slate-200/70">
                              <span className="font-body-sm text-xs text-outline italic">
                                Rumah Belajar Tutup
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // ================= 4. Hari Kerja (Senin - Sabtu) Cell =================
                      const s1Assignments = scheduleLookup.get(`${cell.dateStr}_1`) || [];
                      const s2Assignments = scheduleLookup.get(`${cell.dateStr}_2`) || [];
                      const s3Assignments = scheduleLookup.get(`${cell.dateStr}_3`) || [];

                      const isS1Over = dragOverKey === `${cell.dateStr}_1`;
                      const isS2Over = dragOverKey === `${cell.dateStr}_2`;
                      const isS3Over = dragOverKey === `${cell.dateStr}_3`;

                      const isToday = cell.dateStr === todayStr;

                      return (
                        <div
                          key={cell.key}
                          className={`bg-surface-container-low rounded-xl p-2.5 flex flex-col gap-2 min-h-[185px] transition-all hover:bg-surface-container/80 shadow-2xs ${isToday
                              ? 'border-2 border-[#0284c7] ring-2 ring-[#0284c7]/20 bg-sky-50/40 relative'
                              : 'border border-slate-100'
                            }`}
                        >
                          {/* Day Header Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-label-lg font-bold text-xs ${isToday
                                    ? 'bg-[#0284c7] text-white shadow-xs'
                                    : 'bg-surface-container-highest text-on-surface'
                                  }`}
                              >
                                {cell.dayStr}
                              </span>
                              {isToday && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#0284c7] text-white uppercase tracking-wider shadow-2xs">
                                  Hari Ini
                                </span>
                              )}
                            </div>
                            <span className="font-label-sm text-[11px] text-secondary font-semibold">
                              Hari Kerja
                            </span>
                          </div>

                          {/* 3 Session Dropzones */}
                          <div className="flex flex-col gap-1.5 flex-1">
                            {/* Sesi 1 Dropzone */}
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                setDragOverKey(`${cell.dateStr}_1`);
                              }}
                              onDragLeave={() => {
                                if (dragOverKey === `${cell.dateStr}_1`) setDragOverKey(null);
                              }}
                              onDrop={(e) => handleDropOnCalendarSession(e, cell.dateStr, 1)}
                              className={`session-dropzone rounded-lg p-1.5 bg-tertiary-fixed/30 hover:bg-tertiary-fixed/60 transition-all min-h-[40px] flex flex-col gap-1 border ${isS1Over
                                  ? 'ring-2 ring-amber-400 bg-tertiary-fixed/70 scale-[1.02] shadow-sm'
                                  : 'border-amber-200/40'
                                }`}
                              data-date={cell.dateStr}
                              data-session="Sesi 1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-label-sm text-[11px] text-tertiary font-bold tracking-tight">
                                  Sesi 1
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenQuickAssign(cell.dateStr, 1)}
                                  className="text-tertiary/70 hover:text-tertiary text-[11px] font-bold p-0.5 rounded hover:bg-white/50 transition-colors"
                                  title="Tambah siswa ke Sesi 1"
                                >
                                  +
                                </button>
                              </div>

                              <div className="drop-target-area flex flex-wrap gap-1">
                                {s1Assignments.map((sch) => {
                                  const student = studentsMap.get(sch.studentId);
                                  const sName = student?.name || 'Siswa';
                                  return (
                                    <div
                                      key={sch.id}
                                      draggable
                                      onDragStart={(e) =>
                                        handleDragStartFromCalendar(e, sch, sName)
                                      }
                                      onDragEnd={handleDragEnd}
                                      className="student-card cursor-grab active:cursor-grabbing bg-surface-container-lowest text-on-surface px-2 py-0.5 rounded shadow-2xs flex items-center justify-between gap-1 font-label-sm text-[11px] hover:text-primary transition-all border border-slate-200/50 group select-none"
                                      data-student={sName}
                                      title={`Seret untuk memindahkan atau klik silang untuk menghapus ${sName}`}
                                    >
                                      <div className="flex items-center gap-1 min-w-0">
                                        <span className="material-symbols-outlined text-[13px] text-outline group-hover:text-primary shrink-0">
                                          drag_indicator
                                        </span>
                                        <span className="truncate max-w-[95px]">{sName}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveAssignment(sch.id, sName, cell.dateStr);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 hover:text-rose-500 text-slate-400 text-[10px] ml-1 transition-opacity"
                                        title="Hapus dari sesi ini"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Sesi 2 Dropzone */}
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                setDragOverKey(`${cell.dateStr}_2`);
                              }}
                              onDragLeave={() => {
                                if (dragOverKey === `${cell.dateStr}_2`) setDragOverKey(null);
                              }}
                              onDrop={(e) => handleDropOnCalendarSession(e, cell.dateStr, 2)}
                              className={`session-dropzone rounded-lg p-1.5 bg-primary-fixed/30 hover:bg-primary-fixed/60 transition-all min-h-[40px] flex flex-col gap-1 border ${isS2Over
                                  ? 'ring-2 ring-sky-400 bg-primary-fixed/70 scale-[1.02] shadow-sm'
                                  : 'border-sky-200/40'
                                }`}
                              data-date={cell.dateStr}
                              data-session="Sesi 2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-label-sm text-[11px] text-primary font-bold tracking-tight">
                                  Sesi 2
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenQuickAssign(cell.dateStr, 2)}
                                  className="text-primary/70 hover:text-primary text-[11px] font-bold p-0.5 rounded hover:bg-white/50 transition-colors"
                                  title="Tambah siswa ke Sesi 2"
                                >
                                  +
                                </button>
                              </div>

                              <div className="drop-target-area flex flex-wrap gap-1">
                                {s2Assignments.map((sch) => {
                                  const student = studentsMap.get(sch.studentId);
                                  const sName = student?.name || 'Siswa';
                                  return (
                                    <div
                                      key={sch.id}
                                      draggable
                                      onDragStart={(e) =>
                                        handleDragStartFromCalendar(e, sch, sName)
                                      }
                                      onDragEnd={handleDragEnd}
                                      className="student-card cursor-grab active:cursor-grabbing bg-surface-container-lowest text-on-surface px-2 py-0.5 rounded shadow-2xs flex items-center justify-between gap-1 font-label-sm text-[11px] hover:text-primary transition-all border border-slate-200/50 group select-none"
                                      data-student={sName}
                                      title={`Seret untuk memindahkan atau klik silang untuk menghapus ${sName}`}
                                    >
                                      <div className="flex items-center gap-1 min-w-0">
                                        <span className="material-symbols-outlined text-[13px] text-outline group-hover:text-primary shrink-0">
                                          drag_indicator
                                        </span>
                                        <span className="truncate max-w-[95px]">{sName}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveAssignment(sch.id, sName, cell.dateStr);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 hover:text-rose-500 text-slate-400 text-[10px] ml-1 transition-opacity"
                                        title="Hapus dari sesi ini"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Sesi 3 Dropzone */}
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                setDragOverKey(`${cell.dateStr}_3`);
                              }}
                              onDragLeave={() => {
                                if (dragOverKey === `${cell.dateStr}_3`) setDragOverKey(null);
                              }}
                              onDrop={(e) => handleDropOnCalendarSession(e, cell.dateStr, 3)}
                              className={`session-dropzone rounded-lg p-1.5 bg-secondary-fixed/30 hover:bg-secondary-fixed/60 transition-all min-h-[40px] flex flex-col gap-1 border ${isS3Over
                                  ? 'ring-2 ring-teal-400 bg-secondary-fixed/70 scale-[1.02] shadow-sm'
                                  : 'border-teal-200/40'
                                }`}
                              data-date={cell.dateStr}
                              data-session="Sesi 3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-label-sm text-[11px] text-secondary font-bold tracking-tight">
                                  Sesi 3
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenQuickAssign(cell.dateStr, 3)}
                                  className="text-secondary/70 hover:text-secondary text-[11px] font-bold p-0.5 rounded hover:bg-white/50 transition-colors"
                                  title="Tambah siswa ke Sesi 3"
                                >
                                  +
                                </button>
                              </div>

                              <div className="drop-target-area flex flex-wrap gap-1">
                                {s3Assignments.map((sch) => {
                                  const student = studentsMap.get(sch.studentId);
                                  const sName = student?.name || 'Siswa';
                                  return (
                                    <div
                                      key={sch.id}
                                      draggable
                                      onDragStart={(e) =>
                                        handleDragStartFromCalendar(e, sch, sName)
                                      }
                                      onDragEnd={handleDragEnd}
                                      className="student-card cursor-grab active:cursor-grabbing bg-surface-container-lowest text-on-surface px-2 py-0.5 rounded shadow-2xs flex items-center justify-between gap-1 font-label-sm text-[11px] hover:text-primary transition-all border border-slate-200/50 group select-none"
                                      data-student={sName}
                                      title={`Seret untuk memindahkan atau klik silang untuk menghapus ${sName}`}
                                    >
                                      <div className="flex items-center gap-1 min-w-0">
                                        <span className="material-symbols-outlined text-[13px] text-outline group-hover:text-primary shrink-0">
                                          drag_indicator
                                        </span>
                                        <span className="truncate max-w-[95px]">{sName}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveAssignment(sch.id, sName, cell.dateStr);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 hover:text-rose-500 text-slate-400 text-[10px] ml-1 transition-opacity"
                                        title="Hapus dari sesi ini"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* LAYOUT KEDUA: TABEL 3 SESI (Distribusi Siswa Menurut Sesi) */}
            <section className="flex flex-col bg-surface-container-lowest rounded-xl p-6 shadow-xs gap-6 border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-[24px]">view_column</span>
                  <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                    Distribusi Siswa Menurut Sesi
                  </h2>
                </div>

                {/* Search Filter for Student Roster */}
                <div className="relative w-full sm:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama siswa..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-surface-container-low border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Sejajar Kolom Sesi: Sesi 1, Sesi 2, Sesi 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ================= KOLOM 1: Sesi 1 ================= */}
                <div className="flex flex-col bg-surface-container-low rounded-xl p-5 gap-4 border border-slate-100/80">
                  <div className="flex items-center justify-between pb-1 border-b-0">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-tertiary-fixed-dim" />
                      <h3 className="font-headline-sm font-bold text-lg text-on-surface">Sesi 1</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-800">
                        {session1Pool.length} Siswa
                      </span>
                    </div>
                    <span
                      className="material-symbols-outlined text-outline text-[20px]"
                      title="Area seret untuk memindahkan siswa"
                    >
                      pan_tool
                    </span>
                  </div>

                  {/* Sesi 1 Student List (Drag source only) */}
                  <div className="flex flex-col gap-2.5 min-h-[360px] p-2 rounded-xl transition-all">
                    {session1Pool.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">
                          person_off
                        </span>
                        <p className="text-xs">Tidak ada siswa di Sesi 1</p>
                      </div>
                    ) : (
                      session1Pool.map((student) => (
                        <div
                          key={student.id}
                          draggable
                          onDragStart={(e) => handleDragStartFromPool(e, student)}
                          onDragEnd={handleDragEnd}
                          className="student-card cursor-grab active:cursor-grabbing bg-surface-container-lowest hover:shadow-md p-3.5 rounded-xl flex items-center justify-between transition-all group border border-slate-100 select-none"
                          data-student={student.name}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px] shrink-0">
                              drag_indicator
                            </span>
                            <span className="font-label-lg font-semibold text-sm text-on-surface group-hover:text-primary truncate">
                              {student.name}
                            </span>
                          </div>
                          <span className="material-symbols-outlined text-[16px] text-outline/60 group-hover:text-primary transition-colors shrink-0">
                            open_with
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* ================= KOLOM 2: Sesi 2 ================= */}
                <div className="flex flex-col bg-surface-container-low rounded-xl p-5 gap-4 border border-slate-100/80">
                  <div className="flex items-center justify-between pb-1 border-b-0">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-primary-fixed" />
                      <h3 className="font-headline-sm font-bold text-lg text-on-surface">Sesi 2</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100/70 text-sky-800">
                        {session2Pool.length} Siswa
                      </span>
                    </div>
                    <span
                      className="material-symbols-outlined text-outline text-[20px]"
                      title="Area seret untuk memindahkan siswa"
                    >
                      pan_tool
                    </span>
                  </div>

                  {/* Sesi 2 Student List (Drag source only) */}
                  <div className="flex flex-col gap-2.5 min-h-[360px] p-2 rounded-xl transition-all">
                    {session2Pool.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">
                          person_off
                        </span>
                        <p className="text-xs">Tidak ada siswa di Sesi 2</p>
                      </div>
                    ) : (
                      session2Pool.map((student) => (
                        <div
                          key={student.id}
                          draggable
                          onDragStart={(e) => handleDragStartFromPool(e, student)}
                          onDragEnd={handleDragEnd}
                          className="student-card cursor-grab active:cursor-grabbing bg-surface-container-lowest hover:shadow-md p-3.5 rounded-xl flex items-center justify-between transition-all group border border-slate-100 select-none"
                          data-student={student.name}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px] shrink-0">
                              drag_indicator
                            </span>
                            <span className="font-label-lg font-semibold text-sm text-on-surface group-hover:text-primary truncate">
                              {student.name}
                            </span>
                          </div>
                          <span className="material-symbols-outlined text-[16px] text-outline/60 group-hover:text-primary transition-colors shrink-0">
                            open_with
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* ================= KOLOM 3: Sesi 3 ================= */}
                <div className="flex flex-col bg-surface-container-low rounded-xl p-5 gap-4 border border-slate-100/80">
                  <div className="flex items-center justify-between pb-1 border-b-0">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-secondary-fixed" />
                      <h3 className="font-headline-sm font-bold text-lg text-on-surface">Sesi 3</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100/70 text-teal-800">
                        {session3Pool.length} Siswa
                      </span>
                    </div>
                    <span
                      className="material-symbols-outlined text-outline text-[20px]"
                      title="Area seret untuk memindahkan siswa"
                    >
                      pan_tool
                    </span>
                  </div>

                  {/* Sesi 3 Student List (Drag source only) */}
                  <div className="flex flex-col gap-2.5 min-h-[360px] p-2 rounded-xl transition-all">
                    {session3Pool.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">
                          person_off
                        </span>
                        <p className="text-xs">Tidak ada siswa di Sesi 3</p>
                      </div>
                    ) : (
                      session3Pool.map((student) => (
                        <div
                          key={student.id}
                          draggable
                          onDragStart={(e) => handleDragStartFromPool(e, student)}
                          onDragEnd={handleDragEnd}
                          className="student-card cursor-grab active:cursor-grabbing bg-surface-container-lowest hover:shadow-md p-3.5 rounded-xl flex items-center justify-between transition-all group border border-slate-100 select-none"
                          data-student={student.name}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px] shrink-0">
                              drag_indicator
                            </span>
                            <span className="font-label-lg font-semibold text-sm text-on-surface group-hover:text-primary truncate">
                              {student.name}
                            </span>
                          </div>
                          <span className="material-symbols-outlined text-[16px] text-outline/60 group-hover:text-primary transition-colors shrink-0">
                            open_with
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* QUICK ASSIGN MODAL (FOR TOUCH / ACCESSIBLE ASSIGNMENT) */}
      {quickAssignModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setQuickAssignModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Tambah Siswa ke Jadwal</h3>
                <p className="text-xs text-slate-500">
                  Tanggal: {quickAssignModal.date} • Sesi {quickAssignModal.session}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuickAssignModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Siswa Aktif:
              </label>
              <select
                value={selectedStudentToAssign}
                onChange={(e) => setSelectedStudentToAssign(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium text-slate-800"
              >
                <option value="" disabled>
                  -- Pilih Siswa --
                </option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} (Sesi Rekomendasi: {st.preferredSession})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickAssignModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!selectedStudentToAssign}
                onClick={handleConfirmQuickAssign}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-container disabled:opacity-50 transition-all shadow-xs"
              >
                Jadwalkan Siswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
