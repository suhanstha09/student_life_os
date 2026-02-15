'use client'

import { useState } from 'react'
import Link from 'next/link'

import { useAuth } from '../../../lib/auth'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const message = await login(email, password)
    setError(message)
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Student Life OS
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sign in to continue your daily plan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-semibold text-neutral-700">
          Email
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-semibold text-neutral-700">
          Password
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-neutral-500">
        New here?{' '}
        <Link className="font-semibold text-neutral-900" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  )
}
