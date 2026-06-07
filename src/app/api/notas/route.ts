// API Route: POST /api/notas - Create clinical note
// API Route: GET /api/notas?patientId=xxx - Get notes for patient

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get('patientId')

    if (!patientId) {
      return NextResponse.json({ error: 'Falta patientId' }, { status: 400 })
    }

    const notes = await prisma.clinicalNote.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { content, patientId, userId } = body

    if (!content || !patientId || !userId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const note = await prisma.clinicalNote.create({
      data: { content, patientId, userId },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}