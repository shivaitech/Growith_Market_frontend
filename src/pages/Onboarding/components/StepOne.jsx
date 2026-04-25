import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../../../components/FormInput';
import authService from '../../../services/authService';
import apiService from '../../../services/apiService';

const PASSWORD_RULES = [
  { id: 'len',   label: '8+ characters',                      test: p => p.length >= 8 },
  { id: 'lower', label: 'Include a lowercase letter',         test: p => /[a-z]/.test(p) },
  { id: 'upper', label: 'Include an uppercase letter',        test: p => /[A-Z]/.test(p) },
  { id: 'num',   label: 'Include a number',                   test: p => /\d/.test(p) },
  { id: 'spec',  label: 'Include a special character (@, #, $, etc.)', test: p => /[@#$!%*?&^()_\-+=\[\]{};':"\\|,.<>\/`~]/.test(p) },
];

export default function StepOne({ onRegistered }) {
  const [formData, setFormData] = useState({ email: '', fullName: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [pwFocused, setPwFocused] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (!/^[a-zA-Z\s'\-\.]{2,80}$/.test(formData.fullName.trim())) {
      errs.fullName = 'Name can only contain letters, spaces, hyphens and apostrophes';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errs.password = 'Must include uppercase, lowercase and a number';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      const response = await authService.register({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      // Extract auth data from register response
      const token   = response?.data?.tokens?.accessToken  || response?.token  || '';
      const refresh = response?.data?.tokens?.refreshToken || response?.refreshToken || '';
      const user    = response?.data?.user || response?.user || null;
      // Set token on API client so /send-email-verification works
      if (token) apiService.setToken(token);
      // Trigger verification email
      await authService.sendEmailVerification(formData.email);
      // Pass all auth data up so Onboarding can silently log the user in
      onRegistered(formData.email, token, refresh, user);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ob-step">
      <div className="ob-step-head">
        <h2 className="ob-step-title">Create your account</h2>
        <p className="ob-step-sub">Join thousands of investors on Growith</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.fullName}
          maxLength={80}
        />
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min. 8 characters"
          error={errors.password}
          showPasswordToggle
          onFocus={() => setPwFocused(true)}
          onBlur={() => setPwFocused(false)}
        />
        {(pwFocused || formData.password) && (
          <ul className="ob-pw-rules">
            {PASSWORD_RULES.map(rule => {
              const passed = rule.test(formData.password);
              return (
                <li key={rule.id} className={`ob-pw-rule ${passed ? 'ob-pw-rule--pass' : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    {passed
                      ? <><circle cx="12" cy="12" r="11" fill="#22c55e"/><polyline points="7 12 10.5 15.5 17 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></>
                      : <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5"/>
                    }
                  </svg>
                  {rule.label}
                </li>
              );
            })}
          </ul>
        )}
        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          error={errors.confirmPassword}
          showPasswordToggle
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
              Create Account
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </form>

      <p className="ob-alt-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
