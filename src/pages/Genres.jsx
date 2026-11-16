
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const genres = [
  { name: "All", id: null },
  { name: "Action", id: 28 },
  { name: "Adventure", id: 12 },
  { name: "Drama", id: 18 },
  { name: "Sci-Fi", id: 878 },
  { name: "Thriller", id: 53 },
  { name: "Crime", id: 80 },
  { name: "Fantasy", id: 14 },
  { name: "History", id: 36 },
];

const BASE_URL = "https://moviehub-1ke6.onrender.com/api/tmdb";

function Genres() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(genres[0]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const endpoint = selectedGenre.id === null
          ? `${BASE_URL}/popular`
          : `${BASE_URL}/genre/${selectedGenre.id}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to load genre movies");
        }

        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Genre error:", error.message);
        setError("Unable to load movies.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  return (
    <div className="genres-page">
      <Navbar />

      <main className="genres-content">
        <div className="page-header">
          <p className="section-label">EXPLORE BY GENRE</p>

          <h1>Movie Genres</h1>

          <p>
            Find movies based on the kind of story you want to watch.
          </p>
        </div>

        <div className="genre-list">
          {genres.map((genre) => (
            <button
              key={genre.name}
              className={
                selectedGenre.name === genre.name
                  ? "genre-btn active"
                  : "genre-btn"
              }
              onClick={() => setSelectedGenre(genre)}
            >
              {genre.name}
            </button>
          ))}
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
          <div className="genre-results">
            <h2>{selectedGenre.name} Movies</h2>

            {movies.length > 0 ? (
              <div className="movie-grid">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h2>No movies found</h2>
                <p>Try selecting another genre.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Genres;
