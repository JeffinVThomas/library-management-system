import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Profile() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email") || "user@example.com";
  const role = localStorage.getItem("role") || "user";

  // ✅ Redirect to login if no token
  useEffect(
    function () {
      if (!token) {
        navigate("/login");
      }
    },
    [token, navigate]
  );

  // ✅ Clear localStorage and navigate to login
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  }

  // ✅ Navigate to forgot-password page
  function handleChangePassword() {
    navigate("/forgot-password");
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container flex-grow-1 py-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
          <h3 className="text-center mb-4">👤 User Profile</h3>

          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Role:</strong> {role === "admin" ? "Administrator" : "User"}
          </p>

          <button
            className="btn btn-outline-primary mt-3 w-100"
            onClick={handleChangePassword}
          >
            🔒 Change Password
          </button>

          <button className="btn btn-danger mt-3 w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
