'use client'

// Shoulder evaluation form - Client Component
// Step-by-step clinical evaluation with decision algorithm

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analyzeShoulderEvaluation, ShoulderEvaluationData } from '@/lib/algorithms/shoulder'

interface Props {
  patientId: string
  userId: string
}

type Step = 'motivo' | 'pruebas' | 'resultado'

const initialData: ShoulderEvaluationData = {
  cannotRaiseArm: false,
  pointPain: false,
  activePain: false,
  passivePain: false,
  externalRotationPainful: false,
  frozenShoulder: false,
  dropArmSign: false,
  infraspinatus: false,
  emptyCanTest: false,
  scapularAssistanceTest: false,
  scapularRetractionTest: false,
  neerTest: false,
  hawkinsKennedy: false,
  painfulArcSign: false,
  apprehension: false,
  anteriorInstability: false,
  inferiorInstability: false,
  posteriorInstability: false,
  acJointPain: false,
  crossBodyAdduction: false,
  crankTest: false,
  obrienTest: false,
}

function TestButton({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            value === true
              ? 'bg-red-100 text-red-700'
              : 'bg-white border border-slate-200 text-slate-400'
          }`}
        >
          POS
        </button>
        <button
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            value === false
              ? 'bg-green-100 text-green-700'
              : 'bg-white border border-slate-200 text-slate-400'
          }`}
        >
          NEG
        </button>
      </div>
    </div>
  )
}

export default function EvaluacionHombro({ patientId, userId }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('motivo')
  const [data, setData] = useState<ShoulderEvaluationData>(initialData)
  const [loading, setLoading] = useState(false)

  function toggle(key: keyof ShoulderEvaluationData) {
    return (value: boolean) => setData({ ...data, [key]: value })
  }

  const diagnosis = analyzeShoulderEvaluation(data)

  async function handleSave() {
    setLoading(true)

    const res = await fetch('/api/evaluaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        userId,
        bodyArea: 'Hombro',
        data: { shoulder: data },
        diagnosis: diagnosis.primary,
      }),
    })

    if (res.ok) {
      router.push(`/dashboard/pacientes/${patientId}`)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex gap-2 mb-6">
        {(['motivo', 'pruebas', 'resultado'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === s ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm ${step === s ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
              {s === 'motivo' ? 'Motivo' : s === 'pruebas' ? 'Pruebas' : 'Resultado'}
            </span>
            {i < 2 && <div className="w-8 h-px bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      {step === 'motivo' && (
        <Card>
          <CardHeader>
            <CardTitle>Motivo de consulta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <TestButton label="El paciente no puede levantar el brazo" value={data.cannotRaiseArm} onChange={toggle('cannotRaiseArm')} />
            <TestButton label="Dolor a punta de dedo (localizado)" value={data.pointPain} onChange={toggle('pointPain')} />
            <div className="pt-4">
              <Button onClick={() => setStep('pruebas')} className="w-full">
                Continuar a pruebas clínicas →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'pruebas' && (
        <div className="space-y-4">
          {data.cannotRaiseArm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Paciente no puede levantar el brazo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TestButton label="Dolor activo" value={data.activePain} onChange={toggle('activePain')} />
                <TestButton label="Dolor pasivo" value={data.passivePain} onChange={toggle('passivePain')} />
                <TestButton label="Rotación externa dolorosa/restringida" value={data.externalRotationPainful} onChange={toggle('externalRotationPainful')} />
                <TestButton label="Test hombro congelado positivo" value={data.frozenShoulder} onChange={toggle('frozenShoulder')} />
                <TestButton label="Signo de caída del brazo" value={data.dropArmSign} onChange={toggle('dropArmSign')} />
                <TestButton label="Prueba del infraespinoso" value={data.infraspinatus} onChange={toggle('infraspinatus')} />
                <TestButton label="Test lata vacía / Jobe" value={data.emptyCanTest} onChange={toggle('emptyCanTest')} />
                <TestButton label="Test asistencia escapular (SAT)" value={data.scapularAssistanceTest} onChange={toggle('scapularAssistanceTest')} />
                <TestButton label="Test retracción escapular (SRT)" value={data.scapularRetractionTest} onChange={toggle('scapularRetractionTest')} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tests subacromial / manguito rotador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TestButton label="Neer test" value={data.neerTest} onChange={toggle('neerTest')} />
              <TestButton label="Hawkins-Kennedy" value={data.hawkinsKennedy} onChange={toggle('hawkinsKennedy')} />
              <TestButton label="Signo arco doloroso" value={data.painfulArcSign} onChange={toggle('painfulArcSign')} />
              <TestButton label="Test lata vacía / Jobe" value={data.emptyCanTest} onChange={toggle('emptyCanTest')} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inestabilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TestButton label="Aprehensión / sensación inestabilidad" value={data.apprehension} onChange={toggle('apprehension')} />
              {data.apprehension && (
                <>
                  <TestButton label="Inestabilidad anterior" value={data.anteriorInstability} onChange={toggle('anteriorInstability')} />
                  <TestButton label="Inestabilidad inferior" value={data.inferiorInstability} onChange={toggle('inferiorInstability')} />
                  <TestButton label="Inestabilidad posterior" value={data.posteriorInstability} onChange={toggle('posteriorInstability')} />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Articulación AC / SLAP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TestButton label="Dolor articulación AC" value={data.acJointPain} onChange={toggle('acJointPain')} />
              <TestButton label="Aducción horizontal (cross body)" value={data.crossBodyAdduction} onChange={toggle('crossBodyAdduction')} />
              <TestButton label="Test de Crank" value={data.crankTest} onChange={toggle('crankTest')} />
              <TestButton label="Test O'Brien compresión activa" value={data.obrienTest} onChange={toggle('obrienTest')} />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('motivo')}>← Atrás</Button>
            <Button onClick={() => setStep('resultado')} className="flex-1">Ver resultado →</Button>
          </div>
        </div>
      )}

      {step === 'resultado' && (
        <div className="space-y-4">
          <Card className="border-slate-900">
            <CardHeader>
              <CardTitle>Diagnóstico probable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">{diagnosis.primary}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  diagnosis.confidence === 'alta' ? 'bg-green-100 text-green-700'
                  : diagnosis.confidence === 'moderada' ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-slate-100 text-slate-500'
                }`}>
                  Confianza {diagnosis.confidence}
                </span>
              </div>

              {diagnosis.differentials.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Diagnósticos diferenciales</p>
                  <ul className="space-y-1">
                    {diagnosis.differentials.map((d, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnosis.recommendations.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Recomendaciones</p>
                  <ul className="space-y-1">
                    {diagnosis.recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('pruebas')}>← Revisar pruebas</Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? 'Guardando...' : 'Guardar evaluación'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}