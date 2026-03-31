import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const WORDS = ["Securities", "Returns", "Real Assets", "Private Deals", "Unicorns"];

export default function BannerV2() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bv2">
      {/* Large ghost watermark text */}
      <div className="bv2__ghost" aria-hidden="true">GROWITH</div>

      {/* Ambient light orbs */}
      <div className="bv2__orb bv2__orb--1" aria-hidden="true" />
      <div className="bv2__orb bv2__orb--2" aria-hidden="true" />
      <div className="bv2__orb bv2__orb--3" aria-hidden="true" />

      {/* ── Top heading block (centered) ── */}
      <div className="bv2__header">
        <Link to="/token/shivai" className="bv2__live-pill">
          <span className="bv2__live-dot" />
          <span>ShivAI Token is now LIVE</span>
          <span className="bv2__pill-sep">&nbsp;&middot;&nbsp;</span>
          <span>EU-Regulated Framework</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

      </div>

      {/* ── 3-col stage ── */}
      <div className="container">
        <div className="bv2__stage">

          {/* LEFT glass card */}
          <div className="bv2__card bv2__card--l">
            <h1 className="bv2__heading">
              Access&nbsp;
              <span
                className="bv2__w"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                }}
              >
                {WORDS[wordIndex]}
              </span>
              <br />
              with&nbsp;
              <span className="bv2__accent">Confidence</span>
            </h1>
            <p className="bv2__tagline">EU-Regulated Private Investment Platform</p>
            <div className="bv2__card-top">
              <span className="bv2__card-chip bv2__card-chip--green">
                <span className="bv2__live-dot bv2__live-dot--sm" />
                Live
              </span>
              <span className="bv2__card-label">7-Day Returns</span>
            </div>
            <div className="bv2__card-big">+18.4%</div>
            <div className="bv2__mini-chart" aria-hidden="true">
              <svg viewBox="0 0 120 44" preserveAspectRatio="none" fill="none">
                <defs>
                  <linearGradient id="bv2cg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5C27FE" stopOpacity="0.50" />
                    <stop offset="100%" stopColor="#5C27FE" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 38 L15 30 L30 34 L45 24 L60 18 L75 22 L90 11 L105 5 L120 3"
                  stroke="#9D6FFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 38 L15 30 L30 34 L45 24 L60 18 L75 22 L90 11 L105 5 L120 3 L120 44 L0 44Z"
                  fill="url(#bv2cg1)"
                />
              </svg>
            </div>
            <div className="bv2__card-rows">
              <div className="bv2__card-row">
                <span className="bv2__cr-k">Asset</span>
                <span className="bv2__cr-v">ShivAI</span>
              </div>
              <div className="bv2__card-row">
                <span className="bv2__cr-k">Chain</span>
                <span className="bv2__cr-v">Polygon</span>
              </div>
              <div className="bv2__card-row">
                <span className="bv2__cr-k">Min.</span>
                <span className="bv2__cr-v">EUR 500</span>
              </div>
              <div className="bv2__card-row">
                <span className="bv2__cr-k">Status</span>
                <span className="bv2__cr-v bv2__cr-v--live">LIVE</span>
              </div>
            </div>
          </div>

          {/* CENTER focal */}
          <div className="bv2__focal">
            {/* Floating: user count top-left */}
            <div className="bv2__float-badge bv2__float-badge--tl">
              <div className="bv2__avatars">
                <span className="bv2__av" style={{ background: "linear-gradient(135deg,#5C27FE,#9D6FFF)" }}>A</span>
                <span className="bv2__av" style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}>B</span>
                <span className="bv2__av" style={{ background: "linear-gradient(135deg,#ec4899,#f97316)" }}>C</span>
              </div>
              <div className="bv2__float-text">
                <span className="bv2__float-num">300+</span>
                <span className="bv2__float-sub">Active Investors</span>
              </div>
            </div>

            {/* Floating: EU badge top-right */}
            <div className="bv2__float-badge bv2__float-badge--tr">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span>EU Protected</span>
            </div>

            {/* Image with glow ring */}
            <div className="bv2__img-wrap">
              <div className="bv2__img-glow" aria-hidden="true" />
              <div className="bv2__img-ring">
                <img
                  src="/assets/images/partner/HeroShivaAI.jpeg"
                  alt="ShivAI Token"
                  className="bv2__img"
                />
              </div>
            </div>

            {/* Floating: notification bottom-left */}
            <div className="bv2__notif">
              <div className="bv2__notif-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#5C27FE" />
                  <text x="8" y="16" fill="#fff" fontSize="9" fontWeight="800">S</text>
                </svg>
              </div>
              <div className="bv2__notif-body">
                <div className="bv2__notif-title">ShivAI Token</div>
                <div className="bv2__notif-sub">ETA: Settlement In Your Favour</div>
              </div>
              <div className="bv2__notif-pct">+6.2%</div>
            </div>

            {/* Floating: pill tag bottom-right */}
            <div className="bv2__float-tag">
              Affordable Protection For Families
            </div>
          </div>

          {/* RIGHT glass card */}
          <div className="bv2__card bv2__card--r">
            <div className="bv2__card-top">
              <span className="bv2__card-chip">
                EU
              </span>
              <span className="bv2__card-label">Quick Stats</span>
            </div>
            <div className="bv2__card-big bv2__card-big--sm">EUR 500</div>
            <p className="bv2__card-caption">Minimum Investment</p>
            <div className="bv2__divider" />
            <div className="bv2__card-rows">
              {[
                ["Token", "ShivAI"],
                ["Standard", "ERC-20"],
                ["Chain", "Polygon"],
                ["Regulated", "Yes"],
                ["Status", "LIVE"],
              ].map(([k, v]) => (
                <div key={k} className="bv2__card-row">
                  <span className="bv2__cr-k">{k}</span>
                  <span className={`bv2__cr-v${v === "LIVE" ? " bv2__cr-v--live" : ""}`}>{v}</span>
                </div>
              ))}
            </div>
            <Link to="/token/shivai" className="bv2__invest-btn">
              Start Investing
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

        </div>{/* end stage */}
      </div>

      {/* ── Trust strip ── */}
      <div className="bv2__trust">
        {[
          { label: "EU-Regulated", color: "#22c55e" },
          { label: "KYC / AML Verified", color: "#9D6FFF" },
          { label: "Polygon Blockchain", color: "#DEC7FF" },
          { label: "Min. EUR 500", color: "#5C27FE" },
        ].map((t) => (
          <span key={t.label} className="bv2__trust-item">
            <span className="bv2__trust-dot" style={{ background: t.color }} />
            {t.label}
          </span>
        ))}
      </div>

      {/* ── Marketplace bottom CTA ── */}
      <div className="bv2__mkt">
        <Link to="/nft" className="bv2__mkt-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Enter Marketplace
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

    </section>
  );
}
