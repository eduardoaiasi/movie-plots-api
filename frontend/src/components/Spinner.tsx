/**
 * Componente de loading (spinner)
 * Exibe uma animação de carregamento enquanto uma requisição está em andamento
 */

/**
 * Componente que renderiza um spinner de carregamento
 * Usa Tailwind CSS para estilização e animação
 * @returns Elemento div com animação de rotação
 */
export function Spinner() {
  return (
    <div
      className="w-5 h-5 border-2 border-white border-t-transparent
                 rounded-full animate-spin"
      aria-label="Loading"
    />
  );
}
