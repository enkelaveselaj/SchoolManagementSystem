import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, TrendingUp, Award, Clock, LogOut, Menu, X, GraduationCap, FileText, BarChart3, UserCheck, Mail, Phone, AlertCircle } from 'lucide-react';

const ParentPanel = () => {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigation = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: Users,
      description: 'View children overview'
    },
    { 
      id: 'grades', 
      name: 'Grades', 
      icon: BarChart3,
      description: 'View academic performance'
    },
    { 
      id: 'attendance', 
      name: 'Attendance', 
      icon: UserCheck,
      description: 'Track attendance records'
    },
    { 
      id: 'assignments', 
      name: 'Assignments', 
      icon: FileText,
      description: 'View homework and assignments'
    }
  ];

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5001/admin/parents/me/children', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch children data');
      }

      const data = await response.json();
      setChildren(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your children's information...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center', color: '#ef4444' }}>
            <AlertCircle size={48} style={{ marginBottom: '16px' }} />
            <h3>Error Loading Data</h3>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    switch(page) {
      case 'overview':
        return (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Your Children</h2>
            {children.length === 0 ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center',
                border: '1px solid rgba(226, 232, 240, 0.7)'
              }}>
                <Users size={64} style={{ marginBottom: '16px', color: '#94a3b8' }} />
                <h3 style={{ color: '#475569', marginBottom: '8px' }}>No Children Found</h3>
                <p style={{ color: '#94a3b8' }}>You don't have any children assigned to your account yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {children.map((child) => (
                  <div key={child.id} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(226, 232, 240, 0.7)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0' }}>
                          {child.first_name} {child.last_name}
                        </h3>
                        <p style={{ color: '#64748b', margin: 0 }}>{child.email}</p>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '700'
                      }}>
                        {child.first_name?.[0]}{child.last_name?.[0]}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Grade</span>
                        <p style={{ fontWeight: '600', margin: '4px 0 0' }}>{child.grade || 'Not assigned'}</p>
                      </div>
                      <div>
                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Section</span>
                        <p style={{ fontWeight: '600', margin: '4px 0 0' }}>{child.section || 'Not assigned'}</p>
                      </div>
                      <div>
                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Status</span>
                        <p style={{ fontWeight: '600', margin: '4px 0 0' }}>
                          <span style={{
                            color: '#10b981',
                            background: 'rgba(16, 185, 129, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            Active
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'grades':
        return (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Academic Performance</h2>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid rgba(226, 232, 240, 0.7)'
            }}>
              <BarChart3 size={64} style={{ marginBottom: '16px', color: '#94a3b8' }} />
              <h3 style={{ color: '#475569', marginBottom: '8px' }}>Grades Coming Soon</h3>
              <p style={{ color: '#94a3b8' }}>Academic performance tracking will be available here.</p>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Attendance Records</h2>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid rgba(226, 232, 240, 0.7)'
            }}>
              <UserCheck size={64} style={{ marginBottom: '16px', color: '#94a3b8' }} />
              <h3 style={{ color: '#475569', marginBottom: '8px' }}>Attendance Coming Soon</h3>
              <p style={{ color: '#94a3b8' }}>Attendance tracking will be available here.</p>
            </div>
          </div>
        );
      case 'assignments':
        return (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Assignments & Homework</h2>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid rgba(226, 232, 240, 0.7)'
            }}>
              <FileText size={64} style={{ marginBottom: '16px', color: '#94a3b8' }} />
              <h3 style={{ color: '#475569', marginBottom: '8px' }}>Assignments Coming Soon</h3>
              <p style={{ color: '#94a3b8' }}>Homework and assignments will be available here.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '80px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Users size={20} />
            </div>
            {sidebarOpen && (
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
                  Parent Portal
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  Manage your children
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              color: '#64748b'
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: sidebarOpen ? '12px' : '0',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: page === item.id ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  color: page === item.id ? '#667eea' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>{item.description}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(226, 232, 240, 0.7)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: sidebarOpen ? '12px' : '0',
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span style={{ fontWeight: '600' }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '24px 32px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#1a202c' }}>
              {navigation.find(item => item.id === page)?.name || 'Parent Portal'}
            </h1>
            <p style={{ margin: '4px 0 0', color: '#64748b' }}>
              {navigation.find(item => item.id === page)?.description || 'Manage your children\'s education'}
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {children.length} {children.length === 1 ? 'Child' : 'Children'}
            </div>
          </div>
        </div>

        {/* Page Content */}
        {renderPage()}
      </div>
    </div>
  );
};

export default ParentPanel;
