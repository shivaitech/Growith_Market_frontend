import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const code  = searchParams.get('code')  || '';

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.password) errs.password = 'New password is required';
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) errs.password = 'Include at least one uppercase letter';
    else if (!/[0-9]/.test(formData.password)) errs.password = 'Include at least one number';
    if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm your new password';
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authService.resetPassword({ token, email, code, newPassword: formData.password, confirmPassword: formData.confirmPassword });
      setIsSuccess(true);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to reset password. The link may have expired.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: '#FF4D6D' };
    if (score <= 3) return { level: 2, label: 'Fair', color: '#FFA94D' };
    if (score === 4) return { level: 3, label: 'Good', color: '#69DB7C' };
    return { level: 4, label: 'Strong', color: '#51CF66' };
  };

  const strength = getStrength(formData.password);

  const BannerPanel = () => (
    <div className="login-banner">
      <div className="login-banner-blob login-banner-blob--1" />
      <div className="login-banner-blob login-banner-blob--2" />
      <div className="login-banner-blob login-banner-blob--3" />
      <div className="login-banner-content">
        <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="login-banner-logo" />
        <p className="login-banner-tagline">Invest. Grow. Repeat.</p>
        <p className="login-banner-desc">Create a strong, unique password to keep your investment account secure.</p>
        <ul className="login-banner-features">
          <li>
            <span className="feature-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9D6FFF" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>At least 8 characters long</span>
          </li>
          <li>
            <span className="feature-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Mix uppercase, numbers and symbols</span>
          </li>
          <li>
            <span className="feature-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Never share your password</span>
          </li>
        </ul>
      </div>
    </div>
  );

  if (isSuccess) {
    return (
      <div className="login-container">
        <BannerPanel />
        <div className="login-right">
          <div className="login-header">
            <Link to="/login" className="login-back" aria-label="Go to login">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="login-branding">
            <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="login-logo" />
            <p className="login-tagline">Invest. Grow. Repeat.</p>
          </div>
          <div className="login-content">
            <div className="login-card" style={{ textAlign: 'center' }}>
              <div className="fp-success-icon" style={{ background: 'linear-gradient(135deg, #2f9e44 0%, #51cf66 100%)' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="login-title" style={{ marginTop: 0 }}>Password Reset!</h2>
              <p className="login-subtitle" style={{ marginBottom: '32px' }}>
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <Link to="/login" className="login-submit-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <BannerPanel />
      <div className="login-right">
        <div className="login-header">
          <Link to="/login" className="login-back" aria-label="Back to login">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
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
            <h2 className="login-title">Reset Password</h2>
            <p className="login-subtitle">Choose a new secure password for your account.</p>

            {errors.form && (
              <div className="login-error-banner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="login-form-group">
                <label htmlFor="rp-password" className="login-label">New Password</label>
                <div className="login-password-wrapper">
                  <input
                    id="rp-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`login-input${errors.password ? ' error' : ''}`}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="rp-strength">
                    <div className="rp-strength__bars">
                      {[1, 2, 3, 4].map(n => (
                        <div key={n} className="rp-strength__bar" style={{ background: n <= strength.level ? strength.color : 'rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                    <span className="rp-strength__label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
                {errors.password && <span className="login-field-error">{errors.password}</span>}
              </div>

              <div className="login-form-group">
                <label htmlFor="rp-confirm" className="login-label">Confirm New Password</label>
                <div className="login-password-wrapper">
                  <input
                    id="rp-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`login-input${errors.confirmPassword ? ' error' : ''}`}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirm(p => !p)}>
                    {showConfirm ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <span className="login-field-error">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><span className="login-spinner" /><span>Resetting...</span></>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Reset Password
                  </>
                )}
              </button>

              <Link to="/login" className="login-forgot-link">
                Back to Sign In
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
