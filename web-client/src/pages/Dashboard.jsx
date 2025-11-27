import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>Welcome, {user?.name}!</h2>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
          <div style={styles.info}>
            <p>
              This is a protected page. Only authenticated users can see this.
            </p>
            <p>Dashboard content to be implemented.</p>
          </div>
        </div>
        <div style={{ ...styles.card, ...styles.highlightCard }}>
          <h3>Aptitude Practice</h3>
          <p>
            Test your Quantitative, Logical, and Verbal skills with curated
            aptitude questions.
          </p>
          <Link to="/aptitude" style={styles.ctaButton}>
            Start Aptitude Practice
          </Link>
        </div>
        <div style={{ ...styles.card, ...styles.highlightCard }}>
          <h3>Communication Coach</h3>
          <p>
            Practice English speaking with an AI tutor. Improve your fluency,
            interview skills, and technical communication.
          </p>
          <Link to="/communication" style={styles.ctaButton}>
            Start Communication Practice
          </Link>
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
