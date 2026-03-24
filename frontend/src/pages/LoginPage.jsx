import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

// ── Modes: "login" | "register" | "forgot-email" | "forgot-verify" | "forgot-reset"
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [accountType, setAccountType] = useState("user"); // "user" | "admin"

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);

  // Forgot password fields
  const [fpEmail, setFpEmail] = useState("");
  const [fpCode, setFpCode] = useState("");
  const [fpNewPw, setFpNewPw] = useState("");
  const [fpConfirmPw, setFpConfirmPw] = useState("");
  const [showFpPw, setShowFpPw] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const clearMessages = () => { setError(""); setSuccess(""); };

  const switchMode = (m) => { setMode(m); clearMessages(); };

  // ── Login Submit
  const handleLogin = (e) => {
    e.preventDefault();
    clearMessages();
    if (!loginEmail || !loginPassword) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // TODO: replace with real api.post("/auth/login") call
      const userData = {
        name: loginEmail.split("@")[0],
        email: loginEmail,
        role: accountType, // "user" or "admin"
      };
      login(userData);
      if (accountType === "admin") navigate("/admin/dashboard");
      else navigate("/");
    }, 1000);
  };

  // ── Register Submit
  const handleRegister = (e) => {
    e.preventDefault();
    clearMessages();
    if (!regName || !regEmail || !regPhone || !regPassword || !regConfirm) {
      setError("Please fill in all fields."); return;
    }
    if (regPassword !== regConfirm) { setError("Passwords do not match."); return; }
    if (!/^\d{10}$/.test(regPhone)) { setError("Phone number must be 10 digits."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // TODO: connect to Spring Boot /api/auth/register
      setSuccess("Account created! Please log in.");
      switchMode("login");
    }, 1000);
  };

  // ── Forgot — Step 1: send code
  const handleSendCode = (e) => {
    e.preventDefault();
    clearMessages();
    if (!fpEmail) { setError("Please enter your email address."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // TODO: connect to Spring Boot /api/auth/forgot-password
      setSuccess(`Verification code sent to ${fpEmail}`);
      switchMode("forgot-verify");
    }, 1000);
  };

  // ── Forgot — Step 2: verify code
  const handleVerifyCode = (e) => {
    e.preventDefault();
    clearMessages();
    if (!fpCode || fpCode.length < 4) { setError("Please enter the verification code."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // TODO: connect to Spring Boot /api/auth/verify-code
      switchMode("forgot-reset");
    }, 1000);
  };

  // ── Forgot — Step 3: reset password
  const handleResetPassword = (e) => {
    e.preventDefault();
    clearMessages();
    if (!fpNewPw || !fpConfirmPw) { setError("Please fill in all fields."); return; }
    if (fpNewPw !== fpConfirmPw) { setError("Passwords do not match."); return; }
    if (fpNewPw.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // TODO: connect to Spring Boot /api/auth/reset-password
      setSuccess("Password reset successfully! Please log in.");
      switchMode("login");
    }, 1000);
  };

  const features = [
    { icon: "🎫", title: "Easy Booking", desc: "Book your tickets in just a few clicks" },
    { icon: "🔒", title: "Secure Payment", desc: "Your transactions are safe with us" },
    { icon: "🕐", title: "24/7 Support", desc: "We're here to help anytime you need" },
  ];

  const isForgotFlow = mode.startsWith("forgot");

  return (
    <div className="auth-page">

      {/* Back to Home */}
      <button className="back-home-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className="auth-container">

        {/* ── Left Panel ── */}
        <div className="auth-left">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="rgba(255,255,255,0.25)" />
                <path d="M5 8C5 6.9 5.9 6 7 6H17C18.1 6 19 6.9 19 8V15C19 15.6 18.6 16 18 16H17V17.5C17 17.8 16.8 18 16.5 18H15.5C15.2 18 15 17.8 15 17.5V16H9V17.5C9 17.8 8.8 18 8.5 18H7.5C7.2 18 7 17.8 7 17.5V16H6C5.4 16 5 15.6 5 15V8Z" fill="white"/>
                <rect x="7" y="8.5" width="10" height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
                <circle cx="8.5" cy="14.5" r="1" fill="rgba(255,255,255,0.5)"/>
                <circle cx="15.5" cy="14.5" r="1" fill="rgba(255,255,255,0.5)"/>
              </svg>
            </div>
            <span className="auth-logo-text">BusGo</span>
          </div>

          <p className="auth-tagline">Your Journey, Our Priority</p>

          <div className="auth-features">
            {features.map((f, i) => (
              <div className="auth-feature-item" key={i}>
                <div className="feature-dot">{f.icon}</div>
                <div>
                  <p className="feature-title">{f.title}</p>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="auth-right">

          {/* ───── LOGIN ───── */}
          {mode === "login" && (
            <div className="auth-form-wrap">
              <h2 className="auth-welcome">Welcome</h2>
              <p className="auth-welcome-sub">Login or create a new account</p>

              {/* Login / Register Tabs */}
              <div className="auth-tabs">
                <button className="auth-tab active">Login</button>
                <button className="auth-tab" onClick={() => switchMode("register")}>Register</button>
              </div>

              {/* Account Type */}
              <div className="account-type-section">
                <p className="account-type-label">Account Type</p>
                <div className="account-type-btns">
                  <button
                    className={`account-type-btn ${accountType === "user" ? "active" : ""}`}
                    onClick={() => setAccountType("user")}
                  >
                    <span>👤</span> User
                  </button>
                  <button
                    className={`account-type-btn ${accountType === "admin" ? "active" : ""}`}
                    onClick={() => setAccountType("admin")}
                  >
                    <span>🛡️</span> Admin
                  </button>
                </div>
              </div>

              {error && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}

              <form onSubmit={handleLogin}>
                <div className="auth-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="auth-field">
                  <label>Password</label>
                  <div className="pw-wrap">
                    <input
                      type={showLoginPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowLoginPw(!showLoginPw)}>
                      {showLoginPw ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : null}
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="auth-links">
                <button className="auth-link-btn" onClick={() => switchMode("forgot-email")}>
                  Forgot Password?
                </button>
                <span className="auth-link-text">
                  Don't have an account?{" "}
                  <button className="auth-link-btn inline" onClick={() => switchMode("register")}>
                    Register
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* ───── REGISTER ───── */}
          {mode === "register" && (
            <div className="auth-form-wrap">
              <h2 className="auth-welcome">Welcome</h2>
              <p className="auth-welcome-sub">Login or create a new account</p>

              {/* Login / Register Tabs */}
              <div className="auth-tabs">
                <button className="auth-tab" onClick={() => switchMode("login")}>Login</button>
                <button className="auth-tab active">Register</button>
              </div>

              {/* Account Type */}
              <div className="account-type-section">
                <p className="account-type-label">Account Type</p>
                <div className="account-type-btns">
                  <button
                    className={`account-type-btn ${accountType === "user" ? "active" : ""}`}
                    onClick={() => setAccountType("user")}
                  >
                    <span>👤</span> User
                  </button>
                  <button
                    className={`account-type-btn ${accountType === "admin" ? "active" : ""}`}
                    onClick={() => setAccountType("admin")}
                  >
                    <span>🛡️</span> Admin
                  </button>
                </div>
              </div>

              {error && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}

              <form onSubmit={handleRegister}>
                <div className="auth-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Perera"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="10-digit number"
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <div className="pw-wrap">
                    <input
                      type={showRegPw ? "text" : "password"}
                      placeholder="Create a password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowRegPw(!showRegPw)}>
                      {showRegPw ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                  />
                </div>

                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : null}
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="auth-links">
                <span className="auth-link-text">
                  Already have an account?{" "}
                  <button className="auth-link-btn inline" onClick={() => switchMode("login")}>
                    Login
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* ───── FORGOT — STEP 1: Enter Email ───── */}
          {mode === "forgot-email" && (
            <div className="auth-form-wrap">
              <button className="fp-back-btn" onClick={() => switchMode("login")}>← Back to Login</button>
              <div className="fp-icon">📧</div>
              <h2 className="auth-welcome">Forgot Password?</h2>
              <p className="auth-welcome-sub">Enter your email address and we'll send you a verification code.</p>

              <div className="fp-steps">
                <div className="fp-step active"><span>1</span></div>
                <div className="fp-step-line" />
                <div className="fp-step"><span>2</span></div>
                <div className="fp-step-line" />
                <div className="fp-step"><span>3</span></div>
              </div>

              {error && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}

              <form onSubmit={handleSendCode}>
                <div className="auth-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                  />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : null}
                  {loading ? "Sending Code..." : "Send Verification Code →"}
                </button>
              </form>
            </div>
          )}

          {/* ───── FORGOT — STEP 2: Verify Code ───── */}
          {mode === "forgot-verify" && (
            <div className="auth-form-wrap">
              <button className="fp-back-btn" onClick={() => switchMode("forgot-email")}>← Back</button>
              <div className="fp-icon">🔑</div>
              <h2 className="auth-welcome">Enter Verification Code</h2>
              <p className="auth-welcome-sub">We sent a code to <strong>{fpEmail}</strong>. Check your inbox.</p>

              <div className="fp-steps">
                <div className="fp-step done"><span>✓</span></div>
                <div className="fp-step-line active" />
                <div className="fp-step active"><span>2</span></div>
                <div className="fp-step-line" />
                <div className="fp-step"><span>3</span></div>
              </div>

              {error && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}

              <form onSubmit={handleVerifyCode}>
                <div className="auth-field">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    placeholder="Enter the code from your email"
                    maxLength={8}
                    value={fpCode}
                    onChange={(e) => setFpCode(e.target.value)}
                    className="code-input"
                  />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : null}
                  {loading ? "Verifying..." : "Verify Code →"}
                </button>
              </form>

              <div className="auth-links">
                <span className="auth-link-text">
                  Didn't receive a code?{" "}
                  <button className="auth-link-btn inline" onClick={handleSendCode}>
                    Resend
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* ───── FORGOT — STEP 3: New Password ───── */}
          {mode === "forgot-reset" && (
            <div className="auth-form-wrap">
              <div className="fp-icon">🔒</div>
              <h2 className="auth-welcome">Reset Password</h2>
              <p className="auth-welcome-sub">Create a strong new password for your account.</p>

              <div className="fp-steps">
                <div className="fp-step done"><span>✓</span></div>
                <div className="fp-step-line active" />
                <div className="fp-step done"><span>✓</span></div>
                <div className="fp-step-line active" />
                <div className="fp-step active"><span>3</span></div>
              </div>

              {error && <div className="auth-error">⚠️ {error}</div>}

              <form onSubmit={handleResetPassword}>
                <div className="auth-field">
                  <label>New Password</label>
                  <div className="pw-wrap">
                    <input
                      type={showFpPw ? "text" : "password"}
                      placeholder="Enter new password"
                      value={fpNewPw}
                      onChange={(e) => setFpNewPw(e.target.value)}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowFpPw(!showFpPw)}>
                      {showFpPw ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={fpConfirmPw}
                    onChange={(e) => setFpConfirmPw(e.target.value)}
                  />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : null}
                  {loading ? "Saving..." : "Save New Password ✓"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
