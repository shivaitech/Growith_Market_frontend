const steps = [
  {
    id: 1,
    step: 'Step 1',
    title: 'Explore Verified Offerings',
    desc: 'Browse curated digital securities across startups, real estate, media, and structured projects. Every listing is pre-screened before publication.',
    img: 'onePic1-removebg-preview.png',
  },
  {
    id: 2,
    step: 'Step 2',
    title: 'Review Issuer & Valuation',
    desc: 'Access the full offering pack: issuer structure, independent valuation basis, risk disclosures, and smart contract summary. Each asset undergoes legal, structural, and financial due diligence before listing.',
    img: 'onePic2-removebg-preview.png',
  },
  {
    id: 3,
    step: 'Step 3',
    title: 'Complete Investor Verification',
    desc: 'Submit identity details and pass KYC/AML screening. A secure custodial wallet is created upon approval.',
    img: 'onePic3-removebg-preview.png',
  },
  {
    id: 4,
    step: 'Step 4',
    title: 'Invest & Receive Token Allocation',
    desc: 'Confirm investment at the defined issuance price. Upon payment clearance, tokens are minted directly to your custodial wallet with a full audit trail.',
    img: 'onepic4-removebg-preview.png',
  },
]

export default function Portfolio() {
  return (
    <section className="portfolio">
      <div className="shape" />
      <div className="container">
        <div className="block-text center">
          <h6 className="sub-heading"><span>Investor Process</span></h6>
          <h3 className="heading">How Participation <br /> Works</h3>
        </div>

        <div className="timeline">
          <div className="timeline__line" />
          {steps.map((item, idx) => (
            <div className={`timeline__item ${idx % 2 !== 0 ? 'timeline__item--right' : ''}`} key={item.id}>
              <div className="timeline__dot">
                <img src={`/assets/images/partner/${item.img}`} alt={item.title} />
              </div>
              <div className="timeline__card">
                <div className="timeline__card-badge">{item.step}</div>
                <h5 className="timeline__card-title">{item.title}</h5>
                <p className="timeline__card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
