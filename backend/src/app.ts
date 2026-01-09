/**
 * Configuração principal da aplicação Express
 * Cria a instância do Express e registra todas as rotas
 */

import express from "express";
import cors from "cors";
import routes from "./routes/index"; 


// Cria uma instância do Express
const app = express();

app.use(cors());
app.use(express.json());

// Registra todas as rotas da aplicação
routes(app);

export default app;