'use client'

// Edit patient form - Client Component

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: Date
  occupation: string | null
  sport: string | null
}

interface Props {
  patient: Patient
}

export default function EditarPacienteForm({ patient }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [form, setForm] = useState({
    firstName: patient.firstName,
    lastName: patient.lastName,
    birthDate: new Date(patient.birthDate).toISOString().split('T')[0],
    occupation: patient.occupation || '',
    sport: patient.sport || '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSave() {
    setLoading(true)
    setError(null)

    const res = await fetch(`/api/pacientes/${patient.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      setError('Error al guardar los cambios')
      setLoading(false)
      return
    }

    router.push(`/dashboard/pacientes/${patient.id}`)
    router.refresh()
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setDeleting(true)

    const res = await fetch(`/api/pacientes/${patient.id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      setError('Error al eliminar el paciente')
      setDeleting(false)
      return
    }

    router.push('/dashboard/pacientes')
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-8 space-y-6">

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Nombre *
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Apellidos *
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Fecha de nacimiento *
          </Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Actividad laboral
          </Label>
          <Input
            id="occupation"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sport" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Práctica deportiva
          </Label>
          <Input
            id="sport"
            name="sport"
            value={form.sport}
            onChange={handleChange}
            className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-primary text-on-primary hover:opacity-90"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="border-outline-variant"
          >
            Cancelar
          </Button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="font-headline font-bold text-red-700 mb-2">Zona de peligro</h3>
        <p className="text-sm text-red-600 mb-4">
          Eliminar el paciente borrará también todas sus evaluaciones. Esta acción no se puede deshacer.
        </p>
        {confirmDelete && (
          <p className="text-sm font-bold text-red-700 mb-3">
            ¿Estás seguro? Haz clic de nuevo para confirmar.
          </p>
        )}
        <Button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          {deleting ? 'Eliminando...' : confirmDelete ? '⚠️ Confirmar eliminación' : 'Eliminar paciente'}
        </Button>
      </div>
    </div>
  )
}