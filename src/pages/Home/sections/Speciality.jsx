import { useEffect, useRef, useState } from 'react'

const features = [
  {
    id: 1,
    num: '01',
    title: 'UAE Holding Structure',
    desc: 'Opportunities are offered through a UAE-based corporate structure designed to provide clarity and transparency.',
    img: '/assets/images/partner/TwoPic1-removebg-preview.png',
  },
  {
    id: 2,
    num: '02',
    title: 'Digital Ownership Records',
    desc: 'Your participation and holdings are securely maintained through digital ownership records.',
    img: '/assets/images/partner/twoPic2-removebg-preview.png',
  },
  {
    id: 3,
    num: '03',
    title: 'Digital Ownership Allocation',
    desc: 'Every participation is digitally recorded, making ownership transparent and easy to track.',
    img: '/assets/images/partner/twoPic3-removebg-preview.png',
  },
  {
    id: 4,
    num: '04',
    title: 'Verified Participation',
    desc: 'Participation is available to verified members through a structured onboarding and verification process.',
    img: '/assets/images/partner/twoPic4-removebg-preview.png',
  },
  {
    id: 5,
    num: '05',
    title: 'Blockchain-Backed Transparency',
    desc: 'Ownership records are supported by blockchain technology to provide additional transparency and traceability.',
    img: '/assets/images/partner/TwoPic1-removebg-preview.png',
  },
  {
    id: 6,
    num: '06',
    title: 'Private Opportunities',
    desc: 'Access innovative startups and high-growth projects at an early stage.',
    img: '/assets/images/partner/twoPic2-removebg-preview.png',
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
          <h3 className="heading speciality-heading">
            <span className="speciality-heading__line">Simple Access.</span>
            <span className="speciality-heading__line">Structured Participation.</span>
          </h3>
          <p>Growith combines digital ownership, transparent record-keeping and a structured participation process to make access to innovative businesses and projects simple and secure.</p>
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
