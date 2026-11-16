const express = require("express");

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({
    message: "TMDB routes are working!"
  });
});
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// FETCH MOVIES FROM TMDB
async function fetchTMDB(endpoint) {
  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB error: ${response.status}`);
  }

  return response.json();
}

// POPULAR MOVIES
router.get("/popular", async (req, res) => {
  try {
    const data = await fetchTMDB("/movie/popular");

    res.json(data.results);
  } catch (error) {
    console.error("Popular movies error:", error.message);

    res.status(500).json({
      message: "Could not fetch popular movies",
    });
  }
});

// TRENDING MOVIES
router.get("/trending", async (req, res) => {
  try {
    const data = await fetchTMDB("/trending/movie/week");

    res.json(data.results);
  } catch (error) {
    console.error("Trending movies error:", error.message);

    res.status(500).json({
      message: "Could not fetch trending movies",
    });
  }
});

// TOP RATED MOVIES
router.get("/top-rated", async (req, res) => {
  try {
    const data = await fetchTMDB("/movie/top_rated");

    res.json(data.results);
  } catch (error) {
    console.error("Top rated movies error:", error.message);

    res.status(500).json({
      message: "Could not fetch top rated movies",
    });
  }
});

// UPCOMING MOVIES
router.get("/upcoming", async (req, res) => {
  try {
    const data = await fetchTMDB("/movie/upcoming");

    res.json(data.results);
  } catch (error) {
    console.error("Upcoming movies error:", error.message);

    res.status(500).json({
      message: "Could not fetch upcoming movies",
    });
  }
});
// SEARCH MOVIES
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.json([]);
    }

    const data = await fetchTMDB(
      `/search/movie?query=${encodeURIComponent(query)}`
    );

    res.json(data.results);
  } catch (error) {
    console.error("Movie search error:", error.message);

    res.status(500).json({
      message: "Could not search movies",
    });
  }
});
// MOVIES BY GENRE
router.get("/genre/:id", async (req, res) => {
  try {
    const genreId = req.params.id;

    const data = await fetchTMDB(
      `/discover/movie?with_genres=${encodeURIComponent(genreId)}`
    );

    res.json(data.results);
  } catch (error) {
    console.error("Genre movies error:", error.message);

    res.status(500).json({
      message: "Could not fetch genre movies",
    });
  }
});
module.exports = router;