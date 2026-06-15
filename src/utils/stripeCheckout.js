import apiService from '../services/apiService'

export const GROWITH_INVESTOR_STRIPE_PK = import.meta.env.GROWITH_INVESTOR_STRIPE_PK

const SESSION_PREFIX = 'growith_stripe_checkout_'
const SESSION_TTL_MS = 30 * 60 * 1000 // 30 minutes

const REQUEST_ID_RE = /^[a-f0-9]{24}$/i

export function isValidRequestId(id) {
  return typeof id === 'string' && REQUEST_ID_RE.test(id)
}

export function makeIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `pi_${crypto.randomUUID()}`
  }
  return `pi_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}

/** Backend returns { data: { paymentIntent, request } } — flatten for the UI */
export function normalizeStripeIntentResponse(raw) {
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
    amountUsd: Number(req?.amountUsd ?? data?.amountUsd ?? pi?.amount / 100 ?? 0) || 0,
    tokenQty: Number(req?.tokenQty ?? data?.tokenQty ?? 0) || 0,
    ticker: req?.ticker || data?.ticker || '',
    tokenName: req?.tokenName || data?.tokenName || '',
  }
}

export function normalizeTokenRequest(raw) {
  const req = raw?.data || raw
  return {
    id: req?.id || req?._id,
    status: (req?.status || '').toLowerCase(),
    method: (req?.method || req?.paymentProvider || '').toLowerCase(),
    paymentProvider: (req?.paymentProvider || '').toLowerCase(),
    amountUsd: Number(req?.amountUsd ?? 0) || 0,
    tokenQty: Number(req?.tokenQty ?? 0) || 0,
    ticker: req?.ticker || '',
    tokenName: req?.tokenName || '',
    purchaseRef: req?.purchaseRef || req?.stripePaymentIntentId || '',
    stripePaymentIntentId: req?.stripePaymentIntentId || req?.purchaseRef || '',
    stripePaymentStatus: req?.stripePaymentStatus || '',
  }
}

function sessionKey(requestId) {
  return `${SESSION_PREFIX}${requestId}`
}

/** Store checkout credentials in sessionStorage — never put clientSecret in the URL */
export function saveStripeCheckoutSession(payload) {
  if (!payload?.requestId || !isValidRequestId(payload.requestId)) return false
  try {
    const record = {
      requestId: payload.requestId,
      clientSecret: payload.clientSecret,
      paymentIntentId: payload.paymentIntentId,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    }
    sessionStorage.setItem(sessionKey(payload.requestId), JSON.stringify(record))
    return true
  } catch {
    return false
  }
}

export function loadStripeCheckoutSession(requestId) {
  if (!isValidRequestId(requestId)) return null
  try {
    const raw = sessionStorage.getItem(sessionKey(requestId))
    if (!raw) return null
    const record = JSON.parse(raw)
    if (record.requestId !== requestId) return null
    if (!record.clientSecret || !record.paymentIntentId) return null
    if (Date.now() > record.expiresAt) {
      clearStripeCheckoutSession(requestId)
      return null
    }
    return record
  } catch {
    return null
  }
}

export function clearStripeCheckoutSession(requestId) {
  if (!requestId) return
  try {
    sessionStorage.removeItem(sessionKey(requestId))
  } catch { /* ignore */ }
}

/**
 * Create a Stripe PaymentIntent via backend.
 * Amount/qty are validated server-side — never trust client values on the payment page.
 */
export async function createStripePaymentIntent({ tokenId, tokenQty, idempotencyKey }) {
  const key = idempotencyKey || makeIdempotencyKey()
  const res = await apiService.request('/tokens/requests/stripe-payment-intent', {
    method: 'POST',
    headers: { 'Idempotency-Key': key },
    body: JSON.stringify({
      tokenId,
      tokenQty: Number(tokenQty),
    }),
  })
  return { normalized: normalizeStripeIntentResponse(res), idempotencyKey: key }
}

/** Fetch and validate a token request belongs to this user and is payable */
export async function fetchPayableStripeRequest(requestId, { allowCompleted = false } = {}) {
  if (!isValidRequestId(requestId)) {
    throw new Error('Invalid payment reference.')
  }
  const res = await apiService.getTokenRequest(requestId)
  const req = normalizeTokenRequest(res)

  if (!req.id) {
    throw new Error('Payment request not found.')
  }

  const isStripe =
    req.method === 'stripe' ||
    req.paymentProvider === 'stripe' ||
    req.purchaseRef?.startsWith('pi_')

  if (!isStripe) {
    throw new Error('This request is not a card payment.')
  }

  if (req.status === 'approved') {
    if (allowCompleted) return { ...req, alreadyCompleted: true }
    throw new Error('This payment has already been completed.')
  }

  const terminal = new Set(['rejected', 'cancelled', 'expired', 'failed'])
  if (terminal.has(req.status)) {
    throw new Error(`This payment request is already ${req.status}.`)
  }

  return req
}

/** Cross-check session credentials against server-owned request record */
export function verifySessionMatchesRequest(session, serverRequest) {
  if (!session || !serverRequest) return false
  const serverPiId = serverRequest.stripePaymentIntentId || serverRequest.purchaseRef
  if (!serverPiId || !session.paymentIntentId) return false
  return session.paymentIntentId === serverPiId
}

export function buildPaymentReturnUrl(requestId) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/dashboard/invest/pay/${requestId}`
}

