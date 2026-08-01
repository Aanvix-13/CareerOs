import { NextResponse } from 'next/server';
import { AppError } from './errors';
import { ZodError } from 'zod';
import { captureException } from '@sentry/nextjs';

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(
  code: string,
  message: string,
  details?: any,
  status = 400
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status }
  );
}

export function handleApiError(error: any) {
  if (error instanceof AppError) {
    return errorResponse(error.code, error.message, (error as any).details, error.statusCode);
  }

  if (error instanceof ZodError) {
    return errorResponse('VALIDATION_ERROR', 'Invalid request body.', error.flatten().fieldErrors, 422);
  }

  // Handle Prisma Unique Constraint Errors (P2002)
  if (error.code === 'P2002' || error.message?.includes('Unique constraint failed')) {
    const fields = error.meta?.target || ['email'];
    const fieldName = fields[0] || 'field';
    // Capitalize field name
    const friendlyName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    return errorResponse('CONFLICT', `${friendlyName} already exists.`, null, 409);
  }

  // Handle Prisma Record Not Found Errors (P2025)
  if (error.code === 'P2025' || error.name === 'NotFoundError') {
    return errorResponse('NOT_FOUND', 'The requested record was not found.', null, 404);
  }

  // Capture unexpected exceptions to Sentry
  try {
    captureException(error);
  } catch (sentryError) {
    console.error('Failed to report error to Sentry:', sentryError);
  }

  return errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred.', null, 500);
}

