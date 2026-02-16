'use client'

import type { ReactNode } from 'react'

import Sidebar from './Sidebar'
import TopBar from './TopBar'

type AppShellProps = {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <Sidebar />
          <div className="flex min-w-0 flex-col">
            <TopBar />
            <main className="mt-6 flex-1 min-h-[calc(100vh-220px)]">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
