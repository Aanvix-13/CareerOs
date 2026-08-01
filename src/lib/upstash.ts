import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { checkRateLimit } from '@/utils/rate-limiter';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

if (url && token) {
  try {
    redis = new Redis({
      url,
      token,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
      prefix: 'careeros:ratelimit:ai',
    });
  } catch (err) {
    console.error('Failed to initialize Upstash Redis:', err);
  }
}

/**
 * Checks AI feature rate limit.
 * Uses Upstash Redis sliding window (10 requests per 60 seconds) if configured.
 * Falls back to the existing in-memory limiter on failure or if env vars are missing.
 */
export async function checkAIRateLimit(userId: string): Promise<boolean> {
  if (!ratelimit) {
    return checkRateLimit(userId);
  }

  try {
    const result = await ratelimit.limit(userId);
    return result.success;
  } catch (error) {
    console.error('Upstash rate limit execution error. Falling back to in-memory.', error);
    return checkRateLimit(userId);
  }
}
