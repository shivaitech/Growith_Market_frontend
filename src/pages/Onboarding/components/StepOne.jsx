import { useState } from 'react';

export default function StepOne({ formData, updateFormData, nextStep }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';

    // Check if user is at least 18 years old
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

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
        <h2 className="step-title">Personal Information</h2>
        <p className="step-subtitle">Let's start with your basic details</p>
      </div>

      <div className="form-container">
        {/* First Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="firstName">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
          />
          {errors.firstName && <span className="form-error">{errors.firstName}</span>}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="lastName">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
          />
          {errors.lastName && <span className="form-error">{errors.lastName}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label className="form-label" htmlFor="dateOfBirth">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dateOfBirth && <span className="form-error">{errors.dateOfBirth}</span>}
        </div>

        {/* Nationality */}
        <div className="form-group">
          <label className="form-label" htmlFor="nationality">
            Nationality *
          </label>
          <select
            id="nationality"
            className={`form-input ${errors.nationality ? 'error' : ''}`}
            value={formData.nationality}
            onChange={(e) => updateFormData('nationality', e.target.value)}
          >
            <option value="">Select your nationality</option>
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
          {errors.nationality && <span className="form-error">{errors.nationality}</span>}
        </div>
      </div>

      {/* Info Box */}
      <div className="info-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>Your information is encrypted and secure. We comply with GDPR and EU data protection regulations.</p>
      </div>

      {/* Continue Button */}
      <button className="btn-primary btn-full" onClick={handleContinue}>
        Continue
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
