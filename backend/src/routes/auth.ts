import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import { authenticate } from '../middlewares/authenticate';
import { loginSchema } from '../validators/schemas';
import { JWTPayload } from '../middlewares/authenticate';
import crypto from 'node:crypto'

const REFRESH_EXPIRES_SECONDS = parseInt(
  process.env.JWT_REFRESH_EXPIRES_SECONDS || "86400", 10
);
const isProduction = process.env.NODE_ENV === 'production';

export async function authRoutes(app: FastifyInstance) {
  // ============================================================
  // POST /api/auth/login
  // ============================================================
  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.flatten().fieldErrors });
    }

    const { username, password } = parseResult.data;

    // console.log({ username, password })

    // Cari admin
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin || !admin.isActive) {
      return reply.code(401).send({ error: 'Username atau password salah.' });
    }

    // Verifikasi password
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return reply.code(401).send({ error: 'Username atau password salah.' });
    }

    // console.log({ admin, valid })

    // console.log('REFRESH_EXPIRES_SECONDS: ', REFRESH_EXPIRES_SECONDS)

    // console.log(new Date(Date.now()))

    // Buat sesi
    const expiresAt = new Date(Date.now() + Number(REFRESH_EXPIRES_SECONDS) * 1000);

    // console.log('expiresAt:', expiresAt)
    // console.log('masuk sini')

    const rawRefreshToken = crypto.randomUUID();

    // console.log(rawRefreshToken)


    const refreshTokenHash = await bcrypt.hash(rawRefreshToken, 10);



    const session = await prisma.adminSession.create({
      data: {
        adminUserId: admin.id,
        refreshTokenHash,
        expiresAt,
      },
    });

    // Tandatangani access token (15 menit)
    const accessToken = app.jwt.sign(
      { sub: admin.id, sessionId: session.id, role: admin.role },
      { expiresIn: '15m' }
    );

    // Set refresh token sebagai httpOnly cookie
    reply.setCookie('refresh_token', rawRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: REFRESH_EXPIRES_SECONDS,
    });

    return reply.code(200).send({
      accessToken,
      expiresIn: 900,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    });
  });

  // ============================================================
  // POST /api/auth/refresh
  // ============================================================
  app.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {

    const rawRefreshToken = (request.cookies as Record<string, string>)?.refresh_token;

    if (!rawRefreshToken) {
      return reply.code(401).send({ error: 'Refresh token tidak ditemukan.' });
    }

    // Cari sesi aktif yang belum expired dan belum dicabut
    const now = new Date();
    const activeSessions = await prisma.adminSession.findMany({
      where: {
        revokedAt: null,
        expiresAt: { gt: now },
      },
      include: { adminUser: true },
    });

    // console.log('activeSessions: ', activeSessions)

    // Verifikasi hash
    let matchedSession: (typeof activeSessions)[0] | null = null;
    for (const session of activeSessions) {
      // console.log('session: ', session.refreshTokenHash)
      // const hashRawRefreshToken = await bcrypt.hash(rawRefreshToken, 10);
      // console.log('hashRawRefreshToken: ', hashRawRefreshToken)
      const match = await bcrypt.compare(rawRefreshToken, session.refreshTokenHash);
      // console.log('match: ', match)
      if (match) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      return reply.code(401).send({ error: 'Refresh token tidak valid atau sudah kadaluarsa.' });
    }

    // Issue access token baru (sesi TIDAK diperpanjang — sesuai PRD)
    const accessToken = app.jwt.sign(
      {
        sub: matchedSession.adminUserId,
        sessionId: matchedSession.id,
        role: matchedSession.adminUser.role,
      },
      { expiresIn: '15m' }
    );

    return reply.code(200).send({ accessToken, expiresIn: 900 });
  });

  // ============================================================
  // POST /api/auth/logout
  // ============================================================
  app.post(
    '/logout',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = request.user as JWTPayload;

      await prisma.adminSession.update({
        where: { id: payload.sessionId },
        data: { revokedAt: new Date() },
      });

      reply.clearCookie('refresh_token', {
        path: '/',
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
      });
      return reply.code(200).send({ message: 'Logout berhasil.' });
    }
  );

  // ============================================================
  // GET /api/auth/me
  // ============================================================
  app.get(
    '/me',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = request.user as JWTPayload;

      const admin = await prisma.adminUser.findUnique({
        where: { id: payload.sub },
        select: { id: true, username: true, role: true, isActive: true },
      });

      if (!admin) {
        return reply.code(404).send({ error: 'Admin tidak ditemukan.' });
      }

      return reply.code(200).send({ user: admin });
    }
  );
}
