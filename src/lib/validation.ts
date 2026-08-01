import { ZodSchema } from 'zod';
import { ValidationError } from './errors';

/**
 * Parses and validates a JSON request body against a Zod schema.
 * Throws a typed ValidationError (422) on failure.
 * Eliminates raw request.json() calls across API routes.
 */
export async function parseBody<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new ValidationError('Invalid JSON in request body.');
  }

  const result = schema.safeParse(json);
  if (!result.success) {
    throw new ValidationError('Invalid request body.', result.error.flatten().fieldErrors);
  }

  return result.data;
}
