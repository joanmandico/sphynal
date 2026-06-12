'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Props {
  patientId: string
  userId: string
  episodioId?: string
}

interface Episode {
  id: string
  name: string
  status: 'OPEN' | 'CLOSED'
  regions: string[]
}

const regions = [
  {
    category: 'Miembro superior',
    items: [
      { id: 'hombro', label: 'Hombro', icon: '💪', available: true },
      { id: 'codo', label: 'Codo', icon: '🦾', available: false },
      { id: 'muneca', label: 'Muñeca y mano', icon: '✋', available: false },
    ],
  },
  {
    category: 'Columna vertebral',
    items: [
      { id: 'cervical', label: 'Columna cervical', icon: '🔝', available: true },
      { id: 'dorsal', label: 'Columna dorsal', icon: '🔙', available: false },
      { id: 'lumbar', label: 'Columna lumbar', icon: '⬇️', available: false },
    ],
  },
  {
    category: 'Miembro inferior',
    items: [
      { id: 'cadera', label: 'Cadera', icon: '🦴', available: false },
      { id: 'rodilla', label: 'Rodilla', icon: '🦵', available: false },
      { id: 'tobillo', label: 'Tobillo y pie', icon: '🦶', available: false },
    ],
  },
  {
    category: 'Otras regiones',
    items: [
      { id: 'atm', label: 'ATM (Mandíbula)', icon: '😬', available: false },
      { id: 'cabeza', label: 'Cabeza y cara', icon: '🧠', available: false },
      { id: 'torax', label: 'Tórax', icon: '🫁', available: false },
    ],
  },
]

export default function SelectorRegion({ patientId, userId, episodioId }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [selectedEpisodioId, setSelectedEpisodioId] = useState<string | null>(episodioId || null)
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)

  // Only fetch episodes if no episodioId was passed (coming from general button)
  useEffect(() => {
    if (!episodioId) {
      fetchEpisodes()
    }
  }, [patientId, episodioId])

  async function fetchEpisodes() {
    setLoadingEpisodes(true)
    const res = await fetch(`/api/episodios?patientId=${patientId}`)
    if (res.ok) {
      const data = await res.json()
      setEpisodes(data.filter((e: Episode) => e.status === 'OPEN'))
    }
    setLoadingEpisodes(false)
  }

  function handleContinue() {
    if (!selected) return

    const episodioParam = selectedEpisodioId ? `?episodioId=${selectedEpisodioId}` : ''

    if (selected === 'hombro') {
      router.push(`/dashboard/pacientes/${patientId}/evaluacion/hombro${episodioParam}`)
    } else if (selected === 'cervical') {
      router.push(`/dashboard/pacientes/${patientId}/evaluacion/cervical${episodioParam}`)
    } else {
      alert('Este protocolo estará disponible próximamente')
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Region selector */}
      {regions.map((region) => (
        <div key={region.category}>
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            {region.category}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {region.items.map((item) => (
              <button
                key={item.id}
                onClick={() => item.available && setSelected(item.id)}
                className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                  !item.available
                    ? 'border-outline-variant/10 bg-surface-container-low opacity-50 cursor-not-allowed'
                    : selected === item.id
                    ? 'border-primary bg-primary-container shadow-sm'
                    : 'border-outline-variant/10 bg-surface-container-lowest hover:border-primary/30 hover:bg-surface-container-low shadow-sm'
                }`}
              >
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <p className={`text-sm font-bold ${
                  selected === item.id ? 'text-primary' : 'text-on-surface'
                }`}>
                  {item.label}
                </p>
                {!item.available && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                    Próximo
                  </span>
                )}
                {item.available && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Disponible
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Episode selector — only shown when coming from general button */}
      {!episodioId && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5 space-y-3">
          <p className="text-sm font-bold text-on-surface">
            ¿Asociar a un episodio clínico?
          </p>
          <p className="text-xs text-on-surface-variant">
            Opcional — vincula esta evaluación a un episodio existente para hacer seguimiento
          </p>

          {loadingEpisodes ? (
            <p className="text-xs text-on-surface-variant">Cargando episodios...</p>
          ) : episodes.length === 0 ? (
            <p className="text-xs text-on-surface-variant">No hay episodios abiertos todavía</p>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => setSelectedEpisodioId(null)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedEpisodioId === null
                    ? 'bg-surface-container font-bold text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                Sin episodio — evaluación independiente
              </button>
              {episodes.map(episode => (
                <button
                  key={episode.id}
                  onClick={() => setSelectedEpisodioId(episode.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    selectedEpisodioId === episode.id
                      ? 'bg-primary-container text-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="font-medium">{episode.name}</span>
                  {episode.regions.length > 0 && (
                    <span className="text-xs ml-2 opacity-70">
                      ({episode.regions.join(', ')})
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="pt-2">
        <Button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full bg-primary text-on-primary hover:opacity-90 font-bold py-3 disabled:opacity-40"
        >
          {selected
            ? `Iniciar evaluación de ${regions.flatMap(r => r.items).find(i => i.id === selected)?.label}`
            : 'Selecciona una región para continuar'
          }
        </Button>
      </div>
    </div>
  )
}