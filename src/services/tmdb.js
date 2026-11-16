const BASE_URL = "https://moviehub-1ke6.onrender.com/api/tmdb";

export async function getPopularMovies() {
  const response = await fetch(`${BASE_URL}/popular`);

  if (!response.ok) {
    throw new Error("Failed to fetch popular movies");
  }

  return response.json();
}

export async function getTrendingMovies() {
  const response = await fetch(`${BASE_URL}/trending`);

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies");
  }

  return response.json();
}

export async function getTopRatedMovies() {
  const response = await fetch(`${BASE_URL}/top-rated`);

  if (!response.ok) {
    throw new Error("Failed to fetch top rated movies");
  }

  return response.json();
}

export async function getUpcomingMovies() {
  const response = await fetch(`${BASE_URL}/upcoming`);

  if (!response.ok) {
    throw new Error("Failed to fetch upcoming movies");
  }

  return response.json();
}