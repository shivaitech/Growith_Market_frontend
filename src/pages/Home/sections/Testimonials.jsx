const testimonials = [
  {
    id: 1,
    text: 'What stood out to me was the combination of AI-focused opportunities and a structured investment process. The onboarding was straightforward, the communication was clear, and the platform felt built for serious long-term investors rather than short-term speculation.',
    name: 'Rohit Mehra',
    role: 'Angel Investor, Dubai',
    rating: 5,
    avatar: '/assets/images/svg/avatar-02.svg',
  },
  {
    id: 2,
    text: 'Most private investment opportunities are usually limited to insider networks. Growith made the process far more accessible while still maintaining compliance, transparency, and investor verification. That gave me confidence to explore the ShivAI offering.',
    name: 'Neha Kapoor',
    role: 'Real Estate Investor, Mumbai',
    rating: 5,
    avatar: '/assets/images/svg/avatar-03.svg',
  },
  {
    id: 3,
    text: 'I liked that the platform focuses on real businesses and growth sectors instead of hype-driven token launches. The ShivAI opportunity especially caught my attention because AI adoption across businesses is growing extremely fast.',
    name: 'Arjun Singh',
    role: 'Private Investor, Singapore',
    rating: 5,
    avatar: '/assets/images/svg/avatar-04.svg',
  },
  {
    id: 4,
    text: 'The overall experience felt more like a modern private investment platform than a crypto marketplace. The structured approach, investor verification, and early access model made it feel credible and professionally managed.',
    name: 'Daniel Hart',
    role: 'Portfolio Consultant, Sydney',
    rating: 5,
    avatar: '/assets/images/svg/avatar-02.svg',
  },
  {
    id: 5,
    text: 'As someone following the AI sector closely, getting early access to opportunities before wider market exposure is extremely valuable. Growith creates that bridge in a way that feels simple and investor-friendly.',
    name: 'Priya Nair',
    role: 'Business Investor, Bengaluru',
    rating: 5,
    avatar: '/assets/images/svg/avatar-03.svg',
  },
  {
    id: 6,
    text: 'The platform gives investors exposure to sectors like AI, deep tech, and infrastructure through a more structured framework. I also appreciated that the process did not require technical blockchain knowledge to participate.',
    name: 'Ahmed Al Mansoori',
    role: 'Private Investor, Abu Dhabi',
    rating: 5,
    avatar: '/assets/images/svg/avatar-04.svg',
  },
]

function StarRating({ count = 5 }) {
  return (
    <div className="testimonial-card__rating" aria-label={`${count} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < count ? '#DEC7FF' : 'rgba(255,255,255,0.15)'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials__main">
          <div className="block-text center">
            <h6 className="sub-heading"><span>Testimonials</span></h6>
            <h3 className="heading">What Investors Say</h3>
          </div>
          <div className="testimonial-cards">
            {testimonials.map((item) => (
              <article className="testimonial-card" key={item.id}>
                <header className="testimonial-card__header">
                  <span className="testimonial-card__quote-mark" aria-hidden="true">&ldquo;</span>
                  <StarRating count={item.rating} />
                </header>
                <p className="testimonial-card__text">{item.text}</p>
                <footer className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    <img src={item.avatar} alt={item.name} />
                  </div>
                  <div className="testimonial-card__info">
                    <h5 className="testimonial-card__name">{item.name}</h5>
                    <p className="testimonial-card__role">{item.role}</p>
                  </div>
                  <span className="testimonial-card__verified" title="Verified Investor">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L3 7v5c0 5 3.5 9.5 9 11 5.5-1.5 9-6 9-11V7l-9-5z" fill="rgba(157,111,255,0.15)" stroke="#9D6FFF" strokeWidth="1.5"/>
                      <path d="M9 12l2 2 4-4" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Verified
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
