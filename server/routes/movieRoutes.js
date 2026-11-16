
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useWatchlist } from "../context/WatchlistContext";

const API_URL = "https://moviehub-1ke6.onrender.com/api";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  } = useWatchlist();

  const isMongoId = /^[a-f\d]{24}$/i.test(id);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setTrailerKey("");

        if (isMongoId) {
          const response = await fetch(
            `${API_URL}/movies/${id}`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to load movie"
            );
          }

          setMovie(data);
        } else {
          const [movieResponse, trailerResponse] =
            await Promise.all([
              fetch(`${API_URL}/tmdb/movie/${id}`),
              fetch(`${API_URL}/tmdb/movie/${id}/videos`),
            ]);

          if (!movieResponse.ok) {
            throw new Error("Failed to load movie details");
          }

          const movieData = await movieResponse.json();

          setMovie(movieData);

          if (trailerResponse.ok) {
            const videos = await trailerResponse.json();

            const trailer =
              videos.find(
                (video) =>
                  video.site === "YouTube" &&
                  video.type === "Trailer" &&
                  video.official
              ) ||
              videos.find(
                (video) =>
                  video.site === "YouTube" &&
                  video.type === "Trailer"
              ) ||
              videos.find(
                (video) => video.site === "YouTube"
              );

            setTrailerKey(trailer?.key || "");
          }
        }
      } catch (error) {
        console.error("Movie details error:", error);
        setError("Unable to load this movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, isMongoId]);

  if (loading) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="not-found">
          <h1>Loading Movie...</h1>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="not-found">
          <h1>Movie Not Found</h1>
          <p>{error}</p>
          <Link to="/movies">Back to Movies</Link>
        </div>
      </div>
    );
  }

  const movieId = isMongoId
    ? String(movie._id)
    : String(movie.id);

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : "";

  const description =
    movie.overview || movie.description || "No description available.";

  const saved = isInWatchlist(movieId);

  const handleWatchlist = () => {
    if (saved) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist({
        id: movieId,
        title: movie.title,
        poster_path: movie.poster_path || "",
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || "",
        description,
        overview: description,
      });
    }
  };

  return (
    <div className="details-page">
      <Navbar />

      <main className="details-container">
        <div className="details-poster">
          {imageUrl && (
            <img src={imageUrl} alt={movie.title} />
          )}
        </div>

        <div className="details-info">
          <p className="section-label">MOVIE DETAILS</p>

          <h1>{movie.title}</h1>

          <div className="details-meta">
            <span>
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>

            <span>
              {movie.release_date?.slice(0, 4)}
            </span>

            {movie.runtime > 0 && (
              <span>{movie.runtime} min</span>
            )}
          </div>

          {movie.genres?.length > 0 && (
            <div className="details-meta">
              {movie.genres.map((genre) => (
                <span key={genre.id || genre}>
                  {genre.name || genre}
                </span>
              ))}
            </div>
          )}

          <p className="details-description">
            {description}
          </p>

          <div className="details-actions">
            {!isMongoId && (
              <button
                className="primary-btn"
                onClick={() => setShowTrailer(true)}
              >
                ▶ Watch Trailer
              </button>
            )}

            <button
              className="secondary-btn"
              onClick={handleWatchlist}
            >
              {saved
                ? "✓ Remove from Watchlist"
                : "+ Add to Watchlist"}
            </button>
          </div>

          <Link to="/movies" className="back-link">
            ← Back to Movies
          </Link>
        </div>
      </main>

      {showTrailer && (
        <div
          className="trailer-modal"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="trailer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="trailer-close"
              onClick={() => setShowTrailer(false)}
              aria-label="Close trailer"
            >
              ✕
            </button>

            {trailerKey ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1`}
                title={`${movie.title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <p>Trailer unavailable for this movie.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
