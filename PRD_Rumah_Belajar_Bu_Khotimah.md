# Product Requirements Document (PRD)

## Rumah Belajar Bu Khotimah

## 1. Ringkasan Produk

Rumah Belajar Bu Khotimah membutuhkan aplikasi web untuk menampilkan
program belajar, menerima pendaftaran siswa, mengelola data siswa, dan
mengatur jadwal belajar melalui satu sistem terpusat. Aplikasi memiliki
halaman publik dan halaman admin.

## 2. Tujuan Produk

-   Memudahkan pengunjung melihat program dan mendaftarkan siswa.
-   Memusatkan pengelolaan data siswa.
-   Menyimpan riwayat keikutsertaan program.
-   Memudahkan admin mengatur jadwal berdasarkan tanggal dan sesi.
-   Menjaga konsistensi data dan keamanan akses admin.

## 3. Pengguna Utama

### Pengunjung / Orang tua siswa

-   Melihat program belajar.
-   Mengisi formulir pendaftaran.
-   Melanjutkan komunikasi melalui WhatsApp setelah pendaftaran
    tersimpan.

### Admin / Owner

-   Login ke dashboard.
-   Mengelola program dan siswa.
-   Memutuskan penerimaan pendaftaran.
-   Mengelola riwayat program dan jadwal.

Role admin saat ini hanya `owner`.

## 4. Ruang Lingkup MVP

### Termasuk

-   Halaman publik dan informasi program.
-   Pendaftaran siswa berstatus `Pending`, lalu pengalihan ke WhatsApp.
-   Login admin, JWT, logout, dan sesi maksimal 24 jam.
-   Pengelolaan program, siswa, riwayat program, dan jadwal.

### Di luar cakupan MVP

-   Absensi dan Pembayaran.
-   Mekanisme otomatis perubahan status siswa menjadi `Lulus`.
-   Fitur pemulihan soft delete melalui frontend.
-   Registrasi admin publik.
-   Fitur perubahan password melalui halaman pengaturan.

## 5. Arsitektur dan Teknologi

  Komponen          Teknologi
  ----------------- -------------------------------------------
  Frontend          Next.js + TypeScript / Vercel
  Backend           Fastify + Node.js + TypeScript / Render
  Database          PostgreSQL / Neon
  ORM dan migrasi   Prisma ORM, Prisma Client, Prisma Migrate

Browser tidak mengakses PostgreSQL secara langsung. Semua operasi data
harus melewati backend API.

## 6. Persyaratan Fungsional

### 6.1 Halaman publik dan program

-   Pengunjung melihat program aktif yang belum dihapus secara logis.
-   Program nonaktif tidak tampil di Home atau formulir pendaftaran.
-   Urutan program mengikuti `displayOrder`.

### 6.2 Pendaftaran siswa

-   Formulir menyimpan data siswa dengan status `Pending` sebelum
    pengalihan WhatsApp.
-   Sistem mencegah data ganda akibat pengiriman formulir berulang.
-   Field: nama, jenis kelamin, tanggal lahir, kelas, sekolah, nama
    orang tua, satu nomor WhatsApp, program, preferensi sesi, dan
    catatan opsional.

### 6.3 Pengelolaan siswa

  Status       Perilaku
  ------------ ---------------------------------------------------------
  `Pending`    Menunggu keputusan admin
  `Aktif`      Siswa aktif dan tampil di Atur Jadwal
  `Nonaktif`   Tidak tampil di Atur Jadwal
  `Lulus`      Status tersedia; mekanisme transisi ditentukan kemudian

-   Siswa yang ditambahkan admin berstatus `Aktif`.
-   Pendaftaran diterima menjadi `Aktif`; ditolak menjadi `Nonaktif`.
-   `rejectionReason` menyimpan alasan penolakan; default `Ditolak` jika
    alasan khusus tidak diberikan.
-   Saat siswa diterima, `rejectionReason` dikosongkan menjadi `NULL`.
-   `note` terpisah dari `rejectionReason` dan bersifat opsional.
-   Edit data biasa menimpa nilai lama; tidak ada riwayat perubahan
    umum.
-   Hanya siswa `Nonaktif` yang dapat dihapus secara logis.
-   Nomor WhatsApp dinormalisasi ke format internasional dan tidak harus
    unik.
-   `gender` divalidasi sebagai `Laki-laki` atau `Perempuan`; kelas dan
    sekolah berupa teks bebas.
