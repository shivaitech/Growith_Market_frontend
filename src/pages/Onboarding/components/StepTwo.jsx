import { useState, useRef } from 'react';
import authService from '../../../services/authService';

export default function StepTwo({ email, onVerified }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputs = useRef([]);

  const handleInput = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    setError('');
    setApiError('');
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setIsLoading(true);
    setApiError('');
    try {
      const response = await authService.verifyEmail({ email, code: fullCode });
      const token   = response?.data?.tokens?.accessToken  || response?.token;
      const refresh = response?.data?.tokens?.refreshToken || '';
      const user    = response?.data?.user                 || response?.user;
      onVerified(token, refresh, user);
    } catch (err) {
      setApiError(err.message || 'Invalid or expired code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await authService.sendEmailVerification(email);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setApiError('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="ob-step">
      <div className="ob-otp-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="22,6 12,13 2,6" stroke="#9D6FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="ob-step-head">
        <h2 className="ob-step-title">Check your email</h2>
        <p className="ob-step-sub">
          We sent a 6-digit verification code to<br/>
          <strong style={{ color: '#DEC7FF' }}>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="ob-otp-wrap" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`ob-otp-box${error ? ' error' : ''}`}
              autoFocus={i === 0}
            />
          ))}
        </div>
        {error && <p className="ob-field-error">{error}</p>}
        {apiError && <p className="ob-api-error">{apiError}</p>}

        <button
          type="submit"
          className="login-submit-btn"
          disabled={isLoading}
          style={{ marginTop: 24 }}
        >
          {isLoading ? (
            <span className="login-spinner"></span>
          ) : (
            <>
              Verify Email
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </form>

      <p className="ob-resend-row">
        Didn't receive the code?{' '}
        {resendCooldown > 0 ? (
          <span className="ob-resend-timer">Resend in {resendCooldown}s</span>
        ) : (
          <button type="button" className="ob-resend-btn" onClick={handleResend}>
            Resend code
          </button>
        )}
      </p>
    </div>
  );
}
