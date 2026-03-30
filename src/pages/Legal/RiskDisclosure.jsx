export default function RiskDisclosure() {
  return (
    <div className="legal-pg legal-pg--first">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9 col-12">

            <div className="legal-pg__header">
              <h6 className="sub-heading"><span>Legal</span></h6>
              <h3 className="heading">Risk Disclosure</h3>
              <p className="legal-pg__meta">Last updated: 1 January 2026</p>
            </div>

            <div className="legal-pg__body">

              <div className="legal-pg__warn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 20h20L12 2z" stroke="#FFB547" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M12 9v5" stroke="#FFB547" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="17.5" r="0.5" fill="#FFB547" stroke="#FFB547"/>
                </svg>
                <p>Investing in digital securities involves significant risk. You may lose some or all of your invested capital. Do not invest money you cannot afford to lose. This document does not constitute financial advice.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">1. Capital Risk</h5>
                <p>All investments made through the Growith platform carry the risk of partial or total loss of capital. Past performance of any issuer, sector, or asset class is not indicative of future results. The value of your investment may fall as well as rise.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">2. Illiquidity Risk</h5>
                <p>Tokens issued on Growith represent private placement securities. There is no secondary market for resale unless explicitly indicated in a specific offering. You should be prepared to hold your investment for the full duration of the stated lock-in period, which may range from 12 to 60 months.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">3. Issuer Risk</h5>
                <p>The companies offering securities through Growith are early-stage and growth-stage businesses. They may fail to achieve their business objectives, face financial difficulties, or become insolvent. Growith conducts due diligence but does not guarantee the accuracy of issuer representations.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">4. Technology &amp; Blockchain Risk</h5>
                <p>Tokens are issued on the Polygon blockchain. Blockchain technology is subject to smart contract vulnerabilities, network congestion, protocol upgrades, and regulatory uncertainty. While Growith uses institutional custodial infrastructure, no technology is entirely risk-free.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">5. Regulatory Risk</h5>
                <p>The regulatory environment for digital securities is evolving. Changes in EU or national legislation may affect the value, tradability, or legality of your investment. Growith operates under existing EU frameworks but cannot guarantee future regulatory treatment.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">6. Currency &amp; FX Risk</h5>
                <p>All investments are denominated in EUR. If your home currency is different, fluctuations in exchange rates may increase or decrease your effective returns.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">7. Dilution Risk</h5>
                <p>Future funding rounds by an issuer may dilute the proportional ownership represented by your token. Growith will disclose pre-emption rights and dilution provisions in each offering prospectus.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">8. No Financial Advice</h5>
                <p>Nothing on the Growith platform constitutes financial, tax, or legal advice. You should consult independent qualified advisors before making any investment decision. Growith is not authorised to provide personal investment recommendations.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">9. Investor Suitability</h5>
                <p>Investments through Growith are suitable only for investors who understand the risks involved, have a long investment horizon, and can bear the potential loss of the entire invested amount. If you are uncertain, please do not invest.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
