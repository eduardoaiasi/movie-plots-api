const BASE_URL = "http://localhost:3000";

export async function fetchMovie(movieName: string): Promise<string> {
  const response = await fetch(
    `${BASE_URL}/movie/search?movie=${encodeURIComponent(movieName)}`
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar filme`);
  }

  const data: string = await response.json();
  return data;
}
