// Evaluation detail page - Server Component
// Shows the full evaluation results and diagnosis

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { analyzeShoulderEvaluation, ShoulderEvaluationData } from '@/lib/algorithms/shoulder'
import { analyzeRedFlags, RedFlagsData } from '@/lib/algorithms/redflags'

const prisma = new PrismaClient()

interface Props {
  params: Promise<{ id: string; evalId: string }>
}

export default async function EvaluacionDetailPage({ params }: Props) {
  const { id, evalId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const evaluation = await prisma.evaluation.findFirst({
    where: { id: evalId, userId: user.id },
    include: { patient: true },
  })

  if (!evaluation) {
    notFound()
  }

  const data = evaluation.data as {
    shoulder?: ShoulderEvaluationData
    redFlags?: RedFlagsData
  }

  // Support both old format (data directly) and new format (data.shoulder)
const shoulderData = (data.shoulder || evaluation.data) as ShoulderEvaluationData
const redFlagsData = data.redFlags as RedFlagsData | undefined

  const diagnosis = shoulderData ? analyzeShoulderEvaluation(shoulderData) : null
  const redFlagsResult = redFlagsData ? analyzeRedFlags(redFlagsData) : null

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <Link
            href={`/dashboard/pacientes/${id}`}
            className="text-xs font-bold text-on-surface-variant hover:text-primary uppercase tracking-wider mb-3 inline-flex items-center gap-1 transition-colors"
          >
            Volver a la ficha
          </Link>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface mt-2">
            Evaluación — {evaluation.bodyArea}
          </h1>
          <p className="text-on-surface-variant mt-1">
            {evaluation.patient.firstName} {evaluation.patient.lastName} —{' '}
            {new Date(evaluation.date).toLocaleDateString('es-ES')}
          </p>
        </div>
        <Link
          href={`/api/evaluaciones/${evaluation.id}/pdf`}
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
        >
          Descargar PDF
        </Link>
      </div>

      {/* Red Flags */}
      {redFlagsResult && (
        <div className="mb-8">
          <h2 className="text-lg font-headline font-bold text-on-surface mb-4">Red Flags</h2>
          {redFlagsResult.hasRedFlags ? (
            <div className="space-y-3">
              {redFlagsResult.critical.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3">Críticas</p>
                  <ul className="space-y-2">
                    {redFlagsResult.critical.map((flag, i) => (
                      <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {redFlagsResult.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3">Avisos</p>
                  <ul className="space-y-2">
                    {redFlagsResult.warnings.map((w, i) => (
                      <li key={i} className="text-sm text-yellow-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-sm text-green-700 font-medium">Sin red flags detectadas</p>
            </div>
          )}
        </div>
      )}

      {/* Clinical tests */}
      {shoulderData && (
        <div className="mb-8">
          <h2 className="text-lg font-headline font-bold text-on-surface mb-4">Pruebas clínicas</h2>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                  <th className="text-left px-6 py-4">Prueba</th>
                  <th className="text-left px-6 py-4">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {[
                  { label: 'No puede levantar el brazo', value: shoulderData.cannotRaiseArm },
                  { label: 'Dolor a punta de dedo', value: shoulderData.pointPain },
                  { label: 'Signo de caída del brazo', value: shoulderData.dropArmSign },
                  { label: 'Prueba del infraespinoso', value: shoulderData.infraspinatus },
                  { label: 'Test lata vacía / Jobe', value: shoulderData.emptyCanTest },
                  { label: 'Neer test', value: shoulderData.neerTest },
                  { label: 'Hawkins-Kennedy', value: shoulderData.hawkinsKennedy },
                  { label: 'Signo arco doloroso', value: shoulderData.painfulArcSign },
                  { label: 'Hombro congelado', value: shoulderData.frozenShoulder },
                  { label: 'Aprehensión / inestabilidad', value: shoulderData.apprehension },
                  { label: 'Test de Crank', value: shoulderData.crankTest },
                  { label: "Test O'Brien", value: shoulderData.obrienTest },
                ].map((test, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-3 text-sm text-on-surface">{test.label}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        test.value
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {test.value ? 'POSITIVO' : 'NEGATIVO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Diagnosis */}
      {diagnosis && (
        <div>
          <h2 className="text-lg font-headline font-bold text-on-surface mb-4">Diagnóstico</h2>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-headline font-bold text-on-surface">
                {diagnosis.primary}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                diagnosis.confidence === 'alta' ? 'bg-green-100 text-green-700'
                : diagnosis.confidence === 'moderada' ? 'bg-yellow-100 text-yellow-700'
                : 'bg-surface-container text-on-surface-variant'
              }`}>
                Confianza {diagnosis.confidence}
              </span>
            </div>

            {diagnosis.differentials.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">
                  Diagnósticos diferenciales
                </p>
                <ul className="space-y-1">
                  {diagnosis.differentials.map((d, i) => (
                    <li key={i} className="text-sm text-on-surface-variant flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline-variant inline-block" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {diagnosis.recommendations.length > 0 && (
              <div>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">
                  Recomendaciones
                </p>
                <ul className="space-y-1">
                  {diagnosis.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-on-surface-variant flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}