'use client'

import { useState } from 'react'
import Link from 'next/link'

import { useAuth } from '../../../lib/auth'

export default function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirm: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const message = await register({
      email: form.email,
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
      passwordConfirm: form.passwordConfirm,
    })
    setError(message)
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Student Life OS
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Create your workspace</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Start tracking focus, deadlines, and progress.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-neutral-700">
            First name
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
              value={form.firstName}
              onChange={(event) => handleChange('firstName', event.target.value)}
            />
          </label>
          <label className="block text-sm font-semibold text-neutral-700">
            Last name
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
              value={form.lastName}
              onChange={(event) => handleChange('lastName', event.target.value)}
            />
          </label>
        </div>
        <label className="block text-sm font-semibold text-neutral-700">
          Email
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => handleChange('email', event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-semibold text-neutral-700">
          Username
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
            value={form.username}
            onChange={(event) => handleChange('username', event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-semibold text-neutral-700">
          Password
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => handleChange('password', event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-semibold text-neutral-700">
          Confirm password
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
            type="password"
            autoComplete="new-password"
            value={form.passwordConfirm}
            onChange={(event) => handleChange('passwordConfirm', event.target.value)}
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
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-neutral-500">
        Already have an account?{' '}
        <Link className="font-semibold text-neutral-900" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  )
}
