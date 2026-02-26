const testimonials = [
  {
    id: 1,
    text: '" Growith gave us institutional-grade access to private placements that were previously only available to family offices and VC firms. The KYC process was seamless and the custodial wallet was created automatically — no technical knowledge required. "',
    name: 'Marcus Hoffmann',
    role: 'Private Investor, Frankfurt',
    avatar: '/assets/images/svg/avatar-02.svg',
  },
  {
    id: 2,
    text: '" The transparency of the ShivAI offering page is unlike anything I have seen in private equity. The whitepaper, smart contract summary, and risk disclosures are all in one place. I made an informed decision with confidence. "',
    name: 'Sophia Beaumont',
    role: 'Angel Investor, Paris',
    avatar: '/assets/images/svg/avatar-03.svg',
  },
  {
    id: 3,
    text: '" As an EU-based investor, compliance has always been my first filter. Growith\'s EU-registered issuer structure, mandatory KYC, and non-tradable token model gave me the regulatory comfort I needed to participate. "',
    name: 'Andrei Popescu',
    role: 'Portfolio Manager, Bucharest',
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
