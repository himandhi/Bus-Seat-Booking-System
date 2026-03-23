import { useState } from "react";
import "./ContactPage.css";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to real backend endpoint
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: "📍", title: "Address", detail: "Colombo, Sri Lanka" },
    { icon: "📞", title: "Phone", detail: "+94 11 234 5678" },
    { icon: "✉️", title: "Email", detail: "support@busgo.lk" },
    { icon: "🕐", title: "Working Hours", detail: "Mon – Sat, 8AM – 6PM" },
  ];

  return (
    <div className="contact-page">
      {/* Page Header */}
      <section className="contact-hero">
        <span className="contact-badge">Get In Touch</span>
        <h1 className="contact-title">We'd Love to <span className="highlight">Hear from You</span></h1>
        <p className="contact-subtitle">
          Have a question about your booking, a route, or anything else? Our team is here to help.
        </p>
      </section>

      <div className="contact-body">
        {/* Contact Info Cards */}
        <aside className="contact-info">
          {contactInfo.map((item, i) => (
            <div className="info-card" key={i}>
              <span className="info-icon">{item.icon}</span>
              <div>
                <p className="info-title">{item.title}</p>
                <p className="info-detail">{item.detail}</p>
              </div>
            </div>
          ))}

          <div className="social-row">
            <span className="social-label">Follow Us</span>
            <div className="social-icons">
              <a href="#" className="social-btn" title="Facebook">f</a>
              <a href="#" className="social-btn" title="Twitter">𝕏</a>
              <a href="#" className="social-btn" title="Instagram">ig</a>
            </div>
          </div>
        </aside>

        {/* Contact Form */}
        <div className="contact-form-wrap">
          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button className="btn-primary" onClick={() => setSubmitted(false)}>Send Another</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2 className="form-title">Send a Message</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Perera"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Booking enquiry, Route info, etc."
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-submit">
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
