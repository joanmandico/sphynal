// API Route: DELETE /api/notas/[id] - Delete clinical note

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    await prisma.clinicalNote.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}