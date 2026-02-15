'use client'

import { useEffect, useState } from 'react'

import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import { apiList, apiPatch, apiPost } from '../../../lib/api'

type Note = {
  id: number
  title: string
  content: string
  updated_at: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotes = async () => {
    const data = await apiList<Note>('/v1/notes/?ordering=-updated_at')
    setNotes(data)
    if (data.length && !activeNoteId) {
      setActiveNoteId(data[0].id)
      setTitle(data[0].title)
      setContent(data[0].content)
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        await loadNotes()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load notes')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleSelect = (note: Note) => {
    setActiveNoteId(note.id)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleSave = async () => {
    setError(null)
    try {
      if (activeNoteId) {
        await apiPatch(`/v1/notes/${activeNoteId}/`, { title, content })
      } else {
        const created = await apiPost<Note>('/v1/notes/', { title, content })
        setActiveNoteId(created.id)
      }
      await loadNotes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save note')
    }
  }

  const handleNew = () => {
    setActiveNoteId(null)
    setTitle('')
    setContent('')
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Notes
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Capture fast, connect later</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Keep your second brain organized by title and recency.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <Card className="space-y-4">
          <SectionHeader title="Your notes">
            <button
              className="rounded-xl border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600"
              onClick={handleNew}
            >
              New note
            </button>
          </SectionHeader>
          {loading ? (
            <p className="text-sm text-neutral-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-neutral-500">No notes yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleSelect(note)}
                  className={`flex w-full flex-col gap-2 rounded-xl border px-3 py-3 text-left ${
                    note.id === activeNoteId
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p
                    className={`text-xs ${
                      note.id === activeNoteId ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    Updated {new Date(note.updated_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <SectionHeader title="Editor">
            <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-600" onClick={handleSave}>
              Save
            </button>
          </SectionHeader>
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-800"
            placeholder="Note title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            className="min-h-[260px] w-full resize-none rounded-xl border border-neutral-200 px-3 py-3 text-sm text-neutral-700"
            placeholder="Write something useful to future you."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
