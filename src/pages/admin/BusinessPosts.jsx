import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  Eye, 
  Briefcase,
  X,
  Star
} from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: 'BIZ-101',
    name: 'SecureGuard 24/7 Rapid Response',
    category: 'Security & Escort Services',
    owner: 'Vikram Rajput',
    phone: '+91 98765 43210',
    city: 'New Delhi, NCR',
    rating: 4.8,
    date: '11 Oct 2026',
    status: 'Pending',
    description: 'Licensed private escort and armed bodyguard escort services for night shifts, solo travelers, and VIP airport transits.',
    docsVerified: true,
    pricing: '₹1,500 / trip'
  },
  {
    id: 'BIZ-102',
    name: 'Aastha ElderCare & Companion Vans',
    category: 'Elderly Care & Transit',
    owner: 'Dr. Sunita Deshmukh',
    phone: '+91 98220 11984',
    city: 'Pune, Maharashtra',
    rating: 4.9,
    date: '10 Oct 2026',
    status: 'Approved',
    description: 'Wheelchair-accessible ambulance transport, trained emergency paramedic companions for seniors traveling across city hospitals.',
    docsVerified: true,
    pricing: '₹800 / hr'
  },
  {
    id: 'BIZ-103',
    name: 'EagleEye GPS Fleet & Pet Trackers',
    category: 'Hardware & Tracking Gear',
    owner: 'Rohan Mehra',
    phone: '+91 97110 55432',
    city: 'Bengaluru, Karnataka',
    rating: 4.5,
    date: '09 Oct 2026',
    status: 'Approved',
    description: 'Miniature 4G LTE waterproof magnetic trackers for vehicles, school backpacks, and pets with lifetime SIM card coverage.',
    docsVerified: true,
    pricing: '₹2,499 one-time'
  },
  {
    id: 'BIZ-104',
    name: 'Shadow Intelligence Investigations',
    category: 'Private Investigations',
    owner: 'Anonymous Partner',
    phone: '+91 91234 00000',
    city: 'Mumbai, Maharashtra',
    rating: 3.2,
    date: '08 Oct 2026',
    status: 'Flagged',
    description: 'Unregulated phone tapping and surveillance hardware services advertised without valid state detective agency licensing.',
    docsVerified: false,
    pricing: 'Quote on call'
  }
];

const BusinessPosts = ({ isHindi }) => {
  const t = (en, hi) => (isHindi ? hi : en);

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPost, setSelectedPost] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus } : p));
    showToast(
      newStatus === 'Approved' 
        ? t(`Business post #${id} approved successfully!`, `व्यावसायिक पोस्ट #${id} स्वीकृत की गई!`)
        : t(`Business post #${id} marked as ${newStatus}.`, `व्यावसायिक पोस्ट #${id} को ${newStatus} चिह्नित किया गया।`)
    );
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost(prev => ({ ...prev, status: newStatus }));
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = posts.filter(p => p.status === 'Pending').length;
  const approvedCount = posts.filter(p => p.status === 'Approved').length;
  const flaggedCount = posts.filter(p => p.status === 'Flagged').length;

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
            <Building2 size={26} color="var(--primary)" />
            {t('Business Directory Moderation', 'व्यापार लिस्टिंग मॉडरेशन')}
          </h2>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            {t('Review, authenticate, and moderate third-party safety and emergency service providers.', 'सुरक्षा सेवाओं और आपातकालीन प्रदाताओं की समीक्षा व सत्यापन करें।')}
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
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Total Listings', 'कुल लिस्टिंग्स')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{posts.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Awaiting Review', 'समीक्षा हेतु लंबित')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>{pendingCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Verified & Live', 'सत्यापित और सक्रिय')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{approvedCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Flagged / Suspicious', 'फ्लैग किया गया')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>{flaggedCount}</div>
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
            placeholder={t('Search by business name, city, or service...', 'व्यापार का नाम, शहर या सेवा खोजें...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select 
            className="form-control" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '160px', fontWeight: 500 }}
          >
            <option value="ALL">{t('All Statuses', 'सभी स्थितियां')}</option>
            <option value="Pending">{t('Pending Review', 'समीक्षा हेतु लंबित')}</option>
            <option value="Approved">{t('Approved', 'स्वीकृत')}</option>
            <option value="Flagged">{t('Flagged', 'फ्लैग किया गया')}</option>
          </select>
        </div>
      </div>

      {/* Posts Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredPosts.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '50px 20px', textAlign: 'center' }}>
            <Building2 size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {t('No business listings match the filter.', 'कोई व्यावसायिक लिस्टिंग नहीं मिली।')}
            </h3>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                      {post.category}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 0', color: 'var(--text-primary)' }}>
                      {post.name}
                    </h3>
                  </div>
                  <div>
                    {post.status === 'Approved' && (
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> {t('Approved', 'स्वीकृत')}
                      </span>
                    )}
                    {post.status === 'Pending' && (
                      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {t('Review Pending', 'लंबित')}
                      </span>
                    )}
                    {post.status === 'Flagged' && (
                      <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} /> {t('Flagged', 'संदिग्ध')}
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px', minHeight: '40px' }}>
                  {post.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span>{post.city}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="var(--primary)" />
                    <span>{post.owner} ({post.phone})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.pricing}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" /> {post.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedPost(post)}
                  style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Eye size={14} />
                  {t('Inspect', 'जांचें')}
                </button>
                {post.status !== 'Approved' && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleStatusChange(post.id, 'Approved')}
                    style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#10b981', borderColor: '#10b981' }}
                  >
                    <CheckCircle2 size={14} />
                    {t('Approve', 'स्वीकृत')}
                  </button>
                )}
                {post.status !== 'Flagged' && (
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleStatusChange(post.id, 'Flagged')}
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                    title={t('Flag Listing', 'फ्लैग करें')}
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedPost && (
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
          <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '28px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedPost(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Building2 size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{selectedPost.name}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedPost.category} • {selectedPost.id}</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedPost.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', fontSize: '13px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Proprietor', 'मालिक')}</span>
                <div style={{ fontWeight: 600 }}>{selectedPost.owner}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Direct Contact', 'संपर्क')}</span>
                <div style={{ fontWeight: 600 }}>{selectedPost.phone}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Service Area', 'सेवा क्षेत्र')}</span>
                <div style={{ fontWeight: 600 }}>{selectedPost.city}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Document Verification', 'दस्तावेज़ सत्यापन')}</span>
                <div style={{ fontWeight: 600, color: selectedPost.docsVerified ? '#10b981' : '#ef4444' }}>
                  {selectedPost.docsVerified ? t('Verified Govt GST/ID', 'सत्यापित') : t('Missing Documents', 'अपूर्ण')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedPost(null)}>
                {t('Close', 'बंद करें')}
              </button>
              {selectedPost.status !== 'Approved' && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    handleStatusChange(selectedPost.id, 'Approved');
                    setSelectedPost(null);
                  }}
                  style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                >
                  <CheckCircle2 size={16} />
                  {t('Approve & Publish', 'स्वीकृत व प्रकाशित करें')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPosts;
