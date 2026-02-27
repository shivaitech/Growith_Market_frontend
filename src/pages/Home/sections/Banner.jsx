import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const WORDS = [
  "Private Digital Securities",
  "Regulated Investments",
  "Wealth Growth Opportunities",
  "Exclusive Access",
  "Future Unicorns",
];

export default function Banner() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 450);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="banner">
      <div className="shape right" />
      <div className="container big">
        <div className="row">
          <div className="col-xl-6 col-md-12">
            <div className="banner__left">
              <div className="block-text">
                <h6 className="sub-heading">
                  EU-Regulated Private Investment Platform
                </h6>
                <h2 className="heading banner-heading">
                  Access{" "}
                  <span
                    className="banner-animated-word"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(12px)",
                      transition: "opacity 0.45s ease, transform 0.45s ease",
                      display: "inline-block",
                      background:
                        "linear-gradient(264.28deg, #DEC7FF -38.2%, #5C27FE 103.12%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {WORDS[wordIndex]}
                  </span>{" "}
                  with Confidence
                </h2>
                <p className="desc">
                  Invest in structured, EU-issued digital assets backed by legal
                  documentation, compliance screening, and on-chain
                  transparency.
                </p>
                <div className="banner-cta-group">
                  <Link to="/token/shivai" className="action-btn">
                    <span>Explore Live Offering</span>
                  </Link>
                  <Link to="/about" className="action-btn banner-cta-secondary">
                    <span>Review Documentation</span>
                  </Link>
                </div>
              </div>
              <div className="pay pay-desktop" style={{ display: 'none' }}>
                <h6>Partner Benefits</h6>
                <div className="list">
                  <p>Includes:</p>
                  <ul className="banner-pay-list">
                  <li>Min. Investment: $500</li>
                  <li>Custodial Wallet Included</li>
                  <li>KYC Verified Access</li>
                </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-md-12 banner-right-col">
            <div className="banner__right">
              <div className="image">
                <img
                  src="/assets/images/partner/HeroShivaAI.jpeg"
                  alt="Investment Dashboard"
                />
              </div>
              <div className="price">
                <div className="icon">
                  <img src="/assets/images/svg/icon-token.svg" alt="Token" />
                </div>
                <div className="content">
                  <p>Min. Investment</p>
                  <h5>$500</h5>
                  <span className="badge-subline">Start with confidence</span>
                </div>
              </div>
              <div className="owner">
                <div className="image">
                  <img src="/assets/images/icon/shivAiToken.png" alt="ShivAI" />
                </div>
                <div className="content">
                  <h5>ShivAI Token</h5>
                  <p>Status: LIVE</p>
                  <span className="badge-subline">EU-Regulated Asset</span>
                </div>
              </div>

              <Link to="/token/shivai" className="banner-link-badge badge-learn-more">
                <span className="banner-link-badge__text">
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
          
          {/* Marketplace Link Section */}
          <div className="col-12" style={{ opacity: 1 }}>
            <div className="banner-marketplace-link" style={{ opacity: 1 }}>
              <Link 
                to="/nft" 
                className="marketplace-enter-btn"
                style={{
                  opacity: 1,
                  background: 'linear-gradient(135deg, #6B35FF 0%, #9D6FFF 100%)',
                  borderColor: '#DEC7FF',
                  color: '#FFFFFF'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', opacity: 1 }}>
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span style={{ opacity: 1, color: '#FFFFFF' }}>Enter Marketplace</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '8px', opacity: 1 }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Partner Benefits — shown below image on mobile/tablet */}
          <div className="col-12 pay-mobile-wrap">
            <div className="pay pay-mobile">
              <h6>Partner Benefits</h6>
              <div className="list">
                <p>Includes:</p>
                <ul className="banner-pay-list">
                  <li>Min. Investment: $500</li>
                  <li>Custodial Wallet Included</li>
                  <li>KYC Verified Access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
