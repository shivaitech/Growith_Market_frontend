import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authTokenState, userState, login as loginAction } from '../../recoil/auth';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import FormInput from '../../components/FormInput';
import authService from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const setAuthToken = useSetRecoilState(authTokenState);
  const setUser = useSetRecoilState(userState);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailApiValidated, setEmailApiValidated] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // null | 'valid' | 'not-found' | 'invalid-format'
  const emailDebounceRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'email') {
      setEmailApiValidated(false);
      setEmailStatus(null);
      setEmailValidating(false);
    }
  };

  // Debounced email validation — fires 700ms after user stops typing
  useEffect(() => {
    const email = formData.email;
    if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);

    if (!email) {
      setEmailStatus(null);
      setEmailValidating(false);
      setEmailApiValidated(false);
      return;
    }

    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidFormat) {
      setEmailStatus('invalid-format');
      setEmailValidating(false);
      setEmailApiValidated(false);
      return;
    }

    setEmailStatus(null);
    setEmailValidating(true);
    setEmailApiValidated(false);

    emailDebounceRef.current = setTimeout(async () => {
      try {
        await authService.validateEmail(email);
        setEmailStatus('valid');
        setEmailApiValidated(true);
        setErrors(prev => ({ ...prev, email: '' }));
      } catch (err) {
        const msg = err?.message?.toLowerCase() || '';
        const isNotFound = msg.includes('email not found') || msg.includes('not found');
        setEmailStatus('not-found');
        setEmailApiValidated(false);
        setErrors(prev => ({
          ...prev,
          email: isNotFound
            ? 'Email not registered. Please sign up first.'
            : 'Unable to verify email. Please try again.',
        }));
      } finally {
        setEmailValidating(false);
      }
    }, 700);

    return () => clearTimeout(emailDebounceRef.current);
  }, [formData.email]);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await loginAction(setAuthToken, setUser, formData);
      setToast({ isOpen: true, message: 'Login successful! Redirecting to dashboard...', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setModal({ isOpen: true, title: 'Login Failed', message: error.message || 'Invalid email or password. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="login-container">

      {/* ── Left Banner (desktop only) ── */}
      <div className="login-banner">
        <div className="login-banner-blob login-banner-blob--1"></div>
        <div className="login-banner-blob login-banner-blob--2"></div>
        <div className="login-banner-blob login-banner-blob--3"></div>

        <div className="login-banner-content">
          <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="login-banner-logo" />
          <p className="login-banner-tagline">Invest. Grow. Repeat.</p>
          <p className="login-banner-desc">
            Join thousands of investors growing their portfolio with smart, data-driven insights.
          </p>

          <ul className="login-banner-features">
            <li>
              <span className="feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 7 22 7 22 13" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span>Real-time market analytics</span>
            </li>
            <li>
              <span className="feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#9D6FFF" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span>Enterprise-grade security</span>
            </li>
            <li>
              <span className="feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#9D6FFF" strokeWidth="2"/><path d="M8 21h8M12 17v4" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
              <span>Smart portfolio management</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="login-right">
        {/* Header */}
        <div className="login-header">
          <button className="login-back" onClick={() => navigate(-1)} aria-label="Go back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="login-header-right">
            <span className="login-header-text">Don't have an account?</span>
            <Link to="/onboarding" className="login-header-link">Get Started</Link>
          </div>
        </div>

        {/* Logo/Branding — visible on mobile only */}
        <div className="login-branding">
          <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="login-logo" />
          <p className="login-tagline">Invest. Grow. Repeat.</p>
        </div>

        {/* Content Card */}
        <div className="login-content">
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Enter your details below</p>



          <form onSubmit={handleSubmit} className="login-form">
<FormInput
  label="Email Address"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  validating={emailValidating}
  isValid={emailApiValidated}
  emailStatus={emailStatus}
  placeholder="nicholas@ergemia.com"
  error={errors.email}
  realTimeValidation={(value) => {
    if (!value) return null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
    return null;
  }}
  autoComplete="email"
/>

<FormInput
  label="Password"
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="••••••••••••••••"
  error={errors.password}
  showPasswordToggle={true}
  realTimeValidation={(value) => {
    if (!value) return null;
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  }}
  autoComplete="current-password"
/>

            {/* Submit Button */}
            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="login-spinner"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Forgot Password */}
            <Link to="/forgot-password" className="login-forgot-link">
              Forgot your password?
            </Link>
          </form>

        </div>{/* end login-card */}
        </div>{/* end login-content */}
      </div>{/* end login-right */}
      <Modal {...modal} onClose={() => setModal(prev => ({ ...prev, isOpen: false }))} />
      <Toast {...toast} onClose={() => setToast(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
};

export default Login;
