import React from 'react'

const LandingHero = ({ schoolData }) => {
  const stats = [
    { label: 'Students', value: schoolData?.students || '1,200', detail: 'K-12 Programs' },
    { label: 'Faculty', value: schoolData?.teachers || '85', detail: 'Average 14:1 ratio' },
    { label: 'Programs', value: schoolData?.programs || '25+', detail: 'AP, IB & STEM' }
  ]

  return (
    <section className="landing-hero">
      <div className="hero-sheen" aria-hidden="true"></div>
      <div className="hero-columns">
        <div className="hero-copy">
          <div className="pill">Blue Ridge Academy · Est. {schoolData?.founded || '1985'}</div>
          <h1>
            Where bold minds{' '}
            <span>design tomorrow.</span>
          </h1>
          <p className="hero-lede">
            A future-focused campus blending academic excellence with design thinking, real-world projects,
            and a vibrant community that celebrates curiosity.
          </p>

          <div className="hero-actions">
            <button className="btn btn-glow">Book a Campus Tour</button>
            <button className="btn btn-ghost">Discover Curriculum</button>
          </div>

          <div className="stat-line">
            <div className="avatar-stack">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className="avatar-circle" aria-hidden="true"></span>
              ))}
            </div>
            <span className="stat-caption">4.9/5 parent satisfaction</span>
          </div>
        </div>

        <div className="hero-showcase">
          <div className="grid">
            {stats.map((stat) => (
              <div key={stat.label} className="glow-card">
                <span className="label">{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.detail}</small>
              </div>
            ))}
          </div>
          <div className="floating-card">
            <div>
              <span className="label">Next Open House</span>
              <p>May 24 · Hybrid</p>
            </div>
            <button className="btn btn-mini">Save Seat</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero
