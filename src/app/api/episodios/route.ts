// API Route: GET /api/episodios?patientId=xxx - Get episodes for patient
// API Route: POST /api/episodios - Create episode

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get('patientId')
    if (!patientId) {
      return NextResponse.json({ error: 'Falta patientId' }, { status: 400 })
    }

    const episodes = await prisma.episode.findMany({
      where: { patientId },
      include: {
        evaluations: {
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { openedAt: 'desc' },
    })

    return NextResponse.json(episodes)
  } catch (error) {
    console.error('Error fetching episodes:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, regions, patientId, userId } = body

    if (!name || !patientId || !userId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const episode = await prisma.episode.create({
      data: {
        name,
        regions: regions || [],
        patientId,
        userId,
      },
    })

    return NextResponse.json(episode, { status: 201 })
  } catch (error) {
    console.error('Error creating episode:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}