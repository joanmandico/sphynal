'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    phone: '',
    dni: '',
    address: '',
    email: '',
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
    <div className="max-w-2xl">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-8 space-y-6">

        {/* Nombre y apellidos */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Nombre *
            </Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Joan"
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
              placeholder="García López"
              value={form.lastName}
              onChange={handleChange}
              className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Fecha de nacimiento */}
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

        {/* Actividad laboral */}
        <div className="space-y-2">
          <Label htmlFor="occupation" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Actividad laboral
          </Label>
          <Input
            id="occupation"
            name="occupation"
            placeholder="Administrativo, enfermero, deportista..."
            value={form.occupation}
            onChange={handleChange}
            className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Práctica deportiva */}
        <div className="space-y-2">
          <Label htmlFor="sport" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Práctica deportiva
          </Label>
          <Input
            id="sport"
            name="sport"
            placeholder="Fútbol, natación, ciclismo..."
            value={form.sport}
            onChange={handleChange}
            className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {/* DNI y Teléfono */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dni" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              DNI
            </Label>
            <Input
              id="dni"
              name="dni"
              placeholder="12345678A"
              value={form.dni}
              onChange={handleChange}
              className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Teléfono
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="600 000 000"
              value={form.phone}
              onChange={handleChange}
              className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Correo electrónico
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="paciente@email.com"
            value={form.email}
            onChange={handleChange}
            className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Domicilio */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Domicilio
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="Calle, número, ciudad"
            value={form.address}
            onChange={handleChange}
            className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {error && (
          <div className="p-4 bg-error/10 rounded-lg">
            <p className="text-sm text-error font-medium">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-primary text-on-primary hover:opacity-90"
          >
            {loading ? 'Guardando...' : 'Crear paciente'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}