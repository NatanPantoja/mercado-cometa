import { DashboardRepository } from "../repositories/dashboard.repository";

export const DashboardService = {
  async getDashboardData() {
    const [todaySummary, last7Days, topProducts, bottomProducts, monthlySales] =
      await Promise.all([
        DashboardRepository.getTodaySummary(),
        DashboardRepository.getLast7DaysSales(),
        DashboardRepository.getTopProducts(),
        DashboardRepository.getBottomProducts(), // NOVO
        DashboardRepository.getMonthlySales(), // NOVO
      ]);

    return {
      summary: todaySummary,
      salesChart: last7Days,
      topProducts,
      bottomProducts,
      monthlySales,
    };
  },

  async getBottomProducts() {
    return DashboardRepository.getBottomProducts();
  },

  async getMonthlySales() {
    return DashboardRepository.getMonthlySales();
  },
};
