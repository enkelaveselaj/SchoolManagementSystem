import React, { useState, useEffect } from 'react'
import AcademicYearManagement from './components/AcademicYearManagement'
import ClassManagement from './components/ClassManagement'
import SectionManagement from './components/SectionManagement'
import StudentManagement from './components/StudentManagement'
import TeacherManagement from './components/TeacherManagement'
import SubjectManagement from './components/SubjectManagement'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import schoolService from './services/schoolService'
import FAQManagement from './components/FAQManagement'
import AssessmentManagement from './components/teacher/AssessmentManagement'
import GradeManagement from './components/teacher/GradeManagement'
import TeacherPanel from './components/teacher/TeacherPanel'
import StudentPanel from './components/student/StudentPanel'
import ParentPanel from './components/parent/ParentPanel'
import StudentClassAssignment from './components/admin/StudentClassAssignment'
import AdminPanel from './components/admin/AdminPanel'
import PaymentRecords from './components/admin/PaymentRecords'
import ParentManagement from './components/ParentManagement'
import LandingHero from './components/landing/LandingHero'
import PaymentPanel from './components/PaymentPage'
import './styles.css'

const App = () => {
  const [page, setPage] = useState(() => {
    if (window.location.hash === '#teacher-panel') {
      return 'teacher-panel'
    }
    if (window.location.hash === '#student-panel') {
      return 'student-panel'
    }
    if (window.location.hash === '#parent-panel') {
      return 'parent-panel'
    }
    return 'home'
  })
  const [schoolData, setSchoolData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [auth, setAuth] = useState(() => {
    try {
      const token = localStorage.getItem('access_token')
      const userRaw = localStorage.getItem('auth_user')
      const user = userRaw ? JSON.parse(userRaw) : null
      return { token, user }
    } catch {
      return { token: null, user: null }
    }
  })

  const isLoggedIn = Boolean(auth?.token)
  const userRole = auth?.user?.role?.toLowerCase?.() || ''
  const isAdmin = isLoggedIn && (userRole === 'admin' || auth?.user?.is_super_admin)
  const isTeacher = isLoggedIn && userRole === 'teacher'
  const isStudent = isLoggedIn && userRole === 'student'
  const isParent = isLoggedIn && userRole === 'parent'

  useEffect(() => {
    fetchSchoolData()
  }, [])

  useEffect(() => {
    if (page === 'teacher-panel' && (!isLoggedIn || !isTeacher)) {
      setPage(isLoggedIn ? 'home' : 'login')
    }
    if (page === 'student-panel' && (!isLoggedIn || !isStudent)) {
      setPage(isLoggedIn ? 'home' : 'login')
    }
    if (page === 'parent-panel' && (!isLoggedIn || !isParent)) {
      setPage(isLoggedIn ? 'home' : 'login')
    }
    if (page?.startsWith('admin-') && !isAdmin) {
      setPage(isLoggedIn ? 'home' : 'login')
    }
  }, [isLoggedIn, isTeacher, isStudent, isParent, isAdmin, page])

  const fetchSchoolData = async () => {
    try {
      setLoading(true)
      const data = await schoolService.getSchool()
      setSchoolData(data)
      setError(null)
    } catch (err) {
      setError('Failed to load school information')
      console.error('Error fetching school data:', err)
    } finally {
      setLoading(false)
    }
  }

  const Navigation = () => (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="nav-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#logo-gradient)"/>
              <path d="M20 8L10 14V20L20 26L30 20V14L20 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 26V32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14L20 18L30 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb"/>
                  <stop offset="100%" stopColor="#1e40af"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-content">
            <span className="nav-title">Blue Ridge Academy</span>
            <span className="nav-tagline">Excellence in Education</span>
          </div>
        </div>
        
        <div className="nav-menu">
          <div className="nav-links">
            {['Home', 'About', 'Academics', 'FAQ', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => setPage(item.toLowerCase())}
                className={`nav-link ${page === item.toLowerCase() ? 'active' : ''}`}
              >
                <span className="nav-text">{item}</span>
                <span className="nav-indicator"></span>
              </button>
            ))}
          </div>

          <div className="nav-actions">
            {!isLoggedIn ? (
              <button
                onClick={() => setPage('login')}
                className={`nav-btn nav-btn-outline ${page === 'login' ? 'active' : ''}`}
              >
                <span>Login</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem('access_token')
                  localStorage.removeItem('auth_user')
                  setAuth({ token: null, user: null })
                  setPage('home')
                }}
                className="nav-btn nav-btn-ghost"
              >
                <span>Logout</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setPage('admin-panel')}
                className={`nav-btn ${page === 'admin-panel' ? 'active' : ''}`}
              >
                Admin
              </button>
            )}
            {isParent && (
              <button
                onClick={() => setPage('parent-panel')}
                className={`nav-btn ${page === 'parent-panel' ? 'active' : ''}`}
              >
                Parent
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

  const handleLoginSuccess = (result) => {
    const token = result?.token
    const user = result?.user
    if (token) localStorage.setItem('access_token', token)
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    setAuth({ token, user })

    const role = user?.role?.toLowerCase?.() || ''
    if (role === 'parent') setPage('parent-panel')
    else if (role === 'admin') setPage('admin-panel')
    else setPage('home')
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading school information...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Navigation />

      {page === 'home' && <LandingHero schoolData={schoolData} />}
      {page === 'about' && <div>About Page</div>}
      {page === 'academics' && <div>Academics Page</div>}
      {page === 'faq' && <FAQManagement />}
      {page === 'contact' && <div>Contact Page</div>}
      {page === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}

      {page === 'admin-panel' && <AdminPanel navigate={setPage} currentPage={page} />}
      {page === 'admin-dashboard' && <Dashboard />}
      {page === 'admin-academic-years' && <AcademicYearManagement />}
      {page === 'admin-classes' && <ClassManagement />}
      {page === 'admin-sections' && <SectionManagement />}
      {page === 'admin-students' && <StudentManagement />}
      {page === 'admin-teachers' && <TeacherManagement />}
      {page === 'admin-subjects' && <SubjectManagement />}
      {page === 'admin-parents' && <ParentManagement />}
      {page === 'admin-student-assignment' && <StudentClassAssignment />}
      {page === 'admin-payments' && <PaymentRecords />}

      {isStudent && page === 'student-panel' && <StudentPanel user={auth?.user} />}
      {isTeacher && page === 'teacher-panel' && <TeacherPanel />}
      {isParent && page === 'parent-panel' && <ParentPanel />}

      {/* ✅ PAYMENT ROUTE ADDED HERE */}
      {page === 'payment' && <PaymentPanel />}
    </div>
  )
}

export default App