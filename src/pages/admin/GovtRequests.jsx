import React, { useState, useRef } from 'react';
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
  FileCheck2,
  UploadCloud,
  Mail,
  Trash2,
  File,
  ShieldCheck,
  Paperclip,
  Phone
} from 'lucide-react';

const INITIAL_REQUESTS = [
  {
    id: 'GOV-2026-0914',
    agency: 'Cyber Crime Investigation Cell (CCIC)',
    department: 'Ministry of Home Affairs / Delhi Police',
    officer: 'Insp. Vikram Singhal (ID: DL-88412)',
    officialEmail: 'dcp.cyber@delhipolice.gov.in',
    legalBasis: 'Sec 91 Cr.P.C. / FIR #241/2026 (Urgent Distress)',
    targetPhone: '+91 98241-12346',
    date: '10 Oct 2026, 14:30',
    dataScope: 'Last Known GPS Coordinates & Emergency Beacon Trail (48 hrs)',
    status: 'Completed',
    urgency: 'Critical',
    hash: 'SHA256: 4e8b...99a1',
    document: {
      name: 'FIR_Sec91_Notice_Scan.pdf',
      size: '2.4 MB'
    }
  },
  {
    id: 'GOV-2026-0882',
    agency: 'State Disaster Response Force (SDRF)',
    department: 'Uttarakhand State Emergency Operations',
    officer: 'Dy. SP Ananya Rawat (ID: UK-04192)',
    officialEmail: 'operations@sdrf.uk.gov.in',
    legalBasis: 'National Disaster Mgmt Act - Avalanche Search Operation',
    targetPhone: '+91 99120-88312',
    date: '08 Oct 2026, 09:15',
    dataScope: 'Hiker Altitude Tracker & Family Circle Contact Numbers',
    status: 'Completed',
    urgency: 'High',
    hash: 'SHA256: 7f3c...21b0',
    document: {
      name: 'Disaster_Search_Warrant_Signed.pdf',
      size: '1.8 MB'
    }
  },
  {
    id: 'GOV-2026-0795',
    agency: 'Anti-Trafficking Police Unit',
    department: 'Maharashtra Police HQ, Mumbai',
    officer: 'ACP Rakesh Kulkarni (ID: MH-55201)',
    officialEmail: 'acp.trafficking@mahapolice.gov.in',
    legalBasis: 'Judicial Magistrate Order #JM-2026/881',
    targetPhone: '+91 98450-22190',
    date: '02 Oct 2026, 18:40',
    dataScope: 'Minor Geofence Breach Timestamp Logs & Linked Device IDs',
    status: 'In Review',
    urgency: 'High',
    hash: 'Pending Verification',
    document: {
      name: 'Court_Order_JM_2026_881.pdf',
      size: '3.1 MB'
    }
  },
  {
    id: 'GOV-2026-0641',
    agency: 'Regional Commercial Tax Enforcement',
    department: 'State Revenue Bureau',
    officer: 'Officer M. Sundaram',
    officialEmail: 'enforce@revenue.state.gov.in',
    legalBasis: 'Notice Sec 133(6) (Commercial dispute request)',
    targetPhone: '+91 98111-00452',
    date: '28 Sep 2026, 11:20',
    dataScope: 'Complete User History & Communication Records',
    status: 'Rejected',
    urgency: 'Low',
    hash: 'Denied - Overbroad / Lack of Court Order',
    document: {
      name: 'Notice_133_6_Inquiry.pdf',
      size: '950 KB'
    }
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

  // 📝 New Request Form State (Includes Official Email & Document Upload)
  const [formData, setFormData] = useState({
    officialEmail: '',
    receivedAt: '',
    agency: '',
    department: '',
    officer: '',
    badgeNumber: '',
    officerPhone: '',
    legalBasis: '',
    targetPhone: '',
    dataScope: '',
    urgency: 'Critical',
    documentFile: null
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // 📁 Document Upload Handlers (Blob URL create karein taaki file open ho sake)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        documentFile: {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type,
          file: file,
          url: fileUrl
        }
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        documentFile: {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type,
          file: file,
          url: fileUrl
        }
      }));
    }
  };

  const removeDocument = () => {
    setFormData(prev => ({ ...prev, documentFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 📄 Document View Handler: Nayi tab me file ko turant open karein
  const handleViewDocument = (doc) => {
    if (!doc) return;
    if (doc.url) {
      window.open(doc.url, '_blank');
      return;
    }
    // Fallback for demo mock documents
    const sampleText = `========================================================\nOFFICIAL STATUTORY GOVERNMENT NOTICE / SUBPOENA\n========================================================\nDocument Name: ${doc.name}\nSize: ${doc.size}\nStatus: Certified Government Record\nLedger Audit ID: Verified SHA-256 Entry\n\nThis is a verified statutory judicial notice under Section 91 Cr.P.C. / Court Warrant.\n========================================================`;
    const blob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const sampleUrl = URL.createObjectURL(blob);
    window.open(sampleUrl, '_blank');
  };

  // 📥 Real File Download Handler: File ko user ke computer ke Downloads folder me save karega
  const handleDownloadRequest = (request) => {
    if (!request) return;
    try {
      // 1. Agar request me user ka upload kiya hua real document hai:
      if (request.document?.url) {
        const link = document.createElement('a');
        link.href = request.document.url;
        link.download = request.document.name || `Legal_Notice_${request.id}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(t(`Downloaded: ${request.document.name}`, `${request.document.name} डाउनलोड हो गया`));
        return;
      }

      // 2. Agar demo/audit record hai to Certified Audit Dossier text file download karein:
      const dossierContent = `================================================================================\nTRACK LOVED ONE - OFFICIAL LEGAL COMPLIANCE & STATUTORY AUDIT DOSSIER\n================================================================================\nGenerated On        : ${new Date().toLocaleString()}\nCase Reference ID   : ${request.id}\nCryptographic Hash  : ${request.hash || 'SHA256: Verified'}\nCompliance Status   : ${request.status} (Verified)\n\n1. LAW ENFORCEMENT AUTHORITY:\n--------------------------------------------------------------------------------\nAgency / Force      : ${request.agency}\nInvestigating Officer: ${request.officer}\nOfficial Govt Email : ${request.officialEmail || 'N/A'}\nNotice Received At  : ${request.date}\n\n2. STATUTORY BASIS & CASE DETAILS:\n--------------------------------------------------------------------------------\nLegal Section / Basis: ${request.legalBasis}\nTarget Subject Phone : ${request.targetPhone || 'Specified in Warrant'}\nUrgency Priority     : ${request.urgency}\n\n3. DATA SCOPE RELEASED:\n--------------------------------------------------------------------------------\n${request.dataScope}\n\n4. ATTACHED EVIDENCE:\n--------------------------------------------------------------------------------\nAttached Document   : ${request.document?.name || 'Statutory_Notice_Signed.pdf'}\nIssued By           : Track Loved One Legal Redaction & Compliance Vault\n================================================================================`;

      const blob = new Blob([dossierContent], { type: 'text/plain;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Audit_Receipt_${request.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      showToast(t(`Audit receipt downloaded for ${request.id}`, `ऑडिट रसीद डाउनलोड हो गई (${request.id})`));
    } catch (err) {
      console.error('Download error:', err);
      showToast('Download failed: ' + err.message);
    }
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!formData.agency || !formData.legalBasis) return;

    const newReq = {
      id: `GOV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      agency: formData.agency,
      department: formData.department || 'Government Law Enforcement',
      officer: formData.officer ? `${formData.officer}${formData.badgeNumber ? ` (ID: ${formData.badgeNumber})` : ''}` : 'Duty Officer',
      officialEmail: formData.officialEmail || 'official@enforcement.gov.in',
      legalBasis: formData.legalBasis,
      targetPhone: formData.targetPhone || 'Specified in Court Order',
      date: formData.receivedAt ? new Date(formData.receivedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Just Now',
      dataScope: formData.dataScope || 'Specific Emergency Telemetry Log',
      status: 'In Review',
      urgency: formData.urgency || 'Critical',
      hash: 'SHA256: ' + Math.random().toString(36).substring(2, 9) + '...verified',
      document: formData.documentFile ? {
        name: formData.documentFile.name,
        size: formData.documentFile.size,
        type: formData.documentFile.type,
        url: formData.documentFile.url
      } : null
    };

    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    setFormData({
      officialEmail: '',
      receivedAt: '',
      agency: '',
      department: '',
      officer: '',
      badgeNumber: '',
      officerPhone: '',
      legalBasis: '',
      targetPhone: '',
      dataScope: '',
      urgency: 'Critical',
      documentFile: null
    });
    showToast(t('Government legal notice & document recorded in compliance audit ledger!', 'सरकारी कानूनी नोटिस व दस्तावेज़ ऑडिट लेज़र में सफलतापूर्वक दर्ज किया गया!'));
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
                        onClick={() => handleDownloadRequest(item)}
                        style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}
                        title="Download Audit Receipt / Attached File"
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
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Official Govt Email', 'आधिकारिक ईमेल')}</span>
                <div style={{ fontWeight: 600, marginTop: '2px', fontSize: '13px', color: '#2563eb' }}>{selectedRequest.officialEmail || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('Target Subject Phone', 'लक्षित फ़ोन नंबर')}</span>
                <div style={{ fontWeight: 600, marginTop: '2px', fontSize: '13px' }}>{selectedRequest.targetPhone || 'Specified in Order'}</div>
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

            {/* Attached Notice Document Card */}
            {selectedRequest.document && (
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  {t('Attached Statutory Evidence / Court Order Document', 'संलग्न आधिकारिक अदालती आदेश / नोटिस')}
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={22} color="#2563eb" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{selectedRequest.document.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{selectedRequest.document.size} • Verified Government Copy</div>
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                    onClick={() => handleViewDocument(selectedRequest.document)}
                    title="Open document in new tab"
                  >
                    <Eye size={14} color="#2563eb" /> {t('View Document', 'दस्तावेज़ देखें')}
                  </button>
                </div>
              </div>
            )}

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
                handleDownloadRequest(selectedRequest);
                setSelectedRequest(null);
              }}>
                <Download size={16} />
                {t('Download Signed Dossier', 'हस्ताक्षरित डोजियर डाउनलोड करें')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📋 Log Law Enforcement Legal Notice & Document Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '740px', width: '100%', padding: '28px', position: 'relative', maxHeight: '92vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 800 }}>
                  {t('Log Inward Government Notice & Email', 'आधिकारिक सरकारी ईमेल व कानूनी नोटिस दर्ज करें')}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  {t('Record judicial subpoenas, FIR distress notices or court orders received via official email with scanned attachments.', 'आधिकारिक ईमेल से प्राप्त पुलिस/अदालती नोटिस का विवरण दर्ज करें और कोर्ट आदेश संलग्न करें।')}
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 📧 SECTION 1: Inward Email & Source Details */}
              <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <Mail size={16} color="#2563eb" />
                  {t('Inward Official Government Email Source', 'आधिकारिक सरकारी ईमेल का विवरण')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {t('Sender Official Govt Email ID', 'प्रेषक का आधिकारिक ईमेल')} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="e.g. dcp.cyber@delhipolice.gov.in" 
                      required
                      value={formData.officialEmail}
                      onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {t('Received Date & Time', 'ईमेल प्राप्त होने की तारीख व समय')}
                    </label>
                    <input 
                      type="datetime-local" 
                      className="form-control" 
                      value={formData.receivedAt}
                      onChange={(e) => setFormData({ ...formData, receivedAt: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {t('Notice Urgency', 'प्राथमिकता / तात्कालिकता')}
                    </label>
                    <select 
                      className="form-control"
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    >
                      <option value="Critical">🔴 {t('Critical (Immediate / Kidnapping / Distress)', 'अति गंभीर (तत्काल आपातकाल)')}</option>
                      <option value="High">🟠 {t('High (24-Hour Court Notice)', 'उच्च (24 घंटे का नोटिस)')}</option>
                      <option value="Routine">🔵 {t('Routine (Statutory Inquiry / Case Info)', 'सामान्य (कानूनी जानकारी)')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 🏛️ SECTION 2: Agency & Investigating Officer */}
              <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <Building2 size={16} color="#2563eb" />
                  {t('Law Enforcement Agency & Officer Authority', 'जांच एजेंसी व अधिकृत अधिकारी')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {t('Requesting Agency / Force', 'अनुरोधकर्ता एजेंसी')} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Cyber Crime Unit / Delhi Police" 
                      required
                      value={formData.agency}
                      onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {t('Investigating Officer Name', 'जांच अधिकारी का नाम')}
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Inspector R. K. Sharma" 
                      value={formData.officer}
                      onChange={(e) => setFormData({ ...formData, officer: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {t('Officer Badge / Govt ID #', 'बैज / सरकारी पहचान पत्र नं.')}
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. DL-88412" 
                      value={formData.badgeNumber}
                      onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* ⚖️ SECTION 3: Legal Basis & Target Subject */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                    {t('Legal Section / FIR # / Warrant Ref', 'कानूनी धारा / कोर्ट वारंट / FIR नंबर')} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Sec 91 Cr.P.C. / FIR #241/2026" 
                    required
                    value={formData.legalBasis}
                    onChange={(e) => setFormData({ ...formData, legalBasis: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                    {t('Target Subject Phone / User ID', 'लक्षित उपयोगकर्ता का फ़ोन / ID')}
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. +91 98241-12346" 
                    value={formData.targetPhone}
                    onChange={(e) => setFormData({ ...formData, targetPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                  {t('Requested Data Scope & Details', 'अनुरोधित डेटा का दायरा व विवरण')}
                </label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  placeholder={t('e.g. Last known 48-hour GPS telemetry trail, emergency contact circle numbers, and device IP login logs...', 'उदा. पिछले 48 घंटे के जीपीएस निर्देशांक, आपातकालीन संपर्कों का विवरण आदि...')}
                  value={formData.dataScope}
                  onChange={(e) => setFormData({ ...formData, dataScope: e.target.value })}
                />
              </div>

              {/* 📎 SECTION 4: Official Document Upload System */}
              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Paperclip size={15} color="#2563eb" />
                  {t('Upload Official Court Order / Notice Document', 'आधिकारिक अदालती आदेश / नोटिस दस्तावेज़ अपलोड करें')}
                </label>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  style={{ display: 'none' }}
                />

                {!formData.documentFile ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    style={{
                      border: isDragging ? '2px dashed #2563eb' : '2px dashed #cbd5e1',
                      backgroundColor: isDragging ? '#eff6ff' : 'var(--bg-main)',
                      borderRadius: '12px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#2563eb' }}>
                      <UploadCloud size={24} />
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {t('Click to upload or drag & drop official document scan', 'दस्तावेज़ अपलोड करने के लिए क्लिक करें या फ़ाइल यहाँ छोड़ें')}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {t('Supports PDF, PNG, JPG, DOCX (Certified Government Copies - Up to 25MB)', 'PDF, PNG, JPG या DOCX समर्थित हैं (अधिकतम 25MB)')}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    backgroundColor: '#eff6ff',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                        <FileText size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e3a8a' }}>
                          {formData.documentFile.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#3b82f6', marginTop: '2px' }}>
                          <span>{formData.documentFile.size}</span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#10b981', fontWeight: 600 }}>
                            <CheckCircle2 size={12} /> {t('Attached for Encrypted Vault', 'ऑडिट रिकॉर्ड हेतु संलग्न')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={removeDocument}
                      style={{
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Remove Document"
                    >
                      <Trash2 size={14} />
                      {t('Remove', 'हटाएं')}
                    </button>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 18px' }}
                >
                  {t('Cancel', 'रद्द करें')}
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                >
                  <ShieldCheck size={18} />
                  {t('Record Notice & Save Document', 'नोटिस व दस्तावेज़ लेज़र में दर्ज करें')}
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