-   `createdAt` digunakan sebagai waktu pembuatan data; tidak ada kolom
    `registeredAt`.

### 6.4 Pengelolaan program

  Field            Aturan
  ---------------- -----------------------------
  `name`           Wajib
  `description`    Wajib
  `gradeLevels`    Wajib, teks bebas
  `subjects`       Wajib, teks bebas
  `fee`            Wajib
  `isActive`       Default `true`
  `displayOrder`   Otomatis oleh sistem
  `isDeleted`      Penanda soft delete
  `deletedAt`      Waktu soft delete, nullable

-   Program berfokus pada SD dan dapat mengakomodasi SMP.
-   Program nonaktif tidak tampil di Home atau formulir pendaftaran.
-   Soft delete tidak menghapus data fisik; tidak ada fitur pemulihan di
    frontend MVP.
-   Perubahan nama atau biaya program tidak mengubah data historis.

#### Aturan `displayOrder`

-   Backend menentukan nomor urut dari nilai terbesar program aktif yang
    belum dihapus secara logis, lalu menambah satu.
-   Program yang dihitung memiliki `isActive = true` dan
    `isDeleted = false`.
-   Proses harus aman saat beberapa program dibuat bersamaan,
    menggunakan transaksi atau mekanisme konkurensi yang sesuai.
-   Penentuan nomor urut dilakukan di backend, bukan frontend.

### 6.5 Riwayat program

-   Satu siswa dapat mengikuti beberapa program.
-   Setiap periode keikutsertaan disimpan sebagai catatan terpisah.
-   Nama dan biaya disimpan sebagai snapshot.
-   Saat pindah dari Program A ke Program B, catatan A menjadi `Selesai`
    dan dibuat catatan B berstatus `Aktif`.
-   Jika kembali ke program sebelumnya, dibuat catatan baru.
-   Perubahan satu keikutsertaan tidak mengubah status program lain.
-   Tanggal akhir keikutsertaan tidak diwajibkan.

### 6.6 Atur Jadwal

  Sesi   Waktu
  ------ --------------
  1      14.00--15.00
  2      16.00--17.00
  3      19.00--20.00

-   Jadwal aktual tidak terhubung ke program belajar.
-   Siswa boleh memiliki beberapa sesi dalam sehari; banyak siswa boleh
    pada sesi yang sama.
-   Kombinasi `studentId + date + session` harus unik.
-   Hanya siswa `Aktif` tampil di Atur Jadwal.
-   Jadwal lama tetap tersimpan saat status bukan `Aktif`; saat siswa
    aktif kembali, riwayat tidak berubah.
-   `preferredSession` adalah preferensi, bukan jadwal otomatis.

## 7. Persyaratan Nonfungsional

### Keamanan

-   Password disimpan dalam bentuk hash yang aman.
-   Access token JWT berlaku 15 menit.
-   Refresh token maksimal 24 jam sejak login; aktivitas tidak
    memperpanjang masa sesi.
-   Logout mencabut sesi di server.
-   Backend memvalidasi autentikasi dan otorisasi.
-   Secret produksi menggunakan environment variable atau secret
    manager, bukan hardcode.
-   Pencabutan access token setelah logout perlu ditegakkan melalui
    pemeriksaan sesi atau mekanisme setara.

### Konsistensi data

-   Gunakan UUID untuk primary key.
-   Terapkan foreign key.
-   Username admin unik.
-   Jadwal memiliki unique constraint untuk siswa, tanggal, dan sesi.
-   Gunakan transaksi untuk perubahan program siswa dan penentuan
    `displayOrder`.
-   Validasi dilakukan pada frontend, backend, dan database jika
    memungkinkan.

### Soft delete

-   Siswa dan program memiliki `isDeleted` serta `deletedAt`.
-   Soft delete mempertahankan data dan riwayat di database.
-   Data yang dihapus tidak tampil di frontend.
-   Tidak ada pemulihan melalui frontend pada MVP.

