import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Link } from 'react-router-dom'

const projects = [
  { id: 1, title: 'ShivAI — AI Infrastructure Token', image: '/assets/images/svg/project-ai.svg', status: 'LIVE' },
  { id: 2, title: 'GreenVolt — Clean Energy Series A', image: '/assets/images/svg/project-energy.svg', status: 'COMING SOON' },
  { id: 3, title: 'NovaMed — HealthTech Token', image: '/assets/images/svg/project-health.svg', status: 'COMING SOON' },
  { id: 4, title: 'QuantumPay — Fintech Series B', image: '/assets/images/svg/project-fintech.svg', status: 'COMING SOON' },
  { id: 5, title: 'UrbanAI — PropTech Token', image: '/assets/images/svg/project-proptech.svg', status: 'COMING SOON' },
]

export default function Project() {
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
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-14"
        >
          {projects.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="project-box">
                <div className="image">
                  <Link to="/nft">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(92,39,254,0.2), rgba(222,199,255,0.1))'
                        e.target.src = ''
                      }}
                    />
                  </Link>
                </div>
                <div className="content">
                  <Link to="/nft" className="font-heading text-white text-base hover:text-[#DEC7FF] transition-colors block mb-1">
                    {item.title}
                  </Link>
                  <span
                    className="text-xs font-heading px-2 py-0.5 rounded-full"
                    style={{ background: item.status === 'LIVE' ? 'rgba(92,39,254,0.7)' : 'rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
