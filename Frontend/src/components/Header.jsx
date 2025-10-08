import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

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
        {!user && (
          <>
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
        {user && (
          <div className="user-menu" ref={dropdownRef}>
            <span
              className="user-initials"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {getInitials(user.name)}
            </span>
            {dropdownOpen && (
              <div className="dropdown">
                <span>Hello, {user.name}</span>
                <Link to="/department">Select Department/Post</Link>
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
