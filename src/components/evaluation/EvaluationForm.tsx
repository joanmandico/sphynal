'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { protocols } from '@/lib/protocols'
import { ProtocolData, ProtocolSection } from '@/lib/protocols/types'
import { buildInitialData, isSectionVisible, isFieldVisible, runDiagnosis } from '@/lib/protocols/engine'
import EvaluationResult from './EvaluationResult'
import RedFlagsForm from '@/components/forms/RedFlagsForm'
import { RedFlagsData, RedFlagResult } from '@/lib/algorithms/redflags'
import FloatingNoteButton from './FloatingNoteButton'

type Phase = 'redflags' | 'redflags_warning' | 'evaluation'

interface Props {
  protocolId: string
  patientId: string
  userId: string
}

function BooleanField({ label, sublabel, value, onChange }: {
  label: string
  sublabel?: string
  value: boolean
  onChange: (v: boolean) => void
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
            value === true ? 'bg-red-100 text-red-700' : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant'
          }`}
        >POS</button>
        <button
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            value === false ? 'bg-green-100 text-green-700' : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant'
          }`}
        >NEG</button>
      </div>
    </div>
  )
}

function ScaleField({ label, value, min = 0, max = 10, onChange }: {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-3 py-2">
      <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-primary"
        />
        <span className="text-2xl font-headline font-extrabold text-primary w-16 text-center">
          {value}/{max}
        </span>
      </div>
      <div className="flex justify-between text-xs text-on-surface-variant px-1">
        <span>Sin dolor</span>
        <span>Dolor máximo</span>
      </div>
    </div>
  )
}

function SectionRenderer({ section, data, onChange }: {
  section: ProtocolSection
  data: ProtocolData
  onChange: (key: string, value: unknown) => void
}) {
  const sectionVariantClass = section.variant === 'danger' ? 'border-red-200' : section.variant === 'warning' ? 'border-yellow-200' : ''
  const titleVariantClass = section.variant === 'danger' ? 'text-red-700' : section.variant === 'warning' ? 'text-yellow-700' : ''

  return (
    <Card className={sectionVariantClass}>
      <CardHeader>
        <CardTitle className={`text-base ${titleVariantClass}`}>{section.title}</CardTitle>
        {section.description && <p className="text-sm text-on-surface-variant">{section.description}</p>}
      </CardHeader>
      <CardContent className="space-y-3">
        {section.fields.map((field) => {
          if (!isFieldVisible(field, data)) return null
          if (field.type === 'boolean') {
            return (
              <BooleanField
                key={field.id}
                label={field.label}
                sublabel={field.sublabel}
                value={data[field.id] as boolean ?? false}
                onChange={(v) => onChange(field.id, v)}
              />
            )
          }
          if (field.type === 'scale') {
            return (
              <ScaleField
                key={field.id}
                label={field.label}
                value={data[field.id] as number ?? 0}
                min={field.min}
                max={field.max}
                onChange={(v) => onChange(field.id, v)}
              />
            )
          }
          return null
        })}
      </CardContent>
    </Card>
  )
}

