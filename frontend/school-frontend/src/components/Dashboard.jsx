import React, { useState, useEffect } from 'react';
import { BarChart3, Users, BookOpen, Calendar, TrendingUp, Building, GraduationCap, Clock, Award } from 'lucide-react';
import schoolService from '../services/schoolService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    academicYears: [], classes: [], sections: [],
    totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalSections: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [academicYears, classes, sections] = await Promise.all([
        schoolService.getAllAcademicYears(),
        schoolService.getAllClasses(),
        schoolService.getAllSections()
      ]);
      
      const totalStudents = sections.reduce((sum, section) => sum + (section.capacity || 0), 0);
      
      setDashboardData({
        academicYears, classes, sections, totalStudents,
        totalTeachers: Math.ceil(totalStudents / 25),
        totalClasses: classes.length, totalSections: sections.length
      });
      setError(null);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon"><Icon size={24} /></div>
      <div className="stat-card__content">
        <h3 className="stat-card__title">{title}</h3>
        <div className="stat-card__value">{value.toLocaleString()}</div>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-button">Try Again</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">
          <GraduationCap className="dashboard__title-icon" size={28} />
          School Dashboard
        </h1>
        <p className="dashboard__subtitle">
          Welcome back! Here's an overview of your school management system.
        </p>
      </div>

      <div className="dashboard__stats">
        <StatCard
          icon={Users}
          title="Total Students"
          value={dashboardData.totalStudents}
          subtitle="Across all sections"
          color="primary"
        />
        <StatCard
          icon={BookOpen}
          title="Total Classes"
          value={dashboardData.totalClasses}
          subtitle={`${dashboardData.academicYears.length} academic years`}
          color="secondary"
        />
        <StatCard
          icon={Building}
          title="Total Sections"
          value={dashboardData.totalSections}
          subtitle="Class sections"
          color="accent"
        />
        <StatCard
          icon={Users}
          title="Total Teachers"
          value={dashboardData.totalTeachers}
          subtitle="Estimated faculty"
          color="info"
        />
      </div>

      <div className="dashboard__actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button className="quick-action quick-action--primary" onClick={() => window.location.href = '#academic-years'}>
            <Calendar size={20} />
            <span>Academic Calendar</span>
          </button>
          <button className="quick-action quick-action--secondary" onClick={() => window.location.href = '#classes'}>
            <BookOpen size={20} />
            <span>Class Management</span>
          </button>
          <button className="quick-action quick-action--accent" onClick={() => window.location.href = '#sections'}>
            <Building size={20} />
            <span>Section Management</span>
          </button>
          <button className="quick-action quick-action--info" onClick={() => window.location.href = '#reports'}>
            <Award size={20} />
            <span>Reports & Analytics</span>
          </button>
        </div>
      </div>

      <div className="dashboard__activity">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-grid">
          <div className="activity-card">
            <h3 className="activity-card__title">Academic Year</h3>
            {dashboardData.academicYears.length > 0 ? (
              <>
                <div className="activity-item">
                  <span>Current: {dashboardData.academicYears.find(year => year.isCurrent)?.name || 'Not Set'}</span>
                </div>
                <div className="activity-item">
                  <span>Total Years: {dashboardData.academicYears.length}</span>
                </div>
              </>
            ) : (
              <p>No academic years configured</p>
            )}
          </div>
          
          <div className="activity-card">
            <h3 className="activity-card__title">Recent Classes</h3>
            {dashboardData.classes.length > 0 ? (
              dashboardData.classes.slice(0, 3).map((cls) => (
                <div key={cls.id} className="activity-item">
                  <span>{cls.name} - Grade {cls.gradeLevel} - {cls.section}</span>
                </div>
              ))
            ) : (
              <p>No classes created yet</p>
            )}
            {dashboardData.classes.length > 3 && (
              <div className="activity-item">
                <span>+{dashboardData.classes.length - 3} more classes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
