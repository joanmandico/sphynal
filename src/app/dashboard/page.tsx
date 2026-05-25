import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Inicio</h1>
        <p className="text-slate-500 mt-1">Resumen de tu actividad clínica</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Pacientes</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
          <p className="text-xs text-slate-400 mt-1">Total registrados</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Evaluaciones</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
          <p className="text-xs text-slate-400 mt-1">Este mes</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Informes</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
          <p className="text-xs text-slate-400 mt-1">Generados</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900">Pacientes recientes</h2>
          <Link
            href="/dashboard/pacientes/nuevo"
            className="text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
          >
            + Nuevo paciente
          </Link>
        </div>
        <div className="px-6 py-12 text-center">
          <p className="text-slate-400 text-sm">No hay pacientes todavía</p>
          <p className="text-slate-400 text-xs mt-1">Crea tu primer paciente para empezar</p>
        </div>
      </div>
    </div>
  )
}