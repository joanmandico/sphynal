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
  disartria: null, disfagia: null, diplopia: null, discinesia: null,
  dropAtack: null, nistagmus: null, nubness: null, nauseas: null,
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
  label, value, onChange
}: {
  label: string
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            value === true ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-white border border-slate-200 text-slate-400'
          }`}
        >SI</button>
        <button
          onClick={() => onChange(null)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            value === null ? 'bg-slate-200 text-slate-700 border border-slate-400' : 'bg-white border border-slate-200 text-slate-400'
          }`}
        >NV</button>
        <button
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
            value === false ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-white border border-slate-200 text-slate-400'
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
    return (value: boolean | null | number) =>
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
            <Toggle label="Disartria" value={data.disartria} onChange={set('disartria') } />
            <Toggle label="Disfagia" value={data.disfagia} onChange={set('disfagia') } />
            <Toggle label="Diplopia" value={data.diplopia} onChange={set('diplopia') } />
            <Toggle label="Discinesia" value={data.discinesia} onChange={set('discinesia') } />
            <Toggle label="Drop Attack" value={data.dropAtack} onChange={set('dropAtack') } />
            <Toggle label="Nistagmus" value={data.nistagmus} onChange={set('nistagmus') } />
            <Toggle label="Nubness / Entumecimiento" value={data.nubness} onChange={set('nubness') } />
            <Toggle label="Náuseas" value={data.nauseas} onChange={set('nauseas') } />
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
            <Toggle label="Extension Rotation Test (arteria vertebral y carótida)" value={data.extensionRotationTest} onChange={set('extensionRotationTest') } />
            <Toggle label="Coloración roja/azul" value={data.coloracionRojaAzul} onChange={set('coloracionRojaAzul') } />
            <Toggle label="Varices visibles dolorosas" value={data.varicesDolorosas} onChange={set('varicesDolorosas') } />
            <Toggle label="Aumento de temperatura" value={data.aumentoTemperatura} onChange={set('aumentoTemperatura') } />
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Trombosis Venosa Profunda (TVP)</p>
            <Toggle label="Presencia de material venoso (catéter, marcapasos...)" value={data.materialVenoso} onChange={set('materialVenoso') } />
            <Toggle label="Edema unilateral EESS + signo fóvea positivo" value={data.edemaUnilateral} onChange={set('edemaUnilateral') } />
            <Toggle label="Dolor localizado en la extremidad superior" value={data.dolorExtremidadSuperior} onChange={set('dolorExtremidadSuperior') } />
            <Toggle label="Otro diagnóstico cardiovascular plausible" value={data.otroDiagnosticoCardiovascular} onChange={set('otroDiagnosticoCardiovascular') } />
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

      {/* Fractura Vertebral */}
      {section === 'fracturaVertebral' && (
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

      {/* Ligamento */}
      {section === 'ligamento' && (
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