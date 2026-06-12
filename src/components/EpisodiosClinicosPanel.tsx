'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Evaluation {
  id: string
  date: string
  bodyArea: string
  diagnosis: string | null
  data: Record<string, unknown>
}

interface Episode {
  id: string
  name: string
  status: 'OPEN' | 'CLOSED'
  regions: string[]
  openedAt: string
  closedAt: string | null
  notes: string | null
  evaluations: Evaluation[]
}

interface Props {
  patientId: string
  userId: string
}

const availableRegions = [
  'Hombro', 'Codo', 'Muñeca y mano',
  'Cervical', 'Dorsal', 'Lumbar',
  'Cadera', 'Rodilla', 'Tobillo y pie',
  'ATM', 'Cabeza y cara', 'Tórax',
]

function getEVA(data: Record<string, unknown>): number | null {
  const d = data as Record<string, Record<string, unknown>>
  for (const key of Object.keys(d)) {
    const section = d[key]
    if (section && typeof section === 'object' && 'eva' in section) {
      return Number(section.eva)
    }
  }
  return null
}

export default function EpisodiosClinicosPanel({ patientId, userId }: Props) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRegions, setNewRegions] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchEpisodes()
  }, [patientId])

  async function fetchEpisodes() {
    setLoading(true)
    const res = await fetch(`/api/episodios?patientId=${patientId}`)
    if (res.ok) {
      const data = await res.json()
      setEpisodes(data)
    }
    setLoading(false)
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setSaving(true)

    const res = await fetch('/api/episodios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, regions: newRegions, patientId, userId }),
    })

    if (res.ok) {
      const episode = await res.json()
      setEpisodes([{ ...episode, evaluations: [] }, ...episodes])
      setNewName('')
      setNewRegions([])
      setShowNewForm(false)
    }

    setSaving(false)
  }

  async function handleClose(id: string) {
    const res = await fetch(`/api/episodios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CLOSED' }),
    })
    if (res.ok) {
      setEpisodes(episodes.map(e => e.id === id ? { ...e, status: 'CLOSED' as const, closedAt: new Date().toISOString() } : e))
    }
  }

  async function handleReopen(id: string) {
    const res = await fetch(`/api/episodios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'OPEN' }),
    })
    if (res.ok) {
      setEpisodes(episodes.map(e => e.id === id ? { ...e, status: 'OPEN' as const, closedAt: null } : e))
    }
  }

  function toggleRegion(region: string) {
    setNewRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center">
        <h2 className="font-headline font-bold text-on-surface">Episodios clínicos</h2>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
        >
          + Nuevo episodio
        </button>
      </div>

      {showNewForm && (
        <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low space-y-4">
          <input
            type="text"
            placeholder="Nombre del episodio (ej. Dolor hombro derecho)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full text-sm bg-surface-container-lowest rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant"
          />
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Regiones afectadas</p>
            <div className="flex flex-wrap gap-2">
              {availableRegions.map(region => (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    newRegions.includes(region)
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={saving || !newName.trim()}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-40"
            >
              {saving ? 'Guardando...' : 'Crear episodio'}
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="text-on-surface-variant text-sm hover:text-on-surface transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="px-6 py-8 text-center">
          <p className="text-on-surface-variant text-sm">Cargando episodios...</p>
        </div>
      ) : episodes.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-on-surface-variant text-sm">No hay episodios todavía</p>
          <p className="text-on-surface-variant text-xs mt-1">Crea un episodio para agrupar las evaluaciones de una misma patología</p>
        </div>
      ) : (
        <ul className="divide-y divide-outline-variant/5">
          {episodes.map((episode) => {
            const isExpanded = expandedId === episode.id
            const evaValues = (episode.evaluations || [])
              .map(e => getEVA(e.data as Record<string, unknown>))
              .filter((v): v is number => v !== null)
            const firstEva = evaValues[0]
            const lastEva = evaValues[evaValues.length - 1]
            const evaImprovement = firstEva !== undefined && lastEva !== undefined
              ? firstEva - lastEva
              : null

            return (
              <li key={episode.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        episode.status === 'OPEN' ? 'bg-green-500' : 'bg-outline-variant'
                      }`} />
                      <p className="font-bold text-on-surface">{episode.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        episode.status === 'OPEN'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {episode.status === 'OPEN' ? 'Abierto' : 'Cerrado'}
                      </span>
                    </div>

                    {episode.regions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {episode.regions.map(r => (
                          <span key={r} className="text-xs bg-primary-container text-primary px-2 py-0.5 rounded-full font-medium">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                      <span>
                        {new Date(episode.openedAt).toLocaleDateString('es-ES')}
                        {episode.closedAt && ` → ${new Date(episode.closedAt).toLocaleDateString('es-ES')}`}
                      </span>
                      <span>{(episode.evaluations || []).length} sesión{(episode.evaluations || []).length !== 1 ? 'es' : ''}</span>
                      {evaImprovement !== null && (
                        <span className={evaImprovement > 0 ? 'text-green-600 font-bold' : evaImprovement < 0 ? 'text-red-600 font-bold' : ''}>
                          EVA: {firstEva} → {lastEva}
                          {evaImprovement > 0 ? ` (↓${evaImprovement})` : evaImprovement < 0 ? ` (↑${Math.abs(evaImprovement)})` : ' (=)'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : episode.id)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {isExpanded ? 'Cerrar' : 'Ver sesiones'}
                    </button>
                    {episode.status === 'OPEN' ? (
                      <button
                        onClick={() => handleClose(episode.id)}
                        className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        Cerrar episodio
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReopen(episode.id)}
                        className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        Reabrir
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pl-4 border-l-2 border-outline-variant/20 space-y-3">
                    {(episode.evaluations || []).length === 0 ? (
                      <p className="text-xs text-on-surface-variant">No hay evaluaciones en este episodio todavía</p>
                    ) : (
                      (episode.evaluations || []).map((evaluation, i) => {
                        const evaVal = getEVA(evaluation.data as Record<string, unknown>)
                        return (
                          <div key={evaluation.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-on-surface-variant w-6">#{i + 1}</span>
                              <div>
                                <p className="text-sm text-on-surface font-medium">{evaluation.diagnosis || 'Sin diagnóstico'}</p>
                                <p className="text-xs text-on-surface-variant">
                                  {new Date(evaluation.date).toLocaleDateString('es-ES')} — {evaluation.bodyArea}
                                  {evaVal !== null && ` — EVA: ${evaVal}/10`}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={`/dashboard/pacientes/${patientId}/evaluacion/${evaluation.id}`}
                              className="text-xs font-bold text-primary hover:underline"
                            >
                              Ver
                            </Link>
                          </div>
                        )
                      })
                    )}
                    {episode.status === 'OPEN' && (
                      <Link
                        href={`/dashboard/pacientes/${patientId}/evaluacion/nueva?episodioId=${episode.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-2"
                      >
                        + Nueva sesión en este episodio
                      </Link>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}