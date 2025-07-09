import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [timer, setTimer] = useState(60);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const context = localStorage.getItem("forgotContext");

  useEffect(function () {
    let interval;
    if (otpSent === true && timer > 0) {
      interval = setInterval(function () {
        setTimer(function (prev) {
          return prev - 1;
        });
      }, 1000);
    }
    return function () {
      clearInterval(interval);
    };
  }, [otpSent, timer]);

  function handleMobileChange(e) {
    setMobile(e.target.value);
  }

  function handleOtpChange(e) {
    setOtp(e.target.value);
  }

  function handleConfirmPasswordChange(e) {
    const value = e.target.value;
    setConfirmPassword(value);
    if (newPassword && value !== newPassword) {
      setConfirmPasswordError("❌ Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }

  function handleNewPasswordChange(e) {
    const value = e.target.value;
    setNewPassword(value);

    const pattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

    if (!pattern.test(value)) {
      setPasswordError(
        "❌ Must be 8+ characters, include uppercase, number & special character"
      );
    } else {
      setPasswordError("");
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("❌ Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }

  async function checkMobileAndSendOtp() {
    const trimmedMobile = mobile.trim();

    if (!trimmedMobile.match(/^\d{10}$/)) {
      alert("❌ Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8080/api/users/by-mobile?mobile=" + trimmedMobile
      );
      const user = res.data;

      if (!user || !user.role) {
        alert("❌ Mobile number not found.");
        return;
      }

      if (user.role !== context) {
        alert(
          "❌ This mobile belongs to a " +
            user.role +
            ". Please use the correct forgot password page."
        );
        return;
      }

      setRole(user.role);

      await axios.post(
        "http://localhost:8080/api/users/send-otp?mobile=" + trimmedMobile
      );

      setOtpSent(true);
      setTimer(60);
      alert("✅ OTP sent to registered mobile number.");
    } catch (error) {
      console.error(error);
      alert("❌ Error verifying mobile or sending OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtpAndShowResetForm() {
    if (timer === 0) {
      alert("❌ OTP expired. Please resend.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/users/verify-otp?mobile=" +
          mobile +
          "&otp=" +
          otp
      );

      if (response.data === true) {
        alert("✅ OTP verified");
        setOtpSent("verified");
      } else {
        alert("❌ Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error verifying OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("❌ Passwords do not match");
      return;
    }

    if (passwordError || confirmPasswordError) return;

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8080/api/users/reset-password?mobile=" +
          mobile +
          "&newPassword=" +
          newPassword
      );

      if (role === "admin") {
        localStorage.removeItem("adminLoginAttempts");
        localStorage.removeItem("adminBlockUntil");
      } else {
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("blockUntil");
      }

      alert("✅ Password changed successfully");
      setTimeout(function () {
        navigate(role === "admin" ? "/admin-login" : "/login");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="text-center mb-4">🔐 Change Password</h4>

        {!otpSent && (
          <>
            <div className="mb-3">
              <label className="form-label">📱 Mobile Number</label>
              <input
                type="text"
                className="form-control"
                value={mobile}
                onChange={handleMobileChange}
                placeholder="Enter your mobile number"
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={checkMobileAndSendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {otpSent === true && (
          <>
            <div className="mb-3">
              <label className="form-label">🔑 Enter OTP</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
              />
              <div className="text-muted mt-1">
                ⏳ OTP expires in: <strong>{timer}s</strong>
              </div>
            </div>
            <button
              className="btn btn-success w-100"
              onClick={verifyOtpAndShowResetForm}
              disabled={timer === 0 || loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              className="btn btn-link text-primary w-100 mt-2"
              onClick={checkMobileAndSendOtp}
              disabled={timer > 0 || loading}
            >
              Resend OTP
            </button>
          </>
        )}

        {otpSent === "verified" && (
          <>
            <div className="mb-3 mt-2">
              <label className="form-label">🆕 New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              {passwordError && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.9rem" }}
                >
                  {passwordError}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">🔁 Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {confirmPasswordError && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.9rem" }}
                >
                  {confirmPasswordError}
                </div>
              )}
            </div>
            <button
              className="btn btn-success w-100"
              onClick={handlePasswordReset}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Change Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
