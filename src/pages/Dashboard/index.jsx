import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

/* ── Mock investor data ─────────────────────────────────────── */
const INVESTOR = {
  name: 'Nicholas Ergemia',
  email: 'nicholas@ergemia.com',
  kycStatus: 'approved', // 'pending' | 'approved' | 'rejected' | 'under_review'
  walletAddress: '0x3f5C...B7a2',
  joinedDate: 'March 2026',
};

const HOLDINGS = [
  {
    id: 1,
    token: 'ShivAI',
    ticker: 'SHIV',
    logo: '/assets/images/icon/shivAiToken.png',
    image: '/assets/images/partner/HeroShivaAI.jpeg',
    amount: 250000,
    invested: 2500,
    currentValue: 2875,
    pnl: 375,
    pnlPct: 15,
    lockExpiry: 'March 2027',
    daysLeft: 365,
    status: 'locked',
    blockchain: 'Polygon',
    contract: '0x3f5C...B7a2',
  },
];

const TRANSACTIONS = [
  { id: 1, type: 'investment', token: 'ShivAI', amount: 2500, date: 'Mar 10, 2026', status: 'confirmed', hash: '0xabc1...f2d9', method: 'Bank Transfer' },
  { id: 2, type: 'kyc', token: '—', amount: null, date: 'Mar 8, 2026', status: 'approved', hash: '—', method: 'Sumsub KYC' },
  { id: 3, type: 'onboarding', token: '—', amount: null, date: 'Mar 8, 2026', status: 'completed', hash: '—', method: 'Growith Onboarding' },
];

const KYC_STEPS = [
  { id: 1, label: 'Personal Information', status: 'done', desc: 'Name, DOB, nationality submitted.' },
  { id: 2, label: 'Address Verification', status: 'done', desc: 'Residential address confirmed.' },
  { id: 3, label: 'Investment Profile', status: 'done', desc: 'Risk and experience assessed.' },
  { id: 4, label: 'Identity Documents', status: 'done', desc: 'Passport / National ID verified.' },
  { id: 5, label: 'AML & Sanctions Check', status: 'done', desc: 'No flags. Passed Sumsub screening.' },
  { id: 6, label: 'Terms & Agreements', status: 'done', desc: 'All agreements accepted.' },
];

const AVAILABLE_TOKENS = [
  {
    id: 1, slug: 'shivai', name: 'ShivAI Token', ticker: 'SHIV',
    logo: '/assets/images/icon/shivAiToken.png',
    image: '/assets/images/partner/HeroShivaAI.jpeg',
    price: '$0.01', minInvest: '$500', maxInvest: '$50,000',
    lock: '12 months', status: 'LIVE',
    desc: 'Next-generation AI compute infrastructure token. EU-registered private placement.',
  },
];

/* ── Icon helpers ───────────────────────────────────────────── */
const Icon = {
  overview: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  portfolio: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  invest: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  transactions: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  verification: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  arrow_up: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  external: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  lock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  menu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

/* ── KYC status helpers ─────────────────────────────────────── */
function KycBadge({ status }) {
  const map = {
    approved:     { label: 'KYC Approved',     color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)' },
    pending:      { label: 'KYC Pending',       color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
    under_review: { label: 'Under Review',      color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)' },
    rejected:     { label: 'KYC Rejected',      color: '#F87171', bg: 'rgba(248,113,113,0.12)',border: 'rgba(248,113,113,0.25)' },
  };
  const s = map[status] || map.pending;
  return (
    <span className="db-kyc-badge" style={{ color: s.color, background: s.bg, borderColor: s.border }}>
      {status === 'approved' && <Icon.check />}
      {s.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════
   TAB COMPONENTS
   ══════════════════════════════════════════════════ */

/* ── Overview ───────────────────────────────────── */
const HOLDINGS_PER_PAGE = 3;

function TabOverview({ investor }) {
  const total = HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
  const invested = HOLDINGS.reduce((s, h) => s + h.invested, 0);
  const pnl = total - invested;
  const pnlPct = ((pnl / invested) * 100).toFixed(1);
  const [holdingsPage, setHoldingsPage] = useState(1);
  const totalHoldingsPages = Math.ceil(HOLDINGS.length / HOLDINGS_PER_PAGE);
  const visibleHoldings = HOLDINGS.slice(0, holdingsPage * HOLDINGS_PER_PAGE);

  const statCards = [
    { label: 'Portfolio Value', value: `$${total.toLocaleString()}`, extra: <span className="db-stat-change db-stat-change--up"><Icon.arrow_up /> +{pnlPct}% all-time</span> },
    { label: 'Total Invested', value: `$${invested.toLocaleString()}`, extra: <span className="db-stat-sub">Across {HOLDINGS.length} token{HOLDINGS.length !== 1 ? 's' : ''}</span> },
    { label: 'Unrealized P&L', value: `+$${pnl.toLocaleString()}`, valueClass: 'db-stat-value--green', extra: <span className="db-stat-change db-stat-change--up"><Icon.arrow_up /> +{pnlPct}%</span> },
    { label: 'Wallet', value: investor.walletAddress, valueClass: 'db-stat-value--sm', extra: <span className="db-stat-sub">Custodial · Polygon</span> },
  ];

  return (
    <div className="db-tab-content">
      {/* Welcome bar */}
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Welcome back, {investor.name.split(' ')[0]} 👋</h1>
          <p className="db-muted">Here&apos;s your investment summary as of today.</p>
        </div>
        <KycBadge status={investor.kycStatus} />
      </div>

      {/* KYC status banner */}
      {investor.kycStatus === 'approved' && (
        <div className="db-alert db-alert--success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div>
            <strong>KYC Verified</strong> — Your identity has been successfully verified via Sumsub. You are now eligible to invest in all open offerings.
          </div>
        </div>
      )}

      {/* Stats — desktop grid, mobile swiper */}
      <div className="db-stats-grid db-stats-grid--desktop">
        {statCards.map((s, i) => (
          <div key={i} className="db-stat-card">
            <span className="db-stat-label">{s.label}</span>
            <span className={`db-stat-value ${s.valueClass || ''}`}>{s.value}</span>
            {s.extra}
          </div>
        ))}
      </div>

      <div className="db-stats-swiper--mobile">
        <Swiper
          modules={[SwiperPagination]}
          pagination={{ clickable: true }}
          spaceBetween={12}
          slidesPerView={1.15}
          centeredSlides={false}
        >
          {statCards.map((s, i) => (
            <SwiperSlide key={i}>
              <div className="db-stat-card">
                <span className="db-stat-label">{s.label}</span>
                <span className={`db-stat-value ${s.valueClass || ''}`}>{s.value}</span>
                {s.extra}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Holdings — rich cards like invest module */}
      <div className="db-section-title">Current Holdings</div>
      <div className="db-holdings-grid">
        {visibleHoldings.map(h => (
          <div key={h.id} className="db-hcard">
            <div className="db-hcard__image">
              <img src={h.image} alt={h.token} onError={e => { e.target.style.display='none'; }} />
              <span className={`db-hcard__badge db-hcard__badge--${h.status}`}>
                <Icon.lock /> {h.status === 'locked' ? 'Locked' : 'Unlocked'}
              </span>
            </div>
            <div className="db-hcard__body">
              <div className="db-hcard__header">
                <div className="db-hcard__logo">
                  <img src={h.logo} alt="" onError={e => { e.target.style.display='none'; }} />
                </div>
                <div>
                  <div className="db-hcard__name">{h.token} <span className="db-ticker">{h.ticker}</span></div>
                  <div className="db-hcard__chain">{h.blockchain} · {h.contract}</div>
                </div>
              </div>
              <div className="db-hcard__stats">
                <div className="db-hcard__stat">
                  <span>Tokens</span>
                  <strong>{h.amount.toLocaleString()}</strong>
                </div>
                <div className="db-hcard__stat">
                  <span>Value</span>
                  <strong>${h.currentValue.toLocaleString()}</strong>
                </div>
                <div className="db-hcard__stat">
                  <span>P&amp;L</span>
                  <strong className="db-green">+${h.pnl} (+{h.pnlPct}%)</strong>
                </div>
              </div>
              <div className="db-hcard__footer">
                <span className="db-hcard__lock-info">
                  <Icon.lock /> Lock expires {h.lockExpiry}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {HOLDINGS.length > HOLDINGS_PER_PAGE && (
        <div className="db-holdings-pagination">
          {holdingsPage * HOLDINGS_PER_PAGE < HOLDINGS.length ? (
            <button className="db-btn db-btn--secondary db-btn--sm" onClick={() => setHoldingsPage(p => p + 1)}>
              Show More ({HOLDINGS.length - visibleHoldings.length} remaining)
            </button>
          ) : (
            <button className="db-btn db-btn--secondary db-btn--sm" onClick={() => setHoldingsPage(1)}>
              Show Less
            </button>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="db-section-title">Quick Actions</div>
      <div className="db-quick-actions">
        <div className="db-qa-card">
          <div className="db-qa-icon" style={{ background: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.25)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
            </svg>
          </div>
          <div className="db-qa-text">
            <div className="db-qa-label">Invest More</div>
            <div className="db-qa-desc">Add to existing holdings or explore new offerings.</div>
          </div>
        </div>
        <div className="db-qa-card">
          <div className="db-qa-icon" style={{ background: 'rgba(96,165,250,0.12)', borderColor: 'rgba(96,165,250,0.25)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </div>
          <div className="db-qa-text">
            <div className="db-qa-label">View Documents</div>
            <div className="db-qa-desc">Access your subscription agreement and KYC records.</div>
          </div>
        </div>
        <div className="db-qa-card">
          <div className="db-qa-icon" style={{ background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.25)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="db-qa-text">
            <div className="db-qa-label">Lock Status</div>
            <div className="db-qa-desc">Track token lock expiry and transfer eligibility dates.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Portfolio ──────────────────────────────────── */
function TabPortfolio() {
  const total = HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">My Portfolio</h1>
          <p className="db-muted">Token holdings, allocation, and lock-period tracking.</p>
        </div>
      </div>

      {HOLDINGS.map(h => {
        const lockProgress = Math.max(0, Math.min(100, 100 - (h.daysLeft / 365) * 100));
        return (
          <div key={h.id} className="db-portfolio-card">
            {/* Header */}
            <div className="db-portfolio-card__header">
              <div className="db-portfolio-card__logo">
                <img src={h.logo} alt={h.token} onError={e => { e.target.style.display='none'; }} />
              </div>
              <div className="db-portfolio-card__title-block">
                <div className="db-portfolio-card__name">{h.token} <span className="db-ticker">{h.ticker}</span></div>
                <div className="db-portfolio-card__chain">{h.blockchain} · {h.contract}</div>
              </div>
              <span className="db-lock-badge"><Icon.lock /> {h.status === 'locked' ? 'Locked' : 'Unlocked'}</span>
            </div>

            {/* Stats */}
            <div className="db-portfolio-stat-row">
              <div className="db-p-stat">
                <span className="db-p-stat__label">Token Balance</span>
                <span className="db-p-stat__value">{h.amount.toLocaleString()} SHIV</span>
              </div>
              <div className="db-p-stat">
                <span className="db-p-stat__label">Invested</span>
                <span className="db-p-stat__value">${h.invested.toLocaleString()}</span>
              </div>
              <div className="db-p-stat">
                <span className="db-p-stat__label">Current Value</span>
                <span className="db-p-stat__value">${h.currentValue.toLocaleString()}</span>
              </div>
              <div className="db-p-stat">
                <span className="db-p-stat__label">Unrealized P&amp;L</span>
                <span className="db-p-stat__value db-green">+${h.pnl} (+{h.pnlPct}%)</span>
              </div>
            </div>

            {/* Lock period bar */}
            <div className="db-lock-section">
              <div className="db-lock-section__label">
                <span>Lock Period Progress</span>
                <span className="db-muted">{h.daysLeft} days remaining · Expires {h.lockExpiry}</span>
              </div>
              <div className="db-lock-track">
                <div className="db-lock-fill" style={{ width: `${lockProgress}%` }} />
              </div>
              <div className="db-lock-section__legend">
                <span>Minted Mar 10, 2026</span>
                <span>Unlocks {h.lockExpiry}</span>
              </div>
            </div>

            {/* Allocation breakdown */}
            <div className="db-alloc-section">
              <div className="db-section-title" style={{ marginTop: 0, marginBottom: '16px' }}>Token Allocation Breakdown</div>
              {[
                { label: 'Public Sale', pct: 40 },
                { label: 'Team & Advisors', pct: 15 },
                { label: 'Ecosystem Fund', pct: 20 },
                { label: 'Treasury Reserve', pct: 15 },
                { label: 'Liquidity & Partnerships', pct: 10 },
              ].map(a => (
                <div key={a.label} className="db-alloc-row">
                  <div className="db-alloc-row__label">
                    <span>{a.label}</span>
                    <span className="db-alloc-pct">{a.pct}%</span>
                  </div>
                  <div className="db-alloc-track">
                    <div className="db-alloc-fill" style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Allocation chart placeholder */}
      <div className="db-chart-placeholder">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="rgba(92,39,254,0.3)" strokeWidth="8" strokeDasharray="158 68" strokeLinecap="round" />
          <circle cx="40" cy="40" r="36" stroke="rgba(157,111,255,0.5)" strokeWidth="8" strokeDasharray="55 171" strokeDashoffset="-100" strokeLinecap="round" />
          <circle cx="40" cy="40" r="36" stroke="rgba(222,199,255,0.4)" strokeWidth="8" strokeDasharray="36 190" strokeDashoffset="-155" strokeLinecap="round" />
        </svg>
        <p>Detailed portfolio charts coming in Phase 5</p>
      </div>
    </div>
  );
}

/* ── Invest ─────────────────────────────────────── */
function TabInvest() {
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="db-tab-content">
        <div className="db-success-box">
          <div className="db-success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="db-h2">Investment Intent Submitted</h2>
          <p className="db-muted" style={{ maxWidth: 440, margin: '0 auto 24px' }}>
            Your investment intent for <strong style={{ color: '#DEC7FF' }}>${Number(amount).toLocaleString()}</strong> in ShivAI has been received. Our team will process your payment and confirm allocation within 1–3 business days.
          </p>
          <div className="db-alert db-alert--info" style={{ textAlign: 'left', maxWidth: 440, margin: '0 auto 24px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>Tokens will be minted to your custodial wallet <strong style={{ color: '#DEC7FF' }}>{INVESTOR.walletAddress}</strong> on Polygon after payment confirmation.</div>
          </div>
          <button className="db-btn db-btn--primary" onClick={() => { setSubmitted(false); setAmount(''); }}>Submit Another Intent</button>
        </div>
      </div>
    );
  }

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Invest</h1>
          <p className="db-muted">Browse open offerings and submit your investment intent.</p>
        </div>
      </div>

      {/* Token cards */}
      <div className="db-section-title">Available Offerings</div>
      <div className="db-token-grid">
        {AVAILABLE_TOKENS.map(t => (
          <div
            key={t.id}
            className={`db-token-card ${selectedToken?.id === t.id ? 'db-token-card--selected' : ''}`}
            onClick={() => setSelectedToken(t)}
          >
            <div className="db-token-card__image">
              <img src={t.image} alt={t.name} onError={e => { e.target.style.display='none'; }} />
              <span className={`db-token-card__badge db-token-card__badge--${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span>
            </div>
            <div className="db-token-card__body">
              <div className="db-token-card__header-row">
                <div className="db-token-card__logo-sm">
                  <img src={t.logo} alt="" onError={e => { e.target.style.display='none'; }} />
                </div>
                <div>
                  <div className="db-token-card__name">{t.name}</div>
                  <div className="db-token-card__ticker">{t.ticker}</div>
                </div>
              </div>
              <p className="db-token-card__desc">{t.desc}</p>
              <div className="db-token-card__stats">
                <div className="db-token-stat"><span>Price</span><strong>{t.price}</strong></div>
                <div className="db-token-stat"><span>Min.</span><strong>{t.minInvest}</strong></div>
                <div className="db-token-stat"><span>Lock</span><strong>{t.lock}</strong></div>
              </div>
              <div className={`db-token-card__select-indicator ${selectedToken?.id === t.id ? 'active' : ''}`}>
                {selectedToken?.id === t.id ? '✓ Selected' : 'Click to select'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment intent form */}
      {selectedToken && (
        <div className="db-intent-form-wrap">
          <div className="db-section-title">Investment Intent — {selectedToken.name}</div>
          <form onSubmit={handleSubmit} className="db-intent-form">
            <div className="db-form-row">
              <div className="db-form-group">
                <label className="db-form-label">Investment Amount (USD)</label>
                <div className="db-input-prefix-wrap">
                  <span className="db-input-prefix">$</span>
                  <input
                    type="number"
                    className="db-form-input db-form-input--prefixed"
                    placeholder="500"
                    min="500"
                    max="50000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>
                <span className="db-form-hint">Min: {selectedToken.minInvest} · Max: {selectedToken.maxInvest}</span>
              </div>
              <div className="db-form-group">
                <label className="db-form-label">Estimated Token Allocation</label>
                <div className="db-token-calc">
                  {amount && !isNaN(amount) && Number(amount) >= 500
                    ? <><strong>{(Number(amount) / 0.01).toLocaleString()}</strong> {selectedToken.ticker}</>
                    : <span className="db-muted">Enter amount above</span>
                  }
                </div>
              </div>
            </div>

            <div className="db-form-group">
              <label className="db-form-label">Payment Method</label>
              <div className="db-payment-methods">
                {[
                  { id: 'bank', label: 'Bank Transfer', desc: 'SWIFT / SEPA wire transfer. 1–3 business days.' },
                  { id: 'usdt', label: 'USDT (TRC20)', desc: 'Stable-coin transfer. Tron network. 1 hour settlement.' },
                ].map(m => (
                  <label key={m.id} className={`db-payment-option ${method === m.id ? 'db-payment-option--selected' : ''}`}>
                    <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} style={{ display: 'none' }} />
                    <div className="db-payment-option__check">{method === m.id && <Icon.check />}</div>
                    <div>
                      <div className="db-payment-option__label">{m.label}</div>
                      <div className="db-payment-option__desc">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Terms notice */}
            <div className="db-alert db-alert--info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                By submitting, you confirm you have read the <strong>Risk Disclosure Statement</strong> and <strong>Subscription Agreement</strong>. Tokens will be locked for <strong>{selectedToken.lock}</strong> from minting date. This is a non-refundable private placement.
              </div>
            </div>

            <button type="submit" className="db-btn db-btn--primary" disabled={loading || !amount || Number(amount) < 500}>
              {loading ? <><span className="db-spinner" /> Processing...</> : `Submit Investment Intent for $${amount || '—'}`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ── Transactions ───────────────────────────────── */
function TabTransactions() {
  const statusStyles = {
    confirmed:  { color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   label: 'Confirmed' },
    approved:   { color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   label: 'Approved' },
    completed:  { color: '#9D6FFF', bg: 'rgba(157,111,255,0.1)', label: 'Completed' },
    pending:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'Pending' },
    failed:     { color: '#F87171', bg: 'rgba(248,113,113,0.1)', label: 'Failed' },
  };

  const typeIcons = {
    investment: (
      <div className="db-tx-icon" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
      </div>
    ),
    kyc: (
      <div className="db-tx-icon" style={{ background: 'rgba(96,165,250,0.1)', borderColor: 'rgba(96,165,250,0.25)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
    ),
    onboarding: (
      <div className="db-tx-icon" style={{ background: 'rgba(157,111,255,0.1)', borderColor: 'rgba(157,111,255,0.25)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      </div>
    ),
  };

  const typeLabels = { investment: 'Investment', kyc: 'KYC Verification', onboarding: 'Onboarding' };

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Transaction History</h1>
          <p className="db-muted">All investment activities, KYC events, and payment records.</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="db-tx-table-wrap">
        <table className="db-tx-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              <th>Tx Reference</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx, idx) => {
              const s = statusStyles[tx.status] || statusStyles.pending;
              return (
                <tr key={tx.id}>
                  <td className="db-tx-num">{idx + 1}</td>
                  <td>
                    <div className="db-tx-type-cell">
                      {typeIcons[tx.type]}
                      <span className="db-tx-type-label">{typeLabels[tx.type]}</span>
                    </div>
                  </td>
                  <td className="db-tx-amount">
                    {tx.amount ? `$${tx.amount.toLocaleString()}` : <span className="db-muted">&mdash;</span>}
                  </td>
                  <td className="db-tx-method">{tx.method}</td>
                  <td className="db-tx-date">{tx.date}</td>
                  <td>
                    <span className="db-tx-status" style={{ color: s.color, background: s.bg }}>
                      <span className="db-tx-status-dot" style={{ background: s.color }} />
                      {s.label}
                    </span>
                  </td>
                  <td className="db-tx-hash">{tx.hash}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="db-tx-cards-mobile">
        {TRANSACTIONS.map((tx, idx) => {
          const s = statusStyles[tx.status] || statusStyles.pending;
          return (
            <div key={tx.id} className="db-tx-mcard">
              <div className="db-tx-mcard__top">
                <div className="db-tx-mcard__type">
                  {typeIcons[tx.type]}
                  <div>
                    <div className="db-tx-mcard__label">{typeLabels[tx.type]}</div>
                    <div className="db-tx-mcard__date">{tx.date}</div>
                  </div>
                </div>
                <span className="db-tx-status" style={{ color: s.color, background: s.bg }}>
                  <span className="db-tx-status-dot" style={{ background: s.color }} />
                  {s.label}
                </span>
              </div>
              <div className="db-tx-mcard__details">
                <div className="db-tx-mcard__row">
                  <span>Amount</span>
                  <strong>{tx.amount ? `$${tx.amount.toLocaleString()}` : '—'}</strong>
                </div>
                <div className="db-tx-mcard__row">
                  <span>Method</span>
                  <strong>{tx.method}</strong>
                </div>
                <div className="db-tx-mcard__row">
                  <span>Reference</span>
                  <strong className="db-tx-hash">{tx.hash}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="db-tx-note">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        On-chain transactions can be verified on <a href="https://polygonscan.com" target="_blank" rel="noreferrer">PolygonScan <Icon.external /></a>. Custodial wallet transactions are managed by Growith&apos;s HSM-backed infrastructure.
      </div>
    </div>
  );
}

/* ── Verification ───────────────────────────────── */
function TabVerification({ investor }) {
  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Identity Verification</h1>
          <p className="db-muted">KYC/AML status and your onboarding step record.</p>
        </div>
        <KycBadge status={investor.kycStatus} />
      </div>

      {investor.kycStatus === 'approved' && (
        <div className="db-alert db-alert--success" style={{ marginBottom: 32 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div>
            <strong>Full KYC Approval Granted</strong> — Verified via Sumsub. Sanctions screening passed. You are cleared to invest.
          </div>
        </div>
      )}

      <div className="db-section-title">KYC Checklist</div>
      <div className="db-kyc-steps">
        {KYC_STEPS.map((step, i) => (
          <div key={step.id} className={`db-kyc-step db-kyc-step--${step.status}`}>
            <div className="db-kyc-step__num">
              {step.status === 'done'
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : step.status === 'pending'
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  : i + 1}
            </div>
            <div className="db-kyc-step__body">
              <div className="db-kyc-step__label">{step.label}</div>
              <div className="db-kyc-step__desc">{step.desc}</div>
            </div>
            {i < KYC_STEPS.length - 1 && <div className="db-kyc-step__line" />}
          </div>
        ))}
      </div>

      <div className="db-info-box" style={{ marginTop: 32 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <strong style={{ color: '#DEC7FF' }}>Re-verification Policy</strong><br />
          KYC is valid for 24 months. You may be asked to re-verify if your circumstances change or regulations require. Contact <a href="mailto:compliance@growith.io" className="db-link">compliance@growith.io</a> for any queries.
        </div>
      </div>
    </div>
  );
}

/* ── Settings ───────────────────────────────────── */
function TabSettings({ investor }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: investor.name,
    email: investor.email,
    phone: '+48 600 123 456',
    country: 'Poland',
    dob: '1990-06-15',
  });
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Account Settings</h1>
          <p className="db-muted">Your profile, wallet, and notification preferences.</p>
        </div>
      </div>

      {/* ── Profile Hero Card ── */}
      <div className="db-profile-hero">
        <div className="db-profile-hero__bg" />
        <div className="db-profile-hero__content">
          <div className="db-profile-avatar-wrap">
            <div className="db-profile-avatar">
              {avatarUrl
                ? <img src={avatarUrl} alt="Profile" />
                : <span>{investor.name.charAt(0)}</span>
              }
            </div>
            <label className="db-profile-avatar-edit" title="Change photo">
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </label>
          </div>
          <div className="db-profile-hero__info">
            <h2 className="db-profile-hero__name">{profile.name}</h2>
            <p className="db-profile-hero__email">{profile.email}</p>
            <div className="db-profile-hero__badges">
              <KycBadge status={investor.kycStatus} />
              <span className="db-profile-hero__member">Member since {investor.joinedDate}</span>
            </div>
          </div>
          {!editing && (
            <button className="db-btn db-btn--secondary db-profile-hero__edit-btn" onClick={() => setEditing(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ── Profile Fields ── */}
      <div className="db-settings-card db-profile-details">
        <div className="db-settings-card__title">Personal Information</div>
        <div className="db-profile-fields">
          <div className="db-profile-field">
            <label className="db-form-label">Full Name</label>
            {editing
              ? <input className="db-form-input" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} />
              : <span className="db-settings-value">{profile.name}</span>
            }
          </div>
          <div className="db-profile-field">
            <label className="db-form-label">Email Address</label>
            {editing
              ? <input className="db-form-input" type="email" value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))} />
              : <span className="db-settings-value">{profile.email}</span>
            }
          </div>
          <div className="db-profile-field">
            <label className="db-form-label">Phone Number</label>
            {editing
              ? <input className="db-form-input" value={profile.phone} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} />
              : <span className="db-settings-value">{profile.phone}</span>
            }
          </div>
          <div className="db-profile-field">
            <label className="db-form-label">Date of Birth</label>
            {editing
              ? <input className="db-form-input" type="date" value={profile.dob} onChange={e => setProfile(p => ({...p, dob: e.target.value}))} />
              : <span className="db-settings-value">{new Date(profile.dob + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            }
          </div>
          <div className="db-profile-field">
            <label className="db-form-label">Country</label>
            {editing
              ? <input className="db-form-input" value={profile.country} onChange={e => setProfile(p => ({...p, country: e.target.value}))} />
              : <span className="db-settings-value">{profile.country}</span>
            }
          </div>
        </div>
        {editing && (
          <div className="db-profile-actions">
            <button className="db-btn db-btn--primary" onClick={handleSave}>Save Changes</button>
            <button className="db-btn db-btn--secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>

      <div className="db-settings-grid">
        {/* Wallet */}
        <div className="db-settings-card">
          <div className="db-settings-card__title">Custodial Wallet</div>
          <div className="db-settings-field"><span className="db-form-label">Address</span>
            <span className="db-settings-value db-wallet-addr">
              {investor.walletAddress}
              <button className="db-copy-btn" title="Copy address">
                <Icon.copy />
              </button>
            </span>
          </div>
          <div className="db-settings-field"><span className="db-form-label">Network</span><span className="db-settings-value">Polygon (MATIC)</span></div>
          <div className="db-settings-field"><span className="db-form-label">Custody Type</span><span className="db-settings-value">HSM-backed · Growith Custodian</span></div>
          <div className="db-alert db-alert--info" style={{ marginTop: 12, padding: '10px 14px', fontSize: 13 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>This is a custodial wallet managed by Growith. Self-custody migration available in Phase 5.</span>
          </div>
        </div>

        {/* Security */}
        <div className="db-settings-card">
          <div className="db-settings-card__title">Security</div>
          <div className="db-settings-field"><span className="db-form-label">2FA</span><span className="db-settings-value db-green">Enabled (Authenticator App)</span></div>
          <div className="db-settings-field"><span className="db-form-label">Last Login</span><span className="db-settings-value">Mar 12, 2026 · 09:41 UTC</span></div>
          <div className="db-settings-field"><span className="db-form-label">Session</span><span className="db-settings-value">Active · Chrome · Warsaw, PL</span></div>
          <button className="db-btn db-btn--secondary" style={{ marginTop: 12 }}>Change Password</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="db-settings-card" style={{ marginTop: 18 }}>
        <div className="db-settings-card__title">Notification Preferences</div>
        {[
          { label: 'Investment Confirmations', enabled: true },
          { label: 'KYC Status Updates', enabled: true },
          { label: 'Token Minting Alerts', enabled: true },
          { label: 'Lock Expiry Reminders', enabled: false },
          { label: 'Platform Updates', enabled: false },
        ].map(n => (
          <div key={n.label} className="db-notif-row">
            <span>{n.label}</span>
            <div className={`db-toggle ${n.enabled ? 'db-toggle--on' : ''}`}>
              <div className="db-toggle__knob" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN DASHBOARD
   ══════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',      Icon: Icon.overview },
  { id: 'portfolio',     label: 'Portfolio',      Icon: Icon.portfolio },
  { id: 'invest',        label: 'Invest',         Icon: Icon.invest },
  { id: 'transactions',  label: 'Transactions',   Icon: Icon.transactions },
  { id: 'verification',  label: 'Verification',   Icon: Icon.verification },
  { id: 'settings',      label: 'Settings',       Icon: Icon.settings },
];

const VALID_TABS = new Set(NAV_ITEMS.map(n => n.id));

const Dashboard = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derive active tab from URL segment, e.g. /dashboard/portfolio → 'portfolio'
  const tabFromUrl = pathname.split('/dashboard')[1]?.replace('/', '') || 'overview';
  const activeTab = VALID_TABS.has(tabFromUrl) ? tabFromUrl : 'overview';

  // Scroll to top on tab change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeTab]);

  const handleNav = (id) => {
    navigate(`/dashboard${id === 'overview' ? '' : '/' + id}`);
    setSidebarOpen(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':     return <TabOverview investor={INVESTOR} />;
      case 'portfolio':    return <TabPortfolio />;
      case 'invest':       return <TabInvest />;
      case 'transactions': return <TabTransactions />;
      case 'verification': return <TabVerification investor={INVESTOR} />;
      case 'settings':     return <TabSettings investor={INVESTOR} />;
      default:             return <TabOverview investor={INVESTOR} />;
    }
  };

  return (
    <div className="db-shell">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`db-sidebar ${sidebarOpen ? 'db-sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="db-sidebar-brand">
          <Link to="/" className="db-brand-link">
            <span className="db-brand-logo">Growith</span>
            <span className="db-brand-sub">Investor Panel</span>
          </Link>
          <button className="db-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <Icon.close />
          </button>
        </div>

        {/* Nav */}
        <nav className="db-sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`db-nav-item ${activeTab === item.id ? 'db-nav-item--active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <item.Icon />
              <span>{item.label}</span>
              {item.id === 'invest' && <span className="db-nav-badge">LIVE</span>}
            </button>
          ))}
        </nav>

        {/* KYC status chip at bottom */}
        <div className="db-sidebar-footer">
          <div className="db-sidebar-user">
            <div className="db-sidebar-avatar">{INVESTOR.name.charAt(0)}</div>
            <div className="db-sidebar-user-info">
              <span className="db-sidebar-user-name">{INVESTOR.name.split(' ')[0]}</span>
              <KycBadge status={INVESTOR.kycStatus} />
            </div>
          </div>
          <button className="db-nav-item db-nav-item--logout" onClick={() => navigate('/login')}>
            <Icon.logout />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="db-main">
        {/* Top Bar */}
        <header className="db-topbar">
          <button className="db-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Icon.menu />
          </button>
          <div className="db-topbar-title">
            {NAV_ITEMS.find(n => n.id === activeTab)?.label || 'Dashboard'}
          </div>
          <div className="db-topbar-actions">
            <button className="db-icon-btn" aria-label="Notifications">
              <Icon.bell />
              <span className="db-notif-dot" />
            </button>
            <div className="db-topbar-avatar">{INVESTOR.name.charAt(0)}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="db-page">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
