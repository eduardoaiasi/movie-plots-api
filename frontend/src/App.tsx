/**
 * Componente raiz da aplicação React
 * Renderiza o componente principal de busca de filmes
 */

import { MovieSearch } from "./components/MovieSearch";

/**
 * Componente principal da aplicação
 * @returns Componente MovieSearch que contém toda a interface da aplicação
 */
function App() {
  return <MovieSearch />;
}

export default App;
