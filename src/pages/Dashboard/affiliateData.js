/* Affiliate mock data — aligned with admin panel (programs, L1/L2/L3 tiers, payouts) */

export const AFFILIATE_STATUS = {
  NONE: 'none',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const PROMOTION_CHANNELS = [
  'Social media (Instagram, X, LinkedIn)',
  'YouTube / Podcast',
  'Blog or website',
  'Telegram / Discord community',
  'Friends & personal network',
  'Other',
];

export const REWARD_HIGHLIGHTS = [
  { icon: '💰', title: 'Up to 5% per referral', desc: 'Earn on every confirmed L1 investment' },
  { icon: '🔗', title: '3-level network', desc: 'L2 & L3 commissions from your network' },
  { icon: '⚡', title: 'Fast payouts', desc: 'Commissions land in your Growith wallet' },
  { icon: '🚀', title: 'Token campaigns', desc: 'Join ShivAI & VIP programs for boosted rates' },
];

export function loadAffiliateApplication(userKey) {
  if (!userKey) return null;
  try {
    const raw = localStorage.getItem(`growith_aff_app_${userKey}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAffiliateApplication(userKey, data) {
  if (!userKey) return;
  localStorage.setItem(`growith_aff_app_${userKey}`, JSON.stringify(data));
}

export const COMMISSION_TIERS = [  {
    level: 'L1',
    name: 'Direct Referral',
    rate: 5,
    color: '#3B82F6',
    minPayout: 100,
    desc: 'When someone you referred signs up and completes a confirmed investment.',
  },
  {
    level: 'L2',
    name: 'Second Level',
    rate: 3,
    color: '#22C55E',
    minPayout: 50,
    desc: 'When an investor referred by your L1 affiliate makes a confirmed investment.',
  },
  {
    level: 'L3',
    name: 'Third Level',
    rate: 1.5,
    color: '#94A3B8',
    minPayout: 25,
    desc: 'When an investor referred by your L2 affiliate makes a confirmed investment.',
  },
];

export const AFFILIATE_PROGRAMS = [
  {
    id: 'shivai-launch',
    slug: 'SHVAI-LAUNCH-X9K',
    tokenId: 1,
    tokenName: 'ShivAI',
    tokenTicker: 'SHVAI',
    tokenLogo: '/assets/images/icon/shivAiToken.png',
    name: 'ShivAI Launch Campaign',
    tag: 'Launch',
    tagColor: '#3B82F6',
    status: 'active',
    l1Rate: 5,
    l2Rate: 3,
    l3Rate: 1.5,
    minInvestPerReferral: 500,
    payoutDelay: '3 business days after payment confirmed',
    totalPool: 50000,
    usedPool: 18400,
    endsDate: 'Dec 31, 2026',
    programLink: 'https://growith.io/program/SHVAI-LAUNCH-X9K',
    highlights: [
      'Earn on 3 referral levels — direct and network',
      '5% on direct (L1) investments',
      'Bonus pool while campaign is active',
    ],
    rules: [
      'Referred investor must complete KYC before commission is credited.',
      'Minimum referred investment: $500.',
      'Self-referrals are strictly prohibited.',
      'Commission credits after payment is confirmed (Stripe or USDT).',
    ],
  },
  {
    id: 'shivai-vip',
    slug: 'SHVAI-VIP-P2M',
    tokenId: 1,
    tokenName: 'ShivAI',
    tokenTicker: 'SHVAI',
    tokenLogo: '/assets/images/icon/shivAiToken.png',
    name: 'ShivAI VIP Partner',
    tag: 'VIP',
    tagColor: '#F59E0B',
    status: 'active',
    l1Rate: 6,
    l2Rate: 3.5,
    l3Rate: 2,
    minInvestPerReferral: 2000,
    payoutDelay: '1 business day after payment confirmed',
    totalPool: 20000,
    usedPool: 7200,
    endsDate: 'Jun 30, 2026',
    programLink: 'https://growith.io/program/SHVAI-VIP-P2M',
    highlights: [
      'Higher L1 rate (6%) for $2,000+ investments',
      'Priority payout within 1 business day',
      'Dedicated affiliate support',
    ],
    rules: [
      'Referred investment must be $2,000 or more to qualify.',
      'VIP access may require account manager approval.',
      'KYC must be completed by referred investor.',
    ],
  },
];

export const AFFILIATE_TOKENS = AFFILIATE_PROGRAMS.reduce((acc, p) => {
  if (!acc.find(t => t.id === p.tokenId)) {
    acc.push({
      id: p.tokenId,
      name: p.tokenName,
      ticker: p.tokenTicker,
      logo: p.tokenLogo,
      activePrograms: AFFILIATE_PROGRAMS.filter(x => x.tokenId === p.tokenId && x.status === 'active').length,
    });
  }
  return acc;
}, []);

export const MOCK_REFERRALS = [
  { id: 1, name: 'Priya S.', tier: 'L1', invested: 2500, commission: 125, status: 'paid', date: 'Mar 14, 2026' },
  { id: 2, name: 'James K.', tier: 'L1', invested: 5000, commission: 250, status: 'pending', date: 'Mar 15, 2026' },
  { id: 3, name: 'Via L1 network', tier: 'L2', invested: 1200, commission: 36, status: 'paid', date: 'Mar 12, 2026' },
];

/** Dummy stats shown after demo approval (replace with API) */
export const DUMMY_AFFILIATE_PROFILE = {
  referralCount: 8,
  totalReferralEarned: 640,
  pendingReferralPayout: 120,
  linkClicks: 142,
  linkSignups: 18,
};

export function generateAffiliateCode(name = 'USER') {
  const prefix = name.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '').slice(0, 6).toUpperCase() || 'GROW';
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

export function buildDummyAffiliateProfile(investor) {
  return {
    ...DUMMY_AFFILIATE_PROFILE,
    affiliateCode: investor.affiliateCode || generateAffiliateCode(investor.name),
  };
}

export function mergeAffiliateInvestor(investor, affiliateApp) {
  if (!affiliateApp || affiliateApp.status !== AFFILIATE_STATUS.APPROVED) return investor;
  return {
    ...investor,
    affiliateStatus: AFFILIATE_STATUS.APPROVED,
    affiliateCode: affiliateApp.affiliateCode || investor.affiliateCode,
    referralCount: affiliateApp.referralCount ?? investor.referralCount ?? 0,
    totalReferralEarned: affiliateApp.totalReferralEarned ?? investor.totalReferralEarned ?? 0,
    pendingReferralPayout: affiliateApp.pendingReferralPayout ?? investor.pendingReferralPayout ?? 0,
    linkClicks: affiliateApp.linkClicks ?? investor.linkClicks ?? 0,
    linkSignups: affiliateApp.linkSignups ?? investor.linkSignups ?? 0,
  };
}

export function buildReferralLink(affiliateCode, programId = null) {
  const base = `https://growith.io/ref/${affiliateCode}`;
  return programId ? `${base}?p=${programId}` : base;
}

export function buildProgramLink(program) {
  return program.programLink || `https://growith.io/program/${program.slug}`;
}
