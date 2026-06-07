import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import GraficoEVA from '@/components/GraficoEVA'
import NotasClinicas from '@/components/NotasClinicas'


interface Props {
  params: Promise<{ id: string }>
}

export default async function PacienteDetailPage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const patient = await prisma.patient.findFirst({
    where: { id, userId: user.id },
    include: { evaluations: { orderBy: { date: 'desc' } } },
  })

  if (!patient) {
    notFound()
  }

  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear()

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-10">
        <div>
          <Link
            href="/dashboard/pacientes"
            className="text-xs font-bold text-on-surface-variant hover:text-primary uppercase tracking-wider mb-3 inline-flex items-center gap-1 transition-colors"
          >
            Volver a pacientes
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-14 h-14 rounded-xl bg-primary-container text-primary flex items-center justify-center font-headline font-bold text-xl">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-headline font-extrabold text-on-surface">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-on-surface-variant mt-0.5">{age} años</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/pacientes/${patient.id}/editar`}
            className="border border-outline-variant text-on-surface-variant px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-surface-container-low transition-colors"
          >
            Editar
          </Link>
          <Link
            href={`/dashboard/pacientes/${patient.id}/evaluacion/nueva`}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            + Nueva evaluación
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 shadow-sm">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">Fecha de nacimiento</p>
          <p className="font-bold text-on-surface">
            {new Date(patient.birthDate).toLocaleDateString('es-ES')}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 shadow-sm">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">Actividad laboral</p>
          <p className="font-bold text-on-surface">{patient.occupation || '—'}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 shadow-sm">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">Práctica deportiva</p>
          <p className="font-bold text-on-surface">{patient.sport || '—'}</p>
        </div>
      </div>
      
{/* EVA Chart */}
{patient.evaluations.length > 0 && (
  <div className="mb-10">
    <GraficoEVA evaluations={patient.evaluations} />
  </div>
)}

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10">
          <h2 className="font-headline font-bold text-on-surface">Evaluaciones</h2>
        </div>
        {patient.evaluations.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-on-surface font-semibold mb-1">No hay evaluaciones todavía</p>
            <p className="text-on-surface-variant text-sm">Inicia una nueva evaluación clínica</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                <th className="text-left px-6 py-4">Fecha</th>
                <th className="text-left px-6 py-4">Zona</th>
                <th className="text-left px-6 py-4">Diagnóstico</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {patient.evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(evaluation.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-primary-container text-primary px-3 py-1 rounded-full">
                      {evaluation.bodyArea}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface font-medium">
                    {evaluation.diagnosis || 'Pendiente'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/dashboard/pacientes/${patient.id}/evaluacion/${evaluation.id}`}
                        className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/api/evaluaciones/${evaluation.id}/pdf`}
                        className="text-sm font-bold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        PDF
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
      </div>

      {/* Clinical notes */}
      <div className="mt-8">
        <NotasClinicas patientId={patient.id} userId={user.id} />
      </div>

    </div>
  )
}