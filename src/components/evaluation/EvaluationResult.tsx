'use client'

// Generic evaluation result - Client Component
// Shows diagnosis and treatment for any protocol

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DiagnosisResult } from '@/lib/protocols/types'

interface Props {
  diagnosis: DiagnosisResult
  onBack: () => void
  onSave: () => void
  loading: boolean
}

export default function EvaluationResult({ diagnosis, onBack, onSave, loading }: Props) {
  return (
    <div className="max-w-3xl space-y-4">
      {/* Referral alert */}
      {diagnosis.shouldRefer && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 text-xl">⚠️</span>
            <h3 className="font-headline font-bold text-red-700">Derivación recomendada</h3>
          </div>
          <p className="text-sm text-red-700">{diagnosis.referReason}</p>
        </div>
      )}

      {/* Diagnosis card */}
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

          {diagnosis.comparableSign && diagnosis.comparableSign.length > 0 && (
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

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-outline-variant"
        >
          ← Revisar
        </Button>
        <Button
          onClick={onSave}
          disabled={loading}
          className="flex-1 bg-primary text-on-primary"
        >
          {loading ? 'Guardando...' : 'Guardar evaluación'}
        </Button>
      </div>
    </div>
  )
}