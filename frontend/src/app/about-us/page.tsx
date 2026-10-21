'use client';

import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function AboutUsPage() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Top Subtle Ambient Light Glow */}
          <div className="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin overflow-hidden pointer-events-none select-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-gradient-to-b from-primary-fixed/40 via-surface-container/30 to-transparent blur-3xl -z-10 rounded-full"></div>
          </div>

          {/* SECTION 1: HERO (PROFIL UTAMA) */}
          <section className="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pt-4 sm:pt-6 md:pt-space-xl pb-8 md:pb-space-xl" id="profil">
            {/* Decorative ambient glow elements */}
            <div className="absolute -top-24 -left-12 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-1/3 right-0 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] bg-secondary-fixed/25 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div className="relative w-full flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 lg:gap-0 min-h-0 lg:min-h-[660px]">
              {/* Content column: Open, clean, editorial styling with wide breathing room */}
              <div className="relative z-10 w-full md:w-[56%] lg:w-[60%] space-y-space-md pt-space-xs sm:pt-space-sm md:pt-space-md pb-2 md:pb-space-xl">
                {/* Pill Badges */}
                <div className="flex flex-wrap items-center gap-space-xs">
                  <div className="inline-flex items-center gap-1.5 px-3 sm:px-space-md py-1 rounded-full bg-primary-fixed/40 text-primary font-label-sm text-label-sm font-semibold tracking-wide">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Mahasiswa PPG Prajabatan 2026</span>
                  </div>
                </div>

                {/* Headline & Sub-headline */}
                <div className="space-y-space-xs">
                  <h1 className="font-display-hero text-display-hero-mobile sm:text-4xl lg:text-display-hero text-on-surface tracking-tight font-extrabold">
                    Khotimah, <span className="text-primary">S.Pd.</span>
                  </h1>
                </div>

                {/* Mobile-only Cutout Portrait (visible on < md, so it doesn't overlap text) */}
                <div className="md:hidden w-full flex justify-center py-2 relative my-1">
                  <div className="absolute w-[240px] sm:w-[280px] h-[240px] sm:h-[280px] rounded-full bg-gradient-to-b from-primary-fixed/30 to-transparent blur-2xl -z-10 bottom-2"></div>
                  <img
                    alt="Khotimah, S.Pd. Toga Portrait"
                    className="w-auto max-h-[300px] sm:max-h-[360px] object-contain object-bottom drop-shadow-sm select-none"
                    src="/toga-khotimah.png"
                  />
                </div>

                {/* Welcoming Editorial Narration */}
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl text-sm sm:text-base md:text-body-lg">
                  Sebagai pengajar sekolah dasar yang adaptif dan berdedikasi, saya mengombinasikan pembelajaran berdiferensiasi dengan media visual interaktif untuk menciptakan ruang belajar yang menyenangkan, aman, dan memicu rasa ingin tahu anak. Melalui pendekatan berbasis proyek dan pemanfaatan teknologi edukatif yang humanis, saya membimbing setiap murid menemukan potensi terbaiknya serta membentuk karakter Profil Pelajar Pancasila secara berkelanjutan.
                </p>

                {/* Quick Meta Chips */}
                <div className="pt-space-xs flex flex-wrap gap-2 sm:gap-space-xs">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-primary text-[16px]">domain</span>
                    <span>SD Negeri Trangsan 01</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    <span>Siklus 1–4 Selesai</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">auto_awesome</span>
                    <span>Berbasis Proyek &amp; Diferensiasi</span>
                  </div>
                </div>

                {/* Action Call-to-Actions */}
              </div>

              {/* Tablet & Desktop Cutout Portrait (hidden on mobile, visible on md and up) */}
              <div className="hidden md:flex md:w-[44%] lg:w-[48%] lg:absolute lg:right-0 lg:bottom-0 lg:top-0 pointer-events-none select-none items-end justify-center lg:justify-end z-0">
                <div className="absolute w-[340px] md:w-[380px] lg:w-[460px] h-[340px] md:h-[380px] lg:h-[460px] rounded-full bg-gradient-to-b from-primary-fixed/20 to-transparent blur-3xl -z-10 bottom-6 md:bottom-8 right-4 lg:right-6"></div>
                <img
                  alt="Khotimah, S.Pd. Toga Portrait"
                  className="h-auto md:max-h-[480px] lg:max-h-[680px] w-auto object-contain object-bottom origin-bottom z-0"
                  src="/toga-khotimah.png"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: ABOUT STATEMENT (VISI & DEDIKASI) */}
          <section className="w-full bg-surface-container-low py-8 md:py-space-xl my-4 md:my-space-lg" id="visi-pendidikan">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin space-y-6 md:space-y-space-xl">
              {/* Section Header */}
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-xs">
                <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
                  Prinsip &amp; Landasan Mengajar
                </span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  Komitmen Pendidikan
                </h2>
                <div className="w-12 h-1 bg-primary rounded-full mt-1"></div>
              </div>

              {/* Manifesto Quote Card */}
              <div className="max-w-4xl mx-auto p-4 sm:p-space-lg md:p-space-xl rounded-2xl md:rounded-3xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
                <span className="material-symbols-outlined text-primary/10 text-[64px] sm:text-[96px] absolute -top-2 -left-2 sm:-top-4 sm:-left-3 select-none pointer-events-none">
                  format_quote
                </span>
                <div className="relative z-10 space-y-space-sm text-center md:text-left">
                  <p className="font-headline-sm text-headline-sm text-on-surface leading-relaxed italic font-normal text-sm sm:text-base md:text-headline-sm">
                    &quot;Fokus utama saya tertuju pada <span className="font-bold text-primary">pengembangan kompetensi pedagogik</span>, pemanfaatan <span className="font-bold text-secondary">teknologi edukatif</span> yang inklusif, serta <span className="font-bold text-primary-container">pengelolaan kelas yang adaptif</span>. Berdedikasi tinggi untuk menjadi pendidik yang profesional, <span className="font-bold text-tertiary">inovatif</span>, dan berintegritas tinggi dalam membentuk karakter mulia peserta didik.&quot;
                  </p>
                  <div className="pt-space-xs flex items-center justify-center md:justify-start gap-space-sm">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium text-xs sm:text-label-md">
                      Manifesto Guru Profesional Khotimah, S.Pd.
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Pillar Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-space-lg">
                {/* Pillar 1 */}
                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col space-y-space-sm group">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-[24px]">
                      psychology
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Kompetensi Pedagogik
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-sm sm:text-body-md">
                    Merancang asesmen komprehensif (diagnostik &amp; formatif) serta diferensiasi pembelajaran ramah anak yang menstimulasi rasa ingin tahu dan nalar kritis siswa sejak dini.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col space-y-space-sm group">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center group-hover:bg-secondary transition-colors shrink-0">
                    <span className="material-symbols-outlined text-secondary group-hover:text-on-secondary text-[24px]">
                      devices
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Pemanfaatan Teknologi
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-sm sm:text-body-md">
                    Integrasi media digital interaktif, video pembelajaran visual kreatif, kuis adaptif, serta perangkat multimedia untuk menyajikan konsep abstrak menjadi konkret dan menggembirakan.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col space-y-space-sm group">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center group-hover:bg-tertiary transition-colors shrink-0">
                    <span className="material-symbols-outlined text-tertiary group-hover:text-on-tertiary text-[24px]">
                      diversity_3
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Pengelolaan Kelas Adaptif
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-sm sm:text-body-md">
                    Membangun atmosfer belajar yang aman secara sosio-emosional, inklusif, kondusif, dan konsisten berorientasi pada pembiasaan budi pekerti luhur serta saling menghargai.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: EXPERIENCE & MILESTONES (PENGALAMAN PRAKTIK PPL) */}
          <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-8 md:py-space-xl" id="pengalaman-ppl">
            <div className="space-y-6 md:space-y-space-xl">
              {/* Section Tag & Title */}
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-xs">
                <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
                  Rekam Jejak Lapangan Nyata
                </span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  Praktik Pengalaman Lapangan
                </h2>
              </div>

              {/* School Info Hero Card */}
              <div className="p-4 sm:p-space-lg md:p-space-xl rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary-fixed/50 via-surface-container-low to-secondary-fixed/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md md:gap-space-lg">
                <div className="space-y-space-xs max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Sekolah Penugasan Resmi</span>
                  </div>
                  <h3 className="font-headline-md text-xl md:text-headline-md text-on-surface font-bold">
                    SD Negeri Trangsan 01, Kec. Gatak, Kab. Sukoharjo
                  </h3>
                </div>
              </div>

              {/* Structured Vertical Timeline */}
              <div className="relative pl-8 sm:pl-10 md:pl-12 space-y-4 sm:space-y-6 md:space-y-space-xl before:content-[''] before:absolute before:left-3 sm:before:left-3.5 md:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
                {/* Cycle 1 */}
                <div className="relative group">
                  <div className="absolute left-0 top-1 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md font-label-sm text-label-sm">
                    1
                  </div>
                  <div className="p-4 sm:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow space-y-space-xs">
                    <div className="flex flex-wrap items-center justify-between gap-space-xs">
                      <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                        Siklus 1 • Fondasi Awal
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base sm:text-headline-sm">
                      Fondasi &amp; Observasi Karakteristik Siswa
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md">
                      Melakukan pemetaan gaya belajar, asesmen diagnostik kognitif &amp; non-kognitif, observasi dinamika kelas, serta penyusunan modul ajar terbimbing secara intensif bersama Guru Pamong dan Dosen Pembimbing Lapangan.
                    </p>
                  </div>
                </div>

                {/* Cycle 2 */}
                <div className="relative group">
                  <div className="absolute left-0 top-1 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md font-label-sm text-label-sm">
                    2
                  </div>
                  <div className="p-4 sm:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow space-y-space-xs">
                    <div className="flex flex-wrap items-center justify-between gap-space-xs">
                      <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                        Siklus 2 • Praktik Mengajar Mandiri 1 (UTS)
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base sm:text-headline-sm">
                      Implementasi Pembelajaran Berdiferensiasi
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md">
                      Penerapan diferensiasi konten dan proses menggunakan media konkret visual, modul ajar berbasis kontekstual Kurikulum Merdeka, serta instrumen asesmen formatif berkelanjutan untuk mengukur kemajuan belajar setiap anak.
                    </p>
                  </div>
                </div>

                {/* Cycle 3 */}
                <div className="relative group">
                  <div className="absolute left-0 top-1 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md font-label-sm text-label-sm">
                    3
                  </div>
                  <div className="p-4 sm:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow space-y-space-xs">
                    <div className="flex flex-wrap items-center justify-between gap-space-xs">
                      <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                        Siklus 3 • Penguatan &amp; Open Class
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base sm:text-headline-sm">
                      Open Class Observasi Sejawat &amp; LKPD Kontekstual
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md">
                      Melaksanakan sesi <em>Open Class</em> dengan supervisi teman sejawat, mengembangkan LKPD kontekstual berbasis potensi lingkungan lokal Sukoharjo, serta merancang program intervensi pengayaan dan remedial tepat sasaran.
                    </p>
                  </div>
                </div>

                {/* Cycle 4 */}
                <div className="relative group">
                  <div className="absolute left-0 top-1 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md font-label-sm text-label-sm">
                    4
                  </div>
                  <div className="p-4 sm:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow space-y-space-xs">
                    <div className="flex flex-wrap items-center justify-between gap-space-xs">
                      <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                        Siklus 4 • UAS &amp; Evaluasi Komprehensif
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base sm:text-headline-sm">
                      Gelar Pameran Karya Siswa &amp; Refleksi Siklus Gibbs
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md">
                      Penyelenggaraan &quot;Galeri Belajar Siswa&quot; sebagai wujud asesmen sumatif autentik, disempurnakan dengan penulisan laporan refleksi pedagogik mendalam menggunakan kerangka kerja Gibbs Reflective Cycle dan ALPO model.
                    </p>
                  </div>
                </div>

                {/* Non-Teaching Activities Card */}
                <div className="relative group">
                  <div className="absolute left-0 top-1 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                  </div>
                  <div className="p-4 sm:p-space-lg rounded-2xl bg-surface-container-low shadow-sm space-y-space-xs">
                    <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                      Pengabdian &amp; Kontribusi Sosial
                    </span>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base sm:text-headline-sm">
                      Kegiatan Non-Mengajar &amp; Pengembangan Kultur Sekolah
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md">
                      Aktif membina ekstrakurikuler kepramukaan Siaga, kepanitiaan upacara bendera hari nasional, pembiasaan literasi pagi, serta pendampingan sanggar kreasi seni anyam rotan khas Desa Wisata Trangsan bersama paguyuban wali murid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: SKILLS & DELIVERABLES (KOMPETENSI INTI & KARYA NYATA) */}
          <section className="w-full bg-surface-container-low py-8 md:py-space-xl" id="karya-dan-kompetensi">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin space-y-6 md:space-y-space-xl">
              {/* Section Header */}
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-xs">
                <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
                  Portofolio &amp; Output Akademik
                </span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  Kompetensi Inti &amp; Karya Nyata
                </h2>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-space-lg">
                {/* Card 1 */}
                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-space-md">
                  <div className="space-y-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[26px]">menu_book</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Perancangan &amp; Analisis Perangkat Pembelajaran
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md">
                      Keahlian sistematis dalam menurunkan Capaian Pembelajaran (CP) ke Alur Tujuan Pembelajaran (ATP), menyusun Modul Ajar Kurikulum Merdeka yang kontekstual, serta merancang rubrik asesmen autentik ramah anak.
                    </p>
                  </div>
                  <div className="pt-space-xs flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Modul Ajar SD
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      CP/ATP Merdeka
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Rubrik Otentik
                    </span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-space-md">
                  <div className="space-y-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary text-[26px]">layers</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Analisis Materi &amp; Media Pembelajaran Konkret
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md">
                      Pengembangan alat peraga manipulatif konkret, Lembar Kerja Peserta Didik (LKPD) berbasis masalah (PBL) dan proyek (PjBL), serta infografis visual edukatif yang memudahkan logika dan imajinasi anak SD.
                    </p>
                  </div>
                  <div className="pt-space-xs flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Media Manipulatif
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      LKPD Interaktif
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      PBL &amp; PjBL
                    </span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-space-md">
                  <div className="space-y-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-tertiary text-[26px]">smart_display</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Pembuatan Video Pembelajaran Interaktif
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md">
                      Produksi video animasi konsep dasar tematik, rekaman simulasi microteaching berkualitas tinggi, serta modul tayang digital yang siap diakses secara fleksibel untuk mendukung blended learning.
                    </p>
                  </div>
                  <div className="pt-space-xs flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Video Pembelajaran
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Microteaching
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Canva for Education
                    </span>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-space-md">
                  <div className="space-y-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[26px]">insights</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Perancangan Instrumen Penilaian &amp; Refleksi Diri
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md">
                      Penyusunan instrumen diagnostik non-kognitif, rubrik penilaian performa dan portofolio siswa, serta jurnal refleksi berkelanjutan berbasis kerangka ALPO &amp; Gibbs Cycle untuk peningkatan mutu diri.
                    </p>
                  </div>
                  <div className="pt-space-xs flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Gibbs Cycle
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Asesmen Diagnostik
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      Jurnal ALPO
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: CONTACT & SOCIAL CONNECT (JEJAK DIGITAL & KOLABORASI) */}
          <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-xl" id="kontak"></section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
