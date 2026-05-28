import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import EvaluacionCompleta from '@/components/forms/EvaluacionCompleta'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EvaluacionHombroPage({ params }: Props) {
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
        <p className="text-sm text-on-surface-variant mb-1">
          {patient.firstName} {patient.lastName}
        </p>
        <h1 className="text-2xl font-headline font-extrabold text-on-surface">
          Evaluación — Hombro
        </h1>
        <p className="text-on-surface-variant mt-1">Protocolo completo</p>
      </div>
      <EvaluacionCompleta patientId={patient.id} userId={user.id} />
    </div>
  )
}