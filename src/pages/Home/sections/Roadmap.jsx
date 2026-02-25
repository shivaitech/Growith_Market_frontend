import { Link } from 'react-router-dom'

const roadmapItems = [
  {
    id: 1,
    date: 'Q1 2026',
    title: 'Phase 1 — Public Discovery Layer',
    text: 'Launch of the public marketplace. Splash page, token listing, and ShivAI offering page go live. Open access — no login required to browse.',
    right: false,
  },
  {
    id: 2,
    date: 'Q2 2026',
    title: 'Phase 2 — KYC & Investor Onboarding',
    text: 'Full KYC/AML integration via Sumsub. Profile creation, sanctions screening, jurisdiction checks, and custodial wallet auto-provisioning upon approval.',
    right: true,
  },
  {
    id: 3,
    date: 'Q2 2026',
    title: 'Phase 3 — Investment & Payment Layer',
    text: 'Investors can submit investment intent. Fiat (bank transfer) and USDT (TRC20) payment channels open. Allocation confirmation and token minting pipeline live.',
    right: false,
  },
  {
    id: 4,
    date: 'Q3 2026',
    title: 'Phase 4 — Token Minting on Polygon',
    text: 'Smart contract deployment on Polygon mainnet. Tokens minted upon payment confirmation. Lock-in timestamps applied. Smart contract audit published.',
    right: true,
  },
  {
    id: 5,
    date: 'Q4 2026',
    title: 'Phase 5 — Portfolio Dashboard & Multi-Token Expansion',
    text: 'Investor portfolio dashboard launched. Allocation history, token balance breakdown, and lock expiry visibility. Platform expanded for additional unicorn token launches.',
    right: false,
  },
]

export default function Roadmap() {
  return (
    <section className="roadmap">
      <div className="shape" />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="block-text center">
              <h6 className="sub-heading"><span>Platform Road Map</span></h6>
              <h3 className="heading">Building the Future <br /> of Private Investment</h3>
            </div>
          </div>
          <div className="col-12">
            <div className="roadmap__main">
              {roadmapItems.map((item) => (
                <div className={`roadmap-box${item.right ? ' right' : ''}`} key={item.id}>
                  <div className="time">{item.date}</div>
                  <div className="content">
                    <h5 className="title">{item.title}</h5>
                    <p className="text">{item.text}</p>
                  </div>
                </div>
              ))}
              <div className="button">
                <Link to="/roadmap" className="action-btn"><span>View Full Road Map</span></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
