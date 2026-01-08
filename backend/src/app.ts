/**
 * Configuração principal da aplicação Express
 * Cria a instância do Express e registra todas as rotas
 */

import express from "express";
import routes from "./routes/index"; 

// Cria uma instância do Express
const app = express();

// Registra todas as rotas da aplicação
routes(app);

export default app;