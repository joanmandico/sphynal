'use client'

// Red Flags evaluation form - Client Component
// Must be completed before shoulder evaluation

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analyzeRedFlags, RedFlagsData } from '@/lib/algorithms/redflags'

interface Props {
  onComplete: (data: RedFlagsData, result: ReturnType<typeof analyzeRedFlags>) => void
}

const initialData: RedFlagsData = {
  disartria: false, disfagia: false, diplopia: false, discinesia: false,
  dropAtack: false, nistagmus: false, nubness: false, nauseas: false,
  extensionRotationTest: false, coloracionRojaAzul: false,
  varicesDolorosas: false, aumentoTemperatura: false,
  materialVenoso: false, edemaUnilateral: false,
  dolorExtremidadSuperior: false, otroDiagnosticoCardiovascular: false,
  fracturaDescartadaRx: false, antecedenteTraumatismo: false,
  edadMayor50: false, osteoporosis: false, corticoides: false,
  dolorIntensoMovimiento: false, hinchazoneInflamacion: false,
  limitacionMovimientoHombro: false, deformidad: false,
  sensibilidadPalpacion: false, hematoma: false,
  pruebaAuscultacionDiapason: false,
  fracturaVertebralDescartadaRx: false, antecedenteTraumatismoCuello: false,
  edad65oMas: false, mecanismosPeligrosos: false, colisionTrasera: false,
  puedeEstarSentado: false, ambulanteDesdeAccidente: false,
  retrasoInicioDolor: false, noSignosSensibilidadLineaMedia: false,
  noPuedeRotarCabeza45: false,
  antecedenteTraumatismoCabezaCuello: false, cincoD3N: false,
  sindromeDown: false, artritisReumatoide: false,
  testCizallamientoAnterior: false, testEstrésLigamentoAlar: false,
  sintomatologiaTumor: false, sintomatologiaInfeccion: false,
  afectacionesCutaneas: false, poliartralgia: false,
  problemasMotores: false, problemasSensitivos: false, problemasCognitivos: false,
  nervioOlfatorio: false, agudezaVisual: false, cuadrantesVisuales: false,
  funcionRefleja: false, evaluacionPupila: false, evaluacionMovimientoOcular: false,
  evaluacionSensorial: false, evaluacionReflejoCorneal: false,
  evaluacionMotora: false, evaluacionReflejoMandibula: false,
  nervioFacial: false, evaluacionAuditiva: false, pruebaRinne: false,
  pruebaWeber: false, evaluacionGeneral: false, evaluacionReflejoNauseoso: false,
  nervioAccesorio: false, nervioHipogloso: false,
  marchaScore: 12, equilibrioScore: 16,
  deltoidesIzq: 5, bicepsIzq: 5, extensoresMunecaIzq: 5, tricepsIzq: 5,
  flexorRadialIzq: 5, abductorPulgarIzq: 5, interoseoIzq: 5,
  deltoidesder: 5, bicepsDer: 5, extensoresMunecaDer: 5, tricepsDer: 5,
  flexorRadialDer: 5, abductorPulgarDer: 5, interosDer: 5,
}

function Toggle({
  label, value, onChange
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            value ? 'bg-red-100 text-red-700' : 'bg-white border border-slate-200 text-slate-400'
          }`}
        >SI</button>
        <button
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            !value ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-400'
          }`}
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

type Section = '3d5n' | 'vascular' | 'fracturaEESS' | 'fracturaVertebral' | 'ligamento' | 'tumor' | 'infeccion' | 'reuma' | 'neural'

const sections: { id: Section; label: string }[] = [
  { id: '3d5n', label: '3D/5N' },
  { id: 'vascular', label: 'Vascular' },
  { id: 'fracturaEESS', label: 'Fractura EESS' },
  { id: 'fracturaVertebral', label: 'Fractura Vertebral' },
  { id: 'ligamento', label: 'Ligamento Transverso/Alar' },
  { id: 'tumor', label: 'Tumor/Cáncer' },
  { id: 'infeccion', label: 'Infección' },
  { id: 'reuma', label: 'Reuma' },
  { id: 'neural', label: 'Neural Grave' },
]

