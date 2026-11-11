import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../server';
import { publicRegistrationSchema } from '../validators/schemas';
import { normalizeWhatsApp, mapGender, buildWhatsAppUrl } from '../utils/helpers';

export async function publicRoutes(app: FastifyInstance) {
  // ============================================================
  // GET /api/public/programs — Daftar program aktif untuk halaman publik
  // ============================================================
  app.get('/programs', async (_request: FastifyRequest, reply: FastifyReply) => {
    const programs = await prisma.program.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        gradeLevels: true,
        subjects: true,
        fee: true,
        displayOrder: true,
      },
    });

    return reply.code(200).send({ programs });
  });

  // ============================================================
  // POST /api/public/register — Pendaftaran publik (status Pending)
  // Mencegah duplikasi berdasarkan nama + whatsapp + programId
  // ============================================================
  app.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = publicRegistrationSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
    }

    const { programId, whatsapp, gender, birthDate, ...rest } = parseResult.data;

    // Normalisasi WhatsApp
    const normalizedWA = normalizeWhatsApp(whatsapp);

    // Cek program valid
    const program = await prisma.program.findFirst({
      where: { id: programId, isActive: true, isDeleted: false },
    });

    if (!program) {
      return reply.code(404).send({ error: 'Program tidak ditemukan atau tidak aktif.' });
    }

    // Cegah duplikasi: nama + WA sudah ada dengan status Pending dan program yang sama
    const existingPending = await prisma.student.findFirst({
      where: {
        name: rest.name,
        whatsapp: normalizedWA,
        status: 'Pending',
        isDeleted: false,
        studentPrograms: {
          some: { programId, status: 'Aktif' },
        },
      },
    });

    if (existingPending) {
      return reply.code(409).send({
        error: 'Pendaftaran dengan data yang sama sudah ada dan sedang menunggu konfirmasi.',
      });
    }

    // Buat siswa + student_program dalam transaksi
    const data = await prisma.$transaction(async (tx) => {
      const newStudent = await tx.student.create({
        data: {
          ...rest,
          gender: mapGender(gender),
          birthDate: new Date(birthDate),
          whatsapp: normalizedWA,
          status: 'Pending',
        },
      });

      const newStudentProgram = await tx.studentProgram.create({
        data: {
          studentId: newStudent.id,
          programId: program.id,
          programNameAtRegistration: program.name,
          feeAtRegistration: program.fee,
          status: 'Aktif',
        },
      });

      return { student: newStudent, studentProgram: newStudentProgram };
    });

    // Bangun URL WhatsApp untuk redirect
    const whatsAppUrl = buildWhatsAppUrl(data.student.name, data.student.parentName, data.studentProgram.programNameAtRegistration, data.student.grade);

    return reply.code(201).send({
      message: 'Pendaftaran berhasil disimpan.',
      studentId: data.student.id,
      whatsAppUrl,
    });
  });
}
