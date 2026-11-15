const mongoose = require("mongoose");
require("dotenv").config();

const Movie = require("./models/Movie");

const movies = [
  {
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 8.5,
    release_date: "2008-07-18",
    genre: "Action",
    description:
      "When Gotham faces a new threat, Batman must confront his greatest challenge.",
    trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
  },

  {
    title: "Inception",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    vote_average: 8.4,
    release_date: "2010-07-16",
    genre: "Sci-Fi",
    description:
      "A skilled thief enters the world of dreams for an impossible mission.",
    trailer_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
  },

  {
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    vote_average: 8.6,
    release_date: "2014-11-07",
    genre: "Sci-Fi",
    description:
      "A journey beyond the stars to find a future for humanity.",
    trailer_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
  },

  {
    title: "Avengers: Endgame",
    poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    vote_average: 8.2,
    release_date: "2019-04-26",
    genre: "Action",
    description:
      "The Avengers unite for one final attempt to restore the universe.",
    trailer_url: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
  },

  {
    title: "Spider-Man: No Way Home",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    vote_average: 8.0,
    release_date: "2021-12-15",
    genre: "Action",
    description:
      "Peter Parker faces unexpected challenges when different worlds collide.",
    trailer_url: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
  },

  {
    title: "Dune: Part Two",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    vote_average: 8.2,
    release_date: "2024-02-27",
    genre: "Sci-Fi",
    description:
      "Paul Atreides joins the Fremen on an extraordinary journey across Arrakis.",
    trailer_url: "https://www.youtube.com/watch?v=Way9Dexny3w",
  },

  {
    title: "Oppenheimer",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    vote_average: 8.3,
    release_date: "2023-07-19",
    genre: "Drama",
    description:
      "The story of the scientist behind one of history's most consequential inventions.",
    trailer_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
  },

  {
    title: "The Matrix",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    vote_average: 8.2,
    release_date: "1999-03-30",
    genre: "Sci-Fi",
    description:
      "A hacker discovers that the world around him is not what it seems.",
    trailer_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
  },
];

async function seedMovies() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Movie.deleteMany({});

    await Movie.insertMany(movies);

    console.log(`${movies.length} movies added successfully`);

    await mongoose.connection.close();

    console.log("Database connection closed");
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

seedMovies();