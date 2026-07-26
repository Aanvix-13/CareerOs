type LogData = Record<string, any>;

function filterSensitiveData(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;
  
  if (Array.isArray(data)) {
    return data.map(filterSensitiveData);
  }

  const filtered: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const isSensitive = ['password', 'passwordhash', 'token', 'jwt', 'secret', 'password_hash', 'password_confirm', 'confirmpassword'].some(
      sensitiveKey => key.toLowerCase().includes(sensitiveKey)
    );
    if (isSensitive) {
      filtered[key] = '[FILTERED]';
    } else {
      filtered[key] = filterSensitiveData(value);
    }
  }
  return filtered;
}

export const logger = {
  info(message: string, data?: LogData) {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data ? JSON.stringify(filterSensitiveData(data)) : '');
  },
  warn(message: string, data?: LogData) {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data ? JSON.stringify(filterSensitiveData(data)) : '');
  },
  error(message: string, error?: Error | any, data?: LogData) {
    console.error(
      `[ERROR] ${new Date().toISOString()}: ${message}`,
      error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
      data ? JSON.stringify(filterSensitiveData(data)) : ''
    );
  },
  debug(message: string, data?: LogData) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`, data ? JSON.stringify(filterSensitiveData(data)) : '');
    }
  }
};

export default logger;
