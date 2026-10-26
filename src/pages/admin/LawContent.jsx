import React, { useState, useEffect } from 'react';
import { Scale, Video, FileText, UploadCloud, Play, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
import { adminApi } from '../../_config/api';

const STATES_LIST = [
  "Central",
  "Delhi",
  "Uttar Pradesh",
  "Maharashtra",
  "Bihar",
  "Rajasthan",
  "Madhya Pradesh",
  "Haryana",
  "Punjab",
  "Karnataka"
];

// 🏛️ Client PDF ke 3 Official Legal Sections aur unke Acts/Modules
const SECTIONS_CONFIG = {
  "Section A: Constitutional & Civil Rights": [
    "The Constitution of India, 1950 (Fundamental Rights & Duties)",
    "Digital Personal Data Protection (DPDP) Act, 2023 (Data Sovereignty)",
  ],
  "Section B: National Criminal & Security Codes": [
    "Bharatiya Nyaya Sanhita (BNS), 2023 / Indian Penal Code",
    "Information Technology (IT) Act, 2000 (Cyber Crimes & System Protections)",
  ],
  "Section C: Commerce, Labor, & Facilitation Codes": [
    "The Indian Contract Act, 1872 (Agreements & Safe-Harbor Transactions)",
    "Code on Wages & Industrial Relations (Intermediary Non-Employment Protections)",
  ],
};

const DEFAULT_SECTION = "Section A: Constitutional & Civil Rights";

const LawContent = ({ isHindi }) => {
  const [toast, setToast] = useState('');
  
  // Video Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoSection, setVideoSection] = useState(DEFAULT_SECTION);
  const [videoLawModule, setVideoLawModule] = useState(SECTIONS_CONFIG[DEFAULT_SECTION][0]);
  const [videoState, setVideoState] = useState('Central');

  // PDF Form State
  const [docTitle, setDocTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [docSection, setDocSection] = useState(DEFAULT_SECTION);
  const [docLawModule, setDocLawModule] = useState(SECTIONS_CONFIG[DEFAULT_SECTION][0]);
  const [docState, setDocState] = useState('Central');

  const [loading, setLoading] = useState(false);
  const [lawList, setLawList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [filterSection, setFilterSection] = useState('All');

  const t = (en, hi) => (isHindi ? hi : en);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Fetch all published Law Content via Axios
  const fetchLawList = async () => {
    try {
      setListLoading(true);
      const res = await adminApi.getLawContent();
      if (res.data?.success && Array.isArray(res.data.data)) {
        setLawList(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching law content:', err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchLawList();
  }, []);

  // 1. Submit Video via Axios
  const handlePublishVideo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await adminApi.addLegalVideo({
        title: videoTitle,
        url: videoUrl,
        section: videoSection,
        lawModule: videoLawModule,
        category: videoSection, // backward compatibility
        state: videoState
      });

      const data = res.data;
      if (data.success) {
        showToast(t('Video published successfully!', 'वीडियो प्रकाशित हुआ!'));
        setVideoTitle('');
        setVideoUrl('');
        fetchLawList();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error publishing video:', err);
      alert(err.message || 'Failed to publish video');
    } finally {
      setLoading(false);
    }
  };

  // 2. Upload PDF via Axios
  const handleUploadPdf = async (e) => {
    e.preventDefault();
    if (!pdfFile) return alert("Please select a PDF file");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', docTitle);
      formData.append('section', docSection);
      formData.append('lawModule', docLawModule);
      formData.append('category', docSection); // backward compatibility
      formData.append('state', docState);
      formData.append('pdf', pdfFile);

      const res = await adminApi.uploadLegalPdf(formData);
      const data = res.data;

      if (data.success) {
        showToast(t('Case study document uploaded!', 'दस्तावेज़ सफलतापूर्वक अपलोड!'));
        setDocTitle('');
        setPdfFile(null);
        fetchLawList();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error uploading PDF:', err);
      alert(err.message || 'Failed to upload PDF');
    } finally {
      setLoading(false);
    }
  };

  // Filtered List based on Section filter
  const displayedList = filterSection === 'All' 
    ? lawList 
    : lawList.filter(item => (item.section === filterSection || item.category === filterSection));

  return (
    <div className="content">
      {/* Toast popup */}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '14px 20px', borderRadius: '12px' }}>
          <span>{toast}</span>
        </div>
      )}

      {/* ⚠️ MANDATORY PLATFORM LEGAL DISCLAIMER BANNER (Client PDF Requirement) */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderLeft: '4px solid #0284c7',
        borderRadius: '14px',
        padding: '18px 22px',
        marginBottom: '26px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: '800', fontSize: '14px', marginBottom: '6px' }}>
          <Scale size={18} />
          <span>{t('MANDATORY PLATFORM LEGAL DISCLAIMER (DPDP Act & Safe-Harbor)', 'अनिवार्य प्लेटफ़ॉर्म कानूनी अस्वीकरण')}</span>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
          {t(
            'Track Loved Ones App operates strictly as a technological intermediary and neutral educational venue. The legal materials, section summaries, and video link resources hosted in this portal do not constitute formal legal advice, statutory representation, or professional advocacy. Utilization does not establish an attorney-client relationship.',
            'ट्रैक लव्ड वन्स ऐप केवल एक तकनीकी मध्यस्थ और तटस्थ शैक्षिक स्थल के रूप में कार्य करता है। इस पोर्टल में होस्ट की गई कानूनी सामग्री औपचारिक कानूनी सलाह या वकालत का गठन नहीं करती है।'
          )}
        </p>
      </div>

      {/* Forms Grid */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        
        {/* Add Legal Video Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Video size={20} color="#0ea5e9" />
            <h3 style={{ margin: 0 }}>{t('Add Legal Video', 'कानूनी वीडियो जोड़ें')}</h3>
          </div>
          <form onSubmit={handlePublishVideo}>
            <div className="form-group">
              <label>{t('Video Title', 'वीडियो शीर्षक')}</label>
              <input type="text" className="form-control" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t('YouTube / Video URL', 'यूट्यूब / वीडियो यूआरएल')}</label>
              <input type="url" className="form-control" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." required />
            </div>

            {/* 🏛️ Legal Section Dropdown */}
            <div className="form-group">
              <label>{t('Legal Section (Syllabus)', 'कानूनी धारा / भाग')}</label>
              <select 
                className="form-control" 
                value={videoSection} 
                onChange={e => {
                  const newSec = e.target.value;
                  setVideoSection(newSec);
                  setVideoLawModule(SECTIONS_CONFIG[newSec]?.[0] || '');
                }}
              >
                {Object.keys(SECTIONS_CONFIG).map(sec => <option key={sec} value={sec}>{sec}</option>)}
              </select>
            </div>

            {/* 📚 Specific Law Module Dropdown */}
            <div className="form-group">
              <label>{t('Law Module / Act', 'अधिनियम / मॉड्यूल')}</label>
              <select className="form-control" value={videoLawModule} onChange={e => setVideoLawModule(e.target.value)}>
                {SECTIONS_CONFIG[videoSection]?.map(mod => <option key={mod} value={mod}>{mod}</option>)}
              </select>
            </div>

            {/* 📍 State Filter Dropdown */}
            <div className="form-group">
              <label>{t('Applicable State', 'लागू राज्य')}</label>
              <select className="form-control" value={videoState} onChange={e => setVideoState(e.target.value)}>
                {STATES_LIST.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
              <Play size={16} /> {loading ? t('Publishing...', 'प्रकाशित हो रहा है...') : t('Publish Video', 'वीडियो प्रकाशित करें')}
            </button>
          </form>
        </div>

        {/* Upload Case Study PDF Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FileText size={20} color="#8b5cf6" />
            <h3 style={{ margin: 0 }}>{t('Upload Case Study PDF', 'केस स्टडी पीडीएफ अपलोड करें')}</h3>
          </div>
          <form onSubmit={handleUploadPdf}>
            <div className="form-group">
              <label>{t('Document Title', 'दस्तावेज़ शीर्षक')}</label>
              <input type="text" className="form-control" value={docTitle} onChange={e => setDocTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t('Select PDF Document', 'पीडीएफ दस्तावेज़ चुनें')}</label>
              <input type="file" className="form-control" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} required />
            </div>

            {/* 🏛️ Legal Section Dropdown */}
            <div className="form-group">
              <label>{t('Legal Section (Syllabus)', 'कानूनी धारा / भाग')}</label>
              <select 
                className="form-control" 
                value={docSection} 
                onChange={e => {
                  const newSec = e.target.value;
                  setDocSection(newSec);
                  setDocLawModule(SECTIONS_CONFIG[newSec]?.[0] || '');
                }}
              >
                {Object.keys(SECTIONS_CONFIG).map(sec => <option key={sec} value={sec}>{sec}</option>)}
              </select>
            </div>

            {/* 📚 Specific Law Module Dropdown */}
            <div className="form-group">
              <label>{t('Law Module / Act', 'अधिनियम / मॉड्यूल')}</label>
              <select className="form-control" value={docLawModule} onChange={e => setDocLawModule(e.target.value)}>
                {SECTIONS_CONFIG[docSection]?.map(mod => <option key={mod} value={mod}>{mod}</option>)}
              </select>
            </div>

            {/* 📍 State Filter Dropdown */}
            <div className="form-group">
              <label>{t('Applicable State', 'लागू राज्य')}</label>
              <select className="form-control" value={docState} onChange={e => setDocState(e.target.value)}>
                {STATES_LIST.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-secondary" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
              <UploadCloud size={16} /> {loading ? t('Uploading...', 'अपलोड हो रहा है...') : t('Upload Document', 'दस्तावेज़ अपलोड करें')}
            </button>
          </form>
        </div>

      </div>

      {/* Published Law Content List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={20} color="#0ea5e9" />
            <h3 style={{ margin: 0 }}>{t('Published Legal Resources', 'प्रकाशित कानूनी संसाधन')} ({displayedList.length})</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Section Filter */}
            <select 
              className="form-control" 
              style={{ width: 'auto', fontSize: '13px', padding: '6px 12px' }}
              value={filterSection}
              onChange={e => setFilterSection(e.target.value)}
            >
              <option value="All">{t('All Sections', 'सभी धाराएँ')}</option>
              {Object.keys(SECTIONS_CONFIG).map(sec => (
                <option key={sec} value={sec}>{sec.split(':')[0]}</option>
              ))}
            </select>

            <button 
              className="btn btn-secondary" 
              onClick={fetchLawList}
              disabled={listLoading}
              style={{ padding: '6px 12px', fontSize: '13px' }}
            >
              <RefreshCw size={14} className={listLoading ? 'spin' : ''} /> {t('Refresh', 'रिफ्रेश')}
            </button>
          </div>
        </div>

        {listLoading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
            {t('Loading content...', 'सामग्री लोड हो रही है...')}
          </div>
        ) : displayedList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
            {t('No legal resources published yet for this selection.', 'इस चयन के लिए अभी तक कोई कानूनी संसाधन प्रकाशित नहीं किया गया है।')}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>{t('Title', 'शीर्षक')}</th>
                  <th>{t('Type', 'प्रकार')}</th>
                  <th>{t('Section & Law Module', 'धारा एवं अधिनियम')}</th>
                  <th>{t('State', 'राज्य')}</th>
                  <th>{t('Action', 'कार्रवाई')}</th>
                </tr>
              </thead>
              <tbody>
                {displayedList.map(item => {
                  const sectionName = item.section || item.category || 'Section A';
                  const isSecA = sectionName.includes('Section A');
                  const isSecB = sectionName.includes('Section B');
                  
                  return (
                    <tr key={item._id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.title}</div>
                        {item.lawModule && (
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            {item.lawModule}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${item.type === 'video' ? 'badge-primary' : 'badge-secondary'}`} style={{ textTransform: 'capitalize' }}>
                          {item.type === 'video' ? '🎬 Video' : '📄 PDF'}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          background: isSecA ? '#e0f2fe' : isSecB ? '#f3e8ff' : '#ecfdf5',
                          color: isSecA ? '#0369a1' : isSecB ? '#7e22ce' : '#047857',
                        }}>
                          {sectionName.split(':')[0]}
                        </span>
                      </td>
                      <td>{item.state || 'Central'}</td>
                      <td>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          <ExternalLink size={13} /> {t('View', 'देखें')}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default LawContent;
