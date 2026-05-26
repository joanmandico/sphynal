import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

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

      {/* Patient list */}
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
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                <th className="text-left px-6 py-4">Paciente</th>
                <th className="text-left px-6 py-4">Fecha nacimiento</th>
                <th className="text-left px-6 py-4">Actividad</th>
                <th className="text-left px-6 py-4">Deporte</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-sm">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">
                          {patient.firstName} {patient.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {new Date(patient.birthDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {patient.occupation || '—'}
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {patient.sport || '—'}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/dashboard/pacientes/${patient.id}`}
                      className="text-sm font-bold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Ver ficha →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}