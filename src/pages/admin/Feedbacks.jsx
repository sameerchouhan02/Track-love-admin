import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Star, 
  CheckCircle2, 
  Clock, 
  Send, 
  User, 
  Mail, 
  ThumbsUp, 
  AlertCircle, 
  X,
  MessageCircle
} from 'lucide-react';

const INITIAL_FEEDBACKS = [
  {
    id: 'FB-901',
    user: 'Pooja Agarwal',
    email: 'pooja.agarwal@example.com',
    category: 'SOS Feature Feedback',
    rating: 5,
    date: '11 Oct 2026, 17:42',
    status: 'Resolved',
    message: 'The one-tap SOS beacon saved my sister when her cab took an unexpected route at night. The live audio streaming feature alerted our entire family circle immediately!',
    adminReply: 'Thank you Pooja! Ensuring rapid family response during transit is our highest priority.'
  },
  {
    id: 'FB-902',
    user: 'Karan Malhotra',
    email: 'karan.m@example.com',
    category: 'Feature Request',
    rating: 4,
    date: '10 Oct 2026, 11:20',
    status: 'Open',
    message: 'Would love if you could add geofencing alerts for smartwatches (WearOS / Apple Watch) directly without opening the phone app.',
    adminReply: null
  },
  {
    id: 'FB-903',
    user: 'Meera Nambiar',
    email: 'meera.nambiar@example.com',
    category: 'Bug Report',
    rating: 3,
    date: '09 Oct 2026, 08:15',
    status: 'Open',
    message: 'Battery consumption increases significantly when high-precision GPS tracking is enabled continuously for more than 4 hours.',
    adminReply: null
  },
  {
    id: 'FB-904',
    user: 'Amitabh Sengupta',
    email: 'amitabh.s@example.com',
    category: 'General UX',
    rating: 5,
    date: '08 Oct 2026, 14:05',
    status: 'Resolved',
    message: 'The Hindi language support is very clear and easy to understand for elderly parents. Great UI design!',
    adminReply: 'Glad to hear that Amitabh ji. We are committed to making safety accessible in every regional language.'
  }
];

const Feedbacks = ({ isHindi }) => {
  const t = (en, hi) => (isHindi ? hi : en);

  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText || !selectedFeedback) return;

    setFeedbacks(feedbacks.map(f => f.id === selectedFeedback.id ? {
      ...f,
      status: 'Resolved',
      adminReply: replyText
    } : f));

    showToast(t(`Reply sent to ${selectedFeedback.email}!`, `${selectedFeedback.email} को उत्तर भेजा गया!`));
    setSelectedFeedback(null);
    setReplyText('');
  };

  const filtered = feedbacks.filter(f => {
    const matchesSearch = f.user.toLowerCase().includes(search.toLowerCase()) ||
      f.message.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalReviews = feedbacks.length;
  const openCount = feedbacks.filter(f => f.status === 'Open').length;
  const resolvedCount = feedbacks.filter(f => f.status === 'Resolved').length;

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
            <MessageSquare size={26} color="var(--primary)" />
            {t('User Feedbacks & Reviews', 'उपयोगकर्ता फीडबैक व समीक्षाएं')}
          </h2>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            {t('Monitor customer satisfaction, bug submissions, and feature suggestions.', 'ग्राहकों की प्रतिक्रिया, बग रिपोर्ट और सुझावों की समीक्षा करें।')}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        margin: '20px 0 24px'
      }}>
        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <MessageCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Total Reviews', 'कुल समीक्षाएं')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalReviews}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <Star size={24} fill="#f59e0b" color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Avg App Rating', 'औसत रेटिंग')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>4.8 ★</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Open / Unanswered', 'खुले टिकट')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>{openCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Resolved Tickets', 'हल किए गए')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{resolvedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            placeholder={t('Search feedback, user name, or email...', 'फीडबैक, नाम या ईमेल से खोजें...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select 
            className="form-control" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '200px', fontWeight: 500 }}
          >
            <option value="ALL">{t('All Categories', 'सभी श्रेणियां')}</option>
            <option value="SOS Feature Feedback">{t('SOS Experience', 'एसओएस अनुभव')}</option>
            <option value="Feature Request">{t('Feature Request', 'सुझाव')}</option>
            <option value="Bug Report">{t('Bug Report', 'बग रिपोर्ट')}</option>
            <option value="General UX">{t('General UX', 'सामान्य यूएक्स')}</option>
          </select>
        </div>
      </div>

      {/* Feedback Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '50px 20px', textAlign: 'center' }}>
            <MessageSquare size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {t('No feedback entries found.', 'कोई फीडबैक प्रविष्टि नहीं मिली।')}
            </h3>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="card" style={{ padding: '20px', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>
                    {item.user.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{item.user}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} /> {item.email} • {item.date}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'inline-flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={15} 
                        fill={s <= item.rating ? '#f59e0b' : 'none'} 
                        color={s <= item.rating ? '#f59e0b' : '#cbd5e1'} 
                      />
                    ))}
                  </div>

                  <span className="badge" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {item.category}
                  </span>

                  {item.status === 'Resolved' ? (
                    <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> {t('Resolved', 'हल')}
                    </span>
                  ) : (
                    <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {t('Open', 'समीक्षा हेतु')}
                    </span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, margin: '8px 0 14px' }}>
                "{item.message}"
              </p>

              {/* Admin reply if any */}
              {item.adminReply && (
                <div style={{ backgroundColor: 'var(--bg-main)', borderLeft: '3px solid var(--primary)', padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: '12px', fontSize: '13px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                    {t('Admin Response', 'प्रशासक की प्रतिक्रिया')}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>{item.adminReply}</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedFeedback(item);
                    setReplyText(item.adminReply || '');
                  }}
                  style={{ fontSize: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={13} />
                  {item.adminReply ? t('Edit Reply', 'उत्तर संपादित करें') : t('Reply to User', 'उत्तर भेजें')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {selectedFeedback && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '560px', width: '100%', padding: '28px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedFeedback(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>
              {t('Official Support Response', 'आधिकारिक सहायता प्रतिक्रिया')}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
              {t(`Responding to ${selectedFeedback.user} (${selectedFeedback.email})`, `${selectedFeedback.user} को उत्तर भेजा जा रहा है`)}
            </p>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', fontStyle: 'italic' }}>
              "{selectedFeedback.message}"
            </div>

            <form onSubmit={handleSendReply}>
              <div className="form-group">
                <label className="form-label">{t('Your Response', 'आपका उत्तर')}</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder={t('Write a helpful response to the user...', 'उपयोगकर्ता को विनम्र और स्पष्ट उत्तर लिखें...')}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedFeedback(null)}>
                  {t('Cancel', 'रद्द करें')}
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={15} />
                  {t('Send & Mark Resolved', 'भेजें और हल चिह्नित करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
