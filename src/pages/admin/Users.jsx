import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Ban, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  ShieldCheck, 
  Users as UsersIcon 
} from 'lucide-react';
import { adminApi } from '../../_config/api';

const Users = ({ isHindi }) => {
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  const t = (en, hi) => (isHindi ? hi : en);

  // Fetch Standard Users API (/api/v1/admin/users)
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await adminApi.getUsers();
      const result = res.data;

      if (result.success && Array.isArray(result.data)) {
        const colors = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#6366f1'];
        const formatted = result.data.map((u, index) => ({
          id: u._id,
          name: u.name || 'Unnamed',
          email: u.email,
          phone: u.phone || 'N/A',
          city: u.city || u.villageTown || u.state || 'India',
          date: new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: u.isBlocked ? 'Blocked' : (u.isVerified ? 'Active' : 'Pending'),
          role: u.profession || u.adminrole || (u.role === 'company' ? 'Company Account' : 'Standard User'),
          avatarBg: colors[index % colors.length]
        }));
        setUsersList(formatted);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle Block Standard User
  const handleToggleBlock = async (userId) => {
    try {
      const res = await adminApi.toggleBlockUser(userId);
      const data = res.data;
      if (data.success) {
        setUsersList(prev => prev.map(u => {
          if (u.id === userId) {
            return {
              ...u,
              status: data.isBlocked ? 'Blocked' : 'Active'
            };
          }
          return u;
        }));
      }
    } catch (err) {
      console.error("Error toggling block:", err);
    }
  };

  // Filter Search for Users
  const filteredUsers = usersList.filter(u => {
    const term = userSearchTerm.toLowerCase();
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term));
    const matchesStatus = userStatusFilter === 'All' || u.status === userStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="content">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UsersIcon size={26} color="#0f172a" />
            {t('User Management', 'उपयोगकर्ता प्रबंधन')}
          </h2>
          <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
            {t(
              'Manage registered individual users, view contact details, and control platform access.', 
              'पंजीकृत उपयोगकर्ताओं को प्रबंधित करें, संपर्क विवरण देखें और पहुंच नियंत्रित करें।'
            )}
          </p>
        </div>
        <button className="btn btn-primary">
          <Download size={16} />
          {t('Export CSV', 'CSV निर्यात करें')}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '10px 16px', border: '1px solid var(--border)' }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px' }} />
          <input 
            type="text" 
            placeholder={t('Search by name, email or phone...', 'नाम, ईमेल या फोन से खोजें...')}
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {t('Status:', 'स्थिति:')}
          </span>
          <select 
            className="form-control" 
            value={userStatusFilter}
            onChange={(e) => setUserStatusFilter(e.target.value)}
            style={{ width: 'auto', padding: '8px 14px', fontSize: '13.5px' }}
          >
            <option value="All">{t('All Statuses', 'सभी स्थितियां')}</option>
            <option value="Active">{t('Active', 'सक्रिय')}</option>
            <option value="Pending">{t('Pending', 'लंबित')}</option>
            <option value="Blocked">{t('Blocked', 'प्रतिबंधित')}</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('User Profile', 'उपयोगकर्ता प्रोफ़ाइल')}</th>
              <th>{t('Contact Info', 'संपर्क विवरण')}</th>
              <th>{t('Joined Date', 'जुड़ने की तिथि')}</th>
              <th>{t('Status', 'स्थिति')}</th>
              <th style={{ textAlign: 'right' }}>{t('Actions', 'कार्रवाइयां')}</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <UsersIcon size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                  <div>{t('Loading users...', 'उपयोगकर्ता लोड हो रहे हैं...')}</div>
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: user.avatarBg,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '15px'
                      }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--text-main)' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {user.role}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} color="var(--text-muted)" /> {user.email}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <Phone size={13} color="var(--text-muted)" /> {user.phone}
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                      {user.date}
                    </span>
                  </td>

                  <td>
                    <span className={`badge ${user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'warning' : 'danger'}`}>
                      <span className="badge-dot"></span>
                      {user.status === 'Active' ? t('Active', 'सक्रिय') : user.status === 'Pending' ? t('Pending', 'लंबित') : t('Blocked', 'प्रतिबंधित')}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedUser(user)}
                        title={t('View Profile', 'प्रोफ़ाइल देखें')}
                      >
                        <Eye size={14} />
                        {t('View', 'देखें')}
                      </button>
                      <button 
                        className={`btn ${user.status === 'Blocked' ? 'btn-secondary' : 'btn-danger'} btn-sm`}
                        onClick={() => handleToggleBlock(user.id)}
                        title={user.status === 'Blocked' ? t('Unblock', 'अनब्लॉक') : t('Block', 'ब्लॉक')}
                      >
                        <Ban size={14} />
                        {user.status === 'Blocked' ? t('Unblock', 'अनब्लॉक') : t('Block', 'ब्लॉक')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                  <UsersIcon size={36} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-main)' }}>
                    {t('No users found matching your search.', 'आपकी खोज से मेल खाने वाले कोई उपयोगकर्ता नहीं मिले।')}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 🔍 MODAL: VIEW INDIVIDUAL USER DETAILS                                     */}
      {/* ========================================================================= */}
      {selectedUser && (
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
            maxWidth: '480px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              padding: '24px',
              color: 'white',
              position: 'relative'
            }}>
              <button 
                onClick={() => setSelectedUser(null)}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: selectedUser.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: '800'
                }}>
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800' }}>
                    {selectedUser.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8' }}>
                    <ShieldCheck size={14} color="#38bdf8" />
                    <span>{selectedUser.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: '#f8fafc' }}>
                  <Mail size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Email Address</div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: '#f8fafc' }}>
                  <Phone size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Phone Number</div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.phone}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: '#f8fafc' }}>
                  <MapPin size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Location</div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.city}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', gap: '10px' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedUser(null)}
                >
                  {t('Close', 'बंद करें')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
