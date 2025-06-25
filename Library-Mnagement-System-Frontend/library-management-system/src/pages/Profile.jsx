import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email") || "user@example.com";
  const role = localStorage.getItem("role") || "user";

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  };

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

          <button className="btn btn-danger mt-3 w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
