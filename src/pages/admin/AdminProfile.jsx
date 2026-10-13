import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Camera, Trash2, CheckCircle2 } from 'lucide-react';

const AdminProfile = ({ isHindi }) => {
  const [name, setName] = useState('Super Admin');
  const [email] = useState('admin@tracklovedones.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const t = (en, hi) => (isHindi ? hi : en);

  const handleSave = (e) => {
    e.preventDefault();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3500);
  };

  return (
    <div className="content">
      {/* Toast Notification */}
      {showSavedToast && (
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
          <span>{t('Profile settings saved successfully!', 'प्रोफ़ाइल सेटिंग्स सफलतापूर्वक सहेजी गईं!')}</span>
        </div>
      )}

      <div style={{ marginBottom: '8px' }}>
        <h2 className="page-title">{t('My Profile', 'मेरी प्रोफाइल')}</h2>
        <p className="page-subtitle">
          {t('Manage your admin account credentials, avatar, and contact preferences.', 'अपना व्यक्तिगत विवरण और प्रोफ़ाइल चित्र अपडेट करें।')}
        </p>
      </div>

      <div className="grid-2">
        {/* Profile Picture Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h3 className="section-title" style={{ alignSelf: 'flex-start' }}>
            {t('Profile Picture', 'प्रोफ़ाइल चित्र')}
          </h3>

          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'var(--primary-gradient)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '38px',
            fontWeight: '800',
            margin: '12px 0 20px',
            boxShadow: '0 12px 24px -6px var(--primary-glow)',
            border: '4px solid #ffffff'
          }}>
            AD
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '240px' }}>
            {t('Allowed formats: JPG, PNG, GIF. Max file size: 2MB.', 'अनुमत स्वरूप: JPG, PNG, GIF. अधिकतम आकार: 2MB.')}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-primary btn-sm">
              <Camera size={15} />
              {t('Upload New', 'नया अपलोड करें')}
            </button>
            <button type="button" className="btn btn-secondary btn-sm">
              <Trash2 size={15} />
              {t('Remove', 'हटाएं')}
            </button>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="card">
          <h3 className="section-title">
            {t('Personal Information', 'व्यक्तिगत जानकारी')}
          </h3>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color="var(--primary)" />
                {t('Full Name', 'पूरा नाम')}
              </label>
              <input 
                type="text" 
                className="form-control" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} color="var(--primary)" />
                {t('Email Address', 'ईमेल पता')}
              </label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                disabled 
                style={{ background: '#f8fafc', color: 'var(--text-muted)', cursor: 'not-allowed' }} 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color="var(--primary)" />
                {t('Phone Number', 'फ़ोन नंबर')}
              </label>
              <input 
                type="tel" 
                className="form-control" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} color="var(--primary)" />
                {t('Designation / Role', 'पद / भूमिका')}
              </label>
              <input 
                type="text" 
                className="form-control" 
                defaultValue="Super Admin (Root Access)" 
                disabled 
                style={{ background: '#f8fafc', color: 'var(--text-muted)', cursor: 'not-allowed' }} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {t('Save Changes', 'परिवर्तन सहेजें')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
