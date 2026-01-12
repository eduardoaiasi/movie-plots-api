/**
 * Utilitário para conexão com APIs externas
 * Contém funções para buscar informações de filmes na API OMDB e traduzir textos
 */

import { MovieInfo } from "../types/MovieInfo";
import { OmdbMovieResponse } from "../types/OmdbMovieResponse";

/**
 * Busca informações de um filme na API OMDB (Open Movie Database)
 * @param movieName - Nome do filme a ser buscado
 * @returns Promise com as informações do filme (título e plot)
 * @throws Error se a requisição falhar ou o filme não for encontrado
 */
export async function fetchMovie(
    movieName: string
): Promise<OmdbMovieResponse> {
    // Constrói a URL da API OMDB com a chave de API e o nome do filme
    const URL = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${movieName}&plot=full`;

    // Faz a requisição HTTP para a API OMDB
    const res = await fetch(URL);

    //Adicionar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

    try{
      // Verifica se a resposta HTTP foi bem-sucedida
      if (!res.ok) 
      {
          throw new Error(`Erro ao buscar o filme: ${res.status}`);
      }

      // Converte a resposta para JSON
      const data = await res.json();

      // Verifica se a API retornou um erro (filme não encontrado, etc)
      if (data.Response === "False") 
      {
          throw new Error(data.Error || "Filme não encontrado");
      }

      // Retorna apenas os campos necessários (título e plot)
      return {
          Title: data.Title,
          Plot: data.Plot,
          Response: data.Response,
          Error: data.Error
      };
    }catch (error) {
      clearTimeout(timeoutId);
        if(error instanceof Error && error.name === 'AbortError'){
            throw new Error('Tempo de espera esgotado ao buscar o filme.Tente novamente.');
        }
      throw error;
  }
}

/**
 * Traduz um texto do inglês para português usando um serviço de tradução local
 * @param moviePlot - Texto do plot do filme em inglês a ser traduzido
 * @returns Promise com o texto traduzido
 * @throws Error se a requisição de tradução falhar
 */
export async function fetchTranslation(
  moviePlot: string
): Promise<{ translatedText: string }> {

  // URL do serviço de tradução (deve estar rodando localmente na porta 5000)
  const URL = `http://localhost:5000/translate`;

  // Faz uma requisição POST para o serviço de tradução
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      q: moviePlot,        // Texto a ser traduzido
      source: 'en',        // Idioma de origem: inglês
      target: 'pt',        // Idioma de destino: português
      format: 'text'       // Formato do texto
    })
  });

  // Verifica se a tradução foi bem-sucedida
  if (!res.ok) {
    throw new Error(`Erro na tradução: ${res.status}`);
  }

  // Retorna o resultado da tradução
  return res.json();
}
