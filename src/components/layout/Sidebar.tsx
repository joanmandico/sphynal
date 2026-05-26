'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/dashboard/pacientes', label: 'Pacientes', icon: '👥' },
  { href: '/dashboard/evaluaciones', label: 'Protocolos', icon: '📋' },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col py-6 z-50">
      {/* Logo */}
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold font-headline text-primary">Sphynal</h1>
        <p className="text-[10px] tracking-widest uppercase opacity-50 font-bold mt-1">
          Motor Clínico
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-l-lg ${
                isActive
                  ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high translate-x-1'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-bright'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* New evaluation CTA */}
      <div className="px-6 mb-6">
        <Link
          href="/dashboard/pacientes"
          className="w-full py-3 px-4 rounded-lg bg-primary text-on-primary flex items-center justify-center gap-2 font-headline font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
        >
          + Nueva Evaluación
        </Link>
      </div>

      {/* Footer */}
      <div className="px-4 border-t border-outline-variant/10 pt-4 space-y-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-on-surface-variant hover:text-on-surface transition-colors text-sm"
        >
          <span>🚪</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}