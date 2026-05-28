'use client'

// Body region selector - Client Component
// Shows available protocols and routes to the correct evaluation

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Props {
  patientId: string
  userId: string
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
      { id: 'cervical', label: 'Columna cervical', icon: '🔝', available: false },
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

export default function SelectorRegion({ patientId, userId }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  function handleContinue() {
    if (!selected) return

    if (selected === 'hombro') {
      router.push(`/dashboard/pacientes/${patientId}/evaluacion/hombro`)
    } else {
      // Other protocols coming soon
      alert('Este protocolo estará disponible próximamente')
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
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

      <div className="pt-4">
        <Button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full bg-primary text-on-primary hover:opacity-90 font-bold py-3 disabled:opacity-40"
        >
          {selected ? `Iniciar evaluación de ${regions.flatMap(r => r.items).find(i => i.id === selected)?.label}` : 'Selecciona una región para continuar'}
        </Button>
      </div>
    </div>
  )
}