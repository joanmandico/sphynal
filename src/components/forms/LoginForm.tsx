'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-headline font-bold text-on-surface mb-1">
          Iniciar sesión
        </h2>
        <p className="text-sm text-on-surface-variant">
          Accede a tu cuenta de Sphynal
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs font-bold text-on-surface-variant uppercase tracking-wider"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="fisio@clinica.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-xs font-bold text-on-surface-variant uppercase tracking-wider"
          >
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <Button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-primary text-on-primary hover:opacity-90 font-bold py-3"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </div>
  )
}