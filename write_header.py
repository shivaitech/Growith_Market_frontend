content = """import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const [isSmall, setIsSmall] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setIsSmall(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      id="header_main"
      className={`header is-fixed${isSmall ? ' is-small' : ''}`}
    >
      <div className="container big">
        <div className="row">
          <div className="col-12">
            <div className="header__body">
              <div className="header__logo">
                <Link to="/">
                  <img
                    id="site-logo"
                    src="/assets/images/logo/logo.png"
                    alt="Growith"
                    width="160"
                    height="38"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </Link>
              </div>
              <div className="header__right">
                <nav id="main-nav" className="main-nav">
                  <ul id="menu-primary-menu" className="menu">
                    <li className={`menu-item menu-item-has-children${pathname === '/' ? ' menu-current-item' : ''}`}>
                      <Link to="/">Home</Link>
                      <ul className="sub-menu">
                        <li className="menu-item"><Link to="/">Home v1</Link></li>
                      </ul>
                    </li>
                    <li className="menu-item menu-item-has-children">
                      <Link to="/nft">Explore</Link>
                      <ul className="sub-menu">
                        <li className="menu-item"><Link to="/nft">Marketplace</Link></li>
                        <li className="menu-item"><Link to="/blog">Blog</Link></li>
                      </ul>
                    </li>
                    <li className={`menu-item${pathname === '/about' ? ' menu-current-item' : ''}`}>
                      <Link to="/about">About</Link>
                    </li>
                    <li className={`menu-item${pathname === '/roadmap' ? ' menu-current-item' : ''}`}>
                      <Link to="/roadmap">RoadMap</Link>
                    </li>
                    <li className={`menu-item${pathname === '/team' ? ' menu-current-item' : ''}`}>
                      <Link to="/team">Team</Link>
                    </li>
                    <li className={`menu-item${pathname === '/contact' ? ' menu-current-item' : ''}`}>
                      <Link to="/contact">Contact</Link>
                    </li>
                  </ul>
                </nav>
                <div
                  className={`mobile-button${mobileOpen ? ' active' : ''}`}
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  <span></span>
                </div>
              </div>
              <div className="header__action">
                <a href="#" className="search-btn">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9.7659" cy="9.76639" r="8.98856" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.0176 16.4849L19.5416 19.9997" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <Link to="/contact" className="action-btn"><span>Join Now</span></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="main-nav-mobi" className={mobileOpen ? 'open' : ''}>
        <ul>
          <li><Link to="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
          <li><Link to="/nft" onClick={() => setMobileOpen(false)}>Marketplace</Link></li>
          <li><Link to="/about" onClick={() => setMobileOpen(false)}>About</Link></li>
          <li><Link to="/roadmap" onClick={() => setMobileOpen(false)}>RoadMap</Link></li>
          <li><Link to="/team" onClick={() => setMobileOpen(false)}>Team</Link></li>
          <li><Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link></li>
        </ul>
      </div>
    </header>
  )
}
"""

with open(r'c:\Users\HP\Desktop\Growthit.io\MarketPlace\Growith\src\layouts\Header.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Header.jsx written successfully')
