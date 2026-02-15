'use client'

import { useEffect, useMemo, useState } from 'react'

import Badge from '../../../components/ui/Badge'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import { apiList, apiPatch, apiPost } from '../../../lib/api'

type Assignment = {
  id: number
  title: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string
}

const statusLabel: Record<Assignment['status'], string> = {
  todo: 'To do',
  in_progress: 'In progress',
  completed: 'Completed',
}

const priorityTone: Record<Assignment['priority'], 'neutral' | 'amber' | 'rose'> = {
  low: 'neutral',
  medium: 'amber',
  high: 'rose',
  urgent: 'rose',
}

const formatDue = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate()

const isWithinDays = (date: Date, days: number) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [status, setStatus] = useState<'all' | Assignment['status']>('all')
  const [priority, setPriority] = useState<'all' | Assignment['priority']>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [formPriority, setFormPriority] = useState<Assignment['priority']>('medium')
  const [formStatus, setFormStatus] = useState<Assignment['status']>('todo')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams()
        if (status !== 'all') params.set('status', status)
        if (priority !== 'all') params.set('priority', priority)
        params.set('ordering', 'due_date')
        const data = await apiList<Assignment>(`/v1/assignments/?${params.toString()}`)
        setAssignments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load assignments')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [status, priority])

  const filteredLabel = useMemo(() => {
    if (status !== 'all') return statusLabel[status]
    if (priority !== 'all') return `${priority} priority`
    return 'All assignments'
  }, [status, priority])

  const dueToday = useMemo(() => {
    const today = new Date()
    return assignments.filter((item) => isSameDay(new Date(item.due_date), today)).length
  }, [assignments])

  const dueThisWeek = useMemo(
    () => assignments.filter((item) => isWithinDays(new Date(item.due_date), 7)).length,
    [assignments]
  )

  const completedCount = useMemo(
    () => assignments.filter((item) => item.status === 'completed').length,
    [assignments]
  )

  const saveAssignment = async () => {
    if (!title.trim() || !dueDate) {
      setError('Title and due date are required')
      return
    }

    setError(null)
    const payload = {
      title: title.trim(),
      due_date: new Date(dueDate).toISOString(),
      status: formStatus,
      priority: formPriority,
    }

    if (editingId) {
      await apiPatch(`/v1/assignments/${editingId}/`, payload)
    } else {
      await apiPost('/v1/assignments/', payload)
    }

    setTitle('')
    setDueDate('')
    setFormPriority('medium')
    setFormStatus('todo')
    setEditingId(null)

    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    if (priority !== 'all') params.set('priority', priority)
    params.set('ordering', 'due_date')
    const data = await apiList<Assignment>(`/v1/assignments/?${params.toString()}`)
    setAssignments(data)
  }

  const toggleCompleted = async (item: Assignment) => {
    const nextStatus = item.status === 'completed' ? 'todo' : 'completed'
    await apiPatch(`/v1/assignments/${item.id}/`, { status: nextStatus })
    const updated = assignments.map((current) =>
      current.id === item.id ? { ...current, status: nextStatus } : current
    )
    setAssignments(updated)
  }

  const startEdit = (item: Assignment) => {
    setEditingId(item.id)
    setTitle(item.title)
    setDueDate(new Date(item.due_date).toISOString().slice(0, 16))
    setFormPriority(item.priority)
    setFormStatus(item.status)
  }

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Assignments
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Plan every due date</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sort by urgency, priority, or course to stay ahead.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Due today
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{dueToday}</p>
          <p className="mt-2 text-sm text-neutral-500">Items with deadlines today</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Next 7 days
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{dueThisWeek}</p>
          <p className="mt-2 text-sm text-neutral-500">Keep the week under control</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Completed
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{completedCount}</p>
          <p className="mt-2 text-sm text-neutral-500">Total assignments finished</p>
        </Card>
      </section>

      <Card className="space-y-4">
        <SectionHeader title="Filters">
          <button
            className="text-xs font-semibold text-neutral-400 hover:text-neutral-600"
            onClick={() => {
              setStatus('all')
              setPriority('all')
            }}
          >
            Clear
          </button>
        </SectionHeader>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All', action: () => setStatus('all') },
            { label: 'In progress', action: () => setStatus('in_progress') },
            { label: 'Completed', action: () => setStatus('completed') },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 hover:border-neutral-300 hover:text-neutral-800"
            >
              {item.label}
            </button>
          ))}
          {['high', 'medium', 'low'].map((level) => (
            <button
              key={level}
              onClick={() => setPriority(level as Assignment['priority'])}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 hover:border-neutral-300 hover:text-neutral-800"
            >
              {level} priority
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.4fr,0.6fr]">
        <Card className="space-y-4">
        <SectionHeader title={`Assignment list - ${filteredLabel}`}>
          <span className="text-xs font-semibold text-neutral-400">
            {assignments.length} items
          </span>
        </SectionHeader>
        {loading ? (
          <p className="text-sm text-neutral-500">Loading assignments...</p>
        ) : error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-neutral-500">No assignments match this filter.</p>
        ) : (
          <div className="space-y-3">
            {assignments.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-xl border border-neutral-200 px-4 py-3 md:grid-cols-[auto,2fr,1fr,1fr,1fr] md:items-center"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.status === 'completed'}
                    onChange={() => toggleCompleted(item)}
                    className="h-4 w-4 accent-neutral-900"
                    aria-label="Mark assignment completed"
                  />
                </label>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
                  <p className="text-xs text-neutral-500">{statusLabel[item.status]}</p>
                </div>
                <Badge label={statusLabel[item.status]} tone="blue" />
                <Badge label={item.priority} tone={priorityTone[item.priority]} />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-neutral-600">{formatDue(item.due_date)}</p>
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-lg border border-neutral-200 px-2 py-1 text-xs font-semibold text-neutral-600 hover:border-neutral-300"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </Card>

        <div className="space-y-5">
          <Card className="space-y-4">
            <SectionHeader title={editingId ? 'Edit assignment' : 'New assignment'}>
              {editingId ? (
                <button
                  onClick={() => {
                    setEditingId(null)
                    setTitle('')
                    setDueDate('')
                    setFormPriority('medium')
                    setFormStatus('todo')
                  }}
                  className="text-xs font-semibold text-neutral-400 hover:text-neutral-600"
                >
                  Cancel
                </button>
              ) : null}
            </SectionHeader>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-neutral-700">
                Title
                <input
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
              <label className="text-sm font-semibold text-neutral-700">
                Due date
                <input
                  type="datetime-local"
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold text-neutral-700">
                  Status
                  <select
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
                    value={formStatus}
                    onChange={(event) => setFormStatus(event.target.value as Assignment['status'])}
                  >
                    <option value="todo">To do</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-neutral-700">
                  Priority
                  <select
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
                    value={formPriority}
                    onChange={(event) => setFormPriority(event.target.value as Assignment['priority'])}
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
              </div>
              <button
                onClick={saveAssignment}
                className="rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
              >
                {editingId ? 'Update assignment' : 'Create assignment'}
              </button>
            </div>
          </Card>

          <Card className="space-y-4">
            <SectionHeader title="Priority split" />
            <div className="space-y-3">
              {(['urgent', 'high', 'medium', 'low'] as Assignment['priority'][]).map((level) => {
                const count = assignments.filter((item) => item.priority === level).length
                return (
                  <div
                    key={level}
                    className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-neutral-700">{level}</p>
                    <Badge label={`${count}`} tone={priorityTone[level]} />
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
