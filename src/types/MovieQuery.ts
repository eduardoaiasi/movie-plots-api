/**
 * Interface que define a estrutura da query string para busca de filmes
 * Usada para tipar os parâmetros de query nas requisições HTTP
 */
interface MovieQuery {
    movie: string;  // Nome do filme a ser buscado
}