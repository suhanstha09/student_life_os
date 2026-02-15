'use client'

import { AuthProvider } from '../../lib/auth'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#f7f7f5] text-[#1c1c1c]">
        <div className="mx-auto max-w-md px-6 py-16">{children}</div>
      </div>
    </AuthProvider>
  )
}
