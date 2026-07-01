import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AFFILIATE_PROGRAMS,
  AFFILIATE_STATUS,
  COMMISSION_TIERS,
  MOCK_REFERRALS,
  PROMOTION_CHANNELS,
  REWARD_HIGHLIGHTS,
  buildDummyAffiliateProfile,
  buildProgramLink,
  buildReferralLink,
  mergeAffiliateInvestor,
} from './affiliateData';

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

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

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

const ShareButtons = ({ link, tokenName, tokenTicker }) => (
  <div className="db-aff-share-row db-aff-share-row--stack">
    {[
      { label: 'Telegram', color: '#229ED9', href: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`Invest in ${tokenName || 'Growith'} — join via my link`)}` },
      { label: 'X / Twitter', color: '#1DA1F2', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`Investing in ${tokenTicker || 'tokens'} on Growith`)}` },
      { label: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(`Join Growith: ${link}`)}` },
    ].map(s => (
      <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
        className="db-share-btn db-aff-share-pill" style={{ borderColor: s.color, color: s.color }}>
        {s.label}
      </a>
    ))}
  </div>
);

const AffSectionTitle = ({ children }) => (
  <div className="db-aff-v2-section-title" role="heading" aria-level={2}>{children}</div>
);

function ReferralLinkCard({ link, copyKey, onCopy, copied, title, subtitle }) {
  return (
    <div className="db-aff-v2-link-hero db-aff-link-card">
      <div className="db-aff-v2-section-head">
        <AffSectionTitle>{title}</AffSectionTitle>
        {subtitle && <p className="db-muted">{subtitle}</p>}
      </div>
      <div className="db-aff-link-stack">
        <div className="db-aff-link-url">{link}</div>
        <button type="button" className="db-aff-link-copy-btn" onClick={() => onCopy(link, copyKey)}>
          <CopyIcon /> {copied === copyKey ? 'Copied!' : 'Copy link'}
        </button>
      </div>
      <ShareButtons link={link} />
      <div className="db-info-box db-aff-v2-info">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          Commission is credited only after your referral completes <strong>KYC</strong> and their <strong>payment is confirmed</strong> (card or USDT). Payouts go to your wallet.
        </div>
      </div>
    </div>
  );
}

/* ── Apply / landing (not yet an affiliate) ───────────────── */
function AffiliateApplyView({ investor, onSubmit, submitting }) {
  const [channel, setChannel] = useState(PROMOTION_CHANNELS[0]);
  const [message, setMessage] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    onSubmit({ channel, message, socialLink });
  };

  const canSubmit = agreed && message.trim().length >= 10;

  return (
    <div className="db-tab-content db-aff-v2">
      {submitting && (
        <div className="db-aff-submit-overlay">
          <div className="db-aff-submit-overlay__card">
            <div className="db-aff-submit-overlay__spinner" />
            <strong>Submitting your application…</strong>
            <span>Our team is reviewing your profile</span>
          </div>
        </div>
      )}
      <div className="db-aff-hero">
        <div className="db-aff-hero__glow db-aff-hero__glow--1" />
        <div className="db-aff-hero__glow db-aff-hero__glow--2" />
        <div className="db-aff-hero__content">
          <span className="db-aff-hero__pill">Partner Program</span>
          <h1 className="db-aff-hero__title">Turn your network into <span>real earnings</span></h1>
          <p className="db-aff-hero__desc">
            Apply to become a Growith affiliate. Share token investment links, grow the community, and earn up to <strong>5% commission</strong> on every confirmed investment — plus L2 &amp; L3 network rewards.
          </p>
          <div className="db-aff-hero__chips">
            <span>💎 ShivAI campaigns live</span>
            <span>⚡ Wallet payouts</span>
            <span>🌐 3-tier network</span>
          </div>
        </div>
        <div className="db-aff-hero__visual" aria-hidden="true">
          <div className="db-aff-hero__coin db-aff-hero__coin--1">💰</div>
          <div className="db-aff-hero__coin db-aff-hero__coin--2">🚀</div>
          <div className="db-aff-hero__coin db-aff-hero__coin--3">✨</div>
          <div className="db-aff-hero__earn-card">
            <span className="db-aff-hero__earn-label">Example earnings</span>
            <strong className="db-aff-hero__earn-value">$250</strong>
            <span className="db-aff-hero__earn-sub">5 referrals × $1,000 @ 5%</span>
          </div>
        </div>
      </div>

      <div className="db-aff-reward-grid">
        {REWARD_HIGHLIGHTS.map(item => (
          <div key={item.title} className="db-aff-reward-card">
            <span className="db-aff-reward-card__icon">{item.icon}</span>
            <strong>{item.title}</strong>
            <span>{item.desc}</span>
          </div>
        ))}
      </div>

      <div className="db-aff-v2-tier-grid db-aff-v2-tier-grid--preview">
        {COMMISSION_TIERS.map(tier => (
          <div key={tier.level} className="db-aff-v2-tier-card db-aff-v2-tier-card--glow" style={{ '--tier-color': tier.color }}>
            <div className="db-aff-v2-tier-top">
              <span className="db-aff-v2-tier-badge" style={{ background: `${tier.color}18`, color: tier.color, borderColor: `${tier.color}40` }}>
                {tier.level}
              </span>
              <span className="db-aff-v2-tier-rate" style={{ color: tier.color }}>{tier.rate}%</span>
            </div>
            <div className="db-aff-v2-tier-name">{tier.name}</div>
            <p className="db-aff-v2-tier-desc">{tier.desc}</p>
          </div>
        ))}
      </div>

      <section className="db-aff-apply-card">
        <div className="db-aff-apply-card__head">
          <h2>Apply to become an affiliate</h2>
          <p>Tell us how you plan to promote Growith. Our team reviews applications within 24–48 hours.</p>
        </div>
        <form className="db-aff-apply-form" onSubmit={handleSubmit}>
          <label className="db-aff-apply-field">
            <span>Primary promotion channel</span>
            <select value={channel} onChange={e => setChannel(e.target.value)} required>
              {PROMOTION_CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="db-aff-apply-field">
            <span>How will you promote Growith? <em>(required)</em></span>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. I run a crypto investment community on Telegram with 2,000 members..."
              rows={4}
              required
              minLength={20}
            />
          </label>
          <label className="db-aff-apply-field">
            <span>Website or social link <em>(optional)</em></span>
            <input
              type="url"
              value={socialLink}
              onChange={e => setSocialLink(e.target.value)}
              placeholder="https://twitter.com/yourhandle"
            />
          </label>
          <label className="db-aff-apply-check">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span>I agree to the Growith Affiliate Terms and understand commissions are paid only after referred investors complete KYC and payment.</span>
          </label>
          <button type="submit" className="db-aff-cta-btn" disabled={submitting || !canSubmit}>
            {submitting ? 'Submitting…' : 'Raise affiliate request'}
            {!submitting && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}

/* ── Pending admin review ─────────────────────────────────── */
function AffiliatePendingView({ submittedAt }) {
  const steps = [
    { id: 'done', label: 'Request submitted', desc: submittedAt ? `Submitted ${submittedAt}` : 'Your application is in' },
    { id: 'active', label: 'Admin review', desc: 'Our team is verifying your profile' },
    { id: 'wait', label: 'Get your link', desc: 'Unique referral code & dashboard unlock' },
    { id: 'wait', label: 'Start earning', desc: 'Share links and track commissions' },
  ];

  return (
    <div className="db-tab-content db-aff-v2">
      <div className="db-aff-status-card db-aff-status-card--pending">
        <div className="db-aff-status-card__icon db-aff-status-card__icon--pulse">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h1>Application under review</h1>
        <p>Thanks for applying! An admin will approve or reject your affiliate request. You&apos;ll get access to referral links and earning tools once approved.</p>
        <div className="db-aff-status-badge db-aff-status-badge--pending">Pending · Usually 24–48 hrs</div>
      </div>

      <div className="db-aff-timeline">
        {steps.map((s, i) => (
          <div key={i} className={`db-aff-timeline__step db-aff-timeline__step--${s.id}`}>
            <div className="db-aff-timeline__dot" />
            <div>
              <strong>{s.label}</strong>
              <span>{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="db-aff-reward-grid db-aff-reward-grid--compact">
        {REWARD_HIGHLIGHTS.map(item => (
          <div key={item.title} className="db-aff-reward-card db-aff-reward-card--muted">
            <span className="db-aff-reward-card__icon">{item.icon}</span>
            <strong>{item.title}</strong>
            <span>{item.desc}</span>
          </div>
        ))}
      </div>

      <p className="db-muted db-aff-v2-footnote" style={{ textAlign: 'center' }}>
        Questions? <a href="mailto:affiliates@growith.io" className="db-link">affiliates@growith.io</a>
      </p>
    </div>
  );
}

/* ── Rejected ─────────────────────────────────────────────── */
function AffiliateRejectedView({ reason, onReapply }) {
  return (
    <div className="db-tab-content db-aff-v2">
      <div className="db-aff-status-card db-aff-status-card--rejected">
        <div className="db-aff-status-card__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <h1>Application not approved</h1>
        <p>{reason || 'Your affiliate application was not approved at this time. You can update your details and apply again.'}</p>
        <button type="button" className="db-aff-cta-btn db-aff-cta-btn--secondary" onClick={onReapply}>
          Apply again
        </button>
      </div>
    </div>
  );
}

/* ── Approved dashboard ───────────────────────────────────── */
function AffiliateDashboard({
  investor,
  enrolled,
  setEnrolled,
  directProgramId,
  onClearDirect,
  justApproved,
  onDismissWelcome,
}) {
  const { copy, copied } = useCopyText();
  const [enrolling, setEnrolling] = useState(null);
  const [expandedProgram, setExpandedProgram] = useState(null);
  const programRefs = useRef({});

  const mainLink = buildReferralLink(investor.affiliateCode);
  const linkClicks = investor.linkClicks ?? 0;
  const linkSignups = investor.linkSignups ?? 0;
  const convRate = linkClicks > 0 ? ((linkSignups / linkClicks) * 100).toFixed(1) : '0.0';

  useEffect(() => {
    if (!directProgramId) return;
    const prog = AFFILIATE_PROGRAMS.find(p => p.id === directProgramId);
    if (!prog) return;
    setExpandedProgram(prog.id);
    onClearDirect();
    requestAnimationFrame(() => {
      programRefs.current[prog.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [directProgramId, onClearDirect]);

  const handleEnroll = async (programId) => {
    setEnrolling(programId);
    await new Promise(r => setTimeout(r, 1200));
    setEnrolled(prev => ({ ...prev, [programId]: true }));
    setEnrolling(null);
    setExpandedProgram(programId);
  };

  return (
    <div className="db-tab-content db-aff-v2 db-aff-v2--approved">
      {justApproved && (
        <div className="db-aff-welcome-banner">
          <div className="db-aff-welcome-banner__icon">🎉</div>
          <div>
            <strong>You&apos;re approved!</strong>
            <span>Your affiliate dashboard is live with sample data. Share your link and start earning.</span>
          </div>
          <button type="button" className="db-aff-welcome-banner__close" onClick={onDismissWelcome} aria-label="Dismiss">×</button>
        </div>
      )}
      <div className="db-aff-approved-hero">
        <div className="db-aff-approved-hero__glow" aria-hidden="true" />
        <div className="db-aff-approved-hero__body">
          <span className="db-aff-approved-banner__badge">✓ Approved Partner</span>
          <h1 className="db-aff-approved-hero__title">Invite &amp; Earn</h1>
          <p className="db-aff-approved-hero__desc">Your referral dashboard is live. Share links, track performance, and grow your commission.</p>
        </div>
        <div className="db-aff-code-chip">
          <span className="db-aff-code-chip__label">Your code</span>
          <strong className="db-aff-code-chip__value">{investor.affiliateCode}</strong>
        </div>
      </div>

      <div className="db-aff-stats db-aff-stats--approved">
        {[
          { label: 'Total Earned', value: `$${investor.totalReferralEarned}`, sub: 'All-time commission', accent: '#22C55E' },
          { label: 'Pending Payout', value: `$${investor.pendingReferralPayout}`, sub: 'Awaiting clearance', accent: '#F59E0B' },
          { label: 'Direct Referrals', value: investor.referralCount, sub: 'L1 investors', accent: '#3B82F6' },
          { label: 'Link Performance', value: `${linkClicks} clicks`, sub: `${linkSignups} sign-ups · ${convRate}%`, accent: '#9D6FFF' },
        ].map(s => (
          <div key={s.label} className="db-aff-stat-card db-aff-stat-card--approved">
            <span className="db-aff-stat-card__accent" style={{ background: s.accent }} />
            <span className="db-aff-stat-value">{s.value}</span>
            <span className="db-aff-stat-label">{s.label}</span>
            <span className="db-aff-stat-sub">{s.sub}</span>
          </div>
        ))}
      </div>

      <ReferralLinkCard
        link={mainLink}
        copyKey="main"
        onCopy={copy}
        copied={copied}
        title="Your main referral link"
        subtitle="Anyone who signs up through this link is attributed to you."
      />

      <div className="db-aff-compact-panel">
        <div className="db-aff-compact-panel__block">
          <AffSectionTitle>How you earn</AffSectionTitle>
          <div className="db-aff-v2-steps">
            {[
              { step: 1, title: 'Share your link', desc: 'Copy your referral or program link and share anywhere.' },
              { step: 2, title: 'They sign up', desc: 'Your referral creates a Growith account via your link.' },
              { step: 3, title: 'They invest', desc: 'KYC + payment confirmed (Stripe or USDT).' },
              { step: 4, title: 'You earn', desc: 'Commission lands in your wallet automatically.' },
            ].map(item => (
              <div key={item.step} className="db-aff-v2-step">
                <div className="db-aff-v2-step-num">{item.step}</div>
                <div className="db-aff-v2-step-body">
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="db-aff-compact-panel__block">
          <AffSectionTitle>Commission structure</AffSectionTitle>
          <p className="db-aff-v2-section-desc">Multi-tier — earn on direct referrals and your network.</p>
          <div className="db-aff-v2-tier-grid">
            {COMMISSION_TIERS.map(tier => (
              <div key={tier.level} className="db-aff-v2-tier-card db-aff-v2-tier-card--glow" style={{ '--tier-color': tier.color }}>
                <div className="db-aff-v2-tier-top">
                  <span className="db-aff-v2-tier-badge" style={{ background: `${tier.color}18`, color: tier.color, borderColor: `${tier.color}40` }}>
                    {tier.level}
                  </span>
                  <span className="db-aff-v2-tier-rate" style={{ color: tier.color }}>{tier.rate}%</span>
                </div>
                <div className="db-aff-v2-tier-name">{tier.name}</div>
                <p className="db-aff-v2-tier-desc">{tier.desc}</p>
                <div className="db-aff-v2-tier-min">Min. payout <strong>${tier.minPayout}</strong></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="db-aff-block">
        <div className="db-aff-v2-section-head">
          <AffSectionTitle>Active programs</AffSectionTitle>
          <p className="db-aff-v2-section-desc">Join campaigns for token-specific links and boosted rates.</p>
        </div>
        <div className="db-aff-program-list">
          {AFFILIATE_PROGRAMS.map(prog => {
            const isEnrolled = !!enrolled[prog.id];
            const isExpanded = expandedProgram === prog.id;
            const personalProgLink = buildReferralLink(investor.affiliateCode, prog.id);
            const publicProgLink = buildProgramLink(prog);

            return (
              <div
                key={prog.id}
                ref={el => { programRefs.current[prog.id] = el; }}
                className={`db-aff-prog-card db-aff-v2-prog ${isEnrolled ? 'db-aff-prog-card--enrolled' : ''} ${isExpanded ? 'db-aff-v2-prog--expanded' : ''}`}
              >
                <div className="db-aff-prog-card__head">
                  <div className="db-aff-prog-card__tags">
                    <span className="db-aff-prog-card__tag" style={{ color: prog.tagColor, background: `${prog.tagColor}18`, borderColor: `${prog.tagColor}40` }}>
                      {prog.tag}
                    </span>
                    <span className="db-aff-prog-card__status" style={{ color: '#22C55E', background: 'rgba(34,197,94,0.1)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block', marginRight: 5 }} />
                      Active
                    </span>
                  </div>
                  <div className="db-aff-v2-prog-title-row">
                    <img src={prog.tokenLogo} alt="" className="db-aff-v2-prog-logo" onError={e => { e.target.style.display = 'none'; }} />
                    <div>
                      <span className="db-aff-prog-card__name">{prog.name}</span>
                      <span className="db-aff-v2-prog-token">{prog.tokenName} · {prog.tokenTicker}</span>
                    </div>
                  </div>
                  <div className="db-aff-v2-prog-rates">
                    <span style={{ color: '#3B82F6' }}>L1 {prog.l1Rate}%</span>
                    <span style={{ color: '#22C55E' }}>L2 {prog.l2Rate}%</span>
                    <span style={{ color: '#94A3B8' }}>L3 {prog.l3Rate}%</span>
                  </div>
                </div>

                <div className="db-aff-prog-card__meta">
                  <span>Min: <strong>${prog.minInvestPerReferral.toLocaleString()}</strong></span>
                  <span>Ends: <strong>{prog.endsDate}</strong></span>
                </div>

                <PoolBar used={prog.usedPool} total={prog.totalPool} />

                <div className="db-aff-prog-card__actions">
                  <button type="button" className="db-btn db-btn--secondary db-btn--sm"
                    onClick={() => setExpandedProgram(isExpanded ? null : prog.id)}>
                    {isExpanded ? 'Hide' : 'Links & details'}
                  </button>
                  {isEnrolled ? (
                    <span className="db-aff-prog-enrolled-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Joined
                    </span>
                  ) : (
                    <button type="button" className="db-btn db-btn--primary db-btn--sm"
                      disabled={enrolling === prog.id} onClick={() => handleEnroll(prog.id)}>
                      {enrolling === prog.id ? 'Joining…' : 'Join program'}
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="db-aff-v2-prog-detail">
                    <div className="db-aff-v2-prog-highlights">
                      {prog.highlights.map((h, i) => (
                        <div key={i} className="db-aff-prog-card__hl">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={prog.tagColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          {h}
                        </div>
                      ))}
                    </div>
                    <div className="db-aff-v2-link-block">
                      <label className="db-aff-v2-link-label">Your link for this program</label>
                      <div className="db-aff-link-stack">
                        <div className="db-aff-link-url">{personalProgLink}</div>
                        <button type="button" className="db-aff-link-copy-btn" onClick={() => copy(personalProgLink, `prog-${prog.id}`)}>
                          <CopyIcon /> {copied === `prog-${prog.id}` ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <ShareButtons link={personalProgLink} tokenName={prog.tokenName} tokenTicker={prog.tokenTicker} />
                    </div>
                    <div className="db-aff-v2-link-block">
                      <label className="db-aff-v2-link-label">Public program page</label>
                      <div className="db-aff-link-stack">
                        <div className="db-aff-link-url">{publicProgLink}</div>
                        <button type="button" className="db-aff-link-copy-btn" onClick={() => copy(publicProgLink, `pub-${prog.id}`)}>
                          <CopyIcon /> {copied === `pub-${prog.id}` ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <ol className="db-aff-rules-list">
                      {prog.rules.map((r, i) => <li key={i}>{r}</li>)}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="db-aff-block">
        <AffSectionTitle>Recent referral activity</AffSectionTitle>
        <div className="db-aff-v2-referrals">
          {MOCK_REFERRALS.map(ref => (
            <div key={ref.id} className="db-aff-v2-ref-row">
              <div className="db-aff-v2-ref-main">
                <span className="db-aff-v2-ref-name">{ref.name}</span>
                <span className="db-aff-v2-ref-meta">
                  <span className="db-aff-v2-tier-badge db-aff-v2-tier-badge--sm" style={{
                    background: ref.tier === 'L1' ? 'rgba(59,130,246,0.12)' : 'rgba(34,197,94,0.12)',
                    color: ref.tier === 'L1' ? '#3B82F6' : '#22C55E',
                  }}>{ref.tier}</span>
                  · ${ref.invested.toLocaleString()} · {ref.date}
                </span>
              </div>
              <div className="db-aff-v2-ref-right">
                <span className="db-aff-v2-ref-commission" style={{ color: ref.status === 'paid' ? '#22C55E' : '#F59E0B' }}>
                  +${ref.commission}
                </span>
                <span className={`db-aff-v2-ref-status db-aff-v2-ref-status--${ref.status}`}>
                  {ref.status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────── */
export default function TabAffiliate({
  investor,
  affiliateApp,
  onAffiliateAppChange,
  enrolled,
  setEnrolled,
  directProgramId,
  onClearDirect,
}) {
  const [submitting, setSubmitting] = useState(false);

  const status = affiliateApp?.status
    || (investor.affiliateStatus === AFFILIATE_STATUS.APPROVED ? AFFILIATE_STATUS.APPROVED : AFFILIATE_STATUS.NONE);

  const handleApply = async (form) => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    const profile = buildDummyAffiliateProfile(investor);
    onAffiliateAppChange({
      status: AFFILIATE_STATUS.APPROVED,
      justApproved: true,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approvedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...profile,
      ...form,
    });
    setEnrolled(prev => ({ ...prev, [AFFILIATE_PROGRAMS[0]?.id]: true }));
    setSubmitting(false);
  };

  const handleDismissWelcome = () => {
    if (affiliateApp?.justApproved) {
      onAffiliateAppChange({ ...affiliateApp, justApproved: false });
    }
  };

  const dashboardInvestor = mergeAffiliateInvestor(investor, affiliateApp);

  const handleReapply = () => {
    onAffiliateAppChange({ status: AFFILIATE_STATUS.NONE });
  };

  if (!affiliateApp && status === AFFILIATE_STATUS.NONE) {
    return (
      <div className="db-tab-content db-aff-v2">
        <div className="db-aff-skeleton">Loading affiliate status…</div>
      </div>
    );
  }

  if (status === AFFILIATE_STATUS.PENDING) {
    return <AffiliatePendingView submittedAt={affiliateApp?.submittedAt} />;
  }

  if (status === AFFILIATE_STATUS.REJECTED) {
    return (
      <AffiliateRejectedView
        reason={affiliateApp?.rejectionReason}
        onReapply={handleReapply}
      />
    );
  }

  if (status === AFFILIATE_STATUS.APPROVED || investor.affiliateStatus === AFFILIATE_STATUS.APPROVED) {
    return (
      <AffiliateDashboard
        investor={dashboardInvestor}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
        directProgramId={directProgramId}
        onClearDirect={onClearDirect}
        justApproved={!!affiliateApp?.justApproved}
        onDismissWelcome={handleDismissWelcome}
      />
    );
  }

  return (
    <AffiliateApplyView
      investor={investor}
      onSubmit={handleApply}
      submitting={submitting}
    />
  );
}
