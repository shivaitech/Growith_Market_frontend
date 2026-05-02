import { Link, useParams } from 'react-router-dom'
import { blogPosts } from '../../data'

const contentMap = {
  1: {
    body: [
      { type: 'p', text: 'Private capital markets have historically been inaccessible to most investors. High minimums — often $250,000 or more — combined with accreditation requirements meant that the highest-returning asset class was reserved for the ultra-wealthy. Tokenized securities are fundamentally changing this equation.' },
      { type: 'h4', text: 'What Makes a Security "Tokenized"?' },
      { type: 'p', text: 'A tokenized security is a regulated financial instrument — equity, debt, or revenue share — represented as a digital token on a blockchain. Unlike crypto tokens or NFTs, tokenized securities carry legal rights: dividends, voting power, or contractual redemption terms. The blockchain is simply the settlement and record-keeping infrastructure.' },
      { type: 'p', text: 'On Polygon, a single token transfer settles in under 2 seconds at a cost below $0.01. Compared to SWIFT or traditional clearing houses which take 2-5 business days, this is a generational leap in capital market efficiency.' },
      { type: 'h4', text: 'Why It Matters for Investors' },
      { type: 'p', text: 'Fractional ownership allows a $10,000 minimum investment to sit alongside a $10 million allocation in the exact same smart contract — same price, same rights, fully auditable on-chain. Compliance rules (KYC/AML, transfer restrictions, lock-in periods) are encoded directly into the token contract, reducing the operational cost of regulation dramatically.' },
      { type: 'list', items: ['Fractional ownership from as low as $500', 'Programmable compliance — no manual cap table management', 'Real-time audit trail on public blockchain', '24/7 settlement without intermediaries', 'EU-regulated issuance with full investor protections'] },
    ],
    tags: ['Tokenization', 'Private Equity', 'Blockchain', 'Regulation', 'DeFi'],
  },
  2: {
    body: [
      { type: 'p', text: 'Public equity markets offer one thing above all else: liquidity. You can exit a listed position in milliseconds. But that liquidity comes at a cost — public markets are brutally efficient at pricing in available information, leaving little room for alpha generation by ordinary investors.' },
      { type: 'h4', text: 'The Private Premium' },
      { type: 'p', text: 'Historically, private equity has outperformed public equity by 3-5% annually on a risk-adjusted basis. The reason is structural: private companies can focus on 10-year value creation without quarterly earnings pressure, management teams retain more equity, and early investors capture the full compounding curve before an IPO event.' },
      { type: 'p', text: 'The challenge has always been access. Growith solves this by creating a compliant token issuance layer that allows institutional-quality private placements to be distributed to a broader verified investor base — without sacrificing regulatory rigor.' },
      { type: 'h4', text: 'How Tokenization Bridges the Gap' },
      { type: 'p', text: 'A Growith tokenized security gives you: the return profile of a private placement, the settlement efficiency of a digital asset, and the legal protections of a regulated EU instrument. It is the best of both worlds — without the hedge fund minimums.' },
      { type: 'list', items: ['Private equity historically outperforms public by 3-5% p.a.', 'Tokenization removes $250K+ minimums', 'Smart contract lock-ins enforce holding periods automatically', 'On-chain registry eliminates paper cap tables', 'Secondary market liquidity possible post lock-in period'] },
    ],
    tags: ['Stocks', 'Private Placements', 'Alpha', 'Portfolio', 'Investing'],
  },
  3: {
    body: [
      { type: 'p', text: 'Every serious early-stage investor knows that a great pitch deck is just the beginning. The real work is in the numbers. Five metrics consistently separate the companies that scale from the ones that simply burn cash.' },
      { type: 'h4', text: '1. Monthly Recurring Revenue (MRR) Growth Rate' },
      { type: 'p', text: 'Absolute MRR matters less than growth rate. A company at $50K MRR growing 15% month-over-month is more interesting than one at $500K MRR growing 2%. The rule of thumb for a fundable B2B SaaS company is 15-20% monthly growth in the early stages.' },
      { type: 'h4', text: '2. Net Revenue Retention (NRR)' },
      { type: 'p', text: 'NRR above 120% means your existing customers are spending more over time — the business grows even with zero new customer acquisition. Below 100% means churn is killing growth. World-class SaaS companies maintain NRR of 130-140%.' },
      { type: 'h4', text: '3–5. CAC Payback, Gross Margin, Burn Multiple' },
      { type: 'p', text: 'CAC payback under 12 months signals capital efficiency. Gross margin above 70% is the minimum for SaaS. Burn multiple (net burn ÷ net new ARR) below 1.5x means the company is converting capital into revenue efficiently. These three together paint a complete picture of unit economics.' },
      { type: 'list', items: ['MRR growth rate: target >15%/month early stage', 'NRR >120% = expansion revenue machine', 'CAC payback <12 months = capital efficient GTM', 'Gross margin >70% for software businesses', 'Burn multiple <1.5x for Series A readiness'] },
    ],
    tags: ['Due Diligence', 'SaaS Metrics', 'Growth', 'Startup', 'Financial Analysis'],
  },
  4: {
    body: [
      { type: 'p', text: 'Artificial intelligence is no longer a feature to bolt onto a product — it is increasingly the core value proposition and the primary competitive moat. The companies building AI-native infrastructure for business workflows are positioned to capture disproportionate value over the next decade.' },
      { type: 'h4', text: 'Why B2B AI SaaS Has the Best Risk/Return Profile' },
      { type: 'p', text: 'Consumer AI is a commodity race with razor-thin margins. Enterprise AI infrastructure is different: long contracts, deep integrations, high switching costs, and pricing power that scales with customer success. A company like ShivAI, building AI orchestration layers for enterprise clients across India, the Middle East, and Canada, benefits from all of these structural advantages.' },
      { type: 'p', text: 'The total addressable market for enterprise AI software is projected to reach $300 billion by 2028. Even a modest market capture of 1-2% represents transformative revenue for early-stage companies at current valuations.' },
      { type: 'h4', text: 'The Investment Thesis for 2026' },
      { type: 'list', items: ['AI-native infrastructure compounds faster than feature add-ons', 'B2B contracts provide revenue predictability', 'Multi-geography expansion (India, ME, Canada) diversifies concentration risk', 'Tokenized equity allows pre-IPO participation without VC minimums', 'Deep-tech moats take 3-5 years to replicate — first-mover advantage matters'] },
    ],
    tags: ['AI', 'Technology', 'Growth', 'B2B SaaS', 'Investment Thesis'],
  },
  5: {
    body: [
      { type: 'p', text: 'When Growith evaluated blockchain infrastructure for token issuance, the decision was not about brand recognition or speculation. It was an engineering and compliance evaluation. Polygon won on every dimension that matters for regulated securities.' },
      { type: 'h4', text: 'Technical Rationale' },
      { type: 'p', text: 'Polygon is an EVM-compatible Layer 2 network with proven security through years of production use. Gas fees average below $0.01 per transaction, making micro-transactions and frequent compliance updates economically viable. The network processes 7,000+ transactions per second — orders of magnitude above what any private securities registry requires.' },
      { type: 'p', text: 'EVM compatibility means every Ethereum developer tool, audit framework, and smart contract standard works natively. The same ERC-20 standard that powers USDC and thousands of institutional tokens powers Growith securities — meaning institutional custody providers already understand the format.' },
      { type: 'h4', text: 'Compliance Integration' },
      { type: 'p', text: 'Transfer restriction logic — KYC checks, lock-in period enforcement, investor jurisdiction whitelisting — is encoded directly into the token contract. This means compliance is automated and immutable, not dependent on a manual process or a centralized server. Every token transfer is auditable by any regulator in real time.' },
      { type: 'list', items: ['Sub-$0.01 gas fees make compliance updates economically viable', 'EVM compatibility ensures institutional custody support', '7,000+ TPS — unlimited headroom for any securities registry', 'Transfer restrictions encoded in smart contract — zero manual compliance', 'On-chain audit trail accessible to regulators 24/7'] },
    ],
    tags: ['Polygon', 'Blockchain', 'Smart Contracts', 'Compliance', 'Infrastructure'],
  },
  6: {
    body: [
      { type: 'p', text: 'Know Your Customer (KYC) and Anti-Money Laundering (AML) verification is not bureaucratic box-checking. In the context of private securities placements, it is the foundation of investor protection — and it is why Growith\'s offerings are accessible only to verified participants.' },
      { type: 'h4', text: 'What the Growith KYC Process Involves' },
      { type: 'p', text: 'Growith uses Sumsub for identity verification. The process takes 5-15 minutes and requires: a government-issued photo ID (passport, national ID, or driver\'s license), a live selfie for biometric verification, and proof of address (utility bill or bank statement from the last 3 months). Sumsub\'s AI compares the document against fraud databases in real time.' },
      { type: 'h4', text: 'Why It Protects You as an Investor' },
      { type: 'p', text: 'AML screening runs your name against OFAC sanctions lists, PEP (Politically Exposed Persons) databases, and adverse media sources. This protects the integrity of the investment pool. If a co-investor is sanctioned and their investment is frozen, it could delay distributions for all investors in the same vehicle — KYC prevents this scenario.' },
      { type: 'p', text: 'Every verified investor receives a unique on-chain wallet address that is whitelisted in the token smart contract. Token transfers to non-whitelisted addresses are automatically rejected — this is how Growith enforces the investor-only transfer restrictions required under EU private placement rules.' },
      { type: 'list', items: ['Sumsub AI verification — typically approved in under 24 hours', 'Passport / national ID + live selfie required', 'Proof of address from last 3 months', 'OFAC + PEP + adverse media AML screening', 'Whitelist entry in token smart contract upon approval'] },
    ],
    tags: ['KYC', 'AML', 'Compliance', 'Regulation', 'Investor Protection'],
  },
}

