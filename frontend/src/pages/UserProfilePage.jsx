import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!name.trim() || !email.trim()) { setError("Name and email are required."); return; }
    if (phone && !/^\d{10}$/.test(phone)) { setError("Phone must be 10 digits."); return; }

    setLoading(true);
    try {
      await api.put(`/users/${user.id}/profile`, { name, email, phone });
      // Update local auth context with new values
      login({ ...user, name, email, phone });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upp-page">
      <div className="upp-card">
        {/* Back */}
        <button className="upp-back" onClick={() => navigate("/user/dashboard")}>
          ← Back to Dashboard
        </button>

        {/* Avatar */}
        <div className="upp-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" width="40" height="40">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <h2 className="upp-title">Update Profile</h2>
        <p className="upp-subtitle">Update your personal information</p>

        {error   && <div className="upp-error">⚠️ {error}</div>}
        {success && <div className="upp-success">✅ {success}</div>}

        <form onSubmit={handleSubmit} className="upp-form">
          <div className="upp-field">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
          </div>
          <div className="upp-field">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="upp-field">
            <label>Phone Number</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" maxLength={10} />
          </div>

          <div className="upp-actions">
            <button type="submit" className="upp-save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="upp-cancel-btn" onClick={() => navigate("/user/dashboard")}>
              Cancel
            </button>
          </div>
        </form>

        {/* Quick links */}
        <div className="upp-links">
          <button onClick={() => navigate("/user/change-password")}>🔒 Change Password</button>
        </div>
      </div>
    </div>
  );
}
