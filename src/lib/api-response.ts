import { NextResponse } from 'next/server';
import { AppError } from './errors';

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
  return errorResponse('INTERNAL_SERVER_ERROR', error.message || 'An unexpected error occurred.', null, 500);
}

