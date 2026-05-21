import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { tokenOfferings } from '../../data'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
            <span className="td-breadcrumb--active">{token.name || token.ticker || 'Token'}</span>
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
              {token.detailDescription && <p className="td-hero__desc" style={{ marginTop: 10 }}>{token.detailDescription}</p>}

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
                    <span>Participate in Offering</span>
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

      {/* ══════ B2 – Why Voice AI? (ShivAI only) ══════ */}
      {token.slug === 'shivai' && (
        <section className="td-section td-voiceai-section" id="td-voiceai">
          <div className="container big">
            <div className="block-text center" style={{ marginBottom: 40 }}>
              <h6 className="sub-heading"><span>Market Opportunity</span></h6>
              <h3 className="heading">Why Voice AI?</h3>
            </div>
            <div className="td-voiceai-grid">
              <div className="td-voiceai-body">
                <p className="td-voiceai-lead">
                  Businesses worldwide are rapidly adopting AI-driven communication systems to reduce operational costs, improve response times, and scale customer engagement.
                </p>
                <p className="td-voiceai-sub">
                  Voice AI is emerging as one of the fastest-growing segments within the AI economy, with increasing adoption across:
                </p>
                <ul className="td-voiceai-list">
                  {['Customer Support','Sales','Healthcare','Hospitality','Logistics','Financial Services','Government Services'].map(item => (
                    <li key={item}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#9D6FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="td-voiceai-callout">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#9D6FFF" strokeWidth="1.8"/>
                    <path d="M12 8v4l3 3" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <p>ShivAI is positioned within this shift by building scalable AI voice infrastructure for businesses seeking automation without increasing manpower costs.</p>
                </div>
              </div>
              <div className="td-voiceai-stats">
                <div className="td-voiceai-stat">
                  <span className="td-voiceai-stat__num">7+</span>
                  <span className="td-voiceai-stat__label">Industries Served</span>
                </div>
                <div className="td-voiceai-stat">
                  <span className="td-voiceai-stat__num">24/7</span>
                  <span className="td-voiceai-stat__label">AI Agent Uptime</span>
                </div>
                <div className="td-voiceai-stat">
                  <span className="td-voiceai-stat__num">↓ 60%</span>
                  <span className="td-voiceai-stat__label">Cost Reduction Potential</span>
                </div>
                <div className="td-voiceai-stat">
                  <span className="td-voiceai-stat__num">∞</span>
                  <span className="td-voiceai-stat__label">Scalable Without Headcount</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════ B3 – Token Representation (ShivAI only) ══════ */}
      {token.slug === 'shivai' && (
        <section className="td-section td-section--alt td-tokenrep-section" id="td-tokenrep">
          <div className="container big">
            {/* Section header */}
            <div className="block-text center td-tokenrep-top">
              <h6 className="sub-heading"><span>Digital Asset</span></h6>
              <h3 className="heading">Token Representation</h3>
              <p className="td-tokenrep-intro">ShivAI tokens are security-backed digital assets representing a fractional participation interest within the ShivAI ecosystem, designed to align investor participation with long-term platform growth.</p>
            </div>

            <div className="td-tokenrep-grid">
              {/* Left: body text + 2×2 pillar cards */}
              <div className="td-tokenrep-body">
                <p className="td-tokenrep-text">As platform adoption, commercial activity, and ecosystem value grow, token holders participate in the broader value framework associated with the platform's development.</p>
                <h5 className="td-tokenrep-sub-heading">The structure combines:</h5>
                <div className="td-tokenrep-pillars">
                  {[
                    { title: 'Digital Ownership Transparency', desc: 'Full on-chain visibility into token ownership and transaction history.' },
                    { title: 'Blockchain-Based Issuance', desc: 'Issued on regulated blockchain infrastructure with immutable audit trails.' },
                    { title: 'Regulated Participation Access', desc: 'Compliant with applicable securities frameworks for qualified investors.' },
                    { title: 'Long-Term Ecosystem Alignment', desc: "Token value tied directly to ShivAI's commercial growth and expansion." },
                  ].map(item => (
                    <div key={item.title} className="td-tokenrep-pillar">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,marginTop:2}}>
                        <path d="M20 6L9 17l-5-5" stroke="#9D6FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div>
                        <strong className="td-tokenrep-pillar__title">{item.title}</strong>
                        <p className="td-tokenrep-pillar__desc">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Use of Funds */}
              <div className="td-tokenrep-funds">
                <div className="td-tokenrep-funds__card">
                  <div className="td-tokenrep-funds__header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Use of Funds</span>
                  </div>
                  <p className="td-tokenrep-funds__sub">Funds raised through the offering are expected to support:</p>
                  <ul className="td-tokenrep-funds__list">
                    {[
                      'AI Infrastructure Expansion',
                      'Product Development',
                      'Enterprise Onboarding',
                      'International Market Expansion',
                      'Sales & Distribution Growth',
                      'Strategic Partnerships',
                      'Operational Scaling',
                    ].map((item, i) => (
                      <li key={item}>
                        <span className="td-tokenrep-funds__num">{String(i + 1).padStart(2, '0')}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
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
                        {a.desc && <p className="td-alloc-row__desc">{a.desc}</p>}
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

      {/* ══════ E2 – Direct From The Founders ══════ */}
      {token.founderVideos && token.founderVideos.length > 0 && (
        <section className="td-section td-founders-section" id="td-founders">
          <div className="container big">
            <div className="block-text center" style={{ marginBottom: 40 }}>
              <h6 className="sub-heading"><span>Founder Communications</span></h6>
              <h3 className="heading">Direct From The Founders</h3>
              <p>Access direct updates, strategic insights, ecosystem developments, and founder communications from the team building ShivAI.</p>
            </div>

            <div className="td-founders-reel">
              <Swiper
                modules={[Navigation, SwiperPagination]}
                navigation={{ nextEl: '.td-reel-next', prevEl: '.td-reel-prev' }}
                pagination={{ clickable: true, el: '.td-reel-pagination' }}
                slidesPerView={1}
                spaceBetween={20}
                grabCursor
                breakpoints={{
                  640:  { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
              >
                {token.founderVideos.map((v, i) => (
                  <SwiperSlide key={i} className="td-reel-slide">
                    <div className="td-reel-card">
                      <div className="td-reel-card__thumb">
                        <div className="td-reel-card__play">
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="23" fill="rgba(92,39,254,0.9)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                            <path d="M20 17l14 7-14 7V17z" fill="#fff"/>
                          </svg>
                        </div>
                        <div className="td-reel-card__coming">
                          <span className="td-reel-card__dot" />
                          {v.duration}
                        </div>
                        <div className="td-reel-card__gradient" />
                      </div>
                      <div className="td-reel-card__body">
                        <span className="td-reel-card__tag">{v.tag}</span>
                        <h5 className="td-reel-card__title">{v.title}</h5>
                        <p className="td-reel-card__sub">{v.subtitle}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="td-reel-controls">
                <button className="td-reel-prev">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="td-reel-pagination" />
                <button className="td-reel-next">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════ F – Final CTA Block ══════ */}
      <section className="td-section td-final-cta-section" id="td-final-cta">
        <div className="container big" style={{textAlign:'center'}}>
          <div className="td-final-cta-box">
            <h3 className="heading font-heading text-white mb-2">Ready to Participate in This Offering?</h3>
            <h5 className="font-heading mb-4" style={{ display: 'inline-block', color: '#fff', fontSize: '1rem', fontWeight: 400, border: '1px dotted rgba(255,255,255,0.5)', borderRadius: '8px', padding: '6px 16px' }}>{token.name || token.title.split('—')[0].trim()}</h5>
            <p className="td-final-cta-box__desc">
              {isLive
                ? 'Complete your investor profile and KYC verification to access this private placement offering.'
                : 'This offering is not yet open. Register your interest to be notified when participation opens.'}
            </p>
            <div className="td-final-cta-box__actions">
              {isLive ? (
                <>
                  <Link to="/onboarding" className="action-btn td-cta-primary">
                    <span>Begin Investor Verification</span>
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
