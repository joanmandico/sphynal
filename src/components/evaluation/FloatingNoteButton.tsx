'use client'

// Floating note button - Client Component
// Allows adding clinical notes during evaluation without interrupting the flow

import { useState } from 'react'

interface Props {
  patientId: string
  userId: string
}

export default function FloatingNoteButton({ patientId, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!content.trim()) return
    setSaving(true)

    const res = await fetch('/api/notas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, patientId, userId }),
    })

    if (res.ok) {
      setContent('')
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setOpen(false)
      }, 1500)
    }

    setSaving(false)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center text-2xl z-50"
        title="Añadir nota clínica"
      >
        📝
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setOpen(false)}
          />

          {/* Note panel */}
          <div className="relative bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/10 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-on-surface">Nota clínica</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-on-surface-variant hover:text-on-surface transition-colors text-xl"
              >
                ×
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe una nota clínica..."
              rows={4}
              autoFocus
              className="w-full text-sm bg-surface-container-low rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant resize-none"
            />

            {saved ? (
              <div className="w-full py-2.5 bg-green-100 text-green-700 rounded-lg text-sm font-bold text-center">
                ✓ Nota guardada
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {saving ? 'Guardando...' : 'Guardar nota'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}