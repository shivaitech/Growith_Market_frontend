import { useState } from 'react'
import apiService from '../../services/apiService'

const infoItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
      </svg>
    ),
    label: 'Office Address',
    value: 'EIB-611A, Emirates Islamic Bank Building, Business Zone-FZ RAK, United Arab Emirates',
    href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Emirates Islamic Bank Building, Business Zone-FZ RAK, United Arab Emirates'),
    target: '_blank',
    copyable: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white"/>
      </svg>
    ),
    label: 'Phone',
    value: '+971 506618 0707',
    href: 'tel:+9715066180707',
    copyable: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="white"/>
      </svg>
    ),
    label: 'Email',
    value: 'support@growithlive.com',
    href: 'mailto:support@growithlive.com',
    copyable: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
        <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Business Hours',
    value: 'Monday to Friday 9AM to 6:30PM GST',
  },
]

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      title={copied ? 'Copied!' : `Copy ${label}`}
      style={{
        position: 'absolute', top: 12, right: 12,
        width: 30, height: 30, borderRadius: '50%',
        background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.12)'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: copied ? '#22C55E' : 'rgba(255,255,255,0.7)',
        transition: 'background 0.2s, border-color 0.2s, color 0.2s',
        zIndex: 2,
      }}
    >
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      )}
    </button>
  )
}

function InfoCardWrapper({ item, children, isWide }) {
  const cardClass = `contact-pg-info__card${isWide ? ' contact-pg-info__card--wide' : ''}`
  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.target}
        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
        className={cardClass}
        style={{ display: 'block', textDecoration: 'none', position: 'relative' }}
      >
        {children}
      </a>
    )
  }
  return <div className={cardClass} style={{ position: 'relative' }}>{children}</div>
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in name, email, and message.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await apiService.post('/api/v1/contact', {
        fullName: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      })
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      console.warn('Contact submit failed:', err?.message || err)
      setError(err?.message || 'Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero / Intro */}
      <section className="contact-pg contact-pg--first">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8 col-12 text-center">
              <div className="block-text">
                <h6 className="sub-heading"><span>Get In Touch</span></h6>
                <h3 className="heading">Talk to the Growith Team</h3>
                <p className="contact-pg__lead">
                  Have questions about investing, token issuances, or regulatory requirements?
                  Our team is here to help — reach out and we'll respond within one business day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="contact-pg-info">
        <div className="container">
          {/* Row 1: Address — full width */}
          <div className="row mb-3">
            <div className="col-12">
              <InfoCardWrapper item={infoItems[0]} isWide>
                {infoItems[0].copyable && <CopyButton value={infoItems[0].value} label={infoItems[0].label} />}
                <div className="contact-pg-info__icon">{infoItems[0].icon}</div>
                <p className="contact-pg-info__label">{infoItems[0].label}</p>
                <p className="contact-pg-info__value">{infoItems[0].value}</p>
              </InfoCardWrapper>
            </div>
          </div>
          {/* Row 2: Phone, Email, Business Hours */}
          <div className="row">
            {infoItems.slice(1).map((item, i) => (
              <div className="col-xl-4 col-md-4 col-12" key={i}>
                <InfoCardWrapper item={item}>
                  {item.copyable && <CopyButton value={item.value} label={item.label} />}
                  <div className="contact-pg-info__icon">{item.icon}</div>
                  <p className="contact-pg-info__label">{item.label}</p>
                  <p className="contact-pg-info__value">{item.value}</p>
                </InfoCardWrapper>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="contact-pg-form-section">
        <div className="container">
          <div className="row gy-5">
            {/* Form */}
            <div className="col-xl-7 col-lg-7 col-12">
              <div className="contact-pg-form__wrap">
                <h3 className="contact-pg-form__title">Send Us a Message</h3>

                {sent && (
                  <div className="contact-pg-form__success">
                    Your message has been sent. We'll get back to you shortly.
                  </div>
                )}
                {error && (
                  <div className="contact-pg-form__error" style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#fca5a5',
                    padding: '12px 16px',
                    borderRadius: 10,
                    fontSize: 13,
                    marginBottom: 16,
                  }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row gy-3">
                    <div className="col-md-6 col-12">
                      <label className="contact-pg-form__label">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="contact-pg-form__input"
                      />
                    </div>
                    <div className="col-md-6 col-12">
                      <label className="contact-pg-form__label">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="contact-pg-form__input"
                      />
                    </div>
                    <div className="col-12">
                      <label className="contact-pg-form__label">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder="How can we help?"
                        className="contact-pg-form__input"
                      />
                    </div>
                    <div className="col-12">
                      <label className="contact-pg-form__label">Message</label>
                      <textarea
                        required
                        rows={6}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Write your message here..."
                        className="contact-pg-form__input contact-pg-form__textarea"
                      />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="action-btn contact-pg-form__submit" disabled={submitting}>
                        <span>{submitting ? 'Sending…' : 'Send Message'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Side info */}
            <div className="col-xl-5 col-lg-5 col-12">
              <div className="contact-pg-side">
                <h4 className="contact-pg-side__title">Why Investors Choose Growith</h4>
                <p className="contact-pg-side__text">
                  Growith is a UAE-based digital securities platform operated through a RAKEZ-established holding structure, connecting verified investors
                  with tokenised real-world assets. Our compliance-first infrastructure ensures every
                  issuance meets UAE regulatory standards.
                </p>
                <ul className="contact-pg-side__list">
                  <li>Full KYC/AML onboarding in under 5 minutes</li>
                  <li>Operated under UAE RAKEZ holding framework</li>
                  <li>Institutional-grade custodial wallet infrastructure</li>
                  <li>Dedicated investor support team</li>
                  <li>Transparent on-chain transaction history</li>
                </ul>
                <div className="contact-pg-side__badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12l2 2 4-4" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>UAE-Structured &amp; Fully Compliant Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
