'use client'

// Red Flags evaluation form - Client Component
// Must be completed before shoulder evaluation

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analyzeRedFlags, RedFlagsData } from '@/lib/algorithms/redflags'
import { useState, useEffect } from 'react'

interface Props {
  onComplete: (data: RedFlagsData, result: ReturnType<typeof analyzeRedFlags>) => void
  initialData?: RedFlagsData
}

const defaultRedFlagsData: RedFlagsData = {
  dysarthria: null, dysphagia: null, diplopia: null, dizziness: null,
  dropAttacks: null, nystagmus: null, numbness: null, nausea: null,
  acuteVestibularSyndrome: null, headImpulseNormal: null,
  nystagmusVerticalPuro: null, nystagmusCambiaDireccion: null, nystagmusRotatorioPuro: null,
  skewDeviation: null, suddenHearingLoss: null, severeAtaxia: null,
  extensionRotationTest: null, coloracionRojaAzul: null,
  varicesDolorosas: null, aumentoTemperatura: null,
  materialVenoso: null, edemaUnilateral: null,
  dolorExtremidadSuperior: null, otroDiagnosticoCardiovascular: null,
  fracturaDescartadaRx: null, antecedenteTraumatismo: null,
  edadMayor50: null, osteoporosis: null, corticoides: null,
  dolorIntensoMovimiento: null, hinchazoneInflamacion: null,
  limitacionMovimientoHombro: null, deformidad: null,
  sensibilidadPalpacion: null, hematoma: null,
  pruebaAuscultacionDiapason: null,
  fracturaVertebralDescartadaRx: null, antecedenteTraumatismoCuello: null,
  edad65oMas: null, mecanismosPeligrosos: null, colisionTrasera: null,
  puedeEstarSentado: null, ambulanteDesdeAccidente: null,
  retrasoInicioDolor: null, noSignosSensibilidadLineaMedia: null,
  noPuedeRotarCabeza45: null,
  antecedenteTraumatismoCabezaCuello: null, cincoD3N: null,
  sindromeDown: null, artritisReumatoide: null,
  testCizallamientoAnterior: null, testEstrésLigamentoAlar: null,
  sintomatologiaTumor: null, sintomatologiaInfeccion: null,
  afectacionesCutaneas: null, poliartralgia: null,
  problemasMotores: null, problemasSensitivos: null, problemasCognitivos: null,
  nervioOlfatorio: null, agudezaVisual: null, cuadrantesVisuales: null,
  funcionRefleja: null, evaluacionPupila: null, evaluacionMovimientoOcular: null,
  evaluacionSensorial: null, evaluacionReflejoCorneal: null,
  evaluacionMotora: null, evaluacionReflejoMandibula: null,
  nervioFacial: null, evaluacionAuditiva: null, pruebaRinne: null,
  pruebaWeber: null, evaluacionGeneral: null, evaluacionReflejoNauseoso: null,
  nervioAccesorio: null, nervioHipogloso: null,
  marchaScore: 12, equilibrioScore: 16,
  deltoidesIzq: 5, bicepsIzq: 5, extensoresMunecaIzq: 5, tricepsIzq: 5,
  flexorRadialIzq: 5, abductorPulgarIzq: 5, interoseoIzq: 5,
  deltoidesder: 5, bicepsDer: 5, extensoresMunecaDer: 5, tricepsDer: 5,
  flexorRadialDer: 5, abductorPulgarDer: 5, interosDer: 5,
}

