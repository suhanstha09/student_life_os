'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useAuth } from '../lib/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const next = pathname && pathname !== '/login' ? `?next=${pathname}` : ''
      router.replace(`/login${next}`)
    }
  }, [loading, isAuthenticated, pathname, router])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-neutral-500">
        Loading your workspace...
      </div>
    )
  }

  return <>{children}</>
}
