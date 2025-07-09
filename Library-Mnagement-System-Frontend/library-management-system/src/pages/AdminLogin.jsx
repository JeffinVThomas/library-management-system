import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  useEffect(
    function () {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      // ✅ If already logged in as admin, redirect
      if (token && role === "admin") {
        navigate("/admin-dashboard", { replace: true });
        return;
      }

      // ✅ Check for previous block due to 5 failed attempts
      const blockUntil = localStorage.getItem("adminBlockUntil");
      const loginAttempts = localStorage.getItem("adminLoginAttempts");

      if (blockUntil && new Date().getTime() < Number(blockUntil)) {
        setIsBlocked(true);
      } else {
        localStorage.removeItem("adminBlockUntil");
        setIsBlocked(false);
      }

      if (loginAttempts !== null) {
        setAttemptsLeft(5 - parseInt(loginAttempts));
      }
    },
    [navigate]
  );

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleForgotPassword() {
    localStorage.setItem("forgotContext", "admin");
    navigate("/forgot-password");
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    if (isBlocked) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/admin/login",
        {
          email: email,
          password: password,
        }
      );

      const data = response.data;

      // ✅ Store login info and reset lock
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);
      localStorage.removeItem("adminLoginAttempts");
      localStorage.removeItem("adminBlockUntil");

      navigate("/admin-dashboard", { replace: true });
    } catch (error) {
      // ✅ Handle login attempt failure
      let currentAttempts =
        parseInt(localStorage.getItem("adminLoginAttempts")) || 0;
      currentAttempts++;

      if (currentAttempts >= 5) {
        const blockTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem("adminBlockUntil", blockTime);
        localStorage.setItem("adminLoginAttempts", "5");
        setIsBlocked(true);
        setAttemptsLeft(0);

        alert(
          "❌ Too many failed attempts. Try again after 24 hours or reset your password."
        );
      } else {
        localStorage.setItem("adminLoginAttempts", currentAttempts.toString());
        setAttemptsLeft(5 - currentAttempts);

        alert(
          "❌ Invalid credentials. Attempts left: " + (5 - currentAttempts)
        );
      }
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div
          className="card shadow p-4"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          {isBlocked ? (
            // ✅ Show block message
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
            // ✅ Show login form
            <div>
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
                    onChange={handleEmailChange}
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
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                {attemptsLeft < 5 ? (
                  <div className="text-danger small mb-2">
                    Attempts left: {attemptsLeft}
                  </div>
                ) : null}

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
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLogin;
