// Edit patient page - Server Component

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import EditarPacienteForm from '@/components/forms/EditarPacienteForm'


interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarPacientePage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const patient = await prisma.patient.findFirst({
    where: { id, userId: user.id },
  })

  if (!patient) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href={`/dashboard/pacientes/${patient.id}`}
          className="text-xs font-bold text-on-surface-variant hover:text-primary uppercase tracking-wider mb-3 inline-flex items-center gap-1 transition-colors"
        >
          Volver a la ficha
        </Link>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface mt-2">
          Editar paciente
        </h1>
        <p className="text-on-surface-variant mt-1">
          {patient.firstName} {patient.lastName}
        </p>
      </div>
      <EditarPacienteForm patient={patient} />
    </div>
  )
}