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
import StudentClassAssignment from './components/admin/StudentClassAssignment'
import ParentManagement from './components/ParentManagement'
import LandingHero from './components/landing/LandingHero'
import './styles.css'

const App = () => {
  const [page, setPage] = useState(() => {
    // Check for teacher panel in URL hash
    if (window.location.hash === '#teacher-panel') {
      return 'teacher-panel';
    }
    return 'home';
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

  useEffect(() => {
    fetchSchoolData()
  }, [])

  useEffect(() => {
    if (!isLoggedIn && page === 'teacher-panel') {
      setPage('login')
    }
  }, [isLoggedIn, page])

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
              <>
                <button
                  onClick={() => setPage('login')}
                  className={`nav-btn nav-btn-outline ${page === 'login' ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Login</span>
                </button>
              </>
            ) : (
              <>
                <div className="user-menu">
                  <div className="user-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="user-name">{auth?.user?.name || 'User'}</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('auth_user')
                    setAuth({ token: null, user: null })
                    setPage('home')
                  }}
                  className="nav-btn nav-btn-ghost"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Logout</span>
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => setPage('admin')}
                className={`nav-btn nav-btn-admin ${page === 'admin' ? 'active' : ''}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Admin</span>
              </button>
            )}
            {isLoggedIn && (
              <button
                onClick={() => setPage('teacher-panel')}
                className={`nav-btn nav-btn-teacher ${page === 'teacher-panel' ? 'active' : ''}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 19 7.5 19s3.332-.523 4.5-1.247M6.764 6.24l-6.795 6.795m0 0l6.795 6.795" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Teacher</span>
              </button>
            )}
          </div>
        </div>

        <button className="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )

  const handleLoginSuccess = (result) => {
    const token = result?.token
    const user = result?.user
    if (token) {
      localStorage.setItem('access_token', token)
    }
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    }
    setAuth({ token, user })
    setPage('home')
  }

  const renderAdminRoute = (component) => {
    if (!isLoggedIn) {
      return (
        <div className="access-guard">
          <h2>Admin access required</h2>
          <p>Log in with an administrator account to manage school data.</p>
          <button className="btn btn-glow" onClick={() => setPage('login')}>
            Go to Login
          </button>
        </div>
      )
    }

    if (!isAdmin) {
      return (
        <div className="access-guard">
          <h2>Insufficient permissions</h2>
          <p>This panel is only visible to accounts with the Admin role.</p>
          <button className="btn btn-ghost" onClick={() => setPage('home')}>
            Back to Home
          </button>
        </div>
      )
    }

    return component
  }

  const HomePage = () => (
    <div className="landing-page">
      {error && (
        <div className="error-banner">
          <div>
            <h3>We couldn't load live school data</h3>
            <p>Showing default highlights for now.</p>
          </div>
          <button onClick={fetchSchoolData} className="btn btn-outline">Retry</button>
        </div>
      )}

      <LandingHero schoolData={schoolData} />

      <section className="landing-section highlight-grid">
        <div className="section-heading">
          <p>Signature Experience</p>
          <h2>Beyond classrooms, we design meaningful learning journeys.</h2>
        </div>
        <div className="card-grid">
          {[
            {
              title: 'Immersive Curriculum',
              description:
                'Interdisciplinary tracks that blend humanities, design, science, and technology with mentorship from industry partners.',
              tags: ['AP & IB Pathways', 'Innovation Studio', 'Global Labs']
            },
            {
              title: 'Culture of Belonging',
              description:
                'Advisory pods, social-emotional coaching, and equitable access initiatives nurture confident student leaders.',
              tags: ['Wellness Pods', 'Parent Circles', 'Equity Council']
            },
            {
              title: 'Future Ready Toolkit',
              description:
                'Career intensives, public showcases, and micro-credential badges prepare students for universities and startups alike.',
              tags: ['Portfolio Reviews', 'Startup Incubator', 'Career Sprints']
            }
          ].map((card) => (
            <article key={card.title} className="story-card">
              <div className="story-body">
                <div className="story-icon" aria-hidden="true"></div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <div className="chip-row">
                {card.tags.map((tag) => (
                  <span key={tag} className="chip">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section experience">
        <div className="experience-card">
          <span className="pill pill-muted">Learning Studios</span>
          <h3>15+ flexible studios for robotics, media arts, biotech, and culinary innovation.</h3>
          <p>
            Students prototype solutions alongside faculty designers and visiting entrepreneurs—turning bold questions into
            tangible products showcased at our quarterly Expo Nights.
          </p>
          <ul>
            <li>Weekly design critiques with industry mentors</li>
            <li>24/7 virtual campus for remote collaboration</li>
            <li>Scholarship-backed innovation grants</li>
          </ul>
        </div>
        <div className="experience-panel">
          <div>
            <span className="pill">Voices</span>
            <h4>“Every project feels like we’re shipping something real.”</h4>
            <p>— Aanya S., Grade 11 design lab lead</p>
          </div>
          <div className="divider"></div>
          <div>
            <span className="pill">Outcomes</span>
            <p>98% of seniors graduate with university offers across three continents.</p>
          </div>
        </div>
      </section>

      <section className="landing-section mosaic">
        <div className="mosaic-panel">
          <span className="pill pill-muted">Parent Snapshot</span>
          <h3>A campus that feels modern, inspiring, and human.</h3>
          <p>
            Families experience transparent communication, real-time progress dashboards, and curated community events—from
            sunrise yoga to evening climate salons.
          </p>
          <div className="mosaic-grid">
            {['Advisory', 'Studio Expo', 'Service Lab', 'Scholarships'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="mosaic-panel accent">
          <h4>Next events</h4>
          <div className="event-list">
            {[
              { title: 'Design Summit', date: 'May 24 · Hybrid' },
              { title: 'Parent Studio Walk', date: 'June 2 · Campus' },
              { title: 'Scholarship Lab', date: 'June 15 · Virtual' }
            ].map((event) => (
              <div key={event.title} className="event-row">
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.date}</p>
                </div>
                <button className="btn btn-outline">RSVP</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <span className="pill">Ready to visit?</span>
          <h2>Walk the studios, meet our students, feel the energy.</h2>
          <p>Schedule a custom tour with admissions and discover how we activate bold futures.</p>
        </div>
        <div className="cta-actions">
          <button className="btn btn-glow">Schedule a Tour</button>
          <button className="btn btn-ghost">Chat with Admissions</button>
        </div>
      </section>
    </div>
  )

  const AboutPage = () => (
    <div className="page">
      <section className="page-header">
        <div className="container">
          <h1>About Blue Ridge Academy</h1>
          <p>A legacy of educational excellence and innovation</p>
        </div>
      </section>

      <section className="content">
        <div className="container">
          <div className="content-grid">
            <div className="content-main">
              <h2>Our Mission</h2>
              <p>
                To provide an exceptional educational environment that fosters intellectual curiosity, 
                critical thinking, and character development while preparing students for leadership 
                roles in an increasingly complex world.
              </p>

              <h2>Our Vision</h2>
              <p>
                To be recognized globally as a premier institution that develops visionary leaders 
                equipped with the knowledge, skills, and ethical foundation to address tomorrow's 
                challenges with confidence and integrity.
              </p>

              <div className="values-section">
                <h2>Core Values</h2>
                <div className="values-grid">
                  {[
                    {title: 'Excellence', desc: 'Uncompromising commitment to the highest standards'},
                    {title: 'Integrity', desc: 'Upholding ethical principles and moral courage'},
                    {title: 'Innovation', desc: 'Embracing creativity and forward-thinking solutions'},
                    {title: 'Community', desc: 'Building collaborative and supportive relationships'}
                  ].map((value, index) => (
                    <div key={index} className="value-card">
                      <h3>{value.title}</h3>
                      <p>{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="content-sidebar">
              <div className="info-card">
                <h3>School Information</h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Founded</span>
                    <span className="info-value">{schoolData?.founded || '1985'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Type</span>
                    <span className="info-value">Private Day School</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Grades</span>
                    <span className="info-value">K-12</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">{schoolData?.address || 'Mountain View, CA'}</span>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h3>Quick Stats</h3>
                <div className="stats-list">
                  <div className="stat-row">
                    <span>Student-Teacher Ratio</span>
                    <strong>14:1</strong>
                  </div>
                  <div className="stat-row">
                    <span>College Acceptance</span>
                    <strong>98%</strong>
                  </div>
                  <div className="stat-row">
                    <span>AP Pass Rate</span>
                    <strong>85%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  const AcademicsPage = () => (
    <div className="page">
      <section className="page-header">
        <div className="container">
          <h1>Academic Programs</h1>
          <p>Comprehensive curriculum designed for future success</p>
        </div>
      </section>

      <section className="content">
        <div className="container">
          <div className="programs-grid">
            {[
              {
                title: 'Lower School (K-5)',
                description: 'Foundation years focusing on literacy, numeracy, and social development',
                highlights: ['Project-Based Learning', 'STEM Introduction', 'Arts Integration']
              },
              {
                title: 'Middle School (6-8)',
                description: 'Transitional years with increased academic rigor and independence',
                highlights: ['Advanced Mathematics', 'Science Labs', 'World Languages']
              },
              {
                title: 'Upper School (9-12)',
                description: 'College preparatory curriculum with extensive AP and IB offerings',
                highlights: ['25+ AP Courses', 'IB Diploma Program', 'College Counseling']
              }
            ].map((program, index) => (
              <div key={index} className="program-card">
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                <ul className="program-highlights">
                  {program.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  const ContactPage = () => (
    <div className="page">
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with our admissions team</p>
        </div>
      </section>

      <section className="content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form">
              <h2>Send us a Message</h2>
              <form className="form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject">
                    <option value="">Select a topic</option>
                    <option value="admissions">Admissions</option>
                    <option value="academics">Academic Programs</option>
                    <option value="tours">Campus Tours</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            </div>

            <div className="contact-info">
              <div className="info-section">
                <h3>Campus Address</h3>
                <p>
                  {schoolData?.address || '1234 Academy Drive'}<br />
                  Mountain View, CA 94043<br />
                  United States
                </p>
              </div>

              <div className="info-section">
                <h3>Contact Information</h3>
                <p>
                  <strong>Phone:</strong> (650) 555-0123<br />
                  <strong>Email:</strong> admissions@blueridge.edu<br />
                  <strong>Fax:</strong> (650) 555-0124
                </p>
              </div>

              <div className="info-section">
                <h3>Office Hours</h3>
                <p>
                  <strong>Monday - Friday:</strong> 8:00 AM - 4:00 PM<br />
                  <strong>Saturday:</strong> 9:00 AM - 12:00 PM<br />
                  <strong>Sunday:</strong> Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  const AdminPanel = () => (
    <div className="page">
      <section className="page-header">
        <div className="container">
          <h1>Admin Panel</h1>
          <p>School Management System - Administrative Dashboard</p>
        </div>
      </section>

      <section className="content">
        <div className="container">
          <div className="admin-navigation">
            <button 
              onClick={() => setPage('admin-dashboard')}
              className={`admin-nav-btn ${page === 'admin-dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setPage('admin-academic-years')}
              className={`admin-nav-btn ${page === 'admin-academic-years' ? 'active' : ''}`}
            >
              Academic Years
            </button>
            <button 
              onClick={() => setPage('admin-classes')}
              className={`admin-nav-btn ${page === 'admin-classes' ? 'active' : ''}`}
            >
              Classes
            </button>
            <button 
              onClick={() => setPage('admin-sections')}
              className={`admin-nav-btn ${page === 'admin-sections' ? 'active' : ''}`}
            >
              Sections
            </button>
            <button 
              onClick={() => setPage('admin-students')}
              className={`admin-nav-btn ${page === 'admin-students' ? 'active' : ''}`}
            >
              Students
            </button>
            <button 
              onClick={() => setPage('admin-teachers')}
              className={`admin-nav-btn ${page === 'admin-teachers' ? 'active' : ''}`}
            >
              Teachers
            </button>
            <button 
              onClick={() => setPage('admin-parents')}
              className={`admin-nav-btn ${page === 'admin-parents' ? 'active' : ''}`}
            >
              Parents
            </button>
            <button 
              onClick={() => setPage('admin-subjects')}
              className={`admin-nav-btn ${page === 'admin-subjects' ? 'active' : ''}`}
            >
              Subjects
            </button>
            <button 
              onClick={() => setPage('admin-student-assignment')}
              className={`admin-nav-btn ${page === 'admin-student-assignment' ? 'active' : ''}`}
            >
              Student Assignment
            </button>
            <button 
              onClick={() => setPage('home')}
              className="admin-nav-btn back-btn"
            >
              Back to Website
            </button>
          </div>
        </div>
      </section>
    </div>
  )

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
      {page === 'home' && <HomePage />}
      {page === 'about' && <AboutPage />}
      {page === 'academics' && <AcademicsPage />}
      {page === 'faq' && <FAQManagement />}
      {page === 'contact' && <ContactPage />}
      {page === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {page === 'admin' && renderAdminRoute(<AdminPanel />)}
      {page === 'admin-dashboard' && renderAdminRoute(<Dashboard />)}
      {page === 'admin-academic-years' && renderAdminRoute(<AcademicYearManagement />)}
      {page === 'admin-classes' && renderAdminRoute(<ClassManagement />)}
      {page === 'admin-sections' && renderAdminRoute(<SectionManagement />)}
      {page === 'admin-students' && renderAdminRoute(<StudentManagement />)}
      {page === 'admin-teachers' && renderAdminRoute(<TeacherManagement />)}
      {page === 'admin-subjects' && renderAdminRoute(<SubjectManagement />)}
      {page === 'admin-parents' && renderAdminRoute(<ParentManagement />)}
      {page === 'admin-student-assignment' && renderAdminRoute(<StudentClassAssignment />)}
      {isLoggedIn && page === 'teacher-panel' && <TeacherPanel />}
    </div>
  )
}

export default App
