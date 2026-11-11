/**
 * Normalisasi nomor WhatsApp ke format internasional E.164.
 * Contoh: "08123456789" -> "628123456789"
 */
export function normalizeWhatsApp(raw: string): string {
  // Hapus karakter non-digit
  let number = raw.replace(/\D/g, '');

  if (number.startsWith('0')) {
    number = '62' + number.slice(1);
  } else if (number.startsWith('+')) {
    number = number.slice(1);
  }

  return number;
}

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Bangun URL WhatsApp untuk redirect setelah pendaftaran.
 */
export function buildWhatsAppUrl(studentName: string, parentName: string, programName: string, grade: string): string {
  const nomorWhatsapp = process.env.NOWHATSAPP

  const name = capitalizeWords(studentName)
  const parent = capitalizeWords(parentName)
  const program = capitalizeWords(programName)

  const message = encodeURIComponent(
    `Assalamu’alaikum wr. wb. Ibu Khotimah,
  Saya ${parent}, orang tua dari ${name} ${grade}. Kami sudah berhasil mendaftar lewat aplikasi untuk program ${program}.
  Kira-kira langkah selanjutnya bagaimana nggih, Bu? Terima kasih sebelumnya.`
  );
  return `https://wa.me/${nomorWhatsapp}?text=${message}`;
}

/**
 * Maping gender dari string ke format Prisma enum.
 */
export function mapGender(gender: string): 'Laki_laki' | 'Perempuan' {
  return gender === 'Laki-laki' ? 'Laki_laki' : 'Perempuan';
}

/**
 * Maping gender dari Prisma enum ke string tampilan.
 */
export function displayGender(gender: 'Laki_laki' | 'Perempuan'): string {
  return gender === 'Laki_laki' ? 'Laki-laki' : 'Perempuan';
}
