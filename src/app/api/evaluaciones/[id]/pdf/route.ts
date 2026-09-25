import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyzeRedFlags, RedFlagsData } from '@/lib/algorithms/redflags'
import { shoulderProtocol } from '@/lib/protocols'
import { ShoulderData } from '@/lib/protocols/schema'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params

    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
      include: { patient: true, clinicalHistory: true },
    })

    if (!evaluation) {
      return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 })
    }

    const data = evaluation.data as {
      redFlags?: RedFlagsData
      shoulder?: ShoulderData
      blocked?: boolean
    }

    const blocked = data.blocked === true
    const redFlagsData = data.redFlags as RedFlagsData | undefined
    const redFlagsResult = redFlagsData
      ? analyzeRedFlags(redFlagsData)
      : { hasRedFlags: false, critical: [], warnings: [], shouldRefer: [], canContinue: true }

    const shoulderData = blocked ? null : ((data.shoulder || data) as ShoulderData)
    const diagnosis = shoulderData
      ? shoulderProtocol.diagnose(shoulderData as Record<string, unknown>)
      : null

    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { InformeHombro } = await import('@/lib/pdf/InformeHombro')
    const React = await import('react')

    const element = React.default.createElement(InformeHombro, {
      patient: evaluation.patient,
      evaluationDate: evaluation.date,
      clinicalHistory: evaluation.clinicalHistory,
      redFlagsData: redFlagsData ?? {} as RedFlagsData,
      redFlagsResult,
      shoulderData: shoulderData as Record<string, unknown> | null,
      diagnosis,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(element as any)

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="informe-hombro-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Error generando el PDF' }, { status: 500 })
  }
}