'use client'

// Clinical notes component - Client Component

import { useState, useEffect } from 'react'

interface Note {
  id: string
  content: string
  createdAt: string
}

interface Props {
  patientId: string
  userId: string
}

export default function NotasClinicas({ patientId, userId }: Props) {
  const [notes, setNotes] = useState<Note[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [patientId])

  async function fetchNotes() {
    setLoading(true)
    const res = await fetch(`/api/notas?patientId=${patientId}`)
    if (res.ok) {
      const data = await res.json()
      setNotes(data)
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!content.trim()) return
    setSaving(true)

    const res = await fetch('/api/notas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, patientId, userId }),
    })

    if (res.ok) {
      const note = await res.json()
      setNotes([note, ...notes])
      setContent('')
    }

    setSaving(false)
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/notas/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setNotes(notes.filter(n => n.id !== id))
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant/10">
        <h2 className="font-headline font-bold text-on-surface">Notas clínicas</h2>
      </div>

      {/* New note input */}
      <div className="px-6 py-4 border-b border-outline-variant/10">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe una nota clínica..."
          rows={3}
          className="w-full text-sm bg-surface-container-low rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {saving ? 'Guardando...' : 'Añadir nota'}
          </button>
        </div>
      </div>

      {/* Notes list */}
      {loading ? (
        <div className="px-6 py-8 text-center">
          <p className="text-on-surface-variant text-sm">Cargando notas...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-on-surface-variant text-sm">No hay notas todavía</p>
        </div>
      ) : (
        <ul className="divide-y divide-outline-variant/5">
          {notes.map((note) => (
            <li key={note.id} className="px-6 py-4 group hover:bg-surface-container-low transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-on-surface whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-on-surface-variant mt-2">
                    {new Date(note.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-xs text-on-surface-variant hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}