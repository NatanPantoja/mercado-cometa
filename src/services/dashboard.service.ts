import { DashboardRepository } from "../repositories/dashboard.repository";

export const DashboardService = {
  async getDashboardData() {
    // Executa as 3 consultas em paralelo para ser mais rápido
    const [todaySummary, last7Days, topProducts] = await Promise.all([
      DashboardRepository.getTodaySummary(),
      DashboardRepository.getLast7DaysSales(),
      DashboardRepository.getTopProducts(),
    ]);

    return {
      summary: todaySummary,
      salesChart: last7Days,
      topProducts: topProducts,
    };
  },
};
