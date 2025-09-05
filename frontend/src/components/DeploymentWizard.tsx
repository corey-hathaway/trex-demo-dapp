import React, { useState } from 'react';
import { TrustedIssuersDeployment } from './TrustedIssuersDeployment';
import { ClaimTopicsDeployment } from './ClaimTopicsDeployment';
import { IdentityStorageDeployment } from './IdentityStorageDeployment';
import { IdentityRegistryDeployment } from './IdentityRegistryDeployment';
import { DefaultComplianceDeployment } from './DefaultComplianceDeployment';
import { TokenDeployment } from './TokenDeployment';

interface DeploymentStep {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<{ onComplete?: () => void }>;
  completed: boolean;
}

export const DeploymentWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: DeploymentStep[] = [
    {
      id: 1,
      title: "TrustedIssuers Registry",
      description: "Deploy the foundation contract for managing trusted claim issuers",
      component: TrustedIssuersDeployment,
      completed: completedSteps.includes(1)
    },
    {
      id: 2,
      title: "ClaimTopics Registry", 
      description: "Set up claim topic requirements for compliance",
      component: ClaimTopicsDeployment,
      completed: completedSteps.includes(2)
    },
    {
      id: 3,
      title: "Identity Storage",
      description: "Deploy persistent storage for identity verification data",
      component: IdentityStorageDeployment,
      completed: completedSteps.includes(3)
    },
    {
      id: 4,
      title: "Identity Registry",
      description: "Combine all identity management components",
      component: IdentityRegistryDeployment,
      completed: completedSteps.includes(4)
    },
    {
      id: 5,
      title: "Default Compliance",
      description: "Configure simple compliance rules for your token",
      component: DefaultComplianceDeployment,
      completed: completedSteps.includes(5)
    },
    {
      id: 6,
      title: "Token Contract",
      description: "Deploy your final ERC-3643 compliant token",
      component: TokenDeployment,
      completed: completedSteps.includes(6)
    }
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to completed steps or the next available step
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex + 1)) {
      setCurrentStep(stepIndex);
    }
  };

  const currentStepData = steps[currentStep];
  const CurrentComponent = currentStepData.component;

  return (
    <div className="deployment-wizard">
      {/* Progress Header */}
      <div className="wizard-header">
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="progress-text">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <h2 className="wizard-title">{currentStepData.title}</h2>
        <p className="wizard-description">{currentStepData.description}</p>
      </div>

      {/* Step Navigation */}
      <div className="step-navigation">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`step-indicator ${index === currentStep ? 'active' : ''} ${step.completed ? 'completed' : ''} ${index <= currentStep || step.completed ? 'clickable' : ''}`}
            onClick={() => handleStepClick(index)}
          >
            <div className="step-indicator-number">
              {step.completed ? '✓' : step.id}
            </div>
            <div className="step-indicator-content">
              <div className="step-indicator-title">{step.title}</div>
              <div className="step-indicator-description">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="wizard-content">
        <CurrentComponent onComplete={() => handleStepComplete(currentStepData.id)} />
      </div>

      {/* Navigation Buttons */}
      <div className="wizard-navigation">
        <button 
          className="btn-secondary"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        
        <div className="wizard-progress">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index <= currentStep ? 'active' : ''} ${completedSteps.includes(index + 1) ? 'completed' : ''}`}
            />
          ))}
        </div>

        {currentStep < steps.length - 1 ? (
          <button 
            className="btn-primary"
            onClick={handleNext}
            disabled={!completedSteps.includes(currentStepData.id)}
          >
            Next Step
          </button>
        ) : (
          <button 
            className="btn-primary"
            disabled={!completedSteps.includes(currentStepData.id)}
          >
            Complete Deployment
          </button>
        )}
      </div>
    </div>
  );
};
