import { Link } from 'react-router-dom'
import { roadmapItems } from '../../data'

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

const extendedRoadmap = [
  ...roadmapItems,
  { id: 6, phase: 'Phase 6', title: 'Cross-Chain Expansion', description: 'Integration with multiple blockchain networks to enable cross-chain NFT trading and interoperability.', date: 'Q4 2026', status: 'upcoming' },
  { id: 7, phase: 'Phase 7', title: 'Mobile Application Launch', description: 'Native iOS and Android applications with full marketplace functionality including push notifications.', date: 'Q1 2027', status: 'upcoming' },
  { id: 8, phase: 'Phase 8', title: 'DAO Governance', description: 'Transition to community-governed platform through decentralized autonomous organization structure.', date: 'Q2 2027', status: 'upcoming' },
]

export default function RoadmapPage() {
  return (
    <>
      <PageTitle title="Roadmap" sub="Our Journey" />

      <section className="py-20">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="relative">
            {/* Center line - desktop */}
            <div
              className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 rounded-full"
              style={{ background: 'linear-gradient(180deg, transparent, #5C27FE 10%, #5C27FE 90%, transparent)' }}
            />

            {/* Left line - mobile */}
            <div
              className="lg:hidden absolute left-4 top-0 bottom-0 w-[2px] rounded-full"
              style={{ background: 'linear-gradient(180deg, transparent, #5C27FE 10%, #5C27FE 90%, transparent)' }}
            />

            <div className="space-y-8">
              {extendedRoadmap.map((item, index) => {
                const isLeft = index % 2 === 0
                const isDone = item.status === 'done'

                return (
                  <div
                    key={item.id}
                    className={`relative flex lg:items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-row gap-6`}
                  >
                    {/* Content box */}
                    <div className={`flex-1 ${isLeft ? 'lg:text-right' : 'lg:text-left'} pl-10 lg:pl-0`}>
                      <div
                        className="inline-block p-5 rounded-2xl text-left transition-all duration-200 hover:-translate-y-1"
                        style={{
                          background: isDone ? 'rgba(92,39,254,0.15)' : 'rgba(255,255,255,0.03)',
                          border: isDone ? '1px solid rgba(92,39,254,0.4)' : '1px solid rgba(255,255,255,0.07)',
                          maxWidth: '360px',
                          width: '100%',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-heading font-semibold text-white"
                            style={{ background: isDone ? 'rgba(92,39,254,0.6)' : 'rgba(255,255,255,0.1)' }}
                          >
                            {item.phase}
                          </span>
                          {isDone && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#5C27FE">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          )}
                        </div>
                        <h4 className="font-heading font-bold text-white text-base mb-2">{item.title}</h4>
                        <p className="text-white/50 font-body text-sm leading-relaxed mb-2">{item.description}</p>
                        <p className="text-secondary font-heading font-semibold text-xs">{item.date}</p>
                      </div>
                    </div>

                    {/* Node dot - desktop center */}
                    <div className="hidden lg:flex items-center justify-center shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white/20 relative z-10"
                        style={{
                          background: isDone ? '#5C27FE' : 'rgba(92,39,254,0.2)',
                          boxShadow: isDone ? '0 0 16px rgba(92,39,254,0.7)' : 'none',
                        }}
                      />
                    </div>

                    {/* Mobile node dot */}
                    <div className="lg:hidden absolute left-0 top-6 shrink-0">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center relative z-10"
                        style={{
                          background: isDone ? '#5C27FE' : 'rgba(92,39,254,0.2)',
                          boxShadow: isDone ? '0 0 12px rgba(92,39,254,0.6)' : 'none',
                        }}
                      >
                        <span className="text-white text-xs font-heading font-bold">{item.id}</span>
                      </div>
                    </div>

                    {/* Placeholder for alignment on desktop */}
                    <div className="hidden lg:block flex-1" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
