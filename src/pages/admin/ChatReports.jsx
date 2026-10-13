import React, { useState } from 'react';
import { ShieldAlert, Radio, Send, CheckCircle2 } from 'lucide-react';

const ChatReports = ({ isHindi }) => {
  const [announcement, setAnnouncement] = useState('');
  const [broadcasted, setBroadcasted] = useState(false);

  const t = (en, hi) => (isHindi ? hi : en);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    setBroadcasted(true);
    setAnnouncement('');
    setTimeout(() => setBroadcasted(false), 3500);
  };

  return (
    <div className="content">
      {broadcasted && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 20px',
          borderRadius: '12px',
          background: '#10b981',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          fontSize: '14.5px',
          fontWeight: '600',
          animation: 'pageEnter 0.25s ease-out'
        }}>
          <CheckCircle2 size={20} />
          <span>{t('Broadcast announcement sent to all users!', 'सभी उपयोगकर्ताओं को घोषणा भेजी गई!')}</span>
        </div>
      )}

      <div style={{ marginBottom: '8px' }}>
        <h2 className="page-title">{t('Communications & Reports', 'संचार और रिपोर्ट')}</h2>
        <p className="page-subtitle">
          {t('Review community safety flags and broadcast urgent announcements to users.', 'उपयोगकर्ता रिपोर्ट और सिस्टम-व्यापी घोषणाओं को प्रबंधित करें।')}
        </p>
      </div>
      
      <div className="grid-2">
        {/* Reported Chats Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} />
            </div>
            <h3 className="section-title" style={{ margin: 0 }}>
              {t('Reported Chats', 'रिपोर्ट की गई चैट')}
            </h3>
          </div>

          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {t('Review conversations flagged by users for abuse or policy violations.', 'दुर्व्यवहार के लिए रिपोर्ट की गई बातचीत की समीक्षा करें।')}
          </p>

          <div className="empty-state" style={{ flex: 1, padding: '40px 20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CheckCircle2 size={32} />
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
              {t('All Caught Up!', 'सब कुछ साफ़ है!')}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {t('Zero pending chat abuse reports requiring moderation.', 'कोई लंबित रिपोर्ट नहीं।')}
            </div>
          </div>
        </div>

        {/* Global Broadcast Section */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={20} />
            </div>
            <h3 className="section-title" style={{ margin: 0 }}>
              {t('Global Announcement', 'वैश्विक घोषणा')}
            </h3>
          </div>

          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {t('Push an instant high-priority system notification to all mobile & web app users.', 'सभी उपयोगकर्ताओं को एक सिस्टम अधिसूचना भेजें।')}
          </p>

          <form onSubmit={handleBroadcast}>
            <div className="form-group">
              <label className="form-label">{t('Announcement Message', 'घोषणा संदेश')}</label>
              <textarea 
                className="form-control"
                placeholder={t('Type system notification content here...', 'अपनी घोषणा यहां टाइप करें...')}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                required
                style={{ minHeight: '130px' }}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              {t('Broadcast to All Users', 'सभी को प्रसारित करें')}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatReports;
