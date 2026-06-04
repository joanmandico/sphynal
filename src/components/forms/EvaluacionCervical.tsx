'use client'

// Cervical evaluation form - Client Component
// Based on cervical protocol (Cervical 1.pdf + CERVICALESLIDIA.pdf)

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  analyzeCervicalEvaluation,
  CervicalEvaluationData,
} from '@/lib/algorithms/cervical'

interface Props {
  patientId: string
  userId: string
}

type Step = 'presentacion' | 'tests' | 'signocomparable' | 'resultado'

const initialData: CervicalEvaluationData = {
  eva: 0,
  sintomasNeurologicos: false,
  dolorIrradiadoBrazo: false,
  cefalea: false,
  traumatismoLatigazo: false,
  dolorLocalCervical: false,
  desviacionMarcha: false,
  hoffmanTest: false,
  supinadorInvertido: false,
  babinskiTest: false,
  mayorDe45: false,
  ulnt1: false,
  romRotacionMenor60: false,
  testDistraccion: false,
  spurlingTest: false,
  testFlexionRotacion: false,
  dolorUnilateralCabeza: false,
  dolorReproduceMovCervical: false,
  limitacionFlexion: false,
  limitacionExtension: false,
  limitacionRotacionDerecha: false,
  limitacionRotacionIzquierda: false,
  limitacionInclinacionDerecha: false,
  limitacionInclinacionIzquierda: false,
  patronHomolateral: false,
  patronContralateral: false,
  testRoos: false,
  testAdson: false,
  edenTest: false,
  morleyTest: false,
  mejoraManipulacionToracica: false,
  mejoraReposicionEscapula: false,
  mejoraRetraccion: false,
  mejoraMulligan: false,
  mejoraIsometricos: false,
}

function TestButton({
  label,
  value,
  onChange,
  sublabel,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
  sublabel?: string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
      <div>
        <span className="text-sm text-on-surface">{label}</span>
        {sublabel && <p className="text-xs text-on-surface-variant mt-0.5">{sublabel}</p>}
      </div>
      <div className="flex gap-2 ml-4 flex-shrink-0">
        <button
          onClick={() => onChange(true)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            value === true
              ? 'bg-red-100 text-red-700'
              : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant'
          }`}
        >
          POS
        </button>
        <button
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            value === false
              ? 'bg-green-100 text-green-700'
              : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant'
          }`}
        >
          NEG
        </button>
      </div>
    </div>
  )
}

function MejoraButton({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`p-4 rounded-xl border-2 text-left transition-all w-full ${
        value
          ? 'border-primary bg-primary-container'
          : 'border-outline-variant/10 bg-surface-container-lowest hover:border-primary/30'
      }`}
    >
      <p className={`text-sm font-bold ${value ? 'text-primary' : 'text-on-surface'}`}>
        {label}
      </p>
    </button>
  )
}

const steps: { id: Step; label: string }[] = [
  { id: 'presentacion', label: 'Presentación' },
  { id: 'tests', label: 'Tests' },
  { id: 'signocomparable', label: 'Signo comparable' },
  { id: 'resultado', label: 'Resultado' },
]

