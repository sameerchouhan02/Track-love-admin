import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const Topbar = ({ toggleSidebar, isHindi, setIsHindi, titleEn, titleHi }) => {
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', flexShrink: 0  }}>
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

        {/* Notifications Icon */}
        <button className="icon-btn" title={isHindi ? "सूचनाएं" : "Notifications"}>
          <Bell size={18} />
          <span className="icon-badge"></span>
        </button>

        {/* Mini Admin Profile Chip */}
        <div className="hide-on-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 10px 4px 6px',
          borderRadius: '999px',
          background: '#f8fafc',
          border: '1px solid var(--border)',
          cursor: 'pointer'
        }}>
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
            fontWeight: '700'
          }}>
            AD
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap'  }}>
            Super Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
