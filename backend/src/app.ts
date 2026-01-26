/**
 * Configuração principal da aplicação Express
 * Cria a instância do Express, configura middlewares e registra todas as rotas
 * 
 * Este arquivo é o coração da aplicação backend, onde toda a configuração
 * do servidor HTTP é centralizada antes de ser iniciada no server.ts
 */
import './config/env';
import express from "express";
import cors from "cors";
import routes from "./routes/index"; 

// Cria uma instância do Express
// Esta instância será usada para configurar middlewares e rotas
const app = express();

// Middleware CORS: permite que o frontend (rodando em porta diferente) 
// faça requisições para este backend sem problemas de CORS
app.use(cors());

// Middleware para parsear JSON: converte automaticamente o corpo das 
// requisições HTTP em objetos JavaScript
app.use(express.json());

// Registra todas as rotas da aplicação
// As rotas são definidas no arquivo routes/index.ts
routes(app);

export default app;