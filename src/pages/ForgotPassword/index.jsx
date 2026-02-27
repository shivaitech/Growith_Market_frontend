import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      console.log('Password reset requested for:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="login-container">
        <div className="login-header">
          <Link to="/login" className="login-back" aria-label="Back to login">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="login-branding">
          <h1 className="login-logo">Growith</h1>
          <p className="login-tagline">Invest. Grow. Repeat.</p>
        </div>

        <div className="login-content">
          <div className="login-card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #6B35FF 0%, #9D6FFF 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>

            <h2 className="login-title">Check Your Email</h2>
            <p className="login-subtitle">
              We've sent a password reset link to<br />
              <strong style={{ color: '#6B35FF' }}>{email}</strong>
            </p>

            <p style={{
              fontSize: '14px',
              color: 'rgba(26, 26, 46, 0.6)',
              lineHeight: '1.6',
              marginBottom: '28px',
            }}>
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>

            <Link to="/login" className="login-submit-btn" style={{ textDecoration: 'none' }}>
              Back to Login
            </Link>

            <button
              onClick={() => setIsSubmitted(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B35FF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '12px',
              }}
            >
              Didn't receive the email? Resend
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <Link to="/login" className="login-back" aria-label="Back to login">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <div className="login-branding">
        <h1 className="login-logo">Growith</h1>
        <p className="login-tagline">Invest. Grow. Repeat.</p>
      </div>

      <div className="login-content">
        <div className="login-card">
          <h2 className="login-title">Forgot Password?</h2>
          <p className="login-subtitle">
            Enter your email and we'll send you a link to reset your password
          </p>

          {error && (
            <div className="login-error-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`login-input ${error ? 'error' : ''}`}
                placeholder="nicholas@ergemia.com"
                autoComplete="email"
              />
              {error && <span className="login-field-error">{error}</span>}
            </div>

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="login-spinner"></span>
                  <span>Sending...</span>
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <Link to="/login" className="login-forgot-link">
              Back to Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
