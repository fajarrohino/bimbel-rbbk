import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../server';
import { authenticate } from '../middlewares/authenticate';
import {
  createStudentSchema,
  updateStudentSchema,
  updateStudentStatusSchema,
} from '../validators/schemas';
import { normalizeWhatsApp, mapGender, displayGender } from '../utils/helpers';

type StudentStatus = 'Pending' | 'Aktif' | 'Nonaktif' | 'Lulus';

function formatStudent(s: any) {
  return {
    ...s,
    gender: displayGender(s.gender),
  };
}

export async function studentRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  // ============================================================
  // GET /api/students — Daftar siswa (filter by status optional)
  // ============================================================
  app.get(
    '/',
    async (
      request: FastifyRequest<{ Querystring: { status?: string; page?: string; limit?: string } }>,
      reply: FastifyReply
    ) => {
      const { status, page = '1', limit = '20' } = request.query;
      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
      const skip = (pageNum - 1) * limitNum;

      const where: any = { isDeleted: false };
      if (status) {
        where.status = status as StudentStatus;
      }

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
          include: {
            studentPrograms: {
              where: { status: 'Aktif' },
              include: { program: { select: { id: true, name: true } } },
              orderBy: { startedAt: 'desc' },
              take: 1,
            },
          },
        }),
        prisma.student.count({ where }),
      ]);

      return reply.code(200).send({
        students: students.map(formatStudent),
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  );

  // ============================================================
  // GET /api/students/:id
  // ============================================================
  app.get(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const student = await prisma.student.findFirst({
        where: { id: request.params.id, isDeleted: false },
        include: {
          studentPrograms: {
            include: { program: { select: { id: true, name: true } } },
            orderBy: { startedAt: 'desc' },
          },
          schedules: {
            orderBy: [{ date: 'desc' }, { session: 'asc' }],
          },
        },
      });

      if (!student) {
        return reply.code(404).send({ error: 'Siswa tidak ditemukan.' });
      }

      return reply.code(200).send({ student: formatStudent(student) });
    }
  );

  // ============================================================
  // POST /api/students — Tambah siswa (oleh admin → langsung Aktif)
  // ============================================================
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = createStudentSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
    }

    const { programId, whatsapp, gender, birthDate, ...rest } = parseResult.data;

    const student = await prisma.$transaction(async (tx) => {
      const newStudent = await tx.student.create({
        data: {
          ...rest,
          gender: mapGender(gender),
          birthDate: new Date(birthDate),
          whatsapp: normalizeWhatsApp(whatsapp),
          status: 'Aktif', // Admin menambahkan → langsung Aktif
        },
      });

      // Jika programId disertakan, buat student_program
      if (programId) {
        const program = await tx.program.findFirst({
          where: { id: programId, isDeleted: false, isActive: true },
        });

        if (!program) {
          throw new Error('Program tidak ditemukan atau tidak aktif.');
        }

        await tx.studentProgram.create({
          data: {
            studentId: newStudent.id,
            programId: program.id,
            programNameAtRegistration: program.name,
            feeAtRegistration: program.fee,
            status: 'Aktif',
          },
        });
      }

      return newStudent;
    });

    return reply.code(201).send({ student: formatStudent(student) });
  });

  // ============================================================
  // PUT /api/students/:id — Update data siswa
  // ============================================================
  app.put(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parseResult = updateStudentSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
      }

      const existing = await prisma.student.findFirst({
        where: { id: request.params.id, isDeleted: false },
      });

      if (!existing) {
        return reply.code(404).send({ error: 'Siswa tidak ditemukan.' });
      }

      const { whatsapp, gender, birthDate, ...rest } = parseResult.data;
      const updateData: any = { ...rest };

      if (whatsapp) updateData.whatsapp = normalizeWhatsApp(whatsapp);
      if (gender) updateData.gender = mapGender(gender);
      if (birthDate) updateData.birthDate = new Date(birthDate);

      const updated = await prisma.student.update({
        where: { id: request.params.id },
        data: updateData,
      });

      return reply.code(200).send({ student: formatStudent(updated) });
    }
  );

  // ============================================================
  // PATCH /api/students/:id/status — Ubah status siswa
  // ============================================================
  app.patch(
    '/:id/status',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parseResult = updateStudentStatusSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
      }

      const { status, rejectionReason } = parseResult.data;

      const existing = await prisma.student.findFirst({
        where: { id: request.params.id, isDeleted: false },
      });

      if (!existing) {
        return reply.code(404).send({ error: 'Siswa tidak ditemukan.' });
      }

      const updateData: any = { status };

      if (status === 'Aktif') {
        // Diterima: hapus rejection reason
        updateData.rejectionReason = null;
      } else if (status === 'Nonaktif' && existing.status === 'Pending') {
        // Ditolak: simpan alasan penolakan
        updateData.rejectionReason = rejectionReason || 'Ditolak';
      }

      const updated = await prisma.student.update({
        where: { id: request.params.id },
        data: updateData,
      });

      return reply.code(200).send({ student: formatStudent(updated) });
    }
  );

  // ============================================================
  // DELETE /api/students/:id — Soft delete (hanya Nonaktif)
  // ============================================================
  app.delete(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const existing = await prisma.student.findFirst({
        where: { id: request.params.id, isDeleted: false },
      });

      if (!existing) {
        return reply.code(404).send({ error: 'Siswa tidak ditemukan.' });
      }

      if (existing.status !== 'Nonaktif') {
        return reply.code(409).send({
          error: 'Hanya siswa dengan status Nonaktif yang dapat dihapus.',
        });
      }

      await prisma.student.update({
        where: { id: request.params.id },
        data: { isDeleted: true, deletedAt: new Date() },
      });

      return reply.code(200).send({ message: 'Siswa berhasil dihapus.' });
    }
  );
}
