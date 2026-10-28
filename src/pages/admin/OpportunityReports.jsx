import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, AlertCircle, Building2, User, Phone, Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../_config/api';

const OpportunityReports = ({ isHindi }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmPost, setConfirmPost] = useState(null); // 👈 Confirm modal ke liye

  const t = (en, hi) => (isHindi ? hi : en);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOpportunityReports({ page: 1, limit: 50 });
      if (res.data?.success && res.data?.data?.reports) {
        setReports(res.data.data.reports);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

   // Delete action execute karne ka function
  const handleExecuteDelete = async () => {
    if (!confirmPost) return;
    const { postType, postId, reportId } = confirmPost;

    try {
      setDeletingId(reportId);
      const res = await adminApi.deleteReportedPost(postType, postId);
      if (res.data?.success) {
        showToast(t('Reported post deleted successfully!', 'रिपोर्ट की गई पोस्ट सफलतापूर्वक हटा दी गई!'));
        setReports(prev => prev.filter(r => r.postID !== postId));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    } finally {
      setDeletingId(null);
      setConfirmPost(null); // Modal band karein
    }
  };


  return (
    <div className="content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '14px 22px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert color="#ef4444" size={24} />
            {t('Job & Business Fraud Reports (Safe Harbour)', 'नौकरी व व्यापार धोखाधड़ी रिपोर्ट')}
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {t('Review complaints submitted by users and take down fraudulent listings.', 'उपयोगकर्ताओं द्वारा दर्ज की गई शिकायतों की समीक्षा करें और धोखाधड़ी वाली पोस्ट हटाएं।')}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchReports} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          {t('Refresh', 'रिफ्रेश')}
        </button>
      </div>

      {/* Reports Table / Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          {t('Loading reports...', 'रिपोर्ट लोड हो रही हैं...')}
        </div>
      ) : reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <h3>{t('No Fraud Reports Found', 'कोई धोखाधड़ी रिपोर्ट नहीं मिली')}</h3>
          <p style={{ fontSize: '13px' }}>{t('All current job and business listings are clean.', 'सभी वर्तमान लिस्टिंग सुरक्षित हैं।')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reports.map((rep) => (
            <div key={rep._id} className="card" style={{ borderLeft: '4px solid #ef4444', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                
                {/* Left: Reason & Post Info */}
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-danger" style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700 }}>
                      {rep.reasonCategory?.replace(/_/g, ' ') || 'SUSPICIOUS'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Type: <b style={{ textTransform: 'capitalize' }}>{rep.postType}</b>
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(rep.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h4 style={{ margin: '6px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
                    {rep.postDetails?.title ? rep.postDetails.title : `Post ID: ${rep.postID}`}
                    {!rep.postDetails && <span style={{ color: '#ef4444', fontSize: '12px', marginLeft: '8px' }}>(Already Deleted or Inactive)</span>}
                  </h4>

                  {rep.additionalDetails && (
                    <p style={{ fontSize: '13px', background: 'var(--bg-main)', padding: '10px 14px', borderRadius: '8px', margin: '8px 0', color: 'var(--text-secondary)' }}>
                      <b>User Remark:</b> "{rep.additionalDetails}"
                    </p>
                  )}

                  {/* Company Info */}
                  {rep.companyId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      <Building2 size={14} color="#0284c7" />
                      <span>Company: <b>{rep.companyId.registeredCompanyName}</b> ({rep.companyId.companyEmail})</span>
                    </div>
                  )}
                </div>

                {/* Middle: Reporter Info */}
                <div style={{ background: 'var(--bg-main)', padding: '12px 16px', borderRadius: '10px', minWidth: '220px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={13} /> {t('Reported By', 'शिकायतकर्ता')}:
                  </div>
                  <div>{rep.userId?.name || 'Anonymous User'}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{rep.userId?.phone}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{rep.userId?.email}</div>
                </div>

                {/* Right: Delete Action */}
                <div>
                    <button 
    className="btn btn-danger"
    disabled={deletingId === rep._id || !rep.postDetails}
    onClick={() => setConfirmPost({ postType: rep.postType, postId: rep.postID, reportId: rep._id, title: rep.postDetails?.title || rep.postID })}
    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', fontSize: '13px' }}
  >
    <Trash2 size={15} />
    {deletingId === rep._id ? t('Deleting...', 'हटाया जा रहा है...') : t('Delete Post', 'पोस्ट हटाएं')}
  </button>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔴 In-App Confirmation Popup (Ab ye div ke andar hai) */}
      {confirmPost && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: '460px',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                flexShrink: 0
              }}>
                <Trash2 size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  {t('Delete Reported Post?', 'रिपोर्ट की गई पोस्ट हटाएं?')}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                  {t('This listing will be permanently removed from the platform.', 'यह पोस्ट हमेशा के लिए हटा दी जाएगी।')}
                </p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '13.5px', color: '#334155' }}>
              <b>Target:</b> {confirmPost.title}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setConfirmPost(null)}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                {t('Cancel', 'रद्द करें')}
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleExecuteDelete}
                style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={14} />
                {t('Yes, Permanently Delete', 'हाँ, हमेशा के लिए हटाएं')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OpportunityReports;
