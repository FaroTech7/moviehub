const mongoose = require("mongoose");
require("dotenv").config();

const Watchlist = require("./models/Watchlist");

async function clearWatchlists() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const result = await Watchlist.deleteMany({});

    console.log(
      `${result.deletedCount} watchlist(s) deleted`
    );

    await mongoose.connection.close();

    console.log("Database connection closed");
  } catch (error) {
    console.error(
      "Clear watchlist error:",
      error.message
    );

    process.exit(1);
  }
}

clearWatchlists();