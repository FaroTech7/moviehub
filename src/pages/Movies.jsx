
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getPopularMovies } from "../services/tmdb";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getPopularMovies();
        setMovies(data);
      } catch (error) {
        console.error("Fetch movies error:", error.message);
        setError("Unable to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="movies-page">
      <div className="page-header">
        <p className="section-label">MOVIEHUB</p>

        <h1>All Movies</h1>

        <p>
          Explore popular movies from around the world.
        </p>
      </div>

      {loading && (
        <div className="movies-status">
          Loading movies...
        </div>
      )}

      {error && (
        <div className="movies-status movies-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;
