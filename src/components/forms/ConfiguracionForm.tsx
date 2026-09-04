'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Clinic {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  nif: string | null
}

interface User {
  id: string
  name: string
  email: string
  role: string
  collegiateNumber: string | null
  specialty: string | null
}

interface Props {
  user: User
  clinic: Clinic
}

export default function ConfiguracionForm({ user, clinic }: Props) {
  const [loadingClinic, setLoadingClinic] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [successClinic, setSuccessClinic] = useState(false)
  const [successUser, setSuccessUser] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [clinicForm, setClinicForm] = useState({
    name: clinic.name || '',
    address: clinic.address || '',
    phone: clinic.phone || '',
    email: clinic.email || '',
    nif: clinic.nif || '',
  })

  const [userForm, setUserForm] = useState({
    name: user.name || '',
    collegiateNumber: user.collegiateNumber || '',
    specialty: user.specialty || '',
  })

  const inputClass = 'bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20'
  const labelClass = 'text-xs font-bold text-on-surface-variant uppercase tracking-wider'

  async function handleSaveClinic() {
    setLoadingClinic(true)
    setSuccessClinic(false)
    setError(null)
    const res = await fetch('/api/configuracion/clinic', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clinicForm),
    })
    if (!res.ok) { setError('Error al guardar los datos del centro'); setLoadingClinic(false); return }
    setSuccessClinic(true)
    setLoadingClinic(false)
  }

  async function handleSaveUser() {
    setLoadingUser(true)
    setSuccessUser(false)
    setError(null)
    const res = await fetch('/api/configuracion/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm),
    })
    if (!res.ok) { setError('Error al guardar los datos del profesional'); setLoadingUser(false); return }
    setSuccessUser(true)
    setLoadingUser(false)
  }

  return (
    <div className="max-w-2xl space-y-8">

      {/* Datos del centro */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-8 space-y-6">
        <h2 className="text-lg font-headline font-bold text-on-surface">Datos del centro</h2>

        <div className="space-y-2">
          <Label className={labelClass}>Nombre del centro *</Label>
          <Input value={clinicForm.name} onChange={e => setClinicForm({...clinicForm, name: e.target.value})} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className={labelClass}>NIF/CIF</Label>
            <Input value={clinicForm.nif} onChange={e => setClinicForm({...clinicForm, nif: e.target.value})} className={inputClass} placeholder="B12345678" />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Teléfono</Label>
            <Input value={clinicForm.phone} onChange={e => setClinicForm({...clinicForm, phone: e.target.value})} className={inputClass} placeholder="600 000 000" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>Correo electrónico</Label>
          <Input type="email" value={clinicForm.email} onChange={e => setClinicForm({...clinicForm, email: e.target.value})} className={inputClass} placeholder="centro@email.com" />
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>Dirección</Label>
          <Input value={clinicForm.address} onChange={e => setClinicForm({...clinicForm, address: e.target.value})} className={inputClass} placeholder="Calle, número, ciudad" />
        </div>

        {successClinic && <p className="text-sm text-green-600 font-medium">✓ Datos del centro guardados correctamente</p>}

        <Button onClick={handleSaveClinic} disabled={loadingClinic} className="bg-primary text-on-primary hover:opacity-90">
          {loadingClinic ? 'Guardando...' : 'Guardar datos del centro'}
        </Button>
      </div>

      {/* Datos del profesional */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-8 space-y-6">
        <h2 className="text-lg font-headline font-bold text-on-surface">Datos del profesional</h2>

        <div className="space-y-2">
          <Label className={labelClass}>Nombre completo</Label>
          <Input value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className={labelClass}>Número de colegiado</Label>
            <Input value={userForm.collegiateNumber} onChange={e => setUserForm({...userForm, collegiateNumber: e.target.value})} className={inputClass} placeholder="08/12345" />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Especialidad</Label>
            <Input value={userForm.specialty} onChange={e => setUserForm({...userForm, specialty: e.target.value})} className={inputClass} placeholder="Fisioterapia musculoesquelética" />
          </div>
        </div>

        {successUser && <p className="text-sm text-green-600 font-medium">✓ Datos del profesional guardados correctamente</p>}

        <Button onClick={handleSaveUser} disabled={loadingUser} className="bg-primary text-on-primary hover:opacity-90">
          {loadingUser ? 'Guardando...' : 'Guardar datos del profesional'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}