import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://moviehub-1ke6.onrender.com/api/movies"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load movies"
          );
        }

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
          Explore our collection of popular movies.
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
              key={movie._id}
              movie={movie}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;