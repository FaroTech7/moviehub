const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    poster_path: {
      type: String,
      required: true,
    },

    vote_average: {
      type: Number,
      default: 0,
    },

    release_date: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    trailer_url: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);