import {fetchMovie, fetchTranslation} from '../utils/apiConnect';
import { MovieInfo } from '../types/MovieInfo';
import { Translation } from '../types/translation';

class MovieService {
    static async getMovieInfo(movieName: string): Promise<MovieInfo> {
        const rawMovie = await fetchMovie(movieName);
        return {
            title: rawMovie.title,
            plot: rawMovie.plot
        };
    }

    static async getTranslation(
        movieInfo: MovieInfo
    ): Promise<Translation>
    {
        const translated = await fetchTranslation(movieInfo.plot);
        return translated;
    }
}

export default MovieService;