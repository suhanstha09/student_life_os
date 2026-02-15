'use client'

import { useEffect, useMemo, useState } from 'react'

import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import { apiList } from '../../../lib/api'

type DailySummary = {
  id: number
  date: string
  total_focus_minutes: number
  productivity_score: number
}

type LearningLog = {
  id: number
  topic: string
  duration_minutes: number
}

type Streak = {
  id: number
  streak_type: string
  current_count: number
}

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function ProgressPage() {
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [logs, setLogs] = useState<LearningLog[]>([])
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryData, logData, streakData] = await Promise.all([
          apiList<DailySummary>('/v1/analytics/summaries/?ordering=-date'),
          apiList<LearningLog>('/v1/learning/logs/?ordering=-logged_at'),
          apiList<Streak>('/v1/streaks/'),
        ])
        setSummaries(summaryData)
        setLogs(logData)
        setStreaks(streakData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load progress')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const weekly = useMemo(() => {
    const today = new Date()
    const days: DailySummary[] = []
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const iso = date.toISOString().slice(0, 10)
      const match = summaries.find((summary) => summary.date === iso)
      days.push(
        match ?? {
          id: -i,
          date: iso,
          total_focus_minutes: 0,
          productivity_score: 0,
        }
      )
    }
    return days
  }, [summaries])

  const weeklyFocus = weekly.map((day) => day.total_focus_minutes)

  const learningTopics = useMemo(() => {
    const topicMap = new Map<string, number>()
    logs.forEach((log) => {
      topicMap.set(log.topic, (topicMap.get(log.topic) ?? 0) + log.duration_minutes)
    })
    return Array.from(topicMap.entries())
      .map(([topic, minutes]) => ({ topic, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 3)
  }, [logs])

  const focusStreak = streaks.find((item) => item.streak_type === 'focus')

  if (loading) {
    return <p className="text-sm text-neutral-500">Loading progress...</p>
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-600">
        {error}
      </div>
    )
  }

  const averageScore = summaries.length
    ? summaries.reduce((sum, item) => sum + item.productivity_score, 0) / summaries.length
    : 0

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Progress
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Your weekly momentum</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Review focus, learning, and habit consistency in one scan.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Focus hours
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">
            {(weeklyFocus.reduce((a, b) => a + b, 0) / 60).toFixed(1)}h
          </p>
          <p className="mt-2 text-sm text-neutral-500">Last 7 days</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Productivity score
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">
            {averageScore.toFixed(1)}
          </p>
          <p className="mt-2 text-sm text-neutral-500">Average this week</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Streak
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">
            {focusStreak ? `${focusStreak.current_count} days` : '0 days'}
          </p>
          <p className="mt-2 text-sm text-neutral-500">Focus habit</p>
        </Card>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
        <Card className="space-y-4">
          <SectionHeader title="Focus time">
            <p className="text-xs font-semibold text-neutral-400">Last 7 days</p>
          </SectionHeader>
          <div className="flex items-end gap-3">
            {weeklyFocus.map((value, index) => (
              <div key={weekly[index].date} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-full bg-neutral-200"
                  style={{ height: `${Math.max(value, 6)}px` }}
                />
                <span className="text-[11px] font-semibold text-neutral-400">
                  {dayLabels[index]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <SectionHeader title="Weekly summary" />
          <div className="space-y-3">
            {[
              {
                label: 'Focus hours',
                value: `${(weeklyFocus.reduce((a, b) => a + b, 0) / 60).toFixed(1)}h`,
              },
              { label: 'Learning streak', value: focusStreak ? `${focusStreak.current_count} days` : '0 days' },
              { label: 'Study sessions', value: String(logs.length) },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-3"
              >
                <p className="text-sm font-semibold text-neutral-700">{item.label}</p>
                <p className="text-sm font-semibold text-neutral-900">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <SectionHeader title="Learning progress">
          <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-600">
            Export
          </button>
        </SectionHeader>
        {learningTopics.length === 0 ? (
          <p className="text-sm text-neutral-500">Log learning sessions to see progress.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {learningTopics.map((item) => (
              <div key={item.topic} className="rounded-xl border border-neutral-200 px-4 py-4">
                <p className="text-sm font-semibold text-neutral-800">{item.topic}</p>
                <p className="mt-3 text-2xl font-semibold text-neutral-900">
                  {item.minutes} min
                </p>
                <div className="mt-3 h-2 w-full rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-900"
                    style={{ width: `${Math.min(item.minutes, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
