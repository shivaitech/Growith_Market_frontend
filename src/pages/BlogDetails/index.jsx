import { Link, useParams } from 'react-router-dom'
import { blogPosts } from '../../data'

function PageTitle({ title, sub }) {
  return (
    <section
      className="relative pt-40 pb-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(92,39,254,0.15) 0%, transparent 100%)' }}
    >
      <div className="container-main text-center relative z-10">
        <p className="sub-heading mb-2"><span>{sub}</span></p>
        <h1 className="font-heading font-bold text-white leading-tight" style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}>
          {title}
        </h1>
        <nav className="mt-4 flex justify-center gap-2 text-sm font-body">
          <Link to="/" className="text-white/50 hover:text-white transition-colors">Home</Link>
          <span className="text-white/30">/</span>
          <Link to="/blog" className="text-white/50 hover:text-white transition-colors">Blog</Link>
          <span className="text-white/30">/</span>
          <span className="text-secondary">Details</span>
        </nav>
      </div>
    </section>
  )
}

export default function BlogDetails() {
  const { id } = useParams()
  const post = blogPosts.find((p) => String(p.id) === String(id)) || blogPosts[0]

  return (
    <>
      <PageTitle title={post.title} sub="Blog Details" />

      <section className="py-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          {/* Featured Image */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-72 object-cover rounded-2xl mb-8"
            onError={(e) => {
              e.target.style.background = 'rgba(92,39,254,0.15)'
              e.target.src = ''
            }}
          />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span
              className="px-3 py-1 rounded-full text-xs font-heading font-semibold text-white"
              style={{ background: 'rgba(92,39,254,0.4)' }}
            >
              {post.category}
            </span>
            <span className="text-white/40 text-sm font-body">{post.date}</span>
            <span className="text-white/40 text-sm font-body">By {post.author}</span>
          </div>

          {/* Content */}
          <h2 className="font-heading font-bold text-white text-2xl leading-tight mb-6">{post.title}</h2>

          <div className="prose prose-invert max-w-none font-body text-white/60 leading-relaxed space-y-4">
            <p>{post.excerpt}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h4 className="font-heading font-bold text-white text-lg mt-6">Understanding the Market</h4>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <h4 className="font-heading font-bold text-white text-lg mt-6">Key Takeaways</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Digital art is transforming the creative economy</li>
              <li>NFTs provide provenance and ownership verification</li>
              <li>Blockchain technology ensures transparency</li>
              <li>Community drives the value of NFT collections</li>
            </ul>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {['NFT', 'Blockchain', 'Digital Art', 'Web3', 'Crypto'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-body text-white/60 cursor-pointer hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <Link to="/blog" className="action-btn px-8 py-3">← Back to Blog</Link>
          </div>
        </div>
      </section>
    </>
  )
}
