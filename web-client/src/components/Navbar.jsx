import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          ZOQIRA
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>
              <Link to="/aptitude" style={styles.link}>
                Aptitude
              </Link>
              <Link to="/communication" style={styles.link}>
                Communication
              </Link>
              <button onClick={logout} style={styles.button}>
                Logout
              </button>
              <span style={styles.user}>👤 {user?.name}</span>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#1a1a1a",
    padding: "1rem 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    transition: "color 0.3s",
  },
  button: {
    backgroundColor: "#ff4444",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  user: {
    color: "#fff",
  },
};

export default Navbar;
