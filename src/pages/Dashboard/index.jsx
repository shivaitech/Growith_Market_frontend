import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { createStripePaymentIntent, saveStripeCheckoutSession } from '../../utils/stripeCheckout';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState, authTokenState } from '../../recoil/auth';
import apiService from '../../services/apiService';
import { clearAuth, getUser, getToken, setUser as saveUser } from '../../utils/secureStorage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import TabAffiliate from './TabAffiliate';
import { AFFILIATE_PROGRAMS, AFFILIATE_STATUS, loadAffiliateApplication, saveAffiliateApplication } from './affiliateData';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PRE-LAUNCH PRICING  â€” 50% early investor discount until April 15
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const TOKEN_NORMAL_PRICE   = 10;    // $10.00 per token after launch
const TOKEN_PRELAUNCH_PRICE = 5;    // $5.00 per token â€” 50% off until Apr 16
const PRELAUNCH_END         = new Date('2026-04-16T00:00:00+05:30'); // midnight IST Apr 16
const IS_PRELAUNCH          = Date.now() < PRELAUNCH_END.getTime();
const EFFECTIVE_TOKEN_PRICE = IS_PRELAUNCH ? TOKEN_PRELAUNCH_PRICE : TOKEN_NORMAL_PRICE;

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MOCK DATA  â€” replace with API calls in production
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const INVESTOR = {
  name: 'Nicholas Ergemia',
  email: 'nicholas@ergemia.com',
  kycStatus: 'not_started',
  walletAddress: '0x3f5CE91d4A458B72b5a4cB4d5F6e7B8C9D0E1234',
  joinedDate: 'March 2026',
  tier: 'Premium',
  affiliateStatus: 'none',
  affiliateCode: 'NICK-X7K2',
  referralCount: 8,
  totalReferralEarned: 640,
  pendingReferralPayout: 120,
  linkClicks: 142,
  linkSignups: 18,
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
    image: '/assets/images/partner/MainShiv.jpeg',
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
  { id: 2, type: 'affiliate', token: 'â€”', amount: 80, date: 'Mar 12, 2026', status: 'confirmed', hash: 'â€”', method: 'Affiliate Commission' },
  { id: 3, type: 'affiliate', token: 'â€”', amount: 80, date: 'Mar 14, 2026', status: 'confirmed', hash: 'â€”', method: 'Affiliate Commission' },
  { id: 4, type: 'redeem', token: 'â€”', amount: 120, date: 'Mar 15, 2026', status: 'pending', hash: 'â€”', method: 'USDT Withdrawal' },
  { id: 5, type: 'kyc', token: 'â€”', amount: null, date: 'Mar 8, 2026', status: 'approved', hash: 'â€”', method: 'Sumsub KYC' },
  { id: 6, type: 'onboarding', token: 'â€”', amount: null, date: 'Mar 8, 2026', status: 'completed', hash: 'â€”', method: 'Growith Onboarding' },
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
    image: '/assets/images/partner/MainShiv.jpeg',
    price: IS_PRELAUNCH ? '$5.00' : '$10.00',
    normalPrice: '$10.00',
    minInvest: '$500', maxInvest: '$25,000',
    lock: '12 months', status: 'LIVE',
    raised: 100000000, target: 1000000000,
    totalTokens: 1000000000, availSupply: 900000000, soldTokens: 100000000,
    investors: 511, network: 'ethereum',
    desc: 'Next-generation AI compute infrastructure token. RAKEZ-registered private placement.'
  },
];

