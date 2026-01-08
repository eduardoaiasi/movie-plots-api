import { Request } from 'express';
import MovieService from '../services/MovieService';
import { Response } from 'express';

interface MovieQuery {
    movie: string;
}

class MovieController {
    static async getMoviePlot(
        req: Request<{}, {}, {}, MovieQuery>,
        res: Response
    ) {
        try {
            const movieName = req.query.movie;

            if(!movieName){
                return  res.status(400).json({
                    message: "Movie é obrigatório" 
                });
            }

            const movieInfo = await MovieService.getMovieInfo(movieName);

            const translatedPlot = 
                await MovieService.getTranslation(movieInfo);

            return res
                .status(200)
                .json(translatedPlot.translatedText);

        }catch (error){
           if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
export default MovieController;