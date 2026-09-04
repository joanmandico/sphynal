// API Route: PUT /api/configuracion/clinic - Update clinic data

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

    const { name, address, phone, email, nif } = await req.json()

    const clinic = await prisma.clinic.update({
      where: { id: dbUser.clinicId },
      data: {
        name: name || undefined,
        address: address || null,
        phone: phone || null,
        email: email || null,
        nif: nif || null,
      },
    })

    return NextResponse.json(clinic)
  } catch (error) {
    console.error('Error updating clinic:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}