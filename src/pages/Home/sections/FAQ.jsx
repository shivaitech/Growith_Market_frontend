import { useState } from 'react'

const faqCategories = ['About the Platform', 'Token & Investment', 'KYC & Compliance', 'Wallet & Custody']

const faqItems = [
  { id: 1, q: 'What is Growith?', a: 'Growith is a private digital security offering platform operated under an EU-registered issuer structure. It is not a crypto exchange or NFT marketplace. We connect qualified investors with private placement opportunities in high-growth companies.' },
  { id: 2, q: 'Is Growith a crypto trading platform?', a: 'No. Growith is a private placement platform. Tokens issued here represent economic exposure to the underlying company. They are not publicly tradable and no price discovery mechanism exists during Phase 1.' },
  { id: 3, q: 'Who can invest on Growith?', a: 'Participation is open for discovery without login. To invest, users must complete full KYC verification, pass sanctions screening, and satisfy jurisdiction eligibility checks before any allocation is made.' },
  { id: 4, q: 'What is ShivAI?', a: 'ShivAI is the first token offering available on Growith. It represents a private placement investment in an AI infrastructure company. The token is issued at a fixed primary offering price defined by the EU-registered issuer.' },
  { id: 5, q: 'Can I trade the tokens after receiving them?', a: 'No. Tokens issued on Growith during Phase 1 are non-tradable. Each token has a defined lock-in period. There is no secondary market, no exchange listing, and no price discovery mechanism in this phase.' },
  { id: 6, q: 'How is my token allocation calculated?', a: 'Tokens Allocated = Investment Amount ÷ Issuance Price. For example, if the issuance price is $0.01 and you invest $1,000, you receive 100,000 tokens. The issuance price is fixed during the offering window.' },
  { id: 7, q: 'Why is KYC mandatory?', a: 'KYC (Know Your Customer) verification is a legal requirement for all private placement participants. It includes identity verification, sanctions screening, and jurisdiction checks. No investment intent can be registered without a fully approved KYC status.' },
  { id: 8, q: 'How does the custodial wallet work?', a: 'Upon KYC approval, the platform automatically generates a custodial wallet on your behalf. Your private key is encrypted and stored in a secure vault/HSM. Tokens are minted directly to this wallet — you do not manage the wallet yourself.' },
]

export default function FAQ() {
  const [activeTab, setActiveTab] = useState(0)
  const [openId, setOpenId] = useState(null)

  const leftItems = faqItems.slice(0, 4)
  const rightItems = faqItems.slice(4, 8)

  return (
    <section className="faq">
      <div className="shape right" />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="block-text center">
              <h6 className="sub-heading"><span>FAQs</span></h6>
              <h3 className="heading">Frequently <br /> Asked Questions</h3>
              <p>Everything you need to know about private offerings, compliance, token structure, and participation.</p>
            </div>
            <div className="faq__main flat-tabs">
              <ul className="menu-tab">
                {faqCategories.map((cat, i) => (
                  <li key={i} className={activeTab === i ? 'active' : ''} onClick={() => setActiveTab(i)}>
                    <button>{cat}</button>
                  </li>
                ))}
              </ul>
              <div className="content-tab">
                <div className="content-inner active">
                  <div className="flat-accordion row">
                    <div className="col-md-6">
                      {leftItems.map((item) => (
                        <div key={item.id} className={`flat-toggle${openId === item.id ? ' active' : ''}`} onClick={() => setOpenId(openId === item.id ? null : item.id)}>
                          <h6 className="toggle-title">{item.q}<span className="icon-plus" /></h6>
                          <div className="toggle-content" style={{ display: openId === item.id ? 'block' : 'none' }}>
                            <p>{item.a}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-md-6">
                      {rightItems.map((item) => (
                        <div key={item.id} className={`flat-toggle${openId === item.id ? ' active' : ''}`} onClick={() => setOpenId(openId === item.id ? null : item.id)}>
                          <h6 className="toggle-title">{item.q}<span className="icon-plus" /></h6>
                          <div className="toggle-content" style={{ display: openId === item.id ? 'block' : 'none' }}>
                            <p>{item.a}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
