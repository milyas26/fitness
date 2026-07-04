import { dashboardService } from '../dashboard/dashboard.service.js';

export const hermesContextService = {
  async getDailyContext(dateStr?: string) {
    return dashboardService.getContext(dateStr);
  },

  async getWeeklyContext(dateStr?: string) {
    return dashboardService.getContext(dateStr);
  },

  async getMonthlyContext(dateStr?: string) {
    return dashboardService.getContext(dateStr);
  },
};
