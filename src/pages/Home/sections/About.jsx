import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section className="about">
      <div className="shape" />
      <div className="container">
        <div className="row rev">
          <div className="col-xl-6 col-md-12">
            <div className="about__right">
              <div className="images" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="/assets/images/svg/about.svg" alt="Growith Network" style={{ width: '100%', maxWidth: '480px' }} />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-md-12">
            <div className="block-text">
              <h6 className="sub-heading"><span>About Growith</span></h6>
              <h3 className="heading">Private Capital Market Access</h3>
              <p className="mb-17">Growith is a regulated digital securities marketplace providing access to asset-backed opportunities across startups, real estate, structured projects, and media ventures — all issued through a compliant EU-registered entity.</p>
              <p className="mb-17">Our first live offering is <strong>ShivAI</strong>, a UAE-headquartered deep-tech AI SaaS company expanding across India, the Middle East, and Canada.</p>
              <p className="mb-17">Every offering on Growith is:</p>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '20px', color: 'rgba(255,255,255,0.8)' }}>
                <li>Issued through an EU-registered entity</li>
                <li>KYC/AML verified</li>
                <li>Fully documented with risk disclosures</li>
                <li>Transparently minted on Polygon</li>
                <li>Allocated via secure custodial wallets</li>
              </ul>
              <p className="mb-26">Growith is not a crypto trading platform. It is structured digital securities infrastructure for private capital markets.</p>
              <Link to="/about" className="action-btn"><span>More About Us</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
