const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");

const router = express.Router();

// GET ALL MOVIES
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({
      createdAt: -1,
    });

    res.status(200).json(movies);
  } catch (error) {
    console.error("Get movies error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET ONE MOVIE
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // CHECK IF ID IS VALID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid movie ID",
      });
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("Get movie error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;