export default function RedFlagsForm({ onComplete }: Props) {
  const [data, setData] = useState<RedFlagsData>(initialData)
  const [section, setSection] = useState<Section>('3d5n')

  function set(key: keyof RedFlagsData) {
    return (value: boolean | number) =>
      setData(prev => ({ ...prev, [key]: value }))
  }

  const sectionIndex = sections.findIndex(s => s.id === section)
  const isLast = sectionIndex === sections.length - 1

  function handleNext() {
    if (isLast) {
      const result = analyzeRedFlags(data)
      onComplete(data, result)
    } else {
      setSection(sections[sectionIndex + 1].id)
    }
  }

  function handlePrev() {
    if (sectionIndex > 0) {
      setSection(sections[sectionIndex - 1].id)
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

      {/* 3D/5N */}
      {section === '3d5n' && (
        <Card>
          <CardHeader>
            <CardTitle>3D/5N — Signos de afectación del tronco del encéfalo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Disartria" value={data.disartria} onChange={set('disartria') as (v: boolean) => void} />
            <Toggle label="Disfagia" value={data.disfagia} onChange={set('disfagia') as (v: boolean) => void} />
            <Toggle label="Diplopia" value={data.diplopia} onChange={set('diplopia') as (v: boolean) => void} />
            <Toggle label="Discinesia" value={data.discinesia} onChange={set('discinesia') as (v: boolean) => void} />
            <Toggle label="Drop Attack" value={data.dropAtack} onChange={set('dropAtack') as (v: boolean) => void} />
            <Toggle label="Nistagmus" value={data.nistagmus} onChange={set('nistagmus') as (v: boolean) => void} />
            <Toggle label="Nubness / Entumecimiento" value={data.nubness} onChange={set('nubness') as (v: boolean) => void} />
            <Toggle label="Náuseas" value={data.nauseas} onChange={set('nauseas') as (v: boolean) => void} />
          </CardContent>
        </Card>
      )}

      {/* Vascular */}
      {section === 'vascular' && (
        <Card>
          <CardHeader>
            <CardTitle>Vascular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Extension Rotation Test (arteria vertebral y carótida)" value={data.extensionRotationTest} onChange={set('extensionRotationTest') as (v: boolean) => void} />
            <Toggle label="Coloración roja/azul" value={data.coloracionRojaAzul} onChange={set('coloracionRojaAzul') as (v: boolean) => void} />
            <Toggle label="Varices visibles dolorosas" value={data.varicesDolorosas} onChange={set('varicesDolorosas') as (v: boolean) => void} />
            <Toggle label="Aumento de temperatura" value={data.aumentoTemperatura} onChange={set('aumentoTemperatura') as (v: boolean) => void} />
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Trombosis Venosa Profunda (TVP)</p>
            <Toggle label="Presencia de material venoso (catéter, marcapasos...)" value={data.materialVenoso} onChange={set('materialVenoso') as (v: boolean) => void} />
            <Toggle label="Edema unilateral EESS + signo fóvea positivo" value={data.edemaUnilateral} onChange={set('edemaUnilateral') as (v: boolean) => void} />
            <Toggle label="Dolor localizado en la extremidad superior" value={data.dolorExtremidadSuperior} onChange={set('dolorExtremidadSuperior') as (v: boolean) => void} />
            <Toggle label="Otro diagnóstico cardiovascular plausible" value={data.otroDiagnosticoCardiovascular} onChange={set('otroDiagnosticoCardiovascular') as (v: boolean) => void} />
          </CardContent>
        </Card>
      )}

      {/* Fractura EESS */}
      {section === 'fracturaEESS' && (
        <Card>
          <CardHeader>
            <CardTitle>Fractura EESS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Ya se han descartado fracturas con RX" value={data.fracturaDescartadaRx} onChange={set('fracturaDescartadaRx') as (v: boolean) => void} />
            {!data.fracturaDescartadaRx && (
              <>
                <Toggle label="Antecedente de traumatismo" value={data.antecedenteTraumatismo} onChange={set('antecedenteTraumatismo') as (v: boolean) => void} />
                <Toggle label="Edad mayor de 50 años" value={data.edadMayor50} onChange={set('edadMayor50') as (v: boolean) => void} />
                <Toggle label="Diagnóstico de osteoporosis" value={data.osteoporosis} onChange={set('osteoporosis') as (v: boolean) => void} />
                <Toggle label="El paciente toma corticoides" value={data.corticoides} onChange={set('corticoides') as (v: boolean) => void} />
                {(data.antecedenteTraumatismo || data.osteoporosis) && (
                  <>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Signos adicionales</p>
                    <Toggle label="Dolor intenso que empeora con movimiento pasivo/activo" value={data.dolorIntensoMovimiento} onChange={set('dolorIntensoMovimiento') as (v: boolean) => void} />
                    <Toggle label="Hinchazón / Inflamación" value={data.hinchazoneInflamacion} onChange={set('hinchazoneInflamacion') as (v: boolean) => void} />
                    <Toggle label="Limitación de movimiento del hombro" value={data.limitacionMovimientoHombro} onChange={set('limitacionMovimientoHombro') as (v: boolean) => void} />
                    <Toggle label="Deformidad" value={data.deformidad} onChange={set('deformidad') as (v: boolean) => void} />
                    <Toggle label="Sensibilidad a la palpación" value={data.sensibilidadPalpacion} onChange={set('sensibilidadPalpacion') as (v: boolean) => void} />
                    <Toggle label="Hematoma" value={data.hematoma} onChange={set('hematoma') as (v: boolean) => void} />
                    <Toggle label="Prueba de auscultación del diapasón positiva" value={data.pruebaAuscultacionDiapason} onChange={set('pruebaAuscultacionDiapason') as (v: boolean) => void} />
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fractura Vertebral */}
      {section === 'fracturaVertebral' && (
        <Card>
          <CardHeader>
            <CardTitle>Fracturas Vertebrales — Reglas Canadienses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Ya se han descartado fracturas con RX" value={data.fracturaVertebralDescartadaRx} onChange={set('fracturaVertebralDescartadaRx') as (v: boolean) => void} />
            {!data.fracturaVertebralDescartadaRx && (
              <>
                <Toggle label="Antecedente de traumatismo cabeza/cuello" value={data.antecedenteTraumatismoCuello} onChange={set('antecedenteTraumatismoCuello') as (v: boolean) => void} />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Factores de alto riesgo</p>
                <Toggle label="Edad 65 o más" value={data.edad65oMas} onChange={set('edad65oMas') as (v: boolean) => void} />
                <Toggle label="Mecanismos peligrosos" value={data.mecanismosPeligrosos} onChange={set('mecanismosPeligrosos') as (v: boolean) => void} />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Factores de bajo riesgo</p>
                <Toggle label="Colisión trasera simple" value={data.colisionTrasera} onChange={set('colisionTrasera') as (v: boolean) => void} />
                <Toggle label="Puede estar sentado durante un tiempo" value={data.puedeEstarSentado} onChange={set('puedeEstarSentado') as (v: boolean) => void} />
                <Toggle label="Ambulante en todo momento desde el accidente" value={data.ambulanteDesdeAccidente} onChange={set('ambulanteDesdeAccidente') as (v: boolean) => void} />
                <Toggle label="Retraso en el inicio del dolor de cuello" value={data.retrasoInicioDolor} onChange={set('retrasoInicioDolor') as (v: boolean) => void} />
                <Toggle label="No signos de sensibilidad en línea media cervical" value={data.noSignosSensibilidadLineaMedia} onChange={set('noSignosSensibilidadLineaMedia') as (v: boolean) => void} />
                <Toggle label="Paciente NO puede rotar cabeza >45º en alguna dirección" value={data.noPuedeRotarCabeza45} onChange={set('noPuedeRotarCabeza45') as (v: boolean) => void} />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ligamento */}
      {section === 'ligamento' && (
        <Card>
          <CardHeader>
            <CardTitle>Integridad Ligamento Transverso/Alar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Antecedente de traumatismo cabeza/cuello" value={data.antecedenteTraumatismoCabezaCuello} onChange={set('antecedenteTraumatismoCabezaCuello') as (v: boolean) => void} />
            <Toggle label="5D o 3N Red Flags presentes" value={data.cincoD3N} onChange={set('cincoD3N') as (v: boolean) => void} />
            <Toggle label="Síndrome de Down" value={data.sindromeDown} onChange={set('sindromeDown') as (v: boolean) => void} />
            <Toggle label="Artritis Reumatoide" value={data.artritisReumatoide} onChange={set('artritisReumatoide') as (v: boolean) => void} />
            <Toggle label="Test de cizallamiento anterior (Lig. Transverso) positivo" value={data.testCizallamientoAnterior} onChange={set('testCizallamientoAnterior') as (v: boolean) => void} />
            <Toggle label="Test de estrés del ligamento alar positivo" value={data.testEstrésLigamentoAlar} onChange={set('testEstrésLigamentoAlar') as (v: boolean) => void} />
          </CardContent>
        </Card>
      )}

      {/* Tumor */}
      {section === 'tumor' && (
        <Card>
          <CardHeader>
            <CardTitle>Tumor / Cáncer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle label="Sintomatología relacionada con tumor/cáncer" value={data.sintomatologiaTumor} onChange={set('sintomatologiaTumor') as (v: boolean) => void} />
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
            <Toggle label="Sintomatología relacionada con infección" value={data.sintomatologiaInfeccion} onChange={set('sintomatologiaInfeccion') as (v: boolean) => void} />
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
            <Toggle label="Afectaciones cutáneas o membrana mucosas" value={data.afectacionesCutaneas} onChange={set('afectacionesCutaneas') as (v: boolean) => void} />
            <Toggle label="Poliartralgia" value={data.poliartralgia} onChange={set('poliartralgia') as (v: boolean) => void} />
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
            <Toggle label="Problemas motores" value={data.problemasMotores} onChange={set('problemasMotores') as (v: boolean) => void} />
            <Toggle label="Problemas sensitivos" value={data.problemasSensitivos} onChange={set('problemasSensitivos') as (v: boolean) => void} />
            <Toggle label="Problemas cognitivos" value={data.problemasCognitivos} onChange={set('problemasCognitivos') as (v: boolean) => void} />

            {(data.problemasMotores || data.problemasSensitivos || data.problemasCognitivos) && (
              <>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Pares Craneales</p>
                <Toggle label="Nervio olfatorio (I par craneal)" value={data.nervioOlfatorio} onChange={set('nervioOlfatorio') as (v: boolean) => void} />
                <Toggle label="Agudeza visual (II par craneal)" value={data.agudezaVisual} onChange={set('agudezaVisual') as (v: boolean) => void} />
                <Toggle label="Cuadrantes visuales" value={data.cuadrantesVisuales} onChange={set('cuadrantesVisuales') as (v: boolean) => void} />
                <Toggle label="Función refleja" value={data.funcionRefleja} onChange={set('funcionRefleja') as (v: boolean) => void} />
                <Toggle label="Evaluación de la pupila (III, IV, VI par)" value={data.evaluacionPupila} onChange={set('evaluacionPupila') as (v: boolean) => void} />
                <Toggle label="Evaluación movimiento ocular" value={data.evaluacionMovimientoOcular} onChange={set('evaluacionMovimientoOcular') as (v: boolean) => void} />
                <Toggle label="Evaluación sensorial (V par craneal)" value={data.evaluacionSensorial} onChange={set('evaluacionSensorial') as (v: boolean) => void} />
                <Toggle label="Evaluación reflejo corneal" value={data.evaluacionReflejoCorneal} onChange={set('evaluacionReflejoCorneal') as (v: boolean) => void} />
                <Toggle label="Evaluación motora" value={data.evaluacionMotora} onChange={set('evaluacionMotora') as (v: boolean) => void} />
                <Toggle label="Evaluación reflejo de la mandíbula" value={data.evaluacionReflejoMandibula} onChange={set('evaluacionReflejoMandibula') as (v: boolean) => void} />
                <Toggle label="Nervio facial (VII par craneal)" value={data.nervioFacial} onChange={set('nervioFacial') as (v: boolean) => void} />
                <Toggle label="Evaluación auditiva (VIII par craneal)" value={data.evaluacionAuditiva} onChange={set('evaluacionAuditiva') as (v: boolean) => void} />
                <Toggle label="Prueba de Rinne" value={data.pruebaRinne} onChange={set('pruebaRinne') as (v: boolean) => void} />
                <Toggle label="Prueba de Weber" value={data.pruebaWeber} onChange={set('pruebaWeber') as (v: boolean) => void} />
                <Toggle label="Evaluación general (IX, X par craneal)" value={data.evaluacionGeneral} onChange={set('evaluacionGeneral') as (v: boolean) => void} />
                <Toggle label="Evaluación reflejo nauseoso" value={data.evaluacionReflejoNauseoso} onChange={set('evaluacionReflejoNauseoso') as (v: boolean) => void} />
                <Toggle label="Nervio accesorio/espinal (XI par craneal)" value={data.nervioAccesorio} onChange={set('nervioAccesorio') as (v: boolean) => void} />
                <Toggle label="Nervio hipogloso (XII par craneal)" value={data.nervioHipogloso} onChange={set('nervioHipogloso') as (v: boolean) => void} />

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
        {sectionIndex > 0 && (
          <Button variant="outline" onClick={handlePrev}>
            ← Anterior
          </Button>
        )}
        <Button onClick={handleNext} className="flex-1">
          {isLast ? 'Finalizar Red Flags →' : 'Siguiente →'}
        </Button>
      </div>
    </div>
  )
}