function Toggle({
  label, description, value, onChange, locked, lockedMessage
}: {
  label: string
  description?: string
  value: boolean | null
  onChange: (v: boolean | null) => void
  locked?: boolean
  lockedMessage?: string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="pr-4">
        <span className="text-sm text-slate-700 font-semibold">{label}</span>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        {locked && lockedMessage && (
          <p className="text-xs text-amber-600 mt-1 font-semibold">⚠️ {lockedMessage}</p>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          disabled={locked}
          onClick={() => onChange(true)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            value === true ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-white border border-slate-200 text-slate-400'
          } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
        >SI</button>
        <button
          disabled={locked}
          onClick={() => onChange(null)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            value === null ? 'bg-slate-200 text-slate-700 border border-slate-400' : 'bg-white border border-slate-200 text-slate-400'
          } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
        >NV</button>
        <button
          disabled={locked}
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            value === false ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-white border border-slate-200 text-slate-400'
          } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
        >NO</button>
      </div>
    </div>
  )
}

function ScoreInput({
  label, value, max, onChange
}: {
  label: string, value: number, max: number, onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-16 text-center text-sm border border-slate-200 rounded px-2 py-1"
        />
        <span className="text-xs text-slate-400">/{max}</span>
      </div>
    </div>
  )
}

type Section = 'vertebrobasilar' | 'vascular' | 'fracturas' | 'tumor' | 'infeccion' | 'reuma' | 'neural'
type VertebrobasilarSubSection = '5d3n' | 'hints'
type VascularSubSection = 'vascular' | 'tvp'
type FracturaSubSection = 'eess' | 'vertebral' | 'ligamento'

const sections: { id: Section; label: string }[] = [
  { id: 'vertebrobasilar', label: 'Vertebrobasilar' },
  { id: 'vascular', label: 'Vascular' },
  { id: 'fracturas', label: 'Fracturas' },
  { id: 'tumor', label: 'Tumor/Cáncer' },
  { id: 'infeccion', label: 'Infección' },
  { id: 'reuma', label: 'Reuma' },
  { id: 'neural', label: 'Neural Grave' },
]

const vertebrobasilarSubSections: { id: VertebrobasilarSubSection; label: string }[] = [
  { id: '5d3n', label: '5D/3N' },
  { id: 'hints', label: 'HINTS+' },
]

const vascularSubSections: { id: VascularSubSection; label: string }[] = [
  { id: 'vascular', label: 'Vascular' },
  { id: 'tvp', label: 'Trombosis Venosa Profunda (TVP)' },
]

const fracturaSubSections: { id: FracturaSubSection; label: string }[] = [
  { id: 'eess', label: 'Fractura EESS' },
  { id: 'vertebral', label: 'Fractura Vertebral' },
  { id: 'ligamento', label: 'Ligamento Transverso/Alar' },
]

export default function RedFlagsForm({ onComplete, initialData }: Props) {
  const [data, setData] = useState<RedFlagsData>(initialData ?? defaultRedFlagsData)
  const [section, setSection] = useState<Section>('vertebrobasilar')
  const [vbSubSection, setVbSubSection] = useState<VertebrobasilarSubSection>('5d3n')
  const [vascularSubSection, setVascularSubSection] = useState<VascularSubSection>('vascular')
  const [fracturaSubSection, setFracturaSubSection] = useState<FracturaSubSection>('eess')

  const has5D3NPositive = [
    data.dysarthria, data.dysphagia, data.diplopia, data.dizziness,
    data.dropAttacks, data.nystagmus, data.numbness, data.nausea,
  ].some(v => v === true)

  useEffect(() => {
    if (has5D3NPositive && data.extensionRotationTest !== null) {
      setData(prev => ({ ...prev, extensionRotationTest: null }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [has5D3NPositive])

  function set(key: keyof RedFlagsData) {
    return (value: boolean | null | number) =>
      setData(prev => ({ ...prev, [key]: value }))
  }

  const sectionIndex = sections.findIndex(s => s.id === section)
  const isLast = sectionIndex === sections.length - 1
  const vbSubIndex = vertebrobasilarSubSections.findIndex(s => s.id === vbSubSection)
  const vascularSubIndex = vascularSubSections.findIndex(s => s.id === vascularSubSection)
  const fracturaSubIndex = fracturaSubSections.findIndex(s => s.id === fracturaSubSection)

  function handleNext() {
    if (section === 'vertebrobasilar' && vbSubIndex < vertebrobasilarSubSections.length - 1) {
      setVbSubSection(vertebrobasilarSubSections[vbSubIndex + 1].id)
      return
    }
    if (section === 'vascular' && vascularSubIndex < vascularSubSections.length - 1) {
      setVascularSubSection(vascularSubSections[vascularSubIndex + 1].id)
      return
    }
    if (section === 'fracturas' && fracturaSubIndex < fracturaSubSections.length - 1) {
      setFracturaSubSection(fracturaSubSections[fracturaSubIndex + 1].id)
      return
    }
    if (isLast) {
      const result = analyzeRedFlags(data)
      onComplete(data, result)
    } else {
      const next = sections[sectionIndex + 1]
      setSection(next.id)
      if (next.id === 'fracturas') setFracturaSubSection('eess')
      if (next.id === 'vertebrobasilar') setVbSubSection('5d3n')
      if (next.id === 'vascular') setVascularSubSection('vascular')
    }
  }

  function handlePrev() {
    if (section === 'vertebrobasilar' && vbSubIndex > 0) {
      setVbSubSection(vertebrobasilarSubSections[vbSubIndex - 1].id)
      return
    }
    if (section === 'vascular' && vascularSubIndex > 0) {
      setVascularSubSection(vascularSubSections[vascularSubIndex - 1].id)
      return
    }
    if (section === 'fracturas' && fracturaSubIndex > 0) {
      setFracturaSubSection(fracturaSubSections[fracturaSubIndex - 1].id)
      return
    }
    if (sectionIndex > 0) {
      const prev = sections[sectionIndex - 1]
      setSection(prev.id)
      if (prev.id === 'fracturas') setFracturaSubSection('ligamento')
      if (prev.id === 'vertebrobasilar') setVbSubSection('hints')
      if (prev.id === 'vascular') setVascularSubSection('tvp')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              section === s.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Vertebrobasilar — 5D/3N + HINTS+ */}
      {section === 'vertebrobasilar' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 pl-3 border-l-2 border-slate-300">
            {vertebrobasilarSubSections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setVbSubSection(s.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  vbSubSection === s.id
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>

          {vbSubSection === '5d3n' && (
            <Card>
              <CardHeader>
                <CardTitle>5D/3N — Signos de afectación del tronco del encéfalo (Codman)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Toggle
                  label="Dysarthria"
                  description="¿Dificultad para articular palabras, habla pastosa o poco inteligible?"
                  value={data.dysarthria} onChange={set('dysarthria')}
                />
                <Toggle
                  label="Dysphagia"
                  description="¿Dificultad para tragar líquidos o sólidos, sensación de atragantamiento?"
                  value={data.dysphagia} onChange={set('dysphagia')}
                />
                <Toggle
                  label="Diplopia"
                  description="¿Ve dos imágenes del mismo objeto (visión doble)?"
                  value={data.diplopia} onChange={set('diplopia')}
                />
                <Toggle
                  label="Dizziness"
                  description="¿Mareo o vértigo intenso y súbito, sensación de giro o inestabilidad marcada?"
                  value={data.dizziness} onChange={set('dizziness')}
                />
                <Toggle
                  label="Drop attacks"
                  description="¿Caídas súbitas sin pérdida de conciencia ('se me fueron las piernas de golpe')?"
                  value={data.dropAttacks} onChange={set('dropAttacks')}
                />
                <Toggle
                  label="Nystagmus"
                  description="¿Movimiento involuntario y rítmico de los ojos?"
                  value={data.nystagmus} onChange={set('nystagmus')}
                />
                <Toggle
                  label="Numbness"
                  description="¿Entumecimiento facial, hemicorporal o en extremidades?"
                  value={data.numbness} onChange={set('numbness')}
                />
                <Toggle
                  label="Nausea"
                  description="¿Náuseas o vómitos asociados?"
                  value={data.nausea} onChange={set('nausea')}
                />
              </CardContent>
            </Card>
          )}

          {vbSubSection === 'hints' && (
            <Card>
              <CardHeader>
                <CardTitle>HINTS+ — Vértigo periférico vs. central</CardTitle>
                <p className="text-sm text-slate-500">
                  Solo aplica en Síndrome Vestibular Agudo: vértigo continuo (horas-días) + náuseas + nistagmo presente + dificultad para caminar.
                  Si el mareo es posicional y de segundos, sospecha VPPB — el HINTS+ no aplica en ese caso.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Toggle
                  label="Síndrome Vestibular Agudo (SVA)"
                  description="¿Cumple los criterios de arriba (vértigo continuo + náuseas + nistagmo presente + dificultad para caminar)?"
                  value={data.acuteVestibularSyndrome} onChange={set('acuteVestibularSyndrome')}
                />

                {data.acuteVestibularSyndrome === true ? (
                  <>
                    <Toggle
                      label="Head Impulse Test — ¿normal?"
                      description="⚠️ Contraintuitivo: si el paciente MANTIENE la fijación sin sacada correctora (test normal), sospecha CENTRAL. Si hace una sacada correctora (anormal), es periférico y tranquiliza."
                      value={data.headImpulseNormal} onChange={set('headImpulseNormal')}
                    />
                    <Toggle
                      label="Nistagmo vertical puro"
                      description="¿Nistagmo vertical puro (upbeat o downbeat)? El oído interno nunca produce esto — es central hasta lo contrario."
                      value={data.nystagmusVerticalPuro} onChange={set('nystagmusVerticalPuro')}
                    />
                    <Toggle
                      label="Nistagmo direction-changing"
                      description="¿Cambia de dirección según hacia dónde mira (derecha/izquierda)?"
                      value={data.nystagmusCambiaDireccion} onChange={set('nystagmusCambiaDireccion')}
                    />
                    <Toggle
                      label="Nistagmo rotatorio puro"
                      description="¿Rotatorio/torsional puro, sin componente horizontal?"
                      value={data.nystagmusRotatorioPuro} onChange={set('nystagmusRotatorioPuro')}
                    />
                    <Toggle
                      label="Test of Skew (Cover-Uncover)"
                      description="Al destapar el ojo tras 2-3s tapado, ¿hace un salto vertical corrector para realinearse (skew positivo)?"
                      value={data.skewDeviation} onChange={set('skewDeviation')}
                    />
                    <Toggle
                      label="Audición"
                      description="¿Pérdida auditiva súbita asociada al vértigo? (sospecha arteria cerebelosa anteroinferior, rama de la basilar)"
                      value={data.suddenHearingLoss} onChange={set('suddenHearingLoss')}
                    />
                    <Toggle
                      label="Ataxia"
                      description="¿No puede mantenerse sentado o de pie sin ayuda? Muy sugerente de lesión cerebelosa central."
                      value={data.severeAtaxia} onChange={set('severeAtaxia')}
                    />
                  </>
                ) : (
                  <p className="text-sm text-slate-500 italic p-3 bg-slate-100 rounded-lg">
                    El HINTS+ no está indicado si el paciente no cumple criterios de Síndrome Vestibular Agudo — marca &quot;SI&quot; arriba si los cumple para desplegar los tests.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Vascular — Vascular + TVP */}
      {section === 'vascular' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 pl-3 border-l-2 border-slate-300">
            {vascularSubSections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setVascularSubSection(s.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  vascularSubSection === s.id
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>

          {vascularSubSection === 'vascular' && (
            <Card>
              <CardHeader>
                <CardTitle>Vascular</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Toggle
                  label="Extension Rotation Test (arteria vertebral y carótida)"
                  value={data.extensionRotationTest}
                  onChange={set('extensionRotationTest')}
                  locked={has5D3NPositive}
                  lockedMessage={has5D3NPositive ? 'No se puede valorar: ya hay una Red Flag positiva en 5D/3N (Codman) — sospecha vertebrobasilar ya confirmada.' : undefined}
                />
                <Toggle label="Coloración roja/azul" value={data.coloracionRojaAzul} onChange={set('coloracionRojaAzul') } />
                <Toggle label="Varices visibles dolorosas" value={data.varicesDolorosas} onChange={set('varicesDolorosas') } />
                <Toggle label="Aumento de temperatura" value={data.aumentoTemperatura} onChange={set('aumentoTemperatura') } />
              </CardContent>
            </Card>
          )}

          {vascularSubSection === 'tvp' && (
            <Card>
              <CardHeader>
                <CardTitle>Trombosis Venosa Profunda (TVP)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Toggle label="Presencia de material venoso (catéter, marcapasos...)" value={data.materialVenoso} onChange={set('materialVenoso') } />
                <Toggle label="Edema unilateral EESS + signo fóvea positivo" value={data.edemaUnilateral} onChange={set('edemaUnilateral') } />
                <Toggle label="Dolor localizado en la extremidad superior" value={data.dolorExtremidadSuperior} onChange={set('dolorExtremidadSuperior') } />
                <Toggle label="Otro diagnóstico cardiovascular plausible" value={data.otroDiagnosticoCardiovascular} onChange={set('otroDiagnosticoCardiovascular') } />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Fracturas */}
      {section === 'fracturas' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 pl-3 border-l-2 border-slate-300">
            {fracturaSubSections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setFracturaSubSection(s.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  fracturaSubSection === s.id
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>

          {fracturaSubSection === 'eess' && (
            <Card>
              <CardHeader>
                <CardTitle>Fractura EESS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Toggle label="Ya se han descartado fracturas con RX" value={data.fracturaDescartadaRx} onChange={set('fracturaDescartadaRx') } />
                {!data.fracturaDescartadaRx && (
                  <>
                    <Toggle label="Antecedente de traumatismo" value={data.antecedenteTraumatismo} onChange={set('antecedenteTraumatismo') } />
                    <Toggle label="Edad mayor de 50 años" value={data.edadMayor50} onChange={set('edadMayor50') } />
                    <Toggle label="Diagnóstico de osteoporosis" value={data.osteoporosis} onChange={set('osteoporosis') } />
                    <Toggle label="El paciente toma corticoides" value={data.corticoides} onChange={set('corticoides') } />
                    {(data.antecedenteTraumatismo || data.osteoporosis) && (
                      <>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Signos adicionales</p>
                        <Toggle label="Dolor intenso que empeora con movimiento pasivo/activo" value={data.dolorIntensoMovimiento} onChange={set('dolorIntensoMovimiento') } />
                        <Toggle label="Hinchazón / Inflamación" value={data.hinchazoneInflamacion} onChange={set('hinchazoneInflamacion') } />
                        <Toggle label="Limitación de movimiento del hombro" value={data.limitacionMovimientoHombro} onChange={set('limitacionMovimientoHombro') } />
                        <Toggle label="Deformidad" value={data.deformidad} onChange={set('deformidad') } />
                        <Toggle label="Sensibilidad a la palpación" value={data.sensibilidadPalpacion} onChange={set('sensibilidadPalpacion') } />
                        <Toggle label="Hematoma" value={data.hematoma} onChange={set('hematoma') } />
                        <Toggle label="Prueba de auscultación del diapasón positiva" value={data.pruebaAuscultacionDiapason} onChange={set('pruebaAuscultacionDiapason') } />
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {fracturaSubSection === 'vertebral' && (
            <Card>
              <CardHeader>
                <CardTitle>Fracturas Vertebrales — Reglas Canadienses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Toggle label="Ya se han descartado fracturas con RX" value={data.fracturaVertebralDescartadaRx} onChange={set('fracturaVertebralDescartadaRx') } />
                {!data.fracturaVertebralDescartadaRx && (
                  <>
                    <Toggle label="Antecedente de traumatismo cabeza/cuello" value={data.antecedenteTraumatismoCuello} onChange={set('antecedenteTraumatismoCuello') } />
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Factores de alto riesgo</p>
                    <Toggle label="Edad 65 o más" value={data.edad65oMas} onChange={set('edad65oMas') } />
                    <Toggle label="Mecanismos peligrosos" value={data.mecanismosPeligrosos} onChange={set('mecanismosPeligrosos') } />
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Factores de bajo riesgo</p>
                    <Toggle label="Colisión trasera simple" value={data.colisionTrasera} onChange={set('colisionTrasera') } />
                    <Toggle label="Puede estar sentado durante un tiempo" value={data.puedeEstarSentado} onChange={set('puedeEstarSentado') } />
                    <Toggle label="Ambulante en todo momento desde el accidente" value={data.ambulanteDesdeAccidente} onChange={set('ambulanteDesdeAccidente') } />
                    <Toggle label="Retraso en el inicio del dolor de cuello" value={data.retrasoInicioDolor} onChange={set('retrasoInicioDolor') } />
                    <Toggle label="No signos de sensibilidad en línea media cervical" value={data.noSignosSensibilidadLineaMedia} onChange={set('noSignosSensibilidadLineaMedia') } />
                    <Toggle label="Paciente NO puede rotar cabeza >45º en alguna dirección" value={data.noPuedeRotarCabeza45} onChange={set('noPuedeRotarCabeza45') } />
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {fracturaSubSection === 'ligamento' && (
            <Card>
              <CardHeader>
                <CardTitle>Integridad Ligamento Transverso/Alar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Toggle label="Antecedente de traumatismo cabeza/cuello" value={data.antecedenteTraumatismoCabezaCuello} onChange={set('antecedenteTraumatismoCabezaCuello') } />
                <Toggle label="5D o 3N Red Flags presentes" value={data.cincoD3N} onChange={set('cincoD3N') } />
                <Toggle label="Síndrome de Down" value={data.sindromeDown} onChange={set('sindromeDown') } />
                <Toggle label="Artritis Reumatoide" value={data.artritisReumatoide} onChange={set('artritisReumatoide') } />
                <Toggle label="Test de cizallamiento anterior (Lig. Transverso) positivo" value={data.testCizallamientoAnterior} onChange={set('testCizallamientoAnterior') } />
                <Toggle label="Test de estrés del ligamento alar positivo" value={data.testEstrésLigamentoAlar} onChange={set('testEstrésLigamentoAlar') } />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tumor */}
      {section === 'tumor' && (
        <Card>
          <CardHeader>
            <CardTitle>Tumor / Cáncer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Sintomatología relacionada con tumor/cáncer" value={data.sintomatologiaTumor} onChange={set('sintomatologiaTumor') } />
          </CardContent>
        </Card>
      )}

      {/* Infección */}
      {section === 'infeccion' && (
        <Card>
          <CardHeader>
            <CardTitle>Infección</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Sintomatología relacionada con infección" value={data.sintomatologiaInfeccion} onChange={set('sintomatologiaInfeccion') } />
          </CardContent>
        </Card>
      )}

      {/* Reuma */}
      {section === 'reuma' && (
        <Card>
          <CardHeader>
            <CardTitle>Reuma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Afectaciones cutáneas o membrana mucosas" value={data.afectacionesCutaneas} onChange={set('afectacionesCutaneas') } />
            <Toggle label="Poliartralgia" value={data.poliartralgia} onChange={set('poliartralgia') } />
          </CardContent>
        </Card>
      )}

      {/* Neural Grave */}
      {section === 'neural' && (
        <Card>
          <CardHeader>
            <CardTitle>Neural Grave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Problemas motores" value={data.problemasMotores} onChange={set('problemasMotores') } />
            <Toggle label="Problemas sensitivos" value={data.problemasSensitivos} onChange={set('problemasSensitivos') } />
            <Toggle label="Problemas cognitivos" value={data.problemasCognitivos} onChange={set('problemasCognitivos') } />

            {(data.problemasMotores || data.problemasSensitivos || data.problemasCognitivos) && (
              <>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Pares Craneales</p>
                <Toggle label="Nervio olfatorio (I par craneal)" value={data.nervioOlfatorio} onChange={set('nervioOlfatorio') } />
                <Toggle label="Agudeza visual (II par craneal)" value={data.agudezaVisual} onChange={set('agudezaVisual') } />
                <Toggle label="Cuadrantes visuales" value={data.cuadrantesVisuales} onChange={set('cuadrantesVisuales') } />
                <Toggle label="Función refleja" value={data.funcionRefleja} onChange={set('funcionRefleja') } />
                <Toggle label="Evaluación de la pupila (III, IV, VI par)" value={data.evaluacionPupila} onChange={set('evaluacionPupila') } />
                <Toggle label="Evaluación movimiento ocular" value={data.evaluacionMovimientoOcular} onChange={set('evaluacionMovimientoOcular') } />
                <Toggle label="Evaluación sensorial (V par craneal)" value={data.evaluacionSensorial} onChange={set('evaluacionSensorial') } />
                <Toggle label="Evaluación reflejo corneal" value={data.evaluacionReflejoCorneal} onChange={set('evaluacionReflejoCorneal') } />
                <Toggle label="Evaluación motora" value={data.evaluacionMotora} onChange={set('evaluacionMotora') } />
                <Toggle label="Evaluación reflejo de la mandíbula" value={data.evaluacionReflejoMandibula} onChange={set('evaluacionReflejoMandibula') } />
                <Toggle label="Nervio facial (VII par craneal)" value={data.nervioFacial} onChange={set('nervioFacial') } />
                <Toggle label="Evaluación auditiva (VIII par craneal)" value={data.evaluacionAuditiva} onChange={set('evaluacionAuditiva') } />
                <Toggle label="Prueba de Rinne" value={data.pruebaRinne} onChange={set('pruebaRinne') } />
                <Toggle label="Prueba de Weber" value={data.pruebaWeber} onChange={set('pruebaWeber') } />
                <Toggle label="Evaluación general (IX, X par craneal)" value={data.evaluacionGeneral} onChange={set('evaluacionGeneral') } />
                <Toggle label="Evaluación reflejo nauseoso" value={data.evaluacionReflejoNauseoso} onChange={set('evaluacionReflejoNauseoso') } />
                <Toggle label="Nervio accesorio/espinal (XI par craneal)" value={data.nervioAccesorio} onChange={set('nervioAccesorio') } />
                <Toggle label="Nervio hipogloso (XII par craneal)" value={data.nervioHipogloso} onChange={set('nervioHipogloso') } />

                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Escala Tinetti</p>
                <ScoreInput label="Marcha" value={data.marchaScore} max={12} onChange={set('marchaScore') as (v: number) => void} />
                <ScoreInput label="Equilibrio" value={data.equilibrioScore} max={16} onChange={set('equilibrioScore') as (v: number) => void} />

                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Miotomas MMSS — Izquierda</p>
                <ScoreInput label="Deltoides (C5)" value={data.deltoidesIzq} max={5} onChange={set('deltoidesIzq') as (v: number) => void} />
                <ScoreInput label="Bíceps braquial (C6)" value={data.bicepsIzq} max={5} onChange={set('bicepsIzq') as (v: number) => void} />
                <ScoreInput label="Extensores muñeca (C6)" value={data.extensoresMunecaIzq} max={5} onChange={set('extensoresMunecaIzq') as (v: number) => void} />
                <ScoreInput label="Tríceps braquial (C7)" value={data.tricepsIzq} max={5} onChange={set('tricepsIzq') as (v: number) => void} />
                <ScoreInput label="Flexor radial del carpo (C7)" value={data.flexorRadialIzq} max={5} onChange={set('flexorRadialIzq') as (v: number) => void} />
                <ScoreInput label="Abductor pulgar (C8)" value={data.abductorPulgarIzq} max={5} onChange={set('abductorPulgarIzq') as (v: number) => void} />
                <ScoreInput label="1er músculo interóseo dorsal (T1)" value={data.interoseoIzq} max={5} onChange={set('interoseoIzq') as (v: number) => void} />

                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Miotomas MMSS — Derecha</p>
                <ScoreInput label="Deltoides (C5)" value={data.deltoidesder} max={5} onChange={set('deltoidesder') as (v: number) => void} />
                <ScoreInput label="Bíceps braquial (C6)" value={data.bicepsDer} max={5} onChange={set('bicepsDer') as (v: number) => void} />
                <ScoreInput label="Extensores muñeca (C6)" value={data.extensoresMunecaDer} max={5} onChange={set('extensoresMunecaDer') as (v: number) => void} />
                <ScoreInput label="Tríceps braquial (C7)" value={data.tricepsDer} max={5} onChange={set('tricepsDer') as (v: number) => void} />
                <ScoreInput label="Flexor radial del carpo (C7)" value={data.flexorRadialDer} max={5} onChange={set('flexorRadialDer') as (v: number) => void} />
                <ScoreInput label="Abductor pulgar (C8)" value={data.abductorPulgarDer} max={5} onChange={set('abductorPulgarDer') as (v: number) => void} />
                <ScoreInput label="1er músculo interóseo dorsal (T1)" value={data.interosDer} max={5} onChange={set('interosDer') as (v: number) => void} />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {(sectionIndex > 0
          || (section === 'vertebrobasilar' && vbSubIndex > 0)
          || (section === 'vascular' && vascularSubIndex > 0)
          || (section === 'fracturas' && fracturaSubIndex > 0)) && (
          <Button variant="outline" onClick={handlePrev}>
            ← Anterior
          </Button>
        )}
        <Button onClick={handleNext} className="flex-1">
          {isLast
            && !(section === 'fracturas' && fracturaSubIndex < fracturaSubSections.length - 1)
            && !(section === 'vascular' && vascularSubIndex < vascularSubSections.length - 1)
            ? 'Finalizar Red Flags →' : 'Siguiente →'}
        </Button>
      </div>
    </div>
  )
}