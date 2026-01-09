/**
 * Serviço de API do frontend
 * Responsável por fazer requisições HTTP para o backend
 */

import type { MovieResponse } from "../types/MovieResponse";

// URL base do backend (servidor Express)
const BASE_URL = "http://localhost:3000";

/**
 * Busca informações de um filme no backend
 * @param movieName - Nome do filme a ser buscado
 * @returns Promise com as informações do filme (título e plot traduzido)
 * @throws Error se a requisição falhar
 */
export async function fetchMovie(
  movieName: string
): Promise<MovieResponse> {
  // Faz uma requisição GET para o endpoint de busca do backend
  // encodeURIComponent garante que caracteres especiais no nome do filme sejam codificados corretamente
  const response = await fetch(
    `${BASE_URL}/movie/search?movie=${encodeURIComponent(movieName)}`
  );

  // Verifica se a resposta foi bem-sucedida
  if (!response.ok) {
    // Tenta obter a mensagem de erro do backend
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Erro ao buscar filme: ${response.status}`;
    throw new Error(errorMessage);
  }

  // Converte a resposta para JSON e retorna
  const data = await response.json();
  return data;
}
