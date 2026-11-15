import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

function Search() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD MOVIES FROM BACKEND
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/movies"
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

  const filteredMovies = movies.filter((movie) =>
    movie.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="search-page">
      <Navbar />

      <main className="search-content">

        <div className="search-header">

          <p className="section-label">
            SEARCH MOVIEHUB
          </p>

          <h1>
            Find Your Next Movie
          </h1>

          <p>
            Search through our movie collection.
          </p>

        </div>

        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

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

        {!loading && !error && search && (
          <p className="search-results">
            {filteredMovies.length} movie
            {filteredMovies.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>
        )}

        {!loading &&
          !error &&
          filteredMovies.length > 0 && (
            <div className="movie-grid">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                />
              ))}
            </div>
          )}

        {!loading &&
          !error &&
          filteredMovies.length === 0 && (
            <div className="no-results">

              <h2>
                No movies found
              </h2>

              <p>
                Try searching for another movie.
              </p>

            </div>
          )}

      </main>
    </div>
  );
}

export default Search;