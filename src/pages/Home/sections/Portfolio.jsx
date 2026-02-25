const steps = [
  {
    id: 1,
    step: 'Step 1',
    title: 'Discover the Marketplace',
    desc: 'Browse available private offerings openly. No login required. Explore token details, issuer structure, and documentation before committing.',
  },
  {
    id: 2,
    step: 'Step 2',
    title: 'Review Token Details',
    desc: 'Read the full offering page — token economics, legal documents, whitepaper, founder overview, and the smart contract summary on Polygon.',
  },
  {
    id: 3,
    step: 'Step 3',
    title: 'Complete KYC & Profile',
    desc: 'Submit your legal identity, nationality, and contact details. Pass KYC verification. A custodial wallet is automatically created upon approval.',
  },
  {
    id: 4,
    step: 'Step 4',
    title: 'Invest & Receive Tokens',
    desc: 'Submit your investment intent. Upon payment confirmation and compliance clearance, tokens are minted directly to your custodial wallet.',
  },
]

export default function Portfolio() {
  return (
    <section className="portfolio">
      <div className="shape" />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="block-text center">
              <h6 className="sub-heading"><span>Investor Flow</span></h6>
              <h3 className="heading">How to Participate <br /> in a Private Offering</h3>
            </div>
          </div>
          <div className="col-xl-6 col-md-6">
            <div className="portfolio__left">
              {steps.map((item) => (
                <div className="portfolio-box" key={item.id}>
                  <div className="step">{item.step}</div>
                  <div className="icon">
                    <img src={`/assets/images/svg/portfolio-${item.id}.svg`} alt={item.title} />
                  </div>
                  <div className="content">
                    <h5 className="title">{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-xl-6 col-md-6">
            <div className="portfolio__right">
              <div className="image">
                <img src="/assets/images/svg/portfolio.svg" alt="Investment Flow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
