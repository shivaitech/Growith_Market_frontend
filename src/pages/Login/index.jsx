import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useGoogleLogin } from '@react-oauth/google';
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
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const response = await authService.googleLogin(tokenResponse.access_token);
        const { token, user } = response;
        setAuthToken(token);
        setUser(user);
        authService.setToken(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToast({ isOpen: true, message: 'Google sign-in successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (error) {
        setModal({ isOpen: true, title: 'Google Sign-In Failed', message: error.message || 'Failed to sign in with Google. Please try again.', type: 'error' });
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setModal({ isOpen: true, title: 'Google Sign-In Failed', message: 'Google authentication was cancelled or failed. Please try again.', type: 'error' });
    },
    flow: 'implicit',
  });

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

  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      googleLogin();
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

          {/* Divider */}
          <div className="login-divider">
            <span>Or sign in with</span>
          </div>

          {/* Social Login */}
          <div className="login-social">
            <button
              type="button"
              className={`social-btn${googleLoading ? ' social-btn--loading' : ''}`}
              onClick={() => handleSocialLogin('google')}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'fi-spin 0.75s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="social-btn"
              onClick={() => handleSocialLogin('facebook')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </div>{/* end login-card */}
        </div>{/* end login-content */}
      </div>{/* end login-right */}
      <Modal {...modal} onClose={() => setModal(prev => ({ ...prev, isOpen: false }))} />
      <Toast {...toast} onClose={() => setToast(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
};

export default Login;
