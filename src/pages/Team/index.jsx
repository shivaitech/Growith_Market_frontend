import { Link } from 'react-router-dom'
import { teamMembers } from '../../data'

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

const SocialBtn = ({ type }) => {
  const paths = {
    facebook: 'M2.57969 9.03953C2.51969 9.03953 1.19969 9.03953 0.599688 9.03953C0.279688 9.03953 0.179688 8.91953 0.179688 8.61953C0.179688 7.81953 0.179688 6.99953 0.179688 6.19953C0.179688 5.87953 0.299688 5.77953 0.599688 5.77953H2.57969C2.57969 5.71953 2.57969 4.55953 2.57969 4.01953C2.57969 3.21953 2.71969 2.45953 3.11969 1.75953C3.53969 1.03953 4.13969 0.559531 4.89969 0.279531C5.39969 0.0995311 5.89969 0.0195312 6.43969 0.0195312H8.39969C8.67969 0.0195312 8.79969 0.139531 8.79969 0.419531V2.69953C8.79969 2.97953 8.67969 3.09953 8.39969 3.09953C7.85969 3.09953 7.31969 3.09953 6.77969 3.11953C6.23969 3.11953 5.95969 3.37953 5.95969 3.93953C5.93969 4.53953 5.95969 5.11953 5.95969 5.73953H8.27969C8.59969 5.73953 8.71969 5.85953 8.71969 6.17953V8.59953C8.71969 8.91953 8.61969 9.01953 8.27969 9.01953C7.55969 9.01953 6.01969 9.01953 5.95969 9.01953V15.5395C5.95969 15.8795 5.85969 15.9995 5.49969 15.9995C4.65969 15.9995 3.83969 15.9995 2.99969 15.9995C2.69969 15.9995 2.57969 15.8795 2.57969 15.5795C2.57969 13.4795 2.57969 9.09953 2.57969 9.03953Z',
    twitter: 'M14.5 1.42062C13.9794 1.66154 13.4246 1.82123 12.8462 1.89877C13.4412 1.524 13.8954 0.935077 14.1089 0.225231C13.5541 0.574154 12.9416 0.820615 12.2889 0.958154C11.7621 0.366462 11.0114 0 10.1924 0C8.60337 0 7.32412 1.36062 7.32412 3.02862C7.32412 3.26862 7.34338 3.49938 7.39062 3.71908C5.0045 3.59631 2.89313 2.38985 1.47475 0.552C1.22712 1.00523 1.08188 1.524 1.08188 2.08246C1.08188 3.13108 1.59375 4.06062 2.35675 4.59877C1.89562 4.58954 1.44325 4.44831 1.06 4.22585V4.25908C1.06 5.73046 2.05487 6.95262 3.3595 7.23415C3.12587 7.30154 2.87125 7.33385 2.607 7.33385C2.42325 7.33385 2.23775 7.32277 2.06362 7.28215C2.4355 8.48123 3.49075 9.36277 4.7455 9.39138C3.769 10.1972 2.52912 10.6828 1.18688 10.6828C0.9515 10.6828 0.72575 10.6717 0.5 10.6412C1.77137 11.5062 3.27813 12 4.903 12C10.1845 12 13.072 7.38462 13.072 3.384C13.072 3.25015 13.0676 3.12092 13.0615 2.99262C13.6311 2.56615 14.1097 2.03354 14.5 1.42062Z',
    telegram: 'M6.77846 9.12109L6.51378 12.844C6.89246 12.844 7.05647 12.6813 7.25315 12.4859L9.02858 10.7892L12.7074 13.4833C13.3821 13.8593 13.8575 13.6613 14.0395 12.8626L16.4543 1.54734L16.455 1.54668C16.669 0.54929 16.0943 0.159269 15.4369 0.403949L1.24283 5.83824C0.274106 6.21426 0.288774 6.75429 1.07815 6.99897L4.70701 8.1277L13.1361 2.85341C13.5328 2.59073 13.8935 2.73607 13.5968 2.99876L6.77846 9.12109Z',
  }
  const vbs = { facebook: '0 0 9 16', twitter: '0 0 15 12', telegram: '0 0 17 14' }

  return (
    <svg viewBox={vbs[type]} fill="white" className="w-3 h-3">
      <path d={paths[type]} />
    </svg>
  )
}

export default function TeamPage() {
  return (
    <>
      <PageTitle title="Our Team" sub="Team Members" />

      <section className="py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...teamMembers, ...teamMembers].slice(0, 8).map((member, i) => (
              <div
                key={`${member.id}-${i}`}
                className="group text-center p-5 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="overflow-hidden rounded-xl mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.background = 'rgba(92,39,254,0.2)'
                      e.target.style.minHeight = '192px'
                      e.target.src = ''
                    }}
                  />
                </div>

                <h4 className="font-heading font-bold text-white text-base mb-1 group-hover:text-secondary transition-colors">
                  {member.name}
                </h4>
                <p className="text-white/40 text-xs font-body mb-4">{member.position}</p>

                <div className="flex justify-center gap-2">
                  {['facebook', 'twitter', 'telegram'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(92,39,254,0.45)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                      aria-label={social}
                    >
                      <SocialBtn type={social} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
