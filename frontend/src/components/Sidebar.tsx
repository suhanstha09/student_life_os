'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAuth } from '../lib/auth'

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Assignments', href: '/assignments' },
  { label: 'Focus', href: '/focus' },
  { label: 'Notes', href: '/notes' },
  { label: 'Progress', href: '/progress' },
  { label: 'Settings', href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <aside className="rounded-2xl border border-neutral-200 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between lg:block">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Student Life OS
          </p>
          <h1 className="mt-3 text-2xl font-semibold">
            {user?.first_name || user?.username || 'Workspace'}
          </h1>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Online
        </div>
      </div>

      <nav className="mt-6 flex flex-row gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-4 py-3 text-base transition ${
                isActive
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <span
                className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                  isActive ? 'text-neutral-300' : 'text-neutral-400'
                }`}
              >
                {item.label.slice(0, 2)}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm font-medium text-neutral-500">Today</p>
        <p className="mt-2 text-base font-semibold text-neutral-800">
          2 deadlines, 1 focus block
        </p>
        <p className="mt-1 text-sm text-neutral-500">Keep it light and finish strong.</p>
      </div>
    </aside>
  )
}
