import systemSettingRepository from '../repositories/system-setting.repository';
import auditLogRepository from '../repositories/audit-log.repository';

export interface AppSettings {
  appName: string;
  supportEmail: string;
  contactEmail: string;
  defaultTimeZone: string;
  maxResumeSize: number;
  allowedResumeTypes: string[];
  maxProfileImageSize: number;
  allowedImageTypes: string[];
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  enableUserFeedback: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  appName: 'CareerOS',
  supportEmail: 'support@careeros.com',
  contactEmail: 'contact@careeros.com',
  defaultTimeZone: 'UTC',
  maxResumeSize: 5,
  allowedResumeTypes: ['PDF'],
  maxProfileImageSize: 2,
  allowedImageTypes: ['JPG', 'JPEG', 'PNG'],
  maintenanceMode: false,
  allowNewRegistrations: true,
  enableUserFeedback: true,
};

export class SystemSettingService {
  async getSettings(): Promise<AppSettings> {
    const dbSettings = await systemSettingRepository.getAll();
    const settings = { ...DEFAULT_SETTINGS };

    for (const item of dbSettings) {
      const key = item.key as keyof AppSettings;
      if (key in settings) {
        if (typeof DEFAULT_SETTINGS[key] === 'boolean') {
          (settings as any)[key] = item.value === 'true';
        } else if (typeof DEFAULT_SETTINGS[key] === 'number') {
          (settings as any)[key] = Number(item.value);
        } else if (Array.isArray(DEFAULT_SETTINGS[key])) {
          (settings as any)[key] = item.value.split(',').map(s => s.trim().toUpperCase());
        } else {
          (settings as any)[key] = item.value;
        }
      }
    }

    return settings;
  }

  async updateSettings(adminId: string, updates: Partial<AppSettings>): Promise<AppSettings> {
    for (const [key, value] of Object.entries(updates)) {
      let stringValue = '';
      if (Array.isArray(value)) {
        stringValue = value.join(',');
      } else {
        stringValue = String(value);
      }
      await systemSettingRepository.upsert(key, stringValue);
    }

    // Log this action to audit log
    await auditLogRepository.create({
      adminId,
      action: 'UPDATE_SETTINGS',
      resource: 'SETTINGS',
      details: `Updated settings: ${Object.keys(updates).join(', ')}`,
    });

    return this.getSettings();
  }
}

export default new SystemSettingService();
