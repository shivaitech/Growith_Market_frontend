import { useState } from 'react'

const faqCategories = ['About the Platform', 'DOS & Investment', 'KYC & Compliance', 'Wallet & Custody']

const faqItems = [
  { id: 1, cat: 0, q: 'What is Growith?', a: 'Growith is a private digital security offering platform operated through a RAKEZ-established holding structure. It is not a crypto exchange or NFT marketplace. We connect qualified investors with private placement opportunities in high-growth companies.' },
  { id: 2, cat: 0, q: 'Is Growith a crypto trading platform?', a: 'No. Growith is a private placement platform. DOS issued here represent economic exposure to the underlying company. They are not publicly tradable and no price discovery mechanism exists during Phase 1.' },
  { id: 3, cat: 0, q: 'Who can invest on Growith?', a: 'Participation is open for discovery without login. To invest, users must complete full KYC verification, pass sanctions screening, and satisfy jurisdiction eligibility checks before any allocation is made.' },
  { id: 4, cat: 1, q: 'What is ShivAI?', a: 'ShivAI is the first DOS offering available on Growith. It represents a private placement investment in an AI infrastructure company. The DOS is issued at a fixed primary offering price defined by the RAKEZ-registered issuer.' },
  { id: 5, cat: 1, q: 'Can I trade the DOS after receiving them?', a: 'DOS in the current phase are issued as early-stage access before broader market infrastructure matures. Growith is actively building the technical and compliance framework for future peer-to-peer transfers between verified investors and regulated exchange integration, targeting framework readiness by Q3 2027.' },
  { id: 6, cat: 1, q: 'How is my DOS allocation calculated?', a: 'DOS Allocated = Investment Amount ÷ Issuance Price. For example, if the issuance price is $0.01 and you invest $1,000, you receive 100,000 DOS. The issuance price is fixed during the offering window.' },
  { id: 7, cat: 2, q: 'Why is KYC mandatory?', a: 'KYC (Know Your Customer) verification is a legal requirement for all private placement participants. It includes identity verification, sanctions screening, and jurisdiction checks. No investment intent can be registered without a fully approved KYC status.' },
  { id: 8, cat: 2, q: 'What documents do I need for KYC?', a: 'You will need government-issued photo ID (Aadhaar/PAN for Indian investors, passport for international), proof of address, and a selfie for liveness verification. The process typically completes within 1-3 business days.' },
  { id: 9, cat: 3, q: 'How does the custodial wallet work?', a: 'Upon KYC approval, the platform automatically generates a custodial wallet on your behalf. Your private key is encrypted and stored in a secure vault/HSM. DOS are minted directly to this wallet — you do not manage the wallet yourself.' },
  { id: 10, cat: 3, q: 'Can I withdraw my DOS to an external wallet?', a: 'External transfers are not enabled during the current early-stage phase. The custodial framework ensures regulatory compliance and protects investors. Future updates will introduce verified peer-to-peer transfer between approved investors.' },
]

export default function FAQ() {
  const [activeTab, setActiveTab] = useState(0)
  const [openId, setOpenId] = useState(null)

  const filtered = faqItems.filter(item => item.cat === activeTab)
  const mid = Math.ceil(filtered.length / 2)
  const leftItems = filtered.slice(0, mid)
  const rightItems = filtered.slice(mid)

  return (
    <section className="faq">
      <div className="shape right" />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="block-text center">
              <h6 className="sub-heading"><span>FAQs</span></h6>
              <h3 className="heading">Frequently <br /> Asked Questions</h3>
              <p>Everything you need to know about Growith, Digital Ownership and how participation works.</p>
            </div>
            <div className="faq__main flat-tabs">
              <ul className="menu-tab">
                {faqCategories.map((cat, i) => (
                  <li key={i} className={activeTab === i ? 'active' : ''}>
                    <button type="button" onClick={() => { setActiveTab(i); setOpenId(null); }}>{cat}</button>
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
