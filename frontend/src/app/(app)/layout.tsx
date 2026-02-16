'use client'


import AppShell from '../../components/AppShell'
import ProtectedRoute from '../../components/ProtectedRoute'
import { AuthProvider, useAuth } from '../../lib/auth'
import { ThemeProvider } from '../../components/ThemeProvider'


function InnerApp({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  // fallback to system if not set
  const theme = user?.theme ?? 'system'
  return (
    <ThemeProvider theme={theme}>
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <InnerApp>{children}</InnerApp>
      </ProtectedRoute>
    </AuthProvider>
  )
}
