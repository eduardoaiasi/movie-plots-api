import { useState } from "react";
import { fetchMovie } from "../services/api";

export function MovieSearch() {
  const [movie, setMovie] = useState("");
  const [plot, setPlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!movie.trim()) return;

    try {
      setLoading(true);
      setError("");
      const translatedPlot = await fetchMovie(movie);
      setPlot(translatedPlot);
    } catch {
      setError("Erro ao buscar o filme");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>🎬 Movie Plots</h1>

      <input
        type="text"
        placeholder="Digite o nome do filme"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <button onClick={handleSearch} style={{ marginTop: 10 }}>
        Buscar
      </button>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {plot && (
        <div style={{ marginTop: 20 }}>
          <h3>Plot traduzido</h3>
          <p>{plot}</p>
        </div>
      )}
    </div>
  );
}
