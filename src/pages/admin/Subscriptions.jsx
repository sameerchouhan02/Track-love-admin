import React from 'react';
import { CreditCard, Sparkles, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const mockSubscriptions = [
  {
    id: 's1',
    name: 'Ramesh Sharma',
    signup: '15 Jan 2026',
    bizExpiry: '15 Jan 2027',
    lawExpiry: '15 Jan 2027',
    plan: 'Pro Annual',
    badgeClass: 'success',
    amount: '₹ 1,499'
  },
  {
    id: 's2',
    name: 'Priya Verma',
    signup: '02 Feb 2026',
    bizExpiry: '02 Aug 2026',
    lawExpiry: '02 Aug 2026',
    plan: 'Free Trial',
    badgeClass: 'info',
    amount: '₹ 0'
  },
  {
    id: 's3',
    name: 'Anjali Gupta',
    signup: '18 Feb 2026',
    bizExpiry: '18 Feb 2027',
    lawExpiry: '18 Feb 2027',
    plan: 'Family Protection',
    badgeClass: 'success',
    amount: '₹ 2,999'
  },
  {
    id: 's4',
    name: 'Vikram Singh',
    signup: '05 Mar 2026',
    bizExpiry: '05 Apr 2026',
    lawExpiry: '05 Apr 2026',
    plan: 'Monthly Pass',
    badgeClass: 'warning',
    amount: '₹ 199'
  }
];

const Subscriptions = ({ isHindi }) => {
  const t = (en, hi) => (isHindi ? hi : en);

  return (
    <div className="content">
      <div style={{ marginBottom: '8px' }}>
        <h2 className="page-title">{t('Subscriptions & Revenue', 'सदस्यता और राजस्व')}</h2>
        <p className="page-subtitle">
          {t('Track premium platform tiers, active trials, and recurring payment transactions.', 'प्रीमियम योजनाओं, निःशुल्क परीक्षणों और भुगतानों को ट्रैक करें।')}
        </p>
      </div>
      
      {/* Revenue Stats */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="card stat-card" style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              {t('Monthly Revenue', 'मासिक राजस्व')}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <span style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.8px' }}>₹ 1,45,200</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            +18.2% vs previous period
          </span>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('Active Free Trials', 'सक्रिय निःशुल्क परीक्षण')}</span>
            <div className="stat-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <span className="stat-value">1,204</span>
          <span className="stat-trend trend-neutral">
            {t('85% conversion rate', '85% रूपांतरण दर')}
          </span>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('Paid Subscribers', 'सशुल्क ग्राहक')}</span>
            <div className="stat-icon-box" style={{ background: '#d1fae5', color: '#059669' }}>
              <CreditCard size={20} />
            </div>
          </div>
          <span className="stat-value">3,480</span>
          <span className="stat-trend trend-up">
            <TrendingUp size={13} /> +6.4% {t('growth', 'वृद्धि')}
          </span>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('Average Order', 'औसत ऑर्डर')}</span>
            <div className="stat-icon-box" style={{ background: '#fef3c7', color: '#b45309' }}>
              <Calendar size={20} />
            </div>
          </div>
          <span className="stat-value">₹ 840</span>
          <span className="stat-trend trend-neutral">
            {t('Annual & monthly mix', 'वार्षिक और मासिक मिश्रण')}
          </span>
        </div>
      </div>

      {/* Subscription Table */}
      <div className="table-container">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="section-title" style={{ margin: 0 }}>
              {t('Active Subscriptions Ledger', 'सक्रिय सदस्यता लेज़र')}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              {t('Live record of plan validity and renewal dates', 'योजना वैधता और नवीनीकरण तिथियों का लाइव रिकॉर्ड')}
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>{t('Subscriber', 'ग्राहक')}</th>
              <th>{t('Sign Up Date', 'साइन अप')}</th>
              <th>{t('Jobs / Business Validity', 'नौकरी/व्यापार समाप्ति')}</th>
              <th>{t('Law Content Validity', 'कानून समाप्ति')}</th>
              <th>{t('Amount', 'राशि')}</th>
              <th>{t('Plan Tier', 'योजना')}</th>
            </tr>
          </thead>
          <tbody>
            {mockSubscriptions.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
                    {sub.name}
                  </div>
                </td>
                <td style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                  {sub.signup}
                </td>
                <td>
                  <span className="badge success">
                    <span className="badge-dot"></span>
                    {sub.bizExpiry}
                  </span>
                </td>
                <td>
                  <span className="badge success">
                    <span className="badge-dot"></span>
                    {sub.lawExpiry}
                  </span>
                </td>
                <td style={{ fontWeight: '700', fontSize: '14px' }}>
                  {sub.amount}
                </td>
                <td>
                  <span className={`badge ${sub.badgeClass}`}>
                    {sub.plan}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscriptions;
