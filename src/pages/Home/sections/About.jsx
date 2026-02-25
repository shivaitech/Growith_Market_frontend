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
              <h3 className="heading">Private Capital <br /> Market Access</h3>
              <p className="mb-17">Growith is a private digital security offering platform that connects qualified investors with high-growth companies — starting with ShivAI, an EU-registered AI infrastructure token.</p>
              <p className="mb-26">We operate under a compliance-first model: every offering requires KYC approval, is issued through an EU-registered entity, and is structured with full documentation including whitepaper, risk disclosure, and smart contract transparency on Polygon.</p>
              <Link to="/about" className="action-btn"><span>More About Us</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
