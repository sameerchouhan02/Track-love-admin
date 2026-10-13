import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const AdminLogin = ({ onLogin, isHindi, setIsHindi }) => {
  const [email, setEmail] = useState('admin@tracklovedones.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const t = (en, hi) => (isHindi ? hi : en);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3002/api/v1/admin_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.data?.token) {
        // Live token save karo
        localStorage.setItem('admin_token', result.data.token);
        onLogin();
      } else {
        setError(result.message || t('Invalid email or password.', 'अमान्य ईमेल या पासवर्ड।'));
      }
    } catch (err) {
      console.error(err);
      setError(t('Cannot connect to server.', 'सर्वर से कनेक्ट नहीं हो पा रहा है।'));
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.18) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), #090d16',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Top Language Switcher */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        zIndex: 10
      }}>
        <div className="lang-switcher" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.12)' }}>
          <button 
            className={`lang-btn ${!isHindi ? 'active' : ''}`}
            style={{ color: !isHindi ? 'var(--primary)' : '#cbd5e1' }}
            onClick={() => setIsHindi(false)}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${isHindi ? 'active' : ''}`}
            style={{ color: isHindi ? 'var(--primary)' : '#cbd5e1' }}
            onClick={() => setIsHindi(true)}
          >
            HI
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '430px',
        padding: '40px 36px',
        borderRadius: '24px',
        background: '#ffffff',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 40px rgba(14, 165, 233, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'pageEnter 0.4s ease-out',
        position: 'relative'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'var(--primary-gradient)',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            boxShadow: '0 10px 24px -4px var(--primary-glow)'
          }}>
            <ShieldCheck size={32} strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            {t('Admin Console', 'एडमिन कंसोल')}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            {t('Sign in to manage Track Loved Ones', 'प्रबंधन करने के लिए साइन इन करें')}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>
              {t('Admin Email', 'एडमिन ईमेल')}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '15px' }} />
              <input 
                type="email" 
                className="form-control" 
                placeholder="admin@tracklovedones.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>
              {t('Password', 'पासवर्ड')}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '15px' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-control" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '14px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '14px' }}
          >
            <span>{t('Login to Dashboard', 'डैशबोर्ड में लॉग इन करें')}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div style={{
          marginTop: '24px',
          padding: '14px 16px',
          background: '#f8fafc',
          borderRadius: '14px',
          border: '1px dashed #cbd5e1',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: '#64748b', letterSpacing: '0.6px', marginBottom: '4px' }}>
            {t('Default Demo Credentials', 'डिफ़ॉल्ट डेमो क्रेडेंशियल्स')}
          </div>
          <div style={{ fontSize: '13px', color: '#334155' }}>
            Email: <b style={{ color: '#0284c7' }}>admin@tracklovedones.com</b>
          </div>
          <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px' }}>
            Password: <b style={{ color: '#0284c7' }}>admin123</b>
          </div>
        </div>

      </div>

      {/* Footer Security Note */}
      <div style={{
        marginTop: '24px',
        color: '#64748b',
        fontSize: '12.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>🔒 256-Bit Encrypted Admin Authentication</span>
      </div>
    </div>
  );
};

export default AdminLogin;
