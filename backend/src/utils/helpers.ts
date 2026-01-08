/**
 * Funções auxiliares para formatação e transformação de dados
 */

import { MovieInfo } from "../types/MovieInfo";

// Interface que representa a estrutura bruta retornada pela API OMDB
interface omdbMovieRaw {
    Title: string;
    Plot: string;
}

/**
 * Formata o objeto retornado pela API OMDB para o formato usado na aplicação
 * Converte as propriedades de PascalCase (Title, Plot) para camelCase (title, plot)
 * 
 * @param json - Objeto bruto retornado pela API OMDB
 * @returns Objeto formatado no tipo MovieInfo
 */
export function formatMovieObject(json: omdbMovieRaw): MovieInfo 
{
  return ({
    title: json.Title,
    plot: json.Plot
  });
}