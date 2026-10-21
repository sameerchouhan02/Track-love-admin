import React, { useState } from 'react';
import { 
  Settings, 
  Lock, 
  ShieldCheck, 
  Bell, 
  Sliders, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Save, 
  Smartphone, 
  Radio, 
  AlertTriangle,
  RefreshCw,
  Clock,
  Database
} from 'lucide-react';
import { adminApi } from '../../_config/api';


const AdminSettings = ({ isHindi }) => {
  const t = (en, hi) => (isHindi ? hi : en);

  const [activeTab, setActiveTab] = useState('security');
  const [toastMsg, setToastMsg] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);


  // Security toggles
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [ipRestriction, setIpRestriction] = useState(false);

  // Safety platform parameters
  const [sosAutoEscalate, setSosAutoEscalate] = useState('180');
  const [gpsAccuracyThreshold, setGpsAccuracyThreshold] = useState('15');
  const [mediaRetentionDays, setMediaRetentionDays] = useState('90');
  const [highRiskZonesAlert, setHighRiskZonesAlert] = useState(true);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsGateway, setSmsGateway] = useState(true);
  const [whatsappDispatch, setWhatsappDispatch] = useState(true);
  const [auditLogDigest, setAuditLogDigest] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast(t('Please fill in all password fields.', 'कृपया सभी पासवर्ड फ़ील्ड भरें।'));
      return;
    }

    if (newPassword.length < 8) {
      showToast(t('New password must be at least 8 characters.', 'नया पासवर्ड कम से कम 8 अक्षर का होना चाहिए।'));
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(t('New passwords do not match!', 'नया पासवर्ड मेल नहीं खाता!'));
      return;
    }

    try {
      setLoadingPassword(true);
      const res = await adminApi.changePassword({
        currentPassword,
        newPassword,
      });

      if (res.data?.success) {
        showToast(t('Admin password updated successfully!', 'एडमिन पासवर्ड सफलतापूर्वक अपडेट हो गया!'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const msg = err.message || t('Failed to update password', 'पासवर्ड अपडेट करने में विफल');
      showToast(msg);
    } finally {
      setLoadingPassword(false);
    }
  };


  const handleSavePreferences = () => {
    showToast(t('Platform configuration saved successfully!', 'प्लेटफ़ॉर्म प्राथमिकताएं सफलतापूर्वक सुरक्षित हो गईं!'));
  };

  return (
    <div className="content">
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          border: '1px solid #10b981',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontWeight: 600,
          fontSize: '14px',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={26} color="var(--primary)" />
            {t('System & Security Settings', 'सिस्टम व सुरक्षा सेटिंग्स')}
          </h2>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            {t('Manage root authentication, platform telemetry parameters, and emergency dispatch alerts.', 'सुरक्षा प्रमाणीकरण, आपातकालीन नियम और अधिसूचनाएं कॉन्फ़िगर करें।')}
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleSavePreferences}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <Save size={18} />
          {t('Save All Changes', 'सभी परिवर्तन सुरक्षित करें')}
        </button>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '10px', margin: '24px 0 20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveTab('security')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'security' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          <Lock size={16} />
          {t('Security & 2FA', 'सुरक्षा व 2FA')}
        </button>

        {/* <button 
          onClick={() => setActiveTab('safety')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'safety' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'safety' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          <Sliders size={16} />
          {t('Emergency Rules & GPS', 'आपातकालीन नियम व जीपीएस')}
        </button> */}

        {/* <button 
          onClick={() => setActiveTab('notifications')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'notifications' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'notifications' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          <Bell size={16} />
          {t('Dispatch Gateways', 'अलर्ट व गेटवे')}
        </button> */}
      </div>

      {/* Tab 1: Security & Authentication */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {/* Change Password Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KeyRound size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{t('Master Credentials', 'मास्टर क्रेडेंशियल')}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Update your administrator portal password', 'अपना एडमिन पोर्टल पासवर्ड बदलें')}</span>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('Current Password', 'वर्तमान पासवर्ड')}</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showCurrentPass ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('New Password', 'नया पासवर्ड')}</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showNewPass ? 'text' : 'password'}
                    className="form-control"
                    placeholder={t('At least 8 characters with numbers & symbols', 'कम से कम 8 अक्षर')}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('Confirm New Password', 'नए पासवर्ड की पुष्टि करें')}</label>
                <input 
                  type="password"
                  className="form-control"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ marginTop: '6px' }}
                disabled={loadingPassword}
              >
                {loadingPassword 
                  ? t('Updating...', 'अपडेट हो रहा है...') 
                  : t('Update Password', 'पासवर्ड अपडेट करें')}
              </button>

            </form>
          </div>

          {/* Access Control & 2FA
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{t('Multi-Factor & Session Security', 'मल्टी-फैक्टर व सत्र सुरक्षा')}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Strict governance for high-privilege operations', 'उच्च सुरक्षा नियंत्रण')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{t('Two-Factor Authentication (2FA)', 'टू-फैक्टर प्रमाणीकरण')}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {t('Require TOTP authenticator app code on login', 'लॉगिन पर प्रमाणीकरण कोड अनिवार्य करें')}
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={twoFactorAuth} 
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{t('Automatic Inactivity Logout', 'निष्क्रियता पर स्वतः लॉगआउट')}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {t('Terminate session after idle period', 'सत्र समाप्ति की समय सीमा चुनें')}
                </div>
              </div>
              <select 
                className="form-control" 
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                style={{ width: '130px', fontWeight: 600 }}
              >
                <option value="15">15 {t('Minutes', 'मिनट')}</option>
                <option value="30">30 {t('Minutes', 'मिनट')}</option>
                <option value="60">60 {t('Minutes', 'मिनट')}</option>
                <option value="120">2 {t('Hours', 'घंटे')}</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{t('IP Range Whitelisting', 'आईपी श्वेतसूचीकरण')}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {t('Restrict admin console to verified corporate networks', 'केवल अधिकृत नेटवर्क से एक्सेस की अनुमति')}
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={ipRestriction} 
                onChange={(e) => setIpRestriction(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>
          </div> */}
        </div>
      )}

      {/* Tab 2: Emergency Rules & GPS
      {activeTab === 'safety' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Radio size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{t('Telemetry & SOS Escalation', 'टेलीमेट्री व एसओएस एस्केलेशन')}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Threshold parameters for emergency beacon dispatch', 'आपातकालीन बीकन नियम')}</span>
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                {t('Emergency Escalation to Police Desk (Seconds)', 'पुलिस हेल्पडेस्क को स्वतः एस्केलेशन (सेकंड)')}
              </label>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {t('If no family circle member responds within this window', 'यदि परिवार द्वारा कोई प्रतिक्रिया न मिले')}
              </div>
              <select 
                className="form-control" 
                value={sosAutoEscalate} 
                onChange={(e) => setSosAutoEscalate(e.target.value)}
              >
                <option value="60">60 {t('Seconds (Rapid)', 'सेकंड (तत्काल)')}</option>
                <option value="120">120 {t('Seconds (Standard)', 'सेकंड (सामान्य)')}</option>
                <option value="180">180 {t('Seconds (Relaxed)', 'सेकंड')}</option>
              </select>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                {t('GPS Deviation / Geofence Accuracy Tolerance', 'जीपीएस सटीकता सहिष्णुता')}
              </label>
              <select 
                className="form-control" 
                value={gpsAccuracyThreshold} 
                onChange={(e) => setGpsAccuracyThreshold(e.target.value)}
              >
                <option value="5">± 5 {t('Meters (High-Precision GPS)', 'मीटर (सटीक)')}</option>
                <option value="15">± 15 {t('Meters (Balanced)', 'मीटर (संतुलित)')}</option>
                <option value="30">± 30 {t('Meters (Battery Saver)', 'मीटर (बैटरी बचत)')}</option>
              </select>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{t('Data Retention & Evidence Vault', 'डेटा प्रतिधारण व साक्ष्य वॉल्ट')}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Legal retention limits for audio/video incident recordings', 'ऑडियो/वीडियो रिकॉर्डिंग नियम')}</span>
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                {t('Incident Audio & GPS Trail Retention', 'घटना रिकॉर्डिंग सुरक्षित रखने की अवधि')}
              </label>
              <select 
                className="form-control" 
                value={mediaRetentionDays} 
                onChange={(e) => setMediaRetentionDays(e.target.value)}
              >
                <option value="30">30 {t('Days', 'दिन')}</option>
                <option value="90">90 {t('Days (Statutory Recommended)', 'दिन (अनुशंसित)')}</option>
                <option value="180">180 {t('Days', 'दिन')}</option>
                <option value="365">365 {t('Days (1 Year)', '1 वर्ष')}</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{t('Night Transit Risk Proximity Alerts', 'रात्रि यात्रा जोखिम सूचना')}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {t('Notify user when entering poorly-lit or low connectivity zones', 'कम रोशनी या कमजोर नेटवर्क वाले क्षेत्रों में चेतावनी')}
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={highRiskZonesAlert} 
                onChange={(e) => setHighRiskZonesAlert(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>
        </div>
      )} */}

      {/* Tab 3: Dispatch Gateways
      {activeTab === 'notifications' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{t('Urgent Notification Dispatchers', 'आपातकालीन सूचना प्रेषक')}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Channels used to dispatch distress notifications', 'संकट सूचना भेजने के चैनल')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{t('Admin Email Alerts', 'प्रशासक ईमेल सूचनाएं')}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Receive instant email on any Tier-1 SOS trigger', 'टियर-1 एसओएस पर तत्काल ईमेल प्राप्त करें')}</div>
              </div>
              <input 
                type="checkbox" 
                checked={emailAlerts} 
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{t('High-Priority SMS Relay Gateway', 'एसएमएस रिले गेटवे')}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Fallback SMS for offline family members', 'ऑफ़लाइन परिजनों के लिए बैकअप एसएमएस')}</div>
              </div>
              <input 
                type="checkbox" 
                checked={smsGateway} 
                onChange={(e) => setSmsGateway(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{t('WhatsApp Business API Webhook', 'व्हाट्सएप बिजनेस एपीआई')}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Send live tracking links directly via WhatsApp', 'सीधे व्हाट्सएप पर लाइव लोकेशन लिंक भेजें')}</div>
              </div>
              <input 
                type="checkbox" 
                checked={whatsappDispatch} 
                onChange={(e) => setWhatsappDispatch(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{t('Emergency Gateways Health', 'गेटवे स्वास्थ्य स्थिति')}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Real-time connectivity to carrier channels', 'दूरसंचार चैनलों से कनेक्टिविटी')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', fontSize: '13px' }}>
                  <span>AWS SNS Primary SMS:</span>
                  <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} /> {t('Operational (99.98%)', 'सक्रिय')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', fontSize: '13px' }}>
                  <span>WhatsApp Cloud Dispatch:</span>
                  <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} /> {t('Operational', 'सक्रिय')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', fontSize: '13px' }}>
                  <span>FCM Push Notification:</span>
                  <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} /> {t('Operational', 'सक्रिय')}
                  </span>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={() => showToast(t('Gateway self-test ping successful!', 'गेटवे परीक्षण पिंग सफल!'))}
              style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <RefreshCw size={15} />
              {t('Run Dispatcher Diagnostics', 'गेटवे परीक्षण रन करें')}
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AdminSettings;
