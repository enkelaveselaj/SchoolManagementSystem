import React from 'react'

const Academics = ({ schoolData }) => (
  <section className="landing-section">
    <div className="section-header">
      <h2>Academic Programs</h2>
      <p>
        A balanced curriculum with rigorous academics, creative pathways, and real-world learning
        designed for every student.
      </p>
    </div>

    <div className="programs-grid">
      <div className="program-card">
        <h3>Core Curriculum</h3>
        <p>
          Deep foundations in math, science, language arts, and social studies with modern
          digital learning and interdisciplinary connections.
        </p>
        <ul className="program-highlights">
          <li>Rigorous standards-aligned instruction</li>
          <li>Technology-rich classroom experiences</li>
          <li>Academic support for every learner</li>
        </ul>
      </div>

      <div className="program-card">
        <h3>STEM & Innovation</h3>
        <p>
          STEM, robotics, coding, and design studio opportunities help students build
          future-ready technical and creative skills.
        </p>
        <ul className="program-highlights">
          <li>Project-based engineering labs</li>
          <li>Science research and innovation clubs</li>
          <li>Real-world problem solving</li>
        </ul>
      </div>

      <div className="program-card">
        <h3>Arts & Humanities</h3>
        <p>
          Visual arts, music, theater, and humanities pathways encourage voice, expression,
          and cultural awareness.
        </p>
        <ul className="program-highlights">
          <li>Studio art and performance courses</li>
          <li>Literature, history, and global studies</li>
          <li>Creative exhibitions and showcases</li>
        </ul>
      </div>

      <div className="program-card">
        <h3>Student Support</h3>
        <p>
          Personalized advising, tutoring, and enrichment services help students reach their
          academic goals and build confidence.
        </p>
        <ul className="program-highlights">
          <li>Individual learning plans</li>
          <li>Guidance and counseling support</li>
          <li>Enrichment beyond the classroom</li>
        </ul>
      </div>
    </div>
  </section>
)

export default Academics
