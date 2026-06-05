import { useEffect, useRef, useState } from 'react'

const features = [
  {
    id: 1,
    num: '01',
    title: 'UAE Holding Structure',
    desc: 'Every offering is issued through a compliant RAKEZ-established holding entity with full legal documentation and regulatory alignment.',
    img: '/assets/images/partner/TwoPic1-removebg-preview.png',
  },
  {
    id: 2,
    num: '02',
    title: 'Secure Custodial Wallets',
    desc: 'Investors receive a verified custodial wallet upon KYC approval. No self-custody complexity.',
    img: '/assets/images/partner/twoPic2-removebg-preview.png',
  },
  {
    id: 3,
    num: '03',
    title: 'Tokenized Allocation',
    desc: 'Investments convert into tokens at a defined issuance price — delivering precise, auditable ownership.',
    img: '/assets/images/partner/twoPic3-removebg-preview.png',
  },
  {
    id: 4,
    num: '04',
    title: 'Compliance & Audit Controls',
    desc: 'Institutional-grade KYC, sanctions screening, jurisdiction checks, and full transaction audit trail.',
    img: '/assets/images/partner/twoPic4-removebg-preview.png',
  },
]

function SpecCard({ item, idx }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(el)
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`spec-card spec-card--animated ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: visible ? `${idx * 90}ms` : '0ms' }}
    >
      <div className="spec-card__accent" />
      <div className="spec-card__icon">
        <img src={item.img} alt={item.title} />
      </div>
      <div className="spec-card__body">
        <h5 className="spec-card__title">{item.title}</h5>
        <p className="spec-card__desc">{item.desc}</p>
      </div>
      <span className="spec-card__num">{item.num}</span>
    </div>
  )
}

export default function Speciality() {
  return (
    <section className="speciality">
      <div className="shape right" />
      <div className="container">
        <div className="block-text center">
          <h6 className="sub-heading"><span>Platform Architecture</span></h6>
          <h3 className="heading">Built for Regulated <br /> Private Markets</h3>
          <p>Growith operates as structured digital securities infrastructure — not a trading platform.</p>
        </div>

        <div className="spec-grid">
          {features.map((item, idx) => (
            <SpecCard key={item.id} item={item} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
