/**
 * Interface que representa a resposta da API OMDB para buscas
 * Usada para tipar as respostas da API externa
 */

import {MovieInfo} from './MovieInfo';

export interface OmdbSearchResponse {
    Search?: MovieInfo[];              // Array de filmes encontrados (opcional)
    totalResults?: string;              // Total de resultados encontrados (opcional)
    Response: "True" | "False";        // Indica se a busca foi bem-sucedida
    Error?: string;                    // Mensagem de erro, se houver (opcional)
}