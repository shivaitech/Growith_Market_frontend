import { Link } from 'react-router-dom'
import { tokenOfferings } from '../../data'

function PageTitle({ title, sub }) {
  return (
    <section
      className="relative pt-40 pb-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(92,39,254,0.15) 0%, transparent 100%)' }}
    >
      <div className="container-main text-center relative z-10">
        <p className="sub-heading mb-2"><span>{sub}</span></p>
        <h1 className="font-heading font-bold text-white leading-tight" style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>
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

export default function NFT() {
  return (
    <>
      <PageTitle title="Token Marketplace" sub="Private Offerings" />

      <section className="py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokenOfferings.map((nft) => {
              const detailUrl = nft.bid === 'LIVE' ? `/token/${nft.slug}` : '#'
              return (
              <div
                key={nft.id}
                className="nft-card group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Link to={detailUrl}>
                    <img
                      src={nft.image}
                      alt={nft.title}
                      className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.background = 'rgba(92,39,254,0.15)'
                        e.target.style.minHeight = '208px'
                        e.target.src = ''
                      }}
                    />
                  </Link>
                  {/* Status badge */}
                  <div
                    className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-heading font-semibold text-white"
                    style={{
                      background: nft.bid === 'LIVE' ? 'rgba(92,39,254,0.85)' : 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(4px)',
                      border: nft.bid === 'LIVE' ? '1px solid rgba(92,39,254,0.6)' : '1px solid rgba(255,255,255,0.15)'
                    }}
                  >
                    {nft.bid === 'LIVE' ? '🟢 LIVE' : nft.bid}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={nft.logo || nft.ownerImg}
                      alt={nft.owner}
                      className="w-7 h-7 rounded-full object-cover border border-primary/40"
                      onError={(e) => {
                        e.target.style.background = 'rgba(92,39,254,0.2)'
                        e.target.src = ''
                      }}
                    />
                    <span className="text-white/50 text-xs font-body">{nft.owner}</span>
                  </div>
                  <h4 className="font-heading font-bold text-white text-base mb-3 group-hover:text-secondary transition-colors">
                    <Link to={detailUrl} className="text-white hover:text-[#DEC7FF] transition-colors">
                      {nft.title}
                    </Link>
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/40 text-xs font-body mb-0.5">Token Price</p>
                      <p className="text-primary font-heading font-bold text-sm">{nft.price}</p>
                    </div>
                    <Link
                      to={detailUrl}
                      className="px-4 py-2 rounded-full text-xs font-heading font-semibold text-white transition-all duration-200"
                      style={{ background: 'rgba(92,39,254,0.3)', border: '1px solid rgba(92,39,254,0.5)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(92,39,254,0.7)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(92,39,254,0.3)'}
                    >
                      {nft.bid === 'LIVE' ? 'View Offering' : 'Notify Me'}
                    </Link>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
