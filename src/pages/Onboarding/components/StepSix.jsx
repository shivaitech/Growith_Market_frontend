import { useState } from 'react';

export default function StepSix({ formData, updateFormData, handleSubmit, prevStep }) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the privacy policy';
    if (!formData.kycAccepted) newErrors.kycAccepted = 'You must accept the KYC/AML requirements';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        await handleSubmit();
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2 className="step-title">Terms & Agreements</h2>
        <p className="step-subtitle">Please review and accept the following</p>
      </div>

      <div className="form-container">
        {/* Review Summary */}
        <div className="summary-box">
          <h3 className="summary-title">Application Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Name</span>
              <span className="summary-value">{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Email</span>
              <span className="summary-value">{formData.email}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Phone</span>
              <span className="summary-value">{formData.phone}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Location</span>
              <span className="summary-value">{formData.city}, {formData.country}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Experience</span>
              <span className="summary-value" style={{ textTransform: 'capitalize' }}>
                {formData.investmentExperience}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">ID Type</span>
              <span className="summary-value" style={{ textTransform: 'capitalize' }}>
                {formData.idType?.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="form-group">
          <label className={`checkbox-agreement ${errors.termsAccepted ? 'error' : ''}`}>
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
            />
            <div className="checkbox-agreement-content">
              <span className="checkbox-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <p>
                I have read and agree to the{' '}
                <a href="/terms" target="_blank" className="agreement-link">
                  Terms and Conditions
                </a>
              </p>
            </div>
          </label>
          {errors.termsAccepted && <span className="form-error">{errors.termsAccepted}</span>}
        </div>

        {/* Privacy Policy */}
        <div className="form-group">
          <label className={`checkbox-agreement ${errors.privacyAccepted ? 'error' : ''}`}>
            <input
              type="checkbox"
              checked={formData.privacyAccepted}
              onChange={(e) => updateFormData('privacyAccepted', e.target.checked)}
            />
            <div className="checkbox-agreement-content">
              <span className="checkbox-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <p>
                I have read and agree to the{' '}
                <a href="/privacy" target="_blank" className="agreement-link">
                  Privacy Policy
                </a>{' '}
                and consent to data processing
              </p>
            </div>
          </label>
          {errors.privacyAccepted && <span className="form-error">{errors.privacyAccepted}</span>}
        </div>

        {/* KYC/AML Acknowledgment */}
        <div className="form-group">
          <label className={`checkbox-agreement ${errors.kycAccepted ? 'error' : ''}`}>
            <input
              type="checkbox"
              checked={formData.kycAccepted}
              onChange={(e) => updateFormData('kycAccepted', e.target.checked)}
            />
            <div className="checkbox-agreement-content">
              <span className="checkbox-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <p>
                I acknowledge and consent to KYC/AML verification procedures in compliance with EU regulations
              </p>
            </div>
          </label>
          {errors.kycAccepted && <span className="form-error">{errors.kycAccepted}</span>}
        </div>
      </div>

      {/* Final Notice */}
      <div className="info-box security">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="security-title">What happens next?</p>
          <p>Your application will be reviewed within 24-48 hours. You'll receive an email notification once verification is complete.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="btn-secondary btn-half" onClick={prevStep} disabled={isSubmitting}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <button 
          className="btn-primary btn-half" 
          onClick={handleFinalSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
