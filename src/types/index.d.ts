interface RequestUser {
  id: string;
  role: "ADMIN" | "CAIXA";
}

// Faz a "mágica" de adicionar a nossa definição no namespace global do Express
declare namespace Express {
  export interface Request {
    user: RequestUser;
  }
}
