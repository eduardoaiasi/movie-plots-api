/**
 * Componente principal de busca de filmes
 * Gerencia o estado da interface e faz a busca de filmes através da API
 */

import { useRef, useState } from "react";
import { fetchMovie } from "../services/api";
import { Spinner } from "./Spinner";

/**
 * Componente que renderiza a interface de busca de filmes
 * Permite ao usuário buscar um filme e exibe o título e plot traduzido
 */
export function MovieSearch() {
  // Estado para armazenar o nome do filme digitado pelo usuário
  const [movie, setMovie] = useState("");
  
  // Estado para armazenar o título do filme retornado pela API
  const [title, setTitle] = useState<string | null>(null);
  
  // Estado para armazenar o plot traduzido do filme
  const [plot, setPlot] = useState<string | null>(null);
  
  // Estado para controlar o loading durante a requisição
  const [loading, setLoading] = useState(false);
  
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState<string | null>(null);

  // Validão de input no frontend para evitar buscas vazias
  const [validationError, setValidationError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Função assíncrona que lida com a busca do filme
   * É chamada quando o usuário clica no botão "Buscar"
   */
    async function handleSearch() {
    // Valida se o campo não está vazio
   if (movie.trim().length < 2) {
     setValidationError("Digite pelo menos 2 caracteres");
     return;
    }

    setValidationError(null);

    // Salva o nome do filme antes de limpar (para poder tentar novamente em caso de erro)
    const movieToSearch = movie.trim();

    try {
      // Inicia o estado de loading e limpa estados anteriores
      setLoading(true);
      setError(null);
      setPlot(null);
      setTitle(null);

      // Faz a requisição para a API do backend
      const result = await fetchMovie(movieToSearch);
      
      // Atualiza os estados com os dados retornados
      setTitle(result.title);
      setPlot(result.plot);
      
      // Limpa o input apenas após busca bem-sucedida
      setMovie("");
    } catch (err) {
      // Tratamento de erros: extrai a mensagem de erro ou usa uma mensagem padrão
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar o filme";
      setError(errorMessage);
      console.error("Erro ao buscar filme:", err);
    } finally {
      // Sempre desativa o loading, independente de sucesso ou erro
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-zinc-800 rounded-xl shadow-lg p-6 space-y-6">
        
        <h1 className="text-3xl font-bold text-center text-white">
          🎬 Movie Plots
        </h1>

        <div className="space-y-3">
          <input
            ref={inputRef}
            autoFocus
            type="text"
            placeholder="Digite o nome do filme"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading && movie.trim()) {
                handleSearch();
              }
            }} 
            className="w-full rounded-lg px-4 py-3 bg-zinc-700 text-white
                       placeholder-zinc-400 focus:outline-none
                       focus:ring-2 focus:ring-indigo-500"
          />

          {validationError && (
            
            <p className="text-yellow-400 text-sm mt-1">{validationError}</p>
            
          )}
          
          <div className="flex justify-center">
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-indigo-400 font-medium">
                  <Spinner />
                  <span>Buscando filme...</span>
                </div>
              ) : (
                <button
                  onClick={handleSearch}
                  disabled={!movie.trim() || loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500
                            text-white font-semibold py-3 rounded-lg
                            transition-colors flex items-center justify-center"
                >
                  Buscar
                </button>
              )}
            </div>
          

        </div>

        {error && (
          <div>
            <p className="text-red-400 text-center font-medium">
              {error}
            </p>
          <button
            onClick={handleSearch}
            className="mt-3 w-full bg-red-600 hover:bg-red-500
                      text-white font-semibold py-3 rounded-lg
                      transition-colors flex items-center justify-center"
          >
            Tente novamente.
          </button>
          </div>
        )}

      {plot && (
        <div
          className="bg-zinc-700 rounded-lg p-4
                    transform transition-all duration-500 ease-out
                    opacity-100 translate-y-0"
        >
          <h2 className="text-2xl font-bold text-white mb-3 text-center">
            🎬 {title}
          </h2>

          <p className="text-zinc-200 leading-relaxed">
            {plot}
          </p>
        </div>
      )}
      </div>
    </div>
  );
}