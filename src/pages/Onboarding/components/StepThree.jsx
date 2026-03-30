import { useState } from 'react';
import FormInput from '../../../components/FormInput';
import authService from '../../../services/authService';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Bolivia',
  'Bosnia and Herzegovina','Brazil','Bulgaria','Cambodia','Canada','Chile','China',
  'Colombia','Croatia','Cyprus','Czech Republic','Denmark','Ecuador','Egypt','Estonia',
  'Finland','France','Georgia','Germany','Ghana','Greece','Hungary','India','Indonesia',
  'Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan','Kazakhstan','Kenya',
  'Kuwait','Latvia','Lebanon','Libya','Lithuania','Luxembourg','Malaysia','Malta',
  'Mexico','Moldova','Morocco','Netherlands','New Zealand','Nigeria','Norway','Pakistan',
  'Palestine','Panama','Peru','Philippines','Poland','Portugal','Qatar','Romania',
  'Russia','Saudi Arabia','Serbia','Singapore','Slovakia','Slovenia','South Africa',
  'South Korea','Spain','Sri Lanka','Sweden','Switzerland','Syria','Taiwan','Thailand',
  'Tunisia','Turkey','UAE','Ukraine','United Kingdom','United States','Uruguay',
  'Uzbekistan','Venezuela','Vietnam','Yemen'
];

export default function StepThree({ onDone }) {
  const [formData, setFormData] = useState({
    phone: '', dateOfBirth: '', nationality: '', country: '', address: '', city: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    if (!formData.nationality) errs.nationality = 'Nationality is required';
    if (!formData.country) errs.country = 'Country of residence is required';
    if (!formData.address.trim()) errs.address = 'Address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      await authService.submitKyc(formData);
      onDone();
    } catch (err) {
      setApiError(err.message || 'Failed to save your details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ob-step">
      <div className="ob-step-head">
        <h2 className="ob-step-title">Complete your profile</h2>
        <p className="ob-step-sub">
          This information helps us verify your identity. You can skip and do this later.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
          error={errors.phone}
        />
        <FormInput
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={errors.dateOfBirth}
          max={new Date().toISOString().split('T')[0]}
        />

        <div className="login-form-group">
          <label className="login-label" htmlFor="nationality">Nationality</label>
          <select
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className={`login-input${errors.nationality ? ' error' : ''}`}
          >
            <option value="">Select nationality</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.nationality && <span className="login-error-msg">{errors.nationality}</span>}
        </div>

        <div className="login-form-group">
          <label className="login-label" htmlFor="country">Country of Residence</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`login-input${errors.country ? ' error' : ''}`}
          >
            <option value="">Select country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <span className="login-error-msg">{errors.country}</span>}
        </div>

        <FormInput
          label="Address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address"
          error={errors.address}
        />
        <FormInput
          label="City"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Your city"
          error={errors.city}
        />

        {apiError && <p className="ob-api-error">{apiError}</p>}

        <button
          type="submit"
          className="login-submit-btn"
          disabled={isLoading}
          style={{ marginTop: 8 }}
        >
          {isLoading ? (
            <span className="login-spinner"></span>
          ) : (
            <>
              Save & Continue
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </form>

      <button
        type="button"
        className="ob-skip-btn"
        onClick={onDone}
        disabled={isLoading}
      >
        Skip for now, I'll do this later
      </button>
    </div>
  );
}