## 8. Desain Database Final

  -----------------------------------------------------------------------
  Tabel                               Kolom utama
  ----------------------------------- -----------------------------------
  `admin_users`                       `id`, `username`, `passwordHash`,
                                      `role`, `isActive`, `createdAt`,
                                      `updatedAt`

  `admin_sessions`                    `id`, `adminUserId`,
                                      `refreshTokenHash`, `expiresAt`,
                                      `revokedAt`, `createdAt`

  `programs`                          `id`, `name`, `description`,
                                      `gradeLevels`, `subjects`, `fee`,
                                      `isActive`, `displayOrder`,
                                      `isDeleted`, `deletedAt`,
                                      `createdAt`, `updatedAt`

  `students`                          `id`, `name`, `gender`,
                                      `birthDate`, `grade`, `school`,
                                      `parentName`, `whatsapp`,
                                      `preferredSession`, `status`,
                                      `note`, `rejectionReason`,
                                      `isDeleted`, `deletedAt`,
                                      `createdAt`, `updatedAt`

  `student_programs`                  `id`, `studentId`, `programId`,
                                      `programNameAtRegistration`,
                                      `feeAtRegistration`, `status`,
                                      `startedAt`, `note`, `createdAt`,
                                      `updatedAt`

  `schedule_assignments`              `id`, `studentId`, `date`,
                                      `session`, `createdAt`, `updatedAt`
  -----------------------------------------------------------------------

### Relasi tabel

-   `admin_users` memiliki banyak `admin_sessions`.
-   `students` memiliki banyak `student_programs`.
-   `programs` memiliki banyak `student_programs`.
-   `students` memiliki banyak `schedule_assignments`.
-   `student_programs` membentuk relasi many-to-many antara `students`
    dan `programs` sekaligus menyimpan riwayat setiap periode.

``` mermaid
erDiagram
    ADMIN_USERS ||--o{ ADMIN_SESSIONS : has
    STUDENTS ||--o{ STUDENT_PROGRAMS : participates
    PROGRAMS ||--o{ STUDENT_PROGRAMS : includes
    STUDENTS ||--o{ SCHEDULE_ASSIGNMENTS : assigned
```

## 9. Kriteria Penerimaan MVP

-   [ ] Pengunjung dapat melihat program aktif.
-   [ ] Pendaftaran disimpan sebagai `Pending` sebelum pengalihan
    WhatsApp.
-   [ ] Admin dapat login dengan username dan password.
-   [ ] Sesi admin berakhir maksimal 24 jam sejak login.
-   [ ] Logout mencabut sesi di server.
-   [ ] Admin dapat mengelola program dan `displayOrder` otomatis.
-   [ ] Admin dapat mengelola siswa dan statusnya.
-   [ ] Riwayat keikutsertaan tersimpan ketika siswa pindah program.
-   [ ] Jadwal mengikuti aturan tanggal dan sesi.
-   [ ] Soft delete menyembunyikan data tanpa menghapus riwayat.
-   [ ] Tidak ada Absensi atau Pembayaran dalam MVP.

## 10. Keputusan yang Ditunda

-   Mekanisme perubahan status siswa menjadi `Lulus`.
-   Detail tujuan, isi pesan, dan penanganan kegagalan pengalihan
    WhatsApp.
-   Kebijakan retensi atau penghapusan permanen di luar soft delete yang
    telah ditetapkan.

## 11. Status Dokumen

Desain database telah disetujui sebagai dasar implementasi. Dokumen ini
adalah spesifikasi rancangan; implementasi Prisma Schema, migrasi, dan
deployment merupakan tahap berikutnya.

**Keamanan kredensial:** password produksi harus menggunakan secret yang
aman dan tidak ditulis langsung di source code atau dokumen.

## 12. Daftar Halaman dan Struktur Menu (Pages & Routing)

Bagian ini mendefinisikan halaman MVP dan struktur routing berdasarkan fitur yang telah disepakati. Nama route berikut adalah usulan struktur URL untuk implementasi; tidak menambahkan fitur di luar ruang lingkup MVP.

### 12.1 Halaman publik

| Halaman | Route | Tujuan dan perilaku |
|---|---|---|
| Home | `/` | Menampilkan informasi utama dan daftar program yang aktif serta belum dihapus secara logis. Urutan program mengikuti `displayOrder`. |
| Detail program (opsional) | `/programs/[id]` | Hanya dibuat jika pengalaman detail program memang diperlukan; belum menjadi persyaratan MVP yang terpisah. |
| Pendaftaran siswa | `/register` | Formulir pendaftaran. Data harus berhasil tersimpan dengan status `Pending` sebelum pengunjung diarahkan ke WhatsApp. |

