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
import rateLimit from 'express-rate-limit';

// Cria uma instância do Express
// Esta instância será usada para configurar middlewares e rotas
const app = express();

// Middleware CORS: permite que o frontend (rodando em porta diferente) 
// faça requisições para este backend sem problemas de CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Lista de origens permitidas (do .env ou padrão)
    const allowedOrigins =
      process.env.ALLOWED_ORIGINS
        ?.split(',')
        .map(o => o.trim()) 
      || ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];

    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

    // Log para debug
    console.log(`[CORS] Origin recebida: ${origin || 'undefined'}`);
    console.log(`[CORS] Modo: ${isDevelopment ? 'desenvolvimento' : 'produção'}`);
    console.log(`[CORS] Origens permitidas: ${allowedOrigins.join(', ')}`);

    // Em desenvolvimento: permite tudo para facilitar desenvolvimento
    if (isDevelopment) {
      console.log('[CORS] ✅ Modo desenvolvimento - permitindo requisição');
      return callback(null, true);
    }

    // Em produção: valida origem
    if (!origin) {
      console.warn('[CORS] ❌ Requisição sem origin bloqueada em produção');
      return callback(new Error('CORS: Requisição sem origin não permitida'));
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS] ✅ Origem permitida: ${origin}`);
      return callback(null, true);
    }

    console.warn(`[CORS] ❌ Origem bloqueada: ${origin}`);
    return callback(new Error(`CORS: Origem "${origin}" não permitida`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 horas
};

// Rate limiter geral para toda a aplicação
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: {
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
  },
  standardHeaders: true, // Retorna rate limit info nos headers
  legacyHeaders: false,
});

// Rate limiter mais restritivo para busca de filmes (exportado para uso nas rotas)
export const movieSearchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo 10 buscas por minuto
  message: {
    error: 'Muitas buscas. Aguarde 1 minuto antes de tentar novamente.'
  },
  skipSuccessfulRequests: false,
});

// Ordem correta dos middlewares:
// 1. CORS primeiro (permite requisições)
app.use(cors(corsOptions));

// 2. Rate limiting (limita requisições)
app.use(generalLimiter);
// app.options é tratado automaticamente pelo cors(), não é necessário

app.use(express.json({ limit: '10mb' }));

routes(app);

export default app;
