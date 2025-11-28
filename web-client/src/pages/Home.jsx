import logo from "../assets/zoqira_logo.png";
import hero from "../assets/hero_illustration.png";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  // allow user-supplied student image if present, else fallback to hero
  let studentImage = hero;
  try {
    // prefer a student image if available
    // eslint-disable-next-line global-require, import/no-dynamic-require
    studentImage = require("../assets/student_grad.png");
  } catch (e) {
    studentImage = hero;
  }

  const nextSlide = () => setSlide((s) => (s + 1) % 3);
  const prevSlide = () => setSlide((s) => (s - 1 + 3) % 3);

  return (
    <div className="zq-home-root zq-home-animated">
      <div className="zq-bg-shape top-left" aria-hidden />
      <div className="zq-bg-shape bottom-right" aria-hidden />

      {/* global Navbar (single) will be rendered by Layout - remove internal header to avoid duplication */}

      <main className="zq-hero-wrap">
        <div className="zq-hero-box">
          <div className="zq-hero-left zq-entrance-left">
            <div className="zq-kicker">BEST ONLINE COURSES</div>
            <h1 className="zq-hero-head">The Best Online Learning Platform</h1>
            <p className="zq-hero-desc">
              Learn industry-grade IT skills with hands-on practice, real-world
              projects, and expert mentors. Start your career growth today with
              structured paths and instant feedback.
            </p>

            <div className="zq-hero-ctas">
              <button
                className="zq-btn-ghost"
                onClick={() => navigate("/about")}
              >
                Read More
              </button>
              <button
                className="zq-btn-primary"
                onClick={() => navigate("/register")}
              >
                Join Now
              </button>
            </div>
          </div>

          <div className="zq-hero-right zq-entrance-right">
            <div className={`zq-hero-stage slide-${slide}`}>
              <img
                src={studentImage}
                alt="student"
                className="zq-student-img"
              />
              <div className="zq-student-overlay" />
              <button
                className="zq-nav-arrow left"
                onClick={prevSlide}
                aria-label="previous"
              >
                ‹
              </button>
              <button
                className="zq-nav-arrow right"
                onClick={nextSlide}
                aria-label="next"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </main>
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
    fontSize: "3rem",
    marginBottom: "1rem",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "1.5rem",
    textAlign: "center",
    color: "#666",
    marginBottom: "2rem",
  },
  content: {
    textAlign: "center",
    padding: "2rem",
  },
};

export default Home;
