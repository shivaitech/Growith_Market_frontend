import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { useState } from 'react'
import 'swiper/css'
import { Link } from 'react-router-dom'
import { tokenOfferings } from '../../../data'

function CardImageSlider({ item, detailUrl, isLive }) {
  const [, setSw] = useState(null)
  const [, setActiveIdx] = useState(0)
  const hasSlider = item.images && item.images.length > 1

  const imgStyle = { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', background: '#0a0d2a' }

  return (
    <div>
      <div style={{ position: 'relative', overflow: 'hidden', height: '220px', width: '100%', borderRadius: '12px 12px 0 0', background: '#0a0d2a' }}>
        {hasSlider ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            grabCursor
            onSwiper={setSw}
            onSlideChange={(s) => setActiveIdx(s.realIndex)}
            style={{ width: '100%', height: '220px' }}
          >
            {item.images.map((src, i) => (
              <SwiperSlide key={i} style={{ height: '220px', width: '100%' }}>
                <Link to={detailUrl} style={{ display: 'block', height: '100%', width: '100%' }}>
                  <img src={src} alt={`${item.title} ${i + 1}`} style={imgStyle}
                    onError={(e) => { e.target.style.background = 'linear-gradient(135deg, rgba(92,39,254,0.2), rgba(222,199,255,0.1))'; e.target.src = '' }}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Link to={detailUrl} style={{ display: 'block', height: '100%' }}>
            <img src={item.image} alt={item.title} style={imgStyle}
              onError={(e) => { e.target.style.background = 'linear-gradient(135deg, rgba(92,39,254,0.2), rgba(222,199,255,0.1))'; e.target.src = '' }}
            />
          </Link>
        )}
      </div>

    </div>
  )
}

function FeaturedCard({ item }) {
  const detailUrl = item.bid === 'LIVE' ? `/token/${item.slug}` : '/nft'
  const isLive = item.bid === 'LIVE'

  return (
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
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(157,111,255,0.55)'
        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(157,111,255,0.4), 0 16px 56px rgba(92,39,254,0.28)'
        e.currentTarget.style.background = 'linear-gradient(160deg, rgba(157,111,255,0.08) 0%, rgba(92,39,254,0.03) 100%)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.background = 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)'
      }}
    >
      <CardImageSlider item={item} detailUrl={detailUrl} isLive={isLive} />

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <img
            src={item.logo || item.ownerImg}
            alt={item.owner}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(92,39,254,0.3)' }}
            onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.2)'; e.target.src = '' }}
          />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: '500', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.owner}
          </span>
          <span style={{
            padding: '4px 10px', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700',
            fontFamily: "'Conthrax', sans-serif",
            background: isLive ? 'linear-gradient(135deg, #5C27FE, #7B45FE)' : 'rgba(255,255,255,0.06)',
            border: isLive ? '1px solid rgba(157,111,255,0.5)' : '1px solid rgba(255,255,255,0.15)',
            color: '#fff', letterSpacing: '0.05em',
            boxShadow: isLive ? '0 2px 12px rgba(92,39,254,0.3)' : 'none',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {isLive ? '● LIVE' : item.bid}
          </span>
        </div>

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

        {item.shortDescription && (
          <p style={{
            fontSize: '13px', lineHeight: '1.6',
            color: 'rgba(255,255,255,0.5)', marginBottom: '18px',
            display: '-webkit-box', WebkitLineClamp: '4',
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.shortDescription}
          </p>
        )}

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '14px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '18px',
        }}>
          <div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Current DOS Price</p>
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
  )
}

export default function Project() {
  // Show all tokens in slider (ShivAI first, then others)
  const shivaiToken = tokenOfferings.find(token => token.slug === 'shivai')
  const otherTokens = tokenOfferings.filter(token => token.slug !== 'shivai')
  const featuredTokens = [shivaiToken, ...otherTokens].filter(Boolean)

  const [swiperInstance, setSwiperInstance] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <section className="project">
      <div className="shape right" />
      <div className="container-main relative z-10">
        <div className="block-text center mb-10">
          <h6 className="sub-heading"><span>Live & Upcoming Offerings</span></h6>
          <h3 className="heading font-heading font-bold text-white">Featured Opportunities</h3>
        </div>

        <div className="featured-tokens-slider-wrap">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={featuredTokens.length > 1}
            centeredSlides
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            speed={700}
            grabCursor
            breakpoints={{
              640:  { slidesPerView: 1.2, centeredSlides: true },
              768:  { slidesPerView: 2, centeredSlides: false },
              1024: { slidesPerView: 2, centeredSlides: false },
              1200: { slidesPerView: 3, centeredSlides: true },
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={(s) => setActiveIdx(s.realIndex)}
            className="featured-tokens-swiper"
          >
            {featuredTokens.map(item => (
              <SwiperSlide key={item.id} style={{ height: 'auto' }}>
                <FeaturedCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="featured-tokens-nav">
            <button
              type="button"
              className="featured-tokens-nav__arrow"
              aria-label="Previous"
              onClick={() => swiperInstance?.slidePrev()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <div className="featured-tokens-nav__dots">
              {featuredTokens.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`featured-tokens-nav__dot${i === activeIdx ? ' featured-tokens-nav__dot--active' : ''}`}
                  aria-label={`Go to token ${i + 1}`}
                  onClick={() => swiperInstance?.slideToLoop(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="featured-tokens-nav__arrow"
              aria-label="Next"
              onClick={() => swiperInstance?.slideNext()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="featured-tokens-cta" style={{ textAlign: 'center', paddingLeft: '40px', paddingRight: '40px', marginTop: '24px' }}>
          <Link
            to="/nft"
            className="action-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 36px', borderRadius: '100px',
              fontSize: '14px', fontWeight: '600',
              fontFamily: "'Conthrax', sans-serif",
              background: 'linear-gradient(135deg, #5C27FE, #7B45FE)',
              border: '1px solid rgba(92,39,254,0.5)',
              color: '#fff', textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(92,39,254,0.35)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(92,39,254,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(92,39,254,0.35)'
            }}
          >
            Explore More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
