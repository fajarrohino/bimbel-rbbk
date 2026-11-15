'use client';

import React, { useState } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

const CORE_COMPETENCIES = [
  {
    id: 1,
    title: 'Kompetensi Pedagogik',
    icon: 'psychology',
    iconBg: 'bg-primary-fixed text-primary',
    description:
      'Kemampuan mengelola pembelajaran yang berpusat pada peserta didik, mulai dari memahami karakteristik siswa, merancang perangkat ajar berdiferensiasi, melaksanakan pembelajaran aktif berbasis teknologi, hingga mengevaluasi hasil belajar secara menyeluruh.'
  },
  {
    id: 2,
    title: 'Kompetensi Kepribadian',
    icon: 'verified_user',
    iconBg: 'bg-secondary-fixed text-secondary',
    description:
      'Kemampuan personal yang mencerminkan pribadi mantap, stabil, dewasa, arif, dan berwibawa, sehingga mampu menjadi teladan moral, menjunjung tinggi kode etik profesi, bertindak objektif, serta memiliki etos kerja yang bertanggung jawab.'
  },
  {
    id: 3,
    title: 'Kompetensi Sosial',
    icon: 'diversity_3',
    iconBg: 'bg-tertiary-fixed text-tertiary',
    description:
      'Kemampuan berkomunikasi, berkolaborasi, dan berinteraksi secara efektif serta empatik dengan peserta didik, rekan sejawat, orang tua/wali murid, dan masyarakat sekitar guna menciptakan lingkungan belajar yang inklusif dan suportif.'
  },
  {
    id: 4,
    title: 'Kompetensi Profesional',
    icon: 'workspace_premium',
    iconBg: 'bg-primary-fixed-dim text-primary',
    description:
      'Penguasaan materi pembelajaran secara luas, mendalam, dan mutakhir sesuai bidang studi, mencakup pemahaman konsep keilmuan, kemampuan mengaitkan materi dengan konteks dunia nyata, serta komitmen untuk terus mengembangkan keprofesian secara berkelanjutan.'
  },
];

