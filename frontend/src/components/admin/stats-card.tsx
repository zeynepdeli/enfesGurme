import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon,
  trend,
  trendUp
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">
              {title}
            </p>
            <p className="text-2xl font-bold">
              {value}
            </p>
            {trend && (
              <p className={`text-sm font-medium ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
