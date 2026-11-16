import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useWatchlist } from "../context/WatchlistContext";

const TMDB_BASE_URL =
  "https://moviehub-1ke6.onrender.com/api/tmdb";

const MOVIE_API_URL =
  "https://moviehub-1ke6.onrender.com/api/movies";

function MovieDetails() {
  const { id } = useParams();

  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  } = useWatchlist();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);
      setError("");
      setMovie(null);
      setTrailer(null);

      try {
        // MongoDB ObjectId = 24 hexadecimal characters
        const isMongoId = /^[a-f\d]{24}$/i.test(id);

        if (isMongoId) {
          // OLD MONGODB MOVIE
          const response = await fetch(
            `${MOVIE_API_URL}/${id}`
          );

          if (!response.ok) {
            throw new Error("Movie not found");
          }

          const data = await response.json();

          setMovie({
            ...data,
            id: data._id,
          });

          return;
        }

        // TMDB MOVIE
        const movieResponse = await fetch(
          `${TMDB_BASE_URL}/movie/${id}`
        );

        if (!movieResponse.ok) {
          throw new Error("Movie not found");
        }

        const movieData = await movieResponse.json();

        setMovie(movieData);

        // Load trailer
        try {
          const videoResponse = await fetch(
            `${TMDB_BASE_URL}/movie/${id}/videos`
          );

          if (videoResponse.ok) {
            const videoData =
              await videoResponse.json();

            const trailerVideo =
              videoData.results?.find(
                (video) =>
                  video.site === "YouTube" &&
                  video.type === "Trailer"
              );

            setTrailer(trailerVideo || null);
          }
        } catch (videoError) {
          console.error(
            "Trailer error:",
            videoError.message
          );
        }
      } catch (err) {
        console.error(
          "Movie details error:",
          err.message
        );

        setError("Movie could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="movie-details">
          <div className="movie-details-container">
            <div className="loading">
              Loading movie...
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Navbar />

        <main className="movie-details">
          <div className="movie-details-container">
            <div className="error-message">
              <h2>Movie not found</h2>

              <Link to="/movies">
                Back to Movies
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const movieId = movie.id || movie._id;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : posterUrl;

  const saved = isInWatchlist(movieId);

  const handleWatchlist = async () => {
    if (saved) {
      await removeFromWatchlist(movieId);
    } else {
      await addToWatchlist({
        id: movieId,
        title: movie.title,
        poster_path: movie.poster_path || "",
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || "",
        description:
          movie.description ||
          movie.overview ||
          "",
        overview:
          movie.overview ||
          movie.description ||
          "",
      });
    }
  };

  return (
    <div className="movie-details-page">
      <Navbar />

      <div
        className="movie-backdrop"
        style={{
          backgroundImage: `linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0.95)
          ), url(${backdropUrl})`,
        }}
      />

      <main className="movie-details">
        <div className="movie-details-container">

          <div className="movie-details-card">

            <div className="movie-poster-section">
              <img
                src={posterUrl}
                alt={movie.title}
                className="movie-details-poster"
              />
            </div>

            <div className="movie-details-info">

              <p className="section-label">
                MOVIE DETAILS
              </p>

              <h1>{movie.title}</h1>

              <div className="movie-details-meta">
                <span>
                  ⭐{" "}
                  {movie.vote_average
                    ? movie.vote_average.toFixed(1)
                    : "N/A"}
                </span>

                <span>
                  {movie.release_date?.slice(0, 4)}
                </span>

                {movie.genre && (
                  <span>{movie.genre}</span>
                )}
              </div>

              <p className="movie-description">
                {movie.overview ||
                  movie.description ||
                  "No description available."}
              </p>

              <div className="movie-actions">

                <button
                  className="primary-btn"
                  onClick={handleWatchlist}
                >
                  {saved
                    ? "✓ Remove from Watchlist"
                    : "+ Add to Watchlist"}
                </button>

                <Link
                  to="/movies"
                  className="secondary-btn"
                >
                  Back to Movies
                </Link>

              </div>

            </div>
          </div>

          {trailer && (
            <section className="trailer-section">

              <p className="section-label">
                OFFICIAL TRAILER
              </p>

              <h2>Watch Trailer</h2>

              <div className="trailer-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${movie.title} trailer`}
                  allowFullScreen
                />
              </div>

            </section>
          )}

        </div>
      </main>
    </div>
  );
}

export default MovieDetails;