**Catatan:** Halaman detail program belum diputuskan sebagai kebutuhan wajib. Implementasi dapat menampilkan informasi program langsung di Home sampai kebutuhan halaman detail disetujui.

### 12.2 Halaman autentikasi admin

| Halaman | Route | Tujuan dan perilaku |
|---|---|---|
| Login admin | `/admin/login` | Login menggunakan username dan password. |
| Dashboard admin | `/admin` | Titik masuk area admin setelah autentikasi. Konten dashboard mengikuti kebutuhan pengelolaan yang telah disepakati. |

Ketentuan akses:
- Halaman admin selain login harus dilindungi autentikasi.
- Pengguna yang belum terautentikasi diarahkan ke `/admin/login`.
- Pengguna yang sudah login tidak perlu melihat formulir login lagi selama sesi masih valid.
- Logout mencabut sesi melalui backend.
- Batas sesi tetap maksimal 24 jam sejak login; aktivitas tidak memperpanjang batas ini.

### 12.3 Halaman pengelolaan admin

| Halaman | Route | Tujuan dan perilaku |
|---|---|---|
| Daftar program | `/admin/programs` | Menampilkan dan mengelola program, status aktif/nonaktif, urutan tampilan, serta soft delete. |
| Tambah program | `/admin/programs/new` | Formulir pembuatan program. Field `name`, `description`, `gradeLevels`, `subjects`, dan `fee` wajib diisi. `isActive` default `true`; `displayOrder` ditentukan backend. |
| Edit program | `/admin/programs/[id]/edit` | Mengubah data program yang sudah ada. Perubahan nama atau biaya tidak mengubah snapshot historis di `student_programs`. |
| Daftar siswa | `/admin/students` | Menampilkan dan mengelola data siswa sesuai status serta aturan soft delete. |
| Tambah siswa | `/admin/students/new` | Formulir penambahan siswa oleh admin. Siswa yang ditambahkan langsung oleh admin berstatus `Aktif`. |
| Detail/edit siswa | `/admin/students/[id]` | Melihat dan mengedit data siswa serta mengelola status sesuai aturan bisnis. Riwayat program dapat ditampilkan pada halaman ini atau sebagai bagian terpisah dari antarmuka siswa. |
| Jadwal bimbingan | `/admin/schedules` | Memiliki submenu yaitu Jadwal siswa dan Atur jadwal. |

| Jadwal siswa | `/admin/schedules/students` | Memiliki 2 layout yaitu layout pertama : jadwal hari ini sesi 1,2,3. Layout ke keuda adalah calender yang menampilkan semua jadwal siswa. |
| Atur jadwal | `/admin/schedules/setting` | Memiliki 2 layout yaitu layout pertama: calender satu bulan untuk menempatkan nama siswa pada tanggal dan sesi. Layout ke dua adalah daftar nama siswa yang aktifr berdasarkan default sesi yang di data siswa, yg nanti akan namanya bisa di drag ke calender jadwal dan di drop tersebut.|

**Batasan routing:**
- Tidak ada halaman registrasi admin.
- Tidak ada halaman perubahan password pada MVP.
- Tidak ada halaman Absensi atau Pembayaran.
- Tidak ada halaman pemulihan data soft delete pada frontend MVP.
- Mekanisme status `Lulus` belum ditentukan; route atau alur khusus untuk itu tidak ditetapkan dalam versi ini.

### 12.4 Struktur menu admin

Menu navigasi admin yang disarankan berdasarkan modul yang telah disepakati:

1. **Dashboard** — `/admin`
2. **Data Siswa** — `/admin/students`
3. **Jadwal Bimbingan** - memiliki submenu dengan dropdown:
    **Jadwal Siswa** — `/admin/schedules/students`
    **Atur Jadwal** — `/admin/schedules/setting`
4. **Program** — `/admin/programs`
5. **Logout** — tindakan autentikasi, bukan halaman konten tersendiri

Item menu harus mengarah ke halaman yang sesuai. Menu tidak boleh menampilkan modul yang berada di luar cakupan MVP.

---

## 13. Pedoman UI/UX & Design System

Bagian ini menetapkan pedoman dan sumber antarmuka untuk menjaga konsistensi pengalaman pengguna.

