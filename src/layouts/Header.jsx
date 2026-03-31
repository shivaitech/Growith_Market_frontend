import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <header id="header_main" className={`header${scrolled ? ' is-fixed is-small' : ''}`}>
      <div className="container big">
        <div className="row">
          <div className="col-12">
            <div className="header__body">
              <div className="header__logo">
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="header-logo-img" style={{ display: 'block', height: '48px', width: 'auto', maxWidth: '200px' }} />
                  <span className="logo-slogan" style={{
                    display: 'block', fontSize: '8px', letterSpacing: '0.18em',
                    color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '3px',
                  }}>Invest. Grow. Repeat.</span>
                </Link>
              </div>
              <div className="header__right">
                <nav id="main-nav" className="main-nav">
                  <ul id="menu-primary-menu" className="menu">
                    <li className={`menu-item${pathname === '/' ? ' menu-current-item' : ''}`}>
                      <Link to="/">Home</Link>
                    </li>
                    <li className={`menu-item menu-item--highlight${pathname === '/nft' ? ' menu-current-item' : ''}`}><Link to="/nft">Marketplace</Link></li>
                    <li className={`menu-item${pathname === '/blog' ? ' menu-current-item' : ''}`}><Link to="/blog">Blog</Link></li>
                    <li className={`menu-item${pathname === '/about' ? ' menu-current-item' : ''}`}><Link to="/about">About</Link></li>
                    <li className={`menu-item${pathname === '/contact' ? ' menu-current-item' : ''}`}><Link to="/contact">Contact</Link></li>
                  </ul>
                </nav>
                <div className={`mobile-button${mobileOpen ? ' active' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
                  <span></span>
                </div>
              </div>
              <div className="header__action">
                <Link to="/login" className="action-btn action-btn-secondary"><span>Sign In</span></Link>
                <Link to="/onboarding" className="action-btn"><span>Join Now</span></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile drawer — full panel style */}
      {mobileOpen && (
        <div className="mobi-drawer" onClick={e => e.target === e.currentTarget && setMobileOpen(false)}>
          <div className="mobi-drawer__panel">
            {/* Top bar */}
            <div className="mobi-drawer__top">
              <img src="/assets/images/growith_logo_transparent.png" alt="Growith" style={{ display: 'block', height: '40px', width: 'auto', maxWidth: '170px' }} />
              <button className="mobi-drawer__close" onClick={() => setMobileOpen(false)} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M1 1L17 17M17 1L1 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {/* Nav links */}
            <nav className="mobi-drawer__nav">
              <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/nft" onClick={() => setMobileOpen(false)}>Marketplace</Link>
              <Link to="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
            </nav>
            {/* CTA */}
            <div className="mobi-drawer__cta">
              <Link to="/login" className="mobi-drawer__btn mobi-drawer__btn-secondary" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/onboarding" className="mobi-drawer__btn" onClick={() => setMobileOpen(false)}>Join Now</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

