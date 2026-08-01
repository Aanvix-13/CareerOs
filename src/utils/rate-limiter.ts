import { NextResponse } from 'next/server';

interface LimitTracker {
  timestamps: number[];
}

const rateLimitMap = new Map<string, LimitTracker>();

/**
 * In-memory sliding window rate limiter
 * Allows max 10 requests per 60 seconds per user
 */
export function checkRateLimit(userId: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  
  if (!rateLimitMap.has(userId)) {
    rateLimitMap.set(userId, { timestamps: [now] });
    return true;
  }

  const tracker = rateLimitMap.get(userId)!;
  
  // Filter timestamps older than the sliding window boundary
  tracker.timestamps = tracker.timestamps.filter(t => now - t < windowMs);
  
  if (tracker.timestamps.length >= maxRequests) {
    return false;
  }

  tracker.timestamps.push(now);
  return true;
}

/**
 * Reusable helper returning a HTTP 429 response on rate limit hit
 */
export function rateLimitResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests. Please wait a moment and try again.'
      }
    },
    { status: 429 }
  );
}

export { checkAIRateLimit } from '@/lib/upstash';
