'use client'

import { useAuth } from '../lib/auth'

export default function TopBar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Command Bar
        </p>
        <h2 className="mt-1 text-xl font-semibold">Plan your day in one place</h2>
      </div>

      <div className="flex w-full flex-1 items-center gap-3 sm:max-w-md">
        <label className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
            Search
          </span>
          <input
            className="w-full bg-transparent text-sm text-neutral-900 outline-none"
            placeholder="Tasks, notes, or people"
            aria-label="Search"
          />
          <kbd className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
            K
          </kbd>
        </label>
        <button className="hidden rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:inline-flex">
          Quick Add
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs font-semibold text-neutral-500">Signed in</p>
          <p className="text-sm font-semibold text-neutral-900">
            {user?.first_name || user?.username || user?.email || 'Student'}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 hover:border-neutral-300 hover:text-neutral-800"
        >
          Log out
        </button>
      </div>
    </header>
  )
}
