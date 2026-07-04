import { apiGet, apiPost, apiDelete } from '../lib/api';
import type { RecoveryLog, CreateRecoveryLog } from '@fitness/shared';

export const recoveryApi = {
  get: (date?: string) => apiGet<RecoveryLog | null>('/recovery', date ? { date } : undefined),

  getRange: (start: string, end: string) =>
    apiGet<RecoveryLog[]>('/recovery/range', { start, end }),

  create: (data: CreateRecoveryLog) => apiPost<RecoveryLog>('/recovery', data),

  delete: (date: string) => apiDelete(`/recovery/${date}`),
};
