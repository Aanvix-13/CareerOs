export interface QueryOptions {
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
}

export function buildPrismaQuery(options: QueryOptions) {
  const where: Record<string, any> = {};
  const orderBy: Record<string, any> = {};

  // 1. Process search
  if (options.search && options.searchFields && options.searchFields.length > 0) {
    where.OR = options.searchFields.map(field => ({
      [field]: {
        contains: options.search,
        mode: 'insensitive',
      },
    }));
  }

  // 2. Process filters
  if (options.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      if (value !== undefined && value !== null && value !== '') {
        where[key] = value;
      }
    }
  }

  // 3. Process sort
  if (options.sort) {
    const order = options.order === 'asc' ? 'asc' : 'desc';
    orderBy[options.sort] = order;
  } else {
    // Default fallback sort
    orderBy.createdAt = 'desc';
  }

  return { where, orderBy };
}
export default buildPrismaQuery;
