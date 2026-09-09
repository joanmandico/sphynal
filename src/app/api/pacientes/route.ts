// API Route: POST /api/pacientes
// Creates a new patient in the database

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, birthDate, occupation, sport, phone, dni, address, email, userId } = body

    if (!firstName || !lastName || !birthDate || !userId) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Get or create a default clinic for this user
    let clinic = await prisma.clinic.findFirst({
      where: { users: { some: { id: userId } } },
    })

    if (!clinic) {
      // Create a default clinic and user profile if they don't exist
      clinic = await prisma.clinic.create({
        data: {
          name: 'Mi clínica',
          users: {
            create: {
              id: userId,
              email: '',
              name: 'Fisioterapeuta',
            },
          },
        },
      })
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        birthDate: new Date(birthDate),
        occupation: occupation || null,
        sport: sport || null,
        phone: phone || null,
        dni: dni || null,
        address: address || null,
        email: email || null,
        userId,
        clinicId: clinic.id,
      },
    })

    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}