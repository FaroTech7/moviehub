
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const BASE_URL = "https://moviehub-1ke6.onrender.com/api/tmdb";

function Search() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setMovies([]);
      setLoading(false);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${BASE_URL}/search?query=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Search failed");
        }

        setMovies(data);
      } catch (error) {
        console.error("Search error:", error.message);
        setError("Unable to search movies.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="search-page">
      <Navbar />

      <main className="search-content">
        <div className="search-header">
          <p className="section-label">
            SEARCH MOVIEHUB
          </p>

          <h1>Find Your Next Movie</h1>

          <p>
            Search millions of movies from around the world.
          </p>
        </div>

        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <div className="movies-status">
            Searching movies...
          </div>
        )}

        {error && (
          <div className="movies-status movies-error">
            {error}
          </div>
        )}

        {!loading && !error && search.trim() && (
          <p className="search-results">
            {movies.length} movie
            {movies.length !== 1 ? "s" : ""} found
          </p>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        )}

        {!loading && !error && search.trim() && movies.length === 0 && (
          <div className="no-results">
            <h2>No movies found</h2>
            <p>Try searching for another movie.</p>
          </div>
        )}

        {!search.trim() && (
          <div className="no-results">
            <h2>What are you looking for?</h2>
            <p>Enter a movie title to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Search;
