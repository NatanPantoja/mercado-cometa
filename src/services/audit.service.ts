import { AuditRepository } from "../repositories/audit.repository";

export const AuditService = {
  // Função genérica para logar qualquer coisa
  async log(
    userId: string,
    action: string, // Ex: "CREATE", "UPDATE", "DELETE"
    entity: string, // Ex: "Product", "User", "Sale"
    entityId: string, // O ID do item que foi mexido
    details?: object // Objeto com o que mudou (opcional)
  ) {
    try {
      await AuditRepository.create({
        userId,
        action,
        entity,
        entityId,
        details: details ? JSON.stringify(details) : undefined,
      });
    } catch (error) {
      // Se o log falhar, não queremos travar o sistema principal,
      // então apenas mostramos no console.
      console.error("❌ Falha ao salvar Auditoria:", error);
    }
  },

  async getHistory(entity: string, id: string) {
    return AuditRepository.findByEntity(entity, id);
  },
};
