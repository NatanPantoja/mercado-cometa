import { AlertRepository } from "../repositories/alert.repository";

export const AlertService = {
  async getLowStockProducts() {
    const products = await AlertRepository.findLowStock();
    return products;
  },

  async getExpiringLots() {
    // Regra de Negócio: Avisar sobre tudo que vence nos próximos 30 dias
    const daysThreshould = 30;
    const lots = await AlertRepository.findExpiring(daysThreshould);
    return lots;
  },
};
