/**
 * Controlador responsável por lidar com requisições HTTP relacionadas a filmes
 * Processa as requisições, valida os dados e retorna as respostas apropriadas
 */

import { Request } from 'express';
import MovieService from '../services/MovieService';
import { Response } from 'express';

// Interface que define a estrutura da query string esperada
interface MovieQuery {
    movie: string;
}

class MovieController {
    /**
     * Endpoint para buscar o plot de um filme traduzido para português
     * Rota: GET /movie/search?movie=NomeDoFilme
     * 
     * @param req - Objeto da requisição contendo o parâmetro 'movie' na query string
     * @param res - Objeto da resposta HTTP
     * @returns JSON com o plot do filme traduzido ou mensagem de erro
     */
    static async getMoviePlot(
        req: Request<{}, {}, {}, MovieQuery>,
        res: Response
    ) {
        try {
            // Extrai o nome do filme da query string
            const movieName = req.query.movie;

            // Valida se o parâmetro 'movie' foi fornecido
            if(!movieName){
                return  res.status(400).json({
                    message: "Movie é obrigatório" 
                });
            }

            // Busca as informações do filme na API OMDB
            const movieInfo = await MovieService.getMovieInfo(movieName);

            // Traduz o plot do filme do inglês para português
            const translatedPlot = 
                await MovieService.getTranslation(movieInfo);

            // Retorna apenas o texto traduzido
            return res
                .status(200)
                .json(translatedPlot.translatedText);

        }catch (error){
            // Tratamento de erros: retorna mensagem de erro apropriada
           if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
export default MovieController;