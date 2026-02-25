import { useState } from 'react'
import { Link } from 'react-router-dom'

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

const infoBoxes = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
      </svg>
    ),
    label: 'Address',
    value: '123 NFT Street, Crypto City, Web3 World',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white"/>
      </svg>
    ),
    label: 'Phone',
    value: '+1 (555) 123-4567',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="white"/>
      </svg>
    ),
    label: 'Email',
    value: 'hello@growith.io',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <PageTitle title="Contact Us" sub="Contact" />

      {/* Info Boxes */}
      <section className="py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {infoBoxes.map((box, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-8 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(92,39,254,0.25)' }}
                >
                  {box.icon}
                </div>
                <p className="font-heading font-semibold text-white text-sm mb-2">{box.label}</p>
                <p className="text-white/50 font-body text-sm">{box.value}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div
            className="max-w-2xl mx-auto p-8 rounded-3xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h3 className="font-heading font-bold text-white text-2xl mb-6 text-center">Send a Message</h3>

            {sent && (
              <div className="mb-6 px-4 py-3 rounded-xl text-sm font-body text-white text-center"
                style={{ background: 'rgba(92,39,254,0.3)', border: '1px solid rgba(92,39,254,0.5)' }}>
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs font-body mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-body mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="form-control"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs font-body mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="form-control"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs font-body mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message..."
                  className="form-control resize-none"
                />
              </div>
              <button type="submit" className="action-btn w-full py-3">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
