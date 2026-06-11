// API Route: PATCH /api/episodios/[id] - Update episode (close, rename)
// API Route: DELETE /api/episodios/[id] - Delete episode

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()

    const episode = await prisma.episode.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.status && { status: body.status }),
        ...(body.status === 'CLOSED' && { closedAt: new Date() }),
        ...(body.status === 'OPEN' && { closedAt: null }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    })

    return NextResponse.json(episode)
  } catch (error) {
    console.error('Error updating episode:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params

    // Unlink evaluations before deleting
    await prisma.evaluation.updateMany({
      where: { episodeId: id },
      data: { episodeId: null },
    })

    await prisma.episode.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting episode:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}