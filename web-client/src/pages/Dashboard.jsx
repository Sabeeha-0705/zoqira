import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="zq-dashboard-root">
      <div className="zq-dashboard-inner">
        <h1 className="zq-dashboard-title">Dashboard</h1>

        <div className="zq-welcome-card">
          <h2>Welcome, {user?.name}!</h2>
          <p className="zq-small">Email: {user?.email}</p>
          <p className="zq-small">Role: {user?.role}</p>
          <p className="zq-welcome-desc">
            This is your personalized learning space in ZOQIRA.
          </p>
        </div>

        <div className="zq-grid">
          <div className="zq-feature-card">
            <h3>Aptitude Practice</h3>
            <p>Maths, Logical & Verbal Skills.</p>
            <button
              className="zq-btn-black"
              onClick={() => navigate("/aptitude")}
            >
              Start
            </button>
          </div>

          <div className="zq-feature-card">
            <h3>Communication Coach</h3>
            <p>Improve speaking, fluency, & interviews.</p>
            <button
              className="zq-btn-black"
              onClick={() => navigate("/communication")}
            >
              Start
            </button>
          </div>

          <div className="zq-feature-card">
            <h3>Programming Practice</h3>
            <p>Coding & Technical Skills (Coming Soon).</p>
            <button
              className="zq-btn-black"
              onClick={() => alert("Programming module coming soon!")}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  info: {
    marginTop: "2rem",
    padding: "1rem",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  },
  highlightCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f0f4ff",
  },
  ctaButton: {
    marginTop: "1.5rem",
    padding: "0.75rem 1.25rem",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    textAlign: "center",
  },
};

export default Dashboard;
