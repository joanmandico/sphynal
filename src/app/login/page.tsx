// Login page - Server Component
// Handles authentication via Supabase Auth

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/forms/LoginForm'

export default async function LoginPage() {
  // If user is already logged in, redirect to dashboard
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Sphynal</h1>
          <p className="text-slate-500 mt-2">Motor de decisión clínica</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}