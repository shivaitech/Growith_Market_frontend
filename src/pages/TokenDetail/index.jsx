import { useParams, Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import { tokenOfferings } from '../../data'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination as SwiperPagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function ReelVideo({ src }) {
  const videoRef = useRef(null)
  const [paused, setPaused] = useState(true)

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        preload="metadata"
        loop={false}
        autoPlay={false}
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        onContextMenu={e => e.preventDefault()}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onEnded={() => setPaused(true)}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 4, background: '#000' }}
      />
      {paused && (
        <button
          type="button"
          aria-label="Play video"
          onClick={() => videoRef.current?.play()}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(92,39,254,0.92)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 6, padding: 0,
            boxShadow: '0 8px 32px rgba(92,39,254,0.55)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(92,39,254,0.7)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(92,39,254,0.55)' }}
        >
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <path d="M18 14l16 10-16 10V14z" fill="#fff"/>
          </svg>
        </button>
      )}
    </>
  )
}

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

const INFO_CARD_ICONS = [
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9D6FFF" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#9D6FFF" strokeWidth="1.8"/><path d="M12 6v6l4 2" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
]

export default function TokenDetail() {
  const { slug } = useParams()
  const token = tokenOfferings.find((t) => t.slug === slug)

  const docGroups = (token?.documents || []).reduce((acc, d) => {
    ;(acc[d.category] = acc[d.category] || []).push(d)
    return acc
  }, {})
  const docCategories = Object.keys(docGroups)
  const [docTab, setDocTab] = useState(0)

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
  const activeDocCat = docCategories[docTab] || ''
  const [voiceAIExpanded, setVoiceAIExpanded] = useState(false)
  const [imgHovered, setImgHovered] = useState(false)
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false)

  return (
    <>
      {/* ══════ A – Hero ══════ */}
      <section className="td-hero">
        <div className="td-hero__bg" />
        <div className="container big" style={{position:'relative',zIndex:10}}>
          <nav className="td-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/nft">Marketplace</Link>
            <span>/</span>
            <span className="td-breadcrumb--active">{token.name || token.ticker || 'Token'}</span>
          </nav>

          <div className="td-hero__grid">
            {/* Left — image slider */}
            <div className="td-hero__image-wrap" onMouseEnter={() => setImgHovered(true)} onMouseLeave={() => setImgHovered(false)}>
              {token.images && token.images.length > 1 ? (
                <Swiper
                  modules={[SwiperPagination, Autoplay]}
                  pagination={{ clickable: true, el: '.td-hero-swiper-pagination' }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  loop
                  grabCursor
                  className="td-hero-swiper"
                >
                  {token.images.map((src, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={src}
                        alt={`${token.title} ${i + 1}`}
                        className="td-hero__image"
                        onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.15)'; e.target.src = '' }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img
                  src={token.image}
                  alt={token.title}
                  className="td-hero__image"
                  onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.15)'; e.target.style.minHeight = '340px'; e.target.src = '' }}
                />
              )}
              <div className="td-hero-swiper-pagination" />
              <span className={`td-hero__badge ${isLive ? 'td-hero__badge--live' : ''}`}>
                {isLive ? '● LIVE' : token.bid}
              </span>
              {token.websiteUrl && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 30,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(7,10,41,0.5)',
                  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: '20px',
                  opacity: imgHovered ? 1 : 0,
                  pointerEvents: imgHovered ? 'auto' : 'none',
                  transition: 'opacity 0.3s ease',
                }}>
                  <a
                    href={token.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '9px',
                      padding: '13px 28px', borderRadius: '100px',
                      fontSize: '14px', fontWeight: '700', color: '#fff',
                      background: 'linear-gradient(135deg, rgba(92,39,254,0.9), rgba(123,69,254,0.9))',
                      border: '1px solid rgba(157,111,255,0.5)',
                      textDecoration: 'none',
                      boxShadow: '0 4px 24px rgba(92,39,254,0.5)',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    Visit {token.websiteLabel || token.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Right — details */}
            <div className="td-hero__info">
              <div className="td-hero__issuer">
                <img src={token.logo || token.ownerImg} alt={token.owner} className="td-hero__issuer-img" />
                <span>
                  <strong style={{ color: '#fff', fontWeight: 700, marginRight: 8 }}>{token.name}</strong>
                  <span style={{ opacity: 0.7 }}>· {token.owner}</span>
                </span>
              </div>
              {token.websiteUrl && (
                <a
                  href={token.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '7px 16px', borderRadius: '100px',
                    fontSize: '13px', fontWeight: '600', color: '#DEC7FF',
                    background: 'rgba(157,111,255,0.1)',
                    border: '1px solid rgba(157,111,255,0.35)',
                    textDecoration: 'none', marginBottom: '16px',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(157,111,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(157,111,255,0.6)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(157,111,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(157,111,255,0.35)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Visit {token.websiteLabel || token.websiteUrl.replace(/^https?:\/\//, '')}
                </a>
              )}
              <h1 className="td-hero__title">{token.title}</h1>
              <p className="td-hero__desc">{token.shortDescription}</p>

              {/* Price overview — launch date, issuance price → current price */}
              {(token.issuancePrice || token.currentPrice) && (
                <div className="td-price-overview">
                  <div className="td-price-overview__row">
                    {token.priceHistory?.[0]?.date && (
                      <div className="td-price-overview__item">
                        <span className="td-price-overview__label">Launch Date</span>
                        <span className="td-price-overview__value">
                          {new Date(token.priceHistory[0].date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                    <div className="td-price-overview__item">
                      <span className="td-price-overview__label">Issuance Price</span>
                      <span className="td-price-overview__value td-price-overview__value--dull">{token.issuancePrice}</span>
                    </div>
                    <svg className="td-price-overview__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                    <div className="td-price-overview__item td-price-overview__item--current">
                      <span className="td-price-overview__label">Current Price</span>
                      <span className="td-price-overview__value td-price-overview__value--current">{token.currentPrice || token.issuancePrice}</span>
                      {token.priceHistory?.length > 0 && (
                        <span className="td-price-overview__updated">
                          Updated {new Date(token.priceHistory[token.priceHistory.length - 1].date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    {token.priceHistory && token.priceHistory.length > 0 && (
                      <button type="button" className="td-price-history-btn" onClick={() => setPriceHistoryOpen(true)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        History
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Key stats */}
              <div className="td-stats-grid">
                {[
                  {
                    label: 'Min. Investment', value: token.minInvestment,
                    icon: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>,
                  },
                  {
                    label: 'Max. Investment', value: token.maxInvestment,
                    icon: <><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
                  },
                  {
                    label: 'Total Supply', value: token.totalSupply,
                    icon: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></>,
                  },
                  {
                    label: 'Blockchain', value: `${token.blockchain} (${token.tokenStandard})`,
                    icon: <><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z"/><path d="M12 11l8-4.5M12 11v9M12 11L4 6.5"/></>,
                  },
                ].map(s => (
                  <div key={s.label} className="td-stat">
                    <svg className="td-stat__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {s.icon}
                    </svg>
                    <span className="td-stat__label">{s.label}</span>
                    <span className="td-stat__value">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
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

              {/* Section quick-nav pills */}
              <div className="td-section-nav">
                {[
                  { label: 'Founder',        id: 'td-founder' },
                  { label: 'Token Structure',id: 'td-structure' },
                  { label: 'FAQ',            id: 'td-faq' },
                ].map(n => (
                  <button key={n.id} className="td-nav-pill" onClick={() => scrollTo(n.id)}>
                    {n.label}
                  </button>
                ))}
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
            <div className="td-founder-grid" style={{ marginTop: '36px' }}>
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

      {/* ══════ B2 – Direct From The Founders ══════ */}
      {token.founderVideos && token.founderVideos.length > 0 && (
        <section className="td-section td-founders-section" id="td-founders">
          <div className="container big">
            <div className="block-text center" style={{ marginBottom: 40 }}>
              <h6 className="sub-heading"><span>Founder Communications</span></h6>
              <h3 className="heading">Direct From The Founders</h3>
              <p>Direct updates, strategic insights, and ecosystem developments from the team building ShivAI.</p>
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
                        {v.video ? (
                          <ReelVideo src={v.video} />
                        ) : (
                          <>
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
                          </>
                        )}
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

      {/* ══════ B3 – Why Voice AI? (ShivAI only) ══════ */}
      {token.slug === 'shivai' && (
        <section className="td-section td-section--alt td-voiceai-section" id="td-voiceai">
          <div className="container big">
            <div className="block-text center" style={{ marginBottom: 40 }}>
              <h6 className="sub-heading"><span>Market Opportunity</span></h6>
              <h3 className="heading">Why Voice AI?</h3>
            </div>

            {/* Big stat cards row */}
            <div className="td-voiceai-stats">
              {[
                { num: '+1M',   label: 'Conversations Powered' },
                { num: '+100',  label: 'Industries Usable' },
                { num: '↓60%',  label: 'Cost Reduction Potential' },
                { num: '+56',   label: 'Languages Ready' },
              ].map(s => (
                <div key={s.label} className="td-voiceai-stat">
                  <span className="td-voiceai-stat__num">{s.num}</span>
                  <span className="td-voiceai-stat__label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Read More toggle */}
            <div className="td-voiceai-readmore">
              <button className="td-voiceai-toggle" onClick={() => setVoiceAIExpanded(v => !v)}>
                {voiceAIExpanded ? 'Show Less' : 'Read More'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{transform: voiceAIExpanded ? 'rotate(180deg)' : 'none', transition:'transform 0.2s'}}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className={`td-voiceai-body ${voiceAIExpanded ? 'td-voiceai-body--open' : ''}`}>
                <p className="td-voiceai-lead">
                  Businesses worldwide are rapidly adopting AI-driven communication systems to reduce operational costs, improve response times, and scale customer engagement without increasing headcount.
                </p>
                <p className="td-voiceai-sub">Voice AI adoption is accelerating across industries:</p>
                <div className="td-voiceai-tags">
                  {['Customer Support','Sales & Lead Qualification','Appointment & Service Booking','Grievance Resolution','Service Requests & Ticketing','Collections & Payment Reminders','Inbound & Outbound Call Operations'].map(item => (
                    <span key={item} className="td-voiceai-tag">{item}</span>
                  ))}
                </div>
                <div className="td-voiceai-callout">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                    <circle cx="12" cy="12" r="10" stroke="#9D6FFF" strokeWidth="1.8"/>
                    <path d="M12 8v4l3 3" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <p>ShivAI is positioned within this shift — building scalable AI voice infrastructure for businesses seeking automation without increasing manpower costs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════ B3 – Token Representation (ShivAI only) ══════ */}
      {token.slug === 'shivai' && (
        <section className="td-section td-tokenrep-section" id="td-tokenrep">
          <div className="container big">
            {/* Header */}
            <div className="block-text center td-tokenrep-top">
              <h6 className="sub-heading"><span>Digital Asset</span></h6>
              <h3 className="heading">Token Representation</h3>
              <p className="td-tokenrep-intro">Security-backed digital assets aligned with long-term platform growth — each token reflects a fractional participation interest in the ShivAI ecosystem.</p>
            </div>

            {/* 4 Pillar Cards */}
            <div className="td-tokenrep-pillars">
              {[
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9D6FFF" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="#9D6FFF" strokeWidth="1.8"/></svg>,
                  title: 'Digital Ownership Transparency',
                  desc: 'Full on-chain visibility into token ownership and transaction history.',
                  accent: '#9D6FFF',
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#5C27FE" strokeWidth="1.8"/><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 1 4 0" stroke="#5C27FE" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 12v4M10 14h4" stroke="#5C27FE" strokeWidth="1.8" strokeLinecap="round"/></svg>,
                  title: 'Blockchain-Based Issuance',
                  desc: 'Issued on regulated blockchain infrastructure with immutable audit trails.',
                  accent: '#5C27FE',
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#DEC7FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#DEC7FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                  title: 'Regulated Participation Access',
                  desc: 'Compliant with applicable securities frameworks for qualified investors.',
                  accent: '#DEC7FF',
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 7 22 7 22 13" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                  title: 'Long-Term Ecosystem Alignment',
                  desc: "Token value tied directly to ShivAI's commercial growth and expansion.",
                  accent: '#9D6FFF',
                },
              ].map(item => (
                <div key={item.title} className="td-tokenrep-pillar">
                  <div className="td-tokenrep-pillar__icon" style={{'--accent': item.accent}}>{item.icon}</div>
                  <strong className="td-tokenrep-pillar__title">{item.title}</strong>
                  <p className="td-tokenrep-pillar__desc">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Use of Funds */}
            <div className="td-tokenrep-funds-section">
              <div className="td-tokenrep-funds-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Use of Funds</span>
                <p>Funds raised through the offering are expected to support:</p>
              </div>
              <div className="td-tokenrep-funds-grid">
                {['AI Infrastructure Expansion','Product Development','Enterprise Onboarding','International Market Expansion','Sales & Distribution Growth','Strategic Partnerships','Operational Scaling','Technology & Security'].map((item, i) => (
                  <div key={item} className="td-tokenrep-fund-card">
                    <span className="td-tokenrep-fund-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="td-tokenrep-fund-name">{item}</span>
                  </div>
                ))}
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

            <div className="td-structure-grid" style={{ marginTop: '36px' }}>
              {/* Icon info cards */}
              <div className="td-structure-cards">
                {[
                  { title: 'What the Token Represents', text: token.tokenStructure.whatItRepresents },
                  { title: 'Custodial Wallet',          text: token.tokenStructure.custodialWallet },
                  { title: 'Minting Process',           text: token.tokenStructure.mintingProcess },
                  {
                    title: 'Issuance Pricing',
                    text: `Fixed issuance price: ${token.issuancePrice} per token. A ${token.minInvestment} investment = ${
                      token.minInvestment && token.issuancePrice
                        ? (parseFloat(token.minInvestment.replace(/[^0-9.]/g, '')) / parseFloat(token.issuancePrice.replace(/[^0-9.]/g, ''))).toLocaleString()
                        : '—'
                    } tokens.`,
                    highlight: true,
                  },
                ].map((card, i) => (
                  <div key={card.title} className={`td-info-card ${card.highlight ? 'td-info-card--highlight' : ''}`}>
                    <div className="td-info-card__icon">{INFO_CARD_ICONS[i]}</div>
                    <h5 className="td-info-card__title">{card.title}</h5>
                    <p className="td-info-card__text">{card.text}</p>
                  </div>
                ))}
              </div>

              {/* Allocation chart (sticky inside a stretching wrapper) */}
              {token.tokenStructure.allocationBreakdown && (
                <div className="td-allocation-wrap">
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

            {/* Category tabs */}
            <div className="td-doc-tabs">
              {docCategories.map((cat, i) => (
                <button
                  key={cat}
                  className={`td-doc-tab ${docTab === i ? 'td-doc-tab--active' : ''}`}
                  onClick={() => setDocTab(i)}
                >
                  {cat}
                  <span className="td-doc-tab__count">{docGroups[cat].length}</span>
                </button>
              ))}
            </div>

            {/* Doc cards */}
            <div className="td-docs-grid">
              {(docGroups[activeDocCat] || []).map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="td-doc-card">
                  <div className="td-doc-card__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#9D6FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#9D6FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="td-doc-card__body">
                    <span className="td-doc-card__name">{d.name}</span>
                    <span className="td-doc-card__cat">{d.category}</span>
                  </div>
                  <svg className="td-doc-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
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
            <div className="td-faq-list" style={{ marginTop: '36px' }}>
              {token.faqs.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ F – Final CTA ══════ */}
      <section className="td-section td-final-cta-section" id="td-final-cta">
        <div className="container big" style={{textAlign:'center'}}>
          <div className="td-final-cta-box">
            <h3 className="heading font-heading text-white mb-2">Ready to Participate in This Offering?</h3>
            <h5 className="font-heading mb-4" style={{ display:'inline-block', color:'#fff', fontSize:'1rem', fontWeight:400, border:'1px dotted rgba(255,255,255,0.5)', borderRadius:'8px', padding:'6px 16px' }}>
              {token.name || token.title.split('—')[0].trim()}
            </h5>
            <p className="td-final-cta-box__desc">
              {isLive
                ? 'Complete your investor profile and KYC verification to access this private placement offering.'
                : 'This offering is not yet open. Register your interest to be notified when participation opens.'}
            </p>
            <div className="td-final-cta-box__actions">
              {isLive ? (
                <>
                  <Link to="/onboarding" className="action-btn td-cta-primary"><span>Begin Investor Verification</span></Link>
                  <Link to="/contact" className="action-btn banner-cta-secondary"><span>Contact Us</span></Link>
                </>
              ) : (
                <button className="action-btn td-cta-disabled" disabled><span>Coming Soon</span></button>
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

      {/* ══════ Price History Modal ══════ */}
      {priceHistoryOpen && token.priceHistory && (
        <div className="td-price-modal-overlay" onClick={() => setPriceHistoryOpen(false)}>
          <div className="td-price-modal" onClick={e => e.stopPropagation()}>
            <div className="td-price-modal__header">
              <div>
                <h3 className="td-price-modal__title">Price History</h3>
                <p className="td-price-modal__sub">{token.name || token.title} · {token.ticker || ''}</p>
              </div>
              <button type="button" className="td-price-modal__close" onClick={() => setPriceHistoryOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="td-price-modal__body">
              {[...token.priceHistory]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((entry, i, arr) => {
                  const isLatest = i === 0
                  const prev = arr[i + 1]
                  const parsePrice = v => parseFloat(String(v).replace(/[^0-9.]/g, ''))
                  const delta = prev ? parsePrice(entry.price) - parsePrice(prev.price) : null
                  return (
                    <div key={entry.date + entry.price} className={`td-price-entry${isLatest ? ' td-price-entry--latest' : ''}`}>
                      <div className="td-price-entry__date">
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {isLatest && <span className="td-price-entry__badge">Current</span>}
                      </div>
                      <div className="td-price-entry__row">
                        <span className="td-price-entry__price">{entry.price}</span>
                        {delta != null && (
                          <span className={`td-price-entry__delta ${delta >= 0 ? 'td-price-entry__delta--up' : 'td-price-entry__delta--down'}`}>
                            {delta >= 0 ? '▲' : '▼'} {delta >= 0 ? '+' : ''}${Math.abs(delta).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}
                          </span>
                        )}
                      </div>
                      {entry.note && <p className="td-price-entry__note">{entry.note}</p>}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
