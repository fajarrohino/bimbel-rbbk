import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Cek apakah admin sudah ada
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 12);
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        passwordHash,
        role: 'owner',
        isActive: true,
      },
    });
    console.log('✅ Admin user created: username=admin, password=admin123');
    console.log('⚠️  SEGERA GANTI PASSWORD setelah login pertama!');
  } else {
    console.log('ℹ️  Admin user sudah ada, skip.');
  }

  console.log('🌱 Seeding selesai.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
