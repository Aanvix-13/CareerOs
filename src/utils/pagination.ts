import { PAGINATION } from '../constants';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');

  let page = pageParam ? parseInt(pageParam, 10) : PAGINATION.DEFAULT_PAGE;
  let limit = limitParam ? parseInt(limitParam, 10) : PAGINATION.DEFAULT_LIMIT;

  if (isNaN(page) || page <= 0) page = PAGINATION.DEFAULT_PAGE;
  if (isNaN(limit) || limit <= 0) limit = PAGINATION.DEFAULT_LIMIT;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function formatPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
