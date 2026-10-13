import React, { useState } from 'react';
import { 
  Landmark, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Plus, 
  Download, 
  FileText, 
  Eye, 
  Filter,
  AlertTriangle,
  X,
  Calendar,
  Building2,
  FileCheck2
} from 'lucide-react';

const INITIAL_REQUESTS = [
  {
    id: 'GOV-2026-0914',
    agency: 'Cyber Crime Investigation Cell (CCIC)',
    department: 'Ministry of Home Affairs / Delhi Police',
    officer: 'Insp. Vikram Singhal (ID: DL-88412)',
    legalBasis: 'Sec 91 Cr.P.C. / FIR #241/2026 (Urgent Distress)',
    date: '10 Oct 2026, 14:30',
    dataScope: 'Last Known GPS Coordinates & Emergency Beacon Trail (48 hrs)',
    status: 'Completed',
    urgency: 'Critical',
    hash: 'SHA256: 4e8b...99a1'
  },
  {
    id: 'GOV-2026-0882',
    agency: 'State Disaster Response Force (SDRF)',
    department: 'Uttarakhand State Emergency Operations',
    officer: 'Dy. SP Ananya Rawat (ID: UK-04192)',
    legalBasis: 'National Disaster Mgmt Act - Avalanche Search Operation',
    date: '08 Oct 2026, 09:15',
    dataScope: 'Hiker Altitude Tracker & Family Circle Contact Numbers',
    status: 'Completed',
    urgency: 'High',
    hash: 'SHA256: 7f3c...21b0'
  },
  {
    id: 'GOV-2026-0795',
    agency: 'Anti-Trafficking Police Unit',
    department: 'Maharashtra Police HQ, Mumbai',
    officer: 'ACP Rakesh Kulkarni (ID: MH-55201)',
    legalBasis: 'Judicial Magistrate Order #JM-2026/881',
    date: '02 Oct 2026, 18:40',
    dataScope: 'Minor Geofence Breach Timestamp Logs & Linked Device IDs',
    status: 'In Review',
    urgency: 'High',
    hash: 'Pending Verification'
  },
  {
    id: 'GOV-2026-0641',
    agency: 'Regional Commercial Tax Enforcement',
    department: 'State Revenue Bureau',
    officer: 'Officer M. Sundaram',
    legalBasis: 'Notice Sec 133(6) (Commercial dispute request)',
    date: '28 Sep 2026, 11:20',
    dataScope: 'Complete User History & Communication Records',
    status: 'Rejected',
    urgency: 'Low',
    hash: 'Denied - Overbroad / Lack of Court Order'
  }
];

