import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { patientId, userId, bodyArea, data, diagnosis, episodioId, history } = body

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
        ...(history && {
          clinicalHistory: {
            create: {
              laborActivity: history.laborActivity || null,
              sportsActivity: history.sportsActivity || null,
              hasPreviousDiagnosis: history.hasPreviousDiagnosis ?? null,
              previousDiagnosisWhat: history.previousDiagnosisWhat || null,
              previousDiagnosisBy: history.previousDiagnosisBy || null,
              consultReason: history.consultReason || '',
              painCharacterType: history.painCharacterType || null,
              radiatesPain: history.radiatesPain ?? null,
              radiatesTo: history.radiatesTo || null,
              neurologicalSigns: history.neurologicalSigns ?? null,
              neurologicalSignsDetail: history.neurologicalSignsDetail || null,
              jointClicking: history.jointClicking ?? null,
              lockingSensation: history.lockingSensation ?? null,
              apprehension: history.apprehension ?? null,
              painTiming: history.painTiming || null,
              painEVA: history.painEVA ?? null,
              aggravatingFactors: history.aggravatingFactors || null,
              relievingFactors: history.relievingFactors || null,
              onsetDescription: history.onsetDescription || null,
              onsetMechanism: history.onsetMechanism || null,
              evolution: history.evolution || null,
              evolutionDetail: history.evolutionDetail || null,
              previousTreatments: history.previousTreatments || null,
              relevantMedicalHistory: history.relevantMedicalHistory || null,
              hasMedication: history.hasMedication ?? null,
              medicationDetail: history.medicationDetail || null,
              hasAllergies: history.hasAllergies ?? null,
              allergyDetail: history.allergyDetail || null,
            },
          },
        }),
      },
      include: { clinicalHistory: true },
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