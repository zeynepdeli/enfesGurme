import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyStateCard } from './empty-state-card'

export interface TableColumn<T> {
  key: string
  label: string
  render: (item: T) => ReactNode
  width?: string
}

export interface TableAction<T> {
  label: string
  icon?: ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
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

interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  actions?: TableAction<T>[]
  emptyState?: EmptyState
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions = [],
  emptyState
}: DataTableProps<T>) {
  // Empty state kontrolü
  if (data.length === 0 && emptyState) {
    return <EmptyStateCard {...emptyState} />
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-muted/50 border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-sm font-semibold"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-sm font-semibold w-32">
                  İşlemler
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-muted/50 transition">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {column.render(item)}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      {actions.map((action, idx) => (
                        <Button
                          key={idx}
                          variant={action.variant || 'ghost'}
                          size="sm"
                          onClick={() => action.onClick(item)}
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
