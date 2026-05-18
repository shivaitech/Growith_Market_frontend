import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Link } from 'react-router-dom'
import { tokenOfferings } from '../../../data'

export default function Project() {
  const shivaiToken = tokenOfferings.find(token => token.slug === 'shivai')
  const otherTokens = tokenOfferings.filter(token => token.slug !== 'shivai')
  const randomToken = otherTokens[Math.floor(Math.random() * otherTokens.length)]
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
            const isLive = item.bid === 'LIVE'

            return (
              <SwiperSlide key={item.id}>
                <div
                  className="featured-project-card"
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    marginBottom: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.borderColor = 'rgba(92,39,254,0.3)'
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(92,39,254,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', overflow: 'hidden', height: '180px' }}>
                    <Link to={detailUrl}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        onError={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, rgba(92,39,254,0.2), rgba(222,199,255,0.1))'
                          e.target.src = ''
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </Link>
                    <span style={{
                      position: 'absolute', top: '16px', right: '16px',
                      padding: '6px 16px', borderRadius: '100px',
                      fontSize: '11px', fontWeight: '700',
                      fontFamily: "'Conthrax', sans-serif",
                      background: isLive
                        ? 'linear-gradient(135deg, rgba(92,39,254,0.9), rgba(122,69,254,0.9))'
                        : 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(8px)',
                      border: isLive ? '1px solid rgba(92,39,254,0.6)' : '1px solid rgba(255,255,255,0.2)',
                      color: '#fff', letterSpacing: '0.05em',
                    }}>
                      {isLive ? '● LIVE' : item.bid}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px' }}>
                    {/* Issuer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <img
                        src={item.logo || item.ownerImg}
                        alt={item.owner}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(92,39,254,0.3)' }}
                        onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.2)'; e.target.src = '' }}
                      />
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
                        {item.owner}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={detailUrl}>
                      <h4 className="font-heading" style={{
                        color: '#fff', fontSize: '17px', fontWeight: '600',
                        marginBottom: '10px', lineHeight: '1.3', transition: 'color 0.2s ease',
                      }}
                        onMouseEnter={e => e.currentTarget.style.color = '#DEC7FF'}
                        onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                      >
                        {item.title}
                      </h4>
                    </Link>

                    {/* Description */}
                    {item.shortDescription && (
                      <p style={{
                        fontSize: '13px', lineHeight: '1.6',
                        color: 'rgba(255,255,255,0.5)', marginBottom: '18px',
                        display: '-webkit-box', WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {item.shortDescription}
                      </p>
                    )}

                    {/* Metrics */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '14px 0',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      marginBottom: '18px',
                    }}>
                      <div>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Price</p>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#DEC7FF', fontFamily: "'Conthrax', sans-serif" }}>
                          {item.issuancePrice || item.price}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Min. Invest</p>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#fff', fontFamily: "'Conthrax', sans-serif" }}>
                          {item.minInvestment || 'TBA'}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to={detailUrl}
                      style={{
                        display: 'block', width: '100%', padding: '12px',
                        borderRadius: '12px', textAlign: 'center',
                        fontSize: '13px', fontWeight: '600',
                        fontFamily: "'Conthrax', sans-serif",
                        background: isLive
                          ? 'linear-gradient(135deg, #5C27FE, #7B45FE)'
                          : 'rgba(255,255,255,0.04)',
                        border: isLive
                          ? '1px solid rgba(92,39,254,0.6)'
                          : '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        transition: 'all 0.3s ease', textDecoration: 'none',
                        boxShadow: isLive ? '0 4px 20px rgba(92,39,254,0.4)' : 'none',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.opacity = '0.85'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      {item.ctaLabel || (isLive ? 'View Live Offering' : 'Notify Me')}
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
