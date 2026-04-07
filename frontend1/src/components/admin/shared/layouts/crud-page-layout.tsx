import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface CrudPageLayoutProps {
  title: string
  description: string
  onCreateClick?: () => void  // ← Optional yaptık
  createButtonText?: string
  stats?: ReactNode
  children: ReactNode
}

export function CrudPageLayout({
  title,
  description,
  onCreateClick,
  createButtonText = 'Yeni Ekle',
  stats,
  children
}: CrudPageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        {onCreateClick && (
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            {createButtonText}
          </Button>
        )}
      </div>

      {/* Stats (optional) */}
      {stats && <div>{stats}</div>}

      {/* Content */}
      <div>{children}</div>
    </div>
  )
}
