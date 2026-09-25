'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ClinicalHistoryData,
  initialClinicalHistoryData,
  PainCharacterType,
  PainTiming,
  EvolutionType,
} from '@/types/clinical-history'

interface Props {
  onComplete: (data: ClinicalHistoryData) => void
  initialData?: ClinicalHistoryData
}

function YesNoField({ label, value, onChange }: {
  label: string
  value: boolean | null
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
      <span className="text-sm text-on-surface">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            value === true
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant'
          }`}
        >Sí</button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            value === false
              ? 'bg-surface-container-highest text-on-surface border border-outline-variant'
              : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant'
          }`}
        >No</button>
      </div>
    </div>
  )
}

function TextField({ label, value, onChange, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-on-surface">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
      />
    </div>
  )
}

function TextAreaField({ label, value, onChange, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-on-surface">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full text-sm bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-on-surface resize-none"
      />
    </div>
  )
}

function SelectField({ label, value, options, onChange }: {
  label: string
  value: string
  options: { value: string; label: string }[]
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
        <option value="">Seleccionar...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

export default function ClinicalHistoryForm({ onComplete, initialData }: Props) {
  const [data, setData] = useState<ClinicalHistoryData>(initialData ?? initialClinicalHistoryData)

  function set<K extends keyof ClinicalHistoryData>(key: K, value: ClinicalHistoryData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-4">
      {/* Datos generales */}
      <Card>
        <CardHeader><CardTitle className="text-base">Datos generales</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <TextField label="Actividad laboral" value={data.laborActivity} onChange={(v) => set('laborActivity', v)} />
          <TextField label="Práctica deportiva habitual" value={data.sportsActivity} onChange={(v) => set('sportsActivity', v)} />
        </CardContent>
      </Card>

      {/* 1. Diagnóstico previo */}
      <Card>
        <CardHeader><CardTitle className="text-base">Diagnóstico previo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <YesNoField label="¿Diagnóstico médico previo?" value={data.hasPreviousDiagnosis} onChange={(v) => set('hasPreviousDiagnosis', v)} />
          {data.hasPreviousDiagnosis && (
            <>
              <TextField label="¿De qué fue diagnosticado?" value={data.previousDiagnosisWhat} onChange={(v) => set('previousDiagnosisWhat', v)} />
              <TextField label="¿Por qué profesional?" value={data.previousDiagnosisBy} onChange={(v) => set('previousDiagnosisBy', v)} />
            </>
          )}
        </CardContent>
      </Card>

      {/* 2. Motivo de consulta */}
      <Card>
        <CardHeader><CardTitle className="text-base">Motivo de consulta</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <TextField
            label="Localización"
            value={data.consultLocation}
            onChange={(v) => set('consultLocation', v)}
            placeholder="Ej: hombro derecho, zona lumbar..."
          />
          <TextAreaField
            label="Descripción del motivo de consulta"
            value={data.consultReason}
            onChange={(v) => set('consultReason', v)}
            placeholder="El paciente acude por..."
          />
        </CardContent>
      </Card>

      {/* 3. Características del dolor */}
      <Card>
        <CardHeader><CardTitle className="text-base">Características del dolor</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <SelectField
            label="Tipo de dolor"
            value={data.painCharacterType ?? ''}
            options={[
              { value: 'PUNTUAL', label: 'A punta de dedo' },
              { value: 'GENERAL', label: 'General' },
            ]}
            onChange={(v) => set('painCharacterType', v as PainCharacterType)}
          />
          <YesNoField label="¿Irradia a otra zona?" value={data.radiatesPain} onChange={(v) => set('radiatesPain', v)} />
          {data.radiatesPain && (
            <TextField label="¿Hacia dónde irradia?" value={data.radiatesTo} onChange={(v) => set('radiatesTo', v)} />
          )}
          <YesNoField label="¿Signos neurológicos?" value={data.neurologicalSigns} onChange={(v) => set('neurologicalSigns', v)} />
          {data.neurologicalSigns && (
            <TextField label="Especificar signos neurológicos" value={data.neurologicalSignsDetail} onChange={(v) => set('neurologicalSignsDetail', v)} />
          )}
          <YesNoField label="¿Chasquidos o ruidos articulares?" value={data.jointClicking} onChange={(v) => set('jointClicking', v)} />
          <YesNoField label="¿Sensación de bloqueo?" value={data.lockingSensation} onChange={(v) => set('lockingSensation', v)} />
          <YesNoField label="¿Aprehensión (sensación de que la articulación se va a salir)?" value={data.apprehension} onChange={(v) => set('apprehension', v)} />
        </CardContent>
      </Card>

      {/* 4. Comportamiento temporal */}
      <Card>
        <CardHeader><CardTitle className="text-base">Comportamiento temporal</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <SelectField
            label="Comportamiento temporal del dolor"
            value={data.painTiming ?? ''}
            options={[
              { value: 'DIA', label: 'Durante el día' },
              { value: 'NOCHE', label: 'Durante la noche' },
              { value: 'AMBOS', label: 'Ambos' },
            ]}
            onChange={(v) => set('painTiming', v as PainTiming)}
          />
          <div className="space-y-3 py-2">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Intensidad del dolor (EVA)</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={data.painEVA}
                onChange={(e) => set('painEVA', Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-2xl font-headline font-extrabold text-primary w-16 text-center">
                {data.painEVA}/10
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Factores agravantes y aliviantes */}
      <Card>
        <CardHeader><CardTitle className="text-base">Factores agravantes y aliviantes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <TextAreaField label="Factores que empeoran los síntomas" value={data.aggravatingFactors} onChange={(v) => set('aggravatingFactors', v)} />
          <TextAreaField label="Factores que alivian los síntomas" value={data.relievingFactors} onChange={(v) => set('relievingFactors', v)} />
        </CardContent>
      </Card>

      {/* 6. Inicio */}
      <Card>
        <CardHeader><CardTitle className="text-base">Inicio</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <TextField label="¿Cuándo comenzó el problema?" value={data.onsetDescription} onChange={(v) => set('onsetDescription', v)} />
          <TextField label="¿Con qué coincidió el inicio? (traumatismo, sobreesfuerzo, estrés...)" value={data.onsetMechanism} onChange={(v) => set('onsetMechanism', v)} />
        </CardContent>
      </Card>

      {/* 7. Evolución */}
      <Card>
        <CardHeader><CardTitle className="text-base">Evolución</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <SelectField
            label="Evolución de los síntomas"
            value={data.evolution ?? ''}
            options={[
              { value: 'MEJORANDO', label: 'Mejorando' },
              { value: 'EMPEORANDO', label: 'Empeorando' },
              { value: 'IGUAL', label: 'Se mantiene igual' },
              { value: 'ALTIBAJOS', label: 'Con altibajos' },
            ]}
            onChange={(v) => set('evolution', v as EvolutionType)}
          />
          {data.evolution === 'ALTIBAJOS' && (
            <TextField label="¿Con qué coinciden los altibajos?" value={data.evolutionDetail} onChange={(v) => set('evolutionDetail', v)} />
          )}
        </CardContent>
      </Card>

      {/* 8. Antecedentes */}
      <Card>
        <CardHeader><CardTitle className="text-base">Antecedentes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <TextField label="Tratamientos previos realizados y efecto obtenido" value={data.previousTreatments} onChange={(v) => set('previousTreatments', v)} />
          <TextField label="Antecedentes médicos relevantes" value={data.relevantMedicalHistory} onChange={(v) => set('relevantMedicalHistory', v)} />
          <YesNoField label="¿Toma medicación habitual?" value={data.hasMedication} onChange={(v) => set('hasMedication', v)} />
          {data.hasMedication && (
            <TextField label="¿Cuál?" value={data.medicationDetail} onChange={(v) => set('medicationDetail', v)} />
          )}
          <YesNoField label="¿Alergias?" value={data.hasAllergies} onChange={(v) => set('hasAllergies', v)} />
          {data.hasAllergies && (
            <TextField label="¿A qué?" value={data.allergyDetail} onChange={(v) => set('allergyDetail', v)} />
          )}
        </CardContent>
      </Card>

      <Button onClick={() => onComplete(data)} className="w-full bg-primary text-on-primary">
        Continuar a Red Flags →
      </Button>
    </div>
  )
}