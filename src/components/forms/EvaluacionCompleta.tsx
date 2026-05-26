'use client'

import { useState } from 'react'
import RedFlagsForm from './RedFlagsForm'
import EvaluacionHombro from './EvaluacionHombro'
import { RedFlagsData, RedFlagResult } from '@/lib/algorithms/redflags'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  patientId: string
  userId: string
}

type Phase = 'redflags' | 'warning' | 'evaluation'

export default function EvaluacionCompleta({ patientId, userId }: Props) {
  const [phase, setPhase] = useState<Phase>('redflags')
  const [redFlagsResult, setRedFlagsResult] = useState<RedFlagResult | null>(null)
  const [redFlagsData, setRedFlagsData] = useState<RedFlagsData | null>(null)

  function handleRedFlagsComplete(data: RedFlagsData, result: RedFlagResult) {
    setRedFlagsData(data)
    setRedFlagsResult(result)
    if (result.hasRedFlags) {
      setPhase('warning')
    } else {
      setPhase('evaluation')
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            phase === 'redflags' ? 'bg-primary text-on-primary' : 'bg-green-500 text-white'
          }`}>
            {phase === 'redflags' ? '1' : '✓'}
          </div>
          <span className={`text-sm font-semibold ${
            phase === 'redflags' ? 'text-on-surface' : 'text-on-surface-variant'
          }`}>
            Red Flags
          </span>
        </div>
        <div className="w-12 h-px bg-outline-variant mx-2" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            phase === 'evaluation' ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
          }`}>
            2
          </div>
          <span className={`text-sm font-semibold ${
            phase === 'evaluation' ? 'text-on-surface' : 'text-on-surface-variant'
          }`}>
            Evaluación Hombro
          </span>
        </div>
      </div>

      {/* Red Flags phase */}
      {phase === 'redflags' && (
        <RedFlagsForm onComplete={handleRedFlagsComplete} />
      )}

      {/* Warning phase */}
      {phase === 'warning' && redFlagsResult && (
        <div className="max-w-3xl space-y-4">
          {redFlagsResult.critical.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 text-xl">⚠️</span>
                <h3 className="font-headline font-bold text-red-700">Red Flags críticas detectadas</h3>
              </div>
              <ul className="space-y-2">
                {redFlagsResult.critical.map((flag, i) => (
                  <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block flex-shrink-0" />
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
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block flex-shrink-0" />
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

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setPhase('redflags')}
              className="border-outline-variant"
            >
              ← Revisar red flags
            </Button>
            {redFlagsResult.canContinue ? (
              <Button
                onClick={() => setPhase('evaluation')}
                className="flex-1 bg-primary text-on-primary hover:opacity-90"
              >
                Continuar a evaluación del hombro →
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
        <EvaluacionHombro patientId={patientId} userId={userId} />
      )}
    </div>
  )
}