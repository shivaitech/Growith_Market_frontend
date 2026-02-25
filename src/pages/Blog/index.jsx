import { Link } from 'react-router-dom'
import { blogPosts } from '../../data'

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

export default function Blog() {
  return (
    <>
      <PageTitle title="Blog" sub="Latest News" />

      <section className="py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="blog-card group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Image */}
                <Link to={`/blog/${post.id}`} className="block overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.background = 'rgba(92,39,254,0.15)'
                      e.target.style.minHeight = '176px'
                      e.target.src = ''
                    }}
                  />
                </Link>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-0.5 rounded-full text-xs font-heading font-semibold text-white"
                      style={{ background: 'rgba(92,39,254,0.4)' }}
                    >
                      {post.category}
                    </span>
                    <span className="text-white/40 text-xs font-body">{post.date}</span>
                  </div>

                  <Link to={`/blog/${post.id}`}>
                    <h4 className="font-heading font-bold text-white text-base mb-2 leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </Link>

                  <p className="text-white/50 text-sm font-body leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-white/40 text-xs font-body">By {post.author}</span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-secondary text-xs font-heading font-semibold hover:text-white transition-colors flex items-center gap-1"
                    >
                      Read More
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
