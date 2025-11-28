import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/UI/Input";
import Checkbox from "../components/UI/Checkbox";
import Button from "../components/UI/Button";
import "./Login.css";
import hero from "../assets/hero_illustration.png";
import logo from "../assets/zoqira_logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // client-side validation
    let ok = true;
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      ok = false;
    } else setEmailError("");

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      ok = false;
    } else setPasswordError("");

    if (!ok) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zq-login-root">
      <div className="zq-login-left">
        <div className="zq-hero-media">
          <img src={hero} alt="hero" className="zq-login-hero" />
          <div className="zq-gradient-overlay" />
          <div className="zq-float-icons" aria-hidden>
            <div className="fi">💻</div>
            <div className="fi">🌐</div>
            <div className="fi">🔐</div>
            <div className="fi">⚙️</div>
            <div className="fi">📶</div>
          </div>
        </div>
      </div>

      <div className="zq-login-right">
        <div className="zq-login-card zq-entrance">
          <img src={logo} alt="logo" className="zq-login-logo" />
          <h2 className="zq-login-title">Welcome Back</h2>
          <p className="zq-login-sub">
            Login to continue your learning journey
          </p>

          {error && <div className="zq-login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="zq-login-form">
            <Input
              type="email"
              variant="underline"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                const rx = /^\S+@\S+\.\S+$/;
                setEmailError(
                  !e.target.value || rx.test(e.target.value)
                    ? ""
                    : "Please enter a valid email address"
                );
              }}
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5L12 13L21 8.5"
                    stroke="#295BFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            {emailError && (
              <div style={{ color: "#c33", marginTop: 6, fontSize: 13 }}>
                {emailError}
              </div>
            )}
            <Input
              type="password"
              variant="underline"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(
                  !e.target.value || e.target.value.length >= 6
                    ? ""
                    : "Password must be at least 6 characters"
                );
              }}
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15V11"
                    stroke="#295BFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 11V9a4 4 0 10-8 0v2"
                    stroke="#295BFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            {passwordError && (
              <div style={{ color: "#c33", marginTop: 6, fontSize: 13 }}>
                {passwordError}
              </div>
            )}

            <div className="zq-login-row">
              <Checkbox
                id="remember"
                label="Remember me"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <Link to="/forgot" className="zq-forgot">
                Forgot password?
              </Link>
            </div>

            <div style={{ marginTop: 8 }}>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !!emailError || !!passwordError}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>

            <p className="zq-login-cta">
              Don't have an account?{" "}
              <Link to="/register">Create Account →</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
