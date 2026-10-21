import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Search, Bell, AlertTriangle, Phone, Battery, 
  MapPin, X, CheckCircle, ExternalLink, ShieldAlert, RefreshCw 
} from 'lucide-react';
import { apiClient } from '../../_config/api';

const Topbar = ({ toggleSidebar, isHindi, setIsHindi, titleEn, titleHi, adminProfile }) => {
  const [alerts, setAlerts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const prevCountRef = useRef(0);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // 🔔 Browser Audio Beep/Siren jab naya alert aaye
  const playAlertSiren = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not allowed yet by browser interaction');
    }
  };

  // 📡 Active SOS Alerts fetch karne ka function
  const fetchActiveAlerts = async () => {
    try {
      const res = await apiClient.get('/sos/active');
      if (res.data?.success) {
        const fetchedAlerts = res.data.data || [];
        // Agar naya alert judta hai to siren bajaayein
        if (fetchedAlerts.length > prevCountRef.current && prevCountRef.current !== 0) {
          playAlertSiren();
        }
        prevCountRef.current = fetchedAlerts.length;
        setAlerts(fetchedAlerts);
      }
    } catch (err) {
      console.error('Error fetching SOS alerts:', err.message);
    }
  };

  // Har 8 seconds me automatically check karega
  useEffect(() => {
    fetchActiveAlerts();
    const interval = setInterval(fetchActiveAlerts, 8000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Alert Resolve karne ka handler
  const handleResolveAlert = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      setResolvingId(id);
      const res = await apiClient.patch(`/sos/resolve/${id}`);
      if (res.data?.success) {
        setAlerts(prev => prev.filter(a => a._id !== id));
        if (selectedAlert?._id === id) {
          setSelectedAlert(null);
        }
      }
    } catch (err) {
      alert('Failed to resolve alert: ' + err.message);
    } finally {
      setResolvingId(null);
    }
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

        {/* 🔔 Notifications Icon Button */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            title={isHindi ? "आपातकालीन सूचनाएं" : "Emergency Alerts"}
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              borderColor: alerts.length > 0 ? '#ef4444' : undefined,
              background: alerts.length > 0 ? '#fef2f2' : '#ffffff',
            }}
          >
            <Bell size={18} color={alerts.length > 0 ? '#ef4444' : 'var(--text-secondary)'} />
            
            {/* Glowing Red Badge agar alerts hon */}
            {alerts.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '999px',
                padding: '1px 6px',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
                animation: 'pulse 1.5s infinite'
              }}>
                {alerts.length}
              </span>
            )}
          </button>

          {/* 📋 Dropdown List (Bell Click par) */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '360px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
              border: '1px solid #e2e8f0',
              zIndex: 9999,
              overflow: 'hidden'
            }}>
              {/* Dropdown Header */}
              <div style={{
                padding: '14px 18px',
                background: alerts.length > 0 ? '#fee2e2' : '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} color={alerts.length > 0 ? '#dc2626' : '#64748b'} />
                  <span style={{ fontWeight: '700', fontSize: '14px', color: alerts.length > 0 ? '#991b1b' : '#334155' }}>
                    {isHindi ? `आपातकालीन अलर्ट्स (${alerts.length})` : `Emergency SOS (${alerts.length})`}
                  </span>
                </div>
                <button 
                  onClick={fetchActiveAlerts} 
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
                  title="Refresh"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Dropdown Content */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748b' }}>
                    <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '13px', margin: 0, fontWeight: '500' }}>
                      {isHindi ? "सब सुरक्षित है! कोई नया अलर्ट नहीं है।" : "All clear! No active emergency alerts."}
                    </p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div 
                      key={alert._id}
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowDropdown(false);
                      }}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        background: '#ffffff',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '13.5px', color: '#0f172a' }}>
                          {alert.userId?.name || 'Unknown User'}
                        </span>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: alert.triggerType === 'POWER_BUTTON_3_CLICK' ? '#ef4444' : '#f59e0b',
                          color: 'white'
                        }}>
                          {alert.triggerType === 'POWER_BUTTON_3_CLICK' ? '⚡ 3-Click Power' : '🚨 In-App SOS'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> {alert.userId?.phone || 'No Phone'}
                        </span>
                        {alert.batteryPercentage != null && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Battery size={12} /> {alert.batteryPercentage}%
                          </span>
                        )}
                      </div>

                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: '600' }}>
                          {isHindi ? "मैप देखें →" : "View Map →"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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

      {/* 🗺️ MODAL: USER DETAILS & LIVE GOOGLE MAP */}
      {selectedAlert && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          animation: 'pageEnter 0.2s ease-out'
        }}>
          <div style={{
            background: 'white',
            width: '95%',
            maxWidth: '560px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(220, 38, 38, 0.3)',
            border: '2px solid #ef4444'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
              padding: '20px 24px',
              color: 'white',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <AlertTriangle size={24} color="#fef08a" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                  {isHindi ? "🚨 लाइव आपातकालीन चेतावनी (SOS)" : "🚨 LIVE EMERGENCY SOS ALERT"}
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', opacity: 0.9 }}>
                Trigger Source: <strong style={{ textDecoration: 'underline' }}>{selectedAlert.triggerType}</strong> • {new Date(selectedAlert.createdAt).toLocaleString()}
              </p>
              <button 
                onClick={() => setSelectedAlert(null)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* User Quick Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                marginBottom: '18px'
              }}>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a' }}>
                    {selectedAlert.userId?.name || 'Victim User'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    Phone: <strong>{selectedAlert.userId?.phone || 'N/A'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedAlert.userId?.phone && (
                    <a 
                      href={`tel:${selectedAlert.userId.phone}`}
                      style={{
                        padding: '8px 14px',
                        background: '#10b981',
                        color: 'white',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Phone size={14} /> Call Now
                    </a>
                  )}
                </div>
              </div>

              {/* 🗺️ Embedded Google Maps Iframe */}
              <div style={{ marginBottom: '16px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                <iframe 
                  title="Victim Location"
                  width="100%" 
                  height="260" 
                  style={{ border: 0, display: 'block' }}
                  src={`https://maps.google.com/maps?q=${selectedAlert.location?.coordinates?.[1] || 28.6139},${selectedAlert.location?.coordinates?.[0] || 77.2090}&hl=en&z=15&output=embed`}
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Coordinates and External Map Link */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  GPS: {selectedAlert.location?.coordinates?.[1]?.toFixed(5)}, {selectedAlert.location?.coordinates?.[0]?.toFixed(5)}
                </div>
                <a 
                  href={`https://www.google.com/maps?q=${selectedAlert.location?.coordinates?.[1]},${selectedAlert.location?.coordinates?.[0]}`}
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#2563eb',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Open in Full Google Maps <ExternalLink size={13} />
                </a>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setSelectedAlert(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: 'white',
                    color: '#334155',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Close Window
                </button>
                <button
                  disabled={resolvingId === selectedAlert._id}
                  onClick={(e) => handleResolveAlert(selectedAlert._id, e)}
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle size={16} /> 
                  {resolvingId === selectedAlert._id ? "Resolving..." : "Mark as Resolved & Safe"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
