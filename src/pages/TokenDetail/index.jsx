import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { tokenOfferings } from '../../data'

/* ── tiny helper: section anchor scroll ─── */
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ── Accordion item ─── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`td-faq-item ${open ? 'td-faq-item--open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="td-faq-item__q">
        <span>{q}</span>
        <svg className="td-faq-item__chevron" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && <div className="td-faq-item__a">{a}</div>}
    </div>
  )
}

/* ── Main Token Detail page ─── */
export default function TokenDetail() {
  const { slug } = useParams()
  const token = tokenOfferings.find((t) => t.slug === slug)

  if (!token) {
    return (
      <section className="td-not-found">
        <div className="container big" style={{textAlign:'center',paddingTop:'10rem',paddingBottom:'10rem'}}>
          <h2 className="font-heading text-white text-3xl mb-4">Token Not Found</h2>
          <p className="text-white/60 mb-8">The offering you're looking for doesn't exist or has been removed.</p>
          <Link to="/nft" className="action-btn"><span>Browse Marketplace</span></Link>
        </div>
      </section>
    )
  }

  const isLive = token.bid === 'LIVE'

  /* group docs by category */
  const docGroups = (token.documents || []).reduce((acc, d) => {
    ;(acc[d.category] = acc[d.category] || []).push(d)
    return acc
  }, {})

  return (
    <>
      {/* ══════ A – Hero Overview ══════ */}
      <section className="td-hero">
        <div className="td-hero__bg" />
        <div className="container big" style={{position:'relative',zIndex:10}}>
          {/* breadcrumb */}
          <nav className="td-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/nft">Marketplace</Link>
            <span>/</span>
            <span className="td-breadcrumb--active">{token.title.split('—')[0].trim()} — Token</span>
          </nav>

          <div className="td-hero__grid">
            {/* Left — image */}
            <div className="td-hero__image-wrap">
              <img
                src={token.image}
                alt={token.title}
                className="td-hero__image"
                onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.15)'; e.target.style.minHeight = '340px'; e.target.src = '' }}
              />
              <span className={`td-hero__badge ${isLive ? 'td-hero__badge--live' : ''}`}>
                {isLive ? '● LIVE' : token.bid}
              </span>
            </div>

            {/* Right — details */}
            <div className="td-hero__info">
              <div className="td-hero__issuer">
                <img src={token.logo || token.ownerImg} alt={token.owner} className="td-hero__issuer-img" />
                <span>{token.owner}</span>
              </div>
              <h1 className="td-hero__title">{token.title}</h1>
              <p className="td-hero__desc">{token.shortDescription}</p>

              {/* Key stats grid */}
              <div className="td-stats-grid">
                <div className="td-stat">
                  <span className="td-stat__label">Issuance Price</span>
                  <span className="td-stat__value">{token.issuancePrice}</span>
                </div>
                <div className="td-stat">
                  <span className="td-stat__label">Min. Investment</span>
                  <span className="td-stat__value">{token.minInvestment}</span>
                </div>
                <div className="td-stat">
                  <span className="td-stat__label">Max. Investment</span>
                  <span className="td-stat__value">{token.maxInvestment}</span>
                </div>
                <div className="td-stat">
                  <span className="td-stat__label">Lock-in Period</span>
                  <span className="td-stat__value">{token.lockPeriod}</span>
                </div>
                <div className="td-stat">
                  <span className="td-stat__label">Total Supply</span>
                  <span className="td-stat__value">{token.totalSupply}</span>
                </div>
                <div className="td-stat">
                  <span className="td-stat__label">Blockchain</span>
                  <span className="td-stat__value">{token.blockchain} ({token.tokenStandard})</span>
                </div>
              </div>

              {/* Access CTA */}
              <div className="td-hero__actions">
                {token.accessType === 'OPEN' && (
                  <button className="action-btn td-cta-primary" onClick={() => scrollTo('td-final-cta')}>
                    <span>Invest Now</span>
                  </button>
                )}
                {token.accessType === 'INVITE_ONLY' && (
                  <button className="action-btn td-cta-primary" onClick={() => scrollTo('td-final-cta')}>
                    <span>Enter Access Code</span>
                  </button>
                )}
                {token.accessType === 'CLOSED' && (
                  <button className="action-btn td-cta-disabled" disabled>
                    <span>Coming Soon</span>
                  </button>
                )}
                <button className="action-btn banner-cta-secondary" onClick={() => scrollTo('td-docs')}>
                  <span>View Documents</span>
                </button>
              </div>

              {/* Section nav */}
              <div className="td-section-nav">
                <button onClick={() => scrollTo('td-founder')}>Founder</button>
                <button onClick={() => scrollTo('td-structure')}>Token Structure</button>
                <button onClick={() => scrollTo('td-docs')}>Documents</button>
                <button onClick={() => scrollTo('td-faq')}>FAQ</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ B – Founder & Company ══════ */}
      {token.founderName && (
        <section className="td-section" id="td-founder">
          <div className="container big">
            <div className="block-text center">
              <h6 className="sub-heading"><span>Founder & Company</span></h6>
              <h3 className="heading font-heading text-white">About {token.founderName}</h3>
            </div>
            <div className="td-founder-grid" style={{ marginTop: '40px' }}>
              <div className="td-founder-card">
                <div className="td-founder-card__icon">
                  <img src={token.logo || token.ownerImg} alt={token.founderName} />
                </div>
                <h4 className="td-founder-card__name">{token.founderName}</h4>
                <p className="td-founder-card__bio">{token.founderBio}</p>
              </div>
              <div className="td-founder-card td-founder-card--mission">
                <div className="td-founder-card__icon td-founder-card__icon--mission">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#DEC7FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h4 className="td-founder-card__name">Company Mission</h4>
                <p className="td-founder-card__bio">{token.companyMission}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════ C – Token Structure & Economics ══════ */}
      {token.tokenStructure && (
        <section className="td-section td-section--alt" id="td-structure">
          <div className="container big">
            <div className="block-text center">
              <h6 className="sub-heading"><span>Token Structure</span></h6>
              <h3 className="heading font-heading text-white">Economics & Transparency</h3>
            </div>

            <div className="td-structure-grid" style={{ marginTop: '40px' }}>
              {/* Info cards */}
              <div className="td-structure-cards">
                <div className="td-info-card">
                  <h5 className="td-info-card__title">What the Token Represents</h5>
                  <p className="td-info-card__text">{token.tokenStructure.whatItRepresents}</p>
                </div>
                <div className="td-info-card">
                  <h5 className="td-info-card__title">Custodial Wallet</h5>
                  <p className="td-info-card__text">{token.tokenStructure.custodialWallet}</p>
                </div>
                <div className="td-info-card">
                  <h5 className="td-info-card__title">Minting Process</h5>
                  <p className="td-info-card__text">{token.tokenStructure.mintingProcess}</p>
                </div>
                <div className="td-info-card td-info-card--highlight">
                  <h5 className="td-info-card__title">Issuance Pricing</h5>
                  <p className="td-info-card__text">
                    Fixed issuance price: <strong>{token.issuancePrice}</strong> per token.
                    <br />
                    Example: A <strong>{token.minInvestment}</strong> investment = <strong>{token.minInvestment && token.issuancePrice
                      ? (parseFloat(token.minInvestment.replace(/[^0-9.]/g, '')) / parseFloat(token.issuancePrice.replace(/[^0-9.]/g, ''))).toLocaleString()
                      : '—'}</strong> tokens.
                    <br />
                    <em>This is not a market price. Tokens are non-tradable.</em>
                  </p>
                </div>
              </div>

              {/* Allocation chart */}
              {token.tokenStructure.allocationBreakdown && (
                <div className="td-allocation">
                  <h5 className="td-allocation__title">Allocation Breakdown</h5>
                  <div className="td-allocation__bars">
                    {token.tokenStructure.allocationBreakdown.map((a, i) => (
                      <div key={i} className="td-alloc-row">
                        <div className="td-alloc-row__label">
                          <span>{a.label}</span>
                          <span className="td-alloc-row__pct">{a.pct}%</span>
                        </div>
                        <div className="td-alloc-row__track">
                          <div className="td-alloc-row__fill" style={{ width: `${a.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════ D – Documentation ══════ */}
      {token.documents && token.documents.length > 0 && (
        <section className="td-section" id="td-docs">
          <div className="container big">
            <div className="block-text center">
              <h6 className="sub-heading"><span>Documentation</span></h6>
              <h3 className="heading font-heading text-white">Legal & Technical Documents</h3>
            </div>

            <div className="td-docs-grid" style={{ marginTop: '40px' }}>
              {Object.entries(docGroups).map(([cat, docs]) => (
                <div key={cat} className="td-doc-group">
                  <h5 className="td-doc-group__cat">{cat}</h5>
                  <ul className="td-doc-group__list">
                    {docs.map((d, i) => (
                      <li key={i}>
                        <a href={d.url} target="_blank" rel="noopener noreferrer" className="td-doc-link">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{d.name}</span>
                          <svg className="td-doc-link__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ E – FAQ ══════ */}
      {token.faqs && token.faqs.length > 0 && (
        <section className="td-section td-section--alt" id="td-faq">
          <div className="container big">
            <div className="block-text center">
              <h6 className="sub-heading"><span>Frequently Asked Questions</span></h6>
              <h3 className="heading font-heading text-white">FAQ</h3>
            </div>
            <div className="td-faq-list" style={{ marginTop: '40px' }}>
              {token.faqs.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ F – Final CTA Block ══════ */}
      <section className="td-section td-final-cta-section" id="td-final-cta">
        <div className="container big" style={{textAlign:'center'}}>
          <div className="td-final-cta-box">
            <h3 className="heading font-heading text-white mb-4">Ready to Invest in {token.title.split('—')[0].trim()}?</h3>
            <p className="td-final-cta-box__desc">
              {isLive
                ? 'Complete your profile, finish KYC verification, and start your investment journey today.'
                : 'This offering is not yet open. Join the waitlist to get notified when it launches.'}
            </p>
            <div className="td-final-cta-box__actions">
              {isLive ? (
                <>
                  <Link to="/onboarding" className="action-btn td-cta-primary">
                    <span>Create Profile & Start KYC</span>
                  </Link>
                  <Link to="/contact" className="action-btn banner-cta-secondary">
                    <span>Contact Us</span>
                  </Link>
                </>
              ) : (
                <button className="action-btn td-cta-disabled" disabled>
                  <span>Coming Soon</span>
                </button>
              )}
            </div>
            {isLive && (
              <p className="td-final-cta-box__note">
                By proceeding, you agree to our Terms of Service and acknowledge that this is a private placement offering. KYC/AML verification is mandatory.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
