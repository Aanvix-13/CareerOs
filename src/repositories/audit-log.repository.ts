import prisma from '../lib/prisma';
import { AuditLog } from '@prisma/client';

export class AuditLogRepository {
  async create(data: {
    adminId: string;
    action: string;
    resource: string;
    details?: string;
  }): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        adminId: data.adminId,
        action: data.action,
        resource: data.resource,
        details: data.details,
      },
    });
  }

  async findMany(params: {
    skip: number;
    take: number;
    search?: string;
  }): Promise<AuditLog[]> {
    const where: any = {};
    if (params.search) {
      where.OR = [
        { action: { contains: params.search, mode: 'insensitive' } },
        { resource: { contains: params.search, mode: 'insensitive' } },
        { details: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip: params.skip,
      take: params.take,
    });
  }

  async count(params: { search?: string }): Promise<number> {
    const where: any = {};
    if (params.search) {
      where.OR = [
        { action: { contains: params.search, mode: 'insensitive' } },
        { resource: { contains: params.search, mode: 'insensitive' } },
        { details: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return prisma.auditLog.count({ where });
  }
}

export default new AuditLogRepository();
