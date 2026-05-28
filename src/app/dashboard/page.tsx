import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Real counts from database
  const [totalPatients, totalEvaluations, recentPatients] = await Promise.all([
    prisma.patient.count({ where: { userId: user.id } }),
    prisma.evaluation.count({ where: { userId: user.id } }),
    prisma.patient.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
          Resumen clínico
        </h2>
        <p className="text-on-surface-variant font-medium">
          Bienvenido a Sphynal — Motor de decisión clínica
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-2xl">🏥</span>
          </div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">
            Pacientes
          </p>
          <p className="text-3xl font-headline font-extrabold text-on-surface">{totalPatients}</p>
          <p className="text-xs text-on-surface-variant mt-1">Total registrados</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">
            Evaluaciones
          </p>
          <p className="text-3xl font-headline font-extrabold text-on-surface">{totalEvaluations}</p>
          <p className="text-xs text-on-surface-variant mt-1">Total realizadas</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">
            Informes
          </p>
          <p className="text-3xl font-headline font-extrabold text-on-surface">{totalEvaluations}</p>
          <p className="text-xs text-on-surface-variant mt-1">Generados</p>
        </div>
      </div>

      {/* Recent patients */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-headline font-bold text-on-surface">Pacientes recientes</h3>
          <Link
            href="/dashboard/pacientes/nuevo"
            className="text-sm font-bold text-primary bg-primary-container hover:opacity-80 px-4 py-2 rounded-lg transition-opacity"
          >
            + Nuevo paciente
          </Link>
        </div>
        {recentPatients.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-on-surface-variant text-sm">No hay pacientes todavía</p>
            <p className="text-on-surface-variant text-xs mt-1">
              Crea tu primer paciente para empezar
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                <th className="text-left px-6 py-4">Paciente</th>
                <th className="text-left px-6 py-4">Fecha nacimiento</th>
                <th className="text-left px-6 py-4">Actividad</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {recentPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-sm">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <p className="font-bold text-on-surface text-sm">
                        {patient.firstName} {patient.lastName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {new Date(patient.birthDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {patient.occupation || '—'}
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