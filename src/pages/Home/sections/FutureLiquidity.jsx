import { useState } from 'react'

const structurePillars = [
  'Regulated Private Market Participation',
  'Blockchain-Based Transparency',
  'Structured Liquidity Infrastructure',
  'Scalable Global Digital Ownership Access',
]

const subjectTo = [
  'Regulatory Approvals',
  'Licensing Requirements',
  'Exchange Eligibility Standards',
  'Market Conditions',
  'Ecosystem Maturity',
]

export default function FutureLiquidity() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="fl-section">
      <div className="shape right" />
      <div className="container">
        <div className="block-text center">
          <h6 className="sub-heading"><span>Long-Term Vision</span></h6>
          <h3 className="heading">Future Liquidity &amp; Exchange Vision</h3>
          <p className="fl-intro">
            Growith is building long-term infrastructure for regulated digital private markets, including future
            peer-to-peer transfer functionality between verified and whitelisted investors within the ecosystem.
          </p>
        </div>

        {/* Always-visible teaser */}
        <div className="fl-teaser">
          <div className="fl-teaser__badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#9D6FFF" strokeWidth="1.8"/>
              <path d="M12 8v4l3 3" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Target Framework Readiness: <strong>&nbsp;Q3 2027</strong>
          </div>
          <p className="fl-teaser__text">
            The platform is actively developing the technical, operational, and compliance framework for broader
            digital asset accessibility — offering investors <strong>early-stage access before broader market infrastructure matures.</strong>
          </p>
        </div>

        {/* Expandable content */}
        <div className={`fl-expandable${expanded ? ' fl-expandable--open' : ''}`}>
          <div className="fl-grid">

            {/* Left: exchange vision */}
            <div className="fl-body">
              <h5 className="fl-sub-heading">Exchange Integration Vision</h5>
              <p className="fl-text">
                The long-term vision includes enabling future public exchange accessibility for ShivAI tokens, subject to:
              </p>
              <ul className="fl-pills">
                {subjectTo.map(item => (
                  <li key={item}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#9D6FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <h5 className="fl-sub-heading" style={{ marginTop: 32 }}>Broader Objective</h5>
              <p className="fl-text">This roadmap reflects Growith's broader objective of combining:</p>
              <ul className="fl-pillars">
                {structurePillars.map((p, i) => (
                  <li key={i}>
                    <span className="fl-pillar-num">{String(i + 1).padStart(2, '0')}</span>
                    {p}
                  </li>
                ))}
              </ul>
              <p className="fl-closing">within a compliant and investor-focused ecosystem.</p>
            </div>

            {/* Right: milestone card */}
            <div className="fl-milestone">
              <div className="fl-milestone__card">
                <div className="fl-milestone__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3h18v4H3z" stroke="#9D6FFF" strokeWidth="1.6" strokeLinejoin="round"/>
                    <path d="M3 7v14h18V7" stroke="#9D6FFF" strokeWidth="1.6" strokeLinejoin="round"/>
                    <path d="M9 11h6M9 15h4" stroke="#9D6FFF" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="fl-milestone__label">Framework Readiness Target</p>
                <p className="fl-milestone__date">Q3 2027</p>
                <div className="fl-milestone__divider" />
                <ul className="fl-milestone__list">
                  <li>Peer-to-peer whitelisted transfers</li>
                  <li>Regulated exchange integration</li>
                  <li>Technical &amp; licensing compliance</li>
                  <li>Ecosystem maturity criteria</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle button */}
        <div className="fl-toggle-wrap">
          <button className="fl-toggle-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Show Less
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Read More
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
