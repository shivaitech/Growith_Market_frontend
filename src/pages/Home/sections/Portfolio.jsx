import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    id: 1,
    step: 'Step 1',
    title: 'Discover Opportunities',
    desc: 'Explore innovative startups and high-growth projects across AI, real estate, media and other future-focused sectors. Each opportunity includes key information to help you understand the business and its vision.',
    img: 'onePic1-removebg-preview.png',
  },
  {
    id: 2,
    step: 'Step 2',
    title: 'Learn About the Opportunity',
    desc: 'Review the business, its vision, important documents and key information before deciding whether you would like to participate.',
    img: 'onePic2-removebg-preview.png',
  },
  {
    id: 3,
    step: 'Step 3',
    title: 'Verify Your Account',
    desc: 'Complete a simple identity verification process so that you can access participation opportunities available on the platform.',
    img: 'onePic3-removebg-preview.png',
  },
  {
    id: 4,
    step: 'Step 4',
    title: 'Participate & Receive Digital Ownership',
    desc: 'Once your participation is completed, your Digital Ownership Stake (DOS) is recorded securely in your Growith wallet and can be viewed and managed anytime.',
    img: 'onepic4-removebg-preview.png',
  },
  {
    id: 5,
    step: 'Step 5',
    title: 'Track Your Ownership',
    desc: 'View your holdings, participation history and future opportunities through your Growith dashboard.',
    img: 'onePic3-removebg-preview.png',
  },
]

function TimelineItem({ item, idx }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Initial fade-in observer (one-shot)
    const entryObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          entryObs.unobserve(el)
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    )
    entryObs.observe(el)

    // Focus observer — fires when card is near vertical center of viewport
    const focusObs = new IntersectionObserver(
      ([entry]) => {
        setFocused(entry.isIntersecting)
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )
    focusObs.observe(el)

    return () => {
      entryObs.disconnect()
      focusObs.disconnect()
    }
  }, [])

  const isRight = idx % 2 !== 0
  return (
    <div
      ref={ref}
      className={`timeline__item ${isRight ? 'timeline__item--right' : ''} timeline__item--animated ${visible ? 'is-visible' : ''} ${focused ? 'is-focused' : ''}`}
      style={{ transitionDelay: visible ? `${idx * 80}ms` : '0ms' }}
    >
      <div className="timeline__dot">
        <img src={`/assets/images/partner/${item.img}`} alt={item.title} />
      </div>
      <div className="timeline__card">
        <div className="timeline__card-badge">{item.step}</div>
        <h5 className="timeline__card-title">{item.title}</h5>
        <p className="timeline__card-desc">{item.desc}</p>
      </div>
    </div>
  )
}

export default function Portfolio() {
  return (
    <section className="portfolio">
      <div className="shape" />
      <div className="container">
        <div className="block-text center">
          <h6 className="sub-heading"><span>Your Journey on Growith</span></h6>
          <h3 className="heading">Start Your Ownership Journey</h3>
          <p>Discover opportunities, complete a simple verification process and participate digitally in just a few steps.</p>
        </div>

        <div className="timeline">
          <div className="timeline__line" />
          {steps.map((item, idx) => (
            <TimelineItem key={item.id} item={item} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
