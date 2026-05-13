import React, { useState, useEffect } from 'react';
import {
  Users, FileText, BarChart3, UserCheck,
  LogOut, Menu, X, AlertCircle, CreditCard
} from 'lucide-react';

import realtimeService from '../services/realtimeService';

const ParentPanel = () => {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);

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
      description: 'View homework'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: CreditCard,
      description: 'School payments'
    }
  ];

  useEffect(() => {
    fetchChildren();
  }, []);

  // 🔥 REALTIME CONNECTION
  useEffect(() => {
    const initRealtime = async () => {
      try {
        const data = await realtimeService.getNotifications?.();
        if (data) setNotifications(data);
      } catch (err) {
        console.log('Realtime error:', err);
      }
    };

    initRealtime();

    // optional polling fallback (if not websocket)
    const interval = setInterval(() => {
      initRealtime();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      const response = await fetch(
        'http://localhost:5001/admin/parents/me/children',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch children');

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
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', color: 'red' }}>
          <AlertCircle size={40} />
          <p>{error}</p>
        </div>
      );
    }

    switch (page) {

      case 'overview':
        return (
          <div style={{ padding: 20 }}>
            <h2>Children</h2>
            {children.map((c) => (
              <div key={c.id} style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
                <b>{c.first_name} {c.last_name}</b>
                <p>{c.email}</p>
              </div>
            ))}
          </div>
        );

      case 'grades':
        return <h2 style={{ padding: 20 }}>Grades (coming soon)</h2>;

      case 'attendance':
        return <h2 style={{ padding: 20 }}>Attendance (coming soon)</h2>;

      case 'assignments':
        return <h2 style={{ padding: 20 }}>Assignments (coming soon)</h2>;

      case 'payments':
        return (
          <div style={{ padding: 20 }}>
            <h2>Payments</h2>

            <div style={{
              padding: 20,
              border: '1px solid #ddd',
              borderRadius: 10,
              marginTop: 10
            }}>
              <h3>Outstanding Fees</h3>
              <p>Tuition: €500</p>
              <p>Library: €20</p>

              <button style={{
                marginTop: 10,
                padding: '10px 15px',
                background: 'green',
                color: 'white',
                border: 'none',
                borderRadius: 6
              }}>
                Pay Now
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 250 : 70,
        background: '#fff',
        borderRight: '1px solid #ddd'
      }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>

        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              display: 'flex',
              gap: 10,
              padding: 10,
              width: '100%',
              background: page === item.id ? '#eee' : 'transparent'
            }}
          >
            <item.icon size={18} />
            {sidebarOpen && item.name}
          </button>
        ))}

        <button onClick={handleLogout} style={{ marginTop: 20 }}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20 }}>
        {renderPage()}

        {/* REALTIME NOTIFICATIONS DEBUG */}
        {notifications.length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            background: '#000',
            color: '#fff',
            padding: 10,
            borderRadius: 8
          }}>
            🔔 {notifications.length} notifications
          </div>
        )}
      </div>

    </div>
  );
};

export default ParentPanel;