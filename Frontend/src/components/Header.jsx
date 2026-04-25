import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Get initials for user avatar circle
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) return <header className="header">Loading...</header>;

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">⚡ PrepAI</Link>
      </div>

      <nav className="nav">
        {!user ? (
          <>
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        ) : (
          <div className="user-menu" ref={dropdownRef}>
            <span
              className="user-initials"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {getInitials(user.name)}
            </span>

            {dropdownOpen && (
              <div className="dropdown">
                <span className="dropdown-greet">👋 Hello, {user.name}</span>
                <Link to="/profile">Profile</Link>
                <Link to="/department">Department / Post</Link>
                <Link to="/results">Results</Link>
                <Link to="/reset-password">Reset Password</Link>
                <span className="logout" onClick={handleLogout}>Logout</span>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
