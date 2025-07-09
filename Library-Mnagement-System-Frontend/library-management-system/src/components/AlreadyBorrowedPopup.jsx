import React from "react";
import { useNavigate } from "react-router-dom";

const AlreadyBorrowedPopup = function () {
  var navigate = useNavigate();

  // Handler for close button - redirect to My Books page
  function handleClose() {
    navigate("/my-books");
  }

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header bg-warning">
            <h5 className="modal-title">⚠️ Already Borrowed</h5>
          </div>
          <div className="modal-body">
            <p>
              You have already borrowed this book and haven't returned it yet.
              Please return the book before borrowing again.
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Go to My Books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlreadyBorrowedPopup;
