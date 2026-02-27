import { Link } from 'react-router-dom';

const OnboardingSuccess = () => {
  return (
    <div className="onboarding-container">
      <div className="success-wrapper">
        <div className="success-content">
          {/* Success Icon */}
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
          </div>

          {/* Success Message */}
          <div className="success-header">
            <h1 className="success-title">Application Submitted!</h1>
            <p className="success-subtitle">
              Your investor profile has been successfully submitted for review.
            </p>
          </div>

          {/* Status Info */}
          <div className="success-info-box">
            <div className="info-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <p className="info-label">Review Time</p>
                <p className="info-value">24-48 hours</p>
              </div>
            </div>

            <div className="info-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <p className="info-label">We'll Contact You</p>
                <p className="info-value">Via email & phone</p>
              </div>
            </div>

            <div className="info-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
              <div>
                <p className="info-label">Next Steps</p>
                <p className="info-value">Access granted upon approval</p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="success-steps">
            <h3 className="steps-title">What Happens Next?</h3>
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <p className="step-title">Verification Review</p>
                <p className="step-desc">Our compliance team will review your documents and information.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <p className="step-title">Email Notification</p>
                <p className="step-desc">You'll receive an email once your profile is approved.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <p className="step-title">Start Investing</p>
                <p className="step-desc">Access exclusive AI token sales and investment opportunities.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="success-actions">
            <Link to="/nft" className="btn-primary btn-full">
              Browse Marketplace
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/" className="btn-secondary btn-full">
              Return to Home
            </Link>
          </div>

          {/* Support Info */}
          <div className="success-footer">
            <p>Questions about your application?</p>
            <Link to="/contact" className="contact-link">
              Contact Support
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;
