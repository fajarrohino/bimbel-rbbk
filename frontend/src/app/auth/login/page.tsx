'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockStore } from '@/lib/mockData';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard (PRD 12.2)
    if (mockStore.getIsLoggedIn()) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username tidak boleh kosong');
      return;
    }
    if (!password.trim()) {
      setError('Password tidak boleh kosong');
      return;
    }

    setLoading(true);

    // Mock verification for Phase 1
    setTimeout(() => {
      // In Phase 1 frontend mock, allow login and store session
      mockStore.setLoggedIn(true);
      router.push('/admin');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient background glow ornaments */}
      <div className="absolute -top-32 -left-20 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Top Simple Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 relative shrink-0">
            <Image
              src="/logo-rbbk.png"
              alt="Logo Rumah Belajar Bu Khotimah"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[15px] tracking-tight text-[#0284c7] leading-tight">
              Rumah Belajar
            </span>
            <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
              Bu Khotimah
            </span>
          </div>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto px-4 py-8">
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#0284c7] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Login admin
          </h1>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="username">
                Username Admin
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username admin"
                  className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284c7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-11 py-3 bg-white text-slate-900 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284c7] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded"
                  title="Lihat kata sandi"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-[#0284c7]">Kredensial Uji Coba (Fase 1 Mock):</p>
              <p>Username: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">bukhotimah</code></p>
              <p>Password: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">password123</code></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm shadow-md shadow-[#0284c7]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 border-t border-slate-100">
        Developer by EANNOY
      </footer>
    </div>
  );
}
