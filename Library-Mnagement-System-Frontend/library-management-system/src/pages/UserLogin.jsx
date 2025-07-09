import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

// User login page component
function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  // Runs on component load
  useEffect(
    function () {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      // Auto-redirect to dashboard if already logged in
      if (token && role === "user") {
        sessionStorage.setItem("refreshUserDashboard", "true");
        navigate("/user-dashboard");
        return;
      }

      // Check if user is blocked due to too many failed attempts
      const blockUntil = localStorage.getItem("blockUntil");
      if (blockUntil && new Date().getTime() < Number(blockUntil)) {
        setIsBlocked(true);
      } else {
        localStorage.removeItem("blockUntil");
        setIsBlocked(false);
      }

      // Load remaining attempts from previous session
      const loginAttempts = localStorage.getItem("loginAttempts");
      if (loginAttempts !== null) {
        setAttemptsLeft(5 - parseInt(loginAttempts));
      }
    },
    [navigate]
  );

  // Handles email input change
  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  // Handles password input change
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  // Handles login form submission
  function handleLogin(event) {
    event.preventDefault();
    if (isBlocked) return;

    const requestData = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:8080/api/users/login", requestData)
      .then(function (response) {
        const data = response.data;

        // Store token and user details
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);

        // Clear failed attempts
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("blockUntil");

        // Set refresh flag and redirect to dashboard
        sessionStorage.setItem("refreshUserDashboard", "true");
        navigate("/user-dashboard");
      })
      .catch(function () {
        let currentAttempts =
          parseInt(localStorage.getItem("loginAttempts")) || 0;
        currentAttempts++;

        // Block login after 5 failed attempts for 24 hours
        if (currentAttempts >= 5) {
          const blockTime = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem("blockUntil", blockTime.toString());
          localStorage.setItem("loginAttempts", "5");
          setIsBlocked(true);
          setAttemptsLeft(0);
          alert("Too many failed attempts. Try again after 24 hours.");
        } else {
          localStorage.setItem("loginAttempts", currentAttempts.toString());
          setAttemptsLeft(5 - currentAttempts);
          alert("Invalid credentials. Attempts left: " + (5 - currentAttempts));
        }
      });
  }

  // Handles forgot password click
  function handleForgotPassword() {
    localStorage.setItem("forgotContext", "user");
    navigate("/forgot-password");
  }

  // UI rendering
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div
          className="card shadow p-4"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          {isBlocked ? (
            // Show message if user is blocked
            <div className="text-center text-danger">
              <h5>Login Blocked</h5>
              <p>You have used all attempts. Try after 24 hours.</p>
              <button className="btn btn-link" onClick={handleForgotPassword}>
                Forgot Password?
              </button>
            </div>
          ) : (
            // Login form
            <div>
              <h3 className="text-center mb-4">User Login</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                {attemptsLeft < 5 && (
                  <div className="text-danger mb-2">
                    Attempts left: {attemptsLeft}
                  </div>
                )}
                <div className="mb-3 text-end">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
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

export default UserLogin;
