'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: Date
  dni: string | null
  address: string | null
  phone: string | null
  email: string | null
}

interface User {
  id: string
  name: string
  collegiateNumber: string | null
  specialty: string | null
}

interface Clinic {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  nif: string | null
}

interface Props {
  patient: Patient
  user: User
  clinic: Clinic
}

export default function ConsentimientoForm({ patient, user, clinic }: Props) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear()
  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  // Canvas drawing setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setDrawing(true)
    setHasSigned(true)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pos = getPos(e, canvas)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  function stopDraw() { setDrawing(false) }

  function clearSignature() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSigned(false)
  }

  async function handleSave() {
    const canvas = canvasRef.current
    if (!canvas || !hasSigned) return
    setLoading(true)
    const signature = canvas.toDataURL('image/png')
    const res = await fetch('/api/consentimiento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: patient.id, signature }),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => router.push(`/dashboard/pacientes/${patient.id}`), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Documento */}
      <div className="bg-white border border-outline-variant/20 rounded-xl p-8 shadow-sm space-y-6 text-sm text-on-surface">

        {/* Cabecera centro */}
        <div className="border-b border-outline-variant/20 pb-6">
          <h2 className="text-lg font-headline font-bold text-on-surface">{clinic.name}</h2>
          {clinic.nif && <p className="text-on-surface-variant">NIF/CIF: {clinic.nif}</p>}
          {clinic.address && <p className="text-on-surface-variant">{clinic.address}</p>}
          {clinic.phone && <p className="text-on-surface-variant">Tel: {clinic.phone}</p>}
          {clinic.email && <p className="text-on-surface-variant">{clinic.email}</p>}
        </div>

        {/* Título */}
        <div className="text-center py-4">
          <h1 className="text-xl font-headline font-extrabold text-on-surface uppercase tracking-wide">
            Consentimiento Informado para Tratamiento de Fisioterapia
          </h1>
        </div>

        {/* Datos del paciente */}
        <div className="bg-surface-container-low rounded-lg p-4 space-y-1">
          <h3 className="font-bold text-on-surface mb-2">Datos del paciente</h3>
          <p><span className="font-semibold">Nombre y apellidos:</span> {patient.firstName} {patient.lastName}</p>
          <p><span className="font-semibold">Edad:</span> {age} años</p>
          <p><span className="font-semibold">Fecha de nacimiento:</span> {new Date(patient.birthDate).toLocaleDateString('es-ES')}</p>
          {patient.dni && <p><span className="font-semibold">DNI:</span> {patient.dni}</p>}
          {patient.address && <p><span className="font-semibold">Domicilio:</span> {patient.address}</p>}
          {patient.phone && <p><span className="font-semibold">Teléfono:</span> {patient.phone}</p>}
          {patient.email && <p><span className="font-semibold">Correo electrónico:</span> {patient.email}</p>}
        </div>

        {/* Datos del profesional */}
        <div className="bg-surface-container-low rounded-lg p-4 space-y-1">
          <h3 className="font-bold text-on-surface mb-2">Profesional responsable</h3>
          <p><span className="font-semibold">Nombre:</span> {user.name}</p>
          {user.collegiateNumber && <p><span className="font-semibold">Número de colegiado:</span> {user.collegiateNumber}</p>}
          {user.specialty && <p><span className="font-semibold">Especialidad:</span> {user.specialty}</p>}
        </div>

        {/* Cuerpo del consentimiento */}
        <div className="space-y-4 leading-relaxed">
          <p>
            El/la fisioterapeuta abajo firmante informa al paciente de que el tratamiento de fisioterapia
            puede incluir técnicas de terapia manual, ejercicio terapéutico, electroterapia y otras
            modalidades fisioterapéuticas, adaptadas a su situación clínica particular.
          </p>
          <p>
            El paciente declara haber sido informado de manera comprensible sobre el diagnóstico,
            el plan de tratamiento propuesto, los posibles riesgos y alternativas disponibles,
            y ha tenido la oportunidad de formular todas las preguntas que ha considerado oportunas.
          </p>
          <p>
            El paciente consiente libremente someterse al tratamiento de fisioterapia y entiende
            que puede revocar este consentimiento en cualquier momento sin necesidad de justificación.
          </p>

          <div className="border border-outline-variant/20 rounded-lg p-4 bg-surface-container-low">
            <h3 className="font-bold mb-2">Protección de datos (RGPD)</h3>
            <p className="text-xs text-on-surface-variant">
              De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD),
              le informamos de que sus datos personales serán tratados por <strong>{clinic.name}</strong> con
              la finalidad de gestión clínica y prestación de servicios de fisioterapia. Sus datos no serán
              cedidos a terceros salvo obligación legal. Puede ejercer sus derechos de acceso, rectificación,
              supresión y portabilidad contactando con nosotros en {clinic.email || 'nuestras instalaciones'}.
            </p>
          </div>
        </div>

        {/* Firma */}
        <div className="pt-4 space-y-4">
          <p className="font-semibold">En {clinic.address?.split(',').pop()?.trim() || '________'}, a {today}</p>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Firma del paciente</p>
              <div className="border-2 border-dashed border-outline-variant/40 rounded-lg overflow-hidden bg-surface-container-lowest">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  className="w-full touch-none cursor-crosshair"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={stopDraw}
                />
              </div>
              <button
                onClick={clearSignature}
                className="text-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                Borrar firma
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Fisioterapeuta</p>
              <div className="border border-outline-variant/20 rounded-lg p-4 h-[150px] flex flex-col justify-end">
                <p className="font-semibold">{user.name}</p>
                {user.collegiateNumber && <p className="text-xs text-on-surface-variant">Nº col. {user.collegiateNumber}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      {saved ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-700 font-bold">✓ Consentimiento guardado correctamente</p>
          <p className="text-green-600 text-sm">Redirigiendo a la ficha del paciente...</p>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={!hasSigned || loading}
            className="flex-1 bg-primary text-on-primary hover:opacity-90"
          >
            {loading ? 'Guardando...' : 'Guardar consentimiento firmado'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-outline-variant"
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  )
}