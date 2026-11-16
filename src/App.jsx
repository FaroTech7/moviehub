
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "./App.css";
import MovieCard from "./components/MovieCard";
import Navbar from "./components/Navbar";
import { getPopularMovies } from "./services/tmdb";

function App() {
  const carouselRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [featuredIndex, setFeaturedIndex] = useState(0);

  // LOAD POPULAR MOVIES FROM TMDB THROUGH OUR BACKEND
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

  // FEATURED MOVIE AUTO-SLIDER
  useEffect(() => {
    if (movies.length === 0) return;

    const timer = setInterval(() => {
      setFeaturedIndex(
        (current) => (current + 1) % movies.length
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [movies.length]);

  const slide = (direction) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 280,
        behavior: "smooth",
      });
    }
  };

  const changeFeatured = (direction) => {
    if (movies.length === 0) return;

    setFeaturedIndex(
      (current) =>
        (current + direction + movies.length) % movies.length
    );
  };

  const featuredMovie = movies[featuredIndex];

  return (
    <div className="app">
      <Navbar />

      <main>
        {/* HERO */}
        {!loading && !error && featuredMovie && (
          <section
            className="hero featured-hero"
            key={featuredMovie.id}
          >
            <div
              className="featured-backdrop"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path || featuredMovie.poster_path})`,
              }}
            />

            <div className="hero-content">
              <p className="hero-label">FEATURED MOVIE</p>

              <h1>{featuredMovie.title}</h1>

              <div className="featured-meta">
                <span>
                  ⭐ {featuredMovie.vote_average?.toFixed(1)}
                </span>

                <span>
                  {featuredMovie.release_date?.slice(0, 4)}
                </span>

                <span>HD</span>
              </div>

              <p className="hero-text">
                {featuredMovie.overview}
              </p>

              <div className="hero-buttons">
                <Link
                  to={`/movie/${featuredMovie.id}`}
                  className="primary-btn"
                >
                  View Details
                </Link>

                <Link
                  to="/movies"
                  className="secondary-btn"
                >
                  Explore Movies
                </Link>
              </div>

              <div className="featured-controls">
                <button
                  onClick={() => changeFeatured(-1)}
                  aria-label="Previous featured movie"
                >
                  &#8592;
                </button>

                <div className="featured-dots">
                  {movies.map((movie, index) => (
                    <button
                      key={movie.id}
                      className={
                        featuredIndex === index ? "active" : ""
                      }
                      onClick={() => setFeaturedIndex(index)}
                      aria-label={`Show ${movie.title}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => changeFeatured(1)}
                  aria-label="Next featured movie"
                >
                  &#8594;
                </button>
              </div>
            </div>
          </section>
        )}

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

        {/* POPULAR MOVIES */}
        {!loading && !error && (
          <section className="movies-section">
            <div className="section-header">
              <div>
                <p className="section-label">EXPLORE</p>
                <h2>Popular Movies</h2>
              </div>

              <div className="carousel-controls">
                <button onClick={() => slide(-1)}>
                  &#8592;
                </button>

                <button onClick={() => slide(1)}>
                  &#8594;
                </button>
              </div>
            </div>

            <div
              className="movie-carousel"
              ref={carouselRef}
            >
              {movies.map((movie) => (
                <div
                  className="carousel-card"
                  key={movie.id}
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
