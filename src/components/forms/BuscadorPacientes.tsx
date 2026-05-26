'use client'

// Patient search component - Client Component
// Filters patients in real time by name

import { useState } from 'react'
import Link from 'next/link'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: Date
  occupation: string | null
  sport: string | null
}

interface Props {
  patients: Patient[]
}

export default function BuscadorPacientes({ patients }: Props) {
  const [query, setQuery] = useState('')

  const filtered = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
    return fullName.includes(query.toLowerCase())
  })

  return (
    <div>
      {/* Search input */}
      <div className="px-6 py-4 border-b border-outline-variant/10">
        <input
          type="text"
          placeholder="Buscar paciente por nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-sm bg-surface-container-low rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-on-surface-variant text-sm">
            No se encontró ningún paciente con ese nombre
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest font-bold">
              <th className="text-left px-6 py-4">Paciente</th>
              <th className="text-left px-6 py-4">Fecha nacimiento</th>
              <th className="text-left px-6 py-4">Actividad</th>
              <th className="text-left px-6 py-4">Deporte</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {filtered.map((patient) => (
              <tr key={patient.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-sm">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <p className="font-bold text-on-surface text-sm">
                      {patient.firstName} {patient.lastName}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {new Date(patient.birthDate).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {patient.occupation || '—'}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {patient.sport || '—'}
                </td>
                <td className="px-6 py-5 text-right">
                  <Link
                    href={`/dashboard/pacientes/${patient.id}`}
                    className="text-sm font-bold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Ver ficha →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}