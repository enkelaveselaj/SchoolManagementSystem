import React from 'react'

const About = ({ schoolData }) => (
  <section className="landing-section">
    <div className="section-header">
      <h2>About Blue Ridge Academy</h2>
      <p>
        Blue Ridge Academy blends academic excellence with a student-centered community.
        We help learners build confidence, creative thinking, and practical skills for tomorrow.
      </p>
    </div>

    <div className="programs-grid">
      <div className="program-card">
        <h3>Our Mission</h3>
        <p>
          Prepare students for a changing world through interdisciplinary learning,
          experiential projects, and a culture of curiosity.
        </p>
        <ul className="program-highlights">
          <li>Hands-on, project-based learning</li>
          <li>Strong mentorship and support</li>
          <li>Growth inside and outside the classroom</li>
        </ul>
      </div>

      <div className="program-card">
        <h3>What Sets Us Apart</h3>
        <p>
          We combine small classes, modern facilities, and inclusive community values
          to support academic success and personal growth.
        </p>
        <ul className="program-highlights">
          <li>Design thinking in everyday learning</li>
          <li>STEM, arts, and leadership pathways</li>
          <li>Real-world readiness for college and career</li>
        </ul>
      </div>

      <div className="program-card">
        <h3>Our Community</h3>
        <p>
          A welcoming campus where students, teachers, and families work together to nurture
          curiosity, resilience, and civic responsibility.
        </p>
        <ul className="program-highlights">
          <li>Collaborative learning environment</li>
          <li>Healthy extracurricular life</li>
          <li>Local and global engagement</li>
        </ul>
      </div>

      <div className="program-card">
        <h3>By the Numbers</h3>
        <p>
          Experience the strength of our community through measurable outcomes and student success.
        </p>
        <ul className="program-highlights">
          <li>Established: {schoolData?.founded || '1985'}</li>
          <li>Students: {schoolData?.students || '1,200'}</li>
          <li>Faculty: {schoolData?.teachers || '85'}</li>
          <li>Programs: {schoolData?.programs || '25+'}</li>
        </ul>
      </div>
    </div>
  </section>
)

export default About
