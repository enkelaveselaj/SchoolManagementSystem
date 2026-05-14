import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, BookOpen, Clock, Award, Users, Mail, Phone, Shield, MapPin, Activity, Calculator, MessageCircle, Bell } from 'lucide-react';
import { studentAPI } from '../../services/teacherStudentService';
import schoolService from '../../services/schoolService';
import academicService from '../../services/academicService';
import attendanceService from '../../services/attendanceService';
import StudentChat from './StudentChat';
import messagingService from '../../services/messagingService';
import { io } from 'socket.io-client';

const cardShadow = '0 30px 60px -35px rgba(15, 23, 42, 0.35)';

const StudentPanel = ({ user }) => {
  const [page, setPage] = useState('overview');
  const [student, setStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contextLoading, setContextLoading] = useState(false);
  const [error, setError] = useState('');
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [upcomingAssessments, setUpcomingAssessments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  const navigation = [
    { id: 'overview', name: 'Overview', icon: Users, description: 'View your dashboard' },
    { id: 'chat', name: 'Chat', icon: MessageCircle, description: 'Message teachers' },
    { id: 'notifications', name: 'Notifications', icon: Bell, description: 'View announcements' }
  ];

  useEffect(() => {
    if (!user?.email) {
      setError('Your account is missing an email address. Please contact the administrator.');
      setLoading(false);
      return;
    }
    fetchStudentData(user.email);
  }, [user?.email]);

  const fetchStudentData = async (email) => {
    try {
      setLoading(true);
      const [studentsResponse, classesResponse, sectionsResponse] = await Promise.all([
        studentAPI.getAllStudents(),
        schoolService.getAllClasses(),
        schoolService.getAllSections()
      ]);

      const match = (studentsResponse || []).find((item) =>
        item.email?.toLowerCase() === email.toLowerCase()
      );

      setStudent(match || null);
      setClasses(classesResponse || []);
      setSections(sectionsResponse || []);

      if (!match) {
        setError('We could not find a student profile linked to your login. Please reach out to the administration team.');
      } else {
        setError('');
      }
    } catch (err) {
      console.error('Failed to load student data', err);
      setError('Student services are currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!student?.id) {
      setAttendanceStats(null);
      setTodaysSchedule([]);
      setUpcomingAssessments([]);
      return;
    }

    const loadStudentInsights = async () => {
      try {
        setContextLoading(true);

        const [attendanceResponse, timetables, assessmentsResponse, subjectsResponse, notificationsResponse] = await Promise.all([
          attendanceService.getStudentAttendanceStats(student.id).catch(() => null),
          academicService.getAllTimetables().catch(() => []),
          academicService.getAllAssessments().catch(() => []),
          academicService.getAllSubjects().catch(() => []),
          messagingService.getNotifications({ email: user.email }).catch(() => [])
        ]);

        setSubjects(subjectsResponse || []);

        const attendanceData = attendanceResponse?.data || attendanceResponse || null;
        setAttendanceStats(attendanceData);

        const notificationsData = notificationsResponse?.data || notificationsResponse || [];
        setNotifications(notificationsData);

        const today = new Date();
        const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });

        const todaysEntries = (timetables || [])
          .filter((entry) =>
            Number(entry.gradeId) === Number(student.classId) &&
            entry.day?.toLowerCase() === weekday.toLowerCase()
          )
          .map((entry) => ({
            id: entry.id,
            startTime: entry.startTime,
            endTime: entry.endTime,
            subjectName: getSubjectName(entry.subjectId, subjectsResponse),
            room: entry.room || 'TBD',
            day: entry.day
          }))
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        setTodaysSchedule(todaysEntries);

        const now = new Date();
        const upcoming = (assessmentsResponse || [])
          .filter((assessment) => {
            if (assessment.classId && Number(assessment.classId) !== Number(student.classId)) {
              return false;
            }
            const dueDate = new Date(assessment.date);
            return !Number.isNaN(dueDate.getTime()) && dueDate >= new Date(now.toDateString());
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3)
          .map((assessment) => ({
            ...assessment,
            subjectName: getSubjectName(assessment.subjectId, subjectsResponse)
          }));

        setUpcomingAssessments(upcoming);
      } catch (err) {
        console.error('Failed to load student insights', err);
      } finally {
        setContextLoading(false);
      }
    };

    loadStudentInsights();
  }, [student?.id]);

  // Socket.IO connection for real-time notifications
  useEffect(() => {
    if (!user?.email) return;

    const socketConnection = io(import.meta.env.VITE_REALTIME_API_URL || 'http://localhost:5005');
    setSocket(socketConnection);

    // Join room with user's email
    socketConnection.emit('joinRoom', user.email);

    // Listen for new notifications
    socketConnection.on('newNotification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user?.email]);

  const getSubjectName = (subjectId, subjectList = subjects) => {
    if (!subjectId || !subjectList?.length) return 'Subject';
    const match = subjectList.find((subject) => `${subject.id}` === `${subjectId}`);
    return match?.name || 'Subject';
  };

  const formatAssessmentStatus = (dateString) => {
    const dueDate = new Date(dateString);
    if (Number.isNaN(dueDate.getTime())) return 'Unknown';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const normalizedDue = new Date(dueDate);
    normalizedDue.setHours(0, 0, 0, 0);

    if (normalizedDue.getTime() < today.getTime()) return 'Overdue';
    if (normalizedDue.getTime() === today.getTime()) return 'Today';
    return 'Upcoming';
  };

  const className = useMemo(() => {
    if (!student?.classId) return 'Not assigned';
    return classes.find((cls) => Number(cls.id) === Number(student.classId))?.name || `Class ${student.classId}`;
  }, [classes, student?.classId]);

  const sectionName = useMemo(() => {
    if (!student?.sectionId) return 'Not assigned';
    return sections.find((sec) => `${sec.id}` === `${student.sectionId}`)?.name || `Section ${student.sectionId}`;
  }, [sections, student?.sectionId]);

  const advisoryCoach = student?.advisorName || 'Not assigned';

  const wellbeingMoments = student?.wellnessNotes?.length
    ? student.wellnessNotes
    : [
        'Check in with your advisor today',
        'Log a wellness journal entry',
        'Plan a recovery block after school'
      ];

  const focusBlocksLabel = todaysSchedule.length
    ? `${todaysSchedule.length} ${todaysSchedule.length === 1 ? 'block' : 'blocks'}`
    : 'No classes today';

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading">
          <div className="spinner" />
          <p style={{ marginTop: 16 }}>Loading your student workspace…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 720, margin: '80px auto', textAlign: 'center' }}>
        <div className="error">
          <h2 style={{ marginBottom: 12 }}>Student Panel Unavailable</h2>
          <p>{error}</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => user?.email && fetchStudentData(user.email)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const parentDetails = [
    { label: 'Primary contact', value: student?.parentName || 'Not provided' },
    { label: 'Parent email', value: student?.parentEmail || 'Not provided' },
    { label: 'Parent phone', value: student?.parentPhone || 'Not provided' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f0f4ff, #fdf5ff)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 64px' }}>
        <header style={{
          background: 'radial-gradient(circle at top left, rgba(79, 70, 229, 0.18), rgba(14, 165, 233, 0.12))',
          borderRadius: '32px',
          padding: '36px',
          marginBottom: '32px',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: cardShadow,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <p style={{ textTransform: 'uppercase', letterSpacing: 3, fontSize: 12, color: '#6366f1', fontWeight: 600 }}>Student Workspace</p>
            <h1 style={{ margin: '12px 0 8px', fontSize: '32px', color: '#0f172a' }}>
              Hello, {student?.firstName} {student?.lastName}
            </h1>
            <p style={{ color: '#475569', fontSize: 16 }}>
              Today is about momentum. Track your classes, focus blocks, and upcoming deliverables in one place.
            </p>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
                <MapPin size={16} />
                <span>{className} • {sectionName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
                <Shield size={16} />
                <span>Advisor: {advisoryCoach}</span>
              </div>
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px'
          }}>
            {[
              { label: 'Attendance', value: attendanceStats?.attendanceRate != null ? `${attendanceStats.attendanceRate}%` : 'Not tracked', icon: Users },
              { label: 'Credits', value: student?.earnedCredits ?? 'Not recorded', icon: BookOpen },
              { label: 'Focus Blocks', value: focusBlocksLabel, icon: Clock },
              { label: 'Wellness', value: student?.wellnessScore || 'Not tracked', icon: Activity }
            ].map((card) => (
              <div key={card.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>{card.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#0f172a' }}>
                  <card.icon size={16} />
                  <span>{card.value}</span>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
          paddingBottom: '16px'
        }}>
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: page === item.id ? '#6366f1' : 'rgba(255, 255, 255, 0.8)',
                color: page === item.id ? '#ffffff' : '#475569',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: page === item.id ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Page Content */}
        <>
          {page === 'overview' && (
          <section style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 320px',
            gap: '32px',
            alignItems: 'start'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <article style={{
              background: 'white',
              borderRadius: '28px',
              padding: '28px',
              border: '1px solid rgba(226, 232, 240, 0.7)',
              boxShadow: cardShadow
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <p className="pill">Today</p>
                  <h2 style={{ margin: '8px 0 0', fontSize: 22 }}>Learning flow</h2>
                </div>
                <button className="btn btn-outline" style={{ padding: '10px 16px' }} disabled={contextLoading}>
                  <Calendar size={16} style={{ marginRight: 8 }} /> Refresh
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {todaysSchedule.length === 0 && (
                  <div style={{
                    padding: '20px',
                    borderRadius: '18px',
                    border: '1px dashed rgba(226, 232, 240, 0.9)',
                    textAlign: 'center',
                    color: '#94a3b8'
                  }}>
                    No timetable entries for today.
                  </div>
                )}
                {todaysSchedule.map((slot) => (
                  <div key={`${slot.id}-${slot.startTime}`} style={{
                    display: 'grid',
                    gridTemplateColumns: '120px minmax(0, 1fr) 120px',
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: '18px',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    background: 'rgba(248, 250, 252, 0.8)'
                  }}>
                    <div style={{ fontWeight: 600, color: '#475569' }}>{slot.startTime} - {slot.endTime}</div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>{slot.subjectName}</h3>
                      <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>{slot.room}</p>
                    </div>
                    <span style={{
                      justifySelf: 'end',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      background: 'rgba(79, 70, 229, 0.08)',
                      color: '#4f46e5',
                      fontSize: 12,
                      fontWeight: 600
                    }}>{slot.day}</span>
                  </div>
                ))}
              </div>
            </article>

            <article style={{
              background: 'white',
              borderRadius: '28px',
              padding: '28px',
              border: '1px solid rgba(226, 232, 240, 0.7)',
              boxShadow: cardShadow
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <p className="pill pill-muted">Deliverables</p>
                  <h2 style={{ margin: '8px 0 0' }}>Upcoming checkpoints</h2>
                </div>
                <button className="btn btn-ghost" disabled={contextLoading}>Refresh</button>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {upcomingAssessments.length === 0 && (
                  <div style={{
                    border: '1px dashed rgba(226, 232, 240, 0.9)',
                    borderRadius: '20px',
                    padding: '18px',
                    textAlign: 'center',
                    color: '#94a3b8'
                  }}>
                    No upcoming assessments have been scheduled.
                  </div>
                )}
                {upcomingAssessments.map((assessment) => (
                  <div key={assessment.id} style={{
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    borderRadius: '20px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16
                  }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '16px',
                      background: 'rgba(79, 70, 229, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4f46e5'
                    }}>
                      <Calculator size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 16 }}>{assessment.title}</h3>
                      <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>
                        {assessment.subjectName} · {new Date(assessment.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      fontSize: 12,
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#0f766e',
                      fontWeight: 600
                    }}>{formatAssessmentStatus(assessment.date)}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              background: '#0f172a',
              color: 'white',
              borderRadius: '28px',
              padding: '24px',
              boxShadow: cardShadow
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Award size={20} />
                <strong>Advisor Signals</strong>
              </div>
              <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.8)' }}>
                {student?.firstName}, here are the focus cues for this week. Celebrate what’s working and note what needs support.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {wellbeingMoments.map((item, index) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }}></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(226, 232, 240, 0.7)',
              boxShadow: cardShadow
            }}>
              <h3 style={{ marginTop: 0 }}>Support circle</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {parentDetails.map((detail) => (
                  <div key={detail.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 12, textTransform: 'uppercase', color: '#94a3b8' }}>{detail.label}</span>
                    <strong style={{ color: '#0f172a' }}>{detail.value}</strong>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={16} /> Message Advisor
                </button>
                <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={16} /> Contact Parent
                </button>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(226, 232, 240, 0.7)',
              boxShadow: cardShadow
            }}>
              <h3 style={{ marginTop: 0 }}>Learning resources</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Studio playbook', action: 'Open' },
                  { label: 'Career portfolio', action: 'Update' },
                  { label: 'Wellness journal', action: 'Log entry' }
                ].map((resource) => (
                  <div key={resource.label} style={{
                    border: '1px dashed rgba(148, 163, 184, 0.7)',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{resource.label}</span>
                    <button className="btn btn-ghost" style={{ fontSize: 14 }}>{resource.action}</button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
        )}

        {page === 'chat' && (
          <div style={{
            background: 'white',
            borderRadius: '28px',
            border: '1px solid rgba(226, 232, 240, 0.7)',
            boxShadow: cardShadow,
            height: '600px',
            overflow: 'hidden'
          }}>
            <StudentChat user={user} student={student} />
          </div>
        )}

        {page === 'notifications' && (
          <div style={{
            background: 'white',
            borderRadius: '28px',
            border: '1px solid rgba(226, 232, 240, 0.7)',
            boxShadow: cardShadow,
            padding: '28px'
          }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 22 }}>Notifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {notifications.length === 0 && (
                <div style={{
                  padding: '20px',
                  borderRadius: '18px',
                  border: '1px dashed rgba(226, 232, 240, 0.9)',
                  textAlign: 'center',
                  color: '#94a3b8'
                }}>
                  No notifications yet.
                </div>
              )}
              {notifications.map((notification) => (
                <div key={notification._id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  padding: '16px',
                  borderRadius: '18px',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  background: notification.read ? 'rgba(248, 250, 252, 0.8)' : 'rgba(79, 70, 229, 0.05)',
                  position: 'relative'
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: notification.read ? '#94a3b8' : '#6366f1',
                    flexShrink: 0,
                    marginTop: 6
                  }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>{notification.title}</h3>
                    <p style={{ margin: '8px 0 0', fontSize: 14, color: '#475569' }}>{notification.message}</p>
                    <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
                      {new Date(notification.createdAt).toLocaleDateString()} • {notification.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
      </div>
    </div>
  );
};

const CalculatorIcon = (props) => <BookOpen {...props} />;

export default StudentPanel;
