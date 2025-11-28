import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import Checkbox from "../components/UI/Checkbox";
import "./Register.css";
import hero from "../assets/hero_illustration.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // client-side validations
    let ok = true;
    if (!name.trim()) {
      setNameError("Please enter your full name");
      ok = false;
    } else setNameError("");
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      ok = false;
    } else setEmailError("");
    if (!username.trim()) {
      setUsernameError("Please choose a username");
      ok = false;
    } else setUsernameError("");
    // password complexity rules
    const checks = getPasswordChecks(password);
    const allGood = Object.values(checks).every(Boolean);
    if (!allGood) {
      setPasswordError("Password does not meet the required rules");
      ok = false;
    } else setPasswordError("");

    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords do not match");
      ok = false;
    } else setRepeatPasswordError("");

    if (!termsAccepted) {
      ok = false;
      setError("You must agree to the Terms & Conditions to proceed.");
    }

    if (!ok) {
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordChecks = (pw) => {
    return {
      minLen: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
    };
  };

  const calcStrength = (pw) => {
    if (!pw) return { score: 0, label: "Too short", color: "#e53935" };
    const checks = getPasswordChecks(pw);
    const passed = Object.values(checks).filter(Boolean).length;
    const score = Math.round((passed / Object.keys(checks).length) * 100);
    let label = "Very weak";
    let color = "#e53935";
    if (score >= 80) {
      label = "Strong";
      color = "#2e7d32";
    } else if (score >= 60) {
      label = "Good";
      color = "#1e88e5";
    } else if (score >= 40) {
      label = "Fair";
      color = "#f57c00";
    }
    return { score, label, color };
  };

  return (
    <div className="zq-register-root">
      <div className="zq-register-left">
        <img src={hero} alt="hero" className="zq-register-hero" />
        <div className="zq-gradient-overlay" />
      </div>
      <div className="zq-register-right">
        <div className="zq-register-card">
          <h2 className="zq-register-title">Create Account</h2>
          <div className="zq-register-sub">
            Welcome — start your IT learning journey with ZOQIRA
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="zq-form-row">
              <Input
                label="Full Name"
                variant="underline"
                placeholder="Name..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(
                    e.target.value.trim() ? "" : "Please enter your full name"
                  );
                }}
              />
            </div>
            {nameError && (
              <div style={{ color: "#c33", fontSize: 13, marginTop: 6 }}>
                {nameError}
              </div>
            )}
            <div className="zq-form-row">
              <Input
                label="Email"
                variant="underline"
                type="email"
                placeholder="Email address..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  const rx = /^\S+@\S+\.\S+$/;
                  setEmailError(
                    !e.target.value || rx.test(e.target.value)
                      ? ""
                      : "Please enter a valid email"
                  );
                }}
              />
            </div>
            {emailError && (
              <div style={{ color: "#c33", fontSize: 13, marginTop: 6 }}>
                {emailError}
              </div>
            )}
            <div className="zq-form-row">
              <Input
                label="Username"
                variant="underline"
                placeholder="Username..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(
                    e.target.value.trim() ? "" : "Please choose a username"
                  );
                }}
              />
            </div>
            {usernameError && (
              <div style={{ color: "#c33", fontSize: 13, marginTop: 6 }}>
                {usernameError}
              </div>
            )}

            <Input
              label="Password"
              variant="underline"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                const checks = getPasswordChecks(e.target.value);
                const all = Object.values(checks).every(Boolean);
                setPasswordError(
                  all ? "" : "Password must meet the required rules"
                );
              }}
            />
            {/* strength meter */}
            <div style={{ marginTop: 6 }}>
              {password ? (
                (() => {
                  const s = calcStrength(password);
                  return (
                    <div>
                      <div
                        style={{
                          height: 8,
                          width: "100%",
                          background: "#eef6ff",
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${s.score}%`,
                            height: "100%",
                            background: s.color,
                            transition: "width .24s ease",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: s.color,
                          marginTop: 6,
                          fontWeight: 700,
                        }}
                      >
                        {s.label} ({s.score}%)
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div style={{ fontSize: 12, color: "#777" }}>
                  Use a strong password (8+ chars, upper + lower + number +
                  special).
                </div>
              )}
            </div>

            {/* rules */}
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div className="zq-form-row">
                <Input
                  label="Repeat Password"
                  variant="underline"
                  type="password"
                  placeholder="Repeat password..."
                  value={repeatPassword}
                  onChange={(e) => {
                    setRepeatPassword(e.target.value);
                    setRepeatPasswordError(
                      e.target.value === password
                        ? ""
                        : "Passwords do not match"
                    );
                  }}
                />
              </div>
              {repeatPasswordError && (
                <div style={{ color: "#c33", fontSize: 13, marginTop: 6 }}>
                  {repeatPasswordError}
                </div>
              )}

              <div className="zq-form-row">
                <Checkbox
                  id="terms"
                  label={"I agree to the Terms & Conditions"}
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <div className="zq-helper">
                  This is a learning app — account will be used only for
                  educational purposes.
                </div>
              </div>
              {(() => {
                const checks = getPasswordChecks(password);
                const items = [
                  ["minLen", "At least 8 characters"],
                  ["upper", "One uppercase letter"],
                  ["lower", "One lowercase letter"],
                  ["number", "A number"],
                  ["special", "A special character"],
                ];
                return items.map(([k, label]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: checks[k] ? "#2e7d32" : "#999",
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: checks[k] ? "#2e7d32" : "transparent",
                        border: checks[k]
                          ? "none"
                          : "1px solid rgba(0,0,0,0.06)",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    >
                      {checks[k] ? "✓" : ""}
                    </div>
                    <div style={{ fontSize: 13 }}>{label}</div>
                  </div>
                ));
              })()}
            </div>
            {passwordError && (
              <div style={{ color: "#c33", fontSize: 13, marginTop: 6 }}>
                {passwordError}
              </div>
            )}
            <div className="zq-cta">
              <Button
                type="submit"
                variant="primary"
                disabled={
                  loading ||
                  !!nameError ||
                  !!emailError ||
                  !!passwordError ||
                  !!usernameError ||
                  !!repeatPasswordError ||
                  !termsAccepted
                }
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </form>
          <div className="zq-bottom">
            <div className="zq-bottom-text">Already have an account?</div>
            <Link to="/login" className="zq-bottom-link">
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 80px)",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  link: {
    textAlign: "center",
    marginTop: "1rem",
  },
};

export default Register;
