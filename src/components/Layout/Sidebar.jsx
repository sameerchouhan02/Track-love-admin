import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, isHindi, navItems, activePath, onClose, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const t = (en, hi) => (isHindi ? hi : en);
  const navigate = useNavigate();

  return (
    <>
      <div className={`mobile-scrim ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar-desktop ${!isOpen ? 'collapsed' : ''}`}>
        
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <Shield size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-title">Track Loved One</div>
            <div className="brand-subtitle">{t('Admin Portal', 'एडमिन पोर्टल')}</div>
          </div>
        </div>

        {/* User Card */}
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">
            AD
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Super Admin</div>
            <div className="sidebar-user-role">
              <span className="online-dot"></span>
              <span>{t('Active', 'सक्रिय')}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="nav-list">
          <div className="nav-group-title">{t('Menu', 'मेनू')}</div>
          {navItems.map((item, i) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;
            return (
              <React.Fragment key={i}>
                {item.isDivider && (
                  <div className="nav-group-title" style={{ marginTop: '12px' }}>
                    {t('Account', 'खाता')}
                  </div>
                )}
                <div 
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth <= 768 && onClose) {
                      onClose();
                    }
                  }}
                >
                  <span className="nav-icon">
                    {Icon && (typeof Icon === 'string' ? Icon : <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />)}
                  </span>
                  <span>{t(item.en, item.hi)}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Logout Button */}
        <div 
          className="logout-btn"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={18} />
          <span>{t('Logout', 'लॉग आउट')}</span>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          animation: 'pageEnter 0.2s ease-out'
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: '360px',
            padding: '28px',
            borderRadius: '18px',
            boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid #e2e8f0',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowLogoutModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
            >
              <X size={18} />
            </button>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <LogOut size={22} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
              {t('Confirm Logout', 'लॉग आउट की पुष्टि करें')}
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              {t('Are you sure you want to end your current session?', 'क्या आप वाकई अपना वर्तमान सत्र समाप्त करना चाहते हैं?')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowLogoutModal(false)}
              >
                {t('Cancel', 'रद्द करें')}
              </button>
              <button 
                className="btn btn-danger btn-sm"
                style={{ background: '#ef4444', color: 'white', border: 'none' }}
                onClick={() => { setShowLogoutModal(false); if (onLogout) onLogout(); }}
              >
                {t('Logout', 'लॉग आउट')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
