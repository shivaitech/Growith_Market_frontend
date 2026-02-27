import { Link } from 'react-router-dom'
import { useState } from 'react'
import { tokenOfferings } from '../../data'

function PageTitle({ title, sub }) {
  return (
    <section
      className="page-title"
      style={{ 
        background: 'linear-gradient(180deg, rgba(92,39,254,0.15) 0%, transparent 100%)',
        paddingTop: '160px',
        paddingBottom: '60px'
      }}
    >
      <div className="container big text-center relative z-10">
        <h6 className="sub-heading mb-3"><span>{sub}</span></h6>
        <h1 className="heading font-heading text-white" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '16px' }}>
          {title}
        </h1>
        <nav className="mt-4 flex justify-center gap-2 text-sm">
          <Link to="/" className="text-white/50 hover:text-white transition-colors">Home</Link>
          <span className="text-white/30">/</span>
          <span style={{ background: 'linear-gradient(264.28deg, #DEC7FF -38.2%, #5C27FE 103.12%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Marketplace</span>
        </nav>
      </div>
    </section>
  )
}

export default function NFT() {
  // Get 1 live token (ShivAI) and 5 upcoming tokens
  const liveToken = tokenOfferings.find(token => token.bid === 'LIVE')
  const upcomingTokens = tokenOfferings.filter(token => token.bid !== 'LIVE').slice(0, 5)
  const displayTokens = [liveToken, ...upcomingTokens].filter(Boolean)

  const [filterStatus, setFilterStatus] = useState('ALL')

  const filteredTokens = filterStatus === 'ALL' 
    ? displayTokens 
    : displayTokens.filter(t => t.bid === filterStatus)

  return (
    <>
      <PageTitle title="Token Marketplace" sub="Private Digital Securities" />

      <section className="marketplace-section" style={{ padding: '60px 0' }}>
        <div className="container big">
          {/* Filter tabs */}
          <div className="marketplace-filters" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px', 
            marginBottom: '48px',
            flexWrap: 'wrap'
          }}>
            {['ALL', 'LIVE', 'UPCOMING'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`filter-btn ${filterStatus === status ? 'filter-btn--active' : ''}`}
                style={{
                  padding: '10px 24px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: '600',
                  fontFamily: "'Conthrax', sans-serif",
                  border: filterStatus === status ? '1px solid rgba(92,39,254,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  background: filterStatus === status 
                    ? 'linear-gradient(135deg, rgba(92,39,254,0.3), rgba(222,199,255,0.15))' 
                    : 'rgba(255,255,255,0.03)',
                  color: filterStatus === status ? '#DEC7FF' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  if (filterStatus !== status) {
                    e.currentTarget.style.borderColor = 'rgba(92,39,254,0.3)'
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseLeave={e => {
                  if (filterStatus !== status) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                  }
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Token Grid */}
          <div className="marketplace-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px',
          }}>
            {filteredTokens.map((token) => {
              const detailUrl = token.bid === 'LIVE' ? `/token/${token.slug}` : '/nft'
              const isLive = token.bid === 'LIVE'

              return (
                <div
                  key={token.id}
                  className="marketplace-token-card"
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
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
                  <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
                    <Link to={detailUrl}>
                      <img
                        src={token.image}
                        alt={token.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, rgba(92,39,254,0.2), rgba(222,199,255,0.1))'
                          e.target.src = ''
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </Link>
                    {/* Status badge */}
                    <span
                      className={`marketplace-status-badge ${isLive ? 'marketplace-status-badge--live' : ''}`}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        padding: '6px 16px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: "'Conthrax', sans-serif",
                        background: isLive 
                          ? 'linear-gradient(135deg, rgba(92,39,254,0.9), rgba(122,69,254,0.9))' 
                          : 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(8px)',
                        border: isLive ? '1px solid rgba(92,39,254,0.6)' : '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {isLive ? '● LIVE' : token.bid}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px' }}>
                    {/* Issuer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <img
                        src={token.logo || token.ownerImg}
                        alt={token.owner}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1.5px solid rgba(92,39,254,0.3)'
                        }}
                        onError={(e) => {
                          e.target.style.background = 'rgba(92,39,254,0.2)'
                          e.target.src = ''
                        }}
                      />
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
                        {token.owner}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={detailUrl}>
                      <h4 className="font-heading" style={{
                        color: '#fff',
                        fontSize: '17px',
                        fontWeight: '600',
                        marginBottom: '10px',
                        lineHeight: '1.3',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#DEC7FF'}
                      onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                      >
                        {token.title}
                      </h4>
                    </Link>

                    {/* Description */}
                    {token.shortDescription && (
                      <p style={{
                        fontSize: '13px',
                        lineHeight: '1.6',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '18px',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {token.shortDescription}
                      </p>
                    )}

                    {/* Metrics */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '14px 0',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      marginBottom: '18px'
                    }}>
                      <div>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Price</p>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#DEC7FF', fontFamily: "'Conthrax', sans-serif" }}>
                          {token.issuancePrice || token.price}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Min. Invest</p>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#fff', fontFamily: "'Conthrax', sans-serif" }}>
                          {token.minInvestment || 'TBA'}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to={detailUrl}
                      className="marketplace-cta"
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        fontFamily: "'Conthrax', sans-serif",
                        background: isLive 
                          ? 'linear-gradient(135deg, rgba(92,39,254,0.3), rgba(122,69,254,0.2))' 
                          : 'rgba(255,255,255,0.04)',
                        border: isLive 
                          ? '1px solid rgba(92,39,254,0.5)' 
                          : '1px solid rgba(255,255,255,0.1)',
                        color: isLive ? '#DEC7FF' : 'rgba(255,255,255,0.6)',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={e => {
                        if (isLive) {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(92,39,254,0.6), rgba(122,69,254,0.4))'
                          e.currentTarget.style.color = '#fff'
                        } else {
                          e.currentTarget.style.borderColor = 'rgba(92,39,254,0.3)'
                          e.currentTarget.style.color = '#DEC7FF'
                        }
                      }}
                      onMouseLeave={e => {
                        if (isLive) {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(92,39,254,0.3), rgba(122,69,254,0.2))'
                          e.currentTarget.style.color = '#DEC7FF'
                        } else {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                          e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                        }
                      }}
                    >
                      {isLive ? 'View Live Offering' : 'Notify Me When Live'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty state */}
          {filteredTokens.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h4 className="font-heading" style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>
                No Tokens Found
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}