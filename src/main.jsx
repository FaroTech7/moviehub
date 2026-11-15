import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import "./index.css";

import App from "./App";
import Movies from "./pages/Movies";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";
import Genres from "./pages/Genres";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import { WatchlistProvider } from "./context/WatchlistContext";
import { AuthProvider } from "./context/AuthContext";

function AnimatedPage({ children }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <App />
          </AnimatedPage>
        }
      />

      <Route
        path="/movies"
        element={
          <AnimatedPage>
            <Movies />
          </AnimatedPage>
        }
      />

      <Route
        path="/search"
        element={
          <AnimatedPage>
            <Search />
          </AnimatedPage>
        }
      />

      <Route
        path="/movie/:id"
        element={
          <AnimatedPage>
            <MovieDetails />
          </AnimatedPage>
        }
      />

      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <AnimatedPage>
              <Watchlist />
            </AnimatedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AnimatedPage>
              <Profile />
            </AnimatedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/genres"
        element={
          <AnimatedPage>
            <Genres />
          </AnimatedPage>
        }
      />

      <Route
        path="/login"
        element={
          <AnimatedPage>
            <Login />
          </AnimatedPage>
        }
      />

      <Route
        path="/signup"
        element={
          <AnimatedPage>
            <Signup />
          </AnimatedPage>
        }
      />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WatchlistProvider>
          <AppRoutes />
        </WatchlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);