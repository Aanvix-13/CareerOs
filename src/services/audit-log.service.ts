import auditLogRepository from '../repositories/audit-log.repository';
import { AuditLog } from '@prisma/client';

export class AuditLogService {
  async logAction(
    adminId: string,
    action: string,
    resource: string,
    details?: string
  ): Promise<AuditLog> {
    return auditLogRepository.create({
      adminId,
      action,
      resource,
      details,
    });
  }

  async getLogs(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const skip = (params.page - 1) * params.limit;
    const [logs, total] = await Promise.all([
      auditLogRepository.findMany({ skip, take: params.limit, search: params.search }),
      auditLogRepository.count({ search: params.search }),
    ]);

    return { logs, total };
  }
}

export default new AuditLogService();
