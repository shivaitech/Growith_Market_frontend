export default function ProgressBar({ currentStep, totalSteps }) {
  // 0% at start of step 1, advances after each completed step
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">Step {currentStep} of {totalSteps}</span>
        <span className="progress-percent">{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar-wrapper">
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