export default function BlogDetails() {
  const { id } = useParams()
  const post = blogPosts.find((p) => String(p.id) === String(id)) || blogPosts[0]
  const content = contentMap[post.id] || contentMap[1]
  const related = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)
  const fallbackRelated = blogPosts.filter((p) => p.id !== post.id).slice(0, 3)
  const relatedPosts = related.length > 0 ? related : fallbackRelated

  return (
    <>
      {/* ── Page Title ──────────────────────────────────── */}
      <section className="page-title" style={{ backgroundImage: 'none', background: 'linear-gradient(180deg, rgba(92,39,254,0.14) 0%, transparent 100%)' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumbs" data-aos="zoom-in" data-aos-duration="800">
                <h3 className="heading">Blog Details</h3>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><span>{post.category}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <div className="blog-detail-layout">
            {/* ── Main content ────────────────────────── */}
            <article className="blog-detail__main" data-aos="fade-up">
              {/* Hero image */}
              <div className="blog-detail__img-wrap">
                <img src={post.image} alt={post.title} className="blog-detail__img"
                  onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.15)'; e.target.src = '' }} />
                <span className="blog-detail__category">{post.category}</span>
              </div>

              {/* Meta */}
              <div className="blog-detail__meta">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/></svg>
                  {post.date}
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><polyline points="12 7 12 12 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  {post.readTime}
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                  {post.author}
                </span>
              </div>

              {/* Title */}
              <h1 className="blog-detail__title">{post.title}</h1>

              {/* Body content */}
              <div className="blog-detail__body">
                {content.body.map((block, i) => {
                  if (block.type === 'h4') return <h4 key={i} className="blog-detail__subheading">{block.text}</h4>
                  if (block.type === 'list') return (
                    <ul key={i} className="blog-detail__list">
                      {block.items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  )
                  return <p key={i}>{block.text}</p>
                })}
              </div>

              {/* Tags */}
              <div className="blog-detail__tags">
                {content.tags.map((tag) => (
                  <span key={tag} className="blog-detail__tag">#{tag}</span>
                ))}
              </div>

              <div className="blog-detail__back">
                <Link to="/blog" className="action-btn"><span>← Back to Blog</span></Link>
              </div>
            </article>

            {/* ── Sidebar ─────────────────────────────── */}
            <aside className="blog-sidebar" data-aos="fade-up" data-aos-delay="100">
              {/* Author card */}
              <div className="blog-sidebar__widget">
                <h5 className="blog-sidebar__title">About the Author</h5>
                <div className="blog-sidebar__author">
                  <div className="blog-sidebar__author-avatar">{post.author.charAt(0)}</div>
                  <div>
                    <strong className="blog-sidebar__author-name">{post.author}</strong>
                    <p className="blog-sidebar__author-role">Growith Editorial Team</p>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="blog-sidebar__widget">
                <h5 className="blog-sidebar__title">Categories</h5>
                <ul className="blog-sidebar__cats">
                  {Array.from(new Set(blogPosts.map((p) => p.category))).map((cat) => (
                    <li key={cat}>
                      <Link to="/blog" className="blog-sidebar__cat-link">
                        <span>{cat}</span>
                        <span className="blog-sidebar__cat-count">{blogPosts.filter((p) => p.category === cat).length}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related posts */}
              <div className="blog-sidebar__widget">
                <h5 className="blog-sidebar__title">Related Posts</h5>
                <div className="blog-sidebar__related">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.id} to={`/blog/${rp.id}`} className="blog-sidebar__related-item">
                      <img src={rp.image} alt={rp.title} className="blog-sidebar__related-img"
                        onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.15)'; e.target.src = '' }} />
                      <div>
                        <p className="blog-sidebar__related-title">{rp.title}</p>
                        <span className="blog-sidebar__related-date">{rp.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
