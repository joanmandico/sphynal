import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { patientId, userId, bodyArea, data, diagnosis, episodioId } = body

    if (!patientId || !userId || !bodyArea || !data) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        patientId,
        userId,
        bodyArea,
        data,
        diagnosis: diagnosis || null,
        ...(episodioId && { episodeId: episodioId }),
      },
    })

    return NextResponse.json(evaluation, { status: 201 })
  } catch (error) {
    console.error('Error creating evaluation:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}