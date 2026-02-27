import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Link } from 'react-router-dom'
import { tokenOfferings } from '../../../data'

export default function Project() {
  // Get ShivAI token and one random other token
  const shivaiToken = tokenOfferings.find(token => token.slug === 'shivai')
  const otherTokens = tokenOfferings.filter(token => token.slug !== 'shivai')
  const randomToken = otherTokens[Math.floor(Math.random() * otherTokens.length)]
  
  // Featured tokens: ShivAI + 1 random
  const featuredTokens = [shivaiToken, randomToken].filter(Boolean)

  return (
    <section className="project">
      <div className="shape right" />
      <div className="container-main relative z-10">
        <div className="block-text center mb-10">
          <h6 className="sub-heading"><span>Live & Upcoming Offerings</span></h6>
          <h3 className="heading font-heading font-bold text-white">FEATURED TOKENS</h3>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
          className="pb-14"
        >
          {featuredTokens.map((item) => {
            const detailUrl = item.bid === 'LIVE' ? `/token/${item.slug}` : '/nft'
            return (
              <SwiperSlide key={item.id}>
                <div className="project-box featured-token-card">
                  {/* Image */}
                  <div className="image">
                    <Link to={detailUrl}>
                      <img
                        src={item.image}
                        alt={item.title}
                        onError={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, rgba(92,39,254,0.2), rgba(222,199,255,0.1))'
                          e.target.src = ''
                        }}
                      />
                    </Link>
                    {/* Status badge */}
                    <span className={`token-status-badge ${item.bid === 'LIVE' ? 'token-status-badge--live' : ''}`}>
                      {item.bid === 'LIVE' ? '● LIVE' : item.bid}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="content">
                    {/* Logo + issuer */}
                    <div className="token-card-issuer">
                      <img
                        src={item.logo || item.ownerImg}
                        alt={item.owner}
                        className="token-card-issuer__img"
                        onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.2)'; e.target.src = '' }}
                      />
                      <span className="token-card-issuer__name">{item.owner}</span>
                    </div>

                    <Link to={detailUrl} className="font-heading text-white text-base hover:text-[#DEC7FF] transition-colors block mb-1">
                      {item.title}
                    </Link>

                    {item.shortDescription && (
                      <p className="token-card-desc">{item.shortDescription}</p>
                    )}

                    {/* Key metrics row */}
                    <div className="token-card-metrics">
                      <div className="token-card-metric">
                        <span className="token-card-metric__label">Price</span>
                        <span className="token-card-metric__value">{item.issuancePrice || item.price}</span>
                      </div>
                      <div className="token-card-metric">
                        <span className="token-card-metric__label">Min. Invest</span>
                        <span className="token-card-metric__value">{item.minInvestment || 'TBA'}</span>
                      </div>
                      <div className="token-card-metric">
                        <span className="token-card-metric__label">Lock-in</span>
                        <span className="token-card-metric__value">{item.lockPeriod || 'TBA'}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link to={detailUrl} className="token-card-cta">
                      {item.bid === 'LIVE' ? 'View Details' : 'Notify Me'}
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}
