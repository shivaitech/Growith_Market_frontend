import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email address is required'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return; }
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setStage('otp');
      setResendCooldown(60);
    } catch (err) {
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = Array(6).fill('');
    digits.split('').forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the complete 6-digit code'); return; }
    setIsLoading(true);
    setError('');
    try {
      const res = await authService.verifyForgotPasswordCode({ email, code });
      const token = res?.data?.token || res?.token || '';
      navigate(`/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setOtp(Array(6).fill(''));
      setResendCooldown(60);
    } catch (err) {
      setError(err.message || 'Failed to resend. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const BannerPanel = () => (
    <div className="login-banner">
      <div className="login-banner-blob login-banner-blob--1" />
      <div className="login-banner-blob login-banner-blob--2" />
      <div className="login-banner-blob login-banner-blob--3" />
      <div className="login-banner-content">
        <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="login-banner-logo" />
        <p className="login-banner-tagline">Invest. Grow. Repeat.</p>
        <p className="login-banner-desc">
          Secure your investment account with a strong password. We'll send a reset code to your registered email.
        </p>
        <ul className="login-banner-features">
          <li>
            <span className="feature-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9D6FFF" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>End-to-end encrypted communication</span>
          </li>
          <li>
            <span className="feature-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Reset links expire within 15 minutes</span>
          </li>
          <li>
            <span className="feature-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.16h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.98-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>24/7 investor support available</span>
          </li>
        </ul>
      </div>
    </div>
  );

  // ── OTP stage ──
  if (stage === 'otp') {
    return (
      <div className="login-container">
        <BannerPanel />
        <div className="login-right">
          <div className="login-header">
            <button className="login-back" onClick={() => { setStage('email'); setOtp(Array(6).fill('')); setError(''); }} aria-label="Back to email">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="login-header-right">
              <span className="login-header-text">Remember your password?</span>
              <Link to="/login" className="login-header-link">Sign In</Link>
            </div>
          </div>

          <div className="login-branding">
            <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="login-logo" />
            <p className="login-tagline">Invest. Grow. Repeat.</p>
          </div>

          <div className="login-content">
            <div className="login-card" style={{ textAlign: 'center' }}>
              <div className="fp-success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>

              <h2 className="login-title" style={{ marginTop: 0 }}>Check Your Email</h2>
              <p className="login-subtitle" style={{ marginBottom: '8px' }}>
                We've sent a 6-digit code to
              </p>
              <p style={{ fontWeight: 700, color: '#9D6FFF', fontSize: '15px', marginBottom: '28px' }}>{email}</p>

              {error && (
                <div className="login-error-banner" style={{ marginBottom: 20 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                <div className="ob-otp-wrap" style={{ justifyContent: 'center', marginBottom: 0 }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      className="ob-otp-box"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <button type="submit" className="login-submit-btn" disabled={isLoading} style={{ marginTop: 28 }}>
                  {isLoading ? (
                    <><span className="login-spinner" /><span>Verifying…</span></>
                  ) : 'Verify Code'}
                </button>
              </form>

              <button
                className="fp-resend-btn"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isLoading}
                style={{ marginTop: 16, opacity: resendCooldown > 0 ? 0.5 : 1 }}
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't receive it? Resend"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form state ──
  return (
    <div className="login-container">
      <BannerPanel />

      <div className="login-right">
        <div className="login-header">
          <button className="login-back" onClick={() => navigate('/login')} aria-label="Back to login">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="login-header-right">
            <span className="login-header-text">Remember your password?</span>
            <Link to="/login" className="login-header-link">Sign In</Link>
          </div>
        </div>

        <div className="login-branding">
          <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="login-logo" />
          <p className="login-tagline">Invest. Grow. Repeat.</p>
        </div>

        <div className="login-content">
          <div className="login-card">
            <h2 className="login-title">Forgot Password?</h2>
            <p className="login-subtitle">
              Enter your registered email address and we'll send you a secure reset link.
            </p>

            {error && (
              <div className="login-error-banner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="login-form" noValidate>
              <div className="login-form-group">
                <label htmlFor="fp-email" className="login-label">Email Address</label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`login-input${error ? ' error' : ''}`}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="login-spinner" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Send Reset Link
                  </>
                )}
              </button>

              <Link to="/login" className="login-forgot-link">
                ← Back to Sign In
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
