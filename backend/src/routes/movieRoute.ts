/**
 * Rotas específicas relacionadas a filmes
 * Define os endpoints disponíveis para operações com filmes
 */

import {Router} from 'express';
import MovieController from '../controllers/MovieController';
import { movieSearchLimiter } from '../app'; // Importa o rate limiter específico

// Cria um novo router para as rotas de filmes
const router = Router();

// Rota para buscar o plot de um filme traduzido
// Exemplo de uso: GET /movie/search?movie=Inception
// Aplica rate limiter específico para busca de filmes (10 requisições por minuto)
router.get("/search", movieSearchLimiter, MovieController.getMoviePlot);

export default router;