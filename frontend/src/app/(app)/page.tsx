'use client'

import { useEffect, useMemo, useState } from 'react'

import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import SectionHeader from '../../components/ui/SectionHeader'
import { apiList, apiPost } from '../../lib/api'

type Assignment = {
  id: number
  title: string
  due_date: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

type FocusSession = {
  id: number
  title: string
  planned_duration: number
  started_at: string
}

type DailySummary = {
  id: number
  date: string
  total_focus_minutes: number
}

type Streak = {
  id: number
  streak_type: string
  current_count: number
}

const priorityLabel = (priority: Assignment['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'Urgent'
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    default:
      return 'Low'
  }
}

const formatDue = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [assignmentData, sessionData, summaryData, streakData] =
          await Promise.all([
            apiList<Assignment>('/v1/assignments/?ordering=due_date'),
            apiList<FocusSession>('/v1/focus/sessions/?ordering=-started_at'),
            apiList<DailySummary>('/v1/analytics/summaries/?ordering=-date'),
            apiList<Streak>('/v1/streaks/'),
          ])
        setAssignments(assignmentData)
        setSessions(sessionData)
        setSummaries(summaryData)
        setStreaks(streakData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const priorities = useMemo(
    () =>
      assignments
        .filter((item) => item.status !== 'completed')
        .slice(0, 3),
    [assignments]
  )

  const deadlines = useMemo(() => assignments.slice(0, 3), [assignments])

  const focusToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const match = summaries.find((summary) => summary.date === today)
    return match ? `${match.total_focus_minutes} min` : '0 min'
  }, [summaries])

  const currentStreak = streaks.find((item) => item.streak_type === 'focus')

  const createQuickAssignment = async () => {
    const due = new Date()
    due.setHours(due.getHours() + 6)
    await apiPost('/v1/assignments/', {
      title: 'New assignment',
      description: '',
      due_date: due.toISOString(),
      status: 'todo',
      priority: 'medium',
    })
    const refreshed = await apiList<Assignment>('/v1/assignments/?ordering=due_date')
    setAssignments(refreshed)
  }

  const createQuickFocus = async () => {
    await apiPost('/v1/focus/sessions/', {
      title: 'Focus session',
      planned_duration: 25,
    })
    const refreshed = await apiList<FocusSession>('/v1/focus/sessions/?ordering=-started_at')
    setSessions(refreshed)
  }

  const createQuickNote = async () => {
    await apiPost('/v1/notes/', {
      title: 'Quick note',
      content: 'Capture the thought while it is fresh.',
    })
  }

  if (loading) {
    return (
      <div className="text-sm text-neutral-500">
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-600">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
            Your day at a glance
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Focus on the two most important tasks and keep momentum.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:text-neutral-900">
            Review week
          </button>
          <button className="rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800">
            Quick add
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Card className="space-y-4">
          <SectionHeader title="Today's priorities">
            <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-600">
              View all
            </button>
          </SectionHeader>
          <div className="space-y-3">
            {priorities.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No priorities yet. Add one from assignments or quick add.
              </p>
            ) : (
              priorities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
                    <p className="text-xs text-neutral-500">
                      Due {formatDue(item.due_date)}
                    </p>
                  </div>
                  <Badge label={priorityLabel(item.priority)} tone="amber" />
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="space-y-4">
          <SectionHeader title="Upcoming deadlines">
            <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-600">
              Add
            </button>
          </SectionHeader>
          <div className="space-y-3">
            {deadlines.length === 0 ? (
              <p className="text-sm text-neutral-500">No deadlines scheduled.</p>
            ) : (
              deadlines.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
                    <p className="text-xs text-neutral-500">Due {formatDue(item.due_date)}</p>
                  </div>
                  <Badge label={priorityLabel(item.priority)} tone="blue" />
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Streak
          </p>
          <p className="mt-4 text-3xl font-semibold text-neutral-900">
            {currentStreak ? `${currentStreak.current_count} days` : '0 days'}
          </p>
          <p className="mt-2 text-sm text-neutral-500">Daily focus habit</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Focus time
          </p>
          <p className="mt-4 text-3xl font-semibold text-neutral-900">{focusToday}</p>
          <p className="mt-2 text-sm text-neutral-500">
            {sessions.length} sessions logged
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Quick add
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={createQuickAssignment}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-left text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
            >
              New assignment
            </button>
            <button
              onClick={createQuickFocus}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-left text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
            >
              Start focus session
            </button>
            <button
              onClick={createQuickNote}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-left text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
            >
              Capture note
            </button>
          </div>
        </Card>
      </section>
    </div>
  )
}
