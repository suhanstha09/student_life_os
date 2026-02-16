'use client'

import { useAuth } from '../lib/auth'

export default function TopBar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-zinc-900/80 px-6 md:px-10 py-6 md:py-8 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Command Bar
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Plan your day in one place</h2>
      </div>

      <div className="flex w-full flex-1 flex-wrap items-center gap-3 lg:max-w-xl">
        <label className="flex min-w-[240px] flex-1 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-500">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-300">
            Search
          </span>
          <input
            className="w-full bg-transparent text-base text-neutral-900 outline-none"
            placeholder="Tasks, notes, or people"
            aria-label="Search"
          />
          <kbd className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-500">
            K
          </kbd>
        </label>
        <button className="rounded-xl border border-neutral-200 bg-neutral-900 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800">
          Quick Add
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-neutral-500">Signed in</p>
          <p className="text-base font-semibold text-neutral-900">
            {user?.first_name || user?.username || user?.email || 'Student'}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-600 hover:border-neutral-300 hover:text-neutral-800"
        >
          Log out
        </button>
      </div>
    </header>
  )
}
