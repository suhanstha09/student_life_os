'use client'

import AppShell from '../../components/AppShell'
import ProtectedRoute from '../../components/ProtectedRoute'
import { AuthProvider } from '../../lib/auth'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppShell>{children}</AppShell>
      </ProtectedRoute>
    </AuthProvider>
  )
}