### 13.1 Sumber desain
- Gunakan aset dan acuan design di folder `assets-rbbk` sebagai sumber kebenaran desain untuk halaman yang sudah tersedia.
- Jangan mengganti warna, tipografi, spacing, komposisi, komponen, atau pola interaksi tanpa alasan yang jelas dan persetujuan pemilik produk.
- Jangan membuat desain baru untuk halaman yang sudah memiliki desain.
- Jika halaman atau state belum memiliki desain, identifikasi bagian yang belum ditentukan dan minta arahan sebelum menetapkan pola yang berdampak besar.

### 13.2 Pedoman ekstensi desain untuk halaman/komponen yang belum tersedia

Karena beberapa halaman atau komponen pendukung belum memiliki desain visual yang lengkap di dalam folder `assets-rbbk`, maka wajib mematuhi aturan ekstrapolasi desain berikut saat membangun atau menghasilkan kode untuk bagian yang kosong:

1. **Konsistensi Design Tokens:**
   - Wajib menggunakan palet warna (Primary, Neutral, Success, Error, dll.), ukuran font, skala *spacing*, *border-radius*, dan *shadow* yang persis sama dengan yang didefinisikan dalam `DESIGN.md`. Dilarang keras memperkenalkan warna baru atau *hex code* di luar token yang ada.

2. **Pola Komponen Turunan (Component Inheritance):**
   - Jika membuat komponen baru yang belum ada bentuk visualnya (misalnya: *dropdown* kustom, *state* kosong/empty state yang kompleks, atau filter lanjutan), AI harus menurunkan gaya dari komponen yang sudah ada. 
   - Contoh: Jika tombol utama menggunakan sudut melengkung tertentu dengan efek hover tertentu, seluruh tombol baru di halaman yang belum ada desainnya wajib mengikuti gaya tersebut.

3. **Struktur Layout & Hirarki Visual:**
   - Pertahankan konsistensi hirarki teks (Heading 1, Body, Caption) dan *whitespace* (jarak antar elemen). 
   - Untuk halaman admin baru, gunakan pola layout yang sama dengan halaman dashboard yang sudah ada (misalnya struktur sidebar, header, dan area konten utama).

4. **Interaksi dan State Wajib:**
   - Setiap komponen interaktif baru yang dibuat AI harus menyertakan kelengkapan *state* standar: *Default, Hover, Focus, Active, Disabled,* dan *Loading/Error state* agar selaras dengan halaman lainnya.

5. **Konsultasi jika Ambigus:**
   - Jika ada halaman atau fitur baru yang membutuhkan pola interaksi baru yang sama sekali belum ada presedensinya di file desain, AI wajib memberikan opsi atau menanyakan arahan kepada pengembang/pemilik produk alih-alih menebak sendiri gaya visualnya.

### 13.3 Status dan umpan balik

Status siswa yang ditampilkan harus menggunakan label teks yang jelas:
- `Pending`
- `Aktif`
- `Nonaktif`
- `Lulus`

Status program ditampilkan sebagai aktif atau nonaktif. Warna dapat membantu membedakan status, tetapi warna tidak boleh menjadi satu-satunya cara menyampaikan makna; selalu sertakan label teks.

Sistem juga harus memberi umpan balik yang sesuai untuk:
- Data berhasil disimpan.
- Data gagal disimpan.
- Pendaftaran berhasil sebelum pengalihan WhatsApp.
- Perubahan status berhasil.
- Soft delete berhasil.
- Sesi login berakhir atau akses ditolak.

### 13.4 Konfirmasi tindakan penting

- Soft delete harus menggunakan konfirmasi sebelum tindakan dijalankan.
- Konfirmasi harus menjelaskan data yang akan disembunyikan dan bahwa data tidak dihapus secara fisik.
- Tidak ada opsi pemulihan melalui frontend MVP.
- Tindakan yang mengubah status atau riwayat program harus menjelaskan dampaknya dengan bahasa yang mudah dipahami.
- Perubahan program siswa harus mempertahankan riwayat lama sesuai aturan pada bagian database.

### 13.5 Design system dan komponen UI

Gunakan komponen UI yang konsisten untuk:
- Tombol utama, sekunder, dan tindakan berisiko.
- Input teks, tanggal, nomor WhatsApp, pilihan status, dan pilihan sesi.
- Label field, helper text, dan pesan validasi.
- Tabel atau daftar data.
- Badge status.
- Dialog konfirmasi.
- Notifikasi sukses dan gagal.
- Indikator loading dan empty state.

