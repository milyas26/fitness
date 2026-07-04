import { apiGet, apiPut, apiPatch } from '../lib/api';
import type { Settings, UpdateSettings } from '@fitness/shared';

export const settingsApi = {
  get: () => apiGet<Settings | null>('/settings'),

  put: (data: Settings) => apiPut<Settings>('/settings', data),

  patch: (data: UpdateSettings) => apiPatch<Settings>('/settings', data),
};
