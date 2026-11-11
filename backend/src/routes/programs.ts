import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../server';
import { authenticate } from '../middlewares/authenticate';
import { createProgramSchema, updateProgramSchema } from '../validators/schemas';

export async function programRoutes(app: FastifyInstance) {
  // Semua route program memerlukan autentikasi
  app.addHook('preHandler', authenticate);

  // ============================================================
  // GET /api/programs — Daftar semua program (termasuk nonaktif, kecuali deleted)
  // ============================================================
  app.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    const programs = await prisma.program.findMany({
      where: { isDeleted: false },
      orderBy: { displayOrder: 'asc' },
    });
    return reply.code(200).send({ programs });
  });

  // ============================================================
  // GET /api/programs/:id
  // ============================================================
  app.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const program = await prisma.program.findFirst({
      where: { id: request.params.id, isDeleted: false },
    });

    if (!program) {
      return reply.code(404).send({ error: 'Program tidak ditemukan.' });
    }

    return reply.code(200).send({ program });
  });

  // ============================================================
  // POST /api/programs — Buat program baru
  // ============================================================
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = createProgramSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
    }

    const { name, description, gradeLevels, subjects, fee, isActive } = parseResult.data;

    // Hitung displayOrder dalam transaksi untuk keamanan konkurensi
    const program = await prisma.$transaction(async (tx) => {
      const maxOrder = await tx.program.aggregate({
        where: { isActive: true, isDeleted: false },
        _max: { displayOrder: true },
      });

      const nextOrder = (maxOrder._max.displayOrder ?? 0) + 1;

      return tx.program.create({
        data: {
          name,
          description,
          gradeLevels,
          subjects,
          fee,
          isActive: isActive ?? true,
          displayOrder: nextOrder,
        },
      });
    });

    return reply.code(201).send({ program });
  });

  // ============================================================
  // PUT /api/programs/:id — Update program
  // ============================================================
  app.put('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const parseResult = updateProgramSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
    }

    const existing = await prisma.program.findFirst({
      where: { id: request.params.id, isDeleted: false },
    });

    if (!existing) {
      return reply.code(404).send({ error: 'Program tidak ditemukan.' });
    }

    const updated = await prisma.program.update({
      where: { id: request.params.id },
      data: parseResult.data,
    });

    return reply.code(200).send({ program: updated });
  });

  // ============================================================
  // PATCH /api/programs/:id/toggle-active — Toggle isActive
  // ============================================================
  app.patch(
    '/:id/toggle-active',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const existing = await prisma.program.findFirst({
        where: { id: request.params.id, isDeleted: false },
      });

      if (!existing) {
        return reply.code(404).send({ error: 'Program tidak ditemukan.' });
      }

      const updated = await prisma.program.update({
        where: { id: request.params.id },
        data: { isActive: !existing.isActive },
      });

      return reply.code(200).send({ program: updated });
    }
  );

  // ============================================================
  // DELETE /api/programs/:id — Soft delete
  // ============================================================
  app.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const existing = await prisma.program.findFirst({
      where: { id: request.params.id, isDeleted: false },
    });

    if (!existing) {
      return reply.code(404).send({ error: 'Program tidak ditemukan.' });
    }

    await prisma.program.update({
      where: { id: request.params.id },
      data: { isDeleted: true, deletedAt: new Date(), isActive: false },
    });

    return reply.code(200).send({ message: 'Program berhasil dihapus (soft delete).' });
  });
}
