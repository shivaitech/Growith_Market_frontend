const testimonials = [
  {
    id: 1,
    text: '"What stood out to me was the combination of AI-focused opportunities and a structured investment process. The onboarding was straightforward, the communication was clear, and the platform felt built for serious long-term investors rather than short-term speculation."',
    name: 'Rohit Mehra',
    role: 'Angel Investor, Dubai',
    avatar: '/assets/images/svg/avatar-02.svg',
  },
  {
    id: 2,
    text: '"Most private investment opportunities are usually limited to insider networks. Growith made the process far more accessible while still maintaining compliance, transparency, and investor verification. That gave me confidence to explore the ShivAI offering."',
    name: 'Neha Kapoor',
    role: 'Realestate Investor, Mumbai',
    avatar: '/assets/images/svg/avatar-03.svg',
  },
  {
    id: 3,
    text: '"I liked that the platform focuses on real businesses and growth sectors instead of hype-driven token launches. The ShivAI opportunity especially caught my attention because AI adoption across businesses is growing extremely fast."',
    name: 'Arjun Singh',
    role: 'Private Investor, Singapore',
    avatar: '/assets/images/svg/avatar-04.svg',
  },
  {
    id: 4,
    text: '"The overall experience felt more like a modern private investment platform than a crypto marketplace. The structured approach, investor verification, and early access model made it feel credible and professionally managed."',
    name: 'Daniel Hart',
    role: 'Portfolio Consultant, Sydney',
    avatar: '/assets/images/svg/avatar-02.svg',
  },
  {
    id: 5,
    text: '"As someone following the AI sector closely, getting early access to opportunities before wider market exposure is extremely valuable. Growith creates that bridge in a way that feels simple and investor-friendly."',
    name: 'Priya Nair',
    role: 'Business Investor, Bengaluru',
    avatar: '/assets/images/svg/avatar-03.svg',
  },
  {
    id: 6,
    text: '"The platform gives investors exposure to sectors like AI, deep tech, and infrastructure through a more structured framework. I also appreciated that the process did not require technical blockchain knowledge to participate."',
    name: 'Ahmed Al Mansoori',
    role: 'Private Investor, Abu Dhabi',
    avatar: '/assets/images/svg/avatar-04.svg',
  },
]

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
              <div className="testimonial-card" key={item.id}>
                <div className="testimonial-card__quote">
                  <img src="/assets/images/svg/quote.svg" alt="quote" />
                </div>
                <p className="testimonial-card__text">{item.text}</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    <img src={item.avatar} alt={item.name} />
                  </div>
                  <div className="testimonial-card__info">
                    <h5 className="testimonial-card__name">{item.name}</h5>
                    <p className="testimonial-card__role">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
