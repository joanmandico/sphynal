// Patient detail page - Server Component
// Shows patient info and their evaluations

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

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
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link
            href="/dashboard/pacientes"
            className="text-sm text-slate-400 hover:text-slate-600 mb-2 inline-block"
          >
            ← Volver a pacientes
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-slate-500 mt-1">{age} años</p>
        </div>
        <Link
          href={`/dashboard/pacientes/${patient.id}/evaluacion/nueva`}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          + Nueva evaluación
        </Link>
      </div>

      {/* Patient info */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Fecha de nacimiento</p>
          <p className="font-medium text-slate-900">
            {new Date(patient.birthDate).toLocaleDateString('es-ES')}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Actividad laboral</p>
          <p className="font-medium text-slate-900">{patient.occupation || '—'}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Práctica deportiva</p>
          <p className="font-medium text-slate-900">{patient.sport || '—'}</p>
        </div>
      </div>

      {/* Evaluations */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Evaluaciones</h2>
        </div>
        {patient.evaluations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-400 text-sm">No hay evaluaciones todavía</p>
            <p className="text-slate-400 text-xs mt-1">
              Inicia una nueva evaluación clínica
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Zona</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnóstico</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patient.evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(evaluation.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {evaluation.bodyArea}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {evaluation.diagnosis || 'Pendiente'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/pacientes/${patient.id}/evaluacion/${evaluation.id}`}
                      className="text-sm font-medium text-slate-900 hover:underline"
                    >
                      Ver
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