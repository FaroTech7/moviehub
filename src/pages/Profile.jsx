import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { watchlist } = useWatchlist();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>Please Log In</h1>

          <p>
            You need to be logged in to view your profile.
          </p>

          <Link to="/login" className="primary-btn">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <p className="profile-label">YOUR PROFILE</p>

        <h1>{user.name}</h1>

        <p className="profile-email">
          {user.email}
        </p>

        <div className="profile-stats">
          <div className="profile-stat">
            <span>{watchlist.length}</span>
            <p>Watchlist Movies</p>
          </div>

          <div className="profile-stat">
            <span>✓</span>
            <p>Account Active</p>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/watchlist" className="primary-btn">
            View Watchlist
          </Link>

          <button
            className="logout-button profile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;