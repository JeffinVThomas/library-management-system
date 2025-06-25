import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    }

    const blockUntil = localStorage.getItem("adminBlockUntil");
    const loginAttempts = localStorage.getItem("adminLoginAttempts");

    if (blockUntil && new Date().getTime() < Number(blockUntil)) {
      setIsBlocked(true);
    } else {
      localStorage.removeItem("adminBlockUntil");
      setIsBlocked(false);
    }

    if (loginAttempts !== null) {
      setAttemptsLeft(5 - parseInt(loginAttempts, 10));
    }
  }, [navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (isBlocked) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/admin/login",
        { email, password }
      );

      const admin = response.data;

      // ✅ Success
      localStorage.setItem("token", "admin-token");
      localStorage.setItem("email", admin.email);
      localStorage.setItem("role", admin.role);

      // ✅ Reset block info
      localStorage.removeItem("adminLoginAttempts");
      localStorage.removeItem("adminBlockUntil");

      navigate("/admin-dashboard", { replace: true });
    } catch (error) {
      // ❌ Handle failed login
      let currentAttempts =
        parseInt(localStorage.getItem("loginAttempts")) || 0;
      currentAttempts += 1;

      if (currentAttempts >= 5) {
        const blockTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem("blockUntil", blockTime);
        localStorage.setItem("loginAttempts", "5");
        setIsBlocked(true);
        setAttemptsLeft(0);
        alert(
          "❌ Too many failed attempts. Try again after 24 hours or reset your password."
        );
      } else {
        localStorage.setItem("loginAttempts", currentAttempts.toString());
        setAttemptsLeft(5 - currentAttempts);
        alert("❌ Invalid credentials");
      }
    }
  };

  const handleForgotPassword = () => {
    localStorage.setItem("forgotContext", "admin");
    navigate("/forgot-password");
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div
          className="card shadow p-4"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          {isBlocked ? (
            <div className="text-center text-danger">
              <h5>🚫 Attempts for today are over</h5>
              <p className="mb-2">
                Try again after 24 hours or reset your password.
              </p>
              <button
                className="btn btn-link text-primary"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-center mb-4 text-dark">Admin Login</h3>
              <form onSubmit={handleAdminLogin}>
                <div className="mb-3">
                  <label htmlFor="adminEmail" className="form-label">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="adminEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="adminPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="adminPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* 🔴 Remaining Attempts */}
                {attemptsLeft < 5 && (
                  <div className="text-danger small mb-2">
                    Attempts left: {attemptsLeft}
                  </div>
                )}

                <div className="mb-3 text-end">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-primary"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="btn btn-dark w-100">
                  Admin Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
