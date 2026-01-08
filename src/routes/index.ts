import {Express, json} from 'express';
import movieRoutes from './movieRoute'; // Importando o router de filmes

const routes = (app: Express) => {
    app.use(json());

    app.get("/", (_req, res) => {
        res.status(200).json({ 
            message: "Rota inicial" 
        });
    });

    // Agora o 'movie' (que é o router) está sendo registrado
    app.use('/movie', movieRoutes);
};

export default routes;