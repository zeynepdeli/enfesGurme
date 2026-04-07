import { ReactNode } from 'react'
import { ShopHeader } from '@/components/shop/layout/shop-header'
import { ShopFooter } from '@/components/shop/layout/shop-footer'

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ShopHeader />
      
      <main className="flex-1">
        {children}
      </main>
      
      <ShopFooter />
    </div>
  )
}
