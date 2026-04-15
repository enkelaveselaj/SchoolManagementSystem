import React, { useState, useEffect } from 'react'
import AcademicYearManagement from './components/AcademicYearManagement'
import ClassManagement from './components/ClassManagement'
import SectionManagement from './components/SectionManagement'
import StudentManagement from './components/StudentManagement'
import TeacherManagement from './components/TeacherManagement'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import schoolService from './services/schoolService'
import './styles.css'

const App = () => {
  const [page, setPage] = useState('home')
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

  useEffect(() => {
    fetchSchoolData()
  }, [])

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
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 8V16L16 22L28 16V8L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 22V30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 8L16 14L28 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-title">Blue Ridge Academy</span>
        </div>
        
        <div className="nav-menu">
          {['Home', 'About', 'Academics', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => setPage(item.toLowerCase())}
              className={`nav-item ${page === item.toLowerCase() ? 'active' : ''}`}
            >
              {item}
            </button>
          ))}

          {!auth?.token ? (
            <>
              <button
                onClick={() => setPage('login')}
                className={`nav-item ${page === 'login' ? 'active' : ''}`}
              >
                Login
              </button>
              <button
                onClick={() => setPage('register')}
                className={`nav-item ${page === 'register' ? 'active' : ''}`}
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('auth_user')
                setAuth({ token: null, user: null })
                setPage('home')
              }}
              className="nav-item"
            >
              Logout
            </button>
          )}

          <button
            onClick={() => setPage('admin')}
            className={`nav-item ${page === 'admin' ? 'active' : ''} admin-nav`}
          >
            Admin Panel
          </button>
        </div>
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

  const handleRegisterSuccess = () => {
    setPage('login')
  }

  const HomePage = () => (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Excellence in Education
            <span className="hero-subtitle">Since {schoolData?.founded || '1985'}</span>
          </h1>
          <p className="hero-description">
            Nurturing tomorrow's leaders through innovative teaching, cutting-edge technology, 
            and a commitment to academic excellence.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{schoolData?.students || '1,200'}</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{schoolData?.teachers || '85'}</div>
              <div className="stat-label">Faculty</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{schoolData?.programs || '25'}</div>
              <div className="stat-label">Programs</div>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn-primary">Apply Now</button>
            <button className="btn-secondary">Virtual Tour</button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Blue Ridge Academy?</h2>
            <p>Discover what makes us a leader in modern education</p>
          </div>
          
          <div className="features-grid">
            {[
              {
                icon: 'graduation-cap',
                title: 'Academic Excellence',
                description: 'Rigorous curriculum with Advanced Placement and International Baccalaureate programs',
                features: ['AP Courses', 'IB Program', 'STEM Focus']
              },
              {
                icon: 'flask',
                title: 'Innovation Labs',
                description: 'State-of-the-art facilities for hands-on learning and research',
                features: ['Science Labs', 'Maker Space', 'Robotics']
              },
              {
                icon: 'globe',
                title: 'Global Perspective',
                description: 'Diverse community with international partnerships and exchange programs',
                features: ['20+ Countries', 'Exchange Programs', 'Cultural Events']
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-tags">
                  {feature.features.map((tag, i) => (
                    <span key={i} className="feature-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Shape Your Future?</h2>
            <p>Join our community of learners and achievers</p>
            <button className="btn-primary btn-large">Schedule a Visit</button>
          </div>
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
      {error && (
        <div className="error" style={{ margin: '16px auto', maxWidth: 1100 }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchSchoolData} className="btn-primary">Retry</button>
        </div>
      )}
      {page === 'home' && <HomePage />}
      {page === 'about' && <AboutPage />}
      {page === 'academics' && <AcademicsPage />}
      {page === 'contact' && <ContactPage />}
      {page === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onGoRegister={() => setPage('register')}
        />
      )}
      {page === 'register' && (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onGoLogin={() => setPage('login')}
        />
      )}
      {page === 'admin' && <AdminPanel />}
      {page === 'admin-dashboard' && <Dashboard />}
      {page === 'admin-academic-years' && <AcademicYearManagement />}
      {page === 'admin-classes' && <ClassManagement />}
      {page === 'admin-sections' && <SectionManagement />}
      {page === 'admin-students' && <StudentManagement />}
      {page === 'admin-teachers' && <TeacherManagement />}
    </div>
  )
}

export default App
