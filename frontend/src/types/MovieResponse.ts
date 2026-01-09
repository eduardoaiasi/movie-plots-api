/**
 * Interface que representa a resposta da API do backend
 * Define a estrutura dos dados retornados quando uma busca de filme é bem-sucedida
 */
export interface MovieResponse {
  title: string;  // Título do filme
  plot: string;    // Plot/sinopse do filme traduzido para português
}
