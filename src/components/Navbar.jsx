import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        MovieHub
      </Link>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/movies" onClick={closeMenu}>
          Movies
        </Link>

        <Link to="/genres" onClick={closeMenu}>
          Genres
        </Link>

        {user && (
  <Link to="/watchlist" onClick={closeMenu}>
    Watchlist
  </Link>
)}

        <Link
          to="/search"
          className="search-link"
          onClick={closeMenu}
        >
          🔍
        </Link>

        {user ? (
          <div className="nav-user">
            <Link
  to="/profile"
  className="nav-username"
  onClick={closeMenu}
>
  Hi, {user.name}
</Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-nav">
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>

            <Link
              to="/signup"
              className="signup-nav-button"
              onClick={closeMenu}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
    </nav>
  );
}

export default Navbar;