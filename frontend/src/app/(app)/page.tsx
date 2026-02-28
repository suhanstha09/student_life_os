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

const isWithinDays = (date: Date, days: number) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [logs, setLogs] = useState<LearningLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewWeek, setReviewWeek] = useState(false)
  const [quickTitle, setQuickTitle] = useState('')

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

  const filteredAssignments = useMemo(() => {
    if (!reviewWeek) return assignments
    return assignments.filter((item) => isWithinDays(new Date(item.due_date), 7))
  }, [assignments, reviewWeek])

  const priorities = useMemo(
    () =>
      filteredAssignments
        .filter((item) => item.status !== 'completed')
        .slice(0, 3),
    [filteredAssignments]
  )

  const deadlines = useMemo(() => filteredAssignments.slice(0, 3), [filteredAssignments])

  const focusToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const match = summaries.find((summary) => summary.date === today)
    return match ? `${match.total_focus_minutes} min` : '0 min'
  }, [summaries])

  const currentStreak = streaks.find((item) => item.streak_type === 'focus')

  const recentNotes = useMemo(() => notes.slice(0, 4), [notes])
  const recentLogs = useMemo(() => logs.slice(0, 4), [logs])

  const createQuickAssignment = async () => {
    if (!quickTitle.trim()) return
    const due = new Date()
    due.setHours(due.getHours() + 6)
    await apiPost('/v1/assignments/', {
      title: quickTitle.trim(),
      description: '',
      due_date: due.toISOString(),
      status: 'todo',
      priority: 'medium',
    })
    const refreshed = await apiList<Assignment>('/v1/assignments/?ordering=due_date')
    setAssignments(refreshed)
    setQuickTitle('')
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
    <div className="space-y-5 bg-neutral-900 min-h-screen p-4">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Your day at a glance
          </h1>
          <p className="mt-2 text-sm text-neutral-300">
            Focus on the two most important tasks and keep momentum.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setReviewWeek((current) => !current)}
            className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-100 shadow-sm transition hover:border-neutral-500 hover:text-white"
          >
            {reviewWeek ? 'Week view on' : 'Review week'}
          </button>
          <button className="rounded-xl border border-neutral-100 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-200">
            Quick add
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr,1fr]">
        <div className="space-y-5">
          <Card className="space-y-4 bg-neutral-800 border border-neutral-700">
            <SectionHeader title="Today's priorities">
              <button className="text-xs font-semibold text-neutral-300 hover:text-white">
                View all
              </button>
            </SectionHeader>
            <div className="space-y-3">
              {priorities.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  No priorities yet. Add one from assignments or quick add.
                </p>
              ) : (
                priorities.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-700 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-100">{item.title}</p>
                      <p className="text-xs text-neutral-400">
                        Due {formatDue(item.due_date)}
                      </p>
                    </div>
                    <Badge label={priorityLabel(item.priority)} tone="amber" />
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="space-y-4 bg-neutral-800 border border-neutral-700">
            <SectionHeader title="Upcoming deadlines">
              <button className="text-xs font-semibold text-neutral-300 hover:text-white">
                Add
              </button>
            </SectionHeader>
            <div className="space-y-3">
              {deadlines.length === 0 ? (
                <p className="text-sm text-neutral-400">No deadlines scheduled.</p>
              ) : (
                deadlines.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-700 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-100">{item.title}</p>
                      <p className="text-xs text-neutral-400">Due {formatDue(item.due_date)}</p>
                    </div>
                    <Badge label={priorityLabel(item.priority)} tone="blue" />
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="space-y-4 bg-neutral-800 border border-neutral-700">
            <SectionHeader title="Focus pipeline">
              <button className="text-xs font-semibold text-neutral-300 hover:text-white">
                New session
              </button>
            </SectionHeader>
            {sessions.length === 0 ? (
              <p className="text-sm text-neutral-400">No sessions logged yet.</p>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 4).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-700 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-100">{session.title}</p>
                      <p className="text-xs text-neutral-400">
                        {new Date(session.started_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-neutral-200">
                      {session.planned_duration} min
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="space-y-4 bg-neutral-800 border border-neutral-700">
            <SectionHeader title="Quick add">
              <span className="text-xs font-semibold text-neutral-300">Shortcuts</span>
            </SectionHeader>
            <div className="grid gap-3">
              <input
                className="rounded-xl border border-neutral-700 px-3 py-2 text-sm font-semibold text-neutral-100 bg-neutral-900 placeholder:text-neutral-500"
                placeholder="Assignment title"
                value={quickTitle}
                onChange={(event) => setQuickTitle(event.target.value)}
              />
              <button
                onClick={createQuickAssignment}
                className="rounded-xl border border-neutral-700 px-3 py-2 text-left text-sm font-semibold text-neutral-200 bg-neutral-900 transition hover:border-neutral-500 hover:text-white"
              >
                Create assignment
              </button>
              <button
                onClick={createQuickFocus}
                className="rounded-xl border border-neutral-700 px-3 py-2 text-left text-sm font-semibold text-neutral-200 bg-neutral-900 transition hover:border-neutral-500 hover:text-white"
              >
                Start focus session
              </button>
              <button
                onClick={createQuickNote}
                className="rounded-xl border border-neutral-700 px-3 py-2 text-left text-sm font-semibold text-neutral-200 bg-neutral-900 transition hover:border-neutral-500 hover:text-white"
              >
                Capture note
              </button>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-neutral-800 border border-neutral-700">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
            Streak
          </p>
          <p className="mt-4 text-3xl font-semibold text-white">
            {currentStreak ? `${currentStreak.current_count} days` : '0 days'}
          </p>
          <p className="mt-2 text-sm text-neutral-300">Daily focus habit</p>
        </Card>
        <Card className="bg-neutral-800 border border-neutral-700">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
            Focus time
          </p>
          <p className="mt-4 text-3xl font-semibold text-white">{focusToday}</p>
          <p className="mt-2 text-sm text-neutral-300">
            {sessions.length} sessions logged
          </p>
        </Card>
        <Card className="bg-neutral-800 border border-neutral-700">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
            Notes captured
          </p>
          <p className="mt-4 text-3xl font-semibold text-white">
            {notes.length}
          </p>
          <p className="mt-2 text-sm text-neutral-300">Updated this week</p>
        </Card>
        <Card className="bg-neutral-800 border border-neutral-700">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
            Learning logs
          </p>
          <p className="mt-4 text-3xl font-semibold text-white">
            {logs.length}
          </p>
          <p className="mt-2 text-sm text-neutral-300">Active topics tracked</p>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
        <Card className="space-y-4 bg-neutral-800 border border-neutral-700">
          <SectionHeader title="Recent notes">
            <button className="text-xs font-semibold text-neutral-300 hover:text-white">
              Open notes
            </button>
          </SectionHeader>
          {recentNotes.length === 0 ? (
            <p className="text-sm text-neutral-400">No notes created yet.</p>
          ) : (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-700 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-100">{note.title}</p>
                    <p className="text-xs text-neutral-400">
                      Updated {new Date(note.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="rounded-lg border border-neutral-700 px-3 py-1 text-xs font-semibold text-neutral-200 hover:text-white">
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-4 bg-neutral-800 border border-neutral-700">
          <SectionHeader title="Learning activity">
            <button className="text-xs font-semibold text-neutral-300 hover:text-white">
              View logs
            </button>
          </SectionHeader>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-neutral-400">No learning logs yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-700 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-100">{log.topic}</p>
                    <p className="text-xs text-neutral-400">
                      {new Date(log.logged_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-neutral-200">
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
