import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Send, 
  ArrowUpRight, 
  AlertTriangle,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { adminApi } from '../../_config/api';

const GrievanceInbox = ({ isHindi }) => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const t = (en, hi) => (isHindi ? hi : en);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getGrievances();
      if (res.data?.success && res.data?.data?.grievances) {
        setGrievances(res.data.data.grievances);
      }
    } catch {
      console.error('Error fetching grievances.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleAction = async (id, action, reply = '') => {
    try {
      setActionLoading(true);
      const res = await adminApi.updateGrievanceStatus(id, { action, reply });
      if (res.data?.success) {
        showToast(t('Grievance status updated!', 'शिकायत की स्थिति अपडेट कर दी गई!'));
        setReplyModal(null);
        setReplyText('');
        fetchGrievances();
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 14 Days SLA Calculator
  const getSlaStatus = (deadlineStr, status) => {
    if (status === 'resolved') {
      return { text: t('Resolved', 'निस्तारित'), color: '#10b981' };
    }
    const diffDays = Math.ceil((new Date(deadlineStr) - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      return { text: t('SLA Expired!', 'SLA समाप्त!'), color: '#ef4444' };
    }
    if (diffDays <= 3) {
      return { text: `${diffDays} ${t('Days Remaining (Critical)', 'दिन शेष (अति-संवेदनशील)')}`, color: '#f59e0b' };
    }
    return { text: `${diffDays} ${t('Days Remaining', 'दिन शेष')}`, color: '#0284c7' };
  };

  return (
    <div className="content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '14px 22px', borderRadius: '12px' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert color="#0284c7" size={24} />
            {t('Regulatory & Grievance Inbox (DPDP Act, 2023)', 'नियामक एवं शिकायत इनबॉक्स')}
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {t('Officer in Charge: Mr. Akash Sharma | Direct Escalations to DPO', 'प्रभारी अधिकारी: श्री आकाश शर्मा | डीपीओ को सीधे अग्रेषण')}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchGrievances} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          {t('Refresh', 'रिफ्रेश')}
        </button>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          {t('Loading grievances...', 'शिकायतें लोड हो रही हैं...')}
        </div>
      ) : grievances.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <h3>{t('No Grievances Found', 'कोई लंबित शिकायत नहीं')}</h3>
          <p style={{ fontSize: '13px' }}>{t('All user data compliance issues are resolved.', 'सभी डेटा अनुपालन अनुरोध सुरक्षित हैं।')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {grievances.map((item) => {
            const sla = getSlaStatus(item.slaDeadline, item.status);
            return (
              <div key={item._id} className="card" style={{ borderLeft: `5px solid ${item.status === 'escalated_to_dpo' ? '#8b5cf6' : item.status === 'resolved' ? '#10b981' : '#0284c7'}`, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  
                  {/* Left: Details */}
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary" style={{ fontWeight: 700 }}>{item.receiptCode}</span>
                      <span className="badge badge-warning">{item.category?.replace(/_/g, ' ')}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: sla.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {sla.text}
                      </span>
                    </div>

                    <p style={{ fontSize: '14px', background: 'var(--bg-main)', padding: '12px 14px', borderRadius: '8px', margin: '10px 0', color: 'var(--text-primary)' }}>
                      <b>{t('Grievance', 'शिकायत')}:</b> "{item.description}"
                    </p>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      <b>{t('Assigned Officer', 'नियुक्त अधिकारी')}:</b> {item.assignedOfficer}
                    </div>

                    {item.adminReply && (
                      <p style={{ fontSize: '13px', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: '8px', color: '#065f46', marginTop: '10px' }}>
                        <b>Official Reply:</b> "{item.adminReply}"
                      </p>
                    )}
                  </div>

                  {/* Middle: User Info */}
                  <div style={{ background: 'var(--bg-main)', padding: '12px 16px', borderRadius: '10px', minWidth: '220px', fontSize: '12px', height: 'fit-content' }}>
                    <div style={{ fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <User size={13} /> {t('Complainant', 'शिकायतकर्ता')}:
                    </div>
                    <div><b>Name:</b> {item.userId?.name || 'User'}</div>
                    <div><b>Phone:</b> {item.userId?.phone || 'N/A'}</div>
                    <div><b>Email:</b> {item.userId?.email || 'N/A'}</div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '170px' }}>
                    {item.status === 'pending' && (
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleAction(item._id, 'in_progress')}
                        disabled={actionLoading}
                        style={{ fontSize: '12px' }}
                      >
                        {t('Mark In Progress', 'प्रगति में चिह्नित करें')}
                      </button>
                    )}

                    {item.status !== 'resolved' && (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => setReplyModal(item)}
                        style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                      >
                        <Send size={13} /> {t('Send Reply to User', 'उत्तर भेजें')}
                      </button>
                    )}

                    {item.status !== 'escalated_to_dpo' && item.status !== 'resolved' && (
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleAction(item._id, 'escalate_dpo')}
                        disabled={actionLoading}
                        style={{ fontSize: '12px', background: '#8b5cf6', borderColor: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                      >
                        <ArrowUpRight size={13} /> {t('Escalate to DPO', 'डीपीओ को अग्रेषित करें')}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      {replyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="card" style={{ width: '90%', maxWidth: '500px', padding: '24px' }}>
            <h3>{t('Send Official Redressal Reply', 'आधिकारिक समाधान उत्तर भेजें')}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Ticket: <b>{replyModal.receiptCode}</b> ({replyModal.userId?.name})
            </p>
            <textarea 
              rows={4} 
              className="form-control" 
              placeholder={t('Type your formal redressal response here...', 'अपना समाधान विवरण यहाँ लिखें...')}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{ width: '100%', marginTop: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setReplyModal(null)}>{t('Cancel', 'रद्द करें')}</button>
              <button 
                className="btn btn-primary" 
                onClick={() => handleAction(replyModal._id, 'reply', replyText)}
                disabled={!replyText.trim() || actionLoading}
              >
                {t('Submit & Resolve', 'भेजें और निस्तारित करें')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceInbox;
