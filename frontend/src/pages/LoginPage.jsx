import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./LoginPage.css";

// ── Admin credentials ─────────────────────────────────────
const ADMIN_EMAIL = "busgoadmin12@gmail.com";
// Admin password stored in state so it can be changed via forgot password
let ADMIN_PASSWORD_CURRENT = "Busgo888@";

// ── SVG Eye Icons ─────────────────────────────────────────
const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeClosed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// Modes: login | register | forgot-email | forgot-verify | forgot-reset
//        admin-forgot-email | admin-forgot-verify | admin-forgot-reset
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode,        setMode]        = useState("login");
  const [accountType, setAccountType] = useState("user");

  // Login
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw,   setShowLoginPw]   = useState(false);
  const [loginToast,    setLoginToast]    = useState(false);

  // Register (user only)
  const [regName,     setRegName]     = useState("");
  const [regEmail,    setRegEmail]    = useState("");
  const [regPhone,    setRegPhone]    = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm,  setRegConfirm]  = useState("");
  const [showRegPw,      setShowRegPw]      = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // User forgot password
  const [fpEmail,     setFpEmail]     = useState("");
  const [fpCode,      setFpCode]      = useState("");
  const [fpNewPw,     setFpNewPw]     = useState("");
  const [fpConfirmPw, setFpConfirmPw] = useState("");
  const [showFpPw,    setShowFpPw]    = useState(false);

  // Admin forgot password
  const [adminFpCode,      setAdminFpCode]      = useState("");
  const [adminFpNewPw,     setAdminFpNewPw]     = useState("");
  const [adminFpConfirmPw, setAdminFpConfirmPw] = useState("");
  const [showAdminFpPw,    setShowAdminFpPw]    = useState(false);
  const [sentCode,         setSentCode]         = useState(""); // store sent code for verification

  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── Password strength validation
  const getPasswordErrors = (pw) => {
    const errs = [];
    if (pw.length < 8)           errs.push("At least 8 characters");
    if (!/[0-9]/.test(pw))       errs.push("At least one number");
    if (!/[^a-zA-Z0-9]/.test(pw)) errs.push("At least one special character");
    return errs;
  };
  const switchMode    = (m)  => { setMode(m); clearMessages(); };

  const handleAccountTypeSwitch = (type) => {
    setAccountType(type);
    setLoginEmail(""); setLoginPassword("");
    clearMessages();
    if (type === "admin" && mode === "register") switchMode("login");
  };

  // Show login success toast then navigate
  const showSuccessAndNavigate = (path) => {
    setLoginToast(true);
    setTimeout(() => {
      setLoginToast(false);
      navigate(path);
    }, 1500);
  };

  // ── Login
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!loginEmail || !loginPassword) { setError("Please fill in all fields."); return; }

    // Admin — hardcoded check
    if (accountType === "admin") {
      if (loginEmail !== ADMIN_EMAIL || loginPassword !== ADMIN_PASSWORD_CURRENT) {
        setError("Invalid admin credentials."); return;
      }
      login({ id: 0, name: "Admin", email: ADMIN_EMAIL, role: "admin" });
      showSuccessAndNavigate("/admin/dashboard");
      return;
    }

    // User — backend API
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email: loginEmail, password: loginPassword });
      login({
        id:    res.data.id,
        name:  res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        role:  res.data.role?.toLowerCase(),
      });
      showSuccessAndNavigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ── Register (user only)
  const handleRegister = async (e) => {
    e.preventDefault(); clearMessages();
    if (!regName || !regEmail || !regPhone || !regPassword || !regConfirm) { setError("Please fill in all fields."); return; }
    if (regPassword !== regConfirm) { setError("Passwords do not match."); return; }
    if (!/^\d{10}$/.test(regPhone))  { setError("Phone number must be 10 digits."); return; }
    setLoading(true);
    try {
      await api.post("/users/register", { name: regName, email: regEmail, phone: regPhone, password: regPassword, role: "USER" });
      setSuccess("Account created successfully! Please log in.");
      switchMode("login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  // ── User Forgot — Step 1
  const handleSendCode = async (e) => {
    e.preventDefault(); clearMessages();
    if (!fpEmail) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      await api.post("/users/forgot-password", { email: fpEmail });
      setSuccess(`Verification code sent to ${fpEmail}`);
      switchMode("forgot-verify");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send code.");
    } finally { setLoading(false); }
  };

  // ── User Forgot — Step 2
  const handleVerifyCode = async (e) => {
    e.preventDefault(); clearMessages();
    if (!fpCode || fpCode.length < 4) { setError("Please enter the verification code."); return; }
    setLoading(true);
    try {
      await api.post("/users/verify-code", { email: fpEmail, code: fpCode });
      switchMode("forgot-reset");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code.");
    } finally { setLoading(false); }
  };

  // ── User Forgot — Step 3
  const handleResetPassword = async (e) => {
    e.preventDefault(); clearMessages();
    if (!fpNewPw || !fpConfirmPw)  { setError("Please fill in all fields."); return; }
    if (fpNewPw !== fpConfirmPw)   { setError("Passwords do not match."); return; }
    if (fpNewPw.length < 6)        { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await api.post("/users/reset-password", { email: fpEmail, newPassword: fpNewPw });
      setSuccess("Password reset successfully! Please log in.");
      switchMode("login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally { setLoading(false); }
  };

  // ── Admin Forgot — Step 1: generate code locally (no real email)
  const handleAdminSendCode = (e) => {
    e.preventDefault(); clearMessages();
    // Generate a 6-digit code and store it in state
    const code = String(100000 + Math.floor(Math.random() * 900000));
    setSentCode(code);
    setSuccess(`Your verification code is: ${code}`);
    // Auto move to verify step after short delay
    setTimeout(() => switchMode("admin-forgot-verify"), 1800);
  };

  // ── Admin Forgot — Step 2: verify code against generated code
  const handleAdminVerifyCode = (e) => {
    e.preventDefault(); clearMessages();
    if (!adminFpCode || adminFpCode.length < 4) { setError("Please enter the verification code."); return; }
    if (adminFpCode.trim() !== sentCode) {
      setError("Invalid verification code. Please check and try again.");
      return;
    }
    setSentCode(""); // clear used code
    switchMode("admin-forgot-reset");
  };

  // ── Admin Forgot — Step 3: set new password (updates in-memory)
  const handleAdminResetPassword = (e) => {
    e.preventDefault(); clearMessages();
    if (!adminFpNewPw || !adminFpConfirmPw)  { setError("Please fill in all fields."); return; }
    if (adminFpNewPw !== adminFpConfirmPw)   { setError("Passwords do not match."); return; }
    if (adminFpNewPw.length < 6)             { setError("Password must be at least 6 characters."); return; }
    // Update admin password in memory for this session
    ADMIN_PASSWORD_CURRENT = adminFpNewPw;
    setSuccess("Admin password updated! Please log in with your new password.");
    setAdminFpCode(""); setAdminFpNewPw(""); setAdminFpConfirmPw("");
    switchMode("login");
    setAccountType("admin");
  };

  const features = [
    { icon: "🎫", title: "Easy Booking",   desc: "Book your tickets in just a few clicks" },
    { icon: "🔒", title: "Secure Payment", desc: "Your transactions are safe with us" },
    { icon: "🕐", title: "24/7 Support",   desc: "We're here to help anytime you need" },
  ];

  return (
    <div className="auth-page">

      {/* ── Login Success Toast ── */}
      {loginToast && (
        <div className="login-success-toast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>
          Login successful! Redirecting...
        </div>
      )}

      <button className="back-home-btn" onClick={() => navigate("/")}>← Back to Home</button>

      <div className="auth-container">

        {/* ── Left Panel ── */}
        <div className="auth-left">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="rgba(255,255,255,0.25)"/>
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
              <p className="auth-welcome-sub">
                {accountType === "admin" ? "Admin login" : "Login or create a new account"}
              </p>

              <div className="auth-tabs">
                <button className="auth-tab active">Login</button>
                {accountType !== "admin" && (
                  <button className="auth-tab" onClick={() => switchMode("register")}>Register</button>
                )}
              </div>

              <div className="account-type-section">
                <p className="account-type-label">Account Type</p>
                <div className="account-type-btns">
                  <button className={`account-type-btn ${accountType === "user" ? "active" : ""}`} onClick={() => handleAccountTypeSwitch("user")}>
                    <span>👤</span> User
                  </button>
                  <button className={`account-type-btn ${accountType === "admin" ? "active" : ""}`} onClick={() => handleAccountTypeSwitch("admin")}>
                    <span>🛡️</span> Admin
                  </button>
                </div>
              </div>

              {accountType === "admin" && (
                <div className="auth-admin-notice">
                  🛡️ Admin access is restricted. Use authorised credentials only.
                </div>
              )}

              {error   && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}

              <form onSubmit={handleLogin}>
                <div className="auth-field">
                  <label>Email</label>
                  <input type="email" placeholder="Enter your email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <div className="pw-wrap">
                    <input type={showLoginPw ? "text" : "password"} placeholder="Enter your password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                    <button type="button" className="pw-toggle" onClick={() => setShowLoginPw(p => !p)}>
                      {showLoginPw ? <EyeOpen /> : <EyeClosed />}
                    </button>
                  </div>
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading && <span className="btn-spinner" />}
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="auth-links">
                {accountType === "admin" ? (
                  <button className="auth-link-btn" onClick={() => switchMode("admin-forgot-email")}>
                    Forgot Password?
                  </button>
                ) : (
                  <>
                    <button className="auth-link-btn" onClick={() => switchMode("forgot-email")}>
                      Forgot Password?
                    </button>
                    <span className="auth-link-text">
                      Don't have an account?{" "}
                      <button className="auth-link-btn inline" onClick={() => switchMode("register")}>Register</button>
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ───── REGISTER (User only) ───── */}
          {mode === "register" && (
            <div className="auth-form-wrap">
              <h2 className="auth-welcome">Welcome</h2>
              <p className="auth-welcome-sub">Login or create a new account</p>
              <div className="auth-tabs">
                <button className="auth-tab" onClick={() => switchMode("login")}>Login</button>
                <button className="auth-tab active">Register</button>
              </div>
              <div className="account-type-section">
                <p className="account-type-label">Account Type</p>
                <div className="account-type-btns">
                  <button className="account-type-btn active"><span>👤</span> User</button>
                </div>
              </div>
              {error   && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}
              <form onSubmit={handleRegister}>
                <div className="auth-field">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Perera" value={regName} onChange={e => setRegName(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label>Email</label>
                  <input type="email" placeholder="Enter your email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label>Phone Number</label>
                  <input type="text" placeholder="10-digit number" maxLength={10} value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <div className="pw-wrap">
                    <input type={showRegPw ? "text" : "password"} placeholder="Create a password (min 8 chars)" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                    <button type="button" className="pw-toggle" onClick={() => setShowRegPw(p => !p)}>
                      {showRegPw ? <EyeOpen /> : <EyeClosed />}
                    </button>
                  </div>
                  {/* Password requirements */}
                  {regPassword && (
                    <div className="pw-requirements">
                      <span className={regPassword.length >= 8 ? "req-met" : "req-unmet"}>
                        {regPassword.length >= 8 ? "✓" : "✗"} At least 8 characters
                      </span>
                      <span className={/[0-9]/.test(regPassword) ? "req-met" : "req-unmet"}>
                        {/[0-9]/.test(regPassword) ? "✓" : "✗"} At least one number
                      </span>
                      <span className={/[^a-zA-Z0-9]/.test(regPassword) ? "req-met" : "req-unmet"}>
                        {/[^a-zA-Z0-9]/.test(regPassword) ? "✓" : "✗"} At least one special character
                      </span>
                    </div>
                  )}
                </div>
                <div className="auth-field">
                  <label>Confirm Password</label>
                  <div className="pw-wrap">
                    <input
                      type={showRegConfirm ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={regConfirm}
                      onChange={e => setRegConfirm(e.target.value)}
                      className={regConfirm && regConfirm !== regPassword ? "input-mismatch" : ""}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowRegConfirm(p => !p)}>
                      {showRegConfirm ? <EyeOpen /> : <EyeClosed />}
                    </button>
                  </div>
                  {regConfirm && regConfirm !== regPassword && (
                    <span className="pw-mismatch-msg">⚠ Your password doesn't match</span>
                  )}
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading && <span className="btn-spinner" />}
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
              <div className="auth-links">
                <span className="auth-link-text">
                  Already have an account?{" "}
                  <button className="auth-link-btn inline" onClick={() => switchMode("login")}>Login</button>
                </span>
              </div>
            </div>
          )}

          {/* ───── USER FORGOT — STEP 1 ───── */}
          {mode === "forgot-email" && (
            <div className="auth-form-wrap">
              <button className="fp-back-btn" onClick={() => switchMode("login")}>← Back to Login</button>
              <div className="fp-icon">📧</div>
              <h2 className="auth-welcome">Forgot Password?</h2>
              <p className="auth-welcome-sub">Enter your email and we'll send you a verification code.</p>
              <div className="fp-steps">
                <div className="fp-step active"><span>1</span></div>
                <div className="fp-step-line"/>
                <div className="fp-step"><span>2</span></div>
                <div className="fp-step-line"/>
                <div className="fp-step"><span>3</span></div>
              </div>
              {error   && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}
              <form onSubmit={handleSendCode}>
                <div className="auth-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your registered email" value={fpEmail} onChange={e => setFpEmail(e.target.value)} />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading && <span className="btn-spinner" />}
                  {loading ? "Sending Code..." : "Send Verification Code →"}
                </button>
              </form>
            </div>
          )}

          {/* ───── USER FORGOT — STEP 2 ───── */}
          {mode === "forgot-verify" && (
            <div className="auth-form-wrap">
              <button className="fp-back-btn" onClick={() => switchMode("forgot-email")}>← Back</button>
              <div className="fp-icon">🔑</div>
              <h2 className="auth-welcome">Enter Verification Code</h2>
              <p className="auth-welcome-sub">We sent a code to <strong>{fpEmail}</strong>. Check your inbox.</p>
              <div className="fp-steps">
                <div className="fp-step done"><span>✓</span></div>
                <div className="fp-step-line active"/>
                <div className="fp-step active"><span>2</span></div>
                <div className="fp-step-line"/>
                <div className="fp-step"><span>3</span></div>
              </div>
              {error   && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}
              <form onSubmit={handleVerifyCode}>
                <div className="auth-field">
                  <label>Verification Code</label>
                  <input type="text" placeholder="Enter the code from your email" maxLength={8} value={fpCode} onChange={e => setFpCode(e.target.value)} className="code-input" />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading && <span className="btn-spinner" />}
                  {loading ? "Verifying..." : "Verify Code →"}
                </button>
              </form>
              <div className="auth-links">
                <span className="auth-link-text">
                  Didn't receive a code?{" "}
                  <button className="auth-link-btn inline" onClick={handleSendCode}>Resend</button>
                </span>
              </div>
            </div>
          )}

          {/* ───── USER FORGOT — STEP 3 ───── */}
          {mode === "forgot-reset" && (
            <div className="auth-form-wrap">
              <div className="fp-icon">🔒</div>
              <h2 className="auth-welcome">Reset Password</h2>
              <p className="auth-welcome-sub">Create a strong new password for your account.</p>
              <div className="fp-steps">
                <div className="fp-step done"><span>✓</span></div>
                <div className="fp-step-line active"/>
                <div className="fp-step done"><span>✓</span></div>
                <div className="fp-step-line active"/>
                <div className="fp-step active"><span>3</span></div>
              </div>
              {error && <div className="auth-error">⚠️ {error}</div>}
              <form onSubmit={handleResetPassword}>
                <div className="auth-field">
                  <label>New Password</label>
                  <div className="pw-wrap">
                    <input type={showFpPw ? "text" : "password"} placeholder="Enter new password" value={fpNewPw} onChange={e => setFpNewPw(e.target.value)} />
                    <button type="button" className="pw-toggle" onClick={() => setShowFpPw(p => !p)}>
                      {showFpPw ? <EyeOpen /> : <EyeClosed />}
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" value={fpConfirmPw} onChange={e => setFpConfirmPw(e.target.value)} />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading && <span className="btn-spinner" />}
                  {loading ? "Saving..." : "Save New Password ✓"}
                </button>
              </form>
            </div>
          )}

          {/* ───── ADMIN FORGOT — STEP 1 ───── */}
          {mode === "admin-forgot-email" && (
            <div className="auth-form-wrap">
              <button className="fp-back-btn" onClick={() => { switchMode("login"); setAccountType("admin"); }}>← Back to Login</button>
              <div className="fp-icon">📧</div>
              <h2 className="auth-welcome">Forgot Password?</h2>
              <p className="auth-welcome-sub">Enter your email and we'll send you a verification code.</p>
              <div className="fp-steps">
                <div className="fp-step active"><span>1</span></div>
                <div className="fp-step-line"/>
                <div className="fp-step"><span>2</span></div>
                <div className="fp-step-line"/>
                <div className="fp-step"><span>3</span></div>
              </div>
              {error   && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}
              <form onSubmit={handleAdminSendCode}>
                <div className="auth-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                  />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading && <span className="btn-spinner" />}
                  {loading ? "Sending Code..." : "Send Verification Code →"}
                </button>
              </form>
            </div>
          )}

          {/* ───── ADMIN FORGOT — STEP 2 ───── */}
          {mode === "admin-forgot-verify" && (
            <div className="auth-form-wrap">
              <button className="fp-back-btn" onClick={() => switchMode("admin-forgot-email")}>← Back</button>
              <div className="fp-icon">🔑</div>
              <h2 className="auth-welcome">Enter Verification Code</h2>
              <p className="auth-welcome-sub">
                {sentCode
                  ? <>Email not configured yet. Use this code: <strong className="fallback-code">{sentCode}</strong></>
                  : <>We sent a code to <strong>{ADMIN_EMAIL}</strong>. Check your inbox.</>
                }
              </p>
              <div className="fp-steps">
                <div className="fp-step done"><span>✓</span></div>
                <div className="fp-step-line active"/>
                <div className="fp-step active"><span>2</span></div>
                <div className="fp-step-line"/>
                <div className="fp-step"><span>3</span></div>
              </div>
              {error   && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}
              <form onSubmit={handleAdminVerifyCode}>
                <div className="auth-field">
                  <label>Verification Code</label>
                  <input type="text" placeholder="Enter the code from your email" maxLength={8} value={adminFpCode} onChange={e => setAdminFpCode(e.target.value)} className="code-input" />
                </div>
                <button className="auth-submit-btn" type="submit" disabled={loading}>
                  {loading && <span className="btn-spinner" />}
                  {loading ? "Verifying..." : "Verify Code →"}
                </button>
              </form>
              <div className="auth-links">
                <span className="auth-link-text">
                  Didn't receive a code?{" "}
                  <button className="auth-link-btn inline" onClick={handleAdminSendCode}>Resend</button>
                </span>
              </div>
            </div>
          )}

          {/* ───── ADMIN FORGOT — STEP 3 ───── */}
          {mode === "admin-forgot-reset" && (
            <div className="auth-form-wrap">
              <div className="fp-icon">🔒</div>
              <h2 className="auth-welcome">Reset Admin Password</h2>
              <p className="auth-welcome-sub">Create a new secure password for the admin account.</p>
              <div className="fp-steps">
                <div className="fp-step done"><span>✓</span></div>
                <div className="fp-step-line active"/>
                <div className="fp-step done"><span>✓</span></div>
                <div className="fp-step-line active"/>
                <div className="fp-step active"><span>3</span></div>
              </div>
              {error && <div className="auth-error">⚠️ {error}</div>}
              <form onSubmit={handleAdminResetPassword}>
                <div className="auth-field">
                  <label>New Password</label>
                  <div className="pw-wrap">
                    <input type={showAdminFpPw ? "text" : "password"} placeholder="Enter new admin password" value={adminFpNewPw} onChange={e => setAdminFpNewPw(e.target.value)} />
                    <button type="button" className="pw-toggle" onClick={() => setShowAdminFpPw(p => !p)}>
                      {showAdminFpPw ? <EyeOpen /> : <EyeClosed />}
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" value={adminFpConfirmPw} onChange={e => setAdminFpConfirmPw(e.target.value)} />
                </div>
                <button className="auth-submit-btn" type="submit">
                  Save New Password ✓
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
