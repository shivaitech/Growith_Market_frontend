import { useEffect, useState, useRef } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import apiService from '../services/apiService'

/* Singleton — load Stripe.js once for the whole app */
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null

/* Dark theme for Stripe Elements that matches the dashboard */
const ELEMENTS_APPEARANCE = {
  theme: 'night',
  variables: {
    colorPrimary: '#9D6FFF',
    colorBackground: '#0F1330',
    colorText: '#FFFFFF',
    colorDanger: '#EF4444',
    fontFamily: 'system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '10px',
  },
  rules: {
    '.Input': {
      backgroundColor: 'rgba(255,255,255,0.04)',
      borderColor: 'rgba(255,255,255,0.12)',
    },
    '.Input:focus': {
      borderColor: '#9D6FFF',
      boxShadow: '0 0 0 1px rgba(157,111,255,0.4)',
    },
    '.Label': {
      color: 'rgba(255,255,255,0.7)',
      fontSize: '12px',
      fontWeight: '600',
    },
  },
}

/* ── Inner form component (must be inside <Elements>) ───────────────────── */
function StripeCheckoutForm({ amountUsd, tokenQty, ticker, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setErrorMsg('')
    setSubmitting(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Stripe needs a return URL even if we stay on-page; just point to current
          return_url: window.location.href,
        },
        redirect: 'if_required',
      })
      if (error) {
        setErrorMsg(error.message || 'Payment failed. Please try again.')
        onError?.(error)
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess?.(paymentIntent)
      } else if (paymentIntent?.status === 'processing') {
        onSuccess?.(paymentIntent)
      } else {
        setErrorMsg(`Unexpected payment status: ${paymentIntent?.status || 'unknown'}`)
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.')
      onError?.(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: 'rgba(157,111,255,0.06)',
        border: '1px solid rgba(157,111,255,0.18)',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>You're Buying</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 2 }}>
            {Number(tokenQty).toLocaleString()} <span style={{ color: '#DEC7FF', fontSize: 13 }}>{ticker}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Total</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 2 }}>${Number(amountUsd).toLocaleString()} USD</div>
        </div>
      </div>

      <PaymentElement options={{ layout: 'tabs' }} />

      {errorMsg && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#fca5a5',
          padding: '10px 14px',
          borderRadius: 10,
          fontSize: 13,
        }}>{errorMsg}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || submitting}
        style={{
          width: '100%',
          padding: '14px 20px',
          borderRadius: 12,
          background: submitting ? 'rgba(157,111,255,0.5)' : 'linear-gradient(135deg, #5C27FE, #7B45FE)',
          border: '1px solid rgba(157,111,255,0.5)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "'Conthrax', sans-serif",
          cursor: submitting ? 'not-allowed' : 'pointer',
          letterSpacing: '0.03em',
          boxShadow: '0 4px 20px rgba(92,39,254,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        {submitting ? 'Processing…' : `Pay $${Number(amountUsd).toLocaleString()}`}
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Payments are processed securely by Stripe.
      </div>
    </form>
  )
}

/* ── Outer modal component ────────────────────────────────────────────── */
export default function StripeCheckoutModal({
  open,
  onClose,
  tokenId,
  ticker,
  amountUsd,
  tokenQty,
  onSuccess,
}) {
  const [clientSecret, setClientSecret] = useState(null)
  const [requestId, setRequestId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [succeeded, setSucceeded] = useState(false)
  const fetchedRef = useRef(false)

  // Fetch PaymentIntent client secret when modal opens
  useEffect(() => {
    if (!open) {
      fetchedRef.current = false
      setClientSecret(null)
      setRequestId(null)
      setError('')
      setSucceeded(false)
      return
    }
    if (fetchedRef.current) return
    fetchedRef.current = true

    if (!STRIPE_PUBLISHABLE_KEY) {
      setError('Stripe is not configured. Set VITE_STRIPE_PUBLISHABLE_KEY and reload.')
      return
    }
    setLoading(true)
    setError('')

    apiService.post('/tokens/requests/stripe-payment-intent', {
      tokenId,
      tokenQty: Number(tokenQty),
      amountUsd: Number(amountUsd),
    })
      .then(res => {
        // Response shape (per backend spec):
        // { data: { clientSecret, requestId, paymentIntentId, ... } } OR flat { clientSecret, ... }
        const data = res?.data || res
        const secret = data?.clientSecret || data?.client_secret
        const reqId = data?.requestId || data?.tokenRequestId || data?.id
        if (!secret) throw new Error('Backend did not return a clientSecret.')
        setClientSecret(secret)
        setRequestId(reqId || null)
      })
      .catch(err => {
        setError(err?.message || 'Could not initialize Stripe payment.')
      })
      .finally(() => setLoading(false))
  }, [open, tokenId, tokenQty, amountUsd])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(7, 10, 41, 0.82)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 480, width: '100%',
          maxHeight: '90vh', overflow: 'auto',
          background: 'linear-gradient(160deg, rgba(20,16,50,0.97) 0%, rgba(30,18,70,0.97) 100%)',
          border: '1.5px solid rgba(157,111,255,0.35)',
          borderRadius: 20,
          padding: '28px 28px 24px',
          boxShadow: '0 24px 80px rgba(92,39,254,0.35)',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 18, lineHeight: 1,
          }}
        >×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #635BFF, #7E76FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,91,255,0.35)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
              <line x1="6" y1="15" x2="10" y2="15"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: "'Conthrax', sans-serif" }}>Pay with Card</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Secured by Stripe</div>
          </div>
        </div>

        {succeeded ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.18), rgba(34,197,94,0.06))',
              border: '1.5px solid rgba(34,197,94,0.4)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 18,
              boxShadow: '0 0 32px rgba(34,197,94,0.25)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Conthrax', sans-serif", fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
              Payment Successful
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', margin: '0 0 20px' }}>
              Your card was charged successfully. Tokens will be allocated to your wallet shortly — you'll receive a confirmation email.
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 28px',
                background: 'linear-gradient(135deg, #5C27FE, #7B45FE)',
                border: '1px solid rgba(157,111,255,0.5)',
                borderRadius: 100,
                color: '#fff',
                fontSize: 13, fontWeight: 700,
                fontFamily: "'Conthrax', sans-serif",
                cursor: 'pointer',
                letterSpacing: '0.03em',
              }}
            >Continue</button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
            Initializing secure payment…
          </div>
        ) : error ? (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            padding: '14px 16px',
            borderRadius: 10,
            fontSize: 13,
            lineHeight: 1.6,
          }}>{error}</div>
        ) : clientSecret && stripePromise ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: ELEMENTS_APPEARANCE }}>
            <StripeCheckoutForm
              amountUsd={amountUsd}
              tokenQty={tokenQty}
              ticker={ticker}
              onSuccess={(pi) => {
                setSucceeded(true)
                onSuccess?.({ paymentIntent: pi, requestId })
              }}
              onError={(err) => {
                console.warn('Stripe payment error:', err)
              }}
            />
          </Elements>
        ) : null}
      </div>
    </div>
  )
}
