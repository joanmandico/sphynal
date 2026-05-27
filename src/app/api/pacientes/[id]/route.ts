// API Route: PUT /api/pacientes/[id] - Update patient
// API Route: DELETE /api/pacientes/[id] - Delete patient and evaluations

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Props {
  params: Promise<{ id: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const { firstName, lastName, birthDate, occupation, sport } = body

    if (!firstName || !lastName || !birthDate) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        firstName,
        lastName,
        birthDate: new Date(birthDate),
        occupation: occupation || null,
        sport: sport || null,
      },
    })

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params

    // Delete evaluations first (foreign key constraint)
    await prisma.evaluation.deleteMany({ where: { patientId: id } })

    // Then delete patient
    await prisma.patient.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}