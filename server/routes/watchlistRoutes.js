const express = require("express");
const jwt = require("jsonwebtoken");
const Watchlist = require("../models/Watchlist");

const router = express.Router();

// AUTHENTICATION MIDDLEWARE
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// GET USER WATCHLIST
router.get("/", authenticateToken, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({
      user: req.userId,
    });

    res.status(200).json({
      movies: watchlist ? watchlist.movies : [],
    });

  } catch (error) {
    console.error("Get watchlist error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// SAVE USER WATCHLIST
router.put("/", authenticateToken, async (req, res) => {
  try {
    const { movies } = req.body;

    if (!Array.isArray(movies)) {
      return res.status(400).json({
        message: "Movies must be an array",
      });
    }

    // VALIDATE MOVIE DATA
    const validMovies = movies.every((movie) => {
      return (
        movie &&
        typeof movie.id === "string" &&
        movie.id.trim() !== "" &&
        typeof movie.title === "string" &&
        movie.title.trim() !== ""
      );
    });

    if (!validMovies) {
      return res.status(400).json({
        message: "Invalid movie data",
      });
    }

    // SAVE USER WATCHLIST
    const watchlist = await Watchlist.findOneAndUpdate(
      { user: req.userId },
      {
        user: req.userId,
        movies,
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Watchlist saved successfully",
      movies: watchlist.movies,
    });

  } catch (error) {
    console.error("Save watchlist error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;