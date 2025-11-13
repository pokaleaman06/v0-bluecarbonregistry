import type { ReactNode } from "react"
import { TrendingUp } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  trend?: number
  icon?: ReactNode
  className?: string
}

export function StatCard({ label, value, trend, icon, className = "" }: StatCardProps) {
  return (
    <div className={`cs-card p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{value}</p>
        </div>
        {icon && <div className="p-3 bg-primary/10 rounded-lg">{icon}</div>}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp className="w-3 h-3 text-success" />
          <span className="text-success font-semibold">{trend}% from last month</span>
        </div>
      )}
    </div>
  )
}
