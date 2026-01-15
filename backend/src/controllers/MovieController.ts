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
     * Endpoint para buscar informações de um filme (título e plot traduzido)
     * 
     * FLUXO DE EXECUÇÃO:
     * 1. Recebe requisição GET com parâmetro 'movie' na query string
     * 2. Valida se o parâmetro foi fornecido
     * 3. Chama MovieService.getMovieInfo() para buscar dados na API OMDB
     * 4. Chama MovieService.getTranslation() para traduzir o plot
     * 5. Retorna título e plot traduzido em formato JSON
     * 
     * Rota: GET /movie/search?movie=NomeDoFilme
     * Exemplo: GET /movie/search?movie=Inception
     * 
     * @param req - Objeto da requisição contendo o parâmetro 'movie' na query string
     * @param res - Objeto da resposta HTTP para enviar dados ao cliente
     * @returns JSON com { title: string, plot: string } ou mensagem de erro
     */
    static async getMoviePlot(
        req: Request<{}, {}, {}, MovieQuery>,
        res: Response
    ) {
        try {
            // PASSO 1: Extrai o nome do filme da query string da URL
            // Exemplo: /movie/search?movie=Inception → movieName = "Inception"
            const movieName = req.query.movie;

            // PASSO 2: Valida se o parâmetro 'movie' foi fornecido
            // Se não foi fornecido, retorna erro 400 (Bad Request)
            if(!movieName){
                return  res.status(400).json({
                    message: "Movie é obrigatório" 
                });
            }

            // PASSO 3: Busca as informações do filme na API OMDB
            // Esta chamada faz uma requisição HTTP para a API OMDB externa
            // Retorna um objeto MovieInfo com { title, plot } (plot em inglês)
            const movieInfo = await MovieService.getMovieInfo(movieName);

            // PASSO 4: Traduz o plot do filme do inglês para português
            // Esta chamada faz uma requisição HTTP para o serviço de tradução local
            // Retorna um objeto Translation com { translatedText }
            const translatedPlot = 
                await MovieService.getTranslation(movieInfo);

            // PASSO 5: Retorna resposta HTTP 200 (OK) com os dados formatados
            // O frontend receberá: { title: "Inception", plot: "plot traduzido..." }
            return res
                .status(200)
                .json({
                    title: movieInfo.title,              // Título do filme
                    plot: translatedPlot.translatedText // Plot traduzido para português
                });

        }catch (error){
            // Tratamento de erros: captura qualquer erro que ocorra durante o processo
            // Pode ser erro da API OMDB, erro de tradução, ou erro de rede
            if (error instanceof Error) {
                // Verifica se é um erro de "filme não encontrado"
                // Quando a API OMDB retorna Response: "False", é um erro de não encontrado
                const isNotFound = (error as any).isNotFound || 
                                   error.message.toLowerCase().includes('not found') ||
                                   error.message.toLowerCase().includes('não encontrado') ||
                                   error.message.toLowerCase().includes('movie not found');
                
                if (isNotFound) {
                    // Retorna 404 (Not Found) para filme não encontrado
                    return res.status(404).json({ 
                        message: error.message || "Filme não encontrado. Verifique o nome e tente novamente." 
                    });
                }
                
                // Para outros erros, retorna 500 (Internal Server Error)
                return res.status(500).json({ message: error.message });
            }
            // Se não for um Error conhecido, retorna mensagem genérica
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
export default MovieController;