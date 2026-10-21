import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Phone, 
  Mail, 
  X, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Globe, 
  Check, 
  AlertTriangle, 
  ExternalLink 
} from 'lucide-react';
import { apiClient } from '../../_config/api';

const BusinessProfiles = ({ isHindi }) => {
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [businessCounts, setBusinessCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loadingBusiness, setLoadingBusiness] = useState(false);
  const [businessStatusFilter, setBusinessStatusFilter] = useState('All'); // 'All', 'pending', 'approved', 'rejected'
  const [businessSearchTerm, setBusinessSearchTerm] = useState('');
  
  // Modals state
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [approveConfirmProfile, setApproveConfirmProfile] = useState(null);
  const [rejectModalProfile, setRejectModalProfile] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const t = (en, hi) => (isHindi ? hi : en);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1️⃣ Fetch Business Profiles API (/api/v1/admin/business-profiles)
  const fetchBusinessProfiles = async (status = businessStatusFilter) => {
    try {
      setLoadingBusiness(true);
      const params = {};
      if (status && status !== 'All') {
        params.status = status.toLowerCase();
      }

      const res = await apiClient.get('/admin/business-profiles', { params });
      if (res.data?.success) {
        setBusinessProfiles(res.data.data || []);
        if (res.data.counts) {
          setBusinessCounts(res.data.counts);
        }
      }
    } catch (err) {
      console.error('Error fetching business profiles:', err.message);
      showToast(t('Failed to load business profiles', 'व्यापार प्रोफ़ाइल लोड करने में विफल'));
    } finally {
      setLoadingBusiness(false);
    }
  };

  useEffect(() => {
    fetchBusinessProfiles(businessStatusFilter);
  }, [businessStatusFilter]);

  // Handle Approve / Reject Status Update for Business Profile
  const handleUpdateStatus = async (profileId, newStatus, reason = '') => {
    try {
      setActionLoadingId(profileId);
      const payload = {
        status: newStatus,
        adminMessage: newStatus === 'approved' ? 'Your business profile has been approved.' : '',
        rejectionReason: newStatus === 'rejected' ? reason : ''
      };

      const res = await apiClient.patch(`/admin/business-profiles/${profileId}/status`, payload);
      if (res.data?.success) {
        showToast(
          newStatus === 'approved' 
            ? t('Business profile approved successfully!', 'व्यापार प्रोफ़ाइल सफलतापूर्वक स्वीकृत!') 
            : t('Business profile rejected.', 'व्यापार प्रोफ़ाइल अस्वीकृत कर दी गई।')
        );
        setApproveConfirmProfile(null);
        setRejectModalProfile(null);
        setRejectionReason('');
        if (selectedBusiness?._id === profileId) {
          setSelectedBusiness(prev => ({ ...prev, status: newStatus, rejectionReason: reason }));
        }
        fetchBusinessProfiles(businessStatusFilter);
      }
    } catch (err) {
      console.error('Error updating profile status:', err.message);
      showToast(err.response?.data?.message || err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter Search for Business Profiles
  const filteredBusiness = businessProfiles.filter(b => {
    const term = businessSearchTerm.toLowerCase();
    const matchesSearch = 
      (b.registeredCompanyName && b.registeredCompanyName.toLowerCase().includes(term)) ||
      (b.gstNumber && b.gstNumber.toLowerCase().includes(term)) ||
      (b.companyPanNumber && b.companyPanNumber.toLowerCase().includes(term)) ||
      (b.ownerId?.name && b.ownerId.name.toLowerCase().includes(term)) ||
      (b.ownerId?.email && b.ownerId.email.toLowerCase().includes(term)) ||
      (b.ownerId?.phone && b.ownerId.phone.includes(term)) ||
      (b.companyType && b.companyType.toLowerCase().includes(term));
    return matchesSearch;
  });

  return (
    <div className="content">
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 99999,
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={26} color="#0284c7" />
            {t('Business Profiles', 'व्यापार प्रोफ़ाइल')}
          </h2>
          <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
            {t(
              'Review company verification profiles, verify GST/PAN numbers, and manage corporate business access.', 
              'कंपनी सत्यापन प्रोफ़ाइल की समीक्षा करें, GST/PAN नंबर सत्यापित करें और व्यावसायिक पहुंच प्रबंधित करें।'
            )}
          </p>
        </div>
        <button className="btn btn-primary">
          <Download size={16} />
          {t('Export CSV', 'CSV निर्यात करें')}
        </button>
      </div>

      {/* Filter Bar with Status Pills & Search */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '10px 16px', border: '1px solid var(--border)' }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px' }} />
          <input 
            type="text" 
            placeholder={t('Search by Company, GST, PAN, Owner, Email...', 'कंपनी, GST, PAN, या मालिक से खोजें...')}
            value={businessSearchTerm}
            onChange={(e) => setBusinessSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit' }}
          />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'All', labelEn: 'All', labelHi: 'सभी', count: businessCounts.total },
            { key: 'pending', labelEn: 'Pending', labelHi: 'लंबित', count: businessCounts.pending, color: '#f59e0b' },
            { key: 'approved', labelEn: 'Approved', labelHi: 'स्वीकृत', count: businessCounts.approved, color: '#10b981' },
            { key: 'rejected', labelEn: 'Rejected', labelHi: 'अस्वीकृत', count: businessCounts.rejected, color: '#ef4444' }
          ].map(s => {
            const isActive = businessStatusFilter.toLowerCase() === s.key.toLowerCase();
            return (
              <button
                key={s.key}
                onClick={() => setBusinessStatusFilter(s.key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: isActive ? '1px solid transparent' : '1px solid var(--border)',
                  background: isActive ? '#0f172a' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{t(s.labelEn, s.labelHi)}</span>
                {s.count !== undefined && (
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : (s.color || '#64748b'),
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '1px 6px',
                    borderRadius: '6px'
                  }}>
                    {s.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Business Profiles Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('Company Name & Type', 'कंपनी का नाम एवं प्रकार')}</th>
              <th>{t('Owner Details', 'मालिक का विवरण')}</th>
              <th>{t('GST / PAN Number', 'GST / PAN नंबर')}</th>
              <th>{t('Status', 'स्थिति')}</th>
              <th style={{ textAlign: 'right' }}>{t('Actions', 'कार्रवाइयां')}</th>
            </tr>
          </thead>
          <tbody>
            {loadingBusiness ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <Building2 size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                  <div>{t('Loading business profiles...', 'व्यापार प्रोफ़ाइल लोड हो रही हैं...')}</div>
                </td>
              </tr>
            ) : filteredBusiness.length > 0 ? (
              filteredBusiness.map((biz) => (
                <tr key={biz._id}>
                  {/* Company Info */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: '#0284c7',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '16px'
                      }}>
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--text-main)' }}>
                          {biz.registeredCompanyName}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                          <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>
                            {biz.companyType}
                          </span>
                          {biz.officialWebsite && (
                            <a 
                              href={biz.officialWebsite} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ fontSize: '12px', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}
                            >
                              <Globe size={11} /> {t('Website', 'वेबसाइट')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Owner Details */}
                  <td>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main)' }}>
                      {biz.ownerId?.name || t('N/A', 'उपलब्ध नहीं')}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Mail size={12} /> {biz.ownerId?.email || 'N/A'}
                    </div>
                    {biz.ownerId?.phone && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                        <Phone size={12} /> {biz.ownerId.phone}
                      </div>
                    )}
                  </td>

                  {/* Tax IDs */}
                  <td>
                    <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: '600', color: '#1e293b' }}>
                      GST: {biz.gstNumber}
                    </div>
                    <div style={{ fontSize: '12.5px', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '2px' }}>
                      PAN: {biz.companyPanNumber}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`badge ${
                      biz.status === 'approved' ? 'success' : biz.status === 'pending' ? 'warning' : 'danger'
                    }`}>
                      <span className="badge-dot"></span>
                      {biz.status === 'approved' 
                        ? t('Approved', 'स्वीकृत') 
                        : biz.status === 'pending' 
                          ? t('Pending Approval', 'स्वीकृति लंबित') 
                          : t('Rejected', 'अस्वीकृत')}
                    </span>
                    {biz.rejectionReason && (
                      <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={biz.rejectionReason}>
                        {biz.rejectionReason}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedBusiness(biz)}
                        title={t('View Full Details', 'पूर्ण विवरण देखें')}
                      >
                        <Eye size={14} />
                        {t('View', 'देखें')}
                      </button>

                      {/* Quick Approve Button (Triggers Confirmation Popup) */}
                      {biz.status !== 'approved' && (
                        <button
                          className="btn btn-sm"
                          style={{ background: '#10b981', color: 'white', border: 'none' }}
                          onClick={() => setApproveConfirmProfile(biz)}
                          disabled={actionLoadingId === biz._id}
                          title={t('Approve Company', 'कंपनी को स्वीकृत करें')}
                        >
                          <Check size={14} />
                          {t('Approve', 'स्वीकृत')}
                        </button>
                      )}

                      {/* Quick Reject Button */}
                      {biz.status !== 'rejected' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setRejectModalProfile(biz);
                            setRejectionReason('');
                          }}
                          disabled={actionLoadingId === biz._id}
                          title={t('Reject Company', 'कंपनी को अस्वीकृत करें')}
                        >
                          <X size={14} />
                          {t('Reject', 'अस्वीकृत')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                  <Building2 size={36} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-main)' }}>
                    {t('No business profiles found.', 'कोई व्यापार प्रोफ़ाइल नहीं मिली।')}
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>
                    {businessStatusFilter !== 'All' 
                      ? t(`No ${businessStatusFilter} profiles available.`, `कोई ${businessStatusFilter} प्रोफ़ाइल उपलब्ध नहीं है।`)
                      : t('Users have not submitted any corporate registration requests yet.', 'उपयोगकर्ताओं ने अभी तक कोई कॉर्पोरेट पंजीकरण अनुरोध प्रस्तुत नहीं किया है।')}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 🔍 MODAL: VIEW BUSINESS PROFILE DETAILS                                    */}
      {/* ========================================================================= */}
      {selectedBusiness && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          animation: 'pageEnter 0.2s ease-out'
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: '560px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              padding: '24px',
              color: 'white',
              position: 'relative'
            }}>
              <button 
                onClick={() => setSelectedBusiness(null)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px'
                }}>
                  <Building2 size={26} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800' }}>
                    {selectedBusiness.registeredCompanyName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
                    <span>{selectedBusiness.companyType}</span>
                    <span>•</span>
                    <span style={{
                      color: selectedBusiness.status === 'approved' ? '#34d399' : selectedBusiness.status === 'pending' ? '#fbbf24' : '#f87171',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {selectedBusiness.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body Info */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* GST & PAN Box */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>GST Number</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', marginTop: '2px', color: '#0f172a' }}>
                      {selectedBusiness.gstNumber}
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Company PAN</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', marginTop: '2px', color: '#0f172a' }}>
                      {selectedBusiness.companyPanNumber}
                    </div>
                  </div>
                </div>

                {/* Corporate Address */}
                <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Corporate Address</div>
                  <div style={{ fontSize: '13.5px', marginTop: '3px', color: '#334155', lineHeight: '1.4' }}>
                    {selectedBusiness.registeredCorporateAddress || 'N/A'}
                  </div>
                </div>

                {/* Official Website */}
                {selectedBusiness.officialWebsite && (
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Official Website</div>
                    <a 
                      href={selectedBusiness.officialWebsite} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ fontSize: '13.5px', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginTop: '3px', fontWeight: '600' }}
                    >
                      {selectedBusiness.officialWebsite} <ExternalLink size={13} />
                    </a>
                  </div>
                )}

                {/* Account Owner */}
                <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Account Owner Profile</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{selectedBusiness.ownerId?.name || 'N/A'}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{selectedBusiness.ownerId?.email}</div>
                  {selectedBusiness.ownerId?.phone && (
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '1px' }}>Phone: {selectedBusiness.ownerId.phone}</div>
                  )}
                </div>

                {/* Rejection Reason if any */}
                {selectedBusiness.rejectionReason && (
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: '11px', color: '#b91c1c', textTransform: 'uppercase', fontWeight: '700' }}>Rejection Reason</div>
                    <div style={{ fontSize: '13px', color: '#991b1b', marginTop: '3px' }}>
                      {selectedBusiness.rejectionReason}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons in Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedBusiness.status !== 'approved' && (
                    <button
                      className="btn btn-sm"
                      style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => setApproveConfirmProfile(selectedBusiness)}
                      disabled={actionLoadingId === selectedBusiness._id}
                    >
                      <Check size={16} />
                      {t('Approve Company', 'कंपनी स्वीकृत करें')}
                    </button>
                  )}

                  {selectedBusiness.status !== 'rejected' && (
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => {
                        setRejectModalProfile(selectedBusiness);
                        setRejectionReason('');
                      }}
                      disabled={actionLoadingId === selectedBusiness._id}
                    >
                      <X size={16} />
                      {t('Reject Company', 'कंपनी अस्वीकृत करें')}
                    </button>
                  )}
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedBusiness(null)}
                >
                  {t('Close', 'बंद करें')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ✅ MODAL: APPROVE CONFIRMATION POPUP                                      */}
      {/* ========================================================================= */}
      {approveConfirmProfile && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          animation: 'pageEnter 0.2s ease-out'
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
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
                flexShrink: 0
              }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  {t('Approve Business Profile?', 'व्यापार प्रोफ़ाइल स्वीकृत करें?')}
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                  {t('Please confirm verification for this company.', 'कृपया इस कंपनी के सत्यापन की पुष्टि करें।')}
                </p>
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                {approveConfirmProfile.registeredCompanyName}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', flexWrap: 'gap', gap: '10px', marginBottom: '8px' }}>
                <span style={{ background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                  {approveConfirmProfile.companyType}
                </span>
                <span>GST: <b style={{ fontFamily: 'monospace', color: '#0f172a' }}>{approveConfirmProfile.gstNumber}</b></span>
                {approveConfirmProfile.companyPanNumber && (
                  <span>PAN: <b style={{ fontFamily: 'monospace', color: '#0f172a' }}>{approveConfirmProfile.companyPanNumber}</b></span>
                )}
              </div>
              <div style={{ fontSize: '12.5px', color: '#475569' }}>
                {t('Owner:', 'मालिक:')} <b>{approveConfirmProfile.ownerId?.name || 'N/A'}</b> {approveConfirmProfile.ownerId?.email ? `(${approveConfirmProfile.ownerId.email})` : ''}
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              {t(
                'Are you sure you want to approve this company? Once approved, the business profile will be marked as verified and the company will gain access to platform features.',
                'क्या आप वाकई इस कंपनी को स्वीकृत करना चाहते हैं? स्वीकृत करने पर यह व्यापार प्रोफ़ाइल सत्यापित हो जाएगी।'
              )}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setApproveConfirmProfile(null)}
                disabled={actionLoadingId === approveConfirmProfile._id}
              >
                {t('Cancel', 'रद्द करें')}
              </button>
              <button
                className="btn btn-sm"
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                disabled={actionLoadingId === approveConfirmProfile._id}
                onClick={() => handleUpdateStatus(approveConfirmProfile._id, 'approved')}
              >
                <Check size={16} />
                {actionLoadingId === approveConfirmProfile._id 
                  ? t('Approving...', 'स्वीकृत कर रहे हैं...') 
                  : t('Yes, Approve Company', 'हाँ, स्वीकृत करें')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ❌ MODAL: REJECT REASON PROMPT                                             */}
      {/* ========================================================================= */}
      {rejectModalProfile && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: '440px',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
                {t('Reject Business Profile', 'व्यापार प्रोफ़ाइल अस्वीकृत करें')}
              </h3>
            </div>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 16px 0' }}>
              {t('Please provide a reason for rejecting', 'कृपया अस्वीकृत करने का कारण दर्ज करें')}{' '}
              <b>{rejectModalProfile.registeredCompanyName}</b>:
            </p>

            <textarea
              className="form-control"
              rows={3}
              placeholder={t('e.g. Invalid GST number, unclear corporate address, duplicate submission...', 'उदा. अमान्य GST नंबर, पता अस्पष्ट है...')}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', fontSize: '13.5px', borderRadius: '8px', marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setRejectModalProfile(null)}
              >
                {t('Cancel', 'रद्द करें')}
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={!rejectionReason.trim() || actionLoadingId === rejectModalProfile._id}
                onClick={() => handleUpdateStatus(rejectModalProfile._id, 'rejected', rejectionReason.trim())}
              >
                {actionLoadingId === rejectModalProfile._id ? t('Rejecting...', 'अस्वीकृत कर रहे हैं...') : t('Confirm Reject', 'अस्वीकृति की पुष्टि करें')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProfiles;
