'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastStep: boolean;
  isLoading: boolean;
  onSubmit: () => void;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious,
  isLastStep,
  isLoading,
  onSubmit
}: WizardNavigationProps) {
  return (
    <div className="space-y-4">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                step === currentStep
                  ? 'bg-blue-600 text-white'
                  : step < currentStep
                  ? 'bg-blue-900/30 text-blue-300'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-8 h-0.5 mx-2 transition-colors ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isLoading}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <span className="text-sm text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>

        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Creating...' : 'Create Project'}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}