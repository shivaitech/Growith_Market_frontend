import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './components/ProgressBar';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';
import StepFive from './components/StepFive';
import StepSix from './components/StepSix';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    
    // Step 2: Address & Residence
    country: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    
    // Step 3: Investment Profile
    investmentExperience: '',
    annualIncome: '',
    netWorth: '',
    investmentGoals: [],
    riskTolerance: '',
    
    // Step 4: Identity Verification
    idType: '',
    idNumber: '',
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
    
    // Step 5: Financial Information
    sourceOfFunds: '',
    occupation: '',
    employer: '',
    purposeOfInvestment: '',
    
    // Step 6: Terms & Agreements
    termsAccepted: false,
    privacyAccepted: false,
    kycAccepted: false,
  });

  const totalSteps = 6;

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: API call to submit onboarding data
      console.log('Submitting onboarding data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or dashboard
      navigate('/onboarding/success');
    } catch (error) {
      console.error('Onboarding submission error:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2:
        return <StepTwo formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <StepThree formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <StepFour formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <StepFive formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        return <StepSix formData={formData} updateFormData={updateFormData} handleSubmit={handleSubmit} prevStep={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      {/* Mobile App Header */}
      <div className="onboarding-header">
        <button className="onboarding-back" onClick={() => currentStep === 1 ? navigate(-1) : prevStep()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="onboarding-title">Create Profile</h1>
        <div className="onboarding-header-spacer"></div>
      </div>

      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      {/* Step Content */}
      <div className="onboarding-content">
        {renderStep()}
      </div>
    </div>
  );
}
