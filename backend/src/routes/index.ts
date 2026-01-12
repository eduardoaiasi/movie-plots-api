/**
 * Configuração central de rotas da aplicação
 * Este arquivo é responsável por organizar e registrar todas as rotas da API
 * 
 * Estrutura:
 * - Define rotas globais (como a rota raiz "/")
 * - Registra routers específicos (como movieRoutes)
 * - Configura middlewares globais
 */

import {Express, json} from 'express';
import movieRoutes from './movieRoute'; // Importando o router de filmes
import { uptime } from 'node:process';

/**
 * Função que configura todas as rotas da aplicação
 * Esta função é chamada em app.ts para registrar todas as rotas no Express
 * 
 * @param app - Instância do Express onde as rotas serão registradas
 */
const routes = (app: Express) => {
    // Middleware para parsear JSON nas requisições
    // Permite que o Express entenda automaticamente o corpo das requisições em JSON
    app.use(json());

    //Rota HEALTH CHECK, para verificar se o servidor está ativo, monitoramento e deploy em produção.
    app.get("/health", (_req, res) => {
        res.status(200).json({ 
            status: "OK",
            service: "movie-plots-api",
            timestamp: new Date().toISOString(), // Data e hora atuais em formato ISO
            uptime: uptime() // Tempo em segundos desde que o processo foi iniciado 
        });
    });

    // Rota raiz da aplicação - endpoint de teste/health check
    // Útil para verificar se o servidor está rodando
    // Exemplo: GET http://localhost:3000/
    app.get("/", (_req, res) => {
        res.status(200).json({ 
            message: "Rota inicial" 
        });
    });

    // Registra as rotas relacionadas a filmes no caminho /movie
    // Todas as rotas definidas em movieRoute.ts serão acessíveis em /movie/*
    // Exemplo: /movie/search será acessível em /movie/search
    app.use('/movie', movieRoutes);
};

export default routes;