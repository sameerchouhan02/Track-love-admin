import React, { useState, useEffect } from 'react';
import { Scale, Video, FileText, UploadCloud, Play, ExternalLink, RefreshCw } from 'lucide-react';
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

const LawContent = ({ isHindi }) => {
  const [toast, setToast] = useState('');
  
  // Video Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCategory, setVideoCategory] = useState('Family Law & Protection');
  const [videoState, setVideoState] = useState('Central');

  // PDF Form State
  const [docTitle, setDocTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [docCategory, setDocCategory] = useState('Family Law & Protection');
  const [docState, setDocState] = useState('Central');

  const [loading, setLoading] = useState(false);
  const [lawList, setLawList] = useState([]);
  const [listLoading, setListLoading] = useState(false);

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
        category: videoCategory,
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
      formData.append('category', docCategory);
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

  return (
    <div className="content">
      {/* Toast popup */}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '14px 20px', borderRadius: '12px' }}>
          <span>{toast}</span>
        </div>
      )}

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
            <div className="form-group">
              <label>{t('Law Category', 'कानून श्रेणी')}</label>
              <select className="form-control" value={videoCategory} onChange={e => setVideoCategory(e.target.value)}>
                <option>Family Law & Protection</option>
                <option>Criminal Defense & Rights</option>
                <option>Cyber Crime & Online Safety</option>
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
            <div className="form-group">
              <label>{t('Law Category', 'कानून श्रेणी')}</label>
              <select className="form-control" value={docCategory} onChange={e => setDocCategory(e.target.value)}>
                <option>Family Law & Protection</option>
                <option>Criminal Defense & Rights</option>
                <option>Cyber Crime & Online Safety</option>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={20} color="#0ea5e9" />
            <h3 style={{ margin: 0 }}>{t('Published Legal Resources', 'प्रकाशित कानूनी संसाधन')} ({lawList.length})</h3>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={fetchLawList}
            disabled={listLoading}
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            <RefreshCw size={14} className={listLoading ? 'spin' : ''} /> {t('Refresh', 'रिफ्रेश')}
          </button>
        </div>

        {listLoading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
            {t('Loading content...', 'सामग्री लोड हो रही है...')}
          </div>
        ) : lawList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
            {t('No legal resources published yet.', 'अभी तक कोई कानूनी संसाधन प्रकाशित नहीं किया गया है।')}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>{t('Title', 'शीर्षक')}</th>
                  <th>{t('Type', 'प्रकार')}</th>
                  <th>{t('Category', 'श्रेणी')}</th>
                  <th>{t('State', 'राज्य')}</th>
                  <th>{t('Action', 'कार्रवाई')}</th>
                </tr>
              </thead>
              <tbody>
                {lawList.map(item => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: '600' }}>{item.title}</td>
                    <td>
                      <span className={`badge ${item.type === 'video' ? 'badge-primary' : 'badge-secondary'}`} style={{ textTransform: 'capitalize' }}>
                        {item.type === 'video' ? '🎬 Video' : '📄 PDF'}
                      </span>
                    </td>
                    <td>{item.category}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default LawContent;
