import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  // MongoDB uses _id instead of the old numeric id
  const movieId = movie._id || movie.id;

  return (
    <Link
      to={`/movie/${movieId}`}
      className="movie-card"
    >
      <div className="poster-wrapper">

        <img
          src={imageUrl}
          alt={movie.title}
        />

        <div className="movie-overlay">
          <button
            onClick={(e) => e.preventDefault()}
          >
            ▶
          </button>
        </div>

      </div>

      <div className="movie-info">

        <h3>{movie.title}</h3>

        <div className="movie-meta">
          <span>
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>

          <span>
            {movie.release_date?.slice(0, 4)}
          </span>
        </div>

      </div>
    </Link>
  );
}

export default MovieCard;