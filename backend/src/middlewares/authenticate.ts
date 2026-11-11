import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../server';

export interface JWTPayload {
  sub: string;      // adminUserId
  sessionId: string;
  role: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JWTPayload;
    user: JWTPayload;
  }
}

/**
 * Middleware untuk memverifikasi access token JWT.
 * Juga memastikan sesi tidak dicabut (revoked) dan belum expired.
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    return reply.code(401).send({ error: 'Token tidak valid atau telah kadaluarsa.' });
  }

  try {
    const payload = request.user as JWTPayload;
    const { sessionId } = payload;

    const session = await prisma.adminSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return reply.code(401).send({ error: 'Sesi tidak ditemukan.' });
    }

    if (session.revokedAt !== null) {
      return reply.code(401).send({ error: 'Sesi telah dicabut. Silakan login kembali.' });
    }

    const now = new Date();
    if (session.expiresAt < now) {
      return reply.code(401).send({ error: 'Sesi telah berakhir. Silakan login kembali.' });
    }
  } catch {
    return reply.code(500).send({ error: 'Terjadi kesalahan server.' });
  }
}
