import { Link } from 'react-router-dom'

/* ── Orbital icon renderer ─────────────────────────────────────────────── */
function NodeIcon({ type }) {
  const s = { stroke: '#7b4fff', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (type === 'chart')
    return (
      <>
        <rect x="-7" y="-1"  width="3" height="5"  rx="0.5" fill="#7b4fff" />
        <rect x="-3" y="-5"  width="3" height="9"  rx="0.5" fill="#7b4fff" />
        <rect x="1"  y="-2"  width="3" height="6"  rx="0.5" fill="#7b4fff" />
        <rect x="5"  y="-7"  width="3" height="11" rx="0.5" fill="#7b4fff" />
        <line x1="-8" y1="5" x2="9" y2="5" {...s} strokeWidth="1.2" />
      </>
    )
  if (type === 'dollar')
    return <text x="0" y="5" textAnchor="middle" fill="#7b4fff" fontSize="15" fontFamily="Arial,sans-serif">$</text>
  if (type === 'menu')
    return (
      <>
        <line x1="-6" y1="-3.5" x2="6" y2="-3.5" {...s} />
        <line x1="-6" y1="0"    x2="6" y2="0"    {...s} />
        <line x1="-6" y1="3.5"  x2="6" y2="3.5"  {...s} />
      </>
    )
  if (type === 'person')
    return (
      <>
        <circle cx="0" cy="-3.5" r="3" {...s} />
        <path d="M-6.5 7c0-4 13-4 13 0" {...s} />
      </>
    )
  if (type === 'check')
    return (
      <>
        <rect x="-6" y="-5.5" width="12" height="11" rx="1.5" {...s} />
        <polyline points="-3,-0.5 -0.5,2.5 4.5,-2.5" {...s} />
      </>
    )
  if (type === 'diamond')
    return <polygon points="0,-7.5 7.5,0 0,7.5 -7.5,0" {...s} />
  if (type === 'wallet')
    return (
      <>
        <rect x="-7" y="-5" width="15" height="10" rx="1.5" {...s} />
        <circle cx="4" cy="0" r="2" fill="#7b4fff" stroke="none" />
      </>
    )
  if (type === 'globe')
    return (
      <>
        <circle  cx="0" cy="0" r="7"         {...s} />
        <ellipse cx="0" cy="0" rx="3.5" ry="7" {...s} strokeWidth="1.2" />
        <line x1="-7" y1="0" x2="7" y2="0"    {...s} strokeWidth="1.2" />
      </>
    )
  return null
}

/* ── Hex security visual ───────────────────────────────────────────────── */
function HexVisual() {
  const cx = 240, cy = 240
  const hexPts = (r) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
    }).join(' ')

  const nodes = [
    { deg: 143, type: 'chart'   },
    { deg: 100, type: 'dollar'  },
    { deg:  55, type: 'menu'    },
    { deg:   0, type: 'person'  },
    { deg: 315, type: 'check'   },
    { deg: 255, type: 'diamond' },
    { deg: 215, type: 'wallet'  },
    { deg: 183, type: 'globe'   },
  ].map(({ deg, type }) => {
    const rad = (deg * Math.PI) / 180
    return { type, x: cx + 162 * Math.cos(rad), y: cy - 162 * Math.sin(rad) }
  })

  return (
    <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '340px' }}>
      <defs>
        <radialGradient id="hbg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#5c27fe" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0a0b1e" stopOpacity="0"    />
        </radialGradient>
        <filter id="hglow">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r="225" fill="url(#hbg)" />
      {nodes.map(({ x, y }, i) => {
        const dx = x - cx, dy = y - cy
        const d  = Math.sqrt(dx * dx + dy * dy)
        return (
          <line key={i}
            x1={(cx + dx / d * 100).toFixed(1)}
            y1={(cy + dy / d * 100).toFixed(1)}
            x2={x.toFixed(1)} y2={y.toFixed(1)}
            stroke="#2d1d6e" strokeWidth="1"
          />
        )
      })}
      <polygon points={hexPts(104)} stroke="#5826fc" strokeWidth="1.2" fill="none" opacity="0.35" />
      <polygon points={hexPts(82)}  stroke="#7b4fff" strokeWidth="2.5" fill="#0d0e26" filter="url(#hglow)" />
      <rect x={cx - 14} y={cy - 1} width="28" height="19" rx="2.5"
        stroke="#d4c6ff" strokeWidth="1.8" fill="none" />
      <path d={`M${cx - 9},${cy - 1}V${cy - 9}a9,9,0,0,1,18,0V${cy - 1}`}
        stroke="#d4c6ff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx={cx} cy={cy + 8} r="2.5" fill="#d4c6ff" />
      {nodes.map(({ x, y, type }, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="26" fill="#0d0e26" stroke="#2c1c6a" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="26" fill="none"    stroke="#5826fc" strokeWidth="0.8" opacity="0.5" />
          <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
            <NodeIcon type={type} />
          </g>
        </g>
      ))}
    </svg>
  )
}

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="9 22 9 12 15 12 15 22" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'EU-Registered',
    text: 'Issued through an EU-registered entity',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'KYC/AML',
    text: 'Verified investors only',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="14 2 14 8 20 8" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Risk Disclosures',
    text: 'Fully documented',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'On-Chain',
    text: 'Minted on Polygon',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#9D6FFF" strokeWidth="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Custodial Wallets',
    text: 'Secure allocation',
  },
]

export default function About() {
  return (
    <section className="abt" id="about">
      <div className="container">
        {/* ── Header ── */}
        <div className="abt__header">
          <div className="block-text center">
            <h6 className="sub-heading"><span>About Growith</span></h6>
            <h3 className="heading">Private Capital Market Access</h3>
            <p>A regulated digital securities marketplace for asset-backed investment opportunities.</p>
          </div>
        </div>

        {/* ── Body: hex visual + text ── */}
        <div className="abt__body">
          <div className="abt__visual">
            <HexVisual />
          </div>
          <div className="abt__content">
            <p>Growith provides access to startups, real estate, structured projects, and media ventures &mdash; all issued through a compliant EU-registered entity.</p>
            <p>Our first live offering is <strong>ShivAI</strong>, a UAE-headquartered deep-tech AI SaaS company expanding across India, the Middle East, and Canada.</p>
            <span className="abt__divider" />
            <p className="abt__note">Growith is not a crypto trading platform. It is structured digital securities infrastructure for private capital markets.</p>
          </div>
        </div>

        {/* ── Feature cards strip ── */}
        <div className="abt__features">
          {features?.map((f, i) => (
            <div key={i} className="abt__fcard">
              <span className="abt__ficon">{f.icon}</span>
              <strong className="abt__flabel">{f.label}</strong>
              <span className="abt__ftext">{f.text}</span>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="abt__cta">
          <Link to="/about" className="action-btn"><span>More About Us</span></Link>
        </div>
      </div>
    </section>
  )
}

