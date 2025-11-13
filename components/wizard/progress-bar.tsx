interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      {/* Progress Line */}
      <div className="mb-6">
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                index < currentStep - 1
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep - 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-border text-muted-foreground"
              }`}
            >
              {index < currentStep - 1 ? "✓" : index + 1}
            </div>
            <span
              className={`text-xs font-medium text-center hidden sm:block ${
                index <= currentStep - 1 ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
