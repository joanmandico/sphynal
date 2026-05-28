import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyzeShoulderEvaluation, ShoulderEvaluationData } from '@/lib/algorithms/shoulder'
import { analyzeRedFlags, RedFlagsData } from '@/lib/algorithms/redflags'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params

    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
      include: { patient: true },
    })

    if (!evaluation) {
      return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 })
    }

    const data = evaluation.data as {
      redFlags?: RedFlagsData
      shoulder?: ShoulderEvaluationData
    }

    const shoulderData = (data.shoulder || data) as ShoulderEvaluationData
    const redFlagsData = data.redFlags as RedFlagsData | undefined

    const diagnosis = analyzeShoulderEvaluation(shoulderData)
    const redFlagsResult = redFlagsData
      ? analyzeRedFlags(redFlagsData)
      : { hasRedFlags: false, critical: [], warnings: [], shouldRefer: [], canContinue: true }

    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { InformeHombro } = await import('@/lib/pdf/InformeHombro')
    const React = await import('react')

    const element = React.default.createElement(InformeHombro, {
      patient: evaluation.patient,
      evaluationDate: evaluation.date,
      redFlagsData: redFlagsData ?? {} as RedFlagsData,
      redFlagsResult,
      shoulderData,
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