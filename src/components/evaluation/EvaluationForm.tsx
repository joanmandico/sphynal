'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { protocols } from '@/lib/protocols'
import { ProtocolData, ProtocolSection, ProtocolStep } from '@/lib/protocols/types'
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
  episodioId?: string
}

function BooleanField({ label, sublabel, value, onChange }: {
  label: string
  sublabel?: string
  value: boolean | null
  onChange: (v: boolean | null) => void
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
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant'
          }`}
        >POS</button>
        <button
          onClick={() => onChange(null)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            value === null
              ? 'bg-surface-container-highest text-on-surface border border-outline-variant'
              : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant'
          }`}
        >NV</button>
        <button
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            value === false
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant'
          }`}
        >NEG</button>
      </div>
    </div>
  )
}

function SelectField({ label, value, options, onChange }: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
      <span className="text-sm text-on-surface">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

function SectionRenderer({ section, data, onChange }: {
  section: ProtocolSection
  data: ProtocolData
  onChange: (key: string, value: boolean | number | string | null) => void
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
                value={data[field.id] as boolean | null ?? null}
                onChange={(v) => onChange(field.id, v)}
              />
            )
          }
          if (field.type === 'scale') {
            return (
              <div key={field.id} className="space-y-3 py-2">
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">{field.label}</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={field.min ?? 0}
                    max={field.max ?? 10}
                    step={1}
                    value={data[field.id] as number ?? 0}
                    onChange={(e) => onChange(field.id, Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-2xl font-headline font-extrabold text-primary w-16 text-center">
                    {data[field.id] as number ?? 0}/{field.max ?? 10}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant px-1">
                  <span>Sin dolor</span>
                  <span>Dolor máximo</span>
                </div>
              </div>
            )
          }
          if (field.type === 'select') {
            return (
              <SelectField
                key={field.id}
                label={field.label}
                value={data[field.id] as string ?? field.options?.[0] ?? ''}
                options={field.options ?? []}
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

function isStepVisible(step: ProtocolStep, data: ProtocolData): boolean {
  if (!step.showIf) return true
  return data[step.showIf.field] === step.showIf.value
}

export default function EvaluationForm({ protocolId, patientId, userId, episodioId }: Props) {
  const protocol = protocols[protocolId]
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('redflags')
  const [redFlagsData, setRedFlagsData] = useState<RedFlagsData | null>(null)
  const [redFlagsResult, setRedFlagsResult] = useState<RedFlagResult | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState<ProtocolData>(buildInitialData(protocol))
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  // Filter visible steps based on current data
  const visibleSteps = protocol.steps.filter(step => isStepVisible(step, data))
  const currentStep = visibleSteps[currentStepIndex] ?? visibleSteps[0]
  const isLastStep = currentStepIndex === visibleSteps.length - 1
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

  function handleChange(key: string, value: boolean | number | string | null) {
    setData(prev => ({ ...prev, [key]: value }) as ProtocolData)
  }

  function handleNext() {
    // Recalculate visible steps with updated data before advancing
    const nextIndex = currentStepIndex + 1
    setCurrentStepIndex(nextIndex)
  }

  function handleBack() {
    setCurrentStepIndex(i => Math.max(0, i - 1))
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
        episodioId: episodioId || null,
      }),
    })
    if (res.ok) {
      router.push(`/dashboard/pacientes/${patientId}`)
      router.refresh()
    }
    setLoading(false)
  }

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
              : phase === 'evaluation' && i === 1 ? 'bg-primary text-on-primary'
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
            {visibleSteps.map((step, i) => (
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
                {i < visibleSteps.length - 1 && <div className="w-6 h-px bg-outline-variant mx-1" />}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                showResult ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {visibleSteps.length + 1}
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
                  <Button variant="outline" onClick={handleBack} className="border-outline-variant">
                    ← Atrás
                  </Button>
                )}
                {isLastStep ? (
                  <Button onClick={() => setShowResult(true)} className="flex-1 bg-primary text-on-primary">
                    Ver resultado →
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex-1 bg-primary text-on-primary">
                    Continuar →
                  </Button>
                )}
              </div>
            </>
          )}
        </>
      )}

      <FloatingNoteButton patientId={patientId} userId={userId} />
    </div>
  )
}