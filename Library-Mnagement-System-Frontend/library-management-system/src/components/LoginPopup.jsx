// src/components/LoginPopup.js

import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Named function component instead of anonymous lambda
function LoginPopup(props) {
  const { onClose } = props;
  const navigate = useNavigate();

  // ✅ Handle navigation to login page
  function handleUserLogin() {
    navigate("/login");
  }

  // ✅ Handle navigation to registration page
  function handleRegister() {
    navigate("/user-register");
  }

  return (
    // 🔒 Modal with dark background and centered dialog
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">📚 Welcome to BookMate</h5>
            {/* Close button triggers parent-defined onClose handler */}
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body text-center">
            <p className="fs-5">
              Login or Register to begin your reading journey.
            </p>
            <div className="d-grid gap-2 mt-4">
              <button className="btn btn-primary" onClick={handleUserLogin}>
                Login
              </button>
              <button className="btn btn-success" onClick={handleRegister}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPopup;
