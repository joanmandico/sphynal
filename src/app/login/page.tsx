import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/forms/LoginForm'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-headline font-extrabold text-primary mb-2">
            Sphynal
          </h1>
          <p className="text-on-surface-variant font-medium">
            Motor de decisión clínica
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-8">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-on-surface-variant mt-6">
          Sphynal © 2026 — Uso exclusivo para profesionales sanitarios
        </p>
      </div>
    </main>
  )
}