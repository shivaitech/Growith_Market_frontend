import { Link } from 'react-router-dom'
import { stats, teamMembers } from '../../data'

function PageTitle({ title, sub }) {
  return (
    <section
      className="relative pt-40 pb-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(92,39,254,0.15) 0%, transparent 100%)' }}
    >
      <div className="container-main text-center relative z-10">
        <p className="sub-heading mb-2"><span>{sub}</span></p>
        <h1
          className="font-heading font-bold text-white leading-tight"
          style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}
        >
          {title}
        </h1>
        <nav className="mt-4 flex justify-center gap-2 text-sm font-body">
          <Link to="/" className="text-white/50 hover:text-white transition-colors">Home</Link>
          <span className="text-white/30">/</span>
          <span className="text-secondary">{title}</span>
        </nav>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <PageTitle title="About Us" sub="About" />

      {/* Story Section */}
      <section className="py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image collage */}
            <div className="relative h-[450px]">
              <img
                src="/assets/images/layouts/about-01.png"
                alt="About"
                className="absolute top-0 left-0 w-3/5 h-3/4 object-cover rounded-2xl"
                onError={(e) => {
                  e.target.style.background = 'rgba(92,39,254,0.15)'
                  e.target.src = ''
                }}
              />
              <img
                src="/assets/images/layouts/about-02.png"
                alt="About"
                className="absolute bottom-0 right-0 w-2/5 h-3/5 object-cover rounded-2xl border-2 border-bg"
                onError={(e) => {
                  e.target.style.background = 'rgba(222,199,255,0.15)'
                  e.target.src = ''
                }}
              />
            </div>

            {/* Content */}
            <div>
              <p className="sub-heading mb-4"><span>Our Story</span></p>
              <h2
                className="font-heading font-bold text-white mb-6 leading-tight"
                style={{ fontSize: 'clamp(24px, 3.5vw, 44px)' }}
              >
                We Believe in the Power
                <br />
                of Digital Art
              </h2>
              <p className="text-white/60 font-body leading-relaxed mb-4">
                Growith is a next-generation NFT marketplace where creators, collectors, and investors come together to discover, buy, and sell unique digital assets.
              </p>
              <p className="text-white/60 font-body leading-relaxed mb-8">
                Our platform is built on transparency, security, and community. Whether you're a seasoned crypto collector or just curious about NFTs, Growith is the place to start your digital journey.
              </p>
              <Link to="/nft" className="action-btn px-8 py-3">
                Explore NFTs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="text-center p-6 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="font-heading font-bold text-white text-3xl mb-1">{stat.value}</p>
                <p className="text-white/50 font-body text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20">
        <div className="container-main">
          <div className="text-center mb-12">
            <p className="sub-heading"><span>The Team</span></p>
            <h2
              className="font-heading font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(24px, 3.5vw, 44px)' }}
            >
              Meet Our Team
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamMembers.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="text-center p-5 rounded-2xl transition-all duration-200 hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                  onError={(e) => {
                    e.target.style.background = 'rgba(92,39,254,0.2)'
                    e.target.src = ''
                  }}
                />
                <p className="font-heading font-bold text-white text-sm mb-1">{m.name}</p>
                <p className="text-white/50 text-xs font-body">{m.position}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/team" className="action-btn px-8 py-3">View Full Team</Link>
          </div>
        </div>
      </section>
    </>
  )
}
