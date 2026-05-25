// New patient page - Server Component

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NuevoPacienteForm from '@/components/forms/NuevoPacienteForm'

export default async function NuevoPacientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Nuevo paciente</h1>
        <p className="text-slate-500 mt-1">Registra los datos del paciente</p>
      </div>
      <NuevoPacienteForm userId={user.id} />
    </div>
  )
}