import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { stripeLog } from '../utils/stripeCheckout'

const appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#9D6FFF',
    colorBackground: '#12122E',
    colorText: '#FFFFFF',
    colorTextSecondary: 'rgba(255,255,255,0.65)',
    colorTextPlaceholder: 'rgba(255,255,255,0.38)',
    colorDanger: '#F87171',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSizeBase: '16px',
    borderRadius: '10px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      padding: '0',
      lineHeight: '1.4',
    },
    '.Input:focus': {
      boxShadow: 'none',
    },
    '.Input--invalid': {
      color: '#F87171',
    },
  },
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '16px',
      lineHeight: '24px',
      '::placeholder': { color: 'rgba(255,255,255,0.38)' },
    },
    invalid: { color: '#F87171' },
  },
  showIcon: true,
}

function friendlyStripeError(error) {
  if (!error) return 'Something went wrong. Please try again.'
  const code = error.code || ''
  const type = error.type || ''

  const map = {
    card_declined: 'Your card was declined. Try a different card or contact your bank.',
    expired_card: 'This card has expired. Please use a different card.',
    incorrect_cvc: 'The security code (CVC) is incorrect. Please check and try again.',
    incorrect_number: 'The card number is invalid. Please check and try again.',
    incomplete_number: 'Please enter your full card number.',
    incomplete_expiry: 'Please enter the card expiry date.',
    incomplete_cvc: 'Please enter the card security code (CVC).',
    invalid_expiry_year_past: 'This expiry date has passed. Please use a valid card.',
    processing_error: 'A processing error occurred. Please wait a moment and try again.',
    authentication_required: 'Additional authentication is required. Please complete verification.',
  }

  if (map[code]) return map[code]
  if (type === 'validation_error') {
    return error.message || 'Please check your card details and try again.'
  }
  return error.message || 'Payment failed. Please try again.'
}

function PaymentFormInner({ clientSecret, amountUsd, returnUrl, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [fieldsReady, setFieldsReady] = useState({ number: false, expiry: false, cvc: false })
  const [fieldError, setFieldError] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const submittedRef = useRef(false)
  const errorRef = useRef(null)

  const allReady = fieldsReady.number && fieldsReady.expiry && fieldsReady.cvc

  const scrollToError = useCallback(() => {
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }, [])

  useEffect(() => {
    if (fieldError || paymentError) scrollToError()
  }, [fieldError, paymentError, scrollToError])

  const handleFieldChange = (event) => {
    setFieldError(event.error ? friendlyStripeError(event.error) : '')
    if (event.complete) setPaymentError('')
  }

  const markReady = (field) => {
    setFieldsReady((prev) => (prev[field] ? prev : { ...prev, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || submitting || submittedRef.current || !allReady) return

    const cardNumber = elements.getElement(CardNumberElement)
    if (!cardNumber) {
      setFieldError('Card form is still loading. Please wait a moment.')
      return
    }

    setPaymentError('')
    setFieldError('')
    setSubmitting(true)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardNumber },
        return_url: returnUrl,
      })

      if (error) {
        const msg = friendlyStripeError(error)
        if (error.type === 'validation_error' || error.code?.startsWith('incomplete_')) {
          setFieldError(msg)
        } else {
          setPaymentError(msg)
        }
        onError?.(error)
        setSubmitting(false)
        return
      }

      if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
        submittedRef.current = true
        stripeLog('Step 7: confirmCardPayment succeeded', {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        })
        stripeLog('Next: Stripe will call your backend webhook (not visible in browser Network tab). Open DevTools Console for poll logs.')
        onSuccess?.(paymentIntent)
        return
      }

      if (paymentIntent?.status === 'requires_action') {
        setPaymentError('Additional verification is required. Please follow the prompts.')
        setSubmitting(false)
        return
      }

      setPaymentError(`Payment could not be completed (status: ${paymentIntent?.status || 'unknown'}).`)
      setSubmitting(false)
    } catch (err) {
      setPaymentError(err?.message || 'Something went wrong. Please try again.')
      onError?.(err)
      setSubmitting(false)
    }
  }

  const displayError = paymentError || fieldError
  const canPay = stripe && allReady && !submitting

  return (
    <form className="sp-form" onSubmit={handleSubmit} noValidate>
      <div className="sp-card-fields">
        {!allReady && (
          <div className="sp-card-fields__loading" aria-hidden="true">
            <div className="sp-spinner sp-spinner--sm" />
            <span>Loading card fields…</span>
          </div>
        )}

        <div className={`sp-card-fields__body${allReady ? ' sp-card-fields__body--ready' : ''}`}>
          <div className="sp-field">
            <label className="sp-field__label" htmlFor="sp-card-number">Card number</label>
            <div className="sp-field__input" id="sp-card-number">
              <CardNumberElement
                options={CARD_ELEMENT_OPTIONS}
                onReady={() => markReady('number')}
                onChange={handleFieldChange}
              />
            </div>
          </div>

          <div className="sp-field-row">
            <div className="sp-field sp-field--half">
              <label className="sp-field__label" htmlFor="sp-card-expiry">Expiration date</label>
              <div className="sp-field__input" id="sp-card-expiry">
                <CardExpiryElement
                  options={CARD_ELEMENT_OPTIONS}
                  onReady={() => markReady('expiry')}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            <div className="sp-field sp-field--half">
              <label className="sp-field__label" htmlFor="sp-card-cvc">Security code</label>
              <div className="sp-field__input" id="sp-card-cvc">
                <CardCvcElement
                  options={CARD_ELEMENT_OPTIONS}
                  onReady={() => markReady('cvc')}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {displayError && (
        <div ref={errorRef} className="sp-form__error" role="alert" aria-live="assertive">
          <svg className="sp-form__error-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      <div className="sp-form__actions">
        <button type="submit" className="sp-form__submit" disabled={!canPay} aria-busy={submitting}>
          {submitting ? (
            <>
              <span className="sp-spinner sp-spinner--btn" aria-hidden="true" />
              Processing…
            </>
          ) : (
            `Pay $${Number(amountUsd).toLocaleString()} USD`
          )}
        </button>

        <p className="sp-form__footnote">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          256-bit encryption · Powered by Stripe
        </p>
      </div>
    </form>
  )
}

export default function StripePaymentForm({
  stripePromise,
  clientSecret,
  amountUsd,
  requestId,
  returnUrl,
  onSuccess,
  onError,
}) {
  if (!stripePromise || !clientSecret) return null

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <PaymentFormInner
        clientSecret={clientSecret}
        amountUsd={amountUsd}
        returnUrl={returnUrl}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
