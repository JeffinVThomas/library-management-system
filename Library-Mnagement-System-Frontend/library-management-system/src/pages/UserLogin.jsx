import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);

  const navigate = useNavigate();

  // 🔁 Check block status on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") navigate("/admin-dashboard", { replace: true });
      else navigate("/user-dashboard", { replace: true });
    }

    const blockUntil = localStorage.getItem("blockUntil");
    const loginAttempts = localStorage.getItem("loginAttempts");

    if (blockUntil && new Date().getTime() < Number(blockUntil)) {
      setIsBlocked(true);
    } else {
      // Unblock user if 24 hrs passed
      localStorage.removeItem("blockUntil");
      setIsBlocked(false);
    }

    if (loginAttempts !== null) {
      setAttemptsLeft(5 - parseInt(loginAttempts, 10));
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isBlocked) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          email,
          password,
        }
      );

      const user = response.data;

      // ✅ Success - reset attempt counter and store data
      localStorage.setItem("token", "dummy-token");
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id); // ✅ Correct based on const user = response.data
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("blockUntil");

      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
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
    localStorage.setItem("forgotContext", "user");
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
              <h3 className="text-center mb-4">User Login</h3>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
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

                {/* 🔗 Forgot Password */}
                <div className="mb-3 text-end">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-primary"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Login
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

export default UserLogin;
