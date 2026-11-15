import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useWatchlist } from "../context/WatchlistContext";

function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <div className="watchlist-page">
      <Navbar />

      <main className="watchlist-content">
        <div className="page-header">
          <p className="section-label">
            YOUR COLLECTION
          </p>

          <h1>My Watchlist</h1>

          <p>
            Movies you have saved to watch later.
          </p>
        </div>

        {watchlist.length > 0 ? (
          <div className="movie-grid">
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <div className="empty-watchlist">

            <div className="empty-icon">
              🎬
            </div>

            <h2>
              Your watchlist is empty
            </h2>

            <p>
              Start adding movies you want to watch later.
            </p>

            <Link
              to="/movies"
              className="primary-btn"
            >
              Browse Movies
            </Link>

          </div>
        )}
      </main>
    </div>
  );
}

export default Watchlist;