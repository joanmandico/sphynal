// Dashboard page - Server Component
// Protected route: redirects to login if not authenticated

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  // Check authentication on the server
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-500 mb-8">Bienvenido a Sphynal</p>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-slate-600">
            Sesión activa: <span className="font-medium">{user.email}</span>
          </p>
        </div>
      </div>
    </main>
  )
}