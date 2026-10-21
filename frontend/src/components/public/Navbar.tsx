'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-xl p-1 -m-1"
          >
            <span className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
              Rumah <span className="text-[#0284c7]">Belajar</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0284c7] ml-0.5 align-baseline"></span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/#program"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 rounded-xl hover:bg-slate-50 transition-all"
            >
              Program Belajar
            </Link>
            <Link
              href="/about-us"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 rounded-xl hover:bg-slate-50 transition-all"
            >
              Tentang Kami
            </Link>
          </nav>

          {/* Desktop Action Buttons (WhatsApp & Daftar) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/registration"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md shadow-brand-600/25 transition-all duration-200"
            >
              Daftar
            </Link>
            <a
              href="https://wa.me/6285865777636?text=Halo%20Bu%20Khotimah,%20saya%20ingin%20konsultasi%20kelas%20untuk%20anak%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-wa-700 bg-wa-50 hover:bg-wa-500 hover:text-white border border-emerald-200 hover:border-transparent transition-all duration-200 shadow-sm"
            >
              <span className="material-symbols-outlined text-[19px]">chat</span>
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            <Link
              href="/#program"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-link flex items-center px-3.5 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              Program Belajar
            </Link>
            <Link
              href="/about-us"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-link flex items-center px-3.5 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              Tentang Kami
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/registration"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-link flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/25 transition-all"
            >
              Daftar
            </Link>
            <a
              href="https://wa.me/6285865777636?text=Halo%20Bu%20Khotimah,%20saya%20ingin%20konsultasi%20kelas%20untuk%20anak%20saya"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-link flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold text-wa-700 bg-wa-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-600">chat</span>
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