const GovtRequests = ({ isHindi }) => {
  const t = (en, hi) => (isHindi ? hi : en);

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // New Request Form State
  const [formData, setFormData] = useState({
    agency: '',
    officer: '',
    legalBasis: '',
    dataScope: '',
    urgency: 'High'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!formData.agency || !formData.legalBasis) return;

    const newReq = {
      id: `GOV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      agency: formData.agency,
      department: 'Law Enforcement / Government Body',
      officer: formData.officer || 'Duty Officer',
      legalBasis: formData.legalBasis,
      date: 'Just Now',
      dataScope: formData.dataScope || 'Specific Emergency Telemetry Log',
      status: 'In Review',
      urgency: formData.urgency,
      hash: 'Verification Underway'
    };

    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    setFormData({ agency: '', officer: '', legalBasis: '', dataScope: '', urgency: 'High' });
    showToast(t('New law enforcement compliance audit record created!', 'नया कानून प्रवर्तन अनुपालन रिकॉर्ड सफलतापूर्वक बनाया गया!'));
  };

  const filtered = requests.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.agency.toLowerCase().includes(search.toLowerCase()) ||
      r.officer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="content">
      {/* Toast Notification */}
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
            <Landmark size={26} color="var(--primary)" />
            {t('Government & Legal Requests', 'सरकारी और कानूनी डेटा अनुरोध')}
          </h2>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            {t('Strict end-to-end audit trail for law enforcement data disclosure and statutory subpoenas.', 'कानून प्रवर्तन और अदालती सम्मन के तहत सुरक्षित और पारदर्शी ऑडिट ट्रेल।')}
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
        >
          <Plus size={18} />
          {t('Log Compliance Request', 'नया अनुरोध दर्ज करें')}
        </button>
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
            <Landmark size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Total Inquiries', 'कुल अनुरोध')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>14</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <FileCheck2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Complied & Released', 'प्रदत्त / स्वीकृत')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>11</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Legal Review Pending', 'कानूनी समीक्षा में')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>2</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('Denied / Unwarranted', 'अस्वीकृत')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>1</div>
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
            placeholder={t('Search by agency, case ID, or investigating officer...', 'एजेंसी, केस ID या अधिकारी के नाम से खोजें...')}
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
            <option value="Completed">{t('Completed', 'स्वीकृत / पूर्ण')}</option>
            <option value="In Review">{t('In Review', 'समीक्षाधीन')}</option>
            <option value="Rejected">{t('Rejected', 'अस्वीकृत')}</option>
          </select>
        </div>
      </div>

      {/* Main Requests Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('Case Ref / ID', 'केस संदर्भ')}</th>
              <th>{t('Enforcement Agency', 'कानून प्रवर्तन एजेंसी')}</th>
              <th>{t('Legal Section / Basis', 'कानूनी आधार')}</th>
              <th>{t('Data Scope', 'अनुरोधित डेटा')}</th>
              <th>{t('Status', 'स्थिति')}</th>
              <th style={{ textAlign: 'right' }}>{t('Actions', 'कार्रवाई')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '50px 0' }}>
                  <Landmark size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    {t('No government disclosure requests matched your search criteria.', 'कोई सरकारी अनुरोध रिकॉर्ड नहीं मिला।')}
                  </span>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} style={{ transition: 'background-color 0.15s ease' }}>
                  <td>
                    <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)', fontSize: '13px' }}>
                      {item.id}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Calendar size={12} /> {item.date}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.agency}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.officer}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{item.legalBasis}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px', lineHeight: '1.4' }}>
                      {item.dataScope}
                    </div>
                  </td>
                  <td>
                    {item.status === 'Completed' && (
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> {t('Complied', 'अनुपालन पूर्ण')}
                      </span>
                    )}
                    {item.status === 'In Review' && (
                      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {t('Under Review', 'समीक्षा में')}
                      </span>
                    )}
                    {item.status === 'Rejected' && (
                      <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={12} /> {t('Refused', 'अस्वीकृत')}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => setSelectedRequest(item)}
                        style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="View Packet"
                      >
                        <Eye size={14} />
                        {t('Details', 'विवरण')}
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => showToast(t(`Audit receipt downloaded for ${item.id}`, `ऑडिट रसीद डाउनलोड हो गई (${item.id})`))}
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        title="Download Certificate"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details View Modal */}
      {selectedRequest && (
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
          <div className="card" style={{ maxWidth: '620px', width: '100%', padding: '28px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setSelectedRequest(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <FileText size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{t('Statutory Audit Dossier', 'वैधानिक ऑडिट डोजियर')}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{selectedRequest.id}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Requesting Agency', 'एजेंसी')}</span>
                <div style={{ fontWeight: 600, marginTop: '2px', fontSize: '13px' }}>{selectedRequest.agency}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Investigating Officer', 'अधिकारी')}</span>
                <div style={{ fontWeight: 600, marginTop: '2px', fontSize: '13px' }}>{selectedRequest.officer}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Statutory Reference', 'कानूनी धारा')}</span>
                <div style={{ fontWeight: 600, marginTop: '2px', fontSize: '13px' }}>{selectedRequest.legalBasis}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Current Status', 'स्थिति')}</span>
                <div style={{ fontWeight: 600, marginTop: '2px', fontSize: '13px' }}>{selectedRequest.status}</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                {t('Scope of Requested Telemetry', 'डेटा का दायरा')}
              </label>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', lineHeight: 1.5 }}>
                {selectedRequest.dataScope}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                {t('Cryptographic Verification Hash', 'क्रिप्टोग्राफिक ऑडिट हैश')}
              </label>
              <div style={{ padding: '10px', backgroundColor: '#0f172a', color: '#10b981', fontFamily: 'monospace', fontSize: '12px', borderRadius: '8px' }}>
                {selectedRequest.hash}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedRequest(null)}>
                {t('Close', 'बंद करें')}
              </button>
              <button className="btn btn-primary" onClick={() => {
                showToast(t('Certified PDF dossier downloaded.', 'प्रमाणित PDF डोजियर डाउनलोड हो गया।'));
                setSelectedRequest(null);
              }}>
                <Download size={16} />
                {t('Download Signed Dossier', 'हस्ताक्षरित डोजियर डाउनलोड करें')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Request Modal */}
      {isModalOpen && (
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
          <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '28px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Building2 size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{t('Log Law Enforcement Notice', 'सरकारी अनुरोध लॉग करें')}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                  {t('Record judicial subpoenas or distress warrants for full statutory compliance.', 'पूर्ण कानूनी अनुपालन हेतु न्यायिक सम्मन या वारंट दर्ज करें।')}
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('Requesting Agency / Force', 'अनुरोधकर्ता एजेंसी')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. State Cyber Cell / Delhi Police" 
                  required
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('Investigating Officer & Badge #', 'जांच अधिकारी और बैज नंबर')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Inspector R. Sharma (Badge #8821)" 
                  value={formData.officer}
                  onChange={(e) => setFormData({ ...formData, officer: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('Legal Section / Court Warrant Ref', 'कानूनी धारा / कोर्ट वारंट नंबर')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Sec 91 CrPC / High Court Writ #1920" 
                  required
                  value={formData.legalBasis}
                  onChange={(e) => setFormData({ ...formData, legalBasis: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('Requested Data Scope', 'अनुरोधित डेटा का दायरा')}</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder={t('Describe target phone, time window, GPS logs, or emergency circle contacts...', 'फ़ोन नंबर, समय सीमा, जीपीएस लॉग्स आदि का विवरण दें...')}
                  value={formData.dataScope}
                  onChange={(e) => setFormData({ ...formData, dataScope: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  {t('Cancel', 'रद्द करें')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('Record in Ledger', 'लेज़र में दर्ज करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovtRequests;
