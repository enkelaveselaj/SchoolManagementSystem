import React from 'react'

const Contact = ({ schoolData }) => (
  <section className="landing-section">
    <div className="section-header">
      <h2>Contact Us</h2>
      <p>
        Have questions about admissions, programs, or campus life? Reach out and our team
        will be glad to help.
      </p>
    </div>

    <div className="contact-grid">
      <div className="contact-form">
        <h2>Send a Message</h2>
        <form className="form">
          <div className="form-group">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" type="text" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" rows="5" placeholder="How can we help?" />
          </div>
          <button type="button" className="btn btn-primary">Submit</button>
        </form>
      </div>

      <div className="contact-info">
        <div className="info-section">
          <h3>Visit Us</h3>
          <p>
            Blue Ridge Academy
            <br />123 Ridge Road
            <br />Blue Ridge, CA 90000
          </p>
          <p><strong>Phone:</strong> (555) 123-4567</p>
          <p><strong>Email:</strong> info@blueridgeacademy.edu</p>
        </div>

        <div className="info-section">
          <h3>Office Hours</h3>
          <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
          <p>Saturday: 9:00 AM - 1:00 PM</p>
          <p>Sunday: Closed</p>
        </div>

        <div className="info-section">
          <h3>School Snapshot</h3>
          <p>
            Founded in {schoolData?.founded || '1985'}, Blue Ridge Academy offers a
            close-knit campus community with modern learning pathways.
          </p>
        </div>
      </div>
    </div>
  </section>
)

export default Contact
