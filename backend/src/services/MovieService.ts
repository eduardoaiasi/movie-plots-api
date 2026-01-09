/**
 * Camada de serviço para operações relacionadas a filmes
 * Responsável por orquestrar as chamadas de API e processar os dados
 */

import {fetchMovie, fetchTranslation} from '../utils/apiConnect';
import { MovieInfo } from '../types/MovieInfo';
import { Translation } from '../types/translation';

class MovieService {
    /**
     * Busca informações de um filme pelo nome na API OMDB
     * 
     * PROCESSO:
     * 1. Chama fetchMovie() que faz requisição HTTP para API OMDB
     * 2. Recebe resposta em formato OmdbMovieResponse (Title, Plot em PascalCase)
     * 3. Converte para formato MovieInfo (title, plot em camelCase)
     * 4. Retorna dados formatados para o controller
     * 
     * @param movieName - Nome do filme a ser buscado (ex: "Inception")
     * @returns Promise com as informações do filme { title: string, plot: string }
     * @throws Error se o filme não for encontrado ou houver erro na API
     */
    static async getMovieInfo(movieName: string): Promise<MovieInfo> {
        // PASSO 1: Busca o filme na API OMDB externa
        // fetchMovie() faz uma requisição GET para http://www.omdbapi.com/
        // Retorna OmdbMovieResponse com { Title, Plot, Response, Error }
        const rawMovie = await fetchMovie(movieName);
        
        // PASSO 2: Converte o formato da API (PascalCase) para formato interno (camelCase)
        // A API OMDB retorna "Title" e "Plot", mas nossa aplicação usa "title" e "plot"
        return {
            title: rawMovie.Title,  // Converte Title → title
            plot: rawMovie.Plot     // Converte Plot → plot (ainda em inglês)
        };
    }

    /**
     * Traduz o plot de um filme do inglês para português
     * 
     * PROCESSO:
     * 1. Extrai o plot do movieInfo (que está em inglês)
     * 2. Chama fetchTranslation() que faz requisição POST para serviço de tradução
     * 3. Recebe o texto traduzido
     * 4. Retorna Translation com o texto em português
     * 
     * @param movieInfo - Objeto contendo as informações do filme (incluindo o plot em inglês)
     * @returns Promise com { translatedText: string } - plot traduzido para português
     * @throws Error se o serviço de tradução não estiver disponível ou houver erro
     */
    static async getTranslation(
        movieInfo: MovieInfo
    ): Promise<Translation>
    {
        // PASSO 1: Envia o plot do filme (em inglês) para o serviço de tradução
        // fetchTranslation() faz uma requisição POST para http://localhost:5000/translate
        // O serviço de tradução recebe o texto em inglês e retorna em português
        const translated = await fetchTranslation(movieInfo.plot);
        
        // PASSO 2: Retorna o resultado da tradução
        // Retorna { translatedText: "plot traduzido para português" }
        return translated;
    }
}

export default MovieService;