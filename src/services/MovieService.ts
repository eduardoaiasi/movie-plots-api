/**
 * Camada de serviço para operações relacionadas a filmes
 * Responsável por orquestrar as chamadas de API e processar os dados
 */

import {fetchMovie, fetchTranslation} from '../utils/apiConnect';
import { MovieInfo } from '../types/MovieInfo';
import { Translation } from '../types/translation';

class MovieService {
    /**
     * Busca informações de um filme pelo nome
     * @param movieName - Nome do filme a ser buscado
     * @returns Promise com as informações do filme (título e plot)
     */
    static async getMovieInfo(movieName: string): Promise<MovieInfo> {
        // Busca o filme na API OMDB
        const rawMovie = await fetchMovie(movieName);
        
        // Retorna as informações formatadas
        return {
            title: rawMovie.title,
            plot: rawMovie.plot
        };
    }

    /**
     * Traduz o plot de um filme do inglês para português
     * @param movieInfo - Objeto contendo as informações do filme (incluindo o plot)
     * @returns Promise com o texto traduzido
     */
    static async getTranslation(
        movieInfo: MovieInfo
    ): Promise<Translation>
    {
        // Envia o plot do filme para o serviço de tradução
        const translated = await fetchTranslation(movieInfo.plot);
        return translated;
    }
}

export default MovieService;