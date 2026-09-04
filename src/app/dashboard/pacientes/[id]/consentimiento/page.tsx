// Consentimiento informado — página server component

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import ConsentimientoForm from '@/components/forms/ConsentimientoForm'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ConsentimientoPage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [patient, dbUser] = await Promise.all([
    prisma.patient.findFirst({ where: { id, userId: user.id } }),
    prisma.user.findUnique({ where: { id: user.id }, include: { clinic: true } }),
  ])

  if (!patient || !dbUser) notFound()

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href={`/dashboard/pacientes/${patient.id}`}
          className="text-xs font-bold text-on-surface-variant hover:text-primary uppercase tracking-wider mb-3 inline-flex items-center gap-1 transition-colors"
        >
          ← Volver a la ficha
        </Link>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface mt-2">
          Consentimiento informado
        </h1>
        <p className="text-on-surface-variant mt-1">
          {patient.firstName} {patient.lastName}
        </p>
      </div>
      <ConsentimientoForm patient={patient} user={dbUser} clinic={dbUser.clinic} />
    </div>
  )
}