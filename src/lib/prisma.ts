import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient; pool: Pool };

const connectionString = process.env.DATABASE_URL || 'postgresql://johndoe:mypassword@localhost:5432/careeros?schema=public';

let prisma: PrismaClient;
let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({ connectionString });
  }
  pool = globalForPrisma.pool;
  const adapter = new PrismaPg(pool);

  if (!globalForPrisma.prisma) {
    const client = new PrismaClient({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        'error',
        'warn',
      ],
    }) as any;

    client.$on('query', (e: any) => {
      if (e.duration >= 100) {
        console.warn(`\x1b[33m[PRISMA SLOW QUERY] ${e.duration}ms\x1b[0m | Query: ${e.query}`);
      } else {
        console.log(`[PRISMA QUERY] ${e.duration}ms | Query: ${e.query}`);
      }
    });

    globalForPrisma.prisma = client as PrismaClient;
  }
  prisma = globalForPrisma.prisma;
}

export { prisma, pool };
export default prisma;
