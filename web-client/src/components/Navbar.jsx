import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import logo from "../assets/zoqira_logo.png";
import "./Navbar.css";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className="zq-navbar">
      <div className="zq-container">
        <div className="zq-left">
          <Link to="/" className="zq-brand">
            <img src={logo} alt="ZOQIRA" className="zq-logo" />
            <span className="zq-title">
              <span className="zq-accent" />
              ZOQIRA
            </span>
          </Link>
        </div>

        <div className="zq-center">
          <NavLink
            to="/"
            className={({ isActive }) => `zq-link ${isActive ? "active" : ""}`}
          >
            HOME
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `zq-link ${isActive ? "active" : ""}`}
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `zq-link ${isActive ? "active" : ""}`}
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `zq-link ${isActive ? "active" : ""}`}
          >
            PROFILE
          </NavLink>
        </div>

        <div className="zq-right" ref={menuRef}>
          <button
            className="zq-hamburger"
            aria-label="menu"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((s) => !s);
            }}
          >
            <span />
            <span />
            <span />
          </button>

          {menuOpen && (
            <div className="zq-menu">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `zq-menu-item ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `zq-menu-item ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `zq-menu-item ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `zq-menu-item ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>
              {isAuthenticated ? (
                <button
                  className="zq-menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `zq-menu-item ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `zq-menu-item ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
