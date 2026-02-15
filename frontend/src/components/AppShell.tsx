'use client'

import type { ReactNode } from 'react'

import Sidebar from './Sidebar'
import TopBar from './TopBar'

type AppShellProps = {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#1c1c1c]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <Sidebar />
          <div className="flex min-w-0 flex-col">
            <TopBar />
            <main className="mt-6 flex-1">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
