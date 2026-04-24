import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authTokenState, userState } from '../../recoil/auth';
import { setToken as ssSetToken, setUser as ssSetUser, setRefreshToken as ssSetRefreshToken } from '../../utils/secureStorage';
import authService from '../../services/authService';
import apiService from '../../services/apiService';
import ProgressBar from './components/ProgressBar';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';

const STEP_LABELS = ['Create Account', 'Verify Email'];

export default function Onboarding() {
  const navigate = useNavigate();
  const setAuthToken = useSetRecoilState(authTokenState);
  const setUser = useSetRecoilState(userState);

  const [currentStep, setCurrentStep] = useState(1);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentStep, showSuccess]);

  // Called by StepOne after successful register — silently log the user in
  const handleRegistered = (email, token, refresh, user) => {
    // Store auth data immediately so the user is logged in from this point on
    if (token) {
      setAuthToken(token);
      authService.setToken(token);
      ssSetToken(token);
    }
    if (refresh) ssSetRefreshToken(refresh);
    if (user) { setUser(user); ssSetUser(user); }
    setRegisteredEmail(email);
    setCurrentStep(2);
  };
  // Called by StepTwo after successful email verification — silently log the user in
  const handleVerified = (token, refresh, user) => {
    // 1. Persist to secure storage first (so ProtectedRoute reads it on navigate)
    if (token) ssSetToken(token);
    if (refresh) ssSetRefreshToken(refresh);
    if (user) ssSetUser(user);
    // 2. Set in-memory API clients
    if (token) {
      apiService.setToken(token);
      authService.setToken(token);
    }
    // 3. Seed Recoil atoms
    if (token) setAuthToken(token);
    if (user) setUser(user);
    // 4. Show success then navigate
    setShowSuccess(true);
    setTimeout(() => navigate('/dashboard/verification'), 3000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onRegistered={handleRegistered} />;
      case 2:
        return <StepTwo email={registeredEmail} onVerified={handleVerified} />;
      default:
        return null;
    }
  };

  return (
    <div className="ob-wrap">

      {/* ── Left Banner (desktop only) ── */}
      <div className="ob-banner">
        <div className="ob-banner-blob ob-banner-blob--1"></div>
        <div className="ob-banner-blob ob-banner-blob--2"></div>
        <div className="ob-banner-blob ob-banner-blob--3"></div>

        <div className="ob-banner-content">
          <img
            src="/assets/images/growith_logo_transparent.png"
            alt="Growith"
            className="ob-banner-logo"
          />
          <p className="ob-banner-tagline">Invest. Grow. Repeat.</p>
          <p className="ob-banner-desc">
            Create your account and start growing your portfolio with Growith.
          </p>

          <ul className="ob-banner-steps">
            {STEP_LABELS.map((label, i) => (
              <li
                key={i}
                className={`ob-banner-step ${
                  i + 1 < currentStep ? 'is-done' :
                  i + 1 === currentStep ? 'is-active' : ''
                }`}
              >
                <span className="ob-banner-step-num">
                  {i + 1 < currentStep ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (i + 1)}
                </span>
                <span className="ob-banner-step-label">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="ob-right">

        {/* Header */}
        <div className="ob-header">
          <button
            className="ob-back"
            onClick={() => currentStep === 1 ? navigate('/login') : setCurrentStep(prev => prev - 1)}
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <img src="/assets/images/growith_logo_transparent.png" alt="Growith" className="ob-header-logo" />
          <div style={{ width: 40 }}></div>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={2} />

        {/* Step Content */}
        <div className="ob-content">
          {showSuccess ? (
            <div className="ob-success-screen">
              <div className="ob-success-icon">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" stroke="#9D6FFF" strokeWidth="1.5"/>
                  <path d="M7 12l3.5 3.5L17 8" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="ob-success-title">You're all set! 🎉</h2>
              <p className="ob-success-msg">Your account has been created successfully. Taking you to the dashboard to complete your KYC verification…</p>
              <div className="ob-success-spinner"></div>
            </div>
          ) : renderStep()}
        </div>

      </div>
    </div>
  );
}
