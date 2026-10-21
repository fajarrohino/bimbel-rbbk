import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* Kolom Brand & Logo */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-4">
              <div className="shrink-0 flex items-center justify-center">
                <Image
                  src="/logo-rbbk.png"
                  alt="Logo Rumah Belajar Bu Khotimah"
                  width={128}
                  height={128}
                  className="h-28 sm:h-32 w-auto object-contain filter drop-shadow"
                />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>Rumah</span>
                  <span className="text-sky-400">Belajar</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400 inline-block ml-0.5"></span>
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5">Bu Khotimah</p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed pr-4">
              Bimbingan belajar anak ramah, sabar, dan terarah untuk usia 7–13 tahun. Membangun dasar berpikir kritis dan karakter anak berprestasi di sekolah dengan suasana belajar yang menyenangkan.
            </p>

            {/* Info Lokasi */}
            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-400 pt-1">
              <svg className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Sumingkir, Bantarbarang RT 03 RW 09 No 48, Kec. Rembang, Kab. Purbalingga, Jawa Tengah</span>
            </div>
          </div>

          {/* Kolom Menu Navigasi */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-bold tracking-wider uppercase text-sky-400">Menu</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#program" className="text-slate-300 hover:text-white transition duration-200">
                  Program Belajar
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-slate-300 hover:text-white transition duration-200">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Program Bimbingan */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-bold tracking-wider uppercase text-sky-400">Program</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-300">Calistung Dasar</span>
              </li>
              <li>
                <span className="text-slate-300">Pendampingan PR</span>
              </li>
              <li>
                <span className="text-slate-300">Kurikulum Sekolah</span>
              </li>
              <li>
                <span className="text-slate-300">Penguatan Materi</span>
              </li>
              <li>
                <span className="text-slate-300">Persiapan ASTS/ASAS</span>
              </li>
            </ul>
          </div>

          {/* Kolom Kontak, Sosial & CTA */}
          <div className="lg:col-span-3 space-y-5">
            <p className="text-xs font-bold tracking-wider uppercase text-sky-400">Kontak &amp; Sosmed</p>

            {/* Media Sosial Icons */}
            <div className="flex items-center gap-3">
              {/* WhatsApp Link */}
              <a
                href="https://wa.me/6285865777636?text=Halo%20Bu%20Khotimah,%20saya%20ingin%20konsultasi%20kelas%20untuk%20anak%20saya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                title="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path>
                </svg>
              </a>

              {/* Instagram Link */}
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 border border-slate-700 hover:border-transparent text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>

              {/* YouTube Link */}
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-red-600 border border-slate-700 hover:border-transparent text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                title="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </a>

              {/* TikTok Link */}
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-black border border-slate-700 hover:border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                title="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"></path>
                </svg>
              </a>
            </div>

            {/* Tombol CTA Daftar Sekarang */}
            <div className="pt-2">
              <Link
                href="/registration"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition duration-200 group"
              >
                Daftar
              </Link>
            </div>
          </div>

        </div>

        {/* Garis Pemisah & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 Rumah Belajar Bu Khotimah. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition cursor-pointer">
              Bimbingan Belajar Ramah Anak &amp; Terpercaya di Purbalingga
            </span>
            {/* <Link href="/auth/login" className="hover:text-slate-400 transition-colors">
              Portal Admin
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