export default function EvaluacionCervical({ patientId, userId }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('presentacion')
  const [data, setData] = useState<CervicalEvaluationData>(initialData)
  const [loading, setLoading] = useState(false)

  function toggle(key: keyof CervicalEvaluationData) {
    return (value: boolean) => setData({ ...data, [key]: value })
  }

  const diagnosis = analyzeCervicalEvaluation(data)
  const currentIndex = steps.findIndex(s => s.id === step)

  // Determine which tests to show based on presentation
  const showMyelopathy = data.sintomasNeurologicos
  const showWainner = data.dolorIrradiadoBrazo || data.sintomasNeurologicos
  const showCefalea = data.cefalea
  const showTOS = data.dolorIrradiadoBrazo
  const showMobilidad = true // always show

  async function handleSave() {
    setLoading(true)

    const res = await fetch('/api/evaluaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        userId,
        bodyArea: 'Cervical',
        data: { cervical: data },
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
      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentIndex > i ? 'bg-green-500 text-white'
              : step === s.id ? 'bg-primary text-on-primary'
              : 'bg-surface-container-highest text-on-surface-variant'
            }`}>
              {currentIndex > i ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-semibold ${step === s.id ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-outline-variant mx-1" />}
          </div>
        ))}
      </div>

      {/* Paso 1 — Presentación clínica */}
      {step === 'presentacion' && (
        <Card>
          <CardHeader>
            <CardTitle>Presentación clínica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 pb-2">
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Dolor actual (Escala EVA)
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={data.eva}
                  onChange={(e) => setData({ ...data, eva: Number(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="text-2xl font-headline font-extrabold text-primary w-12 text-center">
                  {data.eva}/10
                </span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant px-1">
                <span>Sin dolor</span>
                <span>Dolor máximo</span>
              </div>
            </div>

            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pt-2">
              Síntomas presentes
            </p>
            <TestButton label="Dolor local cervical" value={data.dolorLocalCervical} onChange={toggle('dolorLocalCervical')} />
            <TestButton label="Síntomas neurológicos" sublabel="Parestesias, debilidad, entumecimiento" value={data.sintomasNeurologicos} onChange={toggle('sintomasNeurologicos')} />
            <TestButton label="Dolor irradiado al brazo" sublabel="Cervicobraquialgia" value={data.dolorIrradiadoBrazo} onChange={toggle('dolorIrradiadoBrazo')} />
            <TestButton label="Cefalea" sublabel="Dolor de cabeza asociado al cuello" value={data.cefalea} onChange={toggle('cefalea')} />
            <TestButton label="Antecedente de traumatismo / latigazo cervical" value={data.traumatismoLatigazo} onChange={toggle('traumatismoLatigazo')} />

            <div className="pt-4">
              <Button onClick={() => setStep('tests')} className="w-full bg-primary text-on-primary">
                Continuar a tests →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 2 — Tests específicos */}
      {step === 'tests' && (
        <div className="space-y-4">
          {/* Movimientos activos — siempre */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Movimientos activos (ROM)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TestButton label="Limitación de flexión" value={data.limitacionFlexion} onChange={toggle('limitacionFlexion')} />
              <TestButton label="Limitación de extensión" value={data.limitacionExtension} onChange={toggle('limitacionExtension')} />
              <TestButton label="Limitación rotación derecha" value={data.limitacionRotacionDerecha} onChange={toggle('limitacionRotacionDerecha')} />
              <TestButton label="Limitación rotación izquierda" value={data.limitacionRotacionIzquierda} onChange={toggle('limitacionRotacionIzquierda')} />
              <TestButton label="Limitación inclinación derecha" value={data.limitacionInclinacionDerecha} onChange={toggle('limitacionInclinacionDerecha')} />
              <TestButton label="Limitación inclinación izquierda" value={data.limitacionInclinacionIzquierda} onChange={toggle('limitacionInclinacionIzquierda')} />
              <TestButton
                label="Rot + inclinación limitadas HOMOLATERALES"
                sublabel="→ Sugiere cervical media-baja (C2-T1)"
                value={data.patronHomolateral}
                onChange={toggle('patronHomolateral')}
              />
              <TestButton
                label="Rot + inclinación limitadas CONTRALATERALES"
                sublabel="→ Sugiere cervical alta (C0-C2)"
                value={data.patronContralateral}
                onChange={toggle('patronContralateral')}
              />
            </CardContent>
          </Card>

          {/* Mielopatía — si hay síntomas neurológicos */}
          {showMyelopathy && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base text-red-700">
                  Cluster Mielopatía cervical
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TestButton label="Desviación de la marcha" value={data.desviacionMarcha} onChange={toggle('desviacionMarcha')} />
                <TestButton label="Hoffman test" value={data.hoffmanTest} onChange={toggle('hoffmanTest')} />
                <TestButton label="Signo del supinador invertido" value={data.supinadorInvertido} onChange={toggle('supinadorInvertido')} />
                <TestButton label="Babinski test" value={data.babinskiTest} onChange={toggle('babinskiTest')} />
                <TestButton label="Edad mayor de 45 años" value={data.mayorDe45} onChange={toggle('mayorDe45')} />
              </CardContent>
            </Card>
          )}

          {/* Radiculopatía — Cluster Wainner */}
          {showWainner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cluster Wainner — Radiculopatía</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TestButton label="ULNT1 — Test neurodinámico nervio mediano" value={data.ulnt1} onChange={toggle('ulnt1')} />
                <TestButton label="ROM rotación cervical menor de 60º hacia el lado afecto" value={data.romRotacionMenor60} onChange={toggle('romRotacionMenor60')} />
                <TestButton label="Test de distracción cervical" value={data.testDistraccion} onChange={toggle('testDistraccion')} />
                <TestButton label="Spurling Test" value={data.spurlingTest} onChange={toggle('spurlingTest')} />
              </CardContent>
            </Card>
          )}

          {/* Cefalea cervicogénica */}
          {showCefalea && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cefalea cervicogénica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TestButton label="Test de flexión-rotación cervical positivo" sublabel="En máxima flexión, rotación limitada" value={data.testFlexionRotacion} onChange={toggle('testFlexionRotacion')} />
                <TestButton label="Dolor de cabeza unilateral" value={data.dolorUnilateralCabeza} onChange={toggle('dolorUnilateralCabeza')} />
                <TestButton label="Cefalea se reproduce con movimiento cervical" value={data.dolorReproduceMovCervical} onChange={toggle('dolorReproduceMovCervical')} />
              </CardContent>
            </Card>
          )}

          {/* TOS */}
          {showTOS && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">TOS — Síndrome del estrecho torácico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TestButton label="Test de Roos / Elevated Arm Stress Test" value={data.testRoos} onChange={toggle('testRoos')} />
                <TestButton label="Test de Adson" value={data.testAdson} onChange={toggle('testAdson')} />
                <TestButton label="Eden Test" value={data.edenTest} onChange={toggle('edenTest')} />
                <TestButton label="Morley Test" value={data.morleyTest} onChange={toggle('morleyTest')} />
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('presentacion')} className="border-outline-variant">
              ← Atrás
            </Button>
            <Button onClick={() => setStep('signocomparable')} className="flex-1 bg-primary text-on-primary">
              Signo comparable →
            </Button>
          </div>
        </div>
      )}

      {/* Paso 3 — Signo comparable */}
      {step === 'signocomparable' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signo comparable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-on-surface-variant mb-4">
                Selecciona qué técnicas mejoran el signo comparable del paciente (CERVICALESLIDIA)
              </p>
              <div className="space-y-3">
                <MejoraButton
                  label="1. Manipulación columna torácica"
                  value={data.mejoraManipulacionToracica}
                  onChange={toggle('mejoraManipulacionToracica')}
                />
                <MejoraButton
                  label="2. Reposicionamiento pasivo de la escápula"
                  value={data.mejoraReposicionEscapula}
                  onChange={toggle('mejoraReposicionEscapula')}
                />
                <MejoraButton
                  label="3. Retracción activa del cuello (doble mentón)"
                  value={data.mejoraRetraccion}
                  onChange={toggle('mejoraRetraccion')}
                />
                <MejoraButton
                  label="4. Movilización cervical (Mulligan / SNAG / NAG)"
                  value={data.mejoraMulligan}
                  onChange={toggle('mejoraMulligan')}
                />
                <MejoraButton
                  label="5. Isométricos — Neck Flexion Endurance Test"
                  value={data.mejoraIsometricos}
                  onChange={toggle('mejoraIsometricos')}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('tests')} className="border-outline-variant">
              ← Atrás
            </Button>
            <Button onClick={() => setStep('resultado')} className="flex-1 bg-primary text-on-primary">
              Ver resultado →
            </Button>
          </div>
        </div>
      )}

      {/* Paso 4 — Resultado */}
      {step === 'resultado' && (
        <div className="space-y-4">
          {/* Derivación urgente */}
          {diagnosis.shouldRefer && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500 text-xl">⚠️</span>
                <h3 className="font-headline font-bold text-red-700">Derivación recomendada</h3>
              </div>
              <p className="text-sm text-red-700">{diagnosis.referReason}</p>
            </div>
          )}

          {/* Diagnóstico */}
          <Card className="border-outline-variant/20">
            <CardHeader>
              <CardTitle>Diagnóstico probable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-headline font-bold text-on-surface">
                  {diagnosis.primary}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-3 ${
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

              {diagnosis.comparableSign.length > 0 && (
                <div className="mb-4 p-4 bg-primary-container rounded-lg">
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">
                    Signo comparable — mejora con
                  </p>
                  <ul className="space-y-1">
                    {diagnosis.comparableSign.map((s, i) => (
                      <li key={i} className="text-sm text-on-primary-container font-medium flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnosis.treatment.length > 0 && (
                <div>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">
                    Estrategia de tratamiento
                  </p>
                  <ul className="space-y-1">
                    {diagnosis.treatment.map((t, i) => (
                      <li key={i} className="text-sm text-on-surface-variant flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('signocomparable')} className="border-outline-variant">
              ← Revisar
            </Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1 bg-primary text-on-primary">
              {loading ? 'Guardando...' : 'Guardar evaluación'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}