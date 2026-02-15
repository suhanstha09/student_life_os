'use client'

import { useEffect, useMemo, useState } from 'react'

import Badge from '../../../components/ui/Badge'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import { apiList } from '../../../lib/api'

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

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [status, setStatus] = useState<'all' | Assignment['status']>('all')
  const [priority, setPriority] = useState<'all' | Assignment['priority']>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Assignments
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Plan every due date</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sort by urgency, priority, or course to stay ahead.
        </p>
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
                className="grid gap-3 rounded-xl border border-neutral-200 px-4 py-3 md:grid-cols-[2fr,1fr,1fr,1fr] md:items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
                  <p className="text-xs text-neutral-500">{statusLabel[item.status]}</p>
                </div>
                <Badge label={statusLabel[item.status]} tone="blue" />
                <Badge label={item.priority} tone={priorityTone[item.priority]} />
                <p className="text-xs font-semibold text-neutral-600">{formatDue(item.due_date)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
