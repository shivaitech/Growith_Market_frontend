import { useEffect, useState, useRef } from 'react'
import apiService from '../services/apiService'
import { GROWITH_INVESTOR_STRIPE_PK } from '../utils/stripeCheckout'

/* Optional: only used if the backend returns a clientSecret AND the publishable
   key is configured. Imports are dynamic so we don't crash when Stripe.js is absent. */

let stripeJsPromise = null
async function loadStripeIfConfigured() {
  if (!GROWITH_INVESTOR_STRIPE_PK) return null
  if (stripeJsPromise) return stripeJsPromise
  try {
    const mod = await import('@stripe/stripe-js')
    stripeJsPromise = mod.loadStripe(GROWITH_INVESTOR_STRIPE_PK)
    return stripeJsPromise
  } catch {
    return null
  }
}

/* Generate a UUID-style idempotency key for safe retries */
function makeIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `pi_${crypto.randomUUID()}`
  }
  return `pi_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}

/* Backend returns { data: { paymentIntent, request } } — flatten for the UI */
function normalizeStripeIntentResponse(raw) {
  const data = raw?.data || raw
  const pi = data?.paymentIntent || data?.payment_intent
  const req = data?.request || data?.tokenRequest

  return {
    clientSecret:
      pi?.clientSecret || pi?.client_secret ||
      data?.clientSecret || data?.client_secret,
    paymentIntentId:
      pi?.id || data?.paymentIntentId || data?.stripePaymentIntentId,
    returnUrl: pi?.returnUrl || pi?.return_url || data?.returnUrl,
    requestId: req?.id || data?.requestId || data?.tokenRequestId || data?.id,
    checkoutUrl: data?.checkoutUrl || data?.url || data?.paymentUrl || pi?.checkoutUrl,
    status: pi?.status,
  }
}

export default function StripeCheckoutModal({
  open,
  onClose,
  tokenId,
  ticker,
  amountUsd,
  tokenQty,
  onSuccess,
}) {
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [request, setRequest]   = useState(null)   // backend response object
  const fetchedRef = useRef(false)
  const idemRef    = useRef(null)

  useEffect(() => {
    if (!open) {
      fetchedRef.current = false
      idemRef.current = null
      setRequest(null)
      setError('')
      setLoading(false)
      return
    }
    if (fetchedRef.current) return
    fetchedRef.current = true
    idemRef.current = makeIdempotencyKey()

    if (!tokenId) {
      setError('Missing token ID — cannot start checkout.')
      return
    }

    setLoading(true)
    setError('')

    apiService.request('/tokens/requests/stripe-payment-intent', {
      method: 'POST',
      headers: { 'Idempotency-Key': idemRef.current },
      body: JSON.stringify({
        tokenId,
        tokenQty: Number(tokenQty),
      }),
    })
      .then(res => {
        const normalized = normalizeStripeIntentResponse(res)
        setRequest(normalized)
        // Backend returned a Stripe Checkout / Payment Page URL — redirect immediately
        if (normalized.checkoutUrl) {
          window.location.href = normalized.checkoutUrl
        }
      })
      .catch(err => {
        setError(err?.message || 'Could not initialize Stripe payment.')
      })
      .finally(() => setLoading(false))
  }, [open, tokenId, tokenQty])

  if (!open) return null

  const clientSecret  = request?.clientSecret
  const requestId     = request?.requestId
  const checkoutUrl   = request?.checkoutUrl
  const piId          = request?.paymentIntentId
  const returnUrl     = request?.returnUrl

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

        {/* Summary */}
        <div style={{
          background: 'rgba(157,111,255,0.06)',
          border: '1px solid rgba(157,111,255,0.18)',
          borderRadius: 12,
          padding: '14px 16px',
          display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
          marginBottom: 18,
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
            <div style={{
              width: 36, height: 36, margin: '0 auto 14px',
              border: '3px solid rgba(157,111,255,0.25)',
              borderTopColor: '#9D6FFF',
              borderRadius: '50%',
              animation: 'sc-spin 0.8s linear infinite',
            }}/>
            <style>{`@keyframes sc-spin { to { transform: rotate(360deg); } }`}</style>
            Preparing secure checkout…
          </div>
        ) : error ? (
          <div>
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              padding: '14px 16px',
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.6,
              marginBottom: 16,
            }}>{error}</div>
            <button
              type="button"
              onClick={() => { fetchedRef.current = false; setError(''); setRequest(null); }}
              style={{
                width: '100%', padding: '12px 18px',
                background: 'rgba(157,111,255,0.12)',
                border: '1px solid rgba(157,111,255,0.3)',
                borderRadius: 10, color: '#DEC7FF',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >Try Again</button>
          </div>
        ) : checkoutUrl ? (
          // Backend returned a hosted-checkout URL. We've already triggered a
          // redirect; this is just a fallback in case the redirect was blocked.
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6, margin: '0 0 16px' }}>
              You're being redirected to Stripe's secure checkout page. If it didn't open automatically, click below.
            </p>
            <a
              href={checkoutUrl}
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #635BFF, #7E76FF)',
                color: '#fff',
                fontSize: 13, fontWeight: 700,
                fontFamily: "'Conthrax', sans-serif",
                textDecoration: 'none',
                borderRadius: 100,
                boxShadow: '0 4px 20px rgba(99,91,255,0.4)',
                letterSpacing: '0.03em',
              }}
            >Continue to Stripe →</a>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 14 }}>
              Request ID: <span style={{ fontFamily: 'monospace' }}>{requestId || '—'}</span>
            </div>
          </div>
        ) : clientSecret && !GROWITH_INVESTOR_STRIPE_PK ? (
          <div>
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              padding: '14px 16px',
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.6,
              marginBottom: 16,
            }}>
              Stripe is not configured on the frontend. Add <code style={{ color: '#DEC7FF' }}>GROWITH_INVESTOR_STRIPE_PK</code> to your <code style={{ color: '#DEC7FF' }}>.env</code> file and restart the dev server.
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 11,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
            }}>
              Request ID: <span style={{ color: '#DEC7FF' }}>{requestId || '—'}</span>
            </div>
          </div>
        ) : clientSecret && GROWITH_INVESTOR_STRIPE_PK ? (
          <StripeElementsForm
            clientSecret={clientSecret}
            amountUsd={amountUsd}
            requestId={requestId}
            returnUrl={returnUrl}
            onSuccess={(pi) => onSuccess?.({ paymentIntent: pi, requestId })}
            onError={(err) => console.warn('Stripe error:', err)}
          />
        ) : (
          // No checkoutUrl, no clientSecret — backend created the request but
          // did not return payment credentials.
          <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(157,111,255,0.18), rgba(92,39,254,0.06))',
              border: '1.5px solid rgba(157,111,255,0.4)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 18,
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DEC7FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Conthrax', sans-serif", fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
              Payment Request Created
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.6)', margin: '0 0 16px' }}>
              Your purchase request has been registered. Once payment is confirmed through our payment provider, the tokens will be allocated to your wallet automatically.
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 11,
              color: 'rgba(255,255,255,0.55)',
              textAlign: 'left',
              marginBottom: 16,
              fontFamily: 'monospace',
              wordBreak: 'break-all',
            }}>
              <div>Request ID: <span style={{ color: '#DEC7FF' }}>{requestId || '—'}</span></div>
              {piId && <div>Payment Intent: <span style={{ color: '#DEC7FF' }}>{piId}</span></div>}
            </div>
            <button
              type="button"
              onClick={() => {
                onSuccess?.({ requestId, paymentIntentId: piId })
                onClose?.()
              }}
              style={{
                padding: '10px 28px',
                background: 'linear-gradient(135deg, #5C27FE, #7B45FE)',
                border: '1px solid rgba(157,111,255,0.5)',
                borderRadius: 100, color: '#fff',
                fontSize: 13, fontWeight: 700,
                fontFamily: "'Conthrax', sans-serif",
                cursor: 'pointer',
                letterSpacing: '0.03em',
              }}
            >Done</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Lazy Stripe Elements form — only loaded when clientSecret + pub key are present ─ */
function StripeElementsForm({ clientSecret, amountUsd, requestId, returnUrl, onSuccess, onError }) {
  const [Elements, setElements] = useState(null)
  const [PaymentElement, setPaymentElement] = useState(null)
  const [stripeInstance, setStripeInstance] = useState(null)
  const [loadingErr, setLoadingErr] = useState('')

  useEffect(() => {
    let alive = true
    Promise.all([
      loadStripeIfConfigured(),
      import('@stripe/react-stripe-js'),
    ])
      .then(([stripe, reactStripe]) => {
        if (!alive) return
        if (!stripe) {
          setLoadingErr('Stripe.js could not be loaded. Set GROWITH_INVESTOR_STRIPE_PK and refresh.')
          return
        }
        setStripeInstance(stripe)
        setElements(() => reactStripe.Elements)
        setPaymentElement(() => reactStripe.PaymentElement)
      })
      .catch(err => {
        setLoadingErr('Failed to load Stripe SDK: ' + (err?.message || 'unknown error'))
      })
    return () => { alive = false }
  }, [])

  if (loadingErr) {
    return (
      <div style={{
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#fca5a5',
        padding: '14px 16px',
        borderRadius: 10,
        fontSize: 13,
        lineHeight: 1.6,
      }}>{loadingErr}</div>
    )
  }

  if (!Elements || !PaymentElement || !stripeInstance) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
        Loading payment form…
      </div>
    )
  }

  return (
    <Elements
      stripe={stripeInstance}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#9D6FFF',
            colorBackground: '#0F1330',
            colorText: '#FFFFFF',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '10px',
          },
        },
      }}
    >
      <ElementsInnerForm
        PaymentElement={PaymentElement}
        amountUsd={amountUsd}
        requestId={requestId}
        returnUrl={returnUrl}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}

function ElementsInnerForm({ PaymentElement, amountUsd, requestId, returnUrl, onSuccess, onError }) {
  // Hooks must come from the loaded module too
  const [hooks, setHooks] = useState(null)
  useEffect(() => {
    import('@stripe/react-stripe-js').then(m => {
      setHooks({ useStripe: m.useStripe, useElements: m.useElements })
    })
  }, [])
  if (!hooks) return null
  return (
    <FormBody
      PaymentElement={PaymentElement}
      useStripe={hooks.useStripe}
      useElements={hooks.useElements}
      amountUsd={amountUsd}
      requestId={requestId}
      returnUrl={returnUrl}
      onSuccess={onSuccess}
      onError={onError}
    />
  )
}

function FormBody({ PaymentElement, useStripe, useElements, amountUsd, requestId, returnUrl, onSuccess, onError }) {
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
        confirmParams: { return_url: returnUrl || window.location.href },
        redirect: 'if_required',
      })
      if (error) {
        setErrorMsg(error.message || 'Payment failed. Please try again.')
        onError?.(error)
      } else if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
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
      <PaymentElement options={{ layout: 'tabs', wallets: { link: 'never' } }} />
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
          width: '100%', padding: '14px 20px', borderRadius: 12,
          background: submitting ? 'rgba(157,111,255,0.5)' : 'linear-gradient(135deg, #5C27FE, #7B45FE)',
          border: '1px solid rgba(157,111,255,0.5)',
          color: '#fff', fontSize: 14, fontWeight: 700,
          fontFamily: "'Conthrax', sans-serif",
          cursor: submitting ? 'not-allowed' : 'pointer',
          letterSpacing: '0.03em',
        }}
      >{submitting ? 'Processing…' : `Pay $${Number(amountUsd).toLocaleString()}`}</button>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
        Request ID: <span style={{ fontFamily: 'monospace' }}>{requestId || '—'}</span> · Powered by Stripe
      </div>
    </form>
  )
}
