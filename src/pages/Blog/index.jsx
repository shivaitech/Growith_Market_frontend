import { useState } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../../data'

const CATEGORIES = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))]

export default function Blog() {
  const [active, setActive] = useState('All')
  const featured = blogPosts[0]
  const filtered = (active === 'All' ? blogPosts.slice(1) : blogPosts.filter((p) => p.category === active && p.id !== featured.id))

  return (
    <>
      {/* ── Blog Section ───────────────────────────────────── */}
      <section className="blog-section blog-section--top">
        <div className="shape" />
        <div className="container">
          <div className="block-text center" data-aos="fade-up">
            <h6 className="sub-heading"><span>Latest Insights</span></h6>
            <h3 className="heading">Market Intelligence & Insights</h3>
          </div>

          {/* Featured hero card */}
          <Link to={`/blog/${featured.id}`} className="blog-hero" data-aos="fade-up" data-aos-delay="100">
            <div className="blog-hero__img-wrap">
              <img src={featured.image} alt={featured.title} className="blog-hero__img"
                onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.2)'; e.target.src = '' }} />
              <span className="blog-hero__category">{featured.category}</span>
            </div>
            <div className="blog-hero__body">
              <div className="blog-hero__meta">
                <span className="blog-hero__date">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/></svg>
                  {featured.date}
                </span>
                <span className="blog-hero__readtime">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><polyline points="12 7 12 12 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  {featured.readTime}
                </span>
              </div>
              <h2 className="blog-hero__title">{featured.title}</h2>
              <p className="blog-hero__excerpt">{featured.excerpt}</p>
              <div className="blog-hero__footer">
                <span className="blog-hero__author">By {featured.author}</span>
                <span className="blog-hero__cta">Read Article
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>
          </Link>

          {/* ── Category filter ─────────────────────────── */}
          <div className="blog-filter" data-aos="fade-up" data-aos-delay="150">
            {CATEGORIES.map((cat) => (
              <button key={cat} className={`blog-filter__btn${active === cat ? ' blog-filter__btn--active' : ''}`}
                onClick={() => setActive(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* ── Post grid ─────────────────────────────── */}
          <div className="blog-grid">
            {filtered.length === 0 ? (
              <p className="blog-empty">No posts in this category yet.</p>
            ) : filtered.map((post, i) => (
              <article key={post.id} className="blog-card" data-aos="fade-up" data-aos-delay={i * 80}>
                <Link to={`/blog/${post.id}`} className="blog-card__img-wrap">
                  <img src={post.image} alt={post.title} className="blog-card__img"
                    onError={(e) => { e.target.style.background = 'rgba(92,39,254,0.15)'; e.target.src = '' }} />
                  <span className="blog-card__category">{post.category}</span>
                </Link>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <h4 className="blog-card__title">{post.title}</h4>
                  </Link>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <div className="blog-card__footer">
                    <span className="blog-card__author">By {post.author}</span>
                    <Link to={`/blog/${post.id}`} className="blog-card__link">
                      Read More
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