export default function AboutUsPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin overflow-hidden pointer-events-none select-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-gradient-to-b from-primary-fixed/40 via-surface-container/30 to-transparent blur-3xl -z-10 rounded-full"></div>
          </div>

          <section className="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pt-4 sm:pt-6 md:pt-space-xl pb-8 md:pb-space-xl" id="profil">
            <div className="absolute -top-24 -left-12 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-1/3 right-0 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] bg-secondary-fixed/25 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div className="relative w-full flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 lg:gap-0 min-h-0 lg:min-h-[660px]">
              <div className="relative z-10 w-full md:w-[56%] lg:w-[60%] space-y-space-md pt-space-xs sm:pt-space-sm md:pt-space-md pb-2 md:pb-space-xl">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <div className="inline-flex items-center gap-1.5 px-3 sm:px-space-md py-1 rounded-full bg-primary-fixed/40 text-primary font-label-sm text-label-sm font-semibold tracking-wide">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Guru Bersertifikat Pendidikan Profesional</span>
                  </div>
                </div>

                <div className="space-y-space-xs">
                  <h1 className="font-display-hero text-display-hero-mobile sm:text-4xl lg:text-display-hero text-on-surface tracking-tight font-extrabold">
                    Khotimah, <span className="text-primary">S.Pd.</span>
                  </h1>
                </div>

                <div className="md:hidden w-full flex justify-center py-2 relative my-1">
                  <div className="absolute w-[240px] sm:w-[280px] h-[240px] sm:h-[280px] rounded-full bg-gradient-to-b from-primary-fixed/30 to-transparent blur-2xl -z-10 bottom-2"></div>
                  <img
                    alt="Khotimah, S.Pd. Toga Portrait"
                    className="w-auto max-h-[300px] sm:max-h-[360px] object-contain object-bottom drop-shadow-sm select-none"
                    src="/toga-khotimah.png"
                  />
                </div>

                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl text-sm sm:text-base md:text-body-lg">
                  Sebagai pengajar sekolah dasar yang adaptif dan berdedikasi, saya mengombinasikan pembelajaran berdiferensiasi dengan media visual interaktif untuk menciptakan ruang belajar yang menyenangkan, aman, dan memicu rasa ingin tahu anak. Melalui pendekatan berbasis proyek dan pemanfaatan teknologi edukatif yang humanis, saya membimbing setiap murid menemukan potensi terbaiknya serta membentuk karakter Profil Pelajar Pancasila secara berkelanjutan.
                </p>

              </div>

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

          <section className="w-full bg-surface-container-low py-8 md:py-space-xl my-4 md:my-space-lg" id="visi-pendidikan">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin space-y-6 md:space-y-space-xl">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-xs">
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  Komitmen Pendidikan
                </h2>
                <div className="w-12 h-1 bg-primary rounded-full mt-1"></div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-space-lg">
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
                    Merancang asesmen komprehensif (diagnostik & formatif) serta diferensiasi pembelajaran ramah anak yang menstimulasi rasa ingin tahu dan nalar kritis siswa sejak dini.
                  </p>
                </div>

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

          <section className="w-full max-w-4xl mx-auto px-margin-mobile md:px-margin py-8 md:py-space-xl scroll-mt-24" id="pengalaman-mengajar">
            <div className="space-y-6 md:space-y-space-lg">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-space-xs">

                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  Pengalaman Mengajar
                </h2>
                <div className="w-12 h-1 bg-primary rounded-full mt-1"></div>
              </div>
              <div className="relative pt-4 pl-7 sm:pl-9 md:pl-10 before:content-[''] before:absolute before:left-2.5 sm:before:left-3 md:before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-secondary before:to-primary/30">

                <div className="relative pb-10 sm:pb-12 group last:pb-0">
                  <div className="absolute -left-7 sm:-left-9 md:-left-10 top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-surface border-2 border-primary text-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-headline-sm text-lg sm:text-xl text-on-surface font-bold">
                        MI Ma&apos;arif NU 03 Bantarbarang
                      </h3>
                    </div>

                    <p className="font-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed">
                      Memiliki pengalaman mengajar di MI Ma&apos;arif NU 03 Bantarbarang dan terbiasa membimbing siswa di berbagai jenjang usia, mulai dari pendekatan bermain sambil belajar untuk kelas bawah hingga pendalaman materi bagi kelas atas.
                    </p>


                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -left-7 sm:-left-9 md:-left-10 top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-surface border-2 border-secondary text-secondary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-headline-sm text-lg sm:text-xl text-on-surface font-bold">
                        SD Negeri Trangsan 01
                      </h3>
                    </div>

                    <p className="font-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed">
                      Lokasi resmi Praktik Pengalaman Lapangan (PPL) Program Pendidikan Profesi Guru (PPG) di Kec. Gatak, Kab. Sukoharjo. Menjadi tempat pembentukan calon guru profesional yang kompeten secara pedagogik, kepribadian, maupun sosial, dan siap berkontribusi bagi pendidikan di seluruh Indonesia.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section className="w-full bg-surface-container-low py-8 md:py-space-xl scroll-mt-24" id="karya-dan-kompetensi">
            <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin space-y-6 md:space-y-space-xl">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-xs">

                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  Kompetensi Utama Guru
                </h2>
                <div className="w-12 h-1 bg-primary rounded-full mt-1"></div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {CORE_COMPETENCIES.map((comp, idx) => {
                  const isOpen = openAccordion === idx;
                  return (
                    <div
                      key={comp.id}
                      className={`rounded-2xl bg-surface-container-lowest transition-all duration-300 border ${isOpen
                        ? 'shadow-md border-primary/30 ring-1 ring-primary/20'
                        : 'shadow-sm border-surface-container hover:border-surface-container-high hover:shadow'
                        } overflow-hidden`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full p-4 sm:p-5 md:p-6 text-left flex items-start sm:items-center justify-between gap-3 sm:gap-4 transition-colors hover:bg-surface-container-low/40 focus:outline-none"
                      >
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${comp.iconBg} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 ${isOpen ? 'scale-105' : ''
                              }`}
                          >
                            <span className="material-symbols-outlined text-[24px] sm:text-[26px]">
                              {comp.icon}
                            </span>
                          </div>

                          <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                            </div>
                            <h3 className="font-headline-sm text-base sm:text-lg md:text-xl text-on-surface font-bold truncate">
                              {comp.title}
                            </h3>
                          </div>
                        </div>

                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen
                            ? 'bg-primary text-on-primary rotate-180 shadow-sm'
                            : 'bg-surface-container text-on-surface-variant'
                            }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            expand_more
                          </span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-surface-container/60 space-y-4 sm:space-y-5">
                          <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low/70 border-l-4 border-primary text-on-surface text-sm sm:text-base leading-relaxed">
                            <p>{comp.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-8 md:py-space-xl scroll-mt-24" id="portofolio">
            <div className="space-y-6 md:space-y-space-xl">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-xs">

                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  Portofolio Pendidik
                </h2>
                <div className="w-12 h-1 bg-primary rounded-full mt-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-space-lg">

                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-space-md border border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-primary-fixed/40 to-transparent rounded-bl-full pointer-events-none -z-0"></div>

                  <div className="relative z-10 space-y-space-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-sm">
                          Portofolio Pertama
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors text-primary">
                        <span className="material-symbols-outlined text-[22px]">school</span>
                      </div>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-lg md:text-xl pt-1">
                      Portofolio PPG Calon Guru 2026
                    </h3>

                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md leading-relaxed">
                      Portofolio komprehensif Program Pendidikan Profesi Guru Calon Guru 2026. Merangkum filosofi pendidikan Ki Hadjar Dewantara, rancangan pembelajaran kontekstual Kurikulum Merdeka, rekaman simulasi microteaching, serta jurnal refleksi berkelanjutan.
                    </p>


                  </div>

                  <div className="relative z-10 pt-3 border-t border-surface-container flex items-center justify-end">
                    <a
                      href="https://ppg-indonesia.my.canva.site/portofolio-ppg-calon-guru-2026-khotimah/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-dark transition-all font-label-md text-label-md font-semibold shadow-sm hover:shadow active:scale-[0.98]"
                    >
                      <span>Buka Portofolio</span>
                    </a>
                  </div>
                </div>

                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-space-md border border-secondary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-secondary-fixed/40 to-transparent rounded-bl-full pointer-events-none -z-0"></div>

                  <div className="relative z-10 space-y-space-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold shadow-sm">
                          Portofolio Ke-2
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-on-secondary transition-colors text-secondary">
                        <span className="material-symbols-outlined text-[22px]">assignment</span>
                      </div>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-lg md:text-xl pt-1">
                      Lembar Kerja 3
                    </h3>

                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md leading-relaxed">
                      Dokumentasi digital Lembar Kerja 3 yang menyajikan hasil telaah dan perancangan modul ajar berdiferensiasi, pemetaan gaya belajar siswa, instrumen asesmen diagnostik, serta Lembar Kerja Peserta Didik berbasis kontekstual.
                    </p>


                  </div>

                  <div className="relative z-10 pt-3 border-t border-surface-container flex items-center justify-end">
                    <a
                      href="https://sites.google.com/view/e-porto-lk3-khotimah/beranda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-secondary/90 transition-all font-label-md text-label-md font-semibold shadow-sm hover:shadow active:scale-[0.98]"
                    >
                      <span>Buka Portofolio</span>
                    </a>
                  </div>
                </div>

                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-space-md border border-tertiary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-tertiary-fixed/40 to-transparent rounded-bl-full pointer-events-none -z-0"></div>

                  <div className="relative z-10 space-y-space-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold shadow-sm">
                          Portofolio Ke-3
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center shrink-0 group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors text-tertiary">
                        <span className="material-symbols-outlined text-[22px]">fact_check</span>
                      </div>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-lg md:text-xl pt-1">
                      Evaluasi UTS & UAS
                    </h3>

                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md leading-relaxed">
                      Rekam jejak evaluasi dan asesmen pembelajaran komprehensif selama praktik mengajar di SD Negeri Trangsan 01, memuat laporan pelaksanaan UTS & UAS, pameran hasil karya siswa, serta refleksi kritis siklus belajar dengan ALPO & Gibbs model.
                    </p>


                  </div>

                  <div className="relative z-10 pt-3 border-t border-surface-container flex items-center justify-end">
                    <a
                      href="https://sites.google.com/view/e-porto-uts-uas-khotimah/beranda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-all font-label-md text-label-md font-semibold shadow-sm hover:shadow active:scale-[0.98]"
                    >
                      <span>Buka Portofolio</span>
                    </a>
                  </div>
                </div>

                <div className="p-5 md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-space-md border border-brand-500/25 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-brand-200/40 to-transparent rounded-bl-full pointer-events-none -z-0"></div>

                  <div className="relative z-10 space-y-space-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-brand-600 text-white font-label-sm text-label-sm font-bold shadow-sm">
                          Portofolio Tematik Khusus
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors text-brand-600">
                        <span className="material-symbols-outlined text-[22px]">memory</span>
                      </div>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-lg md:text-xl pt-1">
                      Portofolio Computational Thinking (CT)
                    </h3>

                    <p className="font-body-md text-body-md text-on-surface-variant text-sm sm:text-body-md leading-relaxed">
                      Kumpulan karya dan artefak integrasi Computational Thinking dalam pembelajaran tingkat sekolah dasar. Melatih 4 pilar nalar logis: dekomposisi masalah, pengenalan pola, abstraksi konsep, dan perancangan algoritma ramah anak.
                    </p>


                  </div>

                  <div className="relative z-10 pt-3 border-t border-surface-container flex items-center justify-end">
                    <a
                      href="https://sites.google.com/view/portofolio-artefak-ct-khotimah/beranda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-all font-label-md text-label-md font-semibold shadow-sm hover:shadow active:scale-[0.98]"
                    >
                      <span>Buka Portofolio</span>
                    </a>
                  </div>
                </div>

              </div>


            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
