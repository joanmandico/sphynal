'use client'

// EVA Pain Evolution Chart - Client Component
// Shows pain level over time across evaluations

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Evaluation {
  id: string
  date: Date
  diagnosis: string | null
  data: unknown
}

interface Props {
  evaluations: Evaluation[]
}

function getEVA(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null
  const d = data as Record<string, unknown>

  // Try to get EVA from shoulder data
  const shoulder = d.shoulder as Record<string, unknown> | undefined
  if (shoulder?.eva !== undefined) return Number(shoulder.eva)

  // Try direct EVA field
  if (d.eva !== undefined) return Number(d.eva)

  return null
}

export default function GraficoEVA({ evaluations }: Props) {
  const dataPoints = evaluations
    .map((e) => {
      const eva = getEVA(e.data)
      return {
        fecha: new Date(e.date).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
        }),
        eva,
        diagnostico: e.diagnosis || 'Sin diagnóstico',
      }
    })
    .filter((d) => d.eva !== null)
    .reverse()

  if (dataPoints.length < 2) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-8 text-center">
        <p className="text-4xl mb-3">📈</p>
        <p className="text-on-surface font-semibold mb-1">
          Sin datos suficientes
        </p>
        <p className="text-on-surface-variant text-sm">
          Se necesitan al menos 2 evaluaciones con puntuación EVA para mostrar la evolución
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-6">
      <div className="mb-6">
        <h3 className="font-headline font-bold text-on-surface">Evolución del dolor</h3>
        <p className="text-xs text-on-surface-variant mt-1">Escala EVA (0-10)</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dataPoints} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="fecha"
            tick={{ fontSize: 11, fill: '#566166' }}
            axisLine={{ stroke: '#a9b4b9' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: '#566166' }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8eff3',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${value}/10`, 'Dolor EVA']}
          />
          <Line
            type="monotone"
            dataKey="eva"
            stroke="#0e5eaf"
            strokeWidth={2.5}
            dot={{ fill: '#0e5eaf', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#0e5eaf' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}