import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  // ✅ Password pattern check
  function validatePassword(password) {
    const pattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return pattern.test(password);
  }

  // ✅ Handle password reset logic
  function handleSubmit() {
    if (!validatePassword(newPassword)) {
      setError(
        "❌ Must be 8+ characters, include uppercase, number & special character"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    axios
      .post("http://localhost:8080/api/users/reset-password-loggedin", {
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then(function () {
        alert("✅ Password updated successfully");
        navigate("/profile");
      })
      .catch(function (err) {
        console.error(err);
        setError(
          "❌ Failed to reset password. Please check your old password."
        );
      });
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="text-center mb-4">🔒 Change Password</h4>

        <div className="mb-3">
          <label className="form-label">🔑 Old Password</label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={function (e) {
              setOldPassword(e.target.value);
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">🆕 New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={function (e) {
              setNewPassword(e.target.value);
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">🔁 Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={function (e) {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>

        {error && <div className="text-danger mb-2">{error}</div>}

        <button className="btn btn-success w-100" onClick={handleSubmit}>
          Change Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
