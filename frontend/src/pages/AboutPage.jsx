import "./AboutPage.css";

export default function AboutPage() {
  const team = [
    { name: "Operations Team", role: "Route & Schedule Management", icon: "🗺️" },
    { name: "Support Team", role: "Passenger Assistance", icon: "🎧" },
    { name: "Tech Team", role: "Platform Development", icon: "💻" },
  ];

  const stats = [
    { value: "8+", label: "Routes Available" },
    { value: "500+", label: "Seats Booked" },
    { value: "10+", label: "Bus Schedules" },
    { value: "99%", label: "Booking Success Rate" },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">About Us</span>
          <h1 className="about-title">
            Travelling Made <span className="highlight">Simple</span> with BusGo
          </h1>
          <p className="about-subtitle">
            BusGo is a modern bus seat booking platform built to make inter-city travel
            easy, fast, and reliable for every passenger in Sri Lanka.
          </p>
        </div>
        <div className="about-hero-visual">
          <div className="bus-illustration">🚌</div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="mission-card">
          <div className="mission-icon">🎯</div>
          <h2>Our Mission</h2>
          <p>
            To provide a seamless, transparent, and reliable bus booking experience
            that saves passengers time and helps bus operators manage their schedules efficiently.
          </p>
        </div>
        <div className="mission-card">
          <div className="mission-icon">👁️</div>
          <h2>Our Vision</h2>
          <p>
            To become the leading digital platform for bus travel in Sri Lanka,
            connecting passengers and operators through smart, simple technology.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="about-how">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          {[
            { step: "01", title: "Choose Your Route", desc: "Browse available routes and pick your origin and destination." },
            { step: "02", title: "Select a Schedule", desc: "Pick a travel date and time that works best for you." },
            { step: "03", title: "Book Your Seat", desc: "Choose from available seats on the visual seat map." },
            { step: "04", title: "Get Confirmation", desc: "Receive your unique booking ID instantly after confirming." },
          ].map((s, i) => (
            <div className="step-card" key={i}>
              <span className="step-number">{s.step}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <h2 className="section-title">Our Teams</h2>
        <div className="team-grid">
          {team.map((t, i) => (
            <div className="team-card" key={i}>
              <div className="team-icon">{t.icon}</div>
              <h3>{t.name}</h3>
              <p>{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
