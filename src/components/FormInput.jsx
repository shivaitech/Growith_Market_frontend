import { useState, useEffect } from 'react';

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error: externalError,
  realTimeValidation,
  showPasswordToggle = false,
  validating = false,
  isValid = false,
  emailStatus = null, // null | 'valid' | 'not-found' | 'invalid-format'
  ...props
}) => {
  const [internalError, setInternalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const error = externalError || internalError;

  useEffect(() => {
    if (realTimeValidation && value) {
      const validationError = realTimeValidation(value);
      setInternalError(validationError || '');
    } else {
      setInternalError('');
    }
  }, [value, realTimeValidation]);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const showIndicator = (validating || isValid || emailStatus === 'not-found') && type !== 'password';

  // Border color based on email status
  const getBorderStyle = () => {
    if (type !== 'email' || !emailStatus) return {};
    if (emailStatus === 'valid') return { borderColor: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.12)' };
    if (emailStatus === 'not-found' || emailStatus === 'invalid-format') return {};
    return {};
  };

  return (
    <div className="login-form-group">
      {label && <label htmlFor={name} className="login-label">{label}</label>}
      <div style={{ position: 'relative' }} className={type === 'password' ? 'login-password-wrapper' : ''}>
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`login-input${error ? ' error' : ''}`}
          style={{ ...(showIndicator ? { paddingRight: '40px' } : {}), ...getBorderStyle() }}
          {...props}
        />

        {/* Password toggle */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        )}

        {/* Email API status indicator */}
        {showIndicator && (
          <div style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            {validating ? (
              <>
                <style>{`@keyframes fi-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  style={{ animation: 'fi-spin 0.75s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(157,111,255,0.25)" strokeWidth="2.5"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#9D6FFF" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </>
            ) : isValid ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/>
                <path d="M7 13l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : emailStatus === 'not-found' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#FF4D6D" strokeWidth="2"/>
                <path d="M15 9l-6 6M9 9l6 6" stroke="#FF4D6D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : null}
          </div>
        )}
      </div>
      {error && <span className="login-field-error">{error}</span>}
    </div>
  );
};

export default FormInput;