import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactPage.css";

export default function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const contactCards = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.17 4 2 2 0 012.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      ),
      color: "blue",
      title: "Phone",
      lines: ["+94 777 382 186", "+94 112 345 678"],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      color: "green",
      title: "Email",
      lines: ["info@busgo.lk", "support@busgo.lk"],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      color: "purple",
      title: "Address",
      lines: ["123 Main Street,", "Colombo 00700,", "Sri Lanka"],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      color: "orange",
      title: "Business Hours",
      lines: ["Monday - Friday: 8AM - 8PM", "Saturday: 9AM - 6PM", "Sunday: 10AM - 4PM"],
    },
  ];

  const faqs = [
    { q: "How do I book a bus ticket?", a: "Simply select your route, date, choose your seat, and complete the booking with passenger details." },
    { q: "Can I cancel my booking?", a: "Yes, you can cancel your booking by contacting our support team." },
    { q: "How do I make payments for bookings?", a: "First, you need to make the advance payment online. The remaining balance must be paid at the bus." },
    { q: "How early should I arrive at the boarding point?", a: "We recommend arriving at least 15 minutes before the scheduled departure time." },
    { q: "Can I change my seat after booking?", a: "Seat changes are not allowed after confirmation. Please contact the admin for assistance." },
  ];

  return (
    <div className="cp-page">

      {/* ── Page Header ── */}
      <div className="cp-page-header">
        <div className="cp-header-inner">
          <span className="cp-header-badge">📬 Contact Us</span>
          <h1 className="cp-page-title">We'd Love to <span className="cp-title-accent">Hear from You</span></h1>
          <p className="cp-page-subtitle">Have a question, feedback, or need help with your booking? Our team is ready to assist you.</p>
          <div className="cp-header-stats">
            <div className="cp-stat">
              <span className="cp-stat-num">24/7</span>
              <span className="cp-stat-label">Support</span>
            </div>
            <div className="cp-stat-divider" />
            <div className="cp-stat">
              <span className="cp-stat-num">&lt;24h</span>
              <span className="cp-stat-label">Response Time</span>
            </div>
            <div className="cp-stat-divider" />
            <div className="cp-stat">
              <span className="cp-stat-num">100%</span>
              <span className="cp-stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact Cards + Form ── */}
      <section className="cp-body">

        {/* Left — Contact Cards */}
        <div className="cp-cards">
          {contactCards.map((card, i) => (
            <div className={`cp-card cp-card-${card.color}`} key={i}>
              <div className={`cp-card-icon cp-icon-${card.color}`}>{card.icon}</div>
              <div className="cp-card-content">
                <h3>{card.title}</h3>
                {card.lines.map((line, j) => <p key={j}>{line}</p>)}
              </div>
            </div>
          ))}
        </div>

        {/* Right — Contact Form */}
        <div className="cp-form-wrap">
          {submitted ? (
            <div className="cp-success-state">
              <div className="cp-success-check">✓</div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button className="cp-send-again-btn" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="cp-form">
                <div className="cp-form-row">
                  <div className="cp-field">
                    <label>Full Name <span className="cp-req">*</span></label>
                    <input name="name" type="text" placeholder="Enter your name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="cp-field">
                    <label>Email Address <span className="cp-req">*</span></label>
                    <input name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="cp-form-row">
                  <div className="cp-field">
                    <label>Phone Number</label>
                    <input name="phone" type="text" placeholder="Enter your phone" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="cp-field">
                    <label>Subject</label>
                    <input name="subject" type="text" placeholder="Message subject" value={form.subject} onChange={handleChange} />
                  </div>
                </div>
                <div className="cp-field">
                  <label>Message <span className="cp-req">*</span></label>
                  <textarea name="message" rows={5} placeholder="Write your message here..." value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="cp-submit-btn" disabled={loading}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ── Map Section ── */}
      <section className="cp-map-section">
        <div className="cp-map-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="18" height="18"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Map Location — 123 Main Street, Colombo 00700, Sri Lanka</span>
        </div>
        <div className="cp-map-container">
          <iframe
            title="BusGo Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0283!2d79.8528!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259251b615057%3A0x2db2c18a02571c3!2s123%20Main%20St%2C%20Colombo%2000700%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="cp-faq-section">
        <h2 className="cp-faq-title">Frequently Asked Questions</h2>
        <p className="cp-faq-sub">Quick answers to common questions</p>
        <div className="cp-faq-list">
          {faqs.map((faq, i) => (
            <div className={`cp-faq-item ${openFaq === i ? "open" : ""}`} key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="cp-faq-question">
                <span>{faq.q}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="cp-faq-arrow">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              {openFaq === i && <div className="cp-faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
