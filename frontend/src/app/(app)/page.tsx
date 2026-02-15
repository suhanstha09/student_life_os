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

type Note = {
  id: number
  title: string
  updated_at: string
}

type LearningLog = {
  id: number
  topic: string
  duration_minutes: number
  logged_at: string
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
  const [notes, setNotes] = useState<Note[]>([])
  const [logs, setLogs] = useState<LearningLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [assignmentData, sessionData, summaryData, streakData, noteData, logData] =
          await Promise.all([
            apiList<Assignment>('/v1/assignments/?ordering=due_date'),
            apiList<FocusSession>('/v1/focus/sessions/?ordering=-started_at'),
            apiList<DailySummary>('/v1/analytics/summaries/?ordering=-date'),
            apiList<Streak>('/v1/streaks/'),
            apiList<Note>('/v1/notes/?ordering=-updated_at'),
            apiList<LearningLog>('/v1/learning/logs/?ordering=-logged_at'),
          ])
        setAssignments(assignmentData)
        setSessions(sessionData)
        setSummaries(summaryData)
        setStreaks(streakData)
        setNotes(noteData)
        setLogs(logData)
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

  const recentNotes = useMemo(() => notes.slice(0, 4), [notes])
  const recentLogs = useMemo(() => logs.slice(0, 4), [logs])

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
    <div className="space-y-5">
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

      <section className="grid gap-5 xl:grid-cols-[1.4fr,1fr]">
        <div className="space-y-5">
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
                  className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3"
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
                    className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3"
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
        </div>

        <div className="space-y-5">
          <Card className="space-y-4">
            <SectionHeader title="Focus pipeline">
              <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-600">
                New session
              </button>
            </SectionHeader>
            {sessions.length === 0 ? (
              <p className="text-sm text-neutral-500">No sessions logged yet.</p>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 4).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{session.title}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(session.started_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-neutral-600">
                      {session.planned_duration} min
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="space-y-4">
            <SectionHeader title="Quick add">
              <span className="text-xs font-semibold text-neutral-400">Shortcuts</span>
            </SectionHeader>
            <div className="grid gap-2">
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
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
            Notes captured
          </p>
          <p className="mt-4 text-3xl font-semibold text-neutral-900">
            {notes.length}
          </p>
          <p className="mt-2 text-sm text-neutral-500">Updated this week</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Learning logs
          </p>
          <p className="mt-4 text-3xl font-semibold text-neutral-900">
            {logs.length}
          </p>
          <p className="mt-2 text-sm text-neutral-500">Active topics tracked</p>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
        <Card className="space-y-4">
          <SectionHeader title="Recent notes">
            <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-600">
              Open notes
            </button>
          </SectionHeader>
          {recentNotes.length === 0 ? (
            <p className="text-sm text-neutral-500">No notes created yet.</p>
          ) : (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{note.title}</p>
                    <p className="text-xs text-neutral-500">
                      Updated {new Date(note.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <SectionHeader title="Learning activity">
            <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-600">
              View logs
            </button>
          </SectionHeader>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-neutral-500">No learning logs yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{log.topic}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(log.logged_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-neutral-600">
                    {log.duration_minutes} min
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}
