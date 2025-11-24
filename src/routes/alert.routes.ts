import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { AlertController } from "../controllers/alert.controller";

const alertRoutes = Router();

alertRoutes.use(ensureAuthenticated);

// Rota para ver o que precisa comprar (Estoque Baixo)
alertRoutes.get("/low-stock", AlertController.getLowStock);

// Rota para ver o que precisa fazer promoção (Vencendo Perto)
alertRoutes.get("/expiring", AlertController.getExpiring);

export { alertRoutes };
