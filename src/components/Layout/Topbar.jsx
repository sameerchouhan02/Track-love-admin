import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';

const Topbar = ({ toggleSidebar, isHindi, setIsHindi, titleEn, titleHi, adminProfile }) => {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="appbar">
      <button 
        className="icon-btn"
        style={{ border: 'none', background: 'transparent' }}
        onClick={toggleSidebar}
        title="Toggle Menu"
      >
        <Menu size={22} color="var(--text-main)" />
      </button>

      <div className="title">
        {isHindi ? titleHi : titleEn}
      </div>

      <div className="hide-on-mobile" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <div className="topbar-search">
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder={isHindi ? "प्लेटफॉर्म में खोजें..." : "Search users, posts, reports..."} 
          />
          <span className="search-shortcut">⌘K</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', flexShrink: 0, position: 'relative' }}>
        {/* Language Pill Switcher */}
        <div className="lang-switcher">
          <button 
            className={`lang-btn ${!isHindi ? 'active' : ''}`}
            onClick={() => setIsHindi(false)}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${isHindi ? 'active' : ''}`}
            onClick={() => setIsHindi(true)}
          >
            HI
          </button>
        </div>

        {/* Mini Admin Profile Chip */}
        <div 
          className="hide-on-mobile" 
          onClick={() => navigate('/admin-profile')}
          title="My Profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 10px 4px 6px',
            borderRadius: '999px',
            background: '#f8fafc',
            border: '1px solid var(--border)',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'var(--primary-gradient)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '700',
            overflow: 'hidden'
          }}>
            {adminProfile?.avatar ? (
              <img 
                src={adminProfile.avatar} 
                alt={adminProfile.name || 'Admin'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              getInitials(adminProfile?.name)
            )}
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap'  }}>
            {adminProfile?.name || 'Super Admin'}
          </span>
        </div>
      </div>

    </header>
  );
};

export default Topbar;
