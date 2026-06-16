import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, Camera, Save, RefreshCw, Trash2 } from "lucide-react";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "", // Read-only value fetched via auth or profile payload
    phone: "",
    bio: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const fileInputRef = useRef(null);

  // Helper notification handler
  const showNotification = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // ==========================================
  // 1. BACKEND CORE SYNC (FETCH PROFILE)
  // ==========================================
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Authentication token missing. Please log in.", "error");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://127.0.0.1:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setProfile({
          firstName: res.data.first_name || "",
          lastName: res.data.last_name || "",
          email: res.data.email || "", // Populated if returned from backend user profile join
          phone: res.data.phone || "",
          bio: res.data.bio || "",
          avatar: res.data.avatar_url 
            ? `http://127.0.0.1:8000${res.data.avatar_url}` 
            : `https://ui-avatars.com/api/?name=${encodeURIComponent((res.data.first_name || "U") + " " + (res.data.last_name || ""))}&background=6B46C1&color=fff&size=200`,
        });
      }
    } catch (err) {
      console.error("Error downloading database profile metrics:", err);
      showNotification("Could not retrieve profile information.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle standard keystroke mutations
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ==========================================
  // 2. AVATAR MULTIPART FILE UPLOAD (POST)
  // ==========================================
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      showNotification("Image size must be less than 2MB.", "error");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUpdating(true);
      const res = await axios.post("http://127.0.0.1:8000/api/profile/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showNotification("Avatar uploaded successfully!");
      // Append backend relative url string down to state hook
      setProfile((prev) => ({
        ...prev,
        avatar: `http://127.0.0.1:8000${res.data.avatar_url}`,
      }));
    } catch (err) {
      console.error("Avatar upload runtime crash:", err);
      showNotification("Failed to upload profile picture.", "error");
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // 3. REMOVE AVATAR PROCESS (DELETE)
  // ==========================================
  const handleRemoveAvatar = async () => {
    try {
      const token = localStorage.getItem("token");
      setUpdating(true);

      await axios.delete("http://127.0.0.1:8000/api/profile/avatar", {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification("Avatar removed successfully.");
      setProfile((prev) => ({
        ...prev,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.firstName + " " + profile.lastName)}&background=6B46C1&color=fff&size=200`,
      }));
    } catch (err) {
      console.error("Failed to delete avatar record:", err);
      showNotification("Could not remove avatar link from profile.", "error");
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // 4. METRICS CONTROLLER DISPATCH (PUT)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const token = localStorage.getItem("token");
    
    // Map custom frontend parameters into snake_case expectations
    const payload = {
      first_name: profile.firstName,
      last_name: profile.lastName,
      phone: profile.phone,
      bio: profile.bio,
    };

    try {
      await axios.put("http://127.0.0.1:8000/api/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Profile settings saved successfully!");
    } catch (err) {
      console.error("Database update request failed:", err);
      showNotification("Could not synchronize changes to the database.", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <RefreshCw style={{ animation: "spin 2s linear infinite", color: "#6B46C1", marginBottom: "12px" }} size={32} />
        <p style={{ fontFamily: "Arial", color: "#64748b", fontSize: "14px" }}>Loading personal details...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 860,
        margin: "40px auto",
        padding: "32px",
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        border: "1px solid #f1f5f9",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Real-time Global Notice Alert Banner */}
      {message.text && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "10px 18px",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "bold",
            background: message.type === "error" ? "#ef4444" : "#10b981",
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #f1f5f9",
          paddingBottom: 20,
          marginBottom: 28,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#334155" }}>
          Profile Settings
        </h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
          Update your personal details and public profile parameters securely.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Avatar Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            background: "#f8fafc",
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 28,
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={profile.avatar}
              alt="Profile"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                background: "#e2e8f0",
              }}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.firstName + " " + profile.lastName)}&background=6B46C1&color=fff&size=200`;
              }}
            />
            <button
              type="button"
              onClick={() => !updating && fileInputRef.current.click()}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: updating ? "#94a3b8" : "#6B46C1",
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justify: "center",
                cursor: updating ? "not-allowed" : "pointer",
                boxShadow: "0 2px 6px rgba(107,70,193,0.4)",
                justifyContent: "center",
              }}
              disabled={updating}
              title="Change Avatar"
            >
              <Camera size={15} color="#fff" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#475569" }}>
              Profile Picture
            </p>
            <p style={{ margin: "4px 0 10px", fontSize: 12, color: "#94a3b8" }}>
              PNG, JPG or GIF. Max 2MB. Updates dynamically to cloud storage directory.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={updating}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6B46C1",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Upload new
              </button>
              <span style={{ color: "#cbd5e1" }}>|</span>
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={updating}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Trash2 size={12} /> Clear Link
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields Container Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px 24px",
            marginBottom: 24,
          }}
        >
          {/* First Name input structural block */}
          <div style={fieldWrapper}>
            <label style={labelStyle}>First Name</label>
            <div style={{ position: "relative" }}>
              <User style={iconStyle} size={17} />
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                placeholder="John"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Last Name input structural block */}
          <div style={fieldWrapper}>
            <label style={labelStyle}>Last Name</label>
            <div style={{ position: "relative" }}>
              <User style={iconStyle} size={17} />
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                placeholder="Doe"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Account Base Registered Email Address (Read-only verification block) */}
          <div style={fieldWrapper}>
            <label style={labelStyle}>Email Address (Account Context ID)</label>
            <div style={{ position: "relative" }}>
              <Mail style={iconStyle} size={17} />
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                placeholder="name@example.com"
                style={{ ...inputStyle, background: "#f8fafc", color: "#64748b", cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* Contact phone field wrapper */}
          <div style={fieldWrapper}>
            <label style={labelStyle}>Phone Number</label>
            <div style={{ position: "relative" }}>
              <Phone style={iconStyle} size={17} />
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Short narrative public Bio summary string */}
          <div style={{ ...fieldWrapper, gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Bio</label>
            <textarea
              name="bio"
              rows={4}
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell us a little bit about yourself..."
              style={{
                ...inputStyle,
                paddingLeft: 14,
                resize: "none",
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        {/* Action Bottom Layout Footer Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            paddingTop: 20,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <button
            type="button"
            onClick={fetchProfileData}
            disabled={updating}
            style={{
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 500,
              color: "#64748b",
              background: "none",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              cursor: updating ? "not-allowed" : "pointer",
            }}
          >
            Reset Fields
          </button>
          
          <button
            type="submit"
            disabled={updating}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: updating ? "#94a3b8" : "#6B46C1",
              border: "none",
              borderRadius: 8,
              cursor: updating ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(107,70,193,0.25)",
            }}
          >
            <Save size={15} />
            {updating ? "Syncing..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// STATIC OBJECT DESIGN PROPERTY DICTIONARIES
// ==========================================
const fieldWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
};

const iconStyle = {
  position: "absolute",
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  color: "#94a3b8",
  pointerEvents: "none",
};

const inputStyle = {
  width: "100%",
  paddingLeft: 38,
  paddingRight: 14,
  paddingTop: 10,
  paddingBottom: 10,
  fontSize: 14,
  color: "#334155",
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  outline: "none",
  boxSizing: "border-box",
};