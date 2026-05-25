// New evaluation page - Server Component

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'
import EvaluacionHombro from '@/components/forms/EvaluacionHombro'

const prisma = new PrismaClient()

interface Props {
  params: Promise<{ id: string }>
}

export default async function NuevaEvaluacionPage({ params }: Props) {
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
        <p className="text-sm text-slate-400 mb-1">
          {patient.firstName} {patient.lastName}
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Nueva evaluación</h1>
        <p className="text-slate-500 mt-1">Hombro — Protocolo completo</p>
      </div>
      <EvaluacionHombro patientId={patient.id} userId={user.id} />
    </div>
  )
}