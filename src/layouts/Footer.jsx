import { useState } from 'react'
import { Link } from 'react-router-dom'

const PUBLIC_API_ORIGIN = (() => {
  try { return new URL(import.meta.env.VITE_API_BASE_URL).origin } catch { return '' }
})()

const SLOGAN_PILLS = ['Discover', 'Own', 'Grow']

const FOOTER_CHIPS = ['Innovative Startups', 'High-Growth Projects', 'Digital Ownership']

const platformLinks = [
  { label: 'Home', path: '/' },
  { label: 'Opportunities', path: '/nft' },
  { label: 'Blog', path: '/blog' },
  { label: 'Our Story', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', path: '/legal/privacy' },
  { label: 'Terms of Use', path: '/legal/terms' },
  { label: 'Risk Disclosure', path: '/legal/risk' },
  { label: 'Cookie Policy', path: '/legal/cookies' },
  { label: 'KYC / AML', path: '/legal/kyc-aml' },
]

const socialIcons = [
  {
    label: 'Facebook',
    href: '#',
    svg: (
      <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
        <path d="M2.57969 9.03953C2.51969 9.03953 1.19969 9.03953 0.599688 9.03953C0.279688 9.03953 0.179688 8.91953 0.179688 8.61953C0.179688 7.81953 0.179688 6.99953 0.179688 6.19953C0.179688 5.87953 0.299688 5.77953 0.599688 5.77953H2.57969C2.57969 5.71953 2.57969 4.55953 2.57969 4.01953C2.57969 3.21953 2.71969 2.45953 3.11969 1.75953C3.53969 1.03953 4.13969 0.559531 4.89969 0.279531C5.39969 0.0995311 5.89969 0.0195312 6.43969 0.0195312H8.39969C8.67969 0.0195312 8.79969 0.139531 8.79969 0.419531V2.69953C8.79969 2.97953 8.67969 3.09953 8.39969 3.09953C7.85969 3.09953 7.31969 3.09953 6.77969 3.11953C6.23969 3.11953 5.95969 3.37953 5.95969 3.93953C5.93969 4.53953 5.95969 5.11953 5.95969 5.73953H8.27969C8.59969 5.73953 8.71969 5.85953 8.71969 6.17953V8.59953C8.71969 8.91953 8.61969 9.01953 8.27969 9.01953C7.55969 9.01953 6.01969 9.01953 5.95969 9.01953V15.5395C5.95969 15.8795 5.85969 15.9995 5.49969 15.9995C4.65969 15.9995 3.83969 15.9995 2.99969 15.9995C2.69969 15.9995 2.57969 15.8795 2.57969 15.5795C2.57969 13.4795 2.57969 9.09953 2.57969 9.03953Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: '#',
    svg: (
      <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
        <path d="M14.5 1.42062C13.9794 1.66154 13.4246 1.82123 12.8462 1.89877C13.4412 1.524 13.8954 0.935077 14.1089 0.225231C13.5541 0.574154 12.9416 0.820615 12.2889 0.958154C11.7621 0.366462 11.0114 0 10.1924 0C8.60337 0 7.32412 1.36062 7.32412 3.02862C7.32412 3.26862 7.34338 3.49938 7.39062 3.71908C5.0045 3.59631 2.89313 2.38985 1.47475 0.552C1.22712 1.00523 1.08188 1.524 1.08188 2.08246C1.08188 3.13108 1.59375 4.06062 2.35675 4.59877C1.89562 4.58954 1.44325 4.44831 1.06 4.22585C1.06 4.23508 1.06 4.24708 1.06 4.25908C1.06 5.73046 2.05487 6.95262 3.3595 7.23415C3.12587 7.30154 2.87125 7.33385 2.607 7.33385C2.42325 7.33385 2.23775 7.32277 2.06362 7.28215C2.4355 8.48123 3.49075 9.36277 4.7455 9.39138C3.769 10.1972 2.52912 10.6828 1.18688 10.6828C0.9515 10.6828 0.72575 10.6717 0.5 10.6412C1.77137 11.5062 3.27813 12 4.903 12C10.1845 12 13.072 7.38462 13.072 3.384C13.072 3.25015 13.0676 3.12092 13.0615 2.99262C13.6311 2.56615 14.1097 2.03354 14.5 1.42062Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    svg: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M14.0006 14V8.87249C14.0006 6.35249 13.4581 4.42749 10.5181 4.42749C9.10062 4.42749 8.15563 5.19749 7.77063 5.93249H7.73563V4.65499H4.95312V14H7.85813V9.36249C7.85813 8.13749 8.08563 6.96499 9.59063 6.96499C11.0781 6.96499 11.0956 8.34749 11.0956 9.43249V13.9825H14.0006V14Z" fill="white"/>
        <path d="M0.226562 4.65479H3.13156V13.9998H0.226562V4.65479Z" fill="white"/>
        <path d="M1.68 0C0.7525 0 0 0.7525 0 1.68C0 2.6075 0.7525 3.3775 1.68 3.3775C2.6075 3.3775 3.36 2.6075 3.36 1.68C3.36 0.7525 2.6075 0 1.68 0Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    svg: (
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
        <path d="M17.2347 1.9639C17.1458 1.22216 16.4468 0.510897 15.7154 0.415609C11.2555 -0.138536 6.7457 -0.138536 2.28731 0.415609C1.55533 0.51069 0.856308 1.22216 0.76739 1.9639C0.452537 4.68236 0.452537 7.31818 0.76739 10.036C0.856308 10.7778 1.55533 11.4897 2.28731 11.5843C6.7457 12.1384 11.2557 12.1384 15.7154 11.5843C16.4468 11.4898 17.1458 10.7778 17.2347 10.036C17.5496 7.31842 17.5496 4.68236 17.2347 1.9639ZM7.58931 8.82375V3.17703L11.8243 6.00049L7.58931 8.82375Z" fill="white"/>
      </svg>
    ),
  },
]

function FooterLinkColumn({ title, links, accordionId, openSection, onToggle }) {
  const isOpen = openSection === accordionId

  return (
    <>
      <div className="ft-grid__col ft-grid__col--desktop">
        <h6 className="ft-grid__col-title">{title}</h6>
        <ul className="ft-grid__links">
          {links.map((link) => (
            <li key={link.label}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={`ft-accordion ft-accordion--mobile${isOpen ? ' is-open' : ''}`}>
        <button
          type="button"
          className="ft-accordion__trigger"
          aria-expanded={isOpen}
          onClick={() => onToggle(isOpen ? null : accordionId)}
        >
          <span>{title}</span>
          <svg className="ft-accordion__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="ft-accordion__panel" hidden={!isOpen}>
          <ul className="ft-grid__links">
            {links.map((link) => (
              <li key={link.label}>
                <Link to={link.path} onClick={() => onToggle(null)}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [alreadySubscribed, setAlreadySubscribed] = useState(false)
  const [error, setError] = useState('')
  const [openSection, setOpenSection] = useState(null)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setError('')
    try {
      const res = await fetch(`${PUBLIC_API_ORIGIN}/api/v1/contact/mailing-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        let msg = `Request failed (${res.status})`
        try {
          const body = await res.json()
          msg = body?.message || body?.error || msg
        } catch { /* ignore parse error */ }
        // Treat "already subscribed" as an informational state, not an error
        if (/already.*subscribed|already.*exist/i.test(msg)) {
          setAlreadySubscribed(true)
          setEmail('')
          return
        }
        throw new Error(msg)
      }
      setSubscribed(true)
      setEmail('')
    } catch (err) {
      setError(err?.message || 'Could not subscribe. Please try again.')
      setTimeout(() => setError(''), 4000)
    }
  }

  return (
    <footer id="footer" className="footer footer--redesign">
      <div className="ft-glow ft-glow--left" aria-hidden="true" />
      <div className="ft-glow ft-glow--right" aria-hidden="true" />

      {/* Newsletter banner */}
      <div className="ft-newsletter">
        <div className="container">
          <div className="ft-newsletter__card">
            <div className="ft-newsletter__inner">
              <div className="ft-newsletter__text">
                <span className="ft-newsletter__badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor"/>
                  </svg>
                  Early access
                </span>
                <h4 className="ft-newsletter__heading">Be First to Discover What&apos;s Next</h4>
                <p className="ft-newsletter__sub">Receive updates on new opportunities, upcoming offerings and future-focused businesses.</p>
              </div>
              <form className="ft-newsletter__form" onSubmit={handleSubscribe}>
                <div className="ft-newsletter__input-wrap">
                  <svg className="ft-newsletter__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">
                  Get Early Access
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
              {error && <p className="ft-newsletter__error" role="alert">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container">
        <div className="ft-grid">
          {/* Brand column */}
          <div className="ft-grid__brand">
            <Link to="/" className="ft-grid__logo">
              <img src="/assets/images/growith_logo_transparent.png" alt="Growith" />
            </Link>
            <div className="ft-slogan-pills" aria-label="Discover. Own. Grow.">
              {SLOGAN_PILLS.map((pill) => (
                <span key={pill} className="ft-slogan-pill">{pill}</span>
              ))}
            </div>
            <p className="ft-grid__slogan ft-grid__slogan--desktop">DISCOVER. OWN. GROW.</p>
            <p className="ft-grid__desc ft-grid__desc--lead">
              Don&apos;t just watch the future being built. Own a part of it.
            </p>
            <p className="ft-grid__desc">
              Access innovative startups and high-growth projects through digital ownership and early participation opportunities.
            </p>

            <div className="ft-quick-links">
              <Link to="/nft" className="ft-quick-link">Opportunities</Link>
              <Link to="/about" className="ft-quick-link">Our Story</Link>
              <Link to="/contact" className="ft-quick-link">Contact</Link>
            </div>

            <ul className="ft-grid__social">
              {socialIcons.map((item) => (
                <li key={item.label}>
                  <a href={item.href} aria-label={item.label}>{item.svg}</a>
                </li>
              ))}
            </ul>
          </div>

          <FooterLinkColumn
            title="Platform"
            links={platformLinks}
            accordionId="platform"
            openSection={openSection}
            onToggle={setOpenSection}
          />

          <FooterLinkColumn
            title="Legal"
            links={legalLinks}
            accordionId="legal"
            openSection={openSection}
            onToggle={setOpenSection}
          />
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom-bar">
          <p className="ft-bottom-bar__copy">© {new Date().getFullYear()} Growith. All rights reserved.</p>
          <div className="ft-bottom-bar__micro">
            <p className="ft-bottom-bar__tagline">Building Access to Tomorrow&apos;s Businesses</p>
            <div className="ft-bottom-bar__chips">
              {FOOTER_CHIPS.map((chip) => (
                <span key={chip} className="ft-bottom-chip">{chip}</span>
              ))}
            </div>
            <p className="ft-bottom-bar__reg ft-bottom-bar__reg--desktop">Innovative Startups • High-Growth Projects • Digital Ownership</p>
          </div>
        </div>
      </div>
      {/* ── Success Modal ── */}
      {subscribed && (
        <div
          onClick={() => setSubscribed(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(7, 10, 41, 0.78)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            padding: 20,
            animation: 'ftSuccessFade 0.3s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 460, width: '100%',
              background: 'linear-gradient(160deg, rgba(20,16,50,0.96) 0%, rgba(30,18,70,0.96) 100%)',
              border: '1.5px solid rgba(157,111,255,0.35)',
              borderRadius: 20,
              padding: '40px 36px 32px',
              textAlign: 'center',
              boxShadow: '0 24px 80px rgba(92,39,254,0.35), 0 0 0 1px rgba(157,111,255,0.1)',
              position: 'relative',
              animation: 'ftSuccessSlide 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <button
              type="button"
              onClick={() => setSubscribed(false)}
              aria-label="Close"
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 18, lineHeight: 1,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            >×</button>

            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(157,111,255,0.22), rgba(92,39,254,0.08))',
              border: '1.5px solid rgba(157,111,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 22px',
              boxShadow: '0 0 32px rgba(157,111,255,0.3)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DEC7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4L12 14.01l-3-3"/>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              </svg>
            </div>

            <h3 style={{
              fontFamily: "'Conthrax', sans-serif",
              fontSize: 22, fontWeight: 800, color: '#fff',
              margin: '0 0 12px', letterSpacing: '0.01em',
            }}>
              You're on the List!
            </h3>
            <p style={{
              fontSize: 14, lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 8px',
            }}>
              Thanks for joining the Growith early access list. You'll be the first to hear about <strong style={{ color: '#DEC7FF' }}>upcoming offerings, market insights, and investor announcements</strong>.
            </p>
            <p style={{
              fontSize: 13, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.45)',
              margin: '0 0 26px',
            }}>
              Check your inbox shortly for a welcome email. Make sure to add us to your contacts so updates land safely.
            </p>

            <button
              type="button"
              onClick={() => setSubscribed(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '12px 32px',
                background: 'linear-gradient(135deg, #5C27FE, #7B45FE)',
                border: '1px solid rgba(157,111,255,0.5)',
                borderRadius: 100,
                color: '#fff',
                fontSize: 13, fontWeight: 700,
                fontFamily: "'Conthrax', sans-serif",
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(92,39,254,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(92,39,254,0.55)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(92,39,254,0.4)' }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ── Already Subscribed Info Modal ── */}
      {alreadySubscribed && (
        <div
          onClick={() => setAlreadySubscribed(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(7, 10, 41, 0.78)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            padding: 20,
            animation: 'ftSuccessFade 0.3s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 460, width: '100%',
              background: 'linear-gradient(160deg, rgba(20,16,50,0.96) 0%, rgba(30,18,70,0.96) 100%)',
              border: '1.5px solid rgba(245,158,11,0.35)',
              borderRadius: 20,
              padding: '40px 36px 32px',
              textAlign: 'center',
              boxShadow: '0 24px 80px rgba(245,158,11,0.18), 0 0 0 1px rgba(245,158,11,0.1)',
              position: 'relative',
              animation: 'ftSuccessSlide 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <button
              type="button"
              onClick={() => setAlreadySubscribed(false)}
              aria-label="Close"
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 18, lineHeight: 1,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            >×</button>

            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.22), rgba(245,158,11,0.06))',
              border: '1.5px solid rgba(245,158,11,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 22px',
              boxShadow: '0 0 32px rgba(245,158,11,0.25)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>

            <h3 style={{
              fontFamily: "'Conthrax', sans-serif",
              fontSize: 22, fontWeight: 800, color: '#fff',
              margin: '0 0 12px', letterSpacing: '0.01em',
            }}>
              You're Already Subscribed
            </h3>
            <p style={{
              fontSize: 14, lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 8px',
            }}>
              Good news — this email is already on our <strong style={{ color: '#FBBF24' }}>early access mailing list</strong>. You'll continue to receive updates about new offerings and market insights.
            </p>
            <p style={{
              fontSize: 13, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.45)',
              margin: '0 0 26px',
            }}>
              Not seeing our emails? Please check your spam folder, or contact us to update your preferences.
            </p>

            <button
              type="button"
              onClick={() => setAlreadySubscribed(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '12px 32px',
                background: 'linear-gradient(135deg, #5C27FE, #7B45FE)',
                border: '1px solid rgba(157,111,255,0.5)',
                borderRadius: 100,
                color: '#fff',
                fontSize: 13, fontWeight: 700,
                fontFamily: "'Conthrax', sans-serif",
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(92,39,254,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(92,39,254,0.55)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(92,39,254,0.4)' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ftSuccessFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ftSuccessSlide {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </footer>
  )
}
