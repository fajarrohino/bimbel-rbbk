import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../server';
import { authenticate } from '../middlewares/authenticate';
import {
  createScheduleSchema,
  bulkCreateScheduleSchema,
  deleteScheduleSchema,
} from '../validators/schemas';

export async function scheduleRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  // ============================================================
  // GET /api/schedules — Ambil jadwal berdasarkan tanggal / bulan
  // Query: date=YYYY-MM-DD, month=YYYY-MM
  // ============================================================
  app.get(
    '/',
    async (
      request: FastifyRequest<{ Querystring: { date?: string; month?: string } }>,
      reply: FastifyReply
    ) => {
      const { date, month } = request.query;
      const where: any = {};

      if (date) {
        // Jadwal pada tanggal tertentu (YYYY-MM-DD)
        const d = new Date(date);
        where.date = d;
      } else if (month) {
        // Jadwal dalam satu bulan: YYYY-MM
        const [year, mon] = month.split('-').map(Number);
        const lastDay = new Date(year, mon, 0).getDate();
        const start = new Date(`${month}-01`);
        const end = new Date(`${month}-${String(lastDay).padStart(2, '0')}`);
        where.date = { gte: start, lte: end };
      }

      const schedules = await prisma.scheduleAssignment.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              status: true,
              preferredSession: true,
              grade: true,
            },
          },
        },
        orderBy: [{ date: 'asc' }, { session: 'asc' }],
      });

      return reply.code(200).send({ schedules });
    }
  );

  // ============================================================
  // GET /api/schedules/today — Jadwal hari ini
  // ============================================================
  app.get('/today', async (_request: FastifyRequest, reply: FastifyReply) => {
    // Ambil tanggal hari ini (YYYY-MM-DD) sesuai zona waktu Indonesia (WIB)
    const dateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
    const today = new Date(dateStr);

    const schedules = await prisma.scheduleAssignment.findMany({
      where: { date: today },
      include: {
        student: {
          select: { id: true, name: true, status: true, preferredSession: true, grade: true },
        },
      },
      orderBy: [{ session: 'asc' }],
    });

    // Kelompokkan per sesi
    const sessions: Record<number, typeof schedules> = { 1: [], 2: [], 3: [] };
    for (const s of schedules) {
      sessions[s.session]?.push(s);
    }

    return reply.code(200).send({ date: dateStr, sessions });
  });

  // ============================================================
  // GET /api/schedules/active-students — Siswa aktif untuk Atur Jadwal
  // ============================================================
  app.get('/active-students', async (_request: FastifyRequest, reply: FastifyReply) => {
    const students = await prisma.student.findMany({
      where: { status: 'Aktif', isDeleted: false },
      select: {
        id: true,
        name: true,
        preferredSession: true,
        grade: true,
        school: true,
      },
      orderBy: [{ preferredSession: 'asc' }, { name: 'asc' }],
    });

    return reply.code(200).send({ students });
  });

  // ============================================================
  // POST /api/schedules — Buat satu jadwal
  // ============================================================
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = createScheduleSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
    }

    const { studentId, date, session } = parseResult.data;

    // Pastikan siswa Aktif
    const student = await prisma.student.findFirst({
      where: { id: studentId, status: 'Aktif', isDeleted: false },
    });

    if (!student) {
      return reply.code(404).send({ error: 'Siswa tidak ditemukan atau tidak aktif.' });
    }

    try {
      const schedule = await prisma.scheduleAssignment.create({
        data: {
          studentId,
          date: new Date(date),
          session,
        },
        include: {
          student: { select: { id: true, name: true } },
        },
      });

      return reply.code(201).send({ schedule });
    } catch (err: any) {
      // Unique constraint violation
      if (err.code === 'P2002') {
        return reply.code(409).send({
          error: 'Siswa sudah memiliki jadwal pada tanggal dan sesi yang sama.',
        });
      }
      throw err;
    }
  });

  // ============================================================
  // POST /api/schedules/bulk — Buat banyak jadwal sekaligus
  // ============================================================
  app.post('/bulk', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = bulkCreateScheduleSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
    }

    const { assignments } = parseResult.data;

    // Validasi semua siswa Aktif
    const studentIds = [...new Set(assignments.map((a) => a.studentId))];
    const activeStudents = await prisma.student.findMany({
      where: { id: { in: studentIds }, status: 'Aktif', isDeleted: false },
      select: { id: true },
    });

    const activeIds = new Set(activeStudents.map((s) => s.id));
    const invalidIds = studentIds.filter((id) => !activeIds.has(id));

    if (invalidIds.length > 0) {
      return reply.code(400).send({
        error: `Siswa berikut tidak ditemukan atau tidak aktif: ${invalidIds.join(', ')}`,
      });
    }

    // Upsert: skip duplikat
    const results = await prisma.$transaction(
      assignments.map((a) =>
        prisma.scheduleAssignment.upsert({
          where: {
            studentId_date_session: {
              studentId: a.studentId,
              date: new Date(a.date),
              session: a.session,
            },
          },
          update: {}, // tidak diupdate jika sudah ada
          create: {
            studentId: a.studentId,
            date: new Date(a.date),
            session: a.session,
          },
        })
      )
    );

    return reply.code(201).send({
      message: `${results.length} jadwal berhasil diproses.`,
      count: results.length,
    });
  });

  // ============================================================
  // DELETE /api/schedules/:id — Hapus satu jadwal
  // ============================================================
  app.delete(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const existing = await prisma.scheduleAssignment.findUnique({
        where: { id: request.params.id },
      });

      if (!existing) {
        return reply.code(404).send({ error: 'Jadwal tidak ditemukan.' });
      }

      await prisma.scheduleAssignment.delete({ where: { id: request.params.id } });

      return reply.code(200).send({ message: 'Jadwal berhasil dihapus.' });
    }
  );

  // ============================================================
  // DELETE /api/schedules/student/:studentId/date/:date/session/:session
  // Hapus jadwal berdasarkan kombinasi unik
  // ============================================================
  app.delete(
    '/student/:studentId/date/:date/session/:session',
    async (
      request: FastifyRequest<{
        Params: { studentId: string; date: string; session: string };
      }>,
      reply: FastifyReply
    ) => {
      const { studentId, date, session } = request.params;
      const sessionNum = parseInt(session, 10);

      if (isNaN(sessionNum) || sessionNum < 1 || sessionNum > 3) {
        return reply.code(400).send({ error: 'Sesi tidak valid.' });
      }

      try {
        await prisma.scheduleAssignment.delete({
          where: {
            studentId_date_session: {
              studentId,
              date: new Date(date),
              session: sessionNum,
            },
          },
        });

        return reply.code(200).send({ message: 'Jadwal berhasil dihapus.' });
      } catch (err: any) {
        if (err.code === 'P2025') {
          return reply.code(404).send({ error: 'Jadwal tidak ditemukan.' });
        }
        throw err;
      }
    }
  );
}
