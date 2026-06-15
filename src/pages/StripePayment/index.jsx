import { useEffect, useState, useRef, useMemo } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import StripePaymentForm from '../../components/StripePaymentForm'
import {
  GROWITH_INVESTOR_STRIPE_PK,
  isValidRequestId,
  loadStripeCheckoutSession,
  clearStripeCheckoutSession,
  fetchPayableStripeRequest,
  verifySessionMatchesRequest,
  buildPaymentReturnUrl,
  parseStripeReturnParams,
  pollTokenRequestApproval,
  stripeLog,
} from '../../utils/stripeCheckout'
import '../../styles/stripe-payment.css'

let stripePromise = null
function getStripe() {
  if (!GROWITH_INVESTOR_STRIPE_PK) return null
  if (!stripePromise) stripePromise = loadStripe(GROWITH_INVESTOR_STRIPE_PK)
  return stripePromise
}

export default function StripePaymentPage() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [phase, setPhase] = useState('loading') // loading | ready | verifying | success | error | expired
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [allocationPending, setAllocationPending] = useState(false)
  const initRef = useRef(false)
  const pollAbortRef = useRef(null)

  const returnUrl = useMemo(
    () => (isValidRequestId(requestId) ? buildPaymentReturnUrl(requestId) : ''),
    [requestId],
  )

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    async function init() {
      if (!isValidRequestId(requestId)) {
        setError('Invalid payment link.')
        setPhase('error')
        return
      }

      if (!GROWITH_INVESTOR_STRIPE_PK) {
        setError('Card payments are not configured. Contact support or try again later.')
        setPhase('error')
        return
      }

      // Handle return from 3D Secure redirect
      const { paymentIntentId: piFromUrl, redirectStatus } = parseStripeReturnParams(location.search)
      if (redirectStatus === 'succeeded' && piFromUrl) {
        clearStripeCheckoutSession(requestId)
        window.history.replaceState({}, '', `/dashboard/invest/pay/${requestId}`)
        setPaymentIntentId(piFromUrl)
        beginWebhookWait(piFromUrl)
        return
      }

      if (redirectStatus === 'failed') {
        setError('Authentication failed. Please try your payment again.')
        setPhase('error')
        window.history.replaceState({}, '', `/dashboard/invest/pay/${requestId}`)
        return
      }

      try {
        const serverReq = await fetchPayableStripeRequest(requestId, { allowCompleted: true })
        setOrder(serverReq)

        if (serverReq.alreadyCompleted) {
          clearStripeCheckoutSession(requestId)
          setPaymentIntentId(serverReq.stripePaymentIntentId || serverReq.purchaseRef)
          setPhase('success')
          return
        }

        const session = loadStripeCheckoutSession(requestId)
        if (!session) {
          setPhase('expired')
          return
        }

        if (!verifySessionMatchesRequest(session, serverReq)) {
          clearStripeCheckoutSession(requestId)
          setError('Payment session mismatch. Please start checkout again from Invest.')
          setPhase('error')
          return
        }

        setClientSecret(session.clientSecret)
        setPaymentIntentId(session.paymentIntentId)
        setPhase('ready')
      } catch (err) {
        setError(err?.message || 'Could not load payment details.')
        setPhase('error')
      }
    }

    init()
    return () => pollAbortRef.current?.abort()
  }, [requestId, location.search])

  const beginWebhookWait = (piId) => {
    pollAbortRef.current?.abort()
    const controller = new AbortController()
    pollAbortRef.current = controller

    stripeLog('Step 7 complete — starting wait for webhook-driven approval', {
      requestId,
      paymentIntentId: piId || paymentIntentId,
    })

    setPaymentIntentId(piId || paymentIntentId)
    setPhase('verifying')
    setAllocationPending(false)
    setError('')

    pollTokenRequestApproval(requestId, { signal: controller.signal })
      .then((req) => {
        if (req) setOrder((prev) => ({ ...prev, ...req }))
        if (req?.timedOut) {
          setAllocationPending(true)
          stripeLog('UI: showing success with allocation still pending (webhook slow or missing)')
        } else {
          stripeLog('UI: showing success — tokens allocated', req)
        }
        setPhase('success')
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        stripeLog('Approval wait failed', err?.message)
        setError(err?.message || 'Could not confirm token allocation.')
        setPhase('error')
      })
  }

  const handleSuccess = (paymentIntent) => {
    clearStripeCheckoutSession(requestId)
    beginWebhookWait(paymentIntent?.id)
  }

  const stripe = getStripe()
  const displayAmount = order?.amountUsd ?? 0
  const displayQty = order?.tokenQty ?? 0
  const displayTicker = order?.ticker || 'TOKENS'
  const displayName = order?.tokenName || 'Token Purchase'

  return (
    <div className="sp-page">
      <div className="sp-page__glow sp-page__glow--left" />
      <div className="sp-page__glow sp-page__glow--right" />

      <header className="sp-header">
        <Link to="/dashboard/invest" className="sp-header__brand">
          <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="sp-header__logo" />
        </Link>
        <div className="sp-header__secure">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Secure checkout
        </div>
      </header>

      <main className="sp-main">
        <div className="sp-card">
          {/* ── Left: order summary ── */}
          <aside className="sp-summary">
            <div className="sp-summary__stripe">
              <svg width="48" height="20" viewBox="0 0 60 25" fill="none" aria-label="Stripe">
                <path d="M59.5 14.4c0-4.5-2.2-8-6.4-8s-6.7 3.5-6.7 7.9c0 5.3 3 8 7.2 8 2 0 3.6-.5 4.8-1.1v-3.5c-1.2.6-2.5 1-4.2 1-1.6 0-3.1-.6-3.3-2.6h8.5c.1-.2.1-1.1.1-1.7zm-8.6-1.6c0-1.9 1.2-2.7 2.2-2.7 1 0 2.1.8 2.1 2.7h-4.3zM40.5 6.4c-1.7 0-2.8.8-3.4 1.4l-.2-1.1H33v25.4l4.4-.9v-6.2c.6.5 1.6 1.1 3.2 1.1 3.2 0 6.2-2.6 6.2-8.3 0-5.2-3-7.4-6.3-7.4zm-1 11.4c-1 0-1.7-.4-2.2-.9V11c.5-.5 1.2-.9 2.2-.9 1.7 0 2.9 1.9 2.9 3.8 0 2-1.2 3.9-2.9 3.9zm-12-12.4l4.4-1V0l-4.4 1v4.4zm0 1.3h4.4v15.7h-4.4zm-5.5 1.3l-.3-1.3h-3.8v15.7H22V11.6c1-1.3 2.8-1.1 3.4-.9V6.7c-.6-.2-2.6-.6-3.4 1.3zM12 2.9l-4.3.9v14.1c0 2.6 2 4.5 4.6 4.5 1.5 0 2.5-.3 3.1-.6v-3.5c-.6.2-3.4 1.1-3.4-1.6V10h3.4V6.4h-3.4V2.9zM4.4 11c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1V7c-1.4-.6-2.9-.8-4.3-.8-3.5 0-5.9 1.8-5.9 4.9 0 4.9 6.7 4.1 6.7 6.2 0 .8-.7 1.1-1.7 1.1-1.4 0-3.2-.6-4.7-1.4V21c1.6.7 3.2 1 4.6 1 3.6 0 6.1-1.8 6.1-4.9 0-5.3-6.7-4.3-6.7-6.1z" fill="#635BFF"/>
              </svg>
            </div>

            <p className="sp-summary__label">Order summary</p>
            <h1 className="sp-summary__title">{displayName}</h1>

            <div className="sp-summary__rows">
              <div className="sp-summary__row">
                <span>Tokens</span>
                <strong>{Number(displayQty).toLocaleString()} {displayTicker}</strong>
              </div>
              <div className="sp-summary__row">
                <span>Payment method</span>
                <strong>Card</strong>
              </div>
              <div className="sp-summary__row sp-summary__row--total">
                <span>Total due</span>
                <strong>${Number(displayAmount).toLocaleString()} USD</strong>
              </div>
            </div>

            <p className="sp-summary__note">
              Token allocation is confirmed after payment verification. You will receive an email once tokens are credited to your wallet.
            </p>
          </aside>

          {/* ── Right: payment panel ── */}
          <section className="sp-panel">
            {phase === 'loading' && (
              <div className="sp-state sp-state--loading">
                <div className="sp-spinner" />
                <p>Loading secure checkout…</p>
              </div>
            )}

            {phase === 'ready' && (
              <>
                <h2 className="sp-panel__title">Card details</h2>
                <p className="sp-panel__sub">Enter your card number, expiry, and CVC. All fields are required.</p>
                <StripePaymentForm
                  stripePromise={stripe}
                  clientSecret={clientSecret}
                  amountUsd={displayAmount}
                  requestId={requestId}
                  returnUrl={returnUrl}
                  onSuccess={handleSuccess}
                />
              </>
            )}

            {phase === 'verifying' && (
              <div className="sp-state sp-state--loading">
                <div className="sp-spinner" />
                <h2>Payment confirmed</h2>
                <p>
                  Stripe accepted your payment. Waiting for secure verification and token allocation…
                </p>
                {paymentIntentId && (
                  <p className="sp-state__ref">Ref: <span className="sp-mono">{paymentIntentId}</span></p>
                )}
              </div>
            )}

            {phase === 'success' && (
              <div className="sp-state sp-state--success">
                <div className="sp-state__icon sp-state__icon--success">✓</div>
                <h2>{allocationPending ? 'Payment received' : 'Tokens allocated'}</h2>
                <p>
                  {allocationPending
                    ? 'Your payment was successful. Token allocation is still processing — check your wallet in a few minutes or watch for the confirmation email.'
                    : `Your payment is complete and ${Number(displayQty).toLocaleString()} ${displayTicker} will appear in your wallet. A confirmation email has been sent.`}
                </p>
                {paymentIntentId && (
                  <p className="sp-state__ref">Ref: <span className="sp-mono">{paymentIntentId}</span></p>
                )}
                <button
                  type="button"
                  className="sp-btn sp-btn--primary"
                  onClick={() => navigate('/dashboard/wallet', { replace: true })}
                >
                  Go to Wallet
                </button>
                <Link to="/dashboard/invest" className="sp-btn sp-btn--ghost">Back to Invest</Link>
              </div>
            )}

            {phase === 'expired' && (
              <div className="sp-state sp-state--warn">
                <div className="sp-state__icon sp-state__icon--warn">!</div>
                <h2>Checkout session expired</h2>
                <p>For security, payment sessions expire after 30 minutes. Please start a new checkout from the Invest page.</p>
                <button
                  type="button"
                  className="sp-btn sp-btn--primary"
                  onClick={() => navigate('/dashboard/invest', { replace: true })}
                >
                  Return to Invest
                </button>
              </div>
            )}

            {(phase === 'error') && (
              <div className="sp-state sp-state--error">
                <div className="sp-state__icon sp-state__icon--error">✕</div>
                <h2>Unable to continue</h2>
                <p>{error}</p>
                <button
                  type="button"
                  className="sp-btn sp-btn--primary"
                  onClick={() => navigate('/dashboard/invest', { replace: true })}
                >
                  Return to Invest
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="sp-footer">
        <span>Powered by Stripe</span>
        <span>·</span>
        <Link to="/legal/privacy">Privacy</Link>
        <span>·</span>
        <Link to="/legal/terms">Terms</Link>
      </footer>
    </div>
  )
}
