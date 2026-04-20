import React, { useState } from 'react';
import { BookOpen, Calculator, Users, Calendar, TrendingUp, Award, Clock, LogOut, Menu, X, GraduationCap, Home, FileText, BarChart3 } from 'lucide-react';
import TeacherDashboard from "./TeacherDashboard";
import AssessmentManagement from "./AssessmentManagement";
import GradeManagement from "./GradeManagement";

const TeacherPanel = () => {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: Home,
      description: 'Overview and statistics'
    },
    { 
      id: 'assessments', 
      name: 'Assessments', 
      icon: FileText,
      description: 'Manage assessments and tests'
    },
    { 
      id: 'grades', 
      name: 'Grades', 
      icon: BarChart3,
      description: 'Student grade management'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  };

  const renderPage = () => {
    switch(page) {
      case 'dashboard':
        return <TeacherDashboard />;
      case 'assessments':
        return <AssessmentManagement />;
      case 'grades':
        return <GradeManagement />;
      default:
        return <TeacherDashboard />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Modern Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 32px',
          maxWidth: '1600px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <GraduationCap size={28} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#1a202c',
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  Teacher Portal
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#718096',
                  margin: 0,
                  marginTop: '2px'
                }}>
                  Academic Management System
                </p>
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                T
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c'
                }}>
                  Teacher
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#718096'
                }}>
                  Active Session
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('auth_user');
                window.location.href = '/login';
              }}
              style={{
                background: 'linear-gradient(135deg, #f56565, #ed64a6)',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(245, 101, 101, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 100px)'
      }}>
        {/* Modern Sidebar Navigation */}
        <aside style={{
          width: sidebarOpen ? '320px' : '0',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: sidebarOpen ? '8px 0 32px rgba(0, 0, 0, 0.1)' : 'none'
        }}>
          <nav style={{
            padding: '32px 24px'
          }}>
            <div style={{
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#718096',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 16px 0'
              }}>
                Main Menu
              </h3>
            </div>
            
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '20px 24px',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))'
                      : 'transparent',
                    border: isActive 
                      ? '1px solid rgba(102, 126, 234, 0.3)'
                      : '1px solid transparent',
                    borderRadius: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: isActive 
                      ? 'linear-gradient(135deg, #667eea, #764ba2)'
                      : 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}>
                    <Icon 
                      size={24} 
                      color={isActive ? 'white' : '#4a5568'}
                    />
                  </div>
                  <div style={{
                    flex: 1
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: isActive ? '#1a202c' : '#4a5568',
                      marginBottom: '4px',
                      transition: 'all 0.3s ease'
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: isActive ? '#667eea' : '#718096',
                      lineHeight: 1.4
                    }}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Modern Main Content */}
        <main style={{
          flex: 1,
          padding: '32px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          overflowY: 'auto',
          marginLeft: sidebarOpen ? '0' : '0'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherPanel;