export default function EvaluationForm({ protocolId, patientId, userId }: Props) {
  const protocol = protocols[protocolId]
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('redflags')
  const [redFlagsData, setRedFlagsData] = useState<RedFlagsData | null>(null)
  const [redFlagsResult, setRedFlagsResult] = useState<RedFlagResult | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState<ProtocolData>(buildInitialData(protocol))
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const currentStep = protocol.steps[currentStepIndex]
  const isLastStep = currentStepIndex === protocol.steps.length - 1
  const diagnosis = runDiagnosis(protocol, data)

  function handleRedFlagsComplete(rfData: RedFlagsData, rfResult: RedFlagResult) {
    setRedFlagsData(rfData)
    setRedFlagsResult(rfResult)
    if (rfResult.hasRedFlags) {
      setPhase('redflags_warning')
    } else {
      setPhase('evaluation')
    }
  }

  function handleChange(key: string, value: unknown) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setLoading(true)
    const res = await fetch('/api/evaluaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        userId,
        bodyArea: protocol.name,
        data: { [protocol.id]: data, redFlags: redFlagsData },
        diagnosis: diagnosis.primary,
      }),
    })
    if (res.ok) {
      router.push(`/dashboard/pacientes/${patientId}`)
      router.refresh()
    }
    setLoading(false)
  }

  // Phase indicator
  const phases = [
    { id: 'redflags', label: 'Red Flags' },
    { id: 'evaluation', label: protocol.name },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      {/* Phase indicator */}
      <div className="flex items-center gap-2 mb-2">
        {phases.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              phase === 'redflags' && i === 0 ? 'bg-primary text-on-primary'
              : phase !== 'redflags' && i === 0 ? 'bg-green-500 text-white'
              : phase === 'evaluation' || phase === 'redflags_warning' && i === 1 ? 'bg-primary text-on-primary'
              : 'bg-surface-container-highest text-on-surface-variant'
            }`}>
              {phase !== 'redflags' && i === 0 ? '✓' : i + 1}
            </div>
            <span className="text-sm font-semibold text-on-surface-variant">{p.label}</span>
            {i < phases.length - 1 && <div className="w-8 h-px bg-outline-variant mx-1" />}
          </div>
        ))}
      </div>

      {/* Red Flags phase */}
      {phase === 'redflags' && (
        <RedFlagsForm onComplete={handleRedFlagsComplete} />
      )}

      {/* Red Flags warning */}
      {phase === 'redflags_warning' && redFlagsResult && (
        <div className="space-y-4">
          {redFlagsResult.critical.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 text-xl">⚠️</span>
                <h3 className="font-headline font-bold text-red-700">Red Flags críticas detectadas</h3>
              </div>
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500 text-xl">⚡</span>
                <h3 className="font-headline font-bold text-yellow-700">Avisos</h3>
              </div>
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

          {redFlagsResult.shouldRefer.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-6 shadow-sm">
              <h3 className="font-headline font-bold text-on-surface mb-4">Derivaciones recomendadas</h3>
              <ul className="space-y-2">
                {redFlagsResult.shouldRefer.map((r, i) => (
                  <li key={i} className="text-sm text-on-surface-variant flex items-center gap-2">
                    <span className="text-primary">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPhase('redflags')} className="border-outline-variant">
              ← Revisar red flags
            </Button>
            {redFlagsResult.canContinue ? (
              <Button onClick={() => setPhase('evaluation')} className="flex-1 bg-primary text-on-primary">
                Continuar a evaluación →
              </Button>
            ) : (
              <div className="flex-1 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center font-bold">
                No se puede continuar — derivación médica urgente requerida
              </div>
            )}
          </div>
        </div>
      )}

      {/* Evaluation phase */}
      {phase === 'evaluation' && (
        <>
          {/* Steps indicator */}
          <div className="flex items-center gap-2 flex-wrap">
            {protocol.steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStepIndex > i ? 'bg-green-500 text-white'
                  : currentStepIndex === i ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {currentStepIndex > i ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-semibold ${currentStepIndex === i ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {step.title}
                </span>
                {i < protocol.steps.length - 1 && <div className="w-6 h-px bg-outline-variant mx-1" />}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                showResult ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {protocol.steps.length + 1}
              </div>
              <span className="text-sm font-semibold text-on-surface-variant">Resultado</span>
            </div>
          </div>

          {showResult ? (
            <EvaluationResult
              diagnosis={diagnosis}
              onBack={() => setShowResult(false)}
              onSave={handleSave}
              loading={loading}
            />
          ) : (
            <>
              <div className="space-y-4">
                {currentStep.sections.map((section) => {
                  if (!isSectionVisible(section, data)) return null
                  return (
                    <SectionRenderer
                      key={section.id}
                      section={section}
                      data={data}
                      onChange={handleChange}
                    />
                  )
                })}
              </div>

              <div className="flex gap-3">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStepIndex(i => i - 1)} className="border-outline-variant">
                    ← Atrás
                  </Button>
                )}
                {isLastStep ? (
                  <Button onClick={() => setShowResult(true)} className="flex-1 bg-primary text-on-primary">
                    Ver resultado →
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentStepIndex(i => i + 1)} className="flex-1 bg-primary text-on-primary">
                    Continuar →
                  </Button>
                )}
              </div>
            </>
          )}
        </>
      )}
      {/* Floating note button */}
      <FloatingNoteButton patientId={patientId} userId={userId} />
    </div>
  )
}