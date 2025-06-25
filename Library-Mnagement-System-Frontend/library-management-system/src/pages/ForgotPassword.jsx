import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [timer, setTimer] = useState(60);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const context = localStorage.getItem("forgotContext"); // 'admin' or 'user'

  // ⏳ OTP Timer
  useEffect(() => {
    let interval;
    if (otpSent === true && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // ✅ Step 1: Send OTP
  const checkMobileAndSendOtp = async () => {
    if (!mobile.match(/^\d{10}$/)) {
      alert("❌ Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/api/users/by-mobile?mobile=${mobile}`
      );
      const user = res.data;

      if (!user || !user.role) {
        alert("❌ Mobile number not found.");
        return;
      }

      if (user.role !== context) {
        alert(
          `❌ This mobile belongs to a ${user.role}. Please use the correct forgot password link.`
        );
        return;
      }

      setRole(user.role);

      await axios.post(
        `http://localhost:8080/api/users/send-otp?mobile=${mobile}`
      );

      setOtpSent(true);
      setTimer(60);
      alert(`✅ OTP sent to registered mobile number.`);
    } catch (error) {
      console.error(error);
      alert("❌ Error verifying mobile or sending OTP.");
    }
  };

  // ✅ Step 2: Verify OTP
  const verifyOtpAndShowResetForm = async () => {
    if (timer === 0) {
      alert("❌ OTP expired. Please resend.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/verify-otp?mobile=${mobile}&otp=${otp}`
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
    }
  };

  // ✅ Handle Password Input
  const handlePasswordChange = (value) => {
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

    // Live match check
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("❌ Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  // ✅ Step 3: Reset Password
  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("❌ Passwords do not match");
      return;
    }

    if (passwordError || confirmPasswordError) {
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/users/reset-password?mobile=${mobile}&newPassword=${newPassword}`
      );

      // Clear lockout info after successful reset
      if (role === "admin") {
        localStorage.removeItem("adminLoginAttempts");
        localStorage.removeItem("adminBlockUntil");
      } else {
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("blockUntil");
      }

      alert("✅ Password changed successfully");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin-login");
        } else {
          navigate("/login");
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to reset password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="text-center mb-4">🔐 Forgot Password</h4>

        {/* Step 1: Enter Mobile */}
        {!otpSent && (
          <>
            <div className="mb-3">
              <label className="form-label">📱 Mobile Number</label>
              <input
                type="text"
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={checkMobileAndSendOtp}
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: Enter OTP */}
        {otpSent === true && (
          <>
            <div className="mb-3">
              <label className="form-label">🔑 Enter OTP</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <div className="text-muted mt-1">
                ⏳ OTP expires in: <strong>{timer}s</strong>
              </div>
            </div>
            <button
              className="btn btn-success w-100"
              onClick={verifyOtpAndShowResetForm}
              disabled={timer === 0}
            >
              Verify OTP
            </button>
            <button
              className="btn btn-link text-primary w-100 mt-2"
              onClick={checkMobileAndSendOtp}
              disabled={timer > 0}
            >
              Resend OTP
            </button>
          </>
        )}

        {/* Step 3: Enter New Password */}
        {otpSent === "verified" && (
          <>
            <div className="mb-3 mt-2">
              <label className="form-label">🆕 New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
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
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (newPassword && e.target.value !== newPassword) {
                    setConfirmPasswordError("❌ Passwords do not match");
                  } else {
                    setConfirmPasswordError("");
                  }
                }}
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
            >
              Change Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
