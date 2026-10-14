import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  FileCheck2 
} from 'lucide-react';
import { adminApi } from '../../_config/api';

const AdminDashboard = ({ isHindi }) => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const t = (en, hi) => (isHindi ? hi : en);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingUsers(true);
        const res = await adminApi.getUsers();
        if (res.data?.success && Array.isArray(res.data.data)) {
          setTotalUsers(res.data.data.length);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="content">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)',
        borderRadius: '20px',
        padding: '32px 36px',
        color: 'white',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            background: 'rgba(14, 165, 233, 0.15)',
            color: '#38bdf8',
            padding: '4px 10px',
            borderRadius: '999px',
            marginBottom: '10px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }}></span>
            {t('Live System Active', 'लाइव सिस्टम सक्रिय')}
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            {t('Welcome back, Super Admin 👋', 'वापसी पर स्वागत है, सुपर एडमिन 👋')}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14.5px', margin: 0, maxWidth: '580px', lineHeight: 1.5 }}>
            {t(
              'Here is the real-time operational overview of Track Loved Ones platform and user safety metrics today.',
              'ट्रैक लव्ड वन्स प्लेटफ़ॉर्म और उपयोगकर्ता सुरक्षा मेट्रिक्स का वास्तविक समय अवलोकन यहाँ है।'
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
            {t('Download Metrics', 'मेट्रिक्स डाउनलोड')}
          </button>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        
        {/* Total Users */}
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('Total Users', 'कुल उपयोगकर्ता')}</span>
            <div className="stat-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Users size={22} />
            </div>
          </div>
          <span className="stat-value">{loadingUsers ? '...' : (totalUsers !== null ? totalUsers.toLocaleString() : '0')}</span>
          <span className="stat-trend trend-up">
            <TrendingUp size={14} /> +12.4% {t('this month', 'इस महीने')}
          </span>
        </div>

        {/* Active Subscriptions */}
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('Active Subscriptions', 'सक्रिय सदस्यताएँ')}</span>
            <div className="stat-icon-box" style={{ background: '#d1fae5', color: '#059669' }}>
              <CreditCard size={22} />
            </div>
          </div>
          <span className="stat-value">3,892</span>
          <span className="stat-trend trend-up">
            <TrendingUp size={14} /> +5.1% {t('this month', 'इस महीने')}
          </span>
        </div>

        {/* Pending Approvals */}
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('Pending Approvals', 'लंबित स्वीकृतियां')}</span>
            <div className="stat-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Clock size={22} />
            </div>
          </div>
          <span className="stat-value" style={{ color: '#b45309' }}>42</span>
          <span className="stat-trend trend-warning">
            {t('Action needed', 'कार्रवाई आवश्यक')}
          </span>
        </div>

        {/* Reported Chats */}
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('Reported Chats', 'रिपोर्ट की गई चैट')}</span>
            <div className="stat-icon-box" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <ShieldAlert size={22} />
            </div>
          </div>
          <span className="stat-value" style={{ color: '#dc2626' }}>7</span>
          <span className="stat-trend" style={{ background: '#fee2e2', color: '#991b1b' }}>
            {t('Urgent review', 'तत्काल समीक्षा')}
          </span>
        </div>
      </div>

      {/* Activity & System Health Grid */}
      <div className="grid-2">
        {/* Recent Activity Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>
              {t('Recent Activity', 'हाल की गतिविधि')}
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {t('View all', 'सभी देखें')} <ArrowUpRight size={14} />
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13.5px', fontWeight: '600' }}>Ramesh Sharma registered</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified via Phone OTP • 10m ago</div>
              </div>
              <span className="badge success">Verified</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck2 size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13.5px', fontWeight: '600' }}>New Business Opportunity Posted</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Security Agency Services • 45m ago</div>
              </div>
              <span className="badge warning">Pending</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fee2e2', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13.5px', fontWeight: '600' }}>Chat conversation flagged</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>User report filed for review • 2h ago</div>
              </div>
              <span className="badge danger">Flagged</span>
            </div>
          </div>
        </div>

        {/* System Health Overview Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>
              {t('Platform Status & Health', 'प्लेटफ़ॉर्म स्थिति और स्वास्थ्य')}
            </h3>
            <span className="badge success">
              <span className="badge-dot"></span> 99.98% Up
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: '600', marginBottom: '6px' }}>
                <span>GPS Location Stream Server</span>
                <span style={{ color: 'var(--success)' }}>Operational</span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: 'var(--success)', borderRadius: '999px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: '600', marginBottom: '6px' }}>
                <span>Push Notification Dispatcher</span>
                <span style={{ color: 'var(--success)' }}>Optimal</span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'var(--primary)', borderRadius: '999px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: '600', marginBottom: '6px' }}>
                <span>Emergency SOS Response Queue</span>
                <span style={{ color: 'var(--success)' }}>Zero Delay</span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--success)', borderRadius: '999px' }}></div>
              </div>
            </div>

            <div style={{ marginTop: '8px', padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>Emergency Dispatch Tunnel</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Connected to 112 / Regional control rooms</div>
              </div>
              <Activity size={20} color="var(--primary)" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
