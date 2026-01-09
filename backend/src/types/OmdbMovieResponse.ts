/**
 * Interface que representa a resposta bruta da API OMDB
 * Mantém a estrutura original da API (PascalCase) antes da transformação
 */
export interface OmdbMovieResponse {
  Title: string;                    // Título do filme (formato da API OMDB)
  Plot: string;                     // Sinopse do filme (formato da API OMDB)
  Response: "True" | "False";      // Indica se a busca foi bem-sucedida
  Error?: string;                   // Mensagem de erro, se houver
}
