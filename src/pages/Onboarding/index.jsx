import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authTokenState, userState } from '../../recoil/auth';
import authService from '../../services/authService';
import ProgressBar from './components/ProgressBar';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';

const STEP_LABELS = ['Create Account', 'Verify Email', 'Complete Profile'];

export default function Onboarding() {
  const navigate = useNavigate();
  const setAuthToken = useSetRecoilState(authTokenState);
  const setUser = useSetRecoilState(userState);

  const [currentStep, setCurrentStep] = useState(1);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const goNext = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called by StepOne after successful register
  const handleRegistered = (email) => {
    setRegisteredEmail(email);
    goNext();
  };

  // Called by StepTwo after successful email verification
  const handleVerified = (token, user) => {
    setAuthToken(token);
    setUser(user);
    authService.setToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    goNext();
  };

  // Called by StepThree when KYC is submitted or skipped
  const handleDone = () => {
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onRegistered={handleRegistered} />;
      case 2:
        return <StepTwo email={registeredEmail} onVerified={handleVerified} />;
      case 3:
        return <StepThree onDone={handleDone} />;
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
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        {/* Step Content */}
        <div className="ob-content">
          {renderStep()}
        </div>

      </div>
    </div>
  );
}
