'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { mockStore } from '@/lib/mockData';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export default function AdminHeader({ onToggleSidebar, title }: AdminHeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin logout dari sesi admin?')) {
      mockStore.setLoggedIn(false);
      router.push('/admin/login');
    }
  };

  // Close dropdown on click outside (matching assets-rbbk script behavior)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Buka navigasi sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {title && (
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            {title}
          </h2>
        )}
      </div>

      {/* Right Action Items: Notifikasi & Profile Dropdown (sesuai assets-rbbk/componen_sidebar/sidebar.html) */}
      <div className="flex items-center gap-4">
        {/* 1. Icon Notifikasi */}
        <div className="relative">
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center transition-colors relative"
            title="Notifikasi"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Red notification dot */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>
        </div>

        {/* 2. Profile Icon & Dropdown */}
        <div className="relative" ref={profileContainerRef} id="profile-container">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            id="profile-btn"
            className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/80 text-[#0284c7] hover:bg-sky-100 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20"
            title="Profil Pengguna & Logout"
            aria-expanded={dropdownOpen}
          >
            {/* Icon Profile */}
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>

          {/* Dropdown Menu Profile & Logout */}
          {dropdownOpen && (
            <div
              id="profile-dropdown"
              className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 transform transition-all duration-150 origin-top-right"
            >
              {/* Header Info Akun */}
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800 leading-tight">Bu Khotimah</p>
                <p className="text-xs text-slate-400 font-medium">Owner / Admin</p>
              </div>

              {/* Item 1: Profile */}
              <button
                type="button"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0284c7] transition-colors text-left"
              >
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Profile</span>
              </button>

              {/* Divider */}
              <div className="my-1.5 border-t border-slate-100" />

              {/* Item 2: Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <svg
                  className="w-4 h-4 text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
