import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const WatchlistContext = createContext();

const API_URL = "http://localhost:5000/api/watchlist";

export function WatchlistProvider({ children }) {
  const { user } = useAuth();

  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // LOAD WATCHLIST
  useEffect(() => {
    const loadWatchlist = async () => {
      if (!user) {
        setWatchlist([]);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setWatchlist([]);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load watchlist"
          );
        }

        setWatchlist(data.movies || []);
      } catch (error) {
        console.error(
          "Load watchlist error:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, [user]);

  // SAVE WATCHLIST
  const saveWatchlist = async (movies) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movies,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save watchlist"
        );
      }

      return true;
    } catch (error) {
      console.error(
        "Save watchlist error:",
        error.message
      );

      return false;
    }
  };

  // ADD MOVIE
  const addToWatchlist = async (movie) => {
    const movieId = String(movie.id);

    const alreadyExists = watchlist.some(
      (item) => String(item.id) === movieId
    );

    if (alreadyExists) {
      return;
    }

    const updated = [...watchlist, movie];

    setWatchlist(updated);

    await saveWatchlist(updated);
  };

  // REMOVE MOVIE
  const removeFromWatchlist = async (movieId) => {
    const updated = watchlist.filter(
      (movie) =>
        String(movie.id) !== String(movieId)
    );

    setWatchlist(updated);

    await saveWatchlist(updated);
  };

  // CHECK MOVIE
  const isInWatchlist = (movieId) => {
    return watchlist.some(
      (movie) =>
        String(movie.id) === String(movieId)
    );
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        loading,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
