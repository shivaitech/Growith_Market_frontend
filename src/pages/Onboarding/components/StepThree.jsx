import { useState } from 'react';

export default function StepThree({ formData, updateFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});

  const investmentGoalOptions = [
    { id: 'capital-growth', label: 'Capital Growth' },
    { id: 'income', label: 'Regular Income' },
    { id: 'diversification', label: 'Portfolio Diversification' },
    { id: 'innovation', label: 'Access to Innovation' },
  ];

  const toggleInvestmentGoal = (goalId) => {
    const currentGoals = formData.investmentGoals || [];
    if (currentGoals.includes(goalId)) {
      updateFormData('investmentGoals', currentGoals.filter(g => g !== goalId));
    } else {
      updateFormData('investmentGoals', [...currentGoals, goalId]);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.investmentExperience) newErrors.investmentExperience = 'Investment experience is required';
    if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required';
    if (!formData.netWorth) newErrors.netWorth = 'Net worth is required';
    if (!formData.investmentGoals || formData.investmentGoals.length === 0) {
      newErrors.investmentGoals = 'Please select at least one investment goal';
    }
    if (!formData.riskTolerance) newErrors.riskTolerance = 'Risk tolerance is required';

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
        <h2 className="step-title">Investment Profile</h2>
        <p className="step-subtitle">Help us understand your investment experience</p>
      </div>

      <div className="form-container">
        {/* Investment Experience */}
        <div className="form-group">
          <label className="form-label">
            Investment Experience *
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="investmentExperience"
                value="beginner"
                checked={formData.investmentExperience === 'beginner'}
                onChange={(e) => updateFormData('investmentExperience', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Beginner</span>
                <span className="radio-desc">Less than 1 year</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="investmentExperience"
                value="intermediate"
                checked={formData.investmentExperience === 'intermediate'}
                onChange={(e) => updateFormData('investmentExperience', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Intermediate</span>
                <span className="radio-desc">1-5 years</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="investmentExperience"
                value="experienced"
                checked={formData.investmentExperience === 'experienced'}
                onChange={(e) => updateFormData('investmentExperience', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Experienced</span>
                <span className="radio-desc">5+ years</span>
              </div>
            </label>
          </div>
          {errors.investmentExperience && <span className="form-error">{errors.investmentExperience}</span>}
        </div>

        {/* Annual Income */}
        <div className="form-group">
          <label className="form-label" htmlFor="annualIncome">
            Annual Income (USD) *
          </label>
          <select
            id="annualIncome"
            className={`form-input ${errors.annualIncome ? 'error' : ''}`}
            value={formData.annualIncome}
            onChange={(e) => updateFormData('annualIncome', e.target.value)}
          >
            <option value="">Select annual income</option>
            <option value="0-50k">$0 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-250k">$100,000 - $250,000</option>
            <option value="250k-500k">$250,000 - $500,000</option>
            <option value="500k+">$500,000+</option>
          </select>
          {errors.annualIncome && <span className="form-error">{errors.annualIncome}</span>}
        </div>

        {/* Net Worth */}
        <div className="form-group">
          <label className="form-label" htmlFor="netWorth">
            Estimated Net Worth (USD) *
          </label>
          <select
            id="netWorth"
            className={`form-input ${errors.netWorth ? 'error' : ''}`}
            value={formData.netWorth}
            onChange={(e) => updateFormData('netWorth', e.target.value)}
          >
            <option value="">Select net worth</option>
            <option value="0-100k">$0 - $100,000</option>
            <option value="100k-500k">$100,000 - $500,000</option>
            <option value="500k-1m">$500,000 - $1,000,000</option>
            <option value="1m-5m">$1,000,000 - $5,000,000</option>
            <option value="5m+">$5,000,000+</option>
          </select>
          {errors.netWorth && <span className="form-error">{errors.netWorth}</span>}
        </div>

        {/* Investment Goals */}
        <div className="form-group">
          <label className="form-label">
            Investment Goals * <span className="label-note">(Select all that apply)</span>
          </label>
          <div className="checkbox-group">
            {investmentGoalOptions.map(goal => (
              <label key={goal.id} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={(formData.investmentGoals || []).includes(goal.id)}
                  onChange={() => toggleInvestmentGoal(goal.id)}
                />
                <span className="checkbox-label">{goal.label}</span>
                <svg className="checkbox-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </label>
            ))}
          </div>
          {errors.investmentGoals && <span className="form-error">{errors.investmentGoals}</span>}
        </div>

        {/* Risk Tolerance */}
        <div className="form-group">
          <label className="form-label">
            Risk Tolerance *
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="riskTolerance"
                value="conservative"
                checked={formData.riskTolerance === 'conservative'}
                onChange={(e) => updateFormData('riskTolerance', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Conservative</span>
                <span className="radio-desc">Prefer stability over growth</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="riskTolerance"
                value="moderate"
                checked={formData.riskTolerance === 'moderate'}
                onChange={(e) => updateFormData('riskTolerance', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Moderate</span>
                <span className="radio-desc">Balanced approach</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="riskTolerance"
                value="aggressive"
                checked={formData.riskTolerance === 'aggressive'}
                onChange={(e) => updateFormData('riskTolerance', e.target.value)}
              />
              <div className="radio-content">
                <span className="radio-title">Aggressive</span>
                <span className="radio-desc">Seeking high growth potential</span>
              </div>
            </label>
          </div>
          {errors.riskTolerance && <span className="form-error">{errors.riskTolerance}</span>}
        </div>
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
