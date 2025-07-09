import React from "react";
import { Link } from "react-router-dom";

const NotFound = function () {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <h1 className="display-4 text-danger mb-3">404</h1>
      <h4 className="mb-4">🚫 Page Not Found</h4>
      <p className="mb-3">Sorry, the page you're looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        ⬅️ Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
