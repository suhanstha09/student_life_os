'use client'

import { useEffect, useState } from 'react'

import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import { apiPatch } from '../../../lib/api'
import { useAuth } from '../../../lib/auth'

const settingsToggles = [
  { label: 'Daily focus reminders', description: 'Send a reminder at 9:00 AM' },
  { label: 'Assignment digest', description: 'Weekly summary on Sunday' },
  { label: 'Auto-start focus timer', description: 'Start with last used duration' },
]

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [firstName, setFirstName] = useState(user?.first_name ?? '')
  const [lastName, setLastName] = useState(user?.last_name ?? '')
  const [timezone, setTimezone] = useState(user?.timezone ?? 'UTC')
  const [dailyGoal, setDailyGoal] = useState(user?.daily_focus_goal ?? 120)
  const [theme, setTheme] = useState(user?.theme ?? 'system')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setFirstName(user.first_name ?? '')
    setLastName(user.last_name ?? '')
    setTimezone(user.timezone ?? 'UTC')
    setDailyGoal(user.daily_focus_goal ?? 120)
    setTheme(user.theme ?? 'system')
  }, [user])

  // Update theme on change
  useEffect(() => {
    const root = window.document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    let applied: 'dark' | 'light'
    if (theme === 'system') {
      applied = systemDark ? 'dark' : 'light'
    } else {
      applied = theme
    }
    if (applied === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await apiPatch('/auth/me/', {
        first_name: firstName,
        last_name: lastName,
        timezone,
        daily_focus_goal: dailyGoal,
        theme,
      })
      await refreshUser()
      setMessage('Saved')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Preferences</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Keep notifications and preferences aligned to your routine.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Profile
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">
            {user?.first_name || user?.username || 'Student'}
          </p>
          <p className="mt-2 text-sm text-neutral-500">Personal workspace</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Timezone
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{timezone}</p>
          <p className="mt-2 text-sm text-neutral-500">Current preference</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Daily focus
          </p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{dailyGoal} min</p>
          <p className="mt-2 text-sm text-neutral-500">Goal per day</p>
        </Card>
      </section>

      <Card className="space-y-4">
        <SectionHeader title="Account">
          <button
            className="rounded-xl border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </SectionHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-neutral-700">
            First name
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
          <label className="text-sm font-semibold text-neutral-700">
            Last name
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>
          <label className="text-sm font-semibold text-neutral-700">
            Timezone
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
            />
          </label>
          <label className="text-sm font-semibold text-neutral-700">
            Daily focus goal (minutes)
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
              type="number"
              value={dailyGoal}
              onChange={(event) => setDailyGoal(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-neutral-700">Theme</p>
          <div className="flex flex-wrap gap-2">
            {['light', 'system', 'dark'].map((label) => (
              <button
                key={label}
                onClick={() => setTheme(label)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  theme === label
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {message ? (
          <p className="text-xs font-semibold text-neutral-500">{message}</p>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <SectionHeader title="Notifications" />
        <div className="space-y-3">
          {settingsToggles.map((item) => (
            <label
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-800">{item.label}</p>
                <p className="text-xs text-neutral-500">{item.description}</p>
              </div>
              <input type="checkbox" className="h-4 w-4 accent-neutral-900" defaultChecked />
            </label>
          ))}
        </div>
      </Card>
    </div>
  )
}
