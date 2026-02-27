import { useState } from 'react';

export default function StepFour({ formData, updateFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({
    idFrontImage: formData.idFrontImage,
    idBackImage: formData.idBackImage,
    selfieImage: formData.selfieImage,
  });

  const handleFileUpload = (field, file) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [field]: 'File size must be less than 5MB' }));
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [field]: 'Only JPEG, PNG, and WebP images are allowed' }));
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);

      updateFormData(field, file);
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const removeFile = (field) => {
    updateFormData(field, null);
    setPreviews(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.idType) newErrors.idType = 'ID type is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    if (!formData.idFrontImage) newErrors.idFrontImage = 'Front of ID is required';
    if (!formData.idBackImage) newErrors.idBackImage = 'Back of ID is required';
    if (!formData.selfieImage) newErrors.selfieImage = 'Selfie with ID is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      nextStep();
    }
  };

  const FileUploadBox = ({ field, label, description, preview, error }) => (
    <div className="file-upload-box">
      <label className="file-upload-label">{label}</label>
      {description && <p className="file-upload-desc">{description}</p>}
      
      {!preview ? (
        <label className={`file-upload-area ${error ? 'error' : ''}`}>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileUpload(field, e.target.files[0])}
            style={{ display: 'none' }}
          />
          <div className="file-upload-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="upload-text">Tap to upload</p>
            <p className="upload-hint">JPEG, PNG, or WebP (max 5MB)</p>
          </div>
        </label>
      ) : (
        <div className="file-preview">
          <img src={preview} alt={label} className="preview-image" />
          <button type="button" className="remove-file-btn" onClick={() => removeFile(field)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  );

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2 className="step-title">Identity Verification</h2>
        <p className="step-subtitle">Upload your identification documents</p>
      </div>

      <div className="form-container">
        {/* ID Type */}
        <div className="form-group">
          <label className="form-label" htmlFor="idType">
            Document Type *
          </label>
          <select
            id="idType"
            className={`form-input ${errors.idType ? 'error' : ''}`}
            value={formData.idType}
            onChange={(e) => updateFormData('idType', e.target.value)}
          >
            <option value="">Select document type</option>
            <option value="passport">Passport</option>
            <option value="national-id">National ID Card</option>
            <option value="drivers-license">Driver's License</option>
            <option value="residence-permit">Residence Permit</option>
          </select>
          {errors.idType && <span className="form-error">{errors.idType}</span>}
        </div>

        {/* ID Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="idNumber">
            Document Number *
          </label>
          <input
            type="text"
            id="idNumber"
            className={`form-input ${errors.idNumber ? 'error' : ''}`}
            placeholder="Enter document number"
            value={formData.idNumber}
            onChange={(e) => updateFormData('idNumber', e.target.value)}
          />
          {errors.idNumber && <span className="form-error">{errors.idNumber}</span>}
        </div>

        {/* Front of ID */}
        <FileUploadBox
          field="idFrontImage"
          label="Front of Document *"
          description="Clear photo of the front side"
          preview={previews.idFrontImage}
          error={errors.idFrontImage}
        />

        {/* Back of ID */}
        <FileUploadBox
          field="idBackImage"
          label="Back of Document *"
          description="Clear photo of the back side"
          preview={previews.idBackImage}
          error={errors.idBackImage}
        />

        {/* Selfie with ID */}
        <FileUploadBox
          field="selfieImage"
          label="Selfie with Document *"
          description="Take a selfie holding your ID next to your face"
          preview={previews.selfieImage}
          error={errors.selfieImage}
        />
      </div>

      {/* Security Notice */}
      <div className="info-box security">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <p className="security-title">Your documents are secure</p>
          <p>All uploads are encrypted end-to-end. We comply with GDPR and never share your data with third parties.</p>
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
