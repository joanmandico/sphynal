// Configuración — datos del centro y del fisioterapeuta

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import ConfiguracionForm from '@/components/forms/ConfiguracionForm'

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { clinic: true },
  })

  if (!dbUser) redirect('/login')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">
          Configuración
        </h1>
        <p className="text-on-surface-variant mt-1">
          Datos del centro y del profesional
        </p>
      </div>
      <ConfiguracionForm user={dbUser} clinic={dbUser.clinic} />
    </div>
  )
}