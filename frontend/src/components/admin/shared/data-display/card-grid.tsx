import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyStateCard } from './empty-state-card'

export interface GridColumn<T> {
  key: string
  render: (item: T) => ReactNode
}

export interface GridAction<T> {
  label: string
  icon?: ReactNode
  variant?: 'default' | 'destructive' | 'outline'
  onClick: (item: T) => void
}

interface EmptyState {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface CardGridProps<T> {
  data: T[]
  columns: GridColumn<T>[]
  actions?: GridAction<T>[]
  emptyState?: EmptyState
}

export function CardGrid<T extends { id: string }>({
  data,
  columns,
  actions = [],
  emptyState
}: CardGridProps<T>) {
  // Empty state kontrolü
  if (data.length === 0 && emptyState) {
    return <EmptyStateCard {...emptyState} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Columns */}
              {columns.map((column) => (
                <div key={column.key}>
                  {column.render(item)}
                </div>
              ))}
              
              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex gap-2 pt-4 border-t">
                  {actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant={action.variant || 'outline'}
                      size="sm"
                      onClick={() => action.onClick(item)}
                      className={idx === 0 ? 'flex-1' : ''}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
