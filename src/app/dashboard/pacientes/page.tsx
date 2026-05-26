import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import BuscadorPacientes from '@/components/forms/BuscadorPacientes'

const prisma = new PrismaClient()

export default async function PacientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const patients = await prisma.patient.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
            Pacientes
          </h2>
          <p className="text-on-surface-variant font-medium">
            {patients.length} paciente{patients.length !== 1 ? 's' : ''} registrado{patients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/pacientes/nuevo"
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
        >
          + Nuevo paciente
        </Link>
      </div>

      {/* Patient list with search */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
        {patients.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-4xl mb-4">👥</p>
            <p className="text-on-surface font-semibold mb-1">No hay pacientes todavía</p>
            <p className="text-on-surface-variant text-sm mb-6">
              Crea tu primer paciente para empezar
            </p>
            <Link
              href="/dashboard/pacientes/nuevo"
              className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              + Nuevo paciente
            </Link>
          </div>
        ) : (
          <BuscadorPacientes patients={patients} />
        )}
      </div>
    </div>
  )
}