import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useWatchlist } from "../context/WatchlistContext";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  } = useWatchlist();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `https://moviehub-1ke6.onrender.com/api/movies/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load movie"
          );
        }

        setMovie(data);
      } catch (error) {
        console.error(
          "Fetch movie error:",
          error.message
        );

        setError("Unable to load this movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

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

          <Link to="/movies">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl =
    `https://image.tmdb.org/t/p/w780${movie.poster_path}`;

  // MongoDB movie ID
  const movieId = movie._id;

  const saved = isInWatchlist(movieId);

  const handleWatchlist = () => {
    if (saved) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist({
        id: movieId,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        description: movie.description,
      });
    }
  };

  return (
    <div className="details-page">
      <Navbar />

      <main className="details-container">

        <div className="details-poster">
          <img
            src={imageUrl}
            alt={movie.title}
          />
        </div>

        <div className="details-info">

          <p className="section-label">
            MOVIE DETAILS
          </p>

          <h1>{movie.title}</h1>

          <div className="details-meta">

            <span>
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>

            <span>
              {movie.release_date?.slice(0, 4)}
            </span>

            <span>HD</span>

          </div>

          <p className="details-description">
            {movie.description}
          </p>

          <div className="details-actions">

            <button
              className="primary-btn"
              onClick={() =>
                setShowTrailer(true)
              }
            >
              ▶ Watch Trailer
            </button>

            <button
              className="secondary-btn"
              onClick={handleWatchlist}
            >
              {saved
                ? "✓ Remove from Watchlist"
                : "+ Add to Watchlist"}
            </button>

          </div>

          <Link
            to="/movies"
            className="back-link"
          >
            ← Back to Movies
          </Link>

        </div>

      </main>

      {/* TRAILER MODAL */}
      {showTrailer && (
        <div
          className="trailer-modal"
          onClick={() =>
            setShowTrailer(false)
          }
        >
          <div
            className="trailer-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="trailer-close"
              onClick={() =>
                setShowTrailer(false)
              }
              aria-label="Close trailer"
            >
              ✕
            </button>

            <iframe
              src={
                movie.trailer_url
                  ? `https://www.youtube-nocookie.com/embed/${
                      movie.trailer_url.split("v=")[1]
                    }?autoplay=1`
                  : ""
              }
              title={`${movie.title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />

          </div>
        </div>
      )}

    </div>
  );
}

export default MovieDetails;