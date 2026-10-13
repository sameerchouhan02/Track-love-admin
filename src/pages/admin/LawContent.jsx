import React, { useState, useEffect } from 'react';
import { Scale, Video, FileText, UploadCloud, Play, CheckCircle2 } from 'lucide-react';

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

  const t = (en, hi) => (isHindi ? hi : en);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // 1. Submit Video
  const handlePublishVideo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      const res = await fetch('http://localhost:3002/api/v1/admin/law/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: videoTitle,
          url: videoUrl,
          category: videoCategory,
          state: videoState
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(t('Video published successfully!', 'वीडियो प्रकाशित हुआ!'));
        setVideoTitle('');
        setVideoUrl('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Upload PDF
  const handleUploadPdf = async (e) => {
    e.preventDefault();
    if (!pdfFile) return alert("Please select a PDF file");

    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      const formData = new FormData();
      formData.append('title', docTitle);
      formData.append('category', docCategory);
      formData.append('state', docState);
      formData.append('pdf', pdfFile);

      const res = await fetch('http://localhost:3002/api/v1/admin/law/pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        showToast(t('Case study document uploaded!', 'दस्तावेज़ सफलतापूर्वक अपलोड!'));
        setDocTitle('');
        setPdfFile(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      {/* Toast popup yahan rahega */}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '14px 20px', borderRadius: '12px' }}>
          <span>{toast}</span>
        </div>
      )}

      {/* Forms Grid */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        
        {/* Add Legal Video Form */}
        <div className="card">
          <h3>Add Legal Video</h3>
          <form onSubmit={handlePublishVideo}>
            <div className="form-group">
              <label>Video Title</label>
              <input type="text" className="form-control" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>YouTube / Video URL</label>
              <input type="url" className="form-control" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." required />
            </div>
            <div className="form-group">
              <label>Law Category</label>
              <select className="form-control" value={videoCategory} onChange={e => setVideoCategory(e.target.value)}>
                <option>Family Law & Protection</option>
                <option>Criminal Defense & Rights</option>
                <option>Cyber Crime & Online Safety</option>
              </select>
            </div>
            {/* 📍 State Filter Dropdown */}
            <div className="form-group">
              <label>Applicable State</label>
              <select className="form-control" value={videoState} onChange={e => setVideoState(e.target.value)}>
                {STATES_LIST.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              <Play size={16} /> Publish Video
            </button>
          </form>
        </div>

        {/* Upload Case Study PDF Form */}
        <div className="card">
          <h3>Upload Case Study PDF</h3>
          <form onSubmit={handleUploadPdf}>
            <div className="form-group">
              <label>Document Title</label>
              <input type="text" className="form-control" value={docTitle} onChange={e => setDocTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Select PDF Document</label>
              <input type="file" className="form-control" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} required />
            </div>
            <div className="form-group">
              <label>Law Category</label>
              <select className="form-control" value={docCategory} onChange={e => setDocCategory(e.target.value)}>
                <option>Family Law & Protection</option>
                <option>Criminal Defense & Rights</option>
                <option>Cyber Crime & Online Safety</option>
              </select>
            </div>
            {/* 📍 State Filter Dropdown */}
            <div className="form-group">
              <label>Applicable State</label>
              <select className="form-control" value={docState} onChange={e => setDocState(e.target.value)}>
                {STATES_LIST.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-secondary" disabled={loading} style={{ width: '100%' }}>
              <UploadCloud size={16} /> Upload Document
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LawContent;
