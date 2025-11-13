import type { ReactNode } from "react"

interface WizardStepProps {
  title: string
  description?: string
  children: ReactNode
  isActive: boolean
  isCompleted?: boolean
  stepNumber: number
}

export function WizardStep({ title, description, children, isActive, isCompleted, stepNumber }: WizardStepProps) {
  return (
    <div className={`transition-all duration-300 ${isActive ? "block" : "hidden"}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}
