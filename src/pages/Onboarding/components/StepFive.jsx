import { useState } from 'react';

export default function StepFive({ formData, updateFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.sourceOfFunds) newErrors.sourceOfFunds = 'Source of funds is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.purposeOfInvestment) newErrors.purposeOfInvestment = 'Purpose of investment is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2 className="step-title">Financial Information</h2>
        <p className="step-subtitle">Required for compliance and anti-money laundering</p>
      </div>

      <div className="form-container">
        {/* Source of Funds */}
        <div className="form-group">
          <label className="form-label">
            Source of Funds *
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="sourceOfFunds"
                value="employment"
                checked={formData.sourceOfFunds === 'employment'}
                onChange={(e) => updateFormData('sourceOfFunds', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Employment Income</span>
                <span className="radio-desc">Salary or wages</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="sourceOfFunds"
                value="business"
                checked={formData.sourceOfFunds === 'business'}
                onChange={(e) => updateFormData('sourceOfFunds', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Business Revenue</span>
                <span className="radio-desc">Self-employment or business profits</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="sourceOfFunds"
                value="investments"
                checked={formData.sourceOfFunds === 'investments'}
                onChange={(e) => updateFormData('sourceOfFunds', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Investment Returns</span>
                <span className="radio-desc">Dividends, capital gains, etc.</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="sourceOfFunds"
                value="savings"
                checked={formData.sourceOfFunds === 'savings'}
                onChange={(e) => updateFormData('sourceOfFunds', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Savings</span>
                <span className="radio-desc">Personal savings accumulated over time</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="sourceOfFunds"
                value="inheritance"
                checked={formData.sourceOfFunds === 'inheritance'}
                onChange={(e) => updateFormData('sourceOfFunds', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Inheritance / Gift</span>
                <span className="radio-desc">Received from family or estate</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="sourceOfFunds"
                value="other"
                checked={formData.sourceOfFunds === 'other'}
                onChange={(e) => updateFormData('sourceOfFunds', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Other</span>
                <span className="radio-desc">Other legitimate sources</span>
              </div>
            </label>
          </div>
          {errors.sourceOfFunds && <span className="form-error">{errors.sourceOfFunds}</span>}
        </div>

        {/* Occupation */}
        <div className="form-group">
          <label className="form-label" htmlFor="occupation">
            Current Occupation *
          </label>
          <input
            type="text"
            id="occupation"
            className={`form-input ${errors.occupation ? 'error' : ''}`}
            placeholder="e.g., Software Engineer, Business Owner"
            value={formData.occupation}
            onChange={(e) => updateFormData('occupation', e.target.value)}
          />
          {errors.occupation && <span className="form-error">{errors.occupation}</span>}
        </div>

        {/* Employer (Optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="employer">
            Employer (Optional)
          </label>
          <input
            type="text"
            id="employer"
            className="form-input"
            placeholder="Company name"
            value={formData.employer}
            onChange={(e) => updateFormData('employer', e.target.value)}
          />
        </div>

        {/* Purpose of Investment */}
        <div className="form-group">
          <label className="form-label" htmlFor="purposeOfInvestment">
            Purpose of Investment *
          </label>
          <select
            id="purposeOfInvestment"
            className={`form-input ${errors.purposeOfInvestment ? 'error' : ''}`}
            value={formData.purposeOfInvestment}
            onChange={(e) => updateFormData('purposeOfInvestment', e.target.value)}
          >
            <option value="">Select purpose</option>
            <option value="long-term-growth">Long-term Capital Growth</option>
            <option value="retirement">Retirement Planning</option>
            <option value="portfolio-diversification">Portfolio Diversification</option>
            <option value="passive-income">Generate Passive Income</option>
            <option value="wealth-preservation">Wealth Preservation</option>
            <option value="innovation-access">Access to Innovation</option>
            <option value="other">Other</option>
          </select>
          {errors.purposeOfInvestment && <span className="form-error">{errors.purposeOfInvestment}</span>}
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="info-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>This information is required under EU Anti-Money Laundering (AML) regulations to prevent financial crimes.</p>
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="btn-secondary btn-half" onClick={prevStep}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <button className="btn-primary btn-half" onClick={handleContinue}>
          Continue
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
