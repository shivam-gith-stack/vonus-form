import React from 'react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal" tabIndex="-1">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            onClick={onCancel}
            className="modal-close"
            aria-label="Close confirmation modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
