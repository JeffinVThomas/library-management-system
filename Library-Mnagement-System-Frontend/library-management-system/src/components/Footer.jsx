import React from "react";

const Footer = () => {
  return (
    <footer
      className="bg-dark text-light mt-auto py-3"
      style={{ overflow: "hidden" }}
    >
      <div className="container text-center small">
        <p className="mb-1">
          📚 <strong>Library Management System</strong> &copy;{" "}
          {new Date().getFullYear()}
        </p>
        <p className="mb-1">
          Built with ❤️ by <strong>Jeffin</strong>
        </p>
        <div className="d-flex justify-content-center gap-3">
          <a
            href="mailto:jeffin@example.com"
            className="text-light text-decoration-none"
          >
            📧 Contact
          </a>
          <a href="#" className="text-light text-decoration-none">
            🔒 Privacy
          </a>
          <a href="#" className="text-light text-decoration-none">
            📄 Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
