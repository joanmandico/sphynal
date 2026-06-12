import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import SelectorRegion from '@/components/forms/SelectorRegion'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ episodioId?: string }>
}

export default async function NuevaEvaluacionPage({ params, searchParams }: Props) {
  const { id } = await params
  const { episodioId } = await searchParams

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
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">
          Nueva evaluación
        </h1>
        {episodioId && (
          <p className="text-sm text-primary font-medium mt-1">
            Vinculada a un episodio clínico
          </p>
        )}
        <p className="text-on-surface-variant mt-1">
          Selecciona la región corporal a evaluar
        </p>
      </div>
      <SelectorRegion patientId={patient.id} userId={user.id} episodioId={episodioId} />
    </div>
  )
}