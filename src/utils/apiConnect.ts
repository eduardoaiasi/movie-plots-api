import { MovieInfo } from "../types/MovieInfo";

export async function fetchMovie(
    movieName: string
): Promise<MovieInfo> {
    const URL = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${movieName}&plot=full`;

    const res = await fetch(URL);

    if (!res.ok) 
    {
        throw new Error(`Erro ao buscar o filme: ${res.status}`);
    }

    const data = await res.json();

    if (data.Response === "False") 
    {
        throw new Error(data.Error || "Filme não encontrado");
    }

     return {
        title: data.Title,
        plot: data.Plot,
    };

  
}

export async function fetchTranslation(
  moviePlot: string
): Promise<{ translatedText: string }> {

  const URL = `http://localhost:5000/translate`;

  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      q: moviePlot,
      source: 'en',
      target: 'pt',
      format: 'text'
    })
  });

  if (!res.ok) {
    throw new Error(`Erro na tradução: ${res.status}`);
  }

  return res.json();
}
