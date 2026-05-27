import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import { tokenOfferings } from "../../../data";

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
  const [activeIdx, setActiveIdx] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

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

  const activeToken = tokenOfferings[activeIdx] || tokenOfferings[0];
  const isLive = activeToken?.bid === "LIVE";
  const detailUrl = isLive ? `/token/${activeToken.slug}` : "/nft";

  return (
    <section className="banner">
      <div className="shape right" />
      <div className="container big">
        <div className="row">
          <div className="col-xl-6 col-md-12">
            <div className="banner__left">
              <div className="block-text">
                <h6 className="sub-heading">
                  UAE-Structured Private Investment Platform
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
                  Invest in structured, UAE-Structured digital assets backed by legal
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
              <div className="banner-token-stack">
              <div className="image banner-token-image">
                <Swiper
                  modules={[EffectCards, Autoplay]}
                  effect="cards"
                  loop
                  speed={1200}
                  autoplay={{ delay: 6000, disableOnInteraction: false }}
                  cardsEffect={{
                    slideShadows: false,
                    perSlideOffset: 10,
                    perSlideRotate: 4,
                  }}
                  onSwiper={setSwiperInstance}
                  onSlideChange={(s) => setActiveIdx(s.realIndex)}
                  className="banner-token-swiper"
                >
                  {tokenOfferings.map((t) => (
                    <SwiperSlide key={t.id} className="banner-token-slide">
                      <Link
                        to={t.bid === "LIVE" ? `/token/${t.slug}` : "/nft"}
                        className="banner-token-slide__link"
                      >
                        <img src={t.image} alt={t.name || t.title} />
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="banner-token-nav">
                <button
                  type="button"
                  className="banner-token-nav__arrow"
                  aria-label="Previous token"
                  onClick={() => swiperInstance?.slidePrev()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <div className="banner-token-nav__dots">
                  {tokenOfferings.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`banner-token-nav__dot${i === activeIdx ? " banner-token-nav__dot--active" : ""}`}
                      aria-label={`Go to token ${i + 1}`}
                      onClick={() => swiperInstance?.slideToLoop(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="banner-token-nav__arrow"
                  aria-label="Next token"
                  onClick={() => swiperInstance?.slideNext()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
              </div>

              <div className="price">
                <div className="icon">
                  <img src="/assets/images/svg/icon-token.svg" alt="Token" />
                </div>
                <div className="content">
                  <p>Min. Investment</p>
                  <h5>{activeToken?.minInvestment || "TBA"}</h5>
                  <span className="badge-subline">
                    {isLive ? "Start with confidence" : "Coming soon"}
                  </span>
                </div>
              </div>
              <div className="owner">
                <div className="image">
                  <img
                    src={activeToken?.logo || activeToken?.ownerImg || "/assets/images/icon/shivAiToken.png"}
                    alt={activeToken?.name || "Token"}
                  />
                </div>
                <div className="content">
                  <h5>{activeToken?.name || activeToken?.title?.split(" ")[0]} Token</h5>
                  <p>Status: {activeToken?.bid || "—"}</p>
                </div>
              </div>

              <Link to={detailUrl} className="banner-link-badge badge-learn-more">
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
