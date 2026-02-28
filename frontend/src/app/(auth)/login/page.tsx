'use client'

import { useState } from 'react'
import Link from 'next/link'

import { useAuth } from '../../../lib/auth'

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const message = await login(email, password);
    setError(message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 py-12 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-neutral-800 border border-neutral-700">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
            Student Life OS
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-neutral-300">
            Sign in to continue your daily plan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-200 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full rounded-lg border border-neutral-700 px-4 py-3 text-base text-neutral-100 bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder:text-neutral-500"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-200 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="w-full rounded-lg border border-neutral-700 px-4 py-3 text-base text-neutral-100 bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder:text-neutral-500"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-400 bg-rose-900/30 px-3 py-2 text-sm text-rose-300 text-center">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-300">
          New here?{' '}
          <Link className="font-semibold text-indigo-400 hover:underline" href="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
