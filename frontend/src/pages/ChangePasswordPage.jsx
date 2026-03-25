import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./ChangePasswordPage.css";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!currentPw) { setError("Please enter your current password."); return; }
    if (!newPw)     { setError("Please enter a new password."); return; }
    if (newPw.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setError("New passwords do not match."); return; }

    setLoading(true);
    try {
      await api.put(`/users/${user.id}/change-password`, {
        currentPassword: currentPw,
        newPassword: newPw,
      });
      setSuccess("Password changed successfully! Redirecting...");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => navigate("/user/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getStrength = (pw) => {
    if (!pw) return { label: "", color: "", width: "0%" };
    if (pw.length < 6) return { label: "Weak", color: "#dc2626", width: "25%" };
    if (pw.length < 8) return { label: "Fair", color: "#d97706", width: "50%" };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { label: "Strong", color: "#16a34a", width: "100%" };
    return { label: "Good", color: "#2563eb", width: "75%" };
  };

  const strength = getStrength(newPw);

  return (
    <div className="cpp-page">
      <div className="cpp-card">
        <button className="cpp-back" onClick={() => navigate("/user/dashboard")}>
          ← Back to Dashboard
        </button>

        <div className="cpp-lock-icon">🔒</div>
        <h2 className="cpp-title">Change Password</h2>
        <p className="cpp-subtitle">Update your account password</p>

        {error   && <div className="cpp-error">⚠️ {error}</div>}
        {success && <div className="cpp-success">✅ {success}</div>}

        <form onSubmit={handleSubmit} className="cpp-form">
          <div className="cpp-field">
            <label>Current Password</label>
            <div className="cpp-pw-wrap">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
              />
              <button type="button" className="cpp-eye" onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}
              </button>
            </div>
          </div>

          <div className="cpp-field">
            <label>New Password</label>
            <div className="cpp-pw-wrap">
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="Enter new password"
              />
              <button type="button" className="cpp-eye" onClick={() => setShowNew(!showNew)}>
                {showNew ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}
              </button>
            </div>
            {/* Strength bar */}
            {newPw && (
              <div className="cpp-strength">
                <div className="cpp-strength-bar">
                  <div className="cpp-strength-fill" style={{ width: strength.width, background: strength.color }} />
                </div>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>

          <div className="cpp-field">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="Confirm new password"
              className={confirmPw && confirmPw !== newPw ? "cpp-mismatch" : ""}
            />
            {confirmPw && confirmPw !== newPw && (
              <span className="cpp-hint">Passwords don't match</span>
            )}
          </div>

          <div className="cpp-actions">
            <button type="submit" className="cpp-save-btn" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
            <button type="button" className="cpp-cancel-btn" onClick={() => navigate("/user/profile")}>
              Cancel
            </button>
          </div>
        </form>

        <div className="cpp-links">
          <button onClick={() => navigate("/user/profile")}>👤 Update Profile</button>
        </div>
      </div>
    </div>
  );
}
