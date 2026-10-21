import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, ShieldCheck, Camera, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { adminApi } from '../../_config/api';

const AdminProfile = ({ isHindi }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  const t = (en, hi) => (isHindi ? hi : en);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1️⃣ Fetch Profile on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await adminApi.getProfile();
        if (res.data?.success && res.data?.data) {
          const admin = res.data.data;
          setName(admin.name || '');
          setEmail(admin.email || '');
          setPhone(admin.phone || '');
          setAvatarUrl(admin.avatar || '');
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        showToast(
          err.response?.data?.message || t('Failed to load profile', 'प्रोफ़ाइल लोड करने में विफल'),
          'error'
        );
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  // 2️⃣ Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast(t('File size must be less than 2MB', 'फ़ाइल का आकार 2MB से कम होना चाहिए'), 'error');
      return;
    }

    // Validate format
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type)) {
      showToast(t('Only JPG, PNG, GIF or WEBP images allowed', 'केवल JPG, PNG, GIF या WEBP अनुमत हैं'), 'error');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoveAvatar(false);
  };

  // 3️⃣ Remove / Delete Avatar Directly from Database
  const handleRemoveImage = async () => {
    // Agar sirf local file select ki thi aur server pe avatar nahi tha
    if (selectedFile && !avatarUrl) {
      setSelectedFile(null);
      setPreviewUrl('');
      setRemoveAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setRemovingAvatar(true);
      const formData = new FormData();
      if (name) formData.append('name', name.trim());
      if (phone) formData.append('phone', phone.trim());
      formData.append('removeAvatar', 'true');

      const res = await adminApi.updateProfile(formData);
      if (res.data?.success) {
        showToast(t('Profile picture removed successfully!', 'प्रोफ़ाइल चित्र सफलतापूर्वक हटा दिया गया!'));
        const updated = res.data.data;
        setAvatarUrl('');
        setSelectedFile(null);
        setPreviewUrl('');
        setRemoveAvatar(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        if (updated) {
          localStorage.setItem('admin_user_data', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('admin_profile_updated', { detail: updated }));
        }
      }
    } catch (err) {
      console.error('Error removing profile picture:', err);
      showToast(
        err.response?.data?.message || t('Failed to remove profile picture', 'प्रोफ़ाइल चित्र हटाने में विफल'),
        'error'
      );
    } finally {
      setRemovingAvatar(false);
    }
  };

  // 4️⃣ Handle Profile Save
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast(t('Name is required', 'नाम आवश्यक है'), 'error');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('phone', phone.trim());

      if (selectedFile) {
        formData.append('avatar', selectedFile);
      } else if (removeAvatar) {
        formData.append('removeAvatar', 'true');
      }

      const res = await adminApi.updateProfile(formData);
      if (res.data?.success) {
        showToast(t('Profile settings saved successfully!', 'प्रोफ़ाइल सेटिंग्स सफलतापूर्वक सहेजी गईं!'));
        const updated = res.data.data;
        if (updated) {
          setAvatarUrl(updated.avatar || '');
          if (updated.name) setName(updated.name);
          if (updated.phone !== undefined) setPhone(updated.phone);
          setSelectedFile(null);
          setPreviewUrl('');
          setRemoveAvatar(false);
          localStorage.setItem('admin_user_data', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('admin_profile_updated', { detail: updated }));
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast(
        err.response?.data?.message || t('Failed to update profile', 'प्रोफ़ाइल अपडेट करने में विफल'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (str) => {
    if (!str) return 'AD';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const currentDisplayAvatar = previewUrl || avatarUrl;

  return (
    <div className="content">
      {/* Toast Alert */}
      {toast && (
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
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          fontSize: '14.5px',
          fontWeight: '600',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Title */}
      <div style={{ marginBottom: '16px' }}>
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

          {/* Hidden File Input */}
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
            style={{ display: 'none' }}
          />

          {/* Avatar Display */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            margin: '12px 0 20px',
            boxShadow: '0 12px 24px -6px var(--primary-glow)',
            border: '4px solid #ffffff',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--primary-gradient)',
            position: 'relative'
          }}>
            {currentDisplayAvatar ? (
              <img 
                src={currentDisplayAvatar} 
                alt="Admin Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <span style={{ fontSize: '38px', fontWeight: '800', color: 'white' }}>
                {getInitials(name)}
              </span>
            )}
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '240px' }}>
            {t('Allowed formats: JPG, PNG, GIF. Max file size: 2MB.', 'अनुमत स्वरूप: JPG, PNG, GIF. अधिकतम आकार: 2MB.')}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={15} />
              {t('Upload New', 'नया अपलोड करें')}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleRemoveImage}
              disabled={(!selectedFile && !avatarUrl) || removingAvatar || loading}
            >
              {removingAvatar ? (
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Trash2 size={15} />
              )}
              {removingAvatar ? t('Removing...', 'हटा रहे हैं...') : t('Remove', 'हटाएं')}
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
                placeholder={fetching ? t('Loading...', 'लोड हो रहा है...') : t('Enter your full name', 'अपना नाम दर्ज करें')}
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
                placeholder={t('Enter phone number (e.g. +91 98765 43210)', 'फ़ोन नंबर दर्ज करें')}
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

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              disabled={loading || fetching}
            >
              {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? t('Saving Changes...', 'सहेज रहे हैं...') : t('Save Changes', 'परिवर्तन सहेजें')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
