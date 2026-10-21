import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Topbar from './components/Layout/Topbar';
import Sidebar from './components/Layout/Sidebar';
import { adminApi } from './_config/api';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import BusinessProfiles from './pages/admin/BusinessProfiles';
import BusinessPosts from './pages/admin/BusinessPosts';
import JobPosts from './pages/admin/JobPosts';
import ChatReports from './pages/admin/ChatReports';
import LawContent from './pages/admin/LawContent';
import Subscriptions from './pages/admin/Subscriptions';
import GovtRequests from './pages/admin/GovtRequests';
import Feedbacks from './pages/admin/Feedbacks';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  Building2,
  Briefcase, 
  FileText, 
  ShieldAlert, 
  Scale, 
  CreditCard, 
  Landmark, 
  MessageSquare, 
  User, 
  Settings 
} from 'lucide-react';
import './index.css';

const navItems = [
  { icon: LayoutDashboard, hi: 'डैशबोर्ड', en: 'Dashboard', path: '/' },
  { icon: UsersIcon, hi: 'उपयोगकर्ता', en: 'Users', path: '/users' },
  { icon: Building2, hi: 'व्यापार प्रोफ़ाइल', en: 'Business Profiles', path: '/business-profiles' },
  // { icon: Briefcase, hi: 'व्यापार पोस्ट', en: 'Business Posts', path: '/business-posts' },
  // { icon: FileText, hi: 'नौकरी पोस्ट', en: 'Job Posts', path: '/job-posts' },
  // { icon: ShieldAlert, hi: 'चैट रिपोर्ट', en: 'Chat Reports', path: '/chat-reports' },
  { icon: Scale, hi: 'कानूनी सामग्री', en: 'Law Content', path: '/law-content' },
  { icon: CreditCard, hi: 'सदस्यताएँ', en: 'Subscriptions', path: '/subscriptions' },
  { icon: Landmark, hi: 'सरकारी अनुरोध', en: 'Govt Requests', path: '/govt-requests' },
  // { icon: MessageSquare, hi: 'फीडबैक', en: 'Feedbacks', path: '/feedbacks' },
  { icon: User, hi: 'मेरी प्रोफाइल', en: 'My Profile', path: '/admin-profile', isDivider: true },
  { icon: Settings, hi: 'सेटिंग्स', en: 'Settings', path: '/settings' }
];

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_logged_in') === 'true';
  });
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isHindi, setIsHindi] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const activePath = location.pathname;
  const activeItem = navItems.find(item => item.path === activePath) || navItems[0];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch admin profile on auth
  useEffect(() => {
    if (isAuthenticated) {
      adminApi.getProfile()
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            setAdminProfile(res.data.data);
            localStorage.setItem('admin_user_data', JSON.stringify(res.data.data));
          }
        })
        .catch((err) => console.error("Error loading admin profile:", err));
    }
  }, [isAuthenticated]);

  // Listen for real-time profile update event from AdminProfile page
  useEffect(() => {
    const handleProfileUpdated = (e) => {
      if (e.detail) {
        setAdminProfile(e.detail);
        localStorage.setItem('admin_user_data', JSON.stringify(e.detail));
      }
    };
    window.addEventListener('admin_profile_updated', handleProfileUpdated);
    return () => window.removeEventListener('admin_profile_updated', handleProfileUpdated);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('admin_logged_in', 'true');
    setIsAuthenticated(true);
    if (activePath === '/login' || activePath === '*') {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_token'); // 👈 Ye 1 line add kar dein
    localStorage.removeItem('admin_user_data');
    setAdminProfile(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Jab tak login na ho, Login Page dikhega
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route 
          path="*" 
          element={
            <AdminLogin 
              onLogin={handleLogin} 
              isHindi={isHindi} 
              setIsHindi={setIsHindi} 
            />
          } 
        />
      </Routes>
    );
  }

  return (
    <div className="app">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isHindi={isHindi} 
        navItems={navItems}
        activePath={activePath}
        onLogout={handleLogout}
        adminProfile={adminProfile}
      />
      
      <div className="main-content-wrapper">
        <Topbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isHindi={isHindi} 
          setIsHindi={setIsHindi} 
          titleEn={activeItem.en}
          titleHi={activeItem.hi}
          adminProfile={adminProfile}
        />
        
        <div className="main-content">
          <Routes>
            <Route path="/" element={<AdminDashboard isHindi={isHindi} />} />
            <Route path="/users" element={<Users isHindi={isHindi} />} />
            <Route path="/business-profiles" element={<BusinessProfiles isHindi={isHindi} />} />
            <Route path="/business-posts" element={<BusinessPosts isHindi={isHindi} />} />
            <Route path="/job-posts" element={<JobPosts isHindi={isHindi} />} />
            <Route path="/chat-reports" element={<ChatReports isHindi={isHindi} />} />
            <Route path="/law-content" element={<LawContent isHindi={isHindi} />} />
            <Route path="/subscriptions" element={<Subscriptions isHindi={isHindi} />} />
            <Route path="/govt-requests" element={<GovtRequests isHindi={isHindi} />} />
            <Route path="/feedbacks" element={<Feedbacks isHindi={isHindi} />} />
            <Route path="/admin-profile" element={<AdminProfile isHindi={isHindi} />} />
            <Route path="/settings" element={<AdminSettings isHindi={isHindi} />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;