import { Link } from 'react-router-dom'
import { stats, teamMembers } from '../../data'

const values = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Compliance First',
    text: 'Every offering on Growith is issued through an EU-registered entity with full KYC/AML verification, risk disclosures, and legal documentation.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#9D6FFF" strokeWidth="2"/>
        <path d="M12 8v4l3 3" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Transparent Infrastructure',
    text: 'Token issuances are minted on Polygon with immutable on-chain records. Every allocation, transfer, and lock-in period is publicly auditable in real time.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="14" rx="2" stroke="#9D6FFF" strokeWidth="2"/>
        <path d="M16 7V5a2 2 0 0 0-4 0v2" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="14" r="2" fill="#9D6FFF"/>
      </svg>
    ),
    title: 'Custodial Security',
    text: 'Investor wallets are provisioned and secured through institutional-grade custodial infrastructure. No self-custody risk, no lost keys, no counterparty confusion.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="#9D6FFF" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Investor Access',
    text: 'We democratise private capital markets. Verified investors can access institutional-quality deals from as low as €500 — without needing a hedge fund minimum.',
  },
]

export default function About() {
  return (
    <>
      {/* ── Mission ─────────────────────────────────────── */}
      <section className="about-pg about-pg--first">
        <div className="shape" />
        <div className="container">
          <div className="row rev" style={{ alignItems: 'center', rowGap: '48px' }}>
            {/* Visual */}
            <div className="col-xl-6 col-md-12">
              <div className="about-pg__visual" data-aos="fade-right">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop"
                  alt="Growith Platform"
                  className="about-pg__img about-pg__img--main"
                  onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.15)'; e.target.src = '' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80&auto=format&fit=crop"
                  alt="Markets"
                  className="about-pg__img about-pg__img--accent"
                  onError={(e) => { e.target.style.background = 'rgba(157,111,255,0.15)'; e.target.src = '' }}
                />
                <div className="about-pg__stat-badge">
                  <span className="about-pg__stat-value">€2.4M+</span>
                  <span className="about-pg__stat-label">Capital Facilitated</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="col-xl-6 col-md-12">
              <div className="block-text" data-aos="fade-left">
                <h6 className="sub-heading"><span>Our Mission</span></h6>
                <h3 className="heading">Regulated Private Capital Markets — Accessible to Everyone</h3>
                <p className="mb-17">
                  Growith is a compliant digital securities marketplace that brings institutional-grade investment 
                  opportunities to verified individual investors. Every offering is asset-backed, EU-regulated, and 
                  transparently settled on Polygon.
                </p>
                <p className="mb-17">
                  We built Growith because access to pre-IPO equity, structured debt, and real-asset-backed tokens 
                  should not require a €250,000 minimum or a private banking relationship. If you pass KYC, you 
                  access the same deals as institutional allocators.
                </p>
                <p className="mb-26">
                  Our first live offering — <strong>ShivAI</strong> — is a UAE-headquartered deep-tech AI SaaS 
                  company expanding across India, the Middle East, and Canada. More offerings follow in 2026.
                </p>
                <Link to="/nft" className="action-btn"><span>Explore Offerings</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section className="about-pg-stats">
        <div className="container">
          <div className="about-pg-stats__grid" data-aos="fade-up">
            {stats.map((stat) => (
              <div key={stat.id} className="about-pg-stats__item">
                <span className="about-pg-stats__value">{stat.value}</span>
                <span className="about-pg-stats__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values / How we operate ──────────────────────── */}
      <section className="about-pg-values">
        <div className="container">
          <div className="block-text center" data-aos="fade-up">
            <h6 className="sub-heading"><span>How We Operate</span></h6>
            <h3 className="heading">Built on Four Principles</h3>
          </div>
          <div className="about-pg-values__grid">
            {values.map((v, i) => (
              <div key={i} className="about-pg-values__card" data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="about-pg-values__icon">{v.icon}</div>
                <h4 className="about-pg-values__title">{v.title}</h4>
                <p className="about-pg-values__text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Preview ─────────────────────────────────── */}
      <section className="about-pg-team">
        <div className="container">
          <div className="block-text center" data-aos="fade-up">
            <h6 className="sub-heading"><span>The Team</span></h6>
            <h3 className="heading">People Behind Growith</h3>
          </div>
          <div className="about-pg-team__grid">
            {teamMembers.map((m) => (
              <div key={m.id} className="about-pg-team__card" data-aos="fade-up" data-aos-delay={m.id * 80}>
                <div className="about-pg-team__avatar-wrap">
                  <img src={m.image} alt={m.name} className="about-pg-team__avatar"
                    onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.2)'; e.target.src = '' }} />
                </div>
                <p className="about-pg-team__name">{m.name}</p>
                <p className="about-pg-team__role">{m.position}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10" style={{ marginTop: '40px', textAlign: 'center' }}>
            <Link to="/team" className="action-btn"><span>View Full Team</span></Link>
          </div>
        </div>
      </section>
    </>
  )
}
