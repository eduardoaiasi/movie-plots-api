import { MovieInfo } from "../types/MovieInfo";

interface omdbMovieRaw {
    Title: string;
    Plot: string;
}

export function formatMovieObject(json: omdbMovieRaw): MovieInfo 
{
  return ({
    title: json.Title,
    plot: json.Plot
  });
}