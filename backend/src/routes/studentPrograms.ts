import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../server';
import { authenticate } from '../middlewares/authenticate';
import { changeStudentProgramSchema } from '../validators/schemas';

export async function studentProgramRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  // ============================================================
  // GET /api/student-programs/student/:studentId
  // Ambil semua riwayat program seorang siswa
  // ============================================================
  app.get(
    '/student/:studentId',
    async (request: FastifyRequest<{ Params: { studentId: string } }>, reply: FastifyReply) => {
      const { studentId } = request.params;

      const student = await prisma.student.findFirst({
        where: { id: studentId, isDeleted: false },
      });

      if (!student) {
        return reply.code(404).send({ error: 'Siswa tidak ditemukan.' });
      }

      const records = await prisma.studentProgram.findMany({
        where: { studentId },
        include: { program: { select: { id: true, name: true, isActive: true } } },
        orderBy: { startedAt: 'desc' },
      });

      return reply.code(200).send({ studentPrograms: records });
    }
  );

  // ============================================================
  // POST /api/student-programs/student/:studentId/change
  // Pindah program: selesaikan yg aktif, buat yg baru
  // ============================================================
  app.post(
    '/student/:studentId/change',
    async (request: FastifyRequest<{ Params: { studentId: string } }>, reply: FastifyReply) => {
      const { studentId } = request.params;

      const parseResult = changeStudentProgramSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
      }

      const { newProgramId, note } = parseResult.data;

      const student = await prisma.student.findFirst({
        where: { id: studentId, isDeleted: false },
      });

      if (!student) {
        return reply.code(404).send({ error: 'Siswa tidak ditemukan.' });
      }

      const newProgram = await prisma.program.findFirst({
        where: { id: newProgramId, isDeleted: false, isActive: true },
      });

      if (!newProgram) {
        return reply.code(404).send({ error: 'Program tujuan tidak ditemukan atau tidak aktif.' });
      }

      const result = await prisma.$transaction(async (tx) => {
        // Selesaikan semua keikutsertaan aktif saat ini
        await tx.studentProgram.updateMany({
          where: { studentId, status: 'Aktif' },
          data: { status: 'Selesai' },
        });

        // Buat keikutsertaan baru
        const newRecord = await tx.studentProgram.create({
          data: {
            studentId,
            programId: newProgram.id,
            programNameAtRegistration: newProgram.name,
            feeAtRegistration: newProgram.fee,
            status: 'Aktif',
            note: note ?? null,
          },
        });

        return newRecord;
      });

      return reply.code(201).send({ studentProgram: result });
    }
  );

  // ============================================================
  // POST /api/student-programs/student/:studentId/enroll
  // Daftarkan siswa ke program (tanpa menghapus yg aktif)
  // ============================================================
  app.post(
    '/student/:studentId/enroll',
    async (request: FastifyRequest<{ Params: { studentId: string } }>, reply: FastifyReply) => {
      const { studentId } = request.params;
      const { programId, note } = request.body as { programId: string; note?: string };

      if (!programId) {
        return reply.code(400).send({ error: 'programId wajib diisi.' });
      }

      const [student, program] = await Promise.all([
        prisma.student.findFirst({ where: { id: studentId, isDeleted: false } }),
        prisma.program.findFirst({ where: { id: programId, isDeleted: false, isActive: true } }),
      ]);

      if (!student) return reply.code(404).send({ error: 'Siswa tidak ditemukan.' });
      if (!program) return reply.code(404).send({ error: 'Program tidak ditemukan atau tidak aktif.' });

      const record = await prisma.studentProgram.create({
        data: {
          studentId,
          programId: program.id,
          programNameAtRegistration: program.name,
          feeAtRegistration: program.fee,
          status: 'Aktif',
          note: note ?? null,
        },
      });

      return reply.code(201).send({ studentProgram: record });
    }
  );

  // ============================================================
  // PATCH /api/student-programs/:id/complete
  // Tandai satu keikutsertaan sebagai Selesai
  // ============================================================
  app.patch(
    '/:id/complete',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const existing = await prisma.studentProgram.findUnique({
        where: { id: request.params.id },
      });

      if (!existing) {
        return reply.code(404).send({ error: 'Riwayat program tidak ditemukan.' });
      }

      if (existing.status === 'Selesai') {
        return reply.code(409).send({ error: 'Keikutsertaan ini sudah berstatus Selesai.' });
      }

      const updated = await prisma.studentProgram.update({
        where: { id: request.params.id },
        data: { status: 'Selesai' },
      });

      return reply.code(200).send({ studentProgram: updated });
    }
  );
}
