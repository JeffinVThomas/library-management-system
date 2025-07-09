// src/components/FinePopup.js

import React from "react";
import "../styling/FinePopup.css"; // FinePopup modal styling

// ✅ Fresher-friendly named function instead of anonymous function
function FinePopup(props) {
  const { show, onClose, onPay, fineAmount } = props;

  // ⛔ Do not render the popup if `show` is false
  if (!show) return null;

  return (
    <div className="fine-popup-overlay">
      <div className="fine-popup-box">
        <h4 className="mb-3 text-danger">⚠️ Fine Payment Required</h4>
        <p>
          You returned this book late. Please pay a fine of ₹{fineAmount} to
          continue borrowing books.
        </p>
        <div className="d-flex justify-content-end gap-3 mt-4">
          {/* Cancel button closes the popup without paying */}
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </button>

          {/* Pay button triggers the fine payment logic */}
          <button className="btn btn-success" onClick={onPay}>
            Pay Fine
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinePopup;
