import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';

import { authRoutes } from './routes/auth';
import { programRoutes } from './routes/programs';
import { studentRoutes } from './routes/students';
import { studentProgramRoutes } from './routes/studentPrograms';
import { scheduleRoutes } from './routes/schedules';
import { publicRoutes } from './routes/public';

// ============================================================
// Environment validation
// ============================================================
const requiredEnv = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

// ============================================================
// Prisma
// ============================================================
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
});

// ============================================================
// Fastify instance
// ============================================================
const app = Fastify({
  logger: process.env.NODE_ENV === 'development',
});

// ============================================================
// Register plugins & routes, then start
// ============================================================
async function start() {
  // Izinkan request POST/PUT/PATCH dengan body JSON kosong tanpa error 400
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    try {
      const text = (typeof body === 'string' ? body : body?.toString('utf-8') || '').trim();
      const json = text ? JSON.parse(text) : {};
      done(null, json);
    } catch (err: any) {
      err.statusCode = 400;
      done(err, undefined);
    }
  });

  // CORS
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Cookie
  await app.register(cookie, {
    secret: process.env.JWT_REFRESH_SECRET!,
  });

  // JWT (access token)
  await app.register(jwt, {
    secret: process.env.JWT_ACCESS_SECRET!,
  });

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  // Routes
  await app.register(publicRoutes, { prefix: '/api/public' });
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(programRoutes, { prefix: '/api/programs' });
  await app.register(studentRoutes, { prefix: '/api/students' });
  await app.register(studentProgramRoutes, { prefix: '/api/student-programs' });
  await app.register(scheduleRoutes, { prefix: '/api/schedules' });

  const port = parseInt(process.env.PORT || '3001', 10);
  const host = process.env.HOST || '0.0.0.0';

  try {
    await app.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);
    console.log(`📋 Health check: http://${host}:${port}/health`);
  } catch (err) {
    app.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

start();
