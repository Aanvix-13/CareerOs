import prisma from '../lib/prisma';
import { SystemSetting } from '@prisma/client';

export class SystemSettingRepository {
  async findByKey(key: string): Promise<SystemSetting | null> {
    return prisma.systemSetting.findUnique({
      where: { key },
    });
  }

  async getAll(): Promise<SystemSetting[]> {
    return prisma.systemSetting.findMany();
  }

  async upsert(key: string, value: string): Promise<SystemSetting> {
    return prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}

export default new SystemSettingRepository();
