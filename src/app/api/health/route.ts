import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // 1. Check database connectivity & measure latency
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        checks: {
          database: {
            status: 'up',
            latencyMs: dbLatency,
          },
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Liveness probe failed:', error);
    
    return NextResponse.json(
      {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        checks: {
          database: {
            status: 'down',
            error: error.message || String(error),
          },
        },
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}
