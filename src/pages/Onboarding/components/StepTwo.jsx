import { useState } from 'react';

export default function StepTwo({ formData, updateFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

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
        <h2 className="step-title">Residence Information</h2>
        <p className="step-subtitle">Where do you currently reside?</p>
      </div>

      <div className="form-container">
        {/* Country */}
        <div className="form-group">
          <label className="form-label" htmlFor="country">
            Country of Residence *
          </label>
          <select
            id="country"
            className={`form-input ${errors.country ? 'error' : ''}`}
            value={formData.country}
            onChange={(e) => updateFormData('country', e.target.value)}
          >
            <option value="">Select country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="IT">Italy</option>
            <option value="ES">Spain</option>
            <option value="NL">Netherlands</option>
            <option value="BE">Belgium</option>
            <option value="AT">Austria</option>
            <option value="CH">Switzerland</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.country && <span className="form-error">{errors.country}</span>}
        </div>

        {/* Address Line 1 */}
        <div className="form-group">
          <label className="form-label" htmlFor="address1">
            Address Line 1 *
          </label>
          <input
            type="text"
            id="address1"
            className={`form-input ${errors.address1 ? 'error' : ''}`}
            placeholder="Street address, P.O. box"
            value={formData.address1}
            onChange={(e) => updateFormData('address1', e.target.value)}
          />
          {errors.address1 && <span className="form-error">{errors.address1}</span>}
        </div>

        {/* Address Line 2 */}
        <div className="form-group">
          <label className="form-label" htmlFor="address2">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            id="address2"
            className="form-input"
            placeholder="Apartment, suite, unit, building, floor, etc."
            value={formData.address2}
            onChange={(e) => updateFormData('address2', e.target.value)}
          />
        </div>

        {/* City */}
        <div className="form-group">
          <label className="form-label" htmlFor="city">
            City *
          </label>
          <input
            type="text"
            id="city"
            className={`form-input ${errors.city ? 'error' : ''}`}
            placeholder="Enter your city"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
          />
          {errors.city && <span className="form-error">{errors.city}</span>}
        </div>

        {/* State/Province */}
        <div className="form-group">
          <label className="form-label" htmlFor="state">
            State / Province
          </label>
          <input
            type="text"
            id="state"
            className="form-input"
            placeholder="Enter state or province"
            value={formData.state}
            onChange={(e) => updateFormData('state', e.target.value)}
          />
        </div>

        {/* Postal Code */}
        <div className="form-group">
          <label className="form-label" htmlFor="postalCode">
            Postal Code *
          </label>
          <input
            type="text"
            id="postalCode"
            className={`form-input ${errors.postalCode ? 'error' : ''}`}
            placeholder="Enter postal code"
            value={formData.postalCode}
            onChange={(e) => updateFormData('postalCode', e.target.value)}
          />
          {errors.postalCode && <span className="form-error">{errors.postalCode}</span>}
        </div>
      </div>

      {/* Info Box */}
      <div className="info-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>We verify your address to comply with EU regulations and ensure secure delivery of documents.</p>
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
