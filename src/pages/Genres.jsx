import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const genres = [
  "All",
  "Action",
  "Adventure",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Crime",
  "Fantasy",
  "History",
];

function Genres() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD MOVIES FROM BACKEND
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
        console.error(
          "Fetch movies error:",
          error.message
        );

        setError("Unable to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // FILTER MOVIES BY GENRE
  const filteredMovies =
    selectedGenre === "All"
      ? movies
      : movies.filter(
          (movie) => movie.genre === selectedGenre
        );

  return (
    <div className="genres-page">
      <Navbar />

      <main className="genres-content">

        <div className="page-header">

          <p className="section-label">
            EXPLORE BY GENRE
          </p>

          <h1>Movie Genres</h1>

          <p>
            Find movies based on the kind of story you want to watch.
          </p>

        </div>

        {/* GENRE BUTTONS */}
        <div className="genre-list">

          {genres.map((genre) => (
            <button
              key={genre}
              className={
                selectedGenre === genre
                  ? "genre-btn active"
                  : "genre-btn"
              }
              onClick={() =>
                setSelectedGenre(genre)
              }
            >
              {genre}
            </button>
          ))}

        </div>

        {/* LOADING */}
        {loading && (
          <div className="movies-status">
            Loading movies...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="movies-status movies-error">
            {error}
          </div>
        )}

        {/* RESULTS */}
        {!loading && !error && (
          <div className="genre-results">

            <h2>
              {selectedGenre} Movies
            </h2>

            {filteredMovies.length > 0 ? (
              <div className="movie-grid">

                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                  />
                ))}

              </div>
            ) : (
              <div className="no-results">

                <h2>
                  No movies found
                </h2>

                <p>
                  There are no movies in this genre yet.
                </p>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}

export default Genres;