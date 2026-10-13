import React from 'react';

const RequestsModal = ({ isOpen, onClose, requests, onAccept, onReject, isHindi }) => {
  const t = (en, hi) => (isHindi ? hi : en);

  // We use CSS class .show to display it, but we can also just conditionally render
  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h3>{t('Pending Requests', 'लंबित अनुरोध')} ({requests.length})</h3>
        
        {requests.length > 0 ? (
          requests.map(req => (
            <div className="request" key={req.id}>
              <div className="request-avatar">{req.initials}</div>
              <div className="request-name">{req.name}</div>
              <div className="request-actions">
                <button className="ok" onClick={() => onAccept(req.id)}>✓</button>
                <button className="no" onClick={() => onReject(req.id)}>×</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">
            {t('No pending requests left!', 'कोई लंबित अनुरोध शेष नहीं है!')}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsModal;
