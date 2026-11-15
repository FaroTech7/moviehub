const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
  },
};

export async function getPopularMovies() {
  const response = await fetch(
    `${BASE_URL}/movie/popular?language=en-US&page=1`,
    options
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
}