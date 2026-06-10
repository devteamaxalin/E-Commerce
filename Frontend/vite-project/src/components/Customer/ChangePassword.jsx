import React, { useState } from "react";
 
const ChangePassword = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage("Please fill all fields");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New Password and Confirm Password do not match");
      return;
    }
 
    setMessage("Password changed successfully!");
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };
 
  return (
    <div style={styles.container}>
      {/* Back to dashboard main view via tabs */}
      <button
        onClick={() => setActiveTab("orders")}
        style={styles.backButton}
      >
        ← Back to Dashboard
      </button>
 
      <h2 style={styles.title}>Change Password</h2>
 
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
 
        <div style={styles.inputGroup}>
          <label style={styles.label}>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
 
        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
 
        <button type="submit" style={styles.button}>
          Save Password
        </button>
 
        {message && (
          <div
            style={{
              ...styles.message,
              color: message.includes("successfully") ? "#16a34a" : "#dc2626",
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
 
const styles = {
  container: {
    background: "#fff",
    maxWidth: "450px",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#6b21a8",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "20px",
    padding: "0"
  },
  title: {
    marginBottom: "25px",
    color: "#4c1d95",
    fontSize: "22px",
    fontWeight: "600",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "18px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
  },
  input: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    marginTop: "6px",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#6b21a8",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
  message: {
    marginTop: "15px",
    fontWeight: "600",
    textAlign: "center",
    fontSize: "14px",
  },
};
 
export default ChangePassword; 