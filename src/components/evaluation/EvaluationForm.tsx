'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { protocols } from '@/lib/protocols'
import { ProtocolData, ProtocolSection } from '@/lib/protocols/types'
import { buildInitialData, isSectionVisible, isFieldVisible, runDiagnosis } from '@/lib/protocols/engine'
import EvaluationResult from './EvaluationResult'

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
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState<ProtocolData>(buildInitialData(protocol))
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const currentStep = protocol.steps[currentStepIndex]
  const isLastStep = currentStepIndex === protocol.steps.length - 1
  const diagnosis = runDiagnosis(protocol, data)

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
        data: { [protocol.id]: data },
        diagnosis: diagnosis.primary,
      }),
    })
    if (res.ok) {
      router.push(`/dashboard/pacientes/${patientId}`)
      router.refresh()
    }
    setLoading(false)
  }

  if (showResult) {
    return (
      <EvaluationResult
        diagnosis={diagnosis}
        onBack={() => setShowResult(false)}
        onSave={handleSave}
        loading={loading}
      />
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
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
    </div>
  )
}