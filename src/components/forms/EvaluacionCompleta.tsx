'use client'

// EvaluacionCompleta - Client Component
// Orchestrates: Red Flags → Shoulder Evaluation

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
      <div className="flex gap-2 mb-8">
        <div className={`flex items-center gap-2`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            phase === 'redflags' ? 'bg-slate-900 text-white' : 'bg-green-500 text-white'
          }`}>
            {phase === 'redflags' ? '1' : '✓'}
          </div>
          <span className={`text-sm ${phase === 'redflags' ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
            Red Flags
          </span>
        </div>
        <div className="w-8 h-px bg-slate-200 self-center mx-1" />
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            phase === 'evaluation' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            2
          </div>
          <span className={`text-sm ${phase === 'evaluation' ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
            Evaluación Hombro
          </span>
        </div>
      </div>

      {/* Red Flags phase */}
      {phase === 'redflags' && (
        <RedFlagsForm onComplete={handleRedFlagsComplete} />
      )}

      {/* Warning phase — red flags found */}
      {phase === 'warning' && redFlagsResult && (
        <div className="max-w-3xl space-y-4">
          {redFlagsResult.critical.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">⚠️ Red Flags críticas detectadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {redFlagsResult.critical.map((flag, i) => (
                    <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {redFlagsResult.warnings.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-700">⚡ Avisos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {redFlagsResult.warnings.map((w, i) => (
                    <li key={i} className="text-sm text-yellow-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
                      {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {redFlagsResult.shouldRefer.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-700">Derivaciones recomendadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {redFlagsResult.shouldRefer.map((r, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="text-blue-500">→</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setPhase('redflags')}>
              ← Revisar red flags
            </Button>
            {redFlagsResult.canContinue && (
              <Button onClick={() => setPhase('evaluation')} className="flex-1">
                Continuar a evaluación del hombro →
              </Button>
            )}
            {!redFlagsResult.canContinue && (
              <div className="flex-1 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center font-medium">
                No se puede continuar con la evaluación — derivación médica urgente requerida
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