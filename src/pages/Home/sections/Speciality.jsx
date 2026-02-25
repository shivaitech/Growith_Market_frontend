export default function Speciality() {
  return (
    <section className="speciality">
      <div className="shape right" />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="block-text center">
              <h6 className="sub-heading"><span>Platform Architecture</span></h6>
              <h3 className="heading">Built for Regulated <br /> Private Markets</h3>
              <p>Growith operates as structured digital securities infrastructure — not a trading platform.</p>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="speciality-box">
              <div className="icon">
                <img src="/assets/images/partner/TwoPic1-removebg-preview.png" alt="EU-Issued Structure" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              </div>
              <h5 className="title">EU-Issued Structure</h5>
              <p>Every offering is issued through a compliant EU-registered entity with full legal documentation and regulatory alignment.</p>
              <h3 className="number">01</h3>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="speciality-box">
              <div className="icon">
                <img src="/assets/images/partner/twoPic2-removebg-preview.png" alt="Secure Custodial Wallets" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              </div>
              <h5 className="title">Secure Custodial Wallets</h5>
              <p>Investors receive a verified custodial wallet upon KYC approval. No self-custody complexity.</p>
              <h3 className="number">02</h3>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="speciality-box">
              <div className="icon">
                <img src="/assets/images/partner/twoPic3-removebg-preview.png" alt="Tokenized Allocation" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              </div>
              <h5 className="title">Tokenized Allocation</h5>
              <p>Investments convert into tokens at a defined issuance price — delivering precise, auditable ownership.</p>
              <h3 className="number">03</h3>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="speciality-box">
              <div className="icon">
                <img src="/assets/images/partner/twoPic4-removebg-preview.png" alt="Compliance & Audit Controls" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              </div>
              <h5 className="title">Compliance & Audit Controls</h5>
              <p>Institutional-grade KYC, sanctions screening, jurisdiction checks, and full transaction audit trail.</p>
              <h3 className="number">04</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
