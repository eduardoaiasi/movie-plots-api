/**
 * Configuração central de rotas da aplicação
 * Registra todos os middlewares e rotas da aplicação
 */

import {Express, json} from 'express';
import movieRoutes from './movieRoute'; // Importando o router de filmes

/**
 * Função que configura todas as rotas da aplicação
 * @param app - Instância do Express onde as rotas serão registradas
 */
const routes = (app: Express) => {
    // Middleware para parsear JSON nas requisições
    app.use(json());

    // Rota raiz da aplicação - retorna uma mensagem de boas-vindas
    app.get("/", (_req, res) => {
        res.status(200).json({ 
            message: "Rota inicial" 
        });
    });

    // Registra as rotas relacionadas a filmes no caminho /movie
    // Agora o 'movie' (que é o router) está sendo registrado
    app.use('/movie', movieRoutes);
};

export default routes;