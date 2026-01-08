/**
 * Rotas específicas relacionadas a filmes
 * Define os endpoints disponíveis para operações com filmes
 */

import {Router} from 'express';
import MovieController from '../controllers/MovieController'; // Atenção ao Case Sensitive do nome do arquivo

// Cria um novo router para as rotas de filmes
const router = Router();

// Rota para buscar o plot de um filme traduzido
// Exemplo de uso: GET /movie/search?movie=Inception
router.get("/search", MovieController.getMoviePlot);

export default router;