### 13.6 Responsive dan mobile-first
Semua halaman publik dan admin wajib responsif.
- Layout menyesuaikan viewport smartphone, tablet, laptop, dan desktop.
- Tidak boleh ada horizontal overflow yang tidak disengaja.
- Navigasi desktop berubah menjadi pola navigasi mobile yang jelas.
- Form mudah diisi dengan sentuhan; label, input, pesan validasi, dan tombol harus terbaca.
- Kontrol interaktif tidak boleh hanya mengandalkan hover.
- Kartu statistik menyusun ulang berdasarkan lebar layar.
- Tabel Data Siswa pada layar kecil menggunakan pola yang tetap terbaca, seperti daftar/kartu atau tabel yang dapat digulir dengan petunjuk jelas.
- Modal dan slide-over harus muat di layar kecil dan dapat digulir.
- Kalender dan drag-and-drop harus diuji dengan sentuhan. Jika drag-and-drop tidak nyaman, sediakan alternatif memilih siswa, tanggal, dan sesi.
- Pertahankan ukuran teks, kontras, fokus keyboard, dan area sentuh yang nyaman.

Target pemeriksaan viewport: smartphone kecil sekitar 320–375 px, smartphone umum sekitar 390–430 px, tablet, dan desktop. Ini target pengujian, bukan pembatas perangkat yang didukung.


####


Kamu adalah developer terjago di dunia, teliti serta memiliki pemahaman yang tinggi.Tugas utama kamu adalah membangun website secara bertahap (step-by-step) berdasarkan dokumen Product Requirements Document (PRD).
 

ATURAN KETAT (STRICT RULES) YANG WAJIB DIIKUTI:
1. Baca dan analisis PRD point 1 hingga 13.
2. Konfirmasi bahwa kamu mengerti dan akan mematuhi aturan dilarang berasumsi serta sistem kerja per-fase ini.
3. Buat checklist poin-poin apa saja yang akan kamu kerjakan setiap fase berdasarkan PRD.
4. Tunggu instruksi "MULAI FASE 1" dari saya sebelum menulis kode apa pun.
5. DILARANG BERASUMSI: Jangan membuat asumsi desain, fitur, alur logika, atau stack teknologi yang tidak ada di dalam PRD. Jika ada detail yang kurang jelas atau tidak disebutkan secara eksplisit, kamu WAJIB bertanya kepada saya dan menunggu jawaban sebelum menulis kode.
6. KERJA BERTAHAP (PHASED DEVELOPMENT): Kamu harus mengerjakan proyek ini berdasarkan fase di bawah. Kamu WAJIB berhenti (pause) setelah menyelesaikan setiap fase. Dilarang keras melompat atau mengerjakan fase berikutnya sebelum saya memberikan pesan persetujuan "CHECK OK, LANJUT".


ALUR KERJA (WORKFLOW):

FASE 1: FRONTEND DEVELOPMENT
- Fokus sepenuhnya pada pembuatan struktur antarmuka pengguna (UI), komponen frontend, dan styling sesuai spesifikasi di PRD.
- Jika UI membutuhkan data untuk ditampilkan, gunakan MOCK DATA lokal/statis. Jangan membuat fungsi koneksi ke database atau API.
- Setelah kode frontend selesai, BERHENTI. Berikan saya instruksi cara menjalankan dan mengecek frontend-nya, lalu tunggu hasil review dari saya.

FASE 2: BACKEND DEVELOPMENT (Hanya mulai jika saya bilang "CHECK OK, LANJUT")
- Fokus membangun arsitektur backend, struktur database, logika bisnis, dan endpoint API sesuai PRD.
- Jangan coba-coba menghubungkan kode ini dengan frontend yang dibuat di Fase 1. Fokus pada fungsionalitas backend secara independen.
- Setelah kode backend selesai, BERHENTI. Berikan saya cara untuk menguji API (misalnya via cURL atau rute test), lalu tunggu hasil review dari saya.

FASE 3: INTEGRASI & SETUP (Hanya mulai jika saya bilang "CHECK OK, LANJUT")
- Hubungkan frontend dengan backend. Hapus semua mock data di frontend dan ganti dengan data dinamis hasil pemanggilan API dari backend.
- Pastikan semua dependensi berjalan lancar dan siapkan file konfigurasi environment (misalnya setup Docker, jika disyaratkan di PRD).
- Lakukan final check pada alur data.