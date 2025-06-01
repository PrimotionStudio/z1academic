import { StepIndicatorProps } from "@/types/StepIndicatorProp";
import { CheckCircle2 } from "lucide-react";

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Personal Information" },
    { number: 2, label: "Educational Information" },
    { number: 3, label: "Review & Submit" },
  ];

  return (
    <div className="flex justify-center">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm ${
                  currentStep >= step.number
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`w-20 h-0.5 mx-2 ${currentStep > index + 1 ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
