import React from 'react';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{label}</span>
      </div>
      <div className="text-muted mt-2 small">{label}</div>
    </div>
  );
}