/* Wallet balance breakdown */
const WALLET_DATA = {
  cashBalance: 520,   // earned & available in USD
  pendingPayout: 120, // waiting clearance
  lifetimeEarned: 640,
  currency: 'USD',
  payoutMethods: [
    { id: 'usdt_trc20', label: 'USDT (TRC20)', desc: 'Instant Â· Min $20', icon: 'ðŸ’µ' },
    { id: 'usdt_erc20', label: 'USDT (ERC20)', desc: '~15 min Â· Min $50', icon: 'ðŸ”·' },
    { id: 'bank', label: 'Bank Wire', desc: '2â€“5 days Â· Min $200', icon: 'ðŸ¦' },
  ],
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SHARED UTILITIES
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* â”€â”€ SVG Bar Chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ SVG Sparkline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ SVG Donut Chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ Copy to clipboard helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ Icon helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ KYC status helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TAB COMPONENTS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* â”€â”€ Holdings aggregation: group purchases + airdrops by ticker â”€â”€ */
function aggregateHoldings(approvedPurchases = [], directAirdrops = []) {
  const map = new Map();
  const getKey = x => x.ticker || x.token || 'unknown';

  approvedPurchases.forEach(p => {
    const key = getKey(p);
    if (!map.has(key)) {
      map.set(key, {
        key, token: p.token, ticker: p.ticker, logo: p.logo,
        totalTokens: 0, totalValue: 0, totalInvested: 0,
        purchaseCount: 0, airdropCount: 0,
        entries: [],
      });
    }
    const g = map.get(key);
    const amount = Number(p.amount || 0);
    const value  = Number(p.currentValue || p.invested || 0);
    g.totalTokens += amount;
    g.totalValue  += value;
    g.totalInvested += Number(p.invested || 0);
    g.purchaseCount += 1;
    g.entries.push({
      kind: 'purchase',
      id: p.id,
      amount,
      invested: Number(p.invested || 0),
      currentValue: value,
      date: p.date,
      lockExpiry: p.lockExpiry,
      reference: p.purchaseRef || p.reference || p.id,
      method: p.method,
    });
  });

  directAirdrops.forEach(a => {
    const key = getKey(a);
    if (!map.has(key)) {
      map.set(key, {
        key, token: a.token, ticker: a.ticker, logo: a.logo,
        totalTokens: 0, totalValue: 0, totalInvested: 0,
        purchaseCount: 0, airdropCount: 0,
        entries: [],
      });
    }
    const g = map.get(key);
    const amount = Number(a.tokenQty || 0);
    const value  = Number(a.amountUsd || 0);
    g.totalTokens += amount;
    g.totalValue  += value;
    g.airdropCount += 1;
    g.entries.push({
      kind: 'airdrop',
      id: a.id,
      amount,
      currentValue: value,
      date: a.date,
      airdropType: a.airdropType,
      reference: a.reference,
      adminNote: a.adminNote,
      status: a.status,
    });
  });

  return Array.from(map.values());
}

/* â”€â”€ Unified token holding card (used in Overview, Portfolio, Wallet) â”€â”€ */
function TokenHoldingCard({ holding, onViewDetails }) {
  const fmt = n => Number(n).toLocaleString();
  const fmtPrice = n => Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  const avgCost = holding.totalTokens > 0 && holding.totalInvested > 0
    ? holding.totalInvested / holding.totalTokens
    : 0;
  const pnl = holding.totalValue - holding.totalInvested;
  const pnlPct = holding.totalInvested > 0 ? (pnl / holding.totalInvested) * 100 : 0;
  const hasInvested = holding.totalInvested > 0;
  // Find latest acquisition date from entries
  const latestEntry = holding.entries.reduce((latest, e) => {
    if (!e.date) return latest;
    return !latest || (e.date && new Date(e.date) > new Date(latest.date)) ? e : latest;
  }, null);
  const sourcesLine = [
    holding.purchaseCount > 0 && `${holding.purchaseCount} Purchase${holding.purchaseCount > 1 ? 's' : ''}`,
    holding.airdropCount > 0 && `${holding.airdropCount} Airdrop${holding.airdropCount > 1 ? 's' : ''}`,
  ].filter(Boolean).join(' Â· ');

  return (
    <div className="db-token-holding-card">
      <div className="db-token-holding-card__header">
        <div className="db-token-holding-card__logo">
          <img src={holding.logo} alt="" onError={e => { e.target.style.display='none'; }} />
        </div>
        <div className="db-token-holding-card__title">
          <div className="db-token-holding-card__name">{holding.token}</div>
          <div className="db-token-holding-card__ticker">{holding.ticker}</div>
        </div>
      </div>

      <div className="db-token-holding-card__balance">
        <span className="db-token-holding-card__balance-label">Total Holdings</span>
        <div className="db-token-holding-card__balance-value">
          {fmt(holding.totalTokens)} <span>{holding.ticker}</span>
        </div>
        <div className="db-token-holding-card__balance-usd">â‰ˆ ${fmt(holding.totalValue)} USD</div>
      </div>

      <div className="db-token-holding-card__stats">
        {hasInvested && (
          <div className="db-token-holding-card__stat">
            <span>Invested</span>
            <strong>${fmt(holding.totalInvested)}</strong>
          </div>
        )}
        {hasInvested && (
          <div className="db-token-holding-card__stat">
            <span>Avg Cost</span>
            <strong>${fmtPrice(avgCost)}</strong>
          </div>
        )}
        {hasInvested && (
          <div className="db-token-holding-card__stat">
            <span>P&amp;L</span>
            <strong style={{ color: pnl >= 0 ? '#22C55E' : '#EF4444' }}>
              {pnl >= 0 ? '+' : ''}${fmt(Math.abs(pnl))} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%)
            </strong>
          </div>
        )}
        {!hasInvested && holding.airdropCount > 0 && (
          <div className="db-token-holding-card__stat">
            <span>Acquisition</span>
            <strong style={{ color: '#9D6FFF' }}>Free (Airdrop)</strong>
          </div>
        )}
        {latestEntry && (
          <div className="db-token-holding-card__stat">
            <span>Last Activity</span>
            <strong>{latestEntry.date}</strong>
          </div>
        )}
      </div>

      <div className="db-token-holding-card__footer">
        <span className="db-token-holding-card__sources">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          {sourcesLine}
        </span>
        <button className="db-token-holding-card__btn" onClick={() => onViewDetails(holding)}>
          View Details
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* â”€â”€ Modal showing each purchase/airdrop entry that makes up a holding â”€â”€ */
function TokenHoldingDetailsModal({ holding, onClose }) {
  if (!holding) return null;
  const fmt = n => Number(n).toLocaleString();
  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="db-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <img src={holding.logo} alt="" style={{ width: 40, height: 40, borderRadius: 10, background: '#1a1a2e', flexShrink: 0 }} onError={e => { e.target.style.display='none'; }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{holding.token}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{holding.ticker} Â· {fmt(holding.totalTokens)} tokens Â· ${fmt(holding.totalValue)}</div>
            </div>
          </div>
          <button className="db-modal-close" onClick={onClose}>âœ•</button>
        </div>
        <div className="db-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {holding.entries.length === 0 && (
            <div className="db-wallet-empty">No breakdown available.</div>
          )}
          {holding.entries.map((e, i) => (
            <div key={e.id || i} className={`db-token-detail-row db-token-detail-row--${e.kind}`}>
              <div className="db-token-detail-row__top">
                <span className={`db-wallet-tag ${e.kind === 'airdrop' ? 'db-wallet-tag--purple' : 'db-wallet-tag--green'}`} style={{ textTransform: 'capitalize', fontSize: 11 }}>
                  {e.kind === 'airdrop' ? (e.airdropType ? `${e.airdropType} Airdrop` : 'Airdrop') : 'Purchase'}
                </span>
                {e.date && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{e.kind === 'airdrop' ? 'Received' : 'Approved'} Â· {e.date}</span>}
              </div>
              <div className="db-token-detail-row__stats">
                <div><span>Tokens</span><strong>{fmt(e.amount)} {holding.ticker}</strong></div>
                {e.kind === 'purchase'
                  ? <div><span>Invested</span><strong>${fmt(e.invested)}</strong></div>
                  : <div><span>USD Value</span><strong>${fmt(e.currentValue)}</strong></div>
                }
                <div><span>Value</span><strong style={{ color: e.kind === 'airdrop' ? '#9D6FFF' : '#22C55E' }}>${fmt(e.currentValue)}</strong></div>
                {e.lockExpiry && e.kind === 'purchase' && <div><span>Lock Expiry</span><strong>{e.lockExpiry}</strong></div>}
                {e.status && e.kind === 'airdrop' && <div><span>Status</span><strong style={{ textTransform: 'capitalize' }}>{e.status}</strong></div>}
              </div>
              {e.reference && (
                <div className="db-token-detail-row__ref">
                  <span>Ref</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: 11, wordBreak: 'break-all' }}>{e.reference}</strong>
                </div>
              )}
              {e.adminNote && (
                <div className="db-token-detail-row__note">
                  <span>Note</span><strong>{e.adminNote}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* â”€â”€ Overview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const HOLDINGS_PER_PAGE = 3;

function TabOverview({ investor, approvedPurchases = [], pendingPurchases = [], walletData = null, walletTransactions = [], directAirdrops = [], onNav }) {
  const total    = approvedPurchases.reduce((s, h) => s + (h.currentValue || h.invested || 0), 0);
  const invested = approvedPurchases.reduce((s, h) => s + (h.invested || 0), 0);
  const pnl    = total - invested;
  const pnlPct = invested > 0 ? ((pnl / invested) * 100).toFixed(1) : '0.0';
  const [holdingsPage, setHoldingsPage] = useState(1);
  const [offerDismissed, setOfferDismissed] = useState(false);
  const [detailsToken, setDetailsToken] = useState(null);
  const allHoldings = aggregateHoldings(approvedPurchases, directAirdrops);
  const visibleHoldings = allHoldings.slice(0, holdingsPage * HOLDINGS_PER_PAGE);
  const { copy, copied } = useCopyText();
  const walletBalance = Number(walletData?.cashBalance || walletData?.balance || walletData?.walletBalance || 0);
  const walletAddr    = walletData?.walletAddress || investor?.walletAddress || INVESTOR.walletAddress;

  const statCards = [
    {
      label: 'Portfolio Value', value: `$${total.toLocaleString()}`,
      extra: pnl > 0
        ? <span className="db-stat-change db-stat-change--up"><Icon.arrow_up /> +{pnlPct}% all-time</span>
        : <span className="db-stat-sub">No approved holdings yet</span>,
      chart: <Sparkline data={PORTFOLIO_HISTORY} width={80} height={32} color="#6B35FF" />,
    },
    {
      label: 'Total Invested', value: `$${invested.toLocaleString()}`,
      extra: <span className="db-stat-sub">Across {approvedPurchases.length} token{approvedPurchases.length !== 1 ? 's' : ''}</span>,
    },
    {
      label: 'Unrealized P&L',
      value: pnl >= 0 ? `+$${pnl.toLocaleString()}` : `-$${Math.abs(pnl).toLocaleString()}`,
      valueClass: pnl >= 0 ? 'db-stat-value--green' : '',
      extra: pnl > 0
        ? <span className="db-stat-change db-stat-change--up"><Icon.arrow_up /> +{pnlPct}%</span>
        : <span className="db-stat-sub">â€”</span>,
    },
    {
      label: 'Custodial Wallet',
      value: walletAddr.slice(0, 10) + 'â€¦' + walletAddr.slice(-6),
      valueClass: 'db-stat-value--sm',
      extra: <span className="db-stat-sub">Polygon Â· HSM-backed</span>,
    },
  ];

  return (
    <div className="db-tab-content">
      {/* Welcome bar */}
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Welcome back, {investor.name.split(' ')[0]} ðŸ‘‹</h1>
          <p className="db-muted">Here&apos;s your full investment dashboard â€” updated in real time.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <KycBadge status={investor.kycStatus} />
          <span className="db-tier-badge">{investor.tier}</span>
        </div>
      </div>

      {/* KYC banner */}
      <PrelaunchOfferBanner onNav={onNav} />

      {/* Live Offering spotlight */}
      {!offerDismissed && <div className="db-live-offer-card">
        <div className="db-live-offer-card__img">
          <img src="/assets/images/partner/MainShiv.jpeg" alt="ShivAI" onError={e => { e.target.style.display='none'; }} />
        </div>
        <div className="db-live-offer-card__body">
          <div className="db-live-offer-card__meta">
            <span className="db-live-offer-card__badge">
              <span className="db-invest-live-dot" /> LIVE
            </span>
            <span className="db-live-offer-card__name">ShivAI Token Â· SHIV</span>
          </div>
          <p className="db-live-offer-card__desc">AI-powered infrastructure. Minimum investment $500 â€” UAE Holding-Backed private placement.</p>
          <div className="db-live-offer-card__stats">
            <div><span>Price</span><strong>$0.01</strong></div>
            <div><span>Min.</span><strong>$500</strong></div>
            <div><span>Lock</span><strong>12 months</strong></div>
          </div>
        </div>
        <div className="db-live-offer-card__cta">
          <button className="db-live-invest-btn" onClick={() => onNav?.('invest')}>
            <span className="db-invest-live-dot" />
            Invest Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <p className="db-live-offer-card__note">Verified investors only Â· Secure custody</p>
        </div>
        <button className="db-live-offer-card__close" onClick={() => setOfferDismissed(true)} aria-label="Dismiss">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>}

      {/* Stats grid â€” 4 cols desktop, swiper mobile */}
      <div className="db-stats-grid db-stats-grid--desktop" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
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
      <div className="db-section-title">Portfolio Performance â€” Last 12 Weeks</div>
      <div className="db-chart-card">
        <div className="db-chart-card__header">
          <div>
            <div className="db-chart-card__value">${total.toLocaleString()}</div>
            {pnl > 0
              ? <div className="db-chart-card__change db-green" style={{ color: '#4ade80' }}>â–² +${pnl.toLocaleString()} (+{pnlPct}%) since entry</div>
              : <div className="db-chart-card__change" style={{ color: 'rgba(255,255,255,0.4)' }}>Invest to start building your portfolio</div>
            }
          </div>
          <div className="db-chart-card__legend">
            <span><span className="db-chart-legend-dot" style={{ background: '#9D6FFF' }} />Weekly Value</span>
            <span><span className="db-chart-legend-dot" style={{ background: '#4ade80' }} />Current Week</span>
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
      {allHoldings.length === 0 ? (
        <div className="db-holdings-empty">
          <div className="db-holdings-empty__icon">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(157,111,255,0.35)" strokeWidth="1.5"/>
              <path d="M12 6v6l4 2" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="db-holdings-empty__text">
            <p className="db-holdings-empty__title">Your portfolio is empty</p>
            <p className="db-holdings-empty__sub">Invest from <strong>$500</strong> in tokenised assets with up to <strong>15% projected returns</strong>.</p>
          </div>
          <button className="db-holdings-empty__btn" onClick={() => onNav?.('invest')}>
            <span className="db-invest-live-dot" />
            Invest Now
          </button>
        </div>
      ) : (
        <>
          <div className="db-holdings-grid">
            {visibleHoldings.map(h => (
              <TokenHoldingCard key={h.key} holding={h} onViewDetails={setDetailsToken} />
            ))}
          </div>
          {allHoldings.length > HOLDINGS_PER_PAGE && (
            <div className="db-holdings-pagination">
              {holdingsPage * HOLDINGS_PER_PAGE < allHoldings.length
                ? <button className="db-btn db-btn--secondary db-btn--sm" onClick={() => setHoldingsPage(p => p + 1)}>Show More</button>
                : <button className="db-btn db-btn--secondary db-btn--sm" onClick={() => setHoldingsPage(1)}>Show Less</button>
              }
            </div>
          )}
          <TokenHoldingDetailsModal holding={detailsToken} onClose={() => setDetailsToken(null)} />
        </>
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
        {walletTransactions.length === 0 ? (
          <div className="db-wallet-empty" style={{ padding: '16px 0' }}>No transactions yet.</div>
        ) : walletTransactions.slice(0, 5).map(tx => {
          const statusColors = { confirmed: '#22C55E', approved: '#22C55E', completed: '#9D6FFF', pending: '#F59E0B', failed: '#f87171' };
          const typeLabel = { investment: 'Investment', affiliate: 'Affiliate Commission', redeem: 'Redemption', commission: 'Commission', withdrawal: 'Withdrawal', token_purchase: 'Token Purchase' };
          return (
            <div key={tx.id} className="db-activity-row">
              <div className="db-activity-dot" style={{ background: statusColors[tx.status] || '#9D6FFF' }} />
              <div className="db-activity-body">
                <span className="db-activity-label">{typeLabel[tx.type] || tx.type || 'â€”'}</span>
                <span className="db-activity-date">{tx.date}{tx.time ? ` Â· ${tx.time}` : ''}</span>
              </div>
              <div className="db-activity-amount" style={{ color: (tx.type === 'redeem' || tx.type === 'withdrawal') ? '#F59E0B' : tx.amount ? '#22C55E' : 'rgba(255,255,255,0.5)' }}>
                {tx.amount ? `${(tx.type === 'redeem' || tx.type === 'withdrawal') ? 'âˆ’' : '+'}$${Number(tx.amount).toLocaleString()}` : 'â€”'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* â”€â”€ Portfolio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function TabPortfolio({ onNav, availableTokens = AVAILABLE_TOKENS, approvedPurchases = [], directAirdrops = [] }) {
  const token = availableTokens[0] || AVAILABLE_TOKENS[0];
  const [detailsToken, setDetailsToken] = useState(null);
  const totalInvested  = approvedPurchases.reduce((s, h) => s + (h.invested || 0), 0);
  const airdropTokensHeld = directAirdrops.reduce((s, a) => s + (a.tokenQty || 0), 0);
  const airdropValue    = directAirdrops.reduce((s, a) => s + (a.amountUsd || 0), 0);
  const totalTokensHeld = approvedPurchases.reduce((s, h) => s + (h.amount || 0), 0) + airdropTokensHeld;
  const totalValue     = approvedPurchases.reduce((s, h) => s + (h.currentValue || h.invested || 0), 0) + airdropValue;
  const hasAnyHoldings = approvedPurchases.length > 0 || directAirdrops.length > 0;
  const tokenPrice     = token?.price ? parseFloat(token.price.replace('$', '')) : EFFECTIVE_TOKEN_PRICE;
  const liveValue      = totalTokensHeld > 0 ? totalTokensHeld * tokenPrice : 0;
  const effectiveValue = liveValue > 0 ? liveValue : totalValue;
  const pnl            = effectiveValue - totalInvested;
  const pnlPct         = totalInvested > 0 ? ((pnl / totalInvested) * 100).toFixed(1) : '0.0';

  const soldPct  = token.target > 0 ? Math.min((token.raised / token.target) * 100, 100) : 0;
  const fmtNum   = n => n >= 1000000000 ? `${(n/1000000000).toFixed(2)} Billion` : n >= 1000000 ? `${(n/1000000).toFixed(2)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n);

  const allocSegments = [
    { label: 'Private Placement',              pct: 60, color: '#6B35FF' },
    { label: 'Team, Advisory & Collaboration', pct: 15, color: '#60A5FA' },
    { label: 'Treasury Reserve',               pct: 10, color: '#DEC7FF' },
    { label: 'Ecosystem Fund',                 pct: 10, color: '#9D6FFF' },
    { label: 'Liquidity & Partnerships',       pct:  5, color: '#F59E0B' },
  ];

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">My Portfolio</h1>
          <p className="db-muted">Token holdings, allocation breakdown, and vesting schedule.</p>
        </div>
      </div>
      <PrelaunchOfferBanner onNav={onNav} />

      {/* â”€â”€ Token Summary Card â”€â”€ */}
      <div className="db-portfolio-card">
        <div className="db-portfolio-card__header">
          <div className="db-portfolio-card__logo">
            <img src={token.logo} alt={token.name} onError={e => { e.target.style.display='none'; }} />
          </div>
          <div className="db-portfolio-card__title-block">
            <div className="db-portfolio-card__name">{token.name} <span className="db-ticker">{token.ticker}</span></div>
            <div className="db-portfolio-card__chain">
              {token.network ? token.network.charAt(0).toUpperCase() + token.network.slice(1) : 'Ethereum'}
              {token.status && <span style={{ marginLeft: 8, background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{token.status}</span>}
            </div>
          </div>
          <span className="db-lock-badge"><Icon.lock /> {token.lock || '12 months'}</span>
        </div>

        {/* Token sale progress */}
        <div className="db-raise-progress" style={{ marginBottom: 20 }}>
          <div className="db-raise-progress__header">
            <span className="db-raise-label">Tokens Sold</span>
            <span className="db-raise-pct">{soldPct.toFixed(0)}%</span>
          </div>
          <div className="db-raise-track"><div className="db-raise-fill" style={{ width: `${soldPct}%` }} /></div>
          <div className="db-raise-meta">
            <span>{fmtNum(token.raised || 0)} {token.ticker} sold</span>
            <span>{fmtNum(token.target || 0)} total supply</span>
          </div>
          {token.investors > 0 && (
            <div className="db-raise-investors">{token.investors} investors Â· {fmtNum(token.availSupply || 0)} {token.ticker} available</div>
          )}
        </div>

        {/* Token price + supply stats */}
        <div className="db-portfolio-stat-row">
          <div className="db-p-stat"><span className="db-p-stat__label">Token Price</span><span className="db-p-stat__value" style={{ color: '#6B35FF' }}>{token.price}</span></div>
          <div className="db-p-stat"><span className="db-p-stat__label">Total Supply</span><span className="db-p-stat__value">{fmtNum(token.totalTokens || token.target || 0)} {token.ticker}</span></div>
          <div className="db-p-stat"><span className="db-p-stat__label">Min. Investment</span><span className="db-p-stat__value">{token.minInvest || '$500'}</span></div>
          <div className="db-p-stat"><span className="db-p-stat__label">Lock Period</span><span className="db-p-stat__value">{token.lock || '12 months'}</span></div>
        </div>

        {token.desc && (
          <p style={{ fontSize: 13, color: 'rgba(13,11,34,0.6)', margin: '4px 0 20px', lineHeight: 1.6 }}>{token.desc}</p>
        )}

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

      {/* â”€â”€ My Holdings â”€â”€ */}
      <div className="db-section-title">My Holdings</div>
      {!hasAnyHoldings ? (
        <div className="db-holdings-empty">
          <div className="db-holdings-empty__icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(157,111,255,0.35)" strokeWidth="1.5"/>
              <path d="M12 6v6l4 2" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="db-holdings-empty__text">
            <p className="db-holdings-empty__title">No holdings yet</p>
            <p className="db-holdings-empty__sub">Invest from <strong>$500</strong> in tokenised assets with up to <strong>15% projected returns</strong>.</p>
          </div>
          <button className="db-holdings-empty__btn" onClick={() => onNav?.('invest')}>
            <span className="db-invest-live-dot" />
            Invest Now
          </button>
        </div>
      ) : (
        <>
          <div className="db-holdings-grid">
            {aggregateHoldings(approvedPurchases, directAirdrops).map(h => (
              <TokenHoldingCard key={h.key} holding={h} onViewDetails={setDetailsToken} />
            ))}
          </div>
          <TokenHoldingDetailsModal holding={detailsToken} onClose={() => setDetailsToken(null)} />
        </>
      )}
    </div>
  );
}

/* â”€â”€ Invest â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
/* USDT payment wallet address & QR for purchases */
const USDT_TRC20_ADDRESS = 'TLUTemi8uBbqLTRzHHU1w6d2ExaXFEdXmH';
const USDT_QR_URL = '/assets/images/item/UsdtR.png';

/* â”€â”€ Pre-launch offer banner â”€â”€ */
function PrelaunchOfferBanner({ onNav }) {
  const msLeft  = Math.max(0, PRELAUNCH_END.getTime() - Date.now());
  const daysLeft  = Math.floor(msLeft / 86400000);
  const hoursLeft = Math.floor((msLeft % 86400000) / 3600000);
  if (!IS_PRELAUNCH) return null;
  return (
    <div className="db-prelaunch-banner">
      <div className="db-prelaunch-banner__left">
        <span className="db-prelaunch-banner__tag">âš¡ Pre-Launch Offer</span>
        <div className="db-prelaunch-banner__title">50% Early Investor Discount&nbsp;â€” Ends April 15, 2026</div>
        <div className="db-prelaunch-banner__pricing">
          <span className="db-prelaunch-price-old">$10.00</span>
          <span className="db-prelaunch-arrow">â†’</span>
          <span className="db-prelaunch-price-new">$5.00 per token</span>
          <span className="db-prelaunch-saving">2Ã— tokens for the same investment!</span>
        </div>
      </div>
      <div className="db-prelaunch-banner__right">
        <div className="db-prelaunch-countdown">
          <div className="db-prelaunch-countdown__block">
            <span className="db-prelaunch-countdown__num">{daysLeft}</span>
            <span className="db-prelaunch-countdown__label">days</span>
          </div>
          <span className="db-prelaunch-countdown__sep">:</span>
          <div className="db-prelaunch-countdown__block">
            <span className="db-prelaunch-countdown__num">{String(hoursLeft).padStart(2,'0')}</span>
            <span className="db-prelaunch-countdown__label">hrs</span>
          </div>
          <span className="db-prelaunch-countdown__remaining">left</span>
        </div>
        {onNav && (
          <button className="db-btn db-btn--primary db-prelaunch-banner__cta" onClick={() => onNav('invest')}>
            Invest Now â†’
          </button>
        )}
      </div>
    </div>
  );
}

function TabInvest({ investor, availableTokens = AVAILABLE_TOKENS, dataLoading = false, lastRefreshed = null, onRefresh, onAddPendingPurchase }) {
  const navigate = useNavigate();
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState('');
  // payStep: 'form' | 'payment' | 'done'
  const [payStep, setPayStep] = useState('form');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [screenshotError, setScreenshotError] = useState(false);
  const [purchaseId] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());
  const [stripeLoading, setStripeLoading] = useState(false);
  const [qrZoomed, setQrZoomed] = useState(false);
  const { copy, copied } = useCopyText();
  const formRef = useRef(null);
  const fileRef = useRef(null);

  const tokenPrice = selectedToken ? parseFloat(selectedToken.price.replace('$', '')) : EFFECTIVE_TOKEN_PRICE;
  const tokenQty = amount && !isNaN(amount) && Number(amount) >= 500
    ? Math.floor(Number(amount) / tokenPrice)
    : 0;

  const handleSelectToken = t => {
    setSelectedToken(t);
    setAmount('');
    setPayStep('form');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleProceedToPayment = e => {
    e.preventDefault();
    setPayStep('payment');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleStripeCheckout = async () => {
    if (!selectedToken || tokenQty < 1 || Number(amount) < 500) return;
    const tokenId = selectedToken.id || selectedToken.tokenId || selectedToken._id;
    if (!tokenId) {
      setApiError('Missing token ID â€” cannot start checkout.');
      return;
    }

    setStripeLoading(true);
    setApiError(null);
    try {
      const { normalized } = await createStripePaymentIntent({ tokenId, tokenQty });
      if (!normalized.requestId || !normalized.clientSecret) {
        throw new Error('Payment could not be initialized. Please try again.');
      }
      if (!saveStripeCheckoutSession(normalized)) {
        throw new Error('Could not start secure checkout session.');
      }
      navigate(`/dashboard/invest/pay/${normalized.requestId}`);
    } catch (err) {
      setApiError(err?.message || 'Could not start card payment.');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleScreenshotChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotError(false);
    const reader = new FileReader();
    reader.onload = ev => setScreenshotPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const savePurchase = async (withScreenshot) => {
    setApiError(null);
    const fd = new FormData();
    fd.append('tokenId',     selectedToken.id);
    fd.append('tokenName',   selectedToken.name);
    fd.append('ticker',      selectedToken.ticker);
    fd.append('amountUsd',   String(Number(amount)));
    fd.append('tokenQty',    String(tokenQty));
    fd.append('purchaseRef', purchaseId);
    fd.append('method',      'USDT (TRC20)');
    if (withScreenshot && screenshot) fd.append('screenshot', screenshot);

    let apiId = null;
    try {
      const res = await apiService.createTokenRequest(fd);
      apiId = res?.data?.id || res?.id || null;
    } catch (err) {
      setApiError(err?.message || 'Failed to submit request. Please try again.');
      return; // do NOT proceed to success screen
    }

    const purchasePayload = {
      id:            apiId || Date.now(),
      apiId,
      purchaseRef:   purchaseId,
      token:         selectedToken.name,
      ticker:        selectedToken.ticker,
      logo:          selectedToken.logo,
      tokenId:       selectedToken.id,
      amountUsd:     Number(amount),
      tokenQty,
      date:          new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status:        'pending_verification',
      paymentStatus: withScreenshot ? 'screenshot_uploaded' : 'awaiting_screenshot',
      method:        'USDT (TRC20)',
    };
    onAddPendingPurchase?.(purchasePayload);
    setPayStep('done');
  };

  const handleMarkComplete = async () => {
    if (!screenshot) {
      setScreenshotError(true);
      return;
    }
    setApiError(null);
    setUploading(true);
    await savePurchase(true);
    setUploading(false);
  };

  const handleSkipScreenshot = async () => {
    setApiError(null);
    setUploading(true);
    await savePurchase(false);
    setUploading(false);
  };

  const resetFlow = () => {
    setSelectedToken(null);
    setAmount('');
    setPayStep('form');
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  /* â”€â”€ Done screen â”€â”€ */
  if (payStep === 'done') {
    return (
      <div className="db-tab-content">
        <div className="db-success-box">
          <div className="db-success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="db-h2">Purchase Submitted</h2>
          <p className="db-muted" style={{ maxWidth: 460, margin: '0 auto 20px' }}>
            Your purchase of <strong style={{ color: '#DEC7FF' }}>{tokenQty.toLocaleString()} {selectedToken?.ticker}</strong> worth <strong style={{ color: '#DEC7FF' }}>${Number(amount).toLocaleString()}</strong> USDT is now pending.
            {screenshot ? ' Payment screenshot uploaded.' : ' You can upload a payment screenshot later from Transactions.'}
          </p>
          {!screenshot && (
            <div className="db-alert db-alert--warning" style={{ maxWidth: 460, margin: '0 auto 20px', textAlign: 'left' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>No screenshot uploaded. This purchase is saved as <strong>Pending Purchase</strong> in your Transactions tab. Upload the screenshot there to complete payment verification.</div>
            </div>
          )}
          <div className="db-alert db-alert--info" style={{ maxWidth: 460, margin: '0 auto 20px', textAlign: 'left' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>Tokens will appear in your Wallet with a <strong>Pending Verification</strong> tag. They become active after admin approves your KYC &amp; payment.</div>
          </div>
          <button className="db-btn db-btn--primary" onClick={resetFlow}>Invest Again</button>
          <Link to="/dashboard" className="db-btn db-btn--ghost" style={{ marginTop: 10, display: 'inline-block', textAlign: 'center' }}>Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Invest</h1>
          <p className="db-muted">Browse open offerings and purchase tokens with USDT.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {lastRefreshed && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            className="db-btn db-btn--ghost"
            style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={onRefresh}
            disabled={dataLoading}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={dataLoading ? { animation: 'spin 1s linear infinite' } : {}}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            {dataLoading ? 'Loadingâ€¦' : 'Refresh'}
          </button>
        </div>
      </div>

      <PrelaunchOfferBanner />

      {/* KYC notice banner when not approved */}
      {investor?.kycStatus !== 'approved' && (
        <div className="db-alert db-alert--warning" style={{ marginBottom: 24 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>Your KYC is {investor?.kycStatus === 'not_started' ? 'not yet submitted' : 'under review'}. You can purchase tokens now â€” they will be marked <strong>Pending Verification</strong> until your KYC and payment are approved by the admin.</div>
        </div>
      )}

      {/* Token cards */}
      <div className="db-section-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        Available Offerings
        {dataLoading && <span style={{ width: 14, height: 14, border: '2px solid rgba(157,111,255,0.3)', borderTop: '2px solid #9D6FFF', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
      </div>
      <div className="db-token-grid">
        {availableTokens.map(t => (
          <div
            key={t.id}
            className={`db-token-card ${selectedToken?.id === t.id ? 'db-token-card--selected' : ''}`}
            onClick={() => handleSelectToken(t)}
          >
            <div className="db-token-card__image">
              <img src={t.image} alt={t.name} onError={e => { e.target.style.display='none'; }} />
              <span className={`db-token-card__badge db-token-card__badge--${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span>
              {t.network && <span className="db-token-card__network-chip">{t.network}</span>}
            </div>
            <div className="db-token-card__body">
              {/* Header: logo + name + ticker */}
              <div className="db-token-card__header-row">
                <div className="db-token-card__logo-sm">
                  <img src={t.logo} alt="" onError={e => { e.target.style.display='none'; }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="db-token-card__name">{t.name}</div>
                  <div className="db-token-card__ticker">{t.ticker}</div>
                </div>
              </div>

              <p className="db-token-card__desc">{t.desc}</p>

              {/* Progress bar */}
              <div className="db-raise-progress">
                <div className="db-raise-progress__header">
                  <span className="db-raise-label">Tokens Sold</span>
                  <span className="db-raise-pct">{Math.round((t.raised / t.target) * 100)}%</span>
                </div>
                <div className="db-raise-track">
                  <div className="db-raise-fill" style={{ width: `${Math.min((t.raised / t.target) * 100, 100)}%` }} />
                </div>
                <div className="db-raise-meta">
                  <span>{t.raised >= 1000000 ? `${(t.raised/1000000).toFixed(2)}M` : `${(t.raised/1000).toFixed(0)}K`} sold</span>
                  <span>{t.target >= 1000000 ? `${(t.target/1000000).toFixed(0)}M` : `${(t.target/1000).toFixed(0)}K`} supply</span>
                </div>
              </div>

              {/* Compact pill stats */}
              <div className="db-token-card__pills">
                <div className="db-token-pill">
                  <span>Price</span>
                  <strong>
                    {t.price}
                    {IS_PRELAUNCH && <span className="db-price-50off" style={{ marginLeft: 4 }}>50% OFF</span>}
                  </strong>
                </div>
                <div className="db-token-pill">
                  <span>Min.</span>
                  <strong>{t.minInvest}</strong>
                </div>
                <div className="db-token-pill">
                  <span>Max.</span>
                  <strong>{t.maxInvest}</strong>
                </div>
              </div>
              <div className="db-token-card__pills" style={{ marginTop: 6 }}>
                <div className="db-token-pill">
                  <span>Lock</span>
                  <strong>{t.lock}</strong>
                </div>
                <div className="db-token-pill">
                  <span>Supply</span>
                  <strong>{t.totalTokens >= 1000000000 ? `${(t.totalTokens/1000000000).toFixed(0)} Billion` : t.totalTokens >= 1000000 ? `${(t.totalTokens/1000000).toFixed(0)}M` : `${(t.totalTokens/1000).toFixed(0)}K`}</strong>
                </div>
                <div className="db-token-pill">
                  <span>Investors</span>
                  <strong>511</strong>
                </div>
              </div>

              <div className={`db-token-card__select-indicator ${selectedToken?.id === t.id ? 'active' : ''}`}>
                {selectedToken?.id === t.id ? 'âœ“ Selected' : 'Invest Now'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* â”€â”€ Step 1: Amount + method â”€â”€ */}
      {selectedToken && payStep === 'form' && (
        <div className="db-intent-form-wrap" ref={formRef}>
          <div className="db-intent-form-header">
            <div className="db-intent-form-header__token">
              <img src={selectedToken.logo} alt="" className="db-intent-form-header__logo" onError={e => { e.target.style.display='none'; }} />
              <div>
                <div className="db-intent-form-header__name">{selectedToken.name}</div>
                <div className="db-intent-form-header__ticker">
                  {selectedToken.ticker}
                  {IS_PRELAUNCH ? (
                    <> Â· <span style={{color:'#4ade80',fontWeight:700}}>{selectedToken.price}</span> <span className="db-price-50off" style={{fontSize:'10px'}}>50% OFF</span></>
                  ) : <> Â· {selectedToken.price} per token</>}
                </div>
              </div>
            </div>
            <button type="button" className="db-intent-form-header__close" onClick={() => setSelectedToken(null)}>âœ•</button>
          </div>
          <form onSubmit={handleProceedToPayment} className="db-intent-form">
            <div className="db-form-row">
              <div className="db-form-group">
                <label className="db-form-label">Investment Amount (USDT)</label>
                <div className="db-input-prefix-wrap">
                  <span className="db-input-prefix">$</span>
                  <input
                    type="number"
                    className="db-form-input db-form-input--prefixed"
                    placeholder="Enter amount (min $500)"
                    min="500"
                    max="25000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>
                {amount && Number(amount) < 500
                  ? <span className="db-form-hint db-form-hint--error">Minimum investment is $500. Please enter a higher amount.</span>
                  : amount && Number(amount) > 25000
                  ? <span className="db-form-hint db-form-hint--error">Maximum investment is $25,000. Please enter a lower amount.</span>
                  : <span className="db-form-hint">Min: {selectedToken.minInvest} Â· Max: {selectedToken.maxInvest}</span>
                }
              </div>
              <div className="db-form-group">
                <label className="db-form-label">Estimated Token Allocation</label>
                <div className="db-token-calc">
                  {tokenQty > 0
                    ? <><strong>{tokenQty.toLocaleString()}</strong> {selectedToken.ticker}</>
                    : <span className="db-muted">Enter amount above</span>
                  }
                </div>
              </div>
            </div>

            <div className="db-alert db-alert--info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                Payment is via <strong>USDT (TRC20)</strong>. After proceeding, you will see the Growith wallet QR code and address to send the exact amount.
              </div>
            </div>

            <button type="submit" className="db-btn db-btn--primary" disabled={!amount || Number(amount) < 500}>
              Proceed to Payment â†’
            </button>
          </form>
        </div>
      )}

      {/* â”€â”€ Step 2: USDT QR payment â”€â”€ */}
      {selectedToken && payStep === 'payment' && (
        <div style={{ position: 'relative' }} ref={formRef}>
        {/* KYC lock overlay */}
        {investor?.kycStatus !== 'approved' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            background: 'rgba(10,8,28,0.72)',
            borderRadius: 16,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16, padding: '32px 24px', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(245,158,11,0.12)',
              border: '1.5px solid rgba(245,158,11,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 8 }}>
                KYC Verification Required
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, maxWidth: 340, lineHeight: 1.6 }}>
                {investor?.kycStatus === 'rejected'
                  ? 'Your KYC was rejected. Please resubmit your documents in the Verification tab before completing payment.'
                  : 'Your KYC is currently under review. You will be able to complete your payment once your identity is verified.'}
              </div>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 20,
              background: investor?.kycStatus === 'rejected' ? 'rgba(248,113,113,0.12)' : 'rgba(245,158,11,0.12)',
              border: `1px solid ${investor?.kycStatus === 'rejected' ? 'rgba(248,113,113,0.3)' : 'rgba(245,158,11,0.3)'}`,
              color: investor?.kycStatus === 'rejected' ? '#F87171' : '#F59E0B',
              fontSize: 13, fontWeight: 600,
            }}>
              {investor?.kycStatus === 'rejected' ? 'âœ• KYC Rejected' : 'â³ KYC Under Review'}
            </div>
          </div>
        )}
        <div className="db-intent-form-wrap db-intent-form-wrap--dark" style={{ filter: investor?.kycStatus !== 'approved' ? 'blur(3px)' : 'none', pointerEvents: investor?.kycStatus !== 'approved' ? 'none' : 'auto', userSelect: investor?.kycStatus !== 'approved' ? 'none' : 'auto' }}>
          <div className="db-intent-form-header">
            <div className="db-intent-form-header__token">
              <img src={selectedToken.logo} alt="" className="db-intent-form-header__logo" onError={e => { e.target.style.display='none'; }} />
              <div>
                <div className="db-intent-form-header__name">Pay with USDT (TRC20)</div>
                <div className="db-intent-form-header__ticker">Scan QR or copy address Â· TRC20 / Tron only</div>
              </div>
            </div>
            <button type="button" className="db-intent-form-header__close" onClick={() => setPayStep('form')}>â† Back</button>
          </div>

          <div className="db-usdt-payment">
            {/* Top: QR + details + wallet options */}
            <div className="db-usdt-pay-row">
              <div className="db-usdt-pay-left">
              <div className="db-usdt-qr-col">
                <button
                  type="button"
                  className="db-usdt-qr-box db-usdt-qr-box--tappable"
                  onClick={() => setQrZoomed(true)}
                  aria-label="View QR code in larger view"
                >
                  <img
                    src={USDT_QR_URL}
                    alt="USDT TRC20 QR"
                    className="db-usdt-qr-img"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <span className="db-usdt-qr-view-overlay">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7"/>
                    </svg>
                    View
                  </span>
                </button>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginTop: 2 }}>No memo required</div>
                <div className="db-usdt-network-badge">TRC20 Â· Tron</div>
              </div>
              <div className="db-usdt-info-col">
                <div className="db-usdt-send-amount-row">
                  <span className="db-usdt-send-amount">{amount}</span>
                  <span className="db-usdt-send-currency">USDT</span>
                </div>
                <div className="db-usdt-send-hint">Send exactly this amount Â· TRC20 / Tron only</div>
                <div className="db-usdt-addr-block">
                  <div className="db-usdt-addr-label">Wallet Address</div>
                  <div className="db-usdt-addr-row">
                    <span className="db-usdt-addr">{USDT_TRC20_ADDRESS}</span>
                    <button className="db-wallet-copy-btn" onClick={() => copy(USDT_TRC20_ADDRESS, 'usdt')}>
                      <Icon.copy /> {copied === 'usdt' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="db-usdt-receive-line">
                  <span className="db-usdt-detail-label">You Receive</span>
                  <span className="db-usdt-detail-value">{tokenQty.toLocaleString()} {selectedToken.ticker} <span className="db-usdt-pending-tag">Pending</span></span>
                </div>
                <div className="db-usdt-receive-line">
                  <span className="db-usdt-detail-label">Ref</span>
                  <span className="db-usdt-detail-value db-muted" style={{ fontSize: '12px' }}>{purchaseId}</span>
                </div>
              </div>
              </div>

              {/* Pay with Wallet â€” right column (TRC20 USDT only) */}
              <div className="db-usdt-wallets-col">
                <div className="db-usdt-wallets-label">Pay with Card</div>
                <div className="db-usdt-card-networks">
                  <svg width="32" height="20" viewBox="0 0 38 24" fill="none" aria-label="Visa">
                    <rect width="38" height="24" rx="3" fill="#1A1F71"/>
                    <text x="19" y="16" textAnchor="middle" fill="#fff" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="700">VISA</text>
                  </svg>
                  <svg width="32" height="20" viewBox="0 0 38 24" fill="none" aria-label="Mastercard">
                    <rect width="38" height="24" rx="3" fill="#0A0E27"/>
                    <circle cx="15" cy="12" r="6" fill="#EB001B"/>
                    <circle cx="23" cy="12" r="6" fill="#F79E1B" fillOpacity="0.9"/>
                  </svg>
                  <svg width="32" height="20" viewBox="0 0 38 24" fill="none" aria-label="Amex">
                    <rect width="38" height="24" rx="3" fill="#1F72CD"/>
                    <text x="19" y="16" textAnchor="middle" fill="#fff" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700">AMEX</text>
                  </svg>
                  <svg width="32" height="20" viewBox="0 0 38 24" fill="none" aria-label="Discover">
                    <rect width="38" height="24" rx="3" fill="#0A0E27"/>
                    <text x="19" y="16" textAnchor="middle" fill="#FF6000" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700">DISCOVER</text>
                  </svg>
                </div>
                <button
                  type="button"
                  className="db-usdt-card-btn"
                  onClick={handleStripeCheckout}
                  disabled={stripeLoading}
                >
                  <span className="db-usdt-card-btn__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                      <line x1="6" y1="15" x2="10" y2="15"/>
                    </svg>
                  </span>
                  <span className="db-usdt-card-btn__text">
                    <span className="db-usdt-card-btn__name">{stripeLoading ? 'Preparing checkoutâ€¦' : 'Pay with Card'}</span>
                    <span className="db-usdt-card-btn__sub">Secured by Stripe Â· Instant</span>
                  </span>
                  <span className="db-usdt-card-btn__stripe-badge">
                    <svg width="34" height="14" viewBox="0 0 60 25" fill="none" aria-label="Stripe">
                      <path d="M59.5 14.4c0-4.5-2.2-8-6.4-8s-6.7 3.5-6.7 7.9c0 5.3 3 8 7.2 8 2 0 3.6-.5 4.8-1.1v-3.5c-1.2.6-2.5 1-4.2 1-1.6 0-3.1-.6-3.3-2.6h8.5c.1-.2.1-1.1.1-1.7zm-8.6-1.6c0-1.9 1.2-2.7 2.2-2.7 1 0 2.1.8 2.1 2.7h-4.3zM40.5 6.4c-1.7 0-2.8.8-3.4 1.4l-.2-1.1H33v25.4l4.4-.9v-6.2c.6.5 1.6 1.1 3.2 1.1 3.2 0 6.2-2.6 6.2-8.3 0-5.2-3-7.4-6.3-7.4zm-1 11.4c-1 0-1.7-.4-2.2-.9V11c.5-.5 1.2-.9 2.2-.9 1.7 0 2.9 1.9 2.9 3.8 0 2-1.2 3.9-2.9 3.9zm-12-12.4l4.4-1V0l-4.4 1v4.4zm0 1.3h4.4v15.7h-4.4zm-5.5 1.3l-.3-1.3h-3.8v15.7H22V11.6c1-1.3 2.8-1.1 3.4-.9V6.7c-.6-.2-2.6-.6-3.4 1.3zM12 2.9l-4.3.9v14.1c0 2.6 2 4.5 4.6 4.5 1.5 0 2.5-.3 3.1-.6v-3.5c-.6.2-3.4 1.1-3.4-1.6V10h3.4V6.4h-3.4V2.9zM4.4 11c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1V7c-1.4-.6-2.9-.8-4.3-.8-3.5 0-5.9 1.8-5.9 4.9 0 4.9 6.7 4.1 6.7 6.2 0 .8-.7 1.1-1.7 1.1-1.4 0-3.2-.6-4.7-1.4V21c1.6.7 3.2 1 4.6 1 3.6 0 6.1-1.8 6.1-4.9 0-5.3-6.7-4.3-6.7-6.1z" fill="#635BFF"/>
                    </svg>
                  </span>
                </button>

                <div className="db-usdt-pay-divider"><span>or</span></div>

                <div className="db-usdt-wallets-label">Pay with Wallet</div>
                <div className="db-usdt-wallets-trc20">
                  <span className="db-usdt-wallets-trc20__dot" />
                  USDT Â· TRC20 Â· Tron only
                </div>
                {[
                  {
                    name: 'Trust Wallet',
                    sub: 'USDT (TRC20)',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                        <path d="M16 2L4 6v9c0 7.5 5 13.5 12 15 7-1.5 12-7.5 12-15V6L16 2z" fill="#3375BB"/>
                        <path d="M16 7v18c-4.5-1-8-5.5-8-10V8.5L16 7z" fill="#fff"/>
                      </svg>
                    ),
                    // Trust Wallet universal link â€” coin=195 is Tron, token_id is USDT-TRC20 contract
                    url: `https://link.trustwallet.com/send?coin=195&address=${USDT_TRC20_ADDRESS}&amount=${amount}&token_id=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`,
                  },
                  {
                    name: 'TronLink',
                    sub: 'USDT (TRC20)',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="14" fill="#FF060A"/>
                        <path d="M22 10L9 12l4 12 11-9-2-5z" fill="#fff"/>
                      </svg>
                    ),
                    // TronLink TIP-302 deep link â€” Tron native, TRC20 token contract specified
                    url: `tron://send?address=${USDT_TRC20_ADDRESS}&amount=${amount}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`,
                  },
                  {
                    name: 'Binance',
                    sub: 'Withdraw via TRC20',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="6" fill="#F0B90B"/>
                        <path d="M11 16l5-5 5 5-1.5 1.5L16 14l-3.5 3.5L11 16zm0 0l1.5-1.5L16 18l3.5-3.5L21 16l-5 5-5-5zm5-3l1.5 1.5L16 16l-1.5-1.5L16 13zm-7 3l1.5-1.5L12 16l-1.5 1.5L9 16zm13 0l1.5-1.5L26 16l-1.5 1.5L22 16z" fill="#fff"/>
                      </svg>
                    ),
                    // Binance web withdraw page â€” network=TRX forces TRC20
                    url: `https://www.binance.com/en/my/wallet/account/main/withdrawal/crypto/USDT?network=TRX&address=${USDT_TRC20_ADDRESS}&amount=${amount}`,
                  },
                  {
                    name: 'Klever',
                    sub: 'USDT (TRC20)',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="14" fill="#9B57E0"/>
                        <path d="M11 9h3l3 5-3 5H11l3-5-3-5zm7 0h3l-5 7 5 7h-3l-5-7 5-7z" fill="#fff"/>
                      </svg>
                    ),
                    // Klever Wallet TRC20 USDT
                    url: `klever://send?to=${USDT_TRC20_ADDRESS}&amount=${amount}&asset=USDT&network=TRX`,
                  },
                ].map(w => (
                  <a
                    key={w.name}
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="db-usdt-wallet-btn"
                  >
                    <span className="db-usdt-wallet-btn__icon">{w.icon}</span>
                    <span className="db-usdt-wallet-btn__text">
                      <span className="db-usdt-wallet-btn__name">{w.name}</span>
                      <span className="db-usdt-wallet-btn__sub">{w.sub}</span>
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.55, flexShrink: 0 }}>
                      <path d="M7 17l10-10M7 7h10v10"/>
                    </svg>
                  </a>
                ))}
                <div className="db-usdt-wallets-hint">
                  âš  Always confirm <strong>TRC20 / Tron</strong> network before sending. Other networks result in permanent loss.
                </div>
              </div>
            </div>

            <div className="db-alert db-alert--warning db-alert--compact" style={{ margin: '12px 0' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>Only send Tether USDT (TRC20) assets to this address. Other assets will be lost forever.</div>
            </div>

            {/* Screenshot upload */}
            <div className="db-usdt-screenshot-section">
              <div className="db-usdt-screenshot-title">
                Payment Screenshot <span className="db-usdt-optional">Â· optional, upload later from Transactions</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleScreenshotChange}
              />
              {screenshotPreview ? (
                <div className="db-usdt-screenshot-preview">
                  <img src={screenshotPreview} alt="screenshot preview" />
                  <button
                    type="button"
                    className="db-usdt-screenshot-remove"
                    onClick={() => { setScreenshot(null); setScreenshotPreview(null); fileRef.current.value = ''; }}
                  >âœ• Remove</button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className={`db-kyc-upload-box db-usdt-screenshot-upload${screenshotError ? ' db-usdt-screenshot-upload--error' : ''}`}
                    onClick={() => { setScreenshotError(false); fileRef.current?.click(); }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Click to upload screenshot</span>
                  </button>
                  {screenshotError && (
                    <div className="db-usdt-screenshot-error">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Please upload your payment screenshot to continue.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="db-usdt-actions">
              {apiError && (
                <div className="db-api-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {apiError}
                </div>
              )}
              <button
                type="button"
                className={`db-btn db-btn--primary${uploading ? ' db-btn--loading' : ''}`}
                disabled={uploading}
                onClick={handleMarkComplete}
              >
                {uploading ? <><span className="db-spinner" /> Submitting...</> : 'Mark Payment Complete'}
              </button>
              <button
                type="button"
                className={`db-btn db-btn--ghost${uploading ? ' db-btn--loading' : ''}`}
                disabled={uploading}
                onClick={handleSkipScreenshot}
              >
                {uploading ? <><span className="db-spinner" /> Saving...</> : 'Skip â€” upload later'}
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* â”€â”€ QR Zoom Modal â”€â”€ */}
      {qrZoomed && (
        <div
          onClick={() => setQrZoomed(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10001,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(7, 10, 41, 0.88)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 380, width: '100%',
              background: '#fff',
              borderRadius: 20,
              padding: 24,
              position: 'relative',
              boxShadow: '0 24px 80px rgba(92,39,254,0.4)',
            }}
          >
            <button
              type="button"
              onClick={() => setQrZoomed(false)}
              aria-label="Close"
              style={{
                position: 'absolute', top: -16, right: -16,
                width: 36, height: 36, borderRadius: '50%',
                background: '#0F1330',
                border: '1.5px solid rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 18, lineHeight: 1,
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >Ã—</button>
            <img
              src={USDT_QR_URL}
              alt="USDT TRC20 QR Code"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div style={{
              marginTop: 16,
              padding: '10px 14px',
              background: '#0F1330',
              borderRadius: 10,
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#fff',
              wordBreak: 'break-all',
              textAlign: 'center',
              letterSpacing: '0.02em',
            }}>{USDT_TRC20_ADDRESS}</div>
            <div style={{
              marginTop: 8,
              fontSize: 11,
              color: '#666',
              textAlign: 'center',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>USDT Â· TRC20 Â· Tron Only Â· No Memo</div>
            <button
              type="button"
              onClick={() => copy(USDT_TRC20_ADDRESS, 'usdt-zoom')}
              style={{
                marginTop: 14,
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #5C27FE, #7B45FE)',
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Conthrax', sans-serif",
                cursor: 'pointer',
                letterSpacing: '0.03em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {copied === 'usdt-zoom' ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <Icon.copy /> Copy Address
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/* â”€â”€ Transactions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function TabTransactions({ pendingPurchases = [], walletTransactions = [], onUploadScreenshot }) {
  const [filter, setFilter] = useState('all');
  const [uploadingId, setUploadingId] = useState(null);
  const [localPreviews, setLocalPreviews] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const fileRefs = useRef({});

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
  const txRows = walletTransactions.length > 0 ? walletTransactions : [];
  const filtered = filter === 'all' ? txRows : txRows.filter(t => t.type === filter);

  const awaitingScreenshot = pendingPurchases.filter(p => p.paymentStatus === 'awaiting_screenshot');
  const uploadedPurchases  = pendingPurchases.filter(p => p.paymentStatus === 'screenshot_uploaded');

  const handleScreenshotUpload = async (purchaseId, file, purchase) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLocalPreviews(prev => ({ ...prev, [purchaseId]: ev.target.result }));
    reader.readAsDataURL(file);
    setUploadingId(purchaseId);
    setUploadErrors(prev => ({ ...prev, [purchaseId]: null }));
    try {
      const fd = new FormData();
      fd.append('purchaseRef', purchase?.purchaseRef || String(purchaseId));
      if (purchase?.tokenId) fd.append('tokenId', purchase.tokenId);
      fd.append('tokenName',   purchase?.token  || '');
      fd.append('ticker',      purchase?.ticker || '');
      fd.append('amountUsd',   String(purchase?.amountUsd || 0));
      fd.append('tokenQty',    String(purchase?.tokenQty  || 0));
      fd.append('method',      purchase?.method || 'USDT (TRC20)');
      fd.append('screenshot',  file);
      await apiService.createTokenRequest(fd);
    } catch (err) {
      console.warn('screenshot upload failed:', err?.message);
      setUploadErrors(prev => ({ ...prev, [purchaseId]: 'Upload failed. Please try again.' }));
      setUploadingId(null);
      return;
    }
    onUploadScreenshot?.(purchaseId, file);
    setUploadingId(null);
  };

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">Transaction History</h1>
          <p className="db-muted">All investment activities, affiliate commissions, redemptions, and KYC events.</p>
        </div>
      </div>

      {/* â”€â”€ Pending Purchases section â”€â”€ */}
      {pendingPurchases.length > 0 && (
        <>
          <div className="db-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Pending Purchases
            <span className="db-pending-count-badge">{pendingPurchases.length}</span>
          </div>
          <div className="db-pending-purchases">
            {pendingPurchases.map(p => (
              <div key={p.id} className="db-pending-card">
                <div className="db-pending-card__top">
                  <div className="db-pending-card__token">
                    <img src={p.logo} alt="" className="db-pending-card__logo" onError={e => { e.target.style.display='none'; }} />
                    <div>
                      <div className="db-pending-card__name">{p.token} <span className="db-usdt-pending-tag">Pending Verification</span></div>
                      <div className="db-pending-card__meta">{p.tokenQty?.toLocaleString()} {p.ticker} Â· ${p.amountUsd?.toLocaleString()} USDT Â· {p.date}</div>
                    </div>
                  </div>
                  <div className="db-pending-card__ref">Ref: {p.purchaseRef}</div>
                </div>

                {p.paymentStatus === 'awaiting_screenshot' ? (
                  <div className="db-pending-card__upload">
                    <div className="db-pending-card__upload-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Payment screenshot not yet uploaded
                    </div>
                    <input
                      ref={el => { fileRefs.current[p.id] = el; }}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => handleScreenshotUpload(p.id, e.target.files?.[0], p)}
                    />
                    {localPreviews[p.id] ? (
                      <div className="db-usdt-screenshot-preview" style={{ marginTop: 8 }}>
                        <img src={localPreviews[p.id]} alt="preview" />
                        {uploadingId === p.id && <span className="db-pending-uploading"><span className="db-spinner" /> Uploadingâ€¦</span>}
                      </div>
                    ) : (
                      <>
                        <button
                          className="db-btn db-btn--outline-sm"
                          disabled={uploadingId === p.id}
                          onClick={() => fileRefs.current[p.id]?.click()}
                        >
                          {uploadingId === p.id ? <><span className="db-spinner" /> Uploadingâ€¦</> : 'Upload Screenshot'}
                        </button>
                        {uploadErrors[p.id] && (
                          <div style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{uploadErrors[p.id]}</div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="db-pending-card__uploaded">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Screenshot uploaded â€” awaiting admin approval
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

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
              <th>#</th><th>Type</th><th>Amount</th><th>Description</th><th>Date</th><th>Status</th><th>Ref ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No transactions yet</td></tr>
            ) : filtered.map((tx, idx) => {
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
                  <td className="db-tx-amount" style={{ color: tx.type === 'redeem' ? '#F59E0B' : tx.type === 'affiliate' ? '#9D6FFF' : '#22C55E' }}>
                    {tx.amount ? `${tx.type === 'redeem' ? 'âˆ’' : '+'}$${tx.amount.toLocaleString()} ${tx.currency || 'USD'}` : <span className="db-muted">â€”</span>}
                  </td>
                  <td className="db-tx-method" style={{ maxWidth: 220, whiteSpace: 'normal', fontSize: 12, color: 'rgba(255,255,255,0.55)' }} title={tx.desc}>{tx.desc || tx.method || 'â€”'}</td>
                  <td className="db-tx-date">
                    <div>{tx.date}</div>
                    {tx.time && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{tx.time}</div>}
                  </td>
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
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No transactions yet</div>
        ) : filtered.map(tx => {
          const s = statusStyles[tx.status] || statusStyles.pending;
          const tc = typeConfig[tx.type] || typeConfig.onboarding;
          return (
            <div key={tx.id} className="db-tx-mcard">
              <div className="db-tx-mcard__top">
                <div className="db-tx-mcard__type">
                  <div className="db-tx-icon" style={{ background: tc.iconBg, borderColor: tc.iconBorder }}>{tc.svg}</div>
                  <div>
                    <div className="db-tx-mcard__label">{tc.label}</div>
                    <div className="db-tx-mcard__date">{tx.date}{tx.time ? ` Â· ${tx.time}` : ''}</div>
                  </div>
                </div>
                <span className="db-tx-status" style={{ color: s.color, background: s.bg }}>
                  <span className="db-tx-status-dot" style={{ background: s.color }} />{s.label}
                </span>
              </div>
              <div className="db-tx-mcard__details">
                <div className="db-tx-mcard__row"><span>Amount</span><strong style={{ color: tx.type === 'redeem' ? '#F59E0B' : tx.type === 'affiliate' ? '#9D6FFF' : '#22C55E' }}>{tx.amount ? `${tx.type === 'redeem' ? 'âˆ’' : '+'}$${tx.amount.toLocaleString()} ${tx.currency || 'USD'}` : 'â€”'}</strong></div>
                <div className="db-tx-mcard__row"><span>Details</span><strong style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>{tx.desc || tx.method || 'â€”'}</strong></div>
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

/* â”€â”€ Wallet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function TabWallet({ investor, pendingPurchases = [], approvedPurchases = [], walletData = null, walletRequests = [], directAirdrops = [], dataLoading = false, lastRefreshed = null, onRefresh, onNav }) {
  const { copy, copied } = useCopyText();
  const [viewToken, setViewToken] = useState(null);
  const [detailsToken, setDetailsToken] = useState(null);
  const walletAddr = walletData?.walletAddress || investor?.walletAddress || INVESTOR.walletAddress;
  const shortAddr = walletAddr.slice(0, 12) + 'â€¦' + walletAddr.slice(-6);

  // â”€â”€ Map API wallet holdings â†’ internal shape â”€â”€
  const buildApprovedRows = () => {
    const raw = walletData?.holdings ?? walletData?.tokens ?? walletData?.approvedTokens ?? null;
    const fromWallet = Array.isArray(raw) && raw.length > 0
      ? raw.map((h, i) => ({
          id:           h.id || h._id || i,
          token:        h.tokenName   || h.token  || h.name  || '',
          ticker:       h.ticker      || h.symbol || '',
          logo:         h.logo        || h.logoUrl || '/assets/images/icon/shivAiToken.png',
          amount:       Number(h.tokenQty  || h.amount   || h.qty    || 0),
          invested:     Number(h.amountUsd || h.invested  || h.paid   || 0),
          currentValue: Number(h.currentValue || h.value  || h.amountUsd || h.invested || 0),
          lockExpiry:   h.lockExpiry  || h.expiresAt || 'â€”',
          status:       'active',
        }))
      : [];
    // Merge wallet holdings + approved purchase requests, deduplicate by id
    const seen = new Set(fromWallet.map(h => String(h.id)));
    const fromRequests = approvedPurchases.filter(p => !seen.has(String(p.id)));
    return [...fromWallet, ...fromRequests];
  };

  // All token transaction rows: pending purchases + approved holdings + airdrops
  const pendingRows   = pendingPurchases;
  const approvedRows  = buildApprovedRows();
  // Use dedicated API airdrops; fall back to walletData if API returns nothing
  const rawWalletAirdrops = walletData?.airdrops ?? walletData?.airdropTokens ?? walletData?.airdrop ?? null;
  const airdropRows = directAirdrops.length > 0
    ? directAirdrops
    : Array.isArray(rawWalletAirdrops)
      ? rawWalletAirdrops.map((a, i) => ({
          id:          a.id || a._id || `airdrop-${i}`,
          token:       a.tokenName || a.token || a.name || '',
          ticker:      a.ticker   || a.symbol || '',
          logo:        a.logo     || a.logoUrl || '/assets/images/icon/shivAiToken.png',
          tokenQty:    Number(a.tokenQty || a.qty || a.quantity || 0),
          amountUsd:   Number(a.amountUsd || a.amount || 0),
          reference:   a.reference || a.ref || '',
          airdropType: a.airdropType || a.type || '',
          adminNote:   a.adminNote || a.reason || a.description || '',
          status:      (a.status || 'completed').toLowerCase(),
          date:        (a.createdAt || a.date)
            ? new Date(a.createdAt || a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'â€”',
          completedAt: a.completedAt
            ? new Date(a.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : null,
        }))
      : [];

  return (
    <div className="db-tab-content">
      <div className="db-welcome-bar">
        <div>
          <h1 className="db-h1">My Wallet</h1>
          <p className="db-muted">Your token holdings, pending purchases and wallet requests.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {lastRefreshed && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            className="db-btn db-btn--ghost"
            style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={onRefresh}
            disabled={dataLoading}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={dataLoading ? { animation: 'spin 1s linear infinite' } : {}}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            {dataLoading ? 'Loadingâ€¦' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* â”€â”€ Active Tokens (All) â€” approved + airdrops combined â”€â”€ */}
      <div className="db-wallet-section-header">
        <div className="db-wallet-section-title">
          <span className="db-wallet-section-dot db-wallet-section-dot--green" />
          Active Tokens (All)
          <span style={{ marginLeft: 8, fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            {approvedRows.length + airdropRows.length} total
          </span>
        </div>
      </div>
      {(approvedRows.length + airdropRows.length) === 0 ? (
        <div className="db-wallet-empty">No active tokens yet.</div>
      ) : (
        <div className="db-holdings-grid">
          {aggregateHoldings(approvedRows, airdropRows).map(h => (
            <TokenHoldingCard key={h.key} holding={h} onViewDetails={setDetailsToken} />
          ))}
        </div>
      )}
      <TokenHoldingDetailsModal holding={detailsToken} onClose={() => setDetailsToken(null)} />

      {/* â”€â”€ Approved Tokens â”€â”€ */}
      <div className="db-wallet-section-header" style={{ marginTop: 28 }}>
        <div className="db-wallet-section-title">
          <span className="db-wallet-section-dot db-wallet-section-dot--green" />
          Approved Tokens
        </div>
      </div>
      {approvedRows.length === 0 ? (
        <div className="db-wallet-empty">No approved token holdings yet.</div>
      ) : (
        <div className="db-wallet-token-grid">
          {approvedRows.map(h => (
            <div key={h.id} className="db-wallet-token-card">
              <div className="db-wallet-token-card__top">
                <img src={h.logo} alt="" className="db-wallet-token-card__logo" onError={e => { e.target.style.display='none'; }} />
                <div className="db-wallet-token-card__info">
                  <span className="db-wallet-token-card__name">{h.token}</span>
                  <span className="db-wallet-token-card__ticker">{h.ticker}</span>
                </div>
                <span className="db-wallet-tag db-wallet-tag--green">Active</span>
              </div>
              <div className="db-wallet-token-card__stats">
                <div className="db-wallet-token-stat"><span>Tokens</span><strong>{h.amount?.toLocaleString()}</strong></div>
                <div className="db-wallet-token-stat"><span>Invested</span><strong>${h.invested?.toLocaleString()}</strong></div>
                <div className="db-wallet-token-stat"><span>Current Value</span><strong style={{ color: '#22C55E' }}>${h.currentValue?.toLocaleString()}</strong></div>
                <div className="db-wallet-token-stat"><span>Lock Expiry</span><strong>{h.lockExpiry}</strong></div>
              </div>
              <button
                className="db-wallet-view-btn"
                onClick={() => setViewToken(h)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* â”€â”€ Approved Token Detail Modal â”€â”€ */}
      {viewToken && (
        <div className="db-modal-overlay" onClick={() => setViewToken(null)}>
          <div className="db-modal-box" onClick={e => e.stopPropagation()}>
            <div className="db-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={viewToken.logo} alt="" style={{ width: 36, height: 36, borderRadius: 8, background: '#1a1a2e' }} onError={e => { e.target.style.display='none'; }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{viewToken.token}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{viewToken.ticker}</div>
                </div>
              </div>
              <button className="db-modal-close" onClick={() => setViewToken(null)}>âœ•</button>
            </div>
            <div className="db-modal-body">
              <div className="db-modal-row">
                <span>Status</span>
                <span className="db-wallet-tag db-wallet-tag--green" style={{ padding: '2px 10px', fontSize: 12 }}>Active</span>
              </div>
              <div className="db-modal-row">
                <span>Token Name</span>
                <strong>{viewToken.token}</strong>
              </div>
              <div className="db-modal-row">
                <span>Ticker</span>
                <strong>{viewToken.ticker || 'â€”'}</strong>
              </div>
              <div className="db-modal-row">
                <span>Token Qty</span>
                <strong>{viewToken.amount?.toLocaleString() ?? 'â€”'}</strong>
              </div>
              <div className="db-modal-row">
                <span>Amount Invested</span>
                <strong>${viewToken.invested?.toLocaleString() ?? 'â€”'} USD</strong>
              </div>
              <div className="db-modal-row">
                <span>Current Value</span>
                <strong style={{ color: '#22C55E' }}>${viewToken.currentValue?.toLocaleString() ?? 'â€”'} USD</strong>
              </div>
              {viewToken.lockExpiry && viewToken.lockExpiry !== 'â€”' && (
                <div className="db-modal-row">
                  <span>Lock Expiry</span>
                  <strong>{viewToken.lockExpiry}</strong>
                </div>
              )}
              {viewToken.date && (
                <div className="db-modal-row">
                  <span>Approved On</span>
                  <strong>{viewToken.date}</strong>
                </div>
              )}
              {viewToken.purchaseRef && (
                <div className="db-modal-row">
                  <span>Purchase Ref</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>{viewToken.purchaseRef}</strong>
                </div>
              )}
              {viewToken.method && (
                <div className="db-modal-row">
                  <span>Payment Method</span>
                  <strong>{viewToken.method}</strong>
                </div>
              )}
              {viewToken.id && (
                <div className="db-modal-row">
                  <span>ID</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>{viewToken.id}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ Airdrop Tokens â”€â”€ */}
      <div className="db-wallet-section-header" style={{ marginTop: 28 }}>
        <div className="db-wallet-section-title">
          <span className="db-wallet-section-dot db-wallet-section-dot--purple" />
          Airdrop Tokens
        </div>
      </div>
      {airdropRows.length === 0 ? (
        <div className="db-wallet-empty">No airdrops received yet.</div>
      ) : (
        <div className="db-wallet-token-grid">
          {airdropRows.map(a => (
            <div key={a.id} className="db-wallet-token-card">
              <div className="db-wallet-token-card__top">
                <img src={a.logo} alt="" className="db-wallet-token-card__logo" onError={e => { e.target.style.display='none'; }} />
                <div className="db-wallet-token-card__info">
                  <span className="db-wallet-token-card__name">{a.token}</span>
                  <span className="db-wallet-token-card__ticker">{a.ticker}</span>
                </div>
                <span className="db-wallet-tag db-wallet-tag--purple" style={{ textTransform: 'capitalize' }}>
                  {a.airdropType ? `${a.airdropType} Airdrop` : 'Airdrop'}
                </span>
              </div>
              <div className="db-wallet-token-card__stats">
                <div className="db-wallet-token-stat"><span>Tokens</span><strong>{a.tokenQty?.toLocaleString()} {a.ticker}</strong></div>
                <div className="db-wallet-token-stat"><span>Value</span><strong style={{ color: '#22C55E' }}>${a.amountUsd?.toLocaleString()} USD</strong></div>
                <div className="db-wallet-token-stat"><span>Date</span><strong>{a.date}</strong></div>
                {a.completedAt && <div className="db-wallet-token-stat"><span>Completed</span><strong>{a.completedAt}</strong></div>}
                {a.adminNote && <div className="db-wallet-token-stat" style={{ gridColumn: '1/-1' }}><span>Note</span><strong>{a.adminNote}</strong></div>}
                {a.reference && <div className="db-wallet-token-stat" style={{ gridColumn: '1/-1' }}><span>Reference</span><strong style={{ fontFamily: 'monospace', fontSize: 11 }}>{a.reference}</strong></div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* â”€â”€ Pending Tokens â”€â”€ */}
      <div className="db-wallet-section-header" style={{ marginTop: 28 }}>
        <div className="db-wallet-section-title">
          <span className="db-wallet-section-dot db-wallet-section-dot--amber" />
          Pending Tokens
        </div>
      </div>
      {pendingRows.length === 0 ? (
        <div className="db-wallet-empty">
          No pending token purchases.{' '}
          <button className="db-wallet-link-btn" onClick={() => onNav?.('invest')}>Invest now â†’</button>
        </div>
      ) : (
        <div className="db-wallet-token-grid">
          {pendingRows.map(p => (
            <div key={p.id} className="db-wallet-token-card">
              <div className="db-wallet-token-card__top">
                <img src={p.logo} alt="" className="db-wallet-token-card__logo" onError={e => { e.target.style.display='none'; }} />
                <div className="db-wallet-token-card__info">
                  <span className="db-wallet-token-card__name">{p.token}</span>
                  <span className="db-wallet-token-card__ticker">{p.ticker}</span>
                </div>
                <span className="db-wallet-tag db-wallet-tag--amber">Pending</span>
              </div>
              <div className="db-wallet-token-card__stats">
                <div className="db-wallet-token-stat"><span>Tokens</span><strong>{p.tokenQty?.toLocaleString()}</strong></div>
                <div className="db-wallet-token-stat"><span>Paid</span><strong>${p.amountUsd?.toLocaleString()} USDT</strong></div>
                <div className="db-wallet-token-stat"><span>Date</span><strong>{p.date}</strong></div>
                <div className="db-wallet-token-stat">
                  <span>Payment Proof</span>
                  <strong style={{ color: p.paymentStatus === 'screenshot_uploaded' ? '#22C55E' : '#F59E0B' }}>
                    {p.paymentStatus === 'screenshot_uploaded' ? 'âœ“ Uploaded' : 'Awaiting screenshot'}
                  </strong>
                </div>
              </div>
              {p.paymentStatus !== 'screenshot_uploaded' && (
                <button className="db-wallet-upload-hint" onClick={() => onNav?.('transactions')}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload screenshot in Transactions â†’
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* â”€â”€ Wallet Requests â”€â”€ */}
      <div className="db-wallet-section-header" style={{ marginTop: 28 }}>
        <div className="db-wallet-section-title">
          <span className="db-wallet-section-dot" style={{ background: '#60A5FA', boxShadow: '0 0 8px #60A5FA88' }} />
          Wallet Requests
        </div>
      </div>
      {walletRequests.length === 0 ? (
        <div className="db-wallet-empty">No wallet requests yet.</div>
      ) : (
        <div className="db-wallet-tx-list">
          {walletRequests.map(r => {
            const statusColor = r.status === 'approved' || r.status === 'completed' ? '#22C55E'
              : r.status === 'rejected' || r.status === 'failed' ? '#F87171'
              : '#F59E0B';
            const statusBg = r.status === 'approved' || r.status === 'completed' ? 'rgba(34,197,94,0.1)'
              : r.status === 'rejected' || r.status === 'failed' ? 'rgba(248,113,113,0.1)'
              : 'rgba(245,158,11,0.1)';
            const statusLabel = r.status.charAt(0).toUpperCase() + r.status.slice(1);
            return (
              <div key={r.id} className="db-wallet-tx-row">
                <div className="db-wallet-tx-icon" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 7v13a2 2 0 0 0 2 2h16v-5"/><path d="M18 12h3v4h-3a2 2 0 0 1 0-4z"/></svg>
                </div>
                <div className="db-wallet-tx-info">
                  <span className="db-wallet-tx-name" style={{ textTransform: 'capitalize' }}>{r.type.replace(/_/g, ' ')}</span>
                  <span className="db-wallet-tx-date">{r.date}{r.reviewedAt ? ` Â· Reviewed ${r.reviewedAt}` : ''}</span>
                  {r.notes ? <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, display: 'block' }}>{r.notes}</span> : null}
                </div>
                <div className="db-wallet-tx-mid">
                  <strong className="db-wallet-tx-qty">${r.amount?.toLocaleString()} {r.currency}</strong>
                  {r.walletAddr && r.walletAddr !== 'â€”' && (
                    <span className="db-wallet-tx-amt" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                      {r.walletAddr.length > 20 ? r.walletAddr.slice(0, 10) + 'â€¦' + r.walletAddr.slice(-6) : r.walletAddr}
                    </span>
                  )}
                </div>
                <span className="db-wallet-tx-status" style={{ color: statusColor, background: statusBg }}>{statusLabel}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (DRC)","Congo (Republic)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts & Nevis","Saint Lucia","Saint Vincent & Grenadines","Samoa","San Marino","SÃ£o TomÃ© & PrÃ­ncipe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

function KycFileUploadBox({ field, label, preview, error, accept = 'image/*,application/pdf', onChange }) {
  // preview can be null or { url, isPdf, name }
  const isPdf = preview?.isPdf;
  const previewUrl = preview?.url ?? null;
  const fileName = preview?.name ?? '';
  return (
    <div className={`kyc-upload-box${error ? ' kyc-upload-box--err' : ''}`}>
      <input
        type="file" accept={accept} id={`kf-${field}`}
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <label htmlFor={`kf-${field}`} className="kyc-upload-label">
        {previewUrl ? (
          isPdf ? (
            <div className="kyc-upload-preview kyc-upload-preview--pdf">
              <div className="kyc-pdf-card">
                <div className="kyc-pdf-card__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div className="kyc-pdf-card__info">
                  <span className="kyc-pdf-card__badge">PDF</span>
                  <span className="kyc-pdf-card__name" title={fileName}>
                    {fileName.length > 28 ? fileName.slice(0, 25) + 'â€¦' : fileName}
                  </span>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="kyc-pdf-card__view"
                    onClick={e => e.stopPropagation()}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    View PDF
                  </a>
                </div>
              </div>
              <div className="kyc-upload-replace">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Replace
              </div>
            </div>
          ) : (
            <div className="kyc-upload-preview">
              <img src={previewUrl} alt={label} />
              <div className="kyc-upload-replace">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Replace
              </div>
            </div>
          )
        ) : (
          <div className="kyc-upload-empty">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="kyc-upload-cta">Click to upload</span>
            <span className="kyc-upload-hint">{label}</span>
            <span className="kyc-upload-size">JPG, PNG or PDF Â· Max 8 MB</span>
          </div>
        )}
      </label>
      <span className="kyc-form__error" style={{ marginTop: 4 }}>{error || ''}</span>
    </div>
  );
}

const KYC_FIELD_LABELS = {
  fullName: 'Full Legal Name',
  dob: 'Date of Birth',
  nationality: 'Nationality',
  country: 'Country of Residence',
  city: 'City',
  state: 'State / Province',
  phone: 'Phone Number',
  address: 'Street Address',
  aadhaarNumber: 'Aadhaar Number',
  aadhaarFront: 'Aadhaar Front',
  aadhaarBack: 'Aadhaar Back',
  panNumber: 'PAN Number',
  panFront: 'PAN Front',
  primaryType: 'Document Type',
  primaryFront: 'Document Front',
  primaryBack: 'Document Back',
  secondaryName: 'Supporting Document Name',
  secondaryFile: 'Supporting Document',
};

function KycValidationModalBody({ intro, errors }) {
  const items = Object.entries(errors).filter(([, msg]) => msg);
  return (
    <div className="kyc-validation-modal">
      {intro && <p className="kyc-validation-modal__intro">{intro}</p>}
      <ul className="kyc-validation-modal__list">
        {items.map(([key, msg]) => (
          <li key={key} className={key === '_general' ? 'kyc-validation-modal__item--general' : ''}>
            {key === '_general' ? (
              <span>{msg}</span>
            ) : (
              <>
                <strong>{KYC_FIELD_LABELS[key] || key}</strong>
                <span>{msg}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TabVerification({ investor, onNav }) {
  const [stage, setStage] = useState('terms');  // 'terms' | 'info' | 'docs' | 'pending'
  const [termsScrolled, setTermsScrolled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', type: 'error' });
  const [validationModal, setValidationModal] = useState({ open: false, title: '', intro: '', errors: {} });
  const showToast = (message, type = 'error') => setToast({ open: true, message, type });
  const closeToast = () => setToast(t => ({ ...t, open: false }));
  const showValidationModal = (title, errors, intro = 'Please fix the following and try again.') => {
    setValidationModal({ open: true, title, intro, errors });
  };
  const closeValidationModal = () => setValidationModal(m => ({ ...m, open: false }));
  const closeValidationModalAndFix = () => {
    const errs = { ...validationModal.errors };
    closeValidationModal();
    if (errs && !errs._general) scrollToFirstKycError(errs);
  };
  const scrollToFirstKycError = (errs) => {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    requestAnimationFrame(() => {
      const el = document.querySelector(`[name="${firstKey}"], #kf-${firstKey}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (el?.focus) el.focus();
    });
  };
  const kycValidationModal = (
    <Modal
      isOpen={validationModal.open}
      onClose={closeValidationModalAndFix}
      title={validationModal.title}
      type="error"
    >
      <KycValidationModalBody intro={validationModal.intro} errors={validationModal.errors} />
    </Modal>
  );
  const [form, setForm] = useState({
    // Initialize empty â€” useEffect below populates from registered fullName once user data is loaded.
    // Avoids the brief placeholder "Nicholas Ergemia" flash if INVESTOR default is active.
    fullName:    (investor.name && investor.name !== INVESTOR.name) ? investor.name : '',
    dob:         '',
    nationality: '',
    country:     '',
    city:        '',
    state:       '',
    phone:       '',
    address:     '',
  });
  const [errors, setErrors] = useState({});

  // Prefill the legal name from the registered account name once it loads.
  // Only sets it if the user hasn't started editing the field yet (or it's the placeholder default).
  useEffect(() => {
    const accountName = (investor.name || '').trim();
    if (!accountName || accountName === INVESTOR.name) return;
    setForm(prev => {
      const current = (prev.fullName || '').trim();
      if (!current || current === INVESTOR.name) {
        return { ...prev, fullName: accountName };
      }
      return prev;
    });
  }, [investor.name]);

  // â”€â”€ Document upload state â”€â”€
  const [docs, setDocs] = useState({
    primaryType:    '',
    primaryFront:   null,
    primaryBack:    null,
    secondaryName:  '',
    secondaryFile:  null,
    // India-specific (both compulsory)
    aadhaarNumber:  '',
    aadhaarFront:   null,
    aadhaarBack:    null,
    panNumber:      '',
    panFront:       null,
  });
  const [docErrors, setDocErrors] = useState({});
  const [docPreviews, setDocPreviews] = useState({
    primaryFront: null, primaryBack: null, secondaryFile: null,
    aadhaarFront: null, aadhaarBack: null, panFront: null,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [stage]);

  // â”€â”€ Country â†’ document config â”€â”€
  const DOC_CONFIG = {
    India: {
      label: 'Primary Identity Document',
      types: [
        { id: 'aadhaar', label: 'Aadhaar Card', number: '12-digit Aadhaar number', sides: ['front', 'back'], hint: 'Upload clear photos of both sides of your Aadhaar card.' },
        { id: 'pan',     label: 'PAN Card',     number: '10-character PAN number',  sides: ['front'],         hint: 'Upload a clear photo of the front of your PAN card.' },
      ],
    },
    'United States': {
      label: 'Primary ID',
      types: [
        { id: 'drivers_license', label: "Driver's License",     number: 'License number',              sides: ['front', 'back'], hint: "Upload both sides of your US driver's license." },
        { id: 'ssn_card',        label: 'Social Security Card', number: 'Last 4 digits of SSN',        sides: ['front'],         hint: 'Upload a clear photo of your Social Security card.' },
        { id: 'passport',        label: 'US Passport',          number: 'Passport number',             sides: ['front'],         hint: 'Upload the bio-data page of your passport.' },
      ],
    },
    'United Arab Emirates': {
      label: 'Primary ID',
      types: [
        { id: 'emirates_id', label: 'Emirates ID', number: 'Emirates ID number (784-XXXX-XXXXXXX-X)', sides: ['front', 'back'], hint: 'Upload both sides of your Emirates ID card.' },
        { id: 'passport',    label: 'UAE Passport', number: 'Passport number',                         sides: ['front'],         hint: 'Upload the bio-data page of your passport.' },
      ],
    },
    'United Kingdom': {
      label: 'Primary ID',
      types: [
        { id: 'passport',        label: 'UK Passport',          number: 'Passport number',   sides: ['front'],         hint: 'Upload the bio-data page of your passport.' },
        { id: 'drivers_license', label: "Driver's Licence",     number: 'Licence number',    sides: ['front', 'back'], hint: "Upload both sides of your UK driving licence." },
        { id: 'national_id',     label: 'National Identity Card', number: 'Card number',     sides: ['front', 'back'], hint: 'Upload both sides of your national ID card.' },
      ],
    },
    _default: {
      label: 'Primary ID',
      types: [
        { id: 'passport',        label: 'Passport',            number: 'Passport number', sides: ['front'],         hint: 'Upload the bio-data page of your passport.' },
        { id: 'national_id',     label: 'National ID Card',    number: 'ID card number',  sides: ['front', 'back'], hint: 'Upload both sides of your national ID card.' },
        { id: 'drivers_license', label: "Driver's License",    number: 'License number',  sides: ['front', 'back'], hint: "Upload both sides of your driver's license." },
      ],
    },
  };

  const getDocConfig = (country) => DOC_CONFIG[country] || DOC_CONFIG._default;
  const getSelectedType = () => {
    const cfg = getDocConfig(form.country);
    return cfg.types.find(t => t.id === docs.primaryType) || null;
  };

  // Already approved â€” show status only
  if (investor.kycStatus === 'approved') {
    return (
      <div className="db-tab-content">
        <div className="db-welcome-bar">
          <div>
            <h1 className="db-h1">Identity Verification</h1>
            <p className="db-muted">Your KYC is fully approved.</p>
          </div>
          <KycBadge status="approved" />
        </div>
        <div className="db-alert db-alert--success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div><strong>Full KYC Approval Granted</strong> â€” Identity verified. Sanctions screening passed. You are cleared to invest.</div>
        </div>
      </div>
    );
  }

  // Under review
  if (investor.kycStatus === 'pending' || stage === 'pending') {
    return (
      <div className="db-tab-content">
        <div className="db-welcome-bar">
          <div>
            <h1 className="db-h1">Identity Verification</h1>
            <p className="db-muted">Your documents are under review.</p>
          </div>
          <KycBadge status="pending" />
        </div>
        <div className="kyc-pending-card">
          <div className="kyc-pending-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#9D6FFF" strokeWidth="1.5"/>
              <polyline points="12 6 12 12 16 14" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="kyc-pending-title">Verification In Progress</h2>
          <p className="kyc-pending-desc">Our compliance team is reviewing your documents. This typically takes <strong>1â€“2 business days</strong>. We'll notify you by email once your account is verified.</p>
          <div className="kyc-pending-steps">
            <div className="kyc-ps kyc-ps--done"><span className="kyc-ps__dot" />Personal Info Submitted</div>
            <div className="kyc-ps kyc-ps--done"><span className="kyc-ps__dot" />Documents Uploaded</div>
            <div className="kyc-ps kyc-ps--active"><span className="kyc-ps__dot" />Under Review</div>
            <div className="kyc-ps"><span className="kyc-ps__dot" />Approval</div>
          </div>
          <div className="kyc-pending-actions">
            <button
              className="db-btn db-btn--primary kyc-pending-invest-btn"
              onClick={() => onNav?.('invest')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              Start Investing Now!
            </button>
            <p className="kyc-pending-invest-hint">You can purchase tokens while your KYC is under review. Tokens will be activated once your verification is approved.</p>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Stage 0: Terms & Consent â”€â”€
  if (stage === 'terms') {
    const handleTermsScroll = (e) => {
      const el = e.currentTarget;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        setTermsScrolled(true);
      }
    };

    const handleTermsAcceptedChange = (e) => {
      if (!termsScrolled) {
        e.preventDefault();
        showToast('Please read the whole document before accepting the terms.', 'info');
        return;
      }

      setTermsAccepted(e.target.checked);
    };

    return (
      <div className="db-tab-content">
        <div className="db-welcome-bar" style={{ marginBottom: 8 }}>
          <div>
            <h1 className="db-h1">Identity Verification</h1>
            <p className="db-muted">Read and accept the terms before you proceed.</p>
          </div>
          <KycBadge status={investor.kycStatus || 'not_started'} />
        </div>

        <div className="kyc-stepper">
          <div className="kyc-stepper__step kyc-stepper__step--active">
            <span className="kyc-stepper__num">1</span>
            <span className="kyc-stepper__label">Consent</span>
          </div>
          <div className="kyc-stepper__line" />
          <div className="kyc-stepper__step">
            <span className="kyc-stepper__num">2</span>
            <span className="kyc-stepper__label">Personal Info</span>
          </div>
          <div className="kyc-stepper__line" />
          <div className="kyc-stepper__step">
            <span className="kyc-stepper__num">3</span>
            <span className="kyc-stepper__label">Documents</span>
          </div>
          <div className="kyc-stepper__line" />
          <div className="kyc-stepper__step">
            <span className="kyc-stepper__num">4</span>
            <span className="kyc-stepper__label">Review</span>
          </div>
        </div>

        <div className="kyc-terms-container">
          <div className="kyc-terms__scroll" onScroll={handleTermsScroll}>
            <h2 className="kyc-terms__heading">KYC Verification â€” Consent &amp; Terms of Use</h2>
            <p className="kyc-terms__intro">Please read the following carefully. By proceeding, you grant Growith (the Platform) your explicit consent to collect, process, and verify your personal data as described below, in compliance with applicable data protection and anti-money-laundering legislation.</p>

            <h3 className="kyc-terms__section-title">1. Purpose of Identity Verification</h3>
            <p className="kyc-terms__body">We are required by law to verify the identity of all investors on our platform before they may invest. This is to comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations, including but not limited to the Prevention of Money Laundering Act (PMLA), SEBI guidelines, FinCEN requirements, and applicable GDPR/PDPA obligations depending on your jurisdiction.</p>

            <h3 className="kyc-terms__section-title">2. Personal Data We Collect</h3>
            <p className="kyc-terms__body">As part of the KYC process, we will collect the following categories of personal data:</p>
            <ul className="kyc-terms__list">
              <li>Full legal name, date of birth, and nationality</li>
              <li>Country of residence, city, state/province, and street address</li>
              <li>Phone number and email address</li>
              <li>Government-issued identity documents (e.g. Aadhaar, PAN, Passport, Driver's Licence, National ID)</li>
              <li>Identity document numbers (e.g. Aadhaar number, PAN number, Passport number)</li>
              <li>Supporting documents (e.g. utility bills, bank statements, rental agreements as proof of address)</li>
              <li>Facial biometric data, where applicable, used solely for liveness and identity matching</li>
            </ul>

            <h3 className="kyc-terms__section-title">3. How Your Data Is Processed</h3>
            <p className="kyc-terms__body">Your personal data and submitted documents will be securely transmitted to and processed by our compliance team and authorised third-party identity verification service providers. These providers operate under strict data-processing agreements and are bound by applicable data-protection laws. Your data will be used exclusively for:</p>
            <ul className="kyc-terms__list">
              <li>Verifying your identity against government records and public databases</li>
              <li>Conducting sanctions and politically exposed person (PEP) screening</li>
              <li>Fulfilling our legal obligations under AML/CTF and KYC regulations</li>
              <li>Fraud prevention and platform security</li>
            </ul>

            <h3 className="kyc-terms__section-title">4. Document Submission and Authenticity</h3>
            <p className="kyc-terms__body">By submitting documents through this process, you confirm that:</p>
            <ul className="kyc-terms__list">
              <li>All submitted documents are genuine, authentic, and legally issued to you</li>
              <li>The information provided is accurate, complete, and not misleading</li>
              <li>You have not altered, edited, or tampered with any document in any way</li>
              <li>Submission of false or altered documents may result in immediate account suspension and may be reported to relevant law enforcement authorities</li>
            </ul>

            <h3 className="kyc-terms__section-title">5. Data Storage and Security</h3>
            <p className="kyc-terms__body">Your submitted data is stored on encrypted servers with industry-standard security protocols (AES-256 encryption at rest, TLS 1.3 in transit). Access is strictly restricted to authorised compliance personnel only. We do not sell your personal data to any third party for commercial purposes.</p>

            <h3 className="kyc-terms__section-title">6. Third-Party Verification Providers</h3>
            <p className="kyc-terms__body">Growith may share your submitted documents and personal information with licensed third-party KYC/AML verification providers for identity validation purposes. These providers are contractually obligated to maintain confidentiality and comply with applicable data-protection regulations.</p>

            <h3 className="kyc-terms__section-title">7. Data Retention</h3>
            <p className="kyc-terms__body">Your KYC data and documents will be retained for the minimum period required by applicable law, typically 5â€“7 years following the end of the business relationship. After this period, data will be securely deleted or anonymised in accordance with our data retention policy.</p>

            <h3 className="kyc-terms__section-title">8. Your Rights</h3>
            <p className="kyc-terms__body">Subject to applicable laws, you have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data (subject to legal retention obligations), object to or restrict certain types of processing, and withdraw consent at any time â€” though this may affect your ability to use the platform. To exercise these rights, contact our Data Protection Officer at <strong>privacy@growith.io</strong>.</p>

            <h3 className="kyc-terms__section-title">9. Regulatory Compliance</h3>
            <p className="kyc-terms__body">Growith operates in compliance with applicable laws and regulations, including SEBI (India), SEC (USA), CBUAE (UAE), FCA (UK), and other relevant regulatory bodies depending on jurisdiction. Our KYC process is periodically audited by independent compliance professionals to ensure continued adherence to regulatory standards.</p>

            <h3 className="kyc-terms__section-title">10. Consent Declaration</h3>
            <p className="kyc-terms__body">By scrolling through and accepting this declaration, you confirm that you have read and fully understood all of the above terms. You voluntarily and explicitly consent to Growith collecting, processing, storing, and sharing your personal data and identity documents for the purposes described herein. You acknowledge that refusing consent will prevent you from completing the KYC process and accessing investment features on the platform.</p>

            <div className="kyc-terms__scroll-indicator">
              {termsScrolled
                ? <span className="kyc-terms__si kyc-terms__si--done">âœ“ You have read the full document</span>
                : <span className="kyc-terms__si">â†“ Scroll to the bottom to continue</span>
              }
            </div>
          </div>

          <div className="kyc-terms__accept">
            <label className={`kyc-terms__checkbox-label${!termsScrolled ? ' kyc-terms__checkbox-label--disabled' : ''}`}>
              <input
                type="checkbox"
                className="kyc-terms__checkbox"
                checked={termsAccepted}
                onChange={handleTermsAcceptedChange}
              />
              <span>I have read the above terms and conditions in full. I give my explicit, informed consent to Growith to collect, process, verify, and store my personal data and identity documents for KYC/AML compliance purposes as described above.</span>
            </label>
          </div>

          <button
            type="button"
            className="kyc-form__submit"
            disabled={!termsAccepted}
            onClick={() => setStage('info')}
          >
            I Agree â€” Continue to Personal Info
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    );
  }

  // â”€â”€ Stage 1: Personal Info form â”€â”€
  if (stage === 'info') {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
      const errs = {};
      // Full name: letters, spaces, apostrophes, hyphens only; 2â€“80 chars
      if (!form.fullName.trim()) {
        errs.fullName = 'Full name is required';
      } else if (!/^[a-zA-Z\s'\-\.]{2,80}$/.test(form.fullName.trim())) {
        errs.fullName = 'Name can only contain letters, spaces, hyphens and apostrophes (2â€“80 chars)';
      }
      // DOB
      if (!form.dob) errs.dob = 'Date of birth is required';
      // Nationality
      if (!form.nationality.trim()) {
        errs.nationality = 'Nationality is required';
      } else if (!/^[a-zA-Z\s\-]{2,60}$/.test(form.nationality.trim())) {
        errs.nationality = 'Enter a valid nationality (letters only)';
      }
      if (!form.country.trim()) errs.country = 'Country of residence is required';
      // City
      if (!form.city.trim()) {
        errs.city = 'City is required';
      } else if (form.city.trim().length > 100) {
        errs.city = 'City name too long (max 100 characters)';
      }
      // State
      if (!form.state.trim()) {
        errs.state = 'State / Province is required';
      } else if (form.state.trim().length > 100) {
        errs.state = 'State name too long (max 100 characters)';
      }
      // Phone: optional leading +, 7â€“15 digits (spaces/dashes allowed between digits)
      if (!form.phone.trim()) {
        errs.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s\-]{7,20}$/.test(form.phone.trim()) || form.phone.replace(/\D/g, '').length < 7) {
        errs.phone = 'Enter a valid phone number (e.g. +44 7700 900000)';
      }
      // Address
      if (!form.address.trim()) {
        errs.address = 'Residential address is required';
      } else if (form.address.trim().length > 200) {
        errs.address = 'Address too long (max 200 characters)';
      }
      setErrors(errs);
      return errs;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        showValidationModal('Please correct your personal information', errs);
        return;
      }
      setStage('docs');
    };

    return (
      <div className="db-tab-content">
        <Toast isOpen={toast.open} onClose={closeToast} message={toast.message} type={toast.type} />
        {kycValidationModal}
        <div className="db-welcome-bar" style={{ marginBottom: 8 }}>
          <div>
            <h1 className="db-h1">Identity Verification</h1>
            <p className="db-muted">Complete KYC to unlock full investment access.</p>
          </div>
          <KycBadge status={investor.kycStatus || 'not_started'} />
        </div>

        {/* Progress stepper */}
        <div className="kyc-stepper">
          <div className="kyc-stepper__step kyc-stepper__step--done">
            <span className="kyc-stepper__num">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span className="kyc-stepper__label">Consent</span>
          </div>
          <div className="kyc-stepper__line kyc-stepper__line--done" />
          <div className="kyc-stepper__step kyc-stepper__step--active">
            <span className="kyc-stepper__num">2</span>
            <span className="kyc-stepper__label">Personal Info</span>
          </div>
          <div className="kyc-stepper__line" />
          <div className="kyc-stepper__step">
            <span className="kyc-stepper__num">3</span>
            <span className="kyc-stepper__label">Documents</span>
          </div>
          <div className="kyc-stepper__line" />
          <div className="kyc-stepper__step">
            <span className="kyc-stepper__num">4</span>
            <span className="kyc-stepper__label">Review</span>
          </div>
        </div>

        <div className="kyc-info-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Please enter your details exactly as they appear on your government-issued ID. This information is encrypted and securely processed.</span>
        </div>

        <form className="kyc-form" onSubmit={handleSubmit} noValidate>
          <div className="kyc-form__row">
            <div className="kyc-form__group">
              <label className="kyc-form__label">
                Full Legal Name <span className="kyc-form__req">*</span>
                <span style={{
                  marginLeft: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#9D6FFF',
                  background: 'rgba(157,111,255,0.1)',
                  border: '1px solid rgba(157,111,255,0.25)',
                  padding: '2px 8px',
                  borderRadius: 100,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  verticalAlign: 'middle',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Locked
                </span>
              </label>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '-4px 0 8px', lineHeight: 1.5 }}>
                This is the legal name you provided at signup. It cannot be edited here â€” please contact support if it needs to be corrected.
              </div>
              <input
                className={`kyc-form__input${errors.fullName ? ' kyc-form__input--err' : ''}`}
                name="fullName"
                value={form.fullName}
                readOnly
                tabIndex={-1}
                placeholder="As on your passport/ID"
                maxLength={80}
                style={{
                  background: 'rgba(157,111,255,0.06)',
                  cursor: 'not-allowed',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
              <span className="kyc-form__error">{errors.fullName || ''}</span>
            </div>
            <div className="kyc-form__group">
              <label className="kyc-form__label">Date of Birth <span className="kyc-form__req">*</span></label>
              <input className={`kyc-form__input${errors.dob ? ' kyc-form__input--err' : ''}`} type="date" name="dob" value={form.dob} onChange={handleChange} max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} />
              <span className="kyc-form__error">{errors.dob || ''}</span>
            </div>
          </div>
          <div className="kyc-form__row">
            <div className="kyc-form__group">
              <label className="kyc-form__label">Nationality <span className="kyc-form__req">*</span></label>
              <input className={`kyc-form__input${errors.nationality ? ' kyc-form__input--err' : ''}`} name="nationality" value={form.nationality} onChange={handleChange} placeholder="e.g. British, Indian" maxLength={60} />
              <span className="kyc-form__error">{errors.nationality || ''}</span>
            </div>
            <div className="kyc-form__group">
              <label className="kyc-form__label">Country of Residence <span className="kyc-form__req">*</span></label>
              <select className={`kyc-form__input kyc-form__select${errors.country ? ' kyc-form__input--err' : ''}`} name="country" value={form.country} onChange={handleChange}>
                <option value="">Select countryâ€¦</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="kyc-form__error">{errors.country || ''}</span>
            </div>
          </div>
          <div className="kyc-form__row">
            <div className="kyc-form__group">
              <label className="kyc-form__label">City <span className="kyc-form__req">*</span></label>
              <input className={`kyc-form__input${errors.city ? ' kyc-form__input--err' : ''}`} name="city" value={form.city} onChange={handleChange} placeholder="e.g. London" maxLength={100} />
              <span className="kyc-form__error">{errors.city || ''}</span>
            </div>
            <div className="kyc-form__group">
              <label className="kyc-form__label">State / Province <span className="kyc-form__req">*</span></label>
              <input className={`kyc-form__input${errors.state ? ' kyc-form__input--err' : ''}`} name="state" value={form.state} onChange={handleChange} placeholder="e.g. England, Punjab" maxLength={100} />
              <span className="kyc-form__error">{errors.state || ''}</span>
            </div>
          </div>
          <div className="kyc-form__row">
            <div className="kyc-form__group">
              <label className="kyc-form__label">Phone Number <span className="kyc-form__req">*</span></label>
              <input className={`kyc-form__input${errors.phone ? ' kyc-form__input--err' : ''}`} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+44 7700 900000" maxLength={20} />
              <span className="kyc-form__error">{errors.phone || ''}</span>
            </div>
            <div className="kyc-form__group">
              <label className="kyc-form__label">Street Address <span className="kyc-form__req">*</span></label>
              <input className={`kyc-form__input${errors.address ? ' kyc-form__input--err' : ''}`} name="address" value={form.address} onChange={handleChange} placeholder="Street number and name, Postcode" maxLength={200} />
              <span className="kyc-form__error">{errors.address || ''}</span>
            </div>
          </div>

          {/* Address disclaimer */}
          <div className="kyc-address-disclaimer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>The address details you provide must exactly match those on your legally verified government-issued documents (passport, national ID, or utility bill). Mismatches may result in verification failure.</span>
          </div>

          {apiError && <div className="kyc-form__api-error">{apiError}</div>}

          <button type="submit" className="kyc-form__submit" disabled={isLoading}>
            {isLoading ? <span className="login-spinner" /> : (
              <>
                Continue to Documents
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // â”€â”€ Stage 2: Document Upload â”€â”€
  if (stage === 'docs') {
    const cfg = getDocConfig(form.country);
    const selectedType = getSelectedType();
    const needsBack = selectedType?.sides?.includes('back');

    const ALLOWED_KYC_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
    const MAX_KYC_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

    const handleFileChange = (field) => (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_KYC_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
        setDocErrors(prev => ({ ...prev, [field]: 'Only images (JPG, PNG, WEBP) and PDF files are allowed.' }));
        e.target.value = '';
        return;
      }

      if (file.size > MAX_KYC_FILE_SIZE) {
        setDocErrors(prev => ({ ...prev, [field]: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 8 MB. Please compress or resize the file and try again.` }));
        e.target.value = '';
        return;
      }

      const preview = { url: URL.createObjectURL(file), isPdf: file.type === 'application/pdf', name: file.name };
      setDocs(prev => ({ ...prev, [field]: file }));
      setDocPreviews(prev => ({ ...prev, [field]: preview }));
      if (docErrors[field]) setDocErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleDocChange = (e) => {
      const { name, value } = e.target;
      setDocs(prev => ({ ...prev, [name]: value }));
      if (name === 'primaryType') {
        // reset uploads when type changes
        setDocs(prev => ({ ...prev, primaryType: value, primaryFront: null, primaryBack: null }));
        setDocPreviews(prev => ({ ...prev, primaryFront: null, primaryBack: null }));
      }
      if (docErrors[name]) setDocErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateDocs = () => {
      const errs = {};
      const isIndia = form.country === 'India';
      if (isIndia) {
        if (!/^\d{12}$/.test(docs.aadhaarNumber.replace(/[\s-]/g, '')))
          errs.aadhaarNumber = 'Must be 12 digits (no letters or symbols)';
        if (!docs.aadhaarFront) errs.aadhaarFront = 'Aadhaar front image is required';
        if (!docs.aadhaarBack)  errs.aadhaarBack  = 'Aadhaar back image is required';
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(docs.panNumber.trim()))
          errs.panNumber = 'Invalid PAN â€” format must be ABCDE1234F';
        if (!docs.panFront) errs.panFront = 'PAN front image is required';
      } else {
        if (!docs.primaryType)  errs.primaryType  = 'Please select a document type';
        if (!docs.primaryFront) errs.primaryFront = 'Front image is required';
        if (needsBack && !docs.primaryBack) errs.primaryBack = 'Back image is required';
      }
      // supporting doc (name + file) is optional â€” no validation needed
      setDocErrors(errs);
      return errs;
    };

    const handleDocSubmit = async (e) => {
      e.preventDefault();
      const errs = validateDocs();
      if (Object.keys(errs).length > 0) {
        showValidationModal('Please correct your documents', errs);
        return;
      }
      setIsLoading(true);
      setApiError('');
      try {
        const [y, mo, d] = form.dob.split('-');
        const formData = new FormData();
        formData.append('fullLegalName', form.fullName.trim());
        formData.append('dateOfBirth', `${d}-${mo}-${y}`);
        formData.append('nationality', form.nationality.trim());
        formData.append('countryOfResidence', form.country);
        formData.append('city', form.city.trim());
        formData.append('stateProvince', form.state.trim());
        formData.append('phoneNumber', form.phone.trim());
        formData.append('streetAddress', form.address.trim());
        formData.append('termsAgreed', 'true');

        if (form.country === 'India') {
          formData.append('aadhaarNumber', docs.aadhaarNumber.replace(/[\s-]/g, ''));
          formData.append('panNumber', docs.panNumber.trim().toUpperCase());
          formData.append('aadhaarFront', docs.aadhaarFront);
          formData.append('aadhaarBack', docs.aadhaarBack);
          formData.append('panFront', docs.panFront);
        } else {
          formData.append('aadhaarNumber', docs.primaryNumber || 'N/A');
          formData.append('panNumber', docs.primaryType ? docs.primaryType.toUpperCase() : 'N/A');
          formData.append('aadhaarFront', docs.primaryFront);
          formData.append('aadhaarBack', docs.primaryBack || docs.primaryFront);
          formData.append('panFront', docs.primaryFront);
        }

        if (docs.secondaryFile) formData.append('supportingDoc', docs.secondaryFile);
        if (docs.secondaryName?.trim()) formData.append('supportingDocName', docs.secondaryName.trim());

        await apiService.submitKyc(formData);
        setStage('pending');
      } catch (err) {
        const msg = err.message || '';
        const apiErrMsg = msg.includes('too large') || msg.includes('8 MB') || msg.includes('413')
          ? 'One or more files exceed the 8 MB limit. Please go back, reduce the file size, and try again.'
          : (msg || 'Upload failed. Please try again.');
        setApiError(apiErrMsg);
        showValidationModal('KYC submission failed', { _general: apiErrMsg }, 'Something went wrong while submitting. Please review and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="db-tab-content">
        <Toast isOpen={toast.open} onClose={closeToast} message={toast.message} type={toast.type} />
        {kycValidationModal}
        <div className="db-welcome-bar" style={{ marginBottom: 8 }}>
          <div>
            <h1 className="db-h1">Identity Verification</h1>
            <p className="db-muted">Upload your identity documents.</p>
          </div>
          <KycBadge status={investor.kycStatus || 'not_started'} />
        </div>

        <div className="kyc-stepper">
          <div className="kyc-stepper__step kyc-stepper__step--done">
            <span className="kyc-stepper__num">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span className="kyc-stepper__label">Consent</span>
          </div>
          <div className="kyc-stepper__line kyc-stepper__line--done" />
          <div className="kyc-stepper__step kyc-stepper__step--done">
            <span className="kyc-stepper__num">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span className="kyc-stepper__label">Personal Info</span>
          </div>
          <div className="kyc-stepper__line kyc-stepper__line--done" />
          <div className="kyc-stepper__step kyc-stepper__step--active">
            <span className="kyc-stepper__num">3</span>
            <span className="kyc-stepper__label">Documents</span>
          </div>
          <div className="kyc-stepper__line" />
          <div className="kyc-stepper__step">
            <span className="kyc-stepper__num">4</span>
            <span className="kyc-stepper__label">Review</span>
          </div>
        </div>

        <form className="kyc-form" onSubmit={handleDocSubmit} noValidate>

          {/* â”€â”€ Primary ID Sections â”€â”€ */}
          {form.country === 'India' ? (
            <>
              {/* Section 1: Aadhaar Card â€” compulsory */}
              <div className="kyc-doc-section">
                <div className="kyc-doc-section__header">
                  <div className="kyc-doc-section__num">1</div>
                  <div>
                    <h3 className="kyc-doc-section__title">Aadhaar Card <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 500 }}>Compulsory</span></h3>
                    <p className="kyc-doc-section__sub">Enter your Aadhaar number and upload both sides of your Aadhaar card.</p>
                  </div>
                </div>
                <div className="kyc-info-banner" style={{ marginBottom: 16 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>Aadhaar is mandatory for Indian investors. Upload clear photos of both the front and back sides.</span>
                </div>
                <div className="kyc-form__group" style={{ marginBottom: 16 }}>
                  <label className="kyc-form__label">Aadhaar Number <span className="kyc-form__req">*</span></label>
                  <input
                    className={`kyc-form__input${docErrors.aadhaarNumber ? ' kyc-form__input--err' : ''}`}
                    name="aadhaarNumber"
                    value={docs.aadhaarNumber}
                    onChange={handleDocChange}
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                  />
                  <span className="kyc-form__error">{docErrors.aadhaarNumber || ''}</span>
                </div>
                <div className="kyc-upload-row kyc-upload-row--two">
                  <div className="kyc-upload-col">
                    <p className="kyc-upload-col__label">Front Side</p>
                    <KycFileUploadBox field="aadhaarFront" label="Aadhaar front" preview={docPreviews.aadhaarFront} error={docErrors.aadhaarFront} onChange={handleFileChange('aadhaarFront')} />
                  </div>
                  <div className="kyc-upload-col">
                    <p className="kyc-upload-col__label">Back Side</p>
                    <KycFileUploadBox field="aadhaarBack" label="Aadhaar back" preview={docPreviews.aadhaarBack} error={docErrors.aadhaarBack} onChange={handleFileChange('aadhaarBack')} />
                  </div>
                </div>
              </div>

              {/* Section 2: PAN Card â€” compulsory */}
              <div className="kyc-doc-section">
                <div className="kyc-doc-section__header">
                  <div className="kyc-doc-section__num">2</div>
                  <div>
                    <h3 className="kyc-doc-section__title">PAN Card <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 500 }}>Compulsory</span></h3>
                    <p className="kyc-doc-section__sub">Enter your PAN number and upload the front of your PAN card.</p>
                  </div>
                </div>
                <div className="kyc-info-banner" style={{ marginBottom: 16 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>PAN is mandatory for Indian investors. Upload a clear photo of the front side of your PAN card.</span>
                </div>
                <div className="kyc-form__group" style={{ marginBottom: 16 }}>
                  <label className="kyc-form__label">PAN Number <span className="kyc-form__req">*</span></label>
                  <input
                    className={`kyc-form__input${docErrors.panNumber ? ' kyc-form__input--err' : ''}`}
                    name="panNumber"
                    value={docs.panNumber}
                    onChange={handleDocChange}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    style={{ textTransform: 'uppercase' }}
                  />
                  <span className="kyc-form__error">{docErrors.panNumber || ''}</span>
                </div>
                <KycFileUploadBox field="panFront" label="PAN card front" preview={docPreviews.panFront} error={docErrors.panFront} onChange={handleFileChange('panFront')} />
              </div>
            </>
          ) : (
            /* Non-India: choose one primary ID type */
            <div className="kyc-doc-section">
              <div className="kyc-doc-section__header">
                <div className="kyc-doc-section__num">1</div>
                <div>
                  <h3 className="kyc-doc-section__title">{cfg.label}</h3>
                  <p className="kyc-doc-section__sub">Select the type of ID you'll be uploading.</p>
                </div>
              </div>

              <div className="kyc-doc-types">
                {cfg.types.map(t => (
                  <label key={t.id} className={`kyc-doc-type${docs.primaryType === t.id ? ' kyc-doc-type--active' : ''}`}>
                    <input type="radio" name="primaryType" value={t.id} checked={docs.primaryType === t.id} onChange={handleDocChange} style={{ display: 'none' }} />
                    <span className="kyc-doc-type__radio" />
                    <div>
                      <span className="kyc-doc-type__label">{t.label}</span>
                      <span className="kyc-doc-type__sides">{t.sides.length === 2 ? 'Front & Back' : 'Front only'}</span>
                    </div>
                  </label>
                ))}
              </div>
              <span className="kyc-form__error" style={{ marginTop: 4, display: 'block' }}>{docErrors.primaryType || ''}</span>

              {selectedType && (
                <div className="kyc-upload-area">
                  <div className="kyc-info-banner" style={{ marginBottom: 16 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>{selectedType.hint} Ensure the image is clear, focused, and all corners are visible.</span>
                  </div>
                  <div className={`kyc-upload-row${needsBack ? ' kyc-upload-row--two' : ''}`}>
                    <div className="kyc-upload-col">
                      <p className="kyc-upload-col__label">Front Side</p>
                      <KycFileUploadBox field="primaryFront" label="Front of document" preview={docPreviews.primaryFront} error={docErrors.primaryFront} onChange={handleFileChange('primaryFront')} />
                    </div>
                    {needsBack && (
                      <div className="kyc-upload-col">
                        <p className="kyc-upload-col__label">Back Side</p>
                        <KycFileUploadBox field="primaryBack" label="Back of document" preview={docPreviews.primaryBack} error={docErrors.primaryBack} onChange={handleFileChange('primaryBack')} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* â”€â”€ Supporting Document â”€â”€ */}
          <div className="kyc-doc-section">
            <div className="kyc-doc-section__header">
              <div className="kyc-doc-section__num">{form.country === 'India' ? 3 : 2}</div>
              <div>
                <h3 className="kyc-doc-section__title">Supporting Document <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>Optional</span></h3>
                <p className="kyc-doc-section__sub">Proof of address or additional verification (e.g. utility bill, bank statement).</p>
              </div>
            </div>

            <div className="kyc-form__group" style={{ marginBottom: 14 }}>
              <label className="kyc-form__label">Document Name</label>
              <input
                className={`kyc-form__input${docErrors.secondaryName ? ' kyc-form__input--err' : ''}`}
                name="secondaryName"
                value={docs.secondaryName}
                onChange={handleDocChange}
                placeholder="e.g. Utility Bill, Bank Statement, Rental Agreement"
              />
              <span className="kyc-form__error">{docErrors.secondaryName || ''}</span>
            </div>

            <KycFileUploadBox field="secondaryFile" label="Upload document" preview={docPreviews.secondaryFile} error={docErrors.secondaryFile} accept="image/*,application/pdf" onChange={handleFileChange('secondaryFile')} />
          </div>

          {/* â”€â”€ Image quality notice â”€â”€ */}
          <div className="kyc-address-disclaimer" style={{ marginBottom: 16 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>All uploaded images must be clear, well-lit, and unedited. Blurry, cropped, or altered documents will be rejected and may delay your verification.</span>
          </div>

          {/* â”€â”€ Upload size notice â”€â”€ */}
          <div className="kyc-address-disclaimer" style={{ marginBottom: 16 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span><strong>Max file size: 8 MB per document.</strong> Accepted formats: JPG, PNG, WEBP, PDF. If your file is larger, compress it using a free online tool (e.g. ilovepdf.com for PDFs, tinypng.com for images) before uploading.</span>
          </div>

          {apiError && <div className="kyc-form__api-error">{apiError}</div>}

          <div className="kyc-doc-actions">
            <button type="button" className="kyc-back-btn" onClick={() => setStage('info')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button type="submit" className="kyc-form__submit" style={{ flex: 1 }} disabled={isLoading}>
              {isLoading ? <span className="login-spinner" /> : (
                <>
                  Submit for Review
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}

/* â”€â”€ Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

      {/* â”€â”€ Profile Hero Card â”€â”€ */}
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

      {/* â”€â”€ Profile Fields â”€â”€ */}
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
          <div className="db-settings-field"><span className="db-form-label">Custody Type</span><span className="db-settings-value">HSM-backed Â· Growith Custodian</span></div>
          <div className="db-alert db-alert--info" style={{ marginTop: 12, padding: '10px 14px', fontSize: 13 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>This is a custodial wallet managed by Growith. Self-custody migration available in Phase 5.</span>
          </div>
        </div>

        {/* Security */}
        <div className="db-settings-card">
          <div className="db-settings-card__title">Security</div>
          <div className="db-settings-field"><span className="db-form-label">2FA</span><span className="db-settings-value db-green">Enabled (Authenticator App)</span></div>
          <div className="db-settings-field"><span className="db-form-label">Last Login</span><span className="db-settings-value">Mar 12, 2026 Â· 09:41 UTC</span></div>
          <div className="db-settings-field"><span className="db-form-label">Session</span><span className="db-settings-value">Active Â· Chrome Â· Warsaw, PL</span></div>
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN DASHBOARD
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',      Icon: Icon.overview },
  { id: 'portfolio',     label: 'Portfolio',      Icon: Icon.portfolio },
  { id: 'invest',        label: 'Invest',         Icon: Icon.invest },
  { id: 'transactions',  label: 'Transactions',   Icon: Icon.transactions },
  { id: 'wallet',        label: 'Wallet',         Icon: Icon.wallet },
  { id: 'affiliate',     label: 'Affiliate',      Icon: Icon.affiliate, badge: 'EARN' },
  { id: 'verification',  label: 'Verification',   Icon: Icon.verification },
  { id: 'settings',      label: 'Settings',       Icon: Icon.settings },
];

const VALID_TABS = new Set(NAV_ITEMS.map(n => n.id));

const Dashboard = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  /* Affiliate application — none | pending | approved | rejected */
  const [affiliateApp, setAffiliateApp] = useState(null);
  /* Enrolled affiliate programs — lifted here so the sidebar can show sub-items */
  const [enrolledPrograms, setEnrolledPrograms] = useState({});  // programId â†’ true
  /* When set, the affiliate tab opens directly to this program's detail view */
  const [directAffProgId, setDirectAffProgId] = useState(null);
  /* Pending purchases from invest tab (not yet admin-approved) */
  const [pendingPurchases, setPendingPurchases] = useState([]);
  /* Approved purchases from API (status === 'approved') */
  const [approvedPurchases, setApprovedPurchases] = useState([]);
  /* Wallet info from API â€” approved token holdings, balances */
  const [walletData, setWalletData] = useState(null);
  /* Available tokens for investment â€” fetched from real API */
  const [availableTokens, setAvailableTokens] = useState(AVAILABLE_TOKENS);
  /* Wallet transaction history from API */
  const [walletTransactions, setWalletTransactions] = useState([]);
  /* Wallet requests (withdrawal / redemption) from API */
  const [walletRequests, setWalletRequests] = useState([]);
  /* Direct airdrops from API */
  const [directAirdrops, setDirectAirdrops] = useState([]);
  /* Loading state for initial fetch */
  const [dataLoading, setDataLoading] = useState(true);
  /* Last refreshed timestamp */
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchLiveData = useCallback(() => {
    const token = getToken();
    if (token) apiService.setToken(token);
    return Promise.allSettled([
      apiService.getTokenRequests(),
      apiService.getToken('69dcdd839e731266a8732e54'),
      apiService.getMyPurchases(),
      apiService.getWalletTransactions(),
      apiService.getWalletRequests(),
      apiService.getDirectAirdrops(),
    ]).then(([requestsResult, tokenResult, myPurchasesResult, walletTxResult, walletReqResult, airdropsResult]) => {
      const normalizeStatus = (value) => String(value || '').toLowerCase();
      const pendingRequestStatuses = new Set([
        'pending',
        'pending_verification',
        'under_review',
        'in_review',
        'awaiting_screenshot',
      ]);

      // â”€â”€ Wallet info (approved holdings, balance, address) â”€â”€
      // No longer fetched separately; approved requests are extracted below

      // â”€â”€ Pending purchase requests â”€â”€
      if (requestsResult.status === 'fulfilled') {
        const res = requestsResult.value;
        const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);

        // Approved requests â†’ show in Approved Tokens section
        const approved = list
          .filter(r => normalizeStatus(r.status) === 'approved')
          .map(r => ({
            id:           r.id || r._id,
            token:        r.tokenName  || r.token  || '',
            ticker:       r.ticker     || '',
            logo:         r.logo       || '/assets/images/icon/shivAiToken.png',
            amount:       Number(r.tokenQty  || r.qty    || 0),
            invested:     Number(r.amountUsd || r.amount || 0),
            currentValue: Number(r.amountUsd || r.amount || 0),
            lockExpiry:   'â€”',
            status:       'active',
            date:         r.reviewedAt || r.updatedAt || r.createdAt
              ? new Date(r.reviewedAt || r.updatedAt || r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : '',
          }));
        setApprovedPurchases(approved);

        const mapped = list
          .filter(r => pendingRequestStatuses.has(normalizeStatus(r.status)))
          .map(r => ({
            id:            r.id || r._id || Date.now() + Math.random(),
            apiId:         r.id || r._id,
            purchaseRef:   r.purchaseRef || r.reference || r.ref || '',
            token:         r.tokenName   || r.token     || '',
            ticker:        r.ticker      || '',
            logo:          r.logo        || '/assets/images/icon/shivAiToken.png',
            amountUsd:     Number(r.amountUsd  || r.amount || 0),
            tokenQty:      Number(r.tokenQty   || r.qty    || 0),
            date:          r.date        || r.createdAt
                             ? new Date(r.date || r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                             : '',
            status:        'pending_verification',
            paymentStatus: r.screenshot || r.screenshotUrl
                             ? 'screenshot_uploaded'
                             : 'awaiting_screenshot',
            method:        r.method || 'USDT (TRC20)',
          }));
        setPendingPurchases(mapped);
      } else {
        setApprovedPurchases([]);
        setPendingPurchases([]);
        console.warn('getTokenRequests failed:', requestsResult.reason?.message);
      }

      // â”€â”€ ShivAI token data from investor API â”€â”€
      if (tokenResult.status === 'fulfilled') {
        const raw = tokenResult.value?.data ?? tokenResult.value;
        if (raw) {
          // priceUsd is the actual current token price from the API â€” use it directly
          const effectivePrice = raw.priceUsd != null ? Number(raw.priceUsd) : EFFECTIVE_TOKEN_PRICE;
          const normalPrice    = raw.normalPriceUsd != null ? Number(raw.normalPriceUsd) : effectivePrice;
          const totalSupply    = Number(raw.totalSupply    || 1000000);
          const avSupply       = Number(raw.availableSupply || 900000);
          const sold           = totalSupply - avSupply;
          setAvailableTokens([{
            id:          raw._id || raw.id || 1,
            slug:        raw.slug || 'shivai',
            name:        raw.name || 'ShivAI Token',
            ticker:      raw.symbol || raw.ticker || 'SHIV',
            logo:        raw.logo || raw.logoUrl || '/assets/images/icon/shivAiToken.png',
            image:       raw.image || raw.bannerImage || '/assets/images/partner/MainShiv.jpeg',
            price:       `$${effectivePrice.toFixed(2)}`,
            normalPrice: `$${normalPrice.toFixed(2)}`,
            minInvest:   raw.minInvestment ? `$${Number(raw.minInvestment).toLocaleString()}` : '$500',
            maxInvest:   raw.maxInvestment ? `$${Number(raw.maxInvestment).toLocaleString()}` : '$25,000',
            lock:        raw.lockPeriod || raw.lockDuration || '12 months',
            status:      raw.status || 'LIVE',
            raised:      sold,          // token count sold
            target:      totalSupply,   // total token supply
            totalTokens: totalSupply,
            availSupply: avSupply,
            soldTokens:  sold,
            investors:   Number(raw.investors || raw.investorCount || raw.totalInvestors || 0),
            desc:        raw.description || raw.desc || 'Next-generation AI compute infrastructure token.',
            network:     raw.network || 'ethereum',
          }]);
        }
      } else {
        console.warn('getToken failed:', tokenResult.reason?.message);
      }

      // â”€â”€ My Purchases (dedicated endpoint, complements getTokenRequests) â”€â”€
      if (myPurchasesResult.status === 'fulfilled') {
        const res = myPurchasesResult.value;
        const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        if (list.length > 0) {
          // NOTE: approved purchases are already handled by getTokenRequests above.
          // getMyPurchases only supplements PENDING entries to avoid double-counting approved ones.
          const extraPending = list
            .filter(r => pendingRequestStatuses.has(normalizeStatus(r.status)))
            .map(r => ({
              id:            r.id || r._id || Date.now() + Math.random(),
              apiId:         r.id || r._id,
              purchaseRef:   r.purchaseRef || r.reference || r.ref || '',
              token:         r.tokenName   || r.token     || '',
              ticker:        r.ticker      || r.symbol    || '',
              logo:          r.logo        || '/assets/images/icon/shivAiToken.png',
              amountUsd:     Number(r.amountUsd  || r.amount || 0),
              tokenQty:      Number(r.tokenQty   || r.qty    || 0),
              date:          r.date || r.createdAt
                ? new Date(r.date || r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '',
              status:        'pending_verification',
              paymentStatus: r.screenshot || r.screenshotUrl ? 'screenshot_uploaded' : 'awaiting_screenshot',
              method:        r.method || 'USDT (TRC20)',
            }));
          setPendingPurchases(prev => {
            const seen = new Set(prev.map(p => String(p.id)));
            const fresh = extraPending.filter(p => !seen.has(String(p.id)));
            return fresh.length ? [...prev, ...fresh] : prev;
          });
        }
      } else {
        console.warn('getMyPurchases failed:', myPurchasesResult.reason?.message);
      }

      // â”€â”€ Wallet Transactions â”€â”€
      if (walletTxResult.status === 'fulfilled') {
        const res = walletTxResult.value;
        // Response shape: { data: { transactions: [...], pagination: {...} }, success: true }
        const raw = res?.data?.transactions ?? res?.transactions ?? (Array.isArray(res?.data) ? res.data : null) ?? (Array.isArray(res) ? res : []);
        const list = Array.isArray(raw) ? raw : [];
        // Normalize API type names â†’ typeConfig keys
        const typeMap = { purchase: 'investment', token_purchase: 'investment', commission: 'affiliate', withdrawal: 'redeem', kyc: 'kyc', onboarding: 'onboarding' };
        const mapped = list.map((tx, i) => {
          const rawType = (tx.type || tx.transactionType || tx.category || 'purchase').toLowerCase();
          const rawDate = tx.date || tx.createdAt;
          return {
            id:     tx.id || tx._id || i,
            type:   typeMap[rawType] || rawType || 'investment',
            amount: Number(tx.amount || tx.amountUsd || tx.value || 0) || null,
            currency: tx.currency || 'USD',
            desc:   tx.description || '',
            date:   rawDate
              ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'â€”',
            time:   rawDate
              ? new Date(rawDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
              : '',
            status: (tx.status || 'pending').toLowerCase(),
            hash:   tx.hash || tx.txHash || tx.reference || tx.ref || tx.purchaseRef || tx.id || 'â€”',
            method: tx.method || tx.paymentMethod || (`${tx.currency || 'USD'} Â· ${tx.description || ''}`.trim().replace(/Â·\s*$/, '')),
          };
        });
        setWalletTransactions(mapped);
      } else {
        console.warn('getWalletTransactions failed:', walletTxResult.reason?.message);
      }

      // â”€â”€ Wallet Requests (withdrawal / redemption requests) â”€â”€
      if (walletReqResult.status === 'fulfilled') {
        const res = walletReqResult.value;
        const list = Array.isArray(res) ? res
          : (Array.isArray(res?.data) ? res.data
          : (Array.isArray(res?.data?.requests) ? res.data.requests
          : (Array.isArray(res?.requests) ? res.requests : [])));
        const mapped = list.map((r, i) => ({
          id:        r.id || r._id || i,
          type:      r.type || r.requestType || 'withdrawal',
          amount:    Number(r.amount || r.amountUsd || r.value || 0),
          currency:  r.currency || 'USD',
          status:    (r.status || 'pending').toLowerCase(),
          walletAddr: r.walletAddress || r.toAddress || r.address || 'â€”',
          notes:     r.notes || r.description || r.reason || '',
          date:      (r.date || r.createdAt)
            ? new Date(r.date || r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'â€”',
          reviewedAt: (r.reviewedAt || r.updatedAt)
            ? new Date(r.reviewedAt || r.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : null,
        }));
        setWalletRequests(mapped);
      } else {
        console.warn('getWalletRequests failed:', walletReqResult.reason?.message);
      }

      // â”€â”€ Direct Airdrops â”€â”€
      if (airdropsResult.status === 'fulfilled') {
        const res = airdropsResult.value;
        const list = Array.isArray(res) ? res
          : (Array.isArray(res?.data) ? res.data
          : (Array.isArray(res?.data?.airdrops) ? res.data.airdrops
          : (Array.isArray(res?.airdrops) ? res.airdrops : [])));
        const mapped = list.map((a, i) => ({
          id:          a.id || a._id || `airdrop-${i}`,
          token:       a.tokenName  || a.token || a.name || '',
          ticker:      a.ticker     || a.symbol || '',
          logo:        a.logo       || a.logoUrl || '/assets/images/icon/shivAiToken.png',
          tokenQty:    Number(a.tokenQty || a.qty || a.quantity || 0),
          amountUsd:   Number(a.amountUsd || a.amount || 0),
          reference:   a.reference  || a.ref || '',
          airdropType: a.airdropType || a.type || '',
          adminNote:   a.adminNote  || a.reason || a.description || a.notes || '',
          status:      (a.status || 'completed').toLowerCase(),
          date:        (a.createdAt || a.date)
            ? new Date(a.createdAt || a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'â€”',
          completedAt: a.completedAt
            ? new Date(a.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : null,
        }));
        setDirectAirdrops(mapped);
      } else {
        console.warn('getDirectAirdrops failed:', airdropsResult.reason?.message);
      }

      setLastRefreshed(new Date());
      setDataLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Track whether this is the first render to avoid double-fetching on mount */
  const isInitialTabMount = useRef(true);

  // On mount: initial fetch
  useEffect(() => {
    fetchLiveData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => { fetchLiveData(); }, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // â”€â”€ Real user: Recoil atom (live) with direct secureStorage read as instant fallback â”€â”€
  const recoilUser = useRecoilValue(userState);
  const [, setToken] = useRecoilState(authTokenState);
  const [, setUser] = useRecoilState(userState);
  // If Recoil hasnâ€™t been seeded yet on this render cycle, read directly from cache
  // so we never fall back to the mock INVESTOR object while the atom is initializing.
  const u = recoilUser || getUser();

  // Normalise API response to the shape the dashboard expects, keeping mock
  // values as fallbacks so nothing breaks while backend fields are rolled out.

  // Map backend uppercase enum values â†’ internal lowercase keys
  const KYC_STATUS_MAP = {
    PENDING_APPROVAL: 'pending',
    APPROVED:         'approved',
    REJECTED:         'rejected',
    UNDER_REVIEW:     'under_review',
    NOT_STARTED:      'not_started',
    // pass-through lowercase values unchanged
    pending:          'pending',
    approved:         'approved',
    rejected:         'rejected',
    under_review:     'under_review',
    not_started:      'not_started',
  };
  const rawKycStatus = u?.kycStatus || u?.kyc_status || INVESTOR.kycStatus;
  const normalizedKycStatus = KYC_STATUS_MAP[rawKycStatus] || rawKycStatus;

  const investor = {
    name:                  u?.name        || u?.fullName   || INVESTOR.name,
    email:                 u?.email                       || INVESTOR.email,
    kycStatus:             normalizedKycStatus,
    walletAddress:         u?.walletAddress               || INVESTOR.walletAddress,
    joinedDate:            u?.joinedDate  || u?.createdAt  || INVESTOR.joinedDate,
    tier:                  u?.tier                        || INVESTOR.tier,
    affiliateCode:         u?.affiliateCode               || INVESTOR.affiliateCode,
    affiliateStatus:       u?.affiliateStatus             || INVESTOR.affiliateStatus,
    referralCount:         u?.referralCount        ?? INVESTOR.referralCount,
    totalReferralEarned:   u?.totalReferralEarned  ?? INVESTOR.totalReferralEarned,
    pendingReferralPayout: u?.pendingReferralPayout ?? INVESTOR.pendingReferralPayout,
    linkedAccounts:        u?.linkedAccounts       || INVESTOR.linkedAccounts,
  };

  const affiliateUserKey = u?.id || u?._id || investor.email;

  useEffect(() => {
    const stored = loadAffiliateApplication(affiliateUserKey);
    const apiStatus = investor.affiliateStatus;
    if (apiStatus === AFFILIATE_STATUS.APPROVED) {
      setAffiliateApp(prev => ({ ...prev, status: AFFILIATE_STATUS.APPROVED, ...(stored || {}) }));
    } else if (stored?.status) {
      setAffiliateApp(stored);
    } else if (apiStatus && apiStatus !== AFFILIATE_STATUS.NONE) {
      setAffiliateApp({ status: apiStatus });
    } else {
      setAffiliateApp({ status: AFFILIATE_STATUS.NONE });
    }
  }, [affiliateUserKey, investor.affiliateStatus]);

  const handleAffiliateAppChange = useCallback((next) => {
    setAffiliateApp(next);
    saveAffiliateApplication(affiliateUserKey, next);
  }, [affiliateUserKey]);

  const isAffiliateApproved = affiliateApp?.status === AFFILIATE_STATUS.APPROVED
    || investor.affiliateStatus === AFFILIATE_STATUS.APPROVED;

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    clearAuth();
    apiService.setToken(null);
    navigate('/login');
  };

  // Derive active tab from URL segment, e.g. /dashboard/portfolio â†’ 'portfolio'
  const tabFromUrl = pathname.split('/dashboard')[1]?.replace('/', '') || 'overview';
  const activeTab = VALID_TABS.has(tabFromUrl) ? tabFromUrl : 'overview';

  // KYC gate â€” tabs locked until KYC approved, EXCEPT invest/wallet/transactions are open
  const kycApproved = investor.kycStatus === 'approved';
  const KYC_FREE_TABS = new Set(['verification', 'settings', 'invest', 'wallet', 'transactions']);
  const isTabLocked = (id) => !kycApproved && !KYC_FREE_TABS.has(id);

  // On mount: if not KYC-approved and trying to access a locked tab â†’ redirect to verification
  // Also redirect away from verification tab if KYC is already approved
  useEffect(() => {
    if (!kycApproved && !KYC_FREE_TABS.has(activeTab)) {
      navigate('/dashboard/verification', { replace: true });
    } else if (kycApproved && activeTab === 'verification') {
      navigate('/dashboard', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kycApproved]);

  const handleNav = (id) => {
    if (isTabLocked(id)) return; // ignore clicks on locked tabs
    navigate(`/dashboard${id === 'overview' ? '' : '/' + id}`);
    setSidebarOpen(false);
  };

  // Refresh all data + profile on every tab switch (skip first render â€” mount effect handles it)
  useEffect(() => {
    if (isInitialTabMount.current) {
      isInitialTabMount.current = false;
      return;
    }
    // Re-fetch all investor data
    fetchLiveData();
    // Also refresh profile so KYC status / name / tier stay up to date
    const tok = getToken();
    if (tok) {
      apiService.get('/auth/me').then(res => {
        const profile = res?.data || res;
        if (profile && typeof profile === 'object' && profile.email) {
          setUser(profile);
          saveUser(profile);
        }
      }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const renderTab = () => {
    // Safety: if tab is locked (shouldn't happen after redirect), show verification
    if (isTabLocked(activeTab)) return <TabVerification investor={investor} onNav={handleNav} />;
    const addPendingPurchase = (p) => setPendingPurchases(prev => [p, ...prev]);
    switch (activeTab) {
      case 'overview':     return <TabOverview investor={investor} approvedPurchases={approvedPurchases} pendingPurchases={pendingPurchases} walletData={walletData} walletTransactions={walletTransactions} directAirdrops={directAirdrops} onNav={handleNav} />;
      case 'portfolio':    return <TabPortfolio onNav={handleNav} availableTokens={availableTokens} approvedPurchases={approvedPurchases} directAirdrops={directAirdrops} />;
      case 'invest':       return <TabInvest investor={investor} availableTokens={availableTokens} dataLoading={dataLoading} lastRefreshed={lastRefreshed} onRefresh={fetchLiveData} onAddPendingPurchase={addPendingPurchase} />;
      case 'transactions': return <TabTransactions pendingPurchases={pendingPurchases} walletTransactions={walletTransactions} onUploadScreenshot={(id, file) => {
        setPendingPurchases(prev => prev.map(p => p.id === id ? { ...p, paymentStatus: 'screenshot_uploaded', screenshotFile: file } : p));
      }} />;
      case 'wallet':       return <TabWallet investor={investor} pendingPurchases={pendingPurchases} approvedPurchases={approvedPurchases} walletData={walletData} walletRequests={walletRequests} directAirdrops={directAirdrops} dataLoading={dataLoading} lastRefreshed={lastRefreshed} onRefresh={fetchLiveData} onNav={handleNav} />;
      case 'affiliate':    return (
        <TabAffiliate
          investor={investor}
          affiliateApp={affiliateApp}
          onAffiliateAppChange={handleAffiliateAppChange}
          enrolled={enrolledPrograms}
          setEnrolled={setEnrolledPrograms}
          directProgramId={directAffProgId}
          onClearDirect={() => setDirectAffProgId(null)}
        />
      );
      case 'verification': return <TabVerification investor={investor} onNav={handleNav} />;
      case 'settings':     return <TabSettings investor={investor} />;
      default:             return <TabOverview investor={investor} approvedPurchases={approvedPurchases} pendingPurchases={pendingPurchases} walletData={walletData} walletTransactions={walletTransactions} directAirdrops={directAirdrops} onNav={handleNav} />;
    }
  };

  return (
    <div className="db-shell">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* â”€â”€ Sidebar â”€â”€ */}
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
          {NAV_ITEMS.filter(item => !(item.id === 'verification' && kycApproved)).map(item => {
            const enrolledList = item.id === 'affiliate' && isAffiliateApproved
              ? AFFILIATE_PROGRAMS.filter(p => enrolledPrograms[p.id])
              : [];
            return (
              <div key={item.id}>
                <button
                  className={`db-nav-item ${activeTab === item.id ? 'db-nav-item--active' : ''} ${isTabLocked(item.id) ? 'db-nav-item--locked' : ''}`}
                  onClick={() => handleNav(item.id)}
                  title={isTabLocked(item.id) ? 'Complete KYC verification to unlock' : undefined}
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

        {/* Invest CTA */}
        <div className="db-sidebar-invest">
          <button className="db-sidebar-invest-btn" onClick={() => handleNav('invest')}>
            <span className="db-invest-live-dot" />
            Invest Now
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <p className="db-sidebar-invest-sub">ShivAI Token Â· LIVE</p>
        </div>

        {/* KYC status chip at bottom */}
        <div className="db-sidebar-footer">
          <div className="db-sidebar-user">
            <div className="db-sidebar-avatar">{investor.name.charAt(0)}</div>
            <div className="db-sidebar-user-info">
              <span className="db-sidebar-user-name">{investor.name.split(' ')[0]}</span>
              <KycBadge status={investor.kycStatus} />
            </div>
          </div>
          <button className="db-nav-item db-nav-item--logout" onClick={handleLogout}>
            <Icon.logout />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* â”€â”€ Main area â”€â”€ */}
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
            <button className="db-topbar-invest-btn" onClick={() => handleNav('invest')}>
              <span className="db-invest-live-dot" />
              <span>Invest Now</span>
            </button>
            <button className="db-icon-btn" aria-label="Notifications">
              <Icon.bell />
              <span className="db-notif-dot" />
            </button>
            <div className="db-topbar-avatar">{investor.name.charAt(0)}</div>
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
