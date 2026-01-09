import { useState } from "react";
import { fetchMovie } from "../services/api";
import { Spinner } from "./Spinner";


export function MovieSearch() {
  const [movie, setMovie] = useState("");
  const [plot, setPlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!movie.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setPlot(null);

      const translatedPlot = await fetchMovie(movie);
      setPlot(translatedPlot);
    } catch {
      setError("Erro ao buscar o filme");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-zinc-800 rounded-xl shadow-lg p-6 space-y-6">
        
        <h1 className="text-3xl font-bold text-center text-white">
          🎬 Movie Plots
        </h1>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Digite o nome do filme"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            className="w-full rounded-lg px-4 py-3 bg-zinc-700 text-white
                       placeholder-zinc-400 focus:outline-none
                       focus:ring-2 focus:ring-indigo-500"
          />

         <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500
             disabled:opacity-50 disabled:cursor-not-allowed
             text-white font-semibold py-3 rounded-lg
             transition-colors flex items-center justify-center"
>
            {loading ? <Spinner /> : "Buscar"}
          </button>

        </div>

        {error && (
          <p className="text-red-400 text-center font-medium">
            {error}
          </p>
        )}

       {plot && (
          <div
            className="bg-zinc-700 rounded-lg p-4
                      transform transition-all duration-700 ease-out
                      opacity-100 translate-y-0"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Plot traduzido
            </h3>
            <p className="text-zinc-200 leading-relaxed">
              {plot}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
