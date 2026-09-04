// API Route: POST /api/consentimiento - Save signed consent

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { patientId, signature } = await req.json()

    if (!patientId || !signature) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const consent = await prisma.consent.create({
      data: {
        id: crypto.randomUUID(),
        patientId,
        userId: user.id,
        signature,
      },
    })

    return NextResponse.json(consent)
  } catch (error) {
    console.error('Error saving consent:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}