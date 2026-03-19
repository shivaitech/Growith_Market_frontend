import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

/* ═══════════════════════════════════════════════════════════
   MOCK DATA  — replace with API calls in production
   ═══════════════════════════════════════════════════════════ */

const INVESTOR = {
  name: 'Nicholas Ergemia',
  email: 'nicholas@ergemia.com',
  kycStatus: 'approved',
  walletAddress: '0x3f5CE91d4A458B72b5a4cB4d5F6e7B8C9D0E1234',
  joinedDate: 'March 2026',
  tier: 'Premium',
  affiliateCode: 'NICK-X7K2',
  referralCount: 8,
  totalReferralEarned: 640,
  pendingReferralPayout: 120,
  linkedAccounts: [
    { provider: 'google', email: 'nicholas@ergemia.com', linked: true },
    { provider: 'telegram', handle: '@nick_ergemia', linked: true },
    { provider: 'discord', handle: 'Nick#8821', linked: false },
    { provider: 'twitter', handle: '@nickergo', linked: false },
  ],
};

/* Portfolio value over last 12 weeks (for sparkline) */
const PORTFOLIO_HISTORY = [2500, 2520, 2540, 2600, 2580, 2650, 2700, 2730, 2760, 2800, 2840, 2875];

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
    contract: '0x3f5CE91d4A458B72b5a4cB4d5F6e7B8C9D0E1234',
    priceHistory: [0.0095, 0.0096, 0.0098, 0.0099, 0.0097, 0.0100, 0.0101, 0.0103, 0.0104, 0.0105, 0.0107, 0.0110],
  },
];

const TRANSACTIONS = [
  { id: 1, type: 'investment', token: 'ShivAI', amount: 2500, date: 'Mar 10, 2026', status: 'confirmed', hash: '0xabc1...f2d9', method: 'Bank Transfer' },
  { id: 2, type: 'affiliate', token: '—', amount: 80, date: 'Mar 12, 2026', status: 'confirmed', hash: '—', method: 'Affiliate Commission' },
  { id: 3, type: 'affiliate', token: '—', amount: 80, date: 'Mar 14, 2026', status: 'confirmed', hash: '—', method: 'Affiliate Commission' },
  { id: 4, type: 'redeem', token: '—', amount: 120, date: 'Mar 15, 2026', status: 'pending', hash: '—', method: 'USDT Withdrawal' },
  { id: 5, type: 'kyc', token: '—', amount: null, date: 'Mar 8, 2026', status: 'approved', hash: '—', method: 'Sumsub KYC' },
  { id: 6, type: 'onboarding', token: '—', amount: null, date: 'Mar 8, 2026', status: 'completed', hash: '—', method: 'Growith Onboarding' },
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
    price: '$0.011', minInvest: '$500', maxInvest: '$50,000',
    lock: '12 months', status: 'LIVE',
    raised: 340000, target: 500000,
    investors: 142,
    desc: 'Next-generation AI compute infrastructure token. EU-registered private placement.',
  },
];

/* Affiliate program tiers */
const AFFILIATE_TIERS = [
  { name: 'Starter',   refMin: 0,  refMax: 4,  commPct: 3, color: '#9D6FFF', extraPerks: 'Basic dashboard access' },
  { name: 'Silver',    refMin: 5,  refMax: 14, commPct: 4, color: '#60A5FA', extraPerks: '+Priority support' },
  { name: 'Gold',      refMin: 15, refMax: 29, commPct: 5, color: '#F59E0B', extraPerks: '+Bonus token allocation' },
  { name: 'Platinum',  refMin: 30, refMax: 999,commPct: 7, color: '#22C55E', extraPerks: '+Revenue sharing pool' },
];

/* Affiliate programs per token */
const AFFILIATE_PROGRAMS = [
  {
    id: 'shivai-standard',
    tokenId: 1,
    tokenName: 'ShivAI Token',
    tokenTicker: 'SHIV',
    tokenLogo: '/assets/images/icon/shivAiToken.png',
    name: 'ShivAI Standard Affiliate',
    tag: 'Standard',
    tagColor: '#9D6FFF',
    status: 'active',
    commissionType: 'percentage',
    commissionValue: 3,         // % of referred investment
    bonusThreshold: 5,          // referrals needed for bonus
    bonusUsd: 50,               // bonus USD on reaching threshold
    minInvestPerReferral: 500,  // referred person must invest at least this
    payoutDelay: '3 business days',
    totalPool: 50000,           // USD left in affiliate pool
    usedPool: 18400,
    endsDate: 'Dec 31, 2026',
    highlights: [
      'Earn 3% on every confirmed investment',
      '$50 bonus after 5 qualified referrals',
      'No cap on number of referrals',
      'Payout in USDT or bank wire',
    ],
    rules: [
      'Referred investor must complete KYC before commission is credited.',
      'Minimum referred investment: $500.',
      'Self-referrals are strictly prohibited.',
      'Commission is credited after payment confirmation (usually within 3 business days).',
      'Programme is subject to the Growith Affiliate Terms.',
    ],
  },
  {
    id: 'shivai-vip',
    tokenId: 1,
    tokenName: 'ShivAI Token',
    tokenTicker: 'SHIV',
    tokenLogo: '/assets/images/icon/shivAiToken.png',
    name: 'ShivAI VIP Partner',
    tag: 'VIP',
    tagColor: '#F59E0B',
    status: 'active',
    commissionType: 'percentage',
    commissionValue: 6,
    bonusThreshold: 3,
    bonusUsd: 150,
    minInvestPerReferral: 2000,
    payoutDelay: '1 business day',
    totalPool: 20000,
    usedPool: 7200,
    endsDate: 'Jun 30, 2026',
    highlights: [
      'Earn 6% on high-ticket investments ($2 000+)',
      '$150 bonus after 3 qualified referrals',
      'Priority payout within 1 business day',
      'Dedicated affiliate account manager',
    ],
    rules: [
      'Referred investment must be $2 000 or more to qualify.',
      'KYC must be completed by referred investor.',
      'VIP access requires Growith account manager approval.',
      'Programme ends June 30, 2026 or when pool is exhausted.',
    ],
  },
  {
    id: 'shivai-launch',
    tokenId: 1,
    tokenName: 'ShivAI Token',
    tokenTicker: 'SHIV',
    tokenLogo: '/assets/images/icon/shivAiToken.png',
    name: 'ShivAI Launch Boost',
    tag: 'Limited',
    tagColor: '#EF4444',
    status: 'ending_soon',
    commissionType: 'flat',
    commissionValue: 25,        // flat USD per referral
    bonusThreshold: null,
    bonusUsd: null,
    minInvestPerReferral: 500,
    payoutDelay: 'Instant (on confirmation)',
    totalPool: 5000,
    usedPool: 4200,
    endsDate: 'Mar 31, 2026',
    highlights: [
      'Flat $25 per confirmed referral — no minimum % math',
      'Instant payout on each confirmation',
      'Runs until pool ($5 000) is exhausted',
      'Stack with tier bonus for extra earnings',
    ],
    rules: [
      'Minimum referred investment $500.',
      'Flat rate replaces tier percentage for this programme only.',
      'Pool is first-come-first-served; ends when $5 000 paid out.',
      'One flat bonus per referred user.',
    ],
  },
];

/* Unique tokens derived from AFFILIATE_PROGRAMS — kept at module scope so TabAffiliate
   can reference them inside a useEffect without stale-closure issues. */
const AFFILIATE_TOKENS = AFFILIATE_PROGRAMS.reduce((acc, p) => {
  if (!acc.find(t => t.id === p.tokenId)) {
    acc.push({
      id: p.tokenId, name: p.tokenName, ticker: p.tokenTicker, logo: p.tokenLogo,
      totalPrograms: AFFILIATE_PROGRAMS.filter(x => x.tokenId === p.tokenId).length,
      activePrograms: AFFILIATE_PROGRAMS.filter(x => x.tokenId === p.tokenId && x.status !== 'ended').length,
    });
  }
  return acc;
}, []);

/* Wallet balance breakdown */
const WALLET_DATA = {
  cashBalance: 520,   // earned & available in USD
  pendingPayout: 120, // waiting clearance
  lifetimeEarned: 640,
  currency: 'USD',
  payoutMethods: [
    { id: 'usdt_trc20', label: 'USDT (TRC20)', desc: 'Instant · Min $20', icon: '💵' },
    { id: 'usdt_erc20', label: 'USDT (ERC20)', desc: '~15 min · Min $50', icon: '🔷' },
    { id: 'bank', label: 'Bank Wire', desc: '2–5 days · Min $200', icon: '🏦' },
  ],
};

/* ══════════════════════════════════════════════════════════════
   SHARED UTILITIES
   ══════════════════════════════════════════════════════════════ */

/* ── SVG Bar Chart ───────────────────────────────────────── */
function BarChart({ data, labels, width = '100%', height = 120, color = '#6B35FF', accentColor = '#9D6FFF' }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data) * 0.97;
  const max = Math.max(...data);
  const range = max - min || 1;
  const barCount = data.length;
  const gap = 6;
  const svgWidth = 800;
  const barW = (svgWidth - gap * (barCount - 1)) / barCount;
  const chartH = 90;
  const labelH = 22;
  const totalH = chartH + labelH;
  const lastIdx = barCount - 1;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${svgWidth} ${totalH}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* Gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = chartH - t * chartH;
        return <line key={t} x1="0" y1={y} x2={svgWidth} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />;
      })}
      {/* Bars */}
      {data.map((v, i) => {
        const barH = Math.max(4, ((v - min) / range) * chartH * 0.92);
        const x = i * (barW + gap);
        const y = chartH - barH;
        const isLast = i === lastIdx;
        const label = labels?.[i] ?? `W${i + 1}`;
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              fill={isLast ? 'url(#barGradActive)' : 'url(#barGrad)'}
              rx="4" ry="4"
              opacity={isLast ? 1 : 0.72 + (i / barCount) * 0.28}
            />
            {isLast && (
              <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="10" fill="#4ade80" fontWeight="700">
                ${(v / 1000).toFixed(2)}k
              </text>
            )}
            <text
              x={x + barW / 2} y={chartH + 16}
              textAnchor="middle" fontSize="9.5"
              fill={isLast ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)'}
              fontWeight={isLast ? '700' : '400'}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── SVG Sparkline ────────────────────────────────────────── */
function Sparkline({ data, width = 120, height = 40, color = '#6B35FF', fill = true }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const fillPath = `M${pts[0]} L${pts.join(' L')} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {fill && (
        <path d={fillPath} fill={color} fillOpacity="0.12" />
      )}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last dot */}
      <circle
        cx={parseFloat(pts[pts.length - 1].split(',')[0])}
        cy={parseFloat(pts[pts.length - 1].split(',')[1])}
        r="3" fill={color}
      />
    </svg>
  );
}

/* ── SVG Donut Chart ──────────────────────────────────────── */
function DonutChart({ segments, size = 160, thickness = 28 }) {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circ;
        const gap = circ - dash;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

/* ── Copy to clipboard helper ─────────────────────────────── */
function useCopyText() {
  const [copied, setCopied] = useState('');
  const copy = useCallback((text, key = 'default') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 1800);
    });
  }, []);
  return { copied, copy };
}

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
  wallet: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 7v13a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12h3v4h-3a2 2 0 0 1 0-4z"/>
    </svg>
  ),
  affiliate: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  link: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  unlink: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.84 12.25l1.72-1.71a4.99 4.99 0 1 0-7.07-7.07l-1.72 1.71"/>
      <path d="M5.17 11.75l-1.72 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      <line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/>
      <line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/>
    </svg>
  ),
  trophy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21"/>
      <path d="M17 3H7l1 10a4 4 0 0 0 8 0z"/>
      <path d="M4 5h2.5M19.5 5H22"/><path d="M4 5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/>
    </svg>
  ),
  redeem: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
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

function TabOverview({ investor, onNav }) {
  const total = HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
  const invested = HOLDINGS.reduce((s, h) => s + h.invested, 0);
  const pnl = total - invested;
  const pnlPct = ((pnl / invested) * 100).toFixed(1);
  const [holdingsPage, setHoldingsPage] = useState(1);
  const visibleHoldings = HOLDINGS.slice(0, holdingsPage * HOLDINGS_PER_PAGE);
  const { copy, copied } = useCopyText();

  const statCards = [
    {
      label: 'Portfolio Value', value: `$${total.toLocaleString()}`,
      extra: <span className="db-stat-change db-stat-change--up"><Icon.arrow_up /> +{pnlPct}% all-time</span>,
      chart: <Sparkline data={PORTFOLIO_HISTORY} width={80} height={32} color="#6B35FF" />,
    },
    {
      label: 'Total Invested', value: `$${invested.toLocaleString()}`,
      extra: <span className="db-stat-sub">Across {HOLDINGS.length} token{HOLDINGS.length !== 1 ? 's' : ''}</span>,
    },
    {
      label: 'Unrealized P&L', value: `+$${pnl.toLocaleString()}`, valueClass: 'db-stat-value--green',
      extra: <span className="db-stat-change db-stat-change--up"><Icon.arrow_up /> +{pnlPct}%</span>,
    },
    {
      label: 'Affiliate Earned', value: `$${investor.totalReferralEarned.toLocaleString()}`,
      extra: <span className="db-stat-sub">{investor.referralCount} referrals · ${investor.pendingReferralPayout} pending</span>,
    },
    {
      label: 'Wallet Balance', value: `$${WALLET_DATA.cashBalance.toLocaleString()}`,
      extra: <span className="db-stat-sub">${WALLET_DATA.pendingPayout} pending clearance</span>,
    },
    {
      label: 'Custodial Wallet',
      value: investor.walletAddress.slice(0, 10) + '…' + investor.walletAddress.slice(-6),
      valueClass: 'db-stat-value--sm',
      extra: <span className="db-stat-sub">Polygon · HSM-backed</span>,
    },
  ];

  return (
    <div className="db-tab-content">
      {/* Welcome bar */}
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Welcome back, {investor.name.split(' ')[0]} 👋</h1>
          <p className="db-muted">Here&apos;s your full investment dashboard — updated in real time.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <KycBadge status={investor.kycStatus} />
          <span className="db-tier-badge">{investor.tier}</span>
        </div>
      </div>

      {/* KYC banner */}
      {investor.kycStatus === 'approved' && (
        <div className="db-alert db-alert--success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div>
            <strong>KYC Verified</strong> — Your identity is verified via Sumsub. You are eligible to invest in all open offerings.
          </div>
        </div>
      )}

      {/* Stats grid — 3 cols desktop, swiper mobile */}
      <div className="db-stats-grid db-stats-grid--desktop" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {statCards.map((s, i) => (
          <div key={i} className="db-stat-card" style={{ position: 'relative' }}>
            {s.chart && <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.9 }}>{s.chart}</div>}
            <span className="db-stat-label">{s.label}</span>
            <span className={`db-stat-value ${s.valueClass || ''}`}>{s.value}</span>
            {s.extra}
          </div>
        ))}
      </div>

      <div className="db-stats-swiper--mobile">
        <Swiper modules={[SwiperPagination]} pagination={{ clickable: true }} spaceBetween={12} slidesPerView={1.15}>
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

      {/* Portfolio bar chart card */}
      <div className="db-section-title">Portfolio Performance — Last 12 Weeks</div>
      <div className="db-chart-card">
        <div className="db-chart-card__header">
          <div>
            <div className="db-chart-card__value">${total.toLocaleString()}</div>
            <div className="db-chart-card__change db-green" style={{ color: '#4ade80' }}>▲ +${pnl} (+{pnlPct}%) since entry</div>
          </div>
          <div className="db-chart-card__legend">
            <span className="db-chart-legend-dot" style={{ background: '#9D6FFF' }} /> Weekly value &nbsp;
            <span className="db-chart-legend-dot" style={{ background: '#4ade80' }} /> Current week
          </div>
        </div>
        <BarChart
          data={PORTFOLIO_HISTORY}
          labels={['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Wk8','Wk9','Wk10','Wk11','Now']}
          height={140}
        />
      </div>

      {/* Holdings */}
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
                  <div className="db-hcard__chain">{h.blockchain}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Sparkline data={h.priceHistory} width={60} height={28} color="#22C55E" fill={false} />
                </div>
              </div>
              <div className="db-hcard__stats">
                <div className="db-hcard__stat"><span>Tokens</span><strong>{h.amount.toLocaleString()}</strong></div>
                <div className="db-hcard__stat"><span>Value</span><strong>${h.currentValue.toLocaleString()}</strong></div>
                <div className="db-hcard__stat"><span>P&amp;L</span><strong className="db-green">+${h.pnl} (+{h.pnlPct}%)</strong></div>
              </div>
              <div className="db-hcard__footer">
                <span className="db-hcard__lock-info"><Icon.lock /> Lock expires {h.lockExpiry}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {HOLDINGS.length > HOLDINGS_PER_PAGE && (
        <div className="db-holdings-pagination">
          {holdingsPage * HOLDINGS_PER_PAGE < HOLDINGS.length
            ? <button className="db-btn db-btn--secondary db-btn--sm" onClick={() => setHoldingsPage(p => p + 1)}>Show More</button>
            : <button className="db-btn db-btn--secondary db-btn--sm" onClick={() => setHoldingsPage(1)}>Show Less</button>
          }
        </div>
      )}

      {/* Quick Actions */}
      <div className="db-section-title">Quick Actions</div>
      <div className="db-quick-actions">
        {[
          { icon: <svg width="20" height="20" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>, bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)', label: 'Invest More', desc: 'Explore open offerings and add to holdings.', tab: 'invest' },
          { icon: <svg width="20" height="20" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 7v13a2 2 0 0 0 2 2h16v-5"/><path d="M18 12h3v4h-3a2 2 0 0 1 0-4z"/></svg>, bg: 'rgba(157,111,255,0.12)', border: 'rgba(157,111,255,0.25)', label: 'Redeem Earnings', desc: 'Withdraw your affiliate commissions to USDT or bank.', tab: 'wallet' },
          { icon: <svg width="20" height="20" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>, bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', label: 'Invite & Earn', desc: 'Share your referral link and earn up to 7% commission.', tab: 'affiliate' },
        ].map(qa => (
          <div key={qa.tab} className="db-qa-card" style={{ cursor: 'pointer' }} onClick={() => onNav(qa.tab)}>
            <div className="db-qa-icon" style={{ background: qa.bg, borderColor: qa.border }}>{qa.icon}</div>
            <div className="db-qa-text">
              <div className="db-qa-label">{qa.label}</div>
              <div className="db-qa-desc">{qa.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="db-section-title">Recent Activity</div>
      <div className="db-activity-list">
        {TRANSACTIONS.slice(0, 4).map(tx => {
          const statusColors = { confirmed: '#22C55E', approved: '#22C55E', completed: '#9D6FFF', pending: '#F59E0B' };
          const typeLabel = { investment: 'Investment', affiliate: 'Affiliate Commission', redeem: 'Redemption', kyc: 'KYC Verified', onboarding: 'Onboarding' };
          return (
            <div key={tx.id} className="db-activity-row">
              <div className="db-activity-dot" style={{ background: statusColors[tx.status] || '#9D6FFF' }} />
              <div className="db-activity-body">
                <span className="db-activity-label">{typeLabel[tx.type] || tx.type}</span>
                <span className="db-activity-date">{tx.date}</span>
              </div>
              <div className="db-activity-amount" style={{ color: tx.type === 'redeem' ? '#F59E0B' : tx.amount ? '#22C55E' : 'rgba(255,255,255,0.5)' }}>
                {tx.amount ? `${tx.type === 'redeem' ? '−' : '+'}$${tx.amount.toLocaleString()}` : '—'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Portfolio ──────────────────────────────────── */
function TabPortfolio() {
  const total = HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
  const allocSegments = [
    { label: 'Public Sale',              pct: 40, color: '#6B35FF' },
    { label: 'Ecosystem Fund',           pct: 20, color: '#9D6FFF' },
    { label: 'Team & Advisors',          pct: 15, color: '#60A5FA' },
    { label: 'Treasury Reserve',         pct: 15, color: '#DEC7FF' },
    { label: 'Liquidity & Partnerships', pct: 10, color: '#F59E0B' },
  ];

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">My Portfolio</h1>
          <p className="db-muted">Token holdings, allocation breakdown, and vesting schedule.</p>
        </div>
      </div>

      {HOLDINGS.map(h => {
        const lockProgress = Math.max(0, Math.min(100, 100 - (h.daysLeft / 365) * 100));
        return (
          <div key={h.id} className="db-portfolio-card">
            <div className="db-portfolio-card__header">
              <div className="db-portfolio-card__logo">
                <img src={h.logo} alt={h.token} onError={e => { e.target.style.display='none'; }} />
              </div>
              <div className="db-portfolio-card__title-block">
                <div className="db-portfolio-card__name">{h.token} <span className="db-ticker">{h.ticker}</span></div>
                <div className="db-portfolio-card__chain">{h.blockchain} · <span style={{ fontFamily: 'Courier New', fontSize: 11 }}>{h.contract.slice(0,14)}…</span></div>
              </div>
              <span className="db-lock-badge"><Icon.lock /> {h.status === 'locked' ? 'Locked' : 'Unlocked'}</span>
            </div>

            <div className="db-portfolio-stat-row">
              <div className="db-p-stat"><span className="db-p-stat__label">Token Balance</span><span className="db-p-stat__value">{h.amount.toLocaleString()} {h.ticker}</span></div>
              <div className="db-p-stat"><span className="db-p-stat__label">Invested</span><span className="db-p-stat__value">${h.invested.toLocaleString()}</span></div>
              <div className="db-p-stat"><span className="db-p-stat__label">Current Value</span><span className="db-p-stat__value">${h.currentValue.toLocaleString()}</span></div>
              <div className="db-p-stat"><span className="db-p-stat__label">Unrealized P&amp;L</span><span className="db-p-stat__value db-green">+${h.pnl} (+{h.pnlPct}%)</span></div>
            </div>

            {/* Price sparkline */}
            <div className="db-section-title" style={{ marginTop: 0, marginBottom: 10 }}>Token Price History (12w)</div>
            <div className="db-price-chart-wrap">
              <div className="db-price-chart-y">
                <span>{(Math.max(...h.priceHistory) * 1.01).toFixed(4)}</span>
                <span>{((Math.max(...h.priceHistory) + Math.min(...h.priceHistory)) / 2).toFixed(4)}</span>
                <span>{(Math.min(...h.priceHistory) * 0.99).toFixed(4)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <Sparkline data={h.priceHistory} width="100%" height={72} color="#6B35FF" fill />
              </div>
            </div>

            {/* Lock bar */}
            <div className="db-lock-section" style={{ marginTop: 20 }}>
              <div className="db-lock-section__label">
                <span>Lock Period Progress</span>
                <span className="db-muted">{h.daysLeft} days remaining · Expires {h.lockExpiry}</span>
              </div>
              <div className="db-lock-track"><div className="db-lock-fill" style={{ width: `${lockProgress}%` }} /></div>
              <div className="db-lock-section__legend"><span>Minted Mar 10, 2026</span><span>Unlocks {h.lockExpiry}</span></div>
            </div>

            {/* Donut + allocation */}
            <div className="db-alloc-layout">
              <div className="db-alloc-donut-wrap">
                <DonutChart segments={allocSegments} size={160} thickness={28} />
                <div className="db-alloc-donut-center">
                  <span className="db-alloc-donut-label">Allocation</span>
                </div>
              </div>
              <div className="db-alloc-bars">
                <div className="db-section-title" style={{ marginTop: 0, marginBottom: 14 }}>Token Allocation Breakdown</div>
                {allocSegments.map(a => (
                  <div key={a.label} className="db-alloc-row">
                    <div className="db-alloc-row__label">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, display: 'inline-block', flexShrink: 0 }} />
                        {a.label}
                      </span>
                      <span className="db-alloc-pct">{a.pct}%</span>
                    </div>
                    <div className="db-alloc-track"><div className="db-alloc-fill" style={{ width: `${a.pct}%`, background: a.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Invest ─────────────────────────────────────── */
function TabInvest() {
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState('bank');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const handleSelectToken = t => {
    setSelectedToken(t);
    setAmount('500');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

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
          <button className="db-btn db-btn--primary" onClick={() => { setSubmitted(false); setAmount('500'); }}>Submit Another Intent</button>
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
            onClick={() => handleSelectToken(t)}
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
              {/* Fundraise progress */}
              <div className="db-raise-progress">
                <div className="db-raise-progress__header">
                  <span className="db-raise-label">Raised</span>
                  <span className="db-raise-pct">{Math.round((t.raised / t.target) * 100)}%</span>
                </div>
                <div className="db-raise-track">
                  <div className="db-raise-fill" style={{ width: `${(t.raised / t.target) * 100}%` }} />
                </div>
                <div className="db-raise-meta">
                  <span>${(t.raised / 1000).toFixed(0)}K raised</span>
                  <span>Target ${(t.target / 1000).toFixed(0)}K</span>
                </div>
                <div className="db-raise-investors">{t.investors} investors · spots remaining</div>
              </div>
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
        <div className="db-intent-form-wrap" ref={formRef}>
          <div className="db-intent-form-header">
            <div className="db-intent-form-header__token">
              <img src={selectedToken.logo} alt="" className="db-intent-form-header__logo" onError={e => { e.target.style.display='none'; }} />
              <div>
                <div className="db-intent-form-header__name">{selectedToken.name}</div>
                <div className="db-intent-form-header__ticker">{selectedToken.ticker} · {selectedToken.price} per token</div>
              </div>
            </div>
            <button type="button" className="db-intent-form-header__close" onClick={() => setSelectedToken(null)}>✕</button>
          </div>
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
  const [filter, setFilter] = useState('all');
  const statusStyles = {
    confirmed: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   label: 'Confirmed' },
    approved:  { color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   label: 'Approved' },
    completed: { color: '#9D6FFF', bg: 'rgba(157,111,255,0.1)', label: 'Completed' },
    pending:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'Pending' },
    failed:    { color: '#F87171', bg: 'rgba(248,113,113,0.1)', label: 'Failed' },
  };
  const typeConfig = {
    investment: { label: 'Investment',          icon: '#22C55E', iconBg: 'rgba(34,197,94,0.1)',   iconBorder: 'rgba(34,197,94,0.25)',   svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
    affiliate:  { label: 'Affiliate Commission', icon: '#9D6FFF', iconBg: 'rgba(157,111,255,0.1)', iconBorder: 'rgba(157,111,255,0.25)', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
    redeem:     { label: 'Redemption',           icon: '#F59E0B', iconBg: 'rgba(245,158,11,0.1)',  iconBorder: 'rgba(245,158,11,0.25)',  svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 7v13a2 2 0 0 0 2 2h16v-5"/><path d="M18 12h3v4h-3a2 2 0 0 1 0-4z"/></svg> },
    kyc:        { label: 'KYC Verification',     icon: '#60A5FA', iconBg: 'rgba(96,165,250,0.1)',  iconBorder: 'rgba(96,165,250,0.25)',  svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    onboarding: { label: 'Onboarding',           icon: '#DEC7FF', iconBg: 'rgba(222,199,255,0.1)', iconBorder: 'rgba(222,199,255,0.25)', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DEC7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  };
  const filters = ['all', 'investment', 'affiliate', 'redeem', 'kyc'];
  const filtered = filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.type === filter);

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Transaction History</h1>
          <p className="db-muted">All investment activities, affiliate commissions, redemptions, and KYC events.</p>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="db-tx-summary">
        {[
          { label: 'Total Invested', value: `$${TRANSACTIONS.filter(t=>t.type==='investment').reduce((s,t)=>s+(t.amount||0),0).toLocaleString()}`, color: '#22C55E' },
          { label: 'Commissions Earned', value: `$${TRANSACTIONS.filter(t=>t.type==='affiliate').reduce((s,t)=>s+(t.amount||0),0).toLocaleString()}`, color: '#9D6FFF' },
          { label: 'Total Redeemed', value: `$${TRANSACTIONS.filter(t=>t.type==='redeem').reduce((s,t)=>s+(t.amount||0),0).toLocaleString()}`, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="db-tx-summary-card">
            <span className="db-tx-summary-label">{s.label}</span>
            <span className="db-tx-summary-value" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="db-tx-filters">
        {filters.map(f => (
          <button key={f} className={`db-filter-pill ${filter === f ? 'db-filter-pill--active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="db-tx-table-wrap">
        <table className="db-tx-table">
          <thead>
            <tr>
              <th>#</th><th>Type</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx, idx) => {
              const s = statusStyles[tx.status] || statusStyles.pending;
              const tc = typeConfig[tx.type] || typeConfig.onboarding;
              return (
                <tr key={tx.id}>
                  <td className="db-tx-num">{idx + 1}</td>
                  <td>
                    <div className="db-tx-type-cell">
                      <div className="db-tx-icon" style={{ background: tc.iconBg, borderColor: tc.iconBorder }}>{tc.svg}</div>
                      <span className="db-tx-type-label">{tc.label}</span>
                    </div>
                  </td>
                  <td className="db-tx-amount" style={{ color: tx.type === 'redeem' ? '#F59E0B' : tx.type === 'affiliate' ? '#9D6FFF' : '#5B21B6' }}>
                    {tx.amount ? `${tx.type === 'redeem' ? '−' : '+'}$${tx.amount.toLocaleString()}` : <span className="db-muted">—</span>}
                  </td>
                  <td className="db-tx-method">{tx.method}</td>
                  <td className="db-tx-date">{tx.date}</td>
                  <td>
                    <span className="db-tx-status" style={{ color: s.color, background: s.bg }}>
                      <span className="db-tx-status-dot" style={{ background: s.color }} />{s.label}
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
        {filtered.map(tx => {
          const s = statusStyles[tx.status] || statusStyles.pending;
          const tc = typeConfig[tx.type] || typeConfig.onboarding;
          return (
            <div key={tx.id} className="db-tx-mcard">
              <div className="db-tx-mcard__top">
                <div className="db-tx-mcard__type">
                  <div className="db-tx-icon" style={{ background: tc.iconBg, borderColor: tc.iconBorder }}>{tc.svg}</div>
                  <div>
                    <div className="db-tx-mcard__label">{tc.label}</div>
                    <div className="db-tx-mcard__date">{tx.date}</div>
                  </div>
                </div>
                <span className="db-tx-status" style={{ color: s.color, background: s.bg }}>
                  <span className="db-tx-status-dot" style={{ background: s.color }} />{s.label}
                </span>
              </div>
              <div className="db-tx-mcard__details">
                <div className="db-tx-mcard__row"><span>Amount</span><strong style={{ color: tx.type === 'redeem' ? '#F59E0B' : tx.type === 'affiliate' ? '#9D6FFF' : '#0D0B22' }}>{tx.amount ? `${tx.type === 'redeem' ? '−' : '+'}$${tx.amount.toLocaleString()}` : '—'}</strong></div>
                <div className="db-tx-mcard__row"><span>Method</span><strong>{tx.method}</strong></div>
                <div className="db-tx-mcard__row"><span>Reference</span><strong className="db-tx-hash">{tx.hash}</strong></div>
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

/* ── Wallet ─────────────────────────────────────── */
function TabWallet() {
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemMethod, setRedeemMethod] = useState('usdt_trc20');
  const [redeemAddress, setRedeemAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { copy, copied } = useCopyText();

  const walletAddr = INVESTOR.walletAddress;
  const shortAddr = walletAddr.slice(0, 14) + '…' + walletAddr.slice(-6);
  const minAmounts = { usdt_trc20: 20, usdt_erc20: 50, bank: 200 };
  const selectedMin = minAmounts[redeemMethod] || 20;

  const handleRedeem = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const payoutHistory = TRANSACTIONS.filter(t => t.type === 'redeem' || t.type === 'affiliate');

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Wallet & Earnings</h1>
          <p className="db-muted">Your cash balance, token custody info, and redemption history.</p>
        </div>
      </div>

      {/* Balance cards */}
      <div className="db-wallet-balance-grid">
        <div className="db-wallet-balance-card db-wallet-balance-card--main">
          <div className="db-wallet-balance-card__label">Available Balance</div>
          <div className="db-wallet-balance-card__value">${WALLET_DATA.cashBalance.toLocaleString()}</div>
          <div className="db-wallet-balance-card__sub">Ready to redeem</div>
        </div>
        <div className="db-wallet-balance-card">
          <div className="db-wallet-balance-card__label">Pending Clearance</div>
          <div className="db-wallet-balance-card__value" style={{ color: '#F59E0B' }}>${WALLET_DATA.pendingPayout}</div>
          <div className="db-wallet-balance-card__sub">Clears in 1–3 days</div>
        </div>
        <div className="db-wallet-balance-card">
          <div className="db-wallet-balance-card__label">Lifetime Earned</div>
          <div className="db-wallet-balance-card__value" style={{ color: '#22C55E' }}>${WALLET_DATA.lifetimeEarned.toLocaleString()}</div>
          <div className="db-wallet-balance-card__sub">Affiliates + bonuses</div>
        </div>
      </div>

      {/* Custodial wallet info */}
      <div className="db-section-title">Custodial Wallet</div>
      <div className="db-wallet-addr-card">
        <div className="db-wallet-addr-card__inner">
          <div className="db-wallet-addr-card__net">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 22 22 7 12 2"/></svg>
            Polygon Network · HSM Custodial
          </div>
          <div className="db-wallet-addr-card__addr">{shortAddr}</div>
          <button className="db-wallet-copy-btn" onClick={() => copy(walletAddr, 'addr')}>
            <Icon.copy /> {copied === 'addr' ? 'Copied!' : 'Copy address'}
          </button>
        </div>
        <div className="db-wallet-addr-card__badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Secured
        </div>
      </div>

      {/* Redemption form */}
      <div className="db-section-title">Redeem Earnings</div>
      {submitted ? (
        <div className="db-success-box" style={{ marginBottom: 24 }}>
          <div className="db-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="db-h2">Redemption Submitted</h2>
          <p className="db-muted" style={{ maxWidth: 400, margin: '0 auto 20px' }}>
            Your request to withdraw <strong style={{ color: '#DEC7FF' }}>${Number(redeemAmount).toLocaleString()}</strong> via {WALLET_DATA.payoutMethods.find(m => m.id === redeemMethod)?.label} has been received. Processing within {redeemMethod === 'bank' ? '2–5 business days' : '1–2 hours'}.
          </p>
          <button className="db-btn db-btn--primary" onClick={() => { setSubmitted(false); setRedeemAmount(''); setRedeemAddress(''); }}>
            Submit Another Request
          </button>
        </div>
      ) : (
        <div className="db-intent-form-wrap">
          <form onSubmit={handleRedeem} className="db-intent-form">
            <div className="db-form-group">
              <label className="db-form-label">Payout Method</label>
              <div className="db-payout-methods">
                {WALLET_DATA.payoutMethods.map(m => (
                  <label key={m.id} className={`db-payout-option ${redeemMethod === m.id ? 'db-payout-option--selected' : ''}`}>
                    <input type="radio" name="redeemMethod" value={m.id} checked={redeemMethod === m.id} onChange={() => setRedeemMethod(m.id)} style={{ display: 'none' }} />
                    <span className="db-payout-option__icon">{m.icon}</span>
                    <div>
                      <div className="db-payout-option__label">{m.label}</div>
                      <div className="db-payout-option__desc">{m.desc}</div>
                    </div>
                    {redeemMethod === m.id && <span className="db-payout-option__check"><Icon.check /></span>}
                  </label>
                ))}
              </div>
            </div>

            <div className="db-form-row">
              <div className="db-form-group">
                <label className="db-form-label">Amount (USD)</label>
                <div className="db-input-prefix-wrap">
                  <span className="db-input-prefix">$</span>
                  <input type="number" className="db-form-input db-form-input--prefixed" placeholder={selectedMin} min={selectedMin} max={WALLET_DATA.cashBalance} value={redeemAmount} onChange={e => setRedeemAmount(e.target.value)} required />
                </div>
                <span className="db-form-hint">Available: ${WALLET_DATA.cashBalance} · Min: ${selectedMin}</span>
              </div>
              <div className="db-form-group">
                <label className="db-form-label">
                  {redeemMethod === 'bank' ? 'Bank IBAN / Account No.' : 'Destination Wallet Address'}
                </label>
                <input
                  type="text"
                  className="db-form-input"
                  placeholder={redeemMethod === 'bank' ? 'IBAN / Account number' : 'TRC20 / ERC20 address'}
                  value={redeemAddress}
                  onChange={e => setRedeemAddress(e.target.value)}
                  required
                />
                <span className="db-form-hint">Double-check — payouts cannot be reversed.</span>
              </div>
            </div>

            <div className="db-alert db-alert--info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>Redemptions are processed manually and verified against your KYC identity. All payouts are final once confirmed.</div>
            </div>

            <button type="submit" className="db-btn db-btn--primary" disabled={loading || !redeemAmount || Number(redeemAmount) < selectedMin || !redeemAddress}>
              {loading ? <><span className="db-spinner" /> Processing...</> : `Redeem $${redeemAmount || '—'}`}
            </button>
          </form>
        </div>
      )}

      {/* Payout history */}
      <div className="db-section-title">Payout / Commission History</div>
      {payoutHistory.length === 0 ? (
        <div className="db-empty-state">No transactions yet.</div>
      ) : (
        <div className="db-tx-table-wrap">
          <table className="db-tx-table">
            <thead><tr><th>Type</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {payoutHistory.map(tx => {
                const statusColors = { confirmed: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', label: 'Confirmed' }, pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Pending' } };
                const s = statusColors[tx.status] || statusColors.pending;
                return (
                  <tr key={tx.id}>
                    <td><span style={{ fontWeight: 600, color: tx.type === 'affiliate' ? '#9D6FFF' : '#F59E0B' }}>{tx.type === 'affiliate' ? 'Affiliate Commission' : 'Redemption'}</span></td>
                    <td className="db-tx-amount" style={{ color: tx.type === 'redeem' ? '#F59E0B' : '#9D6FFF' }}>{tx.type === 'redeem' ? '−' : '+'}${tx.amount?.toLocaleString()}</td>
                    <td className="db-tx-method">{tx.method}</td>
                    <td className="db-tx-date">{tx.date}</td>
                    <td><span className="db-tx-status" style={{ color: s.color, background: s.bg }}><span className="db-tx-status-dot" style={{ background: s.color }} />{s.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Affiliate Program ──────────────────────────── */
function TabAffiliate({ investor, enrolled, setEnrolled, directProgramId, onClearDirect }) {
  const { copy, copied } = useCopyText();

  /* ── Step state — lazy-initialised when jumping straight to a program detail ── */
  const [step, setStep] = useState(() => {
    if (directProgramId && AFFILIATE_PROGRAMS.find(p => p.id === directProgramId)) return 'detail';
    return 'tokens';
  });
  const [selectedToken, setSelectedToken] = useState(() => {
    if (!directProgramId) return null;
    const prog = AFFILIATE_PROGRAMS.find(p => p.id === directProgramId);
    return prog ? AFFILIATE_TOKENS.find(t => t.id === prog.tokenId) || null : null;
  });
  const [selectedProgram, setSelectedProgram] = useState(() =>
    directProgramId ? AFFILIATE_PROGRAMS.find(p => p.id === directProgramId) || null : null
  );
  const [enrolling, setEnrolling] = useState(null);

  /* When the sidebar sub-item is clicked while already on the affiliate tab,
     directProgramId changes → navigate to that program's detail. */
  useEffect(() => {
    if (!directProgramId) return;
    const prog = AFFILIATE_PROGRAMS.find(p => p.id === directProgramId);
    if (!prog) return;
    const tok = AFFILIATE_TOKENS.find(t => t.id === prog.tokenId);
    setSelectedToken(tok || null);
    setSelectedProgram(prog);
    setStep('detail');
    onClearDirect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directProgramId]);

  /* Clear directProgramId after initial mount (was consumed by lazy-init above) */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (directProgramId) onClearDirect(); }, []);

  /* Programs for selected token */
  const tokenPrograms = selectedToken
    ? AFFILIATE_PROGRAMS.filter(p => p.tokenId === selectedToken.id)
    : [];

  /* Tier info */
  const currentTier = AFFILIATE_TIERS.find(t => investor.referralCount >= t.refMin && investor.referralCount <= t.refMax) || AFFILIATE_TIERS[0];
  const nextTier = AFFILIATE_TIERS[AFFILIATE_TIERS.indexOf(currentTier) + 1];
  const refNeeded = nextTier ? nextTier.refMin - investor.referralCount : 0;

  const referralLink = selectedProgram
    ? `https://growith.io/ref/${investor.affiliateCode}?p=${selectedProgram.id}`
    : `https://growith.io/ref/${investor.affiliateCode}`;

  const handleEnroll = async (programId) => {
    setEnrolling(programId);
    await new Promise(r => setTimeout(r, 1400));
    setEnrolled(prev => ({ ...prev, [programId]: true }));
    setEnrolling(null);
  };

  /* ── Pool bar helper ── */
  const PoolBar = ({ used, total }) => {
    const pct = Math.min((used / total) * 100, 100);
    return (
      <div className="db-aff-pool-wrap">
        <div className="db-aff-pool-track">
          <div className="db-aff-pool-fill" style={{ width: `${pct}%`, background: pct > 80 ? '#EF4444' : '#9D6FFF' }} />
        </div>
        <span className="db-aff-pool-label">${used.toLocaleString()} of ${total.toLocaleString()} pool used</span>
      </div>
    );
  };

  /* ── Breadcrumb ── */
  const Breadcrumb = () => (
    <div className="db-aff-breadcrumb">
      <button className={`db-aff-bc-item ${step === 'tokens' ? 'db-aff-bc-item--active' : ''}`}
        onClick={() => { setStep('tokens'); setSelectedToken(null); setSelectedProgram(null); }}>
        <span className="db-aff-bc-num">1</span> Select Token
      </button>
      <span className="db-aff-bc-sep">›</span>
      <button className={`db-aff-bc-item ${step === 'programs' ? 'db-aff-bc-item--active' : ''} ${!selectedToken ? 'db-aff-bc-item--disabled' : ''}`}
        onClick={() => { if (selectedToken) { setStep('programs'); setSelectedProgram(null); } }}>
        <span className="db-aff-bc-num">2</span> Choose Program
      </button>
      <span className="db-aff-bc-sep">›</span>
      <button className={`db-aff-bc-item ${step === 'detail' ? 'db-aff-bc-item--active' : ''} ${!selectedProgram ? 'db-aff-bc-item--disabled' : ''}`}
        onClick={() => { if (selectedProgram) setStep('detail'); }}>
        <span className="db-aff-bc-num">3</span> Program Details
      </button>
    </div>
  );

  /* ════════════════ STEP 1 — Token Selection ════════════════ */
  const StepTokens = () => (
    <div>
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Affiliate Program</h1>
          <p className="db-muted">Choose a token to see its available affiliate programs and start earning.</p>
        </div>
        <div className="db-aff-tier-badge" style={{ borderColor: currentTier.color, color: currentTier.color, border: '1.5px solid' }}>
          <Icon.trophy /> {currentTier.name} · {currentTier.commPct}%
        </div>
      </div>
      <Breadcrumb />

      {/* Quick stats */}
      <div className="db-aff-stats">
        {[
          { label: 'Active Referrals', value: investor.referralCount, sub: refNeeded > 0 ? `${refNeeded} more for ${nextTier?.name}` : 'Max tier', icon: '👥' },
          { label: 'Total Earned', value: `$${investor.totalReferralEarned}`, sub: 'All-time commissions', icon: '💰' },
          { label: 'Pending Payout', value: `$${investor.pendingReferralPayout}`, sub: 'Clears in 1–3 days', icon: '⏳' },
          { label: 'Commission Rate', value: `${currentTier.commPct}%`, sub: `${currentTier.name} tier · up to 7%`, icon: '📈' },
        ].map(s => (
          <div key={s.label} className="db-aff-stat-card">
            <span className="db-aff-stat-icon">{s.icon}</span>
            <span className="db-aff-stat-value">{s.value}</span>
            <span className="db-aff-stat-label">{s.label}</span>
            <span className="db-aff-stat-sub">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="db-section-title">Available Tokens</div>
      <div className="db-aff-token-grid">
        {AFFILIATE_TOKENS.map(token => (
          <button key={token.id} className="db-aff-token-card"
            onClick={() => { setSelectedToken(token); setStep('programs'); }}>
            <div className="db-aff-token-card__logo">
              <img src={token.logo} alt={token.name} onError={e => { e.target.style.display='none'; }} />
            </div>
            <div className="db-aff-token-card__info">
              <div className="db-aff-token-card__name">{token.name}</div>
              <div className="db-aff-token-card__ticker">{token.ticker}</div>
              <div className="db-aff-token-card__meta">
                <span className="db-aff-token-card__badge">{token.activePrograms} active program{token.activePrograms !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="db-aff-token-card__arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </button>
        ))}
      </div>

      {/* Tier ladder teaser */}
      <div className="db-section-title" style={{ marginTop: 32 }}>Your Commission Tier</div>
      <div className="db-tier-ladder">
        {AFFILIATE_TIERS.map((tier) => {
          const isActive = tier.name === currentTier.name;
          const progressToNext = isActive && nextTier
            ? ((investor.referralCount - tier.refMin) / (nextTier.refMin - tier.refMin)) * 100
            : isActive ? 100 : 0;
          return (
            <div key={tier.name} className={`db-tier-card ${isActive ? 'db-tier-card--active' : ''}`}>
              <div className="db-tier-card__top">
                <span className="db-tier-card__name" style={{ color: isActive ? tier.color : undefined }}>{tier.name}</span>
                <span className="db-tier-card__rate" style={{ color: tier.color }}>{tier.commPct}%</span>
              </div>
              <div className="db-tier-card__range">{tier.refMin}–{tier.refMax === 999 ? '∞' : tier.refMax} referrals</div>
              <div className="db-tier-card__perk">{tier.extraPerks}</div>
              {isActive && (
                <div className="db-tier-card__progress">
                  <div className="db-tier-card__progress-bar">
                    <div className="db-tier-card__progress-fill" style={{ width: `${progressToNext}%`, background: tier.color }} />
                  </div>
                  <span className="db-tier-card__progress-label">
                    {nextTier ? `${investor.referralCount}/${nextTier.refMin} to ${nextTier.name}` : 'Max tier 🎉'}
                  </span>
                </div>
              )}
              {isActive && <span className="db-tier-card__active-badge" style={{ background: tier.color }}>Current</span>}
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ════════════════ STEP 2 — Program List ════════════════ */
  const StepPrograms = () => (
    <div>
      <div className="db-welcome-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="db-aff-back-btn" onClick={() => { setStep('tokens'); setSelectedToken(null); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <h1 className="db-h1">
              <img src={selectedToken.logo} alt="" style={{ width: 28, height: 28, borderRadius: 6, verticalAlign: 'middle', marginRight: 8 }} onError={e => { e.target.style.display='none'; }} />
              {selectedToken.name} Programs
            </h1>
            <p className="db-muted">{tokenPrograms.length} affiliate program{tokenPrograms.length !== 1 ? 's' : ''} available — pick one to join.</p>
          </div>
        </div>
      </div>
      <Breadcrumb />

      <div className="db-aff-program-list">
        {tokenPrograms.map(prog => {
          const poolPct = Math.min((prog.usedPool / prog.totalPool) * 100, 100);
          const isEnrolled = !!enrolled[prog.id];
          const statusBadge = prog.status === 'ending_soon'
            ? { label: 'Ending Soon', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' }
            : { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' };

          return (
            <div key={prog.id} className={`db-aff-prog-card ${isEnrolled ? 'db-aff-prog-card--enrolled' : ''}`}>
              <div className="db-aff-prog-card__head">
                <div className="db-aff-prog-card__tags">
                  <span className="db-aff-prog-card__tag" style={{ color: prog.tagColor, background: `${prog.tagColor}18`, borderColor: `${prog.tagColor}40` }}>{prog.tag}</span>
                  <span className="db-aff-prog-card__status" style={{ color: statusBadge.color, background: statusBadge.bg }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusBadge.color, display: 'inline-block', marginRight: 5 }} />
                    {statusBadge.label}
                  </span>
                </div>
                <span className="db-aff-prog-card__name">{prog.name}</span>
                <div className="db-aff-prog-card__commission">
                  {prog.commissionType === 'percentage'
                    ? <><span className="db-aff-prog-card__rate">{prog.commissionValue}%</span> per investment</>
                    : <><span className="db-aff-prog-card__rate">${prog.commissionValue}</span> flat per referral</>
                  }
                </div>
              </div>

              <div className="db-aff-prog-card__highlights">
                {prog.highlights.slice(0, 3).map((h, i) => (
                  <div key={i} className="db-aff-prog-card__hl">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={prog.tagColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {h}
                  </div>
                ))}
              </div>

              <div className="db-aff-prog-card__meta">
                <span>Min invest: <strong>${prog.minInvestPerReferral.toLocaleString()}</strong></span>
                <span>Payout: <strong>{prog.payoutDelay}</strong></span>
                <span>Ends: <strong>{prog.endsDate}</strong></span>
              </div>

              <PoolBar used={prog.usedPool} total={prog.totalPool} />

              <div className="db-aff-prog-card__actions">
                <button className="db-btn db-btn--secondary db-btn--sm"
                  onClick={() => { setSelectedProgram(prog); setStep('detail'); }}>
                  View Details
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                {isEnrolled ? (
                  <span className="db-aff-prog-enrolled-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Enrolled
                  </span>
                ) : (
                  <button className="db-btn db-btn--primary db-btn--sm"
                    disabled={enrolling === prog.id}
                    onClick={() => handleEnroll(prog.id)}>
                    {enrolling === prog.id ? 'Joining…' : 'Join Program'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ════════════════ STEP 3 — Program Detail ════════════════ */
  const StepDetail = () => {
    const prog = selectedProgram;
    const isEnrolled = !!enrolled[prog.id];
    const poolPct = Math.min((prog.usedPool / prog.totalPool) * 100, 100);

    return (
      <div>
        <div className="db-welcome-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="db-aff-back-btn" onClick={() => { setStep('programs'); setSelectedProgram(null); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div>
              <h1 className="db-h1">{prog.name}</h1>
              <p className="db-muted">{prog.tokenName} · {prog.tag} affiliate programme</p>
            </div>
          </div>
          {isEnrolled ? (
            <span className="db-aff-prog-enrolled-badge db-aff-prog-enrolled-badge--lg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              You're enrolled
            </span>
          ) : (
            <button className="db-btn db-btn--primary"
              disabled={enrolling === prog.id}
              onClick={() => handleEnroll(prog.id)}>
              {enrolling === prog.id ? 'Joining…' : 'Join This Program'}
            </button>
          )}
        </div>
        <Breadcrumb />

        {/* Hero metrics */}
        <div className="db-aff-detail-metrics">
          <div className="db-aff-detail-metric">
            <div className="db-aff-detail-metric__value" style={{ color: prog.tagColor }}>
              {prog.commissionType === 'percentage' ? `${prog.commissionValue}%` : `$${prog.commissionValue}`}
            </div>
            <div className="db-aff-detail-metric__label">Commission per referral</div>
          </div>
          {prog.bonusThreshold && (
            <div className="db-aff-detail-metric">
              <div className="db-aff-detail-metric__value" style={{ color: '#F59E0B' }}>${prog.bonusUsd}</div>
              <div className="db-aff-detail-metric__label">Bonus after {prog.bonusThreshold} referrals</div>
            </div>
          )}
          <div className="db-aff-detail-metric">
            <div className="db-aff-detail-metric__value">${prog.minInvestPerReferral.toLocaleString()}</div>
            <div className="db-aff-detail-metric__label">Min referred investment</div>
          </div>
          <div className="db-aff-detail-metric">
            <div className="db-aff-detail-metric__value">${(prog.totalPool - prog.usedPool).toLocaleString()}</div>
            <div className="db-aff-detail-metric__label">Pool remaining</div>
          </div>
        </div>

        {/* Pool progress */}
        <div className="db-dark-card" style={{ marginBottom: 18 }}>
          <div className="db-dark-card__title">Affiliate Pool</div>
          <PoolBar used={prog.usedPool} total={prog.totalPool} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: 'rgba(13,11,34,0.45)' }}>
            <span>Programme ends: <strong style={{ color: '#0D0B22' }}>{prog.endsDate}</strong></span>
            <span>Payout delay: <strong style={{ color: '#0D0B22' }}>{prog.payoutDelay}</strong></span>
          </div>
        </div>

        {/* Key highlights */}
        <div className="db-dark-card" style={{ marginBottom: 18 }}>
          <div className="db-dark-card__title">What You Get</div>
          <div className="db-aff-detail-highlights">
            {prog.highlights.map((h, i) => (
              <div key={i} className="db-aff-detail-hl">
                <div className="db-aff-detail-hl__icon" style={{ background: `${prog.tagColor}18`, border: `1px solid ${prog.tagColor}40` }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={prog.tagColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral link (shown after enrollment OR always) */}
        <div className="db-dark-card" style={{ marginBottom: 18 }}>
          <div className="db-dark-card__title">Your Referral Link for This Program</div>
          <div className="db-referral-link-value" style={{ marginTop: 10 }}>
            <span>{referralLink}</span>
            <button className="db-wallet-copy-btn" onClick={() => copy(referralLink, 'ref-detail')}>
              <Icon.copy /> {copied === 'ref-detail' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="db-aff-share-row" style={{ marginTop: 12 }}>
            {[
              { label: 'Telegram', color: '#229ED9', href: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Invest+in+${encodeURIComponent(prog.tokenName)}+on+Growith` },
              { label: 'Twitter / X', color: '#1DA1F2', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=Investing+in+${encodeURIComponent(prog.tokenTicker)}+via+Growith+%F0%9F%9A%80` },
              { label: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent('Join Growith and invest in ' + prog.tokenName + ': ' + referralLink)}` },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="db-share-btn" style={{ borderColor: s.color, color: s.color }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="db-dark-card">
          <div className="db-dark-card__title">Programme Rules</div>
          <ol className="db-aff-rules-list">
            {prog.rules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </div>

        <div className="db-info-box" style={{ marginTop: 18 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>Commissions are credited after your referral&apos;s KYC is approved and payment confirmed. Contact <a href="mailto:affiliates@growith.io" className="db-link">affiliates@growith.io</a> for questions.</div>
        </div>
      </div>
    );
  };

  return (
    <div className="db-tab-content">
      {step === 'tokens'   && <StepTokens />}
      {step === 'programs' && selectedToken   && <StepPrograms />}
      {step === 'detail'   && selectedProgram && <StepDetail />}
    </div>
  );
}

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

      {/* Account Linking */}
      <div className="db-settings-card" style={{ marginTop: 18 }}>
        <div className="db-settings-card__title">Linked Accounts</div>
        <p className="db-muted" style={{ marginBottom: 16, fontSize: 13 }}>Connect social accounts for faster login and enhanced security.</p>
        <div className="db-account-links">
          {investor.linkedAccounts.map(acct => {
            const providerIcons = {
              google: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
              telegram: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#2CA5E0"/><path d="M17.93 7.07l-2.72 12.84c-.19.88-.73 1.1-1.47.68l-4-2.94-1.93 1.85c-.21.21-.39.39-.8.39l.28-4.02 7.32-6.61c.32-.28-.07-.44-.49-.16L6.31 14.1l-3.93-1.22c-.85-.27-.87-.85.18-1.26l15.36-5.92c.71-.26 1.33.17 1.01 1.37z" fill="white"/></svg>,
              discord: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="#5865F2"/></svg>,
              twitter: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.849-8.168-10.651h6.065l4.258 5.632 5.608-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/></svg>,
            };
            return (
              <div key={acct.provider} className={`db-acct-link-card ${acct.linked ? 'db-acct-link-card--linked' : ''}`}>
                <div className="db-acct-link-icon">{providerIcons[acct.provider]}</div>
                <div className="db-acct-link-info">
                  <div className="db-acct-link-label">{acct.provider.charAt(0).toUpperCase() + acct.provider.slice(1)}</div>
                  {acct.linked && <div className="db-acct-link-handle">{acct.handle || acct.email}</div>}
                </div>
                <button className={`db-acct-link-btn ${acct.linked ? 'db-acct-link-btn--unlink' : 'db-acct-link-btn--link'}`}>
                  {acct.linked ? <><Icon.unlink /> Unlink</> : <><Icon.link /> Connect</>}
                </button>
              </div>
            );
          })}
        </div>
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
  { id: 'wallet',        label: 'Wallet',         Icon: Icon.wallet,    badge: '$520' },
  { id: 'affiliate',     label: 'Affiliate',      Icon: Icon.affiliate, badge: 'EARN' },
  { id: 'verification',  label: 'Verification',   Icon: Icon.verification },
  { id: 'settings',      label: 'Settings',       Icon: Icon.settings },
];

const VALID_TABS = new Set(NAV_ITEMS.map(n => n.id));

const Dashboard = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  /* Enrolled affiliate programs — lifted here so the sidebar can show sub-items */
  const [enrolledPrograms, setEnrolledPrograms] = useState({});  // programId → true
  /* When set, the affiliate tab opens directly to this program's detail view */
  const [directAffProgId, setDirectAffProgId] = useState(null);

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
      case 'overview':     return <TabOverview investor={INVESTOR} onNav={handleNav} />;
      case 'portfolio':    return <TabPortfolio />;
      case 'invest':       return <TabInvest />;
      case 'transactions': return <TabTransactions />;
      case 'wallet':       return <TabWallet />;
      case 'affiliate':    return <TabAffiliate investor={INVESTOR} enrolled={enrolledPrograms} setEnrolled={setEnrolledPrograms} directProgramId={directAffProgId} onClearDirect={() => setDirectAffProgId(null)} />;
      case 'verification': return <TabVerification investor={INVESTOR} />;
      case 'settings':     return <TabSettings investor={INVESTOR} />;
      default:             return <TabOverview investor={INVESTOR} onNav={handleNav} />;
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
            <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="db-brand-logo" />
            <span className="db-brand-sub">Investor Panel</span>
          </Link>
          <button className="db-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <Icon.close />
          </button>
        </div>

        {/* Nav */}
        <nav className="db-sidebar-nav">
          {NAV_ITEMS.map(item => {
            const enrolledList = item.id === 'affiliate'
              ? AFFILIATE_PROGRAMS.filter(p => enrolledPrograms[p.id])
              : [];
            return (
              <div key={item.id}>
                <button
                  className={`db-nav-item ${activeTab === item.id ? 'db-nav-item--active' : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  <item.Icon />
                  <span>{item.label}</span>
                  {item.id === 'invest'
                    ? <span className="db-nav-badge">LIVE</span>
                    : item.badge && <span className="db-nav-badge db-nav-badge--earn">{item.badge}</span>
                  }
                </button>
                {enrolledList.length > 0 && (
                  <div className="db-nav-sub-list">
                    {enrolledList.map(prog => (
                      <button
                        key={prog.id}
                        className="db-nav-sub-item"
                        onClick={() => {
                          setDirectAffProgId(prog.id);
                          handleNav('affiliate');
                        }}
                      >
                        <span className="db-nav-sub-dot" style={{ background: prog.tagColor }} />
                        <span className="db-nav-sub-label">{prog.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