export function parseStripeReturnParams(search) {
  const params = new URLSearchParams(search)
  return {
    paymentIntentId: params.get('payment_intent'),
    clientSecret: params.get('payment_intent_client_secret'),
    redirectStatus: params.get('redirect_status'),
  }
}

const LOG = '[Growith Stripe]'

/** Dev-friendly payment flow logs (open browser DevTools → Console) */
export function stripeLog(message, detail) {
  if (detail !== undefined) console.info(LOG, message, detail)
  else console.info(LOG, message)
}

export function stripeLogWebhookInfo() {
  console.group(`${LOG} Webhook (steps 8–12) — not visible in this browser`)
  stripeLog('Step 7 done: Stripe.js confirm succeeded (you see "confirm" in Network tab).')
  stripeLog('Step 8: Stripe servers POST to YOUR backend — server-to-server only:')
  stripeLog('  → POST /api/v1/stripe/webhook  (not called from this browser)')
  stripeLog('Check webhook deliveries: Stripe Dashboard → Developers → Webhooks → your endpoint → Event deliveries')
  stripeLog('Below: polling GET /tokens/requests/:id until backend marks request approved after webhook.')
  console.groupEnd()
}

const APPROVED_STATUSES = new Set(['approved', 'completed'])
const TERMINAL_FAIL_STATUSES = new Set(['rejected', 'cancelled', 'failed', 'expired'])

/**
 * After Stripe.js confirms payment (step 7), poll until the backend webhook
 * (steps 8–12) approves the TokenRequest. The frontend never calls the webhook.
 */
export function pollTokenRequestApproval(requestId, {
  intervalMs = 2500,
  maxAttempts = 24, // ~60s
  signal,
} = {}) {
  if (!isValidRequestId(requestId)) {
    return Promise.reject(new Error('Invalid payment reference.'))
  }

  return new Promise((resolve, reject) => {
    let attempts = 0
    let timer = null

    const cleanup = () => {
      if (timer) clearTimeout(timer)
    }

    if (signal) {
      signal.addEventListener('abort', () => {
        cleanup()
        reject(new DOMException('Polling aborted', 'AbortError'))
      })
    }

    const tick = async () => {
      if (signal?.aborted) return
      attempts += 1

      stripeLog(`Poll #${attempts}/${maxAttempts} — GET /tokens/requests/${requestId}`)

      try {
        const res = await apiService.getTokenRequest(requestId)
        const req = normalizeTokenRequest(res)
        const status = req.status

        stripeLog(`Poll #${attempts} response`, {
          requestId: req.id,
          status,
          stripePaymentStatus: req.stripePaymentStatus,
          purchaseRef: req.purchaseRef,
        })

        if (APPROVED_STATUSES.has(status)) {
          stripeLog('✓ Token request approved (webhook processing complete)', req)
          cleanup()
          resolve(req)
          return
        }

        if (TERMINAL_FAIL_STATUSES.has(status)) {
          stripeLog('✗ Token request terminal status', status)
          cleanup()
          reject(new Error(`Payment request was ${status}. Contact support if you were charged.`))
          return
        }

        stripeLog(`… Still pending (${status}) — waiting for Stripe webhook → backend approval`)
      } catch (err) {
        stripeLog(`Poll #${attempts} failed`, err?.message || err)
        if (attempts >= maxAttempts) {
          cleanup()
          reject(err)
          return
        }
      }

      if (attempts >= maxAttempts) {
        stripeLog('⚠ Polling timed out — payment may still process via webhook. Check wallet or Stripe Dashboard.')
        cleanup()
        resolve({ id: requestId, status: 'pending', timedOut: true })
        return
      }

      timer = setTimeout(tick, intervalMs)
    }

    stripeLogWebhookInfo()
    stripeLog('Started polling for backend approval', { requestId, intervalMs, maxAttempts })
    tick()
  })
}
