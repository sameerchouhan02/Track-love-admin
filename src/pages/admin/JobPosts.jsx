import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Building2, 
  DollarSign, 
  Eye, 
  X,
  FileCheck2,
  Calendar,
  AlertCircle
} from 'lucide-react';

const INITIAL_JOBS = [
  {
    id: 'JOB-201',
    title: 'Certified Night Escort Security Guard',
    company: 'Apex Sentinel Services Pvt Ltd',
    jobType: 'Full-time (Night Shift)',
    location: 'Cyber City, Gurugram',
    salary: '₹28,000 - ₹35,000 / mo',
    postedDate: '11 Oct 2026',
    status: 'Pending',
    openings: 5,
    description: 'Looking for licensed ex-paramilitary or trained private security personnel for escorting corporate women employees on late-night transit routes.',
    requirements: 'Minimum 2 years security experience, clean police verification certificate, certified first responder training.'
  },
  {
    id: 'JOB-202',
    title: 'Emergency Response Paramedic (Ambulance)',
    company: 'LifeCare Trauma & Ambulance Network',
    jobType: 'Contract (24/7 Rotational)',
    location: 'South Mumbai, Maharashtra',
    salary: '₹35,000 - ₹45,000 / mo',
    postedDate: '10 Oct 2026',
    status: 'Approved',
    openings: 3,
    description: 'Emergency response paramedic to accompany critical transit ambulances, monitor telemetry gear, and administer emergency ALS protocols.',
    requirements: 'B.Sc in Emergency Medical Technology or GNM Nursing, valid BLS/ACLS certification.'
  },
  {
    id: 'JOB-203',
    title: 'Elderly Care Assistant & Home Companion',
    company: 'Seva Senior Care Homecare',
    jobType: 'Part-time (Day Shift)',
    location: 'Indiranagar, Bengaluru',
    salary: '₹18,000 - ₹22,000 / mo',
    postedDate: '09 Oct 2026',
    status: 'Approved',
    openings: 2,
    description: 'Compassionate companion for senior citizens needing medication reminders, gentle mobility assistance, and emergency SOS tracking supervision.',
    requirements: 'Past elderly care experience or patient assistant diploma, background check mandatory.'
  },
  {
    id: 'JOB-204',
    title: 'Discreet Private Security Chauffeur',
    company: 'Elite Mobility Services',
    jobType: 'Full-time',
    location: 'Banjara Hills, Hyderabad',
    salary: '₹30,000 - ₹38,000 / mo',
    postedDate: '07 Oct 2026',
    status: 'Rejected',
    openings: 1,
    description: 'Executive defensive driving chauffeur for VIP family, route safety monitoring, and vehicle emergency tracking maintenance.',
    requirements: 'Commercial driving badge, zero collision history in 5 years, tactical evasive driving knowledge preferred.'
  }
];

const JobPosts = ({ isHindi }) => {
  const t = (en, hi) => (isHindi ? hi : en);

  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
    showToast(
      newStatus === 'Approved' 
        ? t(`Job posting #${id} approved & published!`, `नौकरी विज्ञापन #${id} स्वीकृत और प्रकाशित!`)
        : t(`Job posting #${id} marked as ${newStatus}.`, `नौकरी #${id} को ${newStatus} किया गया।`)
    );
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob(prev => ({ ...prev, status: newStatus }));
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = jobs.filter(j => j.status === 'Pending').length;
  const approvedCount = jobs.filter(j => j.status === 'Approved').length;
  const rejectedCount = jobs.filter(j => j.status === 'Rejected').length;

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
            <Briefcase size={26} color="var(--primary)" />
            {t('Job Opportunities Moderation', 'नौकरी विज्ञापन मॉडरेशन')}
          </h2>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            {t('Review and verify safety, escort, paramedic, and caretaker job postings.', 'सुरक्षा गार्ड, एस्कॉर्ट और आपातकालीन स्वास्थ्य कर्मियों के विज्ञापनों की समीक्षा करें।')}
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
              {t('Total Job Posts', 'कुल रिक्तियां')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{jobs.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Pending Approvals', 'लंबित अनुमोदन')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>{pendingCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <FileCheck2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Active & Verified', 'सक्रिय और स्वीकृत')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{approvedCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <XCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Declined Listings', 'अस्वीकृत')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>{rejectedCount}</div>
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
            placeholder={t('Search by job role, employer company, or location...', 'पद का नाम, कंपनी या शहर से खोजें...')}
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
            <option value="Pending">{t('Pending Review', 'समीक्षाधीन')}</option>
            <option value="Approved">{t('Approved', 'स्वीकृत')}</option>
            <option value="Rejected">{t('Rejected', 'अस्वीकृत')}</option>
          </select>
        </div>
      </div>

      {/* Job Cards Ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredJobs.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '50px 20px', textAlign: 'center' }}>
            <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {t('No job listings match your current filters.', 'कोई नौकरी विज्ञापन नहीं मिला।')}
            </h3>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                      {job.jobType}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 0', color: 'var(--text-primary)' }}>
                      {job.title}
                    </h3>
                  </div>
                  <div>
                    {job.status === 'Approved' && (
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> {t('Approved', 'स्वीकृत')}
                      </span>
                    )}
                    {job.status === 'Pending' && (
                      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {t('Pending', 'लंबित')}
                      </span>
                    )}
                    {job.status === 'Rejected' && (
                      <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={12} /> {t('Rejected', 'अस्वीकृत')}
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px', minHeight: '40px' }}>
                  {job.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} color="var(--primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job.company}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span>{job.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>{job.salary}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{job.openings} {t('openings', 'पद')}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedJob(job)}
                  style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Eye size={14} />
                  {t('Inspect', 'जांचें')}
                </button>
                {job.status !== 'Approved' && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleStatusChange(job.id, 'Approved')}
                    style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#10b981', borderColor: '#10b981' }}
                  >
                    <CheckCircle2 size={14} />
                    {t('Approve', 'स्वीकृत')}
                  </button>
                )}
                {job.status !== 'Rejected' && (
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleStatusChange(job.id, 'Rejected')}
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                    title={t('Reject Listing', 'अस्वीकार करें')}
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Inspection Modal */}
      {selectedJob && (
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
          <div className="card" style={{ maxWidth: '620px', width: '100%', padding: '28px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedJob(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Briefcase size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{selectedJob.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedJob.company} • {selectedJob.id}</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedJob.description}</p>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <strong>{t('Mandatory Requirements:', 'अनिवार्य योग्यताएं:')}</strong> {selectedJob.requirements}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', fontSize: '13px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Location', 'स्थान')}</span>
                <div style={{ fontWeight: 600 }}>{selectedJob.location}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Remuneration', 'वेतन')}</span>
                <div style={{ fontWeight: 600, color: '#10b981' }}>{selectedJob.salary}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Posting Date', 'पोस्ट तिथि')}</span>
                <div style={{ fontWeight: 600 }}>{selectedJob.postedDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Open Positions', 'रिक्त पद')}</span>
                <div style={{ fontWeight: 600 }}>{selectedJob.openings} Vacancies</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedJob(null)}>
                {t('Close', 'बंद करें')}
              </button>
              {selectedJob.status !== 'Approved' && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    handleStatusChange(selectedJob.id, 'Approved');
                    setSelectedJob(null);
                  }}
                  style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                >
                  <CheckCircle2 size={16} />
                  {t('Approve Listing', 'विज्ञापन स्वीकृत करें')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPosts;
