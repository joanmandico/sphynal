'use client'

// New patient form - Client Component

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  userId: string
}

export default function NuevoPacienteForm({ userId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    occupation: '',
    sport: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    if (!form.firstName || !form.lastName || !form.birthDate) {
      setError('Nombre, apellidos y fecha de nacimiento son obligatorios')
      setLoading(false)
      return
    }

    const res = await fetch('/api/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId }),
    })

    if (!res.ok) {
      setError('Error al crear el paciente')
      setLoading(false)
      return
    }

    router.push('/dashboard/pacientes')
    router.refresh()
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre *</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Joan"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos *</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="García López"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Actividad laboral</Label>
          <Input
            id="occupation"
            name="occupation"
            placeholder="Administrativo, enfermero..."
            value={form.occupation}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sport">Práctica deportiva</Label>
          <Input
            id="sport"
            name="sport"
            placeholder="Fútbol, natación..."
            value={form.sport}
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Guardando...' : 'Crear paciente'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}