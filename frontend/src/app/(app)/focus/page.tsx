'use client'

import { useEffect, useState } from 'react'

import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import { apiList, apiPost } from '../../../lib/api'

type FocusSession = {
  id: number
  title: string
  planned_duration: number
  started_at: string
}

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

export default function FocusPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [title, setTitle] = useState('Deep work')
  const [duration, setDuration] = useState(25)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalMinutes = sessions.reduce(
    (total, session) => total + session.planned_duration,
    0
  )

  const loadSessions = async () => {
    const data = await apiList<FocusSession>('/v1/focus/sessions/?ordering=-started_at')
    setSessions(data)
  }

  useEffect(() => {
    const load = async () => {
      try {
        await loadSessions()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load sessions')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleStart = async () => {
    setError(null)
    try {
      await apiPost('/v1/focus/sessions/', {
        title,
        planned_duration: duration,
      })
      await loadSessions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start session')
    }
  }

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Focus
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Stay in flow</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Start a timed session and track your deep work.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Sessions
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{sessions.length}</p>
          <p className="mt-2 text-sm text-neutral-500">Logged focus blocks</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Total minutes
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{totalMinutes}</p>
          <p className="mt-2 text-sm text-neutral-500">Tracked across sessions</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Target
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">120</p>
          <p className="mt-2 text-sm text-neutral-500">Daily focus goal</p>
        </Card>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.3fr,0.7fr]">
        <Card className="flex flex-col gap-5">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Session
            </p>
            <p className="mt-3 text-6xl font-semibold text-neutral-900">
              {String(duration).padStart(2, '0')}:00
            </p>
            <p className="mt-2 text-sm text-neutral-500">Focus block - Ready to start</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-neutral-700">
              Session title
              <input
                className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label className="text-sm font-semibold text-neutral-700">
              Duration (minutes)
              <input
                className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
                type="number"
                min={10}
                max={180}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
              />
            </label>
          </div>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              onClick={handleStart}
              className="rounded-xl border border-neutral-900 bg-neutral-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
            >
              Start
            </button>
            <button className="rounded-xl border border-neutral-200 px-6 py-2 text-sm font-semibold text-neutral-700 hover:border-neutral-300">
              Pause
            </button>
          </div>
        </Card>

        <Card className="space-y-4">
          <SectionHeader title="Session history">
            <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-600">
              Export
            </button>
          </SectionHeader>
          {loading ? (
            <p className="text-sm text-neutral-500">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-neutral-500">No sessions yet.</p>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{session.title}</p>
                    <p className="text-xs text-neutral-500">{formatTime(session.started_at)}</p>
                  </div>
                  <p className="text-xs font-semibold text-neutral-600">
                    {session.planned_duration} min
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
