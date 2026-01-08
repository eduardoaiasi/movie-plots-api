import {Router} from 'express';
import MovieController from '../controllers/MovieController'; // Atenção ao Case Sensitive do nome do arquivo

const router = Router();

// GET /movie/search?movie=Inception
router.get("/search", MovieController.getMoviePlot);

export default router;