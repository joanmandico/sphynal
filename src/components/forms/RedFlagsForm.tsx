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
  edad65oMas: null,
  mecanismoCaidaAltura: null, mecanismoCargaAxial: null, mecanismoAccidenteVehiculo: null,
  mecanismoVehiculoRecreativo: null, mecanismoBicicleta: null,
  colisionTrasera: null,
  puedeEstarSentado: null, ambulanteDesdeAccidente: null,
  retrasoInicioDolor: null, noSignosSensibilidadLineaMedia: null,
  noPuedeRotarCabeza45: null,
  antecedenteTraumatismoCabezaCuello: null, cincoD3N: null,
  sindromeDown: null, artritisReumatoide: null,
  testCizallamientoAnterior: null, testEstrésLigamentoAlar: null,
  tumorPerdidaPeso: null, tumorFatigaDebilidad: null, tumorDolorPersistente: null,
  tumorCambiosPiel: null, tumorSangradoAnormal: null, tumorTosPersistente: null,
  tumorDificultadTragar: null, tumorBultosMasas: null, tumorCambiosSenos: null,
  tumorGanglios: null,
  infeccionFiebre: null, infeccionFatiga: null, infeccionEnrojecimientoHinchazon: null,
  infeccionSecrecionesAnormales: null, infeccionTosCongestion: null, infeccionDiarreaVomitos: null,
  infeccionDolorOrinar: null, infeccionAumentoFrecuenciaCardiaca: null,
  reumaAfectacionesCutaneas: null, reumaErupcionesCutaneas: null, reumaEnrojecimientoPiel: null,
  reumaSequedadDescamacion: null, reumaLesionesUlcerativas: null, reumaAmpollasVesiculares: null,
  reumaHinchazon: null, reumaLesionesEscamosas: null, reumaUlcerasOrales: null, reumaOjosRojosSecos: null,
  reumaPoliantalgia: null, reumaEdad20a40: null, reumaDebutSacroileitisTalalgia: null,
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

  const fiveD3NFields = [
    data.dysarthria, data.dysphagia, data.diplopia, data.dizziness,
    data.dropAttacks, data.nystagmus, data.numbness, data.nausea,
  ]
  const has5D3NPositive = fiveD3NFields.some(v => v === true)
  const fiveD3NAllAnswered = fiveD3NFields.every(v => v !== null)
  const derivedCincoD3N: boolean | null = has5D3NPositive ? true : (fiveD3NAllAnswered ? false : null)

  useEffect(() => {
    if (has5D3NPositive && data.extensionRotationTest !== null) {
      setData(prev => ({ ...prev, extensionRotationTest: null }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [has5D3NPositive])

  useEffect(() => {
    if (data.cincoD3N !== derivedCincoD3N) {
      setData(prev => ({ ...prev, cincoD3N: derivedCincoD3N }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derivedCincoD3N])
    useEffect(() => {
    if (data.antecedenteTraumatismoCabezaCuello !== data.antecedenteTraumatismoCuello) {
      setData(prev => ({ ...prev, antecedenteTraumatismoCabezaCuello: data.antecedenteTraumatismoCuello }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.antecedenteTraumatismoCuello])

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
      <CardTitle>HINTS+ — Evaluación de posible causa central</CardTitle>

      <div className="space-y-2 text-sm text-slate-500">
        <p>
          HINTS+ está indicado únicamente ante un cuadro compatible con
          Síndrome Vestibular Agudo (SVA), especialmente cuando existe
          nistagmo espontáneo.
        </p>

        <p>
          No debe utilizarse para interpretar cualquier mareo o vértigo.
          Un cuadro episódico y posicional de segundos de duración requiere
          una valoración diferente, por ejemplo ante sospecha de VPPB.
        </p>

        <p className="font-semibold text-amber-700">
          ⚠️ La interpretación de HINTS requiere entrenamiento específico.
          Los hallazgos deben integrarse con la historia clínica y la
          exploración neurológica.
        </p>
      </div>
    </CardHeader>

    <CardContent className="space-y-5">
      {/* PASO 1 — INDICACIÓN */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-bold text-slate-800">
            1. ¿Está indicado realizar HINTS+?
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Valora si la presentación clínica es compatible con Síndrome
            Vestibular Agudo: inicio agudo de vértigo/mareo persistente,
            náuseas o vómitos, intolerancia al movimiento cefálico,
            inestabilidad y habitualmente nistagmo espontáneo.
          </p>
        </div>

        <Toggle
          label="Presentación compatible con Síndrome Vestibular Agudo (SVA)"
          description="Marca SÍ únicamente si el cuadro clínico es compatible con SVA y procede realizar HINTS."
          value={data.acuteVestibularSyndrome}
          onChange={set('acuteVestibularSyndrome')}
        />
      </div>

      {data.acuteVestibularSyndrome === true ? (
        <>
          {/* HINTS */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div>
              <p className="text-sm font-bold text-slate-800">
                2. Head Impulse Test
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Evalúa el reflejo vestíbulo-ocular. En el contexto adecuado,
                la ausencia de una sacada correctora puede constituir un
                hallazgo de alarma para causa central.
              </p>
            </div>

            <Toggle
              label="¿Mantiene la fijación SIN sacada correctora?"
              description="SÍ = Head Impulse normal, hallazgo de alarma central dentro del algoritmo HINTS. NO = aparece una sacada correctora, hallazgo compatible con hipofunción vestibular periférica en el contexto clínico adecuado."
              value={data.headImpulseNormal}
              onChange={set('headImpulseNormal')}
            />
          </div>

          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div>
              <p className="text-sm font-bold text-slate-800">
                3. Nistagmo
              </p>

    <p className="text-xs text-slate-500 mt-1">
      Explora el patrón del nistagmo manteniendo la cabeza del paciente
      estable. El objetivo es determinar su dirección y comprobar si cambia
      con la dirección de la mirada.
    </p>
  </div>

  {/* Procedimiento */}
  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
    <p className="text-xs font-semibold text-slate-700">
      Cómo realizar la exploración
    </p>

    <ol className="text-xs text-slate-600 space-y-1 list-decimal pl-4">
      <li>
        Mantén la cabeza del paciente estable y observa inicialmente los
        ojos mirando al frente.
      </li>

      <li>
        Pídele que mire hacia la derecha sin mover la cabeza y observa
        la dirección del componente rápido del nistagmo.
      </li>

      <li>
        Vuelve a la posición central.
      </li>

      <li>
        Pídele que mire hacia la izquierda y vuelve a observar la dirección
        del componente rápido.
      </li>

      <li>
        Evita llevar los ojos a posiciones extremas de la mirada para no
        confundirlo con nistagmo fisiológico de mirada extrema.
      </li>
    </ol>
  </div>

  {/* Orientación */}
  <div className="grid gap-3 md:grid-cols-2">
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <p className="text-xs font-semibold text-slate-700">
        Patrón compatible con origen periférico
      </p>

      <p className="text-xs text-slate-600 mt-1">
        Habitualmente horizontal con posible componente torsional y
        unidireccional: el componente rápido mantiene la misma dirección
        independientemente de hacia dónde mire el paciente.
      </p>
    </div>

    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <p className="text-xs font-semibold text-slate-700">
        Hallazgos de alarma central
      </p>

      <p className="text-xs text-slate-600 mt-1">
        Nistagmo que cambia de dirección con la mirada, vertical puro
        o torsional puro son patrones que aumentan la sospecha de una
        causa central en el contexto clínico apropiado.
      </p>
    </div>
  </div>

  {/* Registro de resultados */}
  <div className="pt-2 space-y-3">
    <p className="text-xs font-semibold text-slate-700">
      Registra los hallazgos observados:
    </p>

    <Toggle
      label="Nistagmo vertical puro"
      description="SÍ si el nistagmo observado es predominantemente vertical (upbeat o downbeat), sin un componente horizontal predominante."
      value={data.nystagmusVerticalPuro}
      onChange={set('nystagmusVerticalPuro')}
    />

    <Toggle
      label="Nistagmo que cambia de dirección con la mirada"
      description="SÍ si, por ejemplo, bate hacia la derecha al mirar a la derecha y hacia la izquierda al mirar a la izquierda."
      value={data.nystagmusCambiaDireccion}
      onChange={set('nystagmusCambiaDireccion')}
    />

    <Toggle
      label="Nistagmo torsional puro"
      description="SÍ si el movimiento observado es fundamentalmente rotatorio alrededor del eje visual, sin un componente horizontal predominante."
      value={data.nystagmusRotatorioPuro}
      onChange={set('nystagmusRotatorioPuro')}
    />
  </div>
</div>

          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div>
              <p className="text-sm font-bold text-slate-800">
                4. Test of Skew
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Realiza cover-uncover y observa si aparece una corrección
                vertical de la posición ocular.
              </p>
            </div>

            <Toggle
              label="¿Existe desviación vertical correctora (Skew positivo)?"
              description="SÍ = se observa una corrección vertical al destapar el ojo. Constituye un hallazgo de alarma para causa central."
              value={data.skewDeviation}
              onChange={set('skewDeviation')}
            />
          </div>

          {/* PLUS */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div>
              <p className="text-sm font-bold text-slate-800">
                5. Audición — componente “+” de HINTS+
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Valora la presencia de una pérdida auditiva aguda nueva
                asociada al episodio vestibular.
              </p>
            </div>

            <Toggle
              label="¿Existe pérdida auditiva aguda nueva?"
              description="Una pérdida auditiva unilateral aguda nueva en este contexto aumenta la sospecha de una causa vascular central, incluida afectación del territorio AICA."
              value={data.suddenHearingLoss}
              onChange={set('suddenHearingLoss')}
            />
          </div>

          {/* VALORACIÓN COMPLEMENTARIA */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div>
              <p className="text-sm font-bold text-slate-800">
                6. Ataxia / estabilidad postural
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Valoración complementaria al HINTS+. La incapacidad marcada
                para mantener la sedestación o bipedestación sin ayuda es
                un hallazgo de alarma para patología central.
              </p>
            </div>

            <Toggle
              label="¿Presenta ataxia grave?"
              description="SÍ = incapacidad para mantenerse sentado o de pie sin ayuda. Este hallazgo aumenta la sospecha de afectación central."
              value={data.severeAtaxia}
              onChange={set('severeAtaxia')}
            />
          </div>

          {/* RECORDATORIO */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-semibold text-amber-900">
              Interpretación clínica
            </p>

            <p className="text-xs text-amber-800 mt-1">
              Un Head Impulse sin sacada correctora, nistagmo central,
              Skew positivo o pérdida auditiva aguda nueva constituyen
              hallazgos de alarma dentro de HINTS+. La ataxia grave es
              un hallazgo complementario de alarma. Estos resultados
              requieren valoración médica urgente y no deben utilizarse
              aisladamente para confirmar o excluir un ictus.
            </p>
          </div>
        </>
      ) : (
        <div className="p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-slate-600">
            HINTS+ no debe realizarse ni interpretarse fuera de la
            presentación clínica apropiada.
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Si el paciente presenta episodios breves desencadenados por
            cambios posicionales, considera una valoración específica de
            vértigo posicional en lugar de HINTS+.
          </p>
        </div>
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
                        <Toggle
                          label="Prueba de auscultación del diapasón positiva"
                          description="Diapasón 128Hz + estetoscopio. Estetoscopio proximal a la zona sospechosa, activar el diapasón, colocarlo distal a la lesión, escuchar 6-8s y comparar con el lado sano. Positiva = sonido disminuido o ausente respecto al lado sano → sospecha de fractura → derivar."
                          value={data.pruebaAuscultacionDiapason} onChange={set('pruebaAuscultacionDiapason')}
                        />
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
                    <p className="text-xs text-slate-600 font-semibold pt-1">Mecanismos peligrosos</p>
                    <Toggle label="Caída desde > 3m/5 escalones" value={data.mecanismoCaidaAltura} onChange={set('mecanismoCaidaAltura') } />
                    <Toggle label="Carga axial en la cabeza (saltos al agua)" value={data.mecanismoCargaAxial} onChange={set('mecanismoCargaAxial') } />
                    <Toggle label="Accidente en vehículos motorizados (>100 km/h), vuelco" value={data.mecanismoAccidenteVehiculo} onChange={set('mecanismoAccidenteVehiculo') } />
                    <Toggle label="Caída de vehículo recreativo motorizado" value={data.mecanismoVehiculoRecreativo} onChange={set('mecanismoVehiculoRecreativo') } />
                    <Toggle label="Golpe en bicicleta o colisión" value={data.mecanismoBicicleta} onChange={set('mecanismoBicicleta') } />
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
                <Toggle
                  label="Antecedente de traumatismo cabeza/cuello"
                  description="Se calcula automáticamente a partir de la respuesta en el apartado Fractura Vertebral — no se puede editar aquí."
                  value={data.antecedenteTraumatismoCabezaCuello}
                  onChange={set('antecedenteTraumatismoCabezaCuello')}
                  locked={true}
                  lockedMessage={
                    data.antecedenteTraumatismoCuello === null
                      ? 'Aún no se ha valorado en Fractura Vertebral.'
                      : data.antecedenteTraumatismoCuello
                      ? 'Marcado como SI en Fractura Vertebral.'
                      : 'Marcado como NO en Fractura Vertebral.'
                  }
                />
                <Toggle
                  label="5D o 3N Red Flags presentes"
                  description="Se calcula automáticamente a partir de las respuestas del apartado 5D/3N (Vertebrobasilar) — no se puede editar aquí."
                  value={data.cincoD3N}
                  onChange={set('cincoD3N')}
                  locked={true}
                  lockedMessage={
                    has5D3NPositive
                      ? 'Al menos una Red Flag de 5D/3N es positiva.'
                      : fiveD3NAllAnswered
                      ? 'Las 8 Red Flags de 5D/3N se han marcado como negativas.'
                      : 'Aún faltan campos de 5D/3N por valorar.'
                  }
                />
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
            <Toggle label="Pérdida de peso inexplicada" value={data.tumorPerdidaPeso} onChange={set('tumorPerdidaPeso')} />
            <Toggle label="Fatiga y debilidad persistentes" value={data.tumorFatigaDebilidad} onChange={set('tumorFatigaDebilidad')} />
            <Toggle label="Dolor persistente o recurrente sin causa aparente" value={data.tumorDolorPersistente} onChange={set('tumorDolorPersistente')} />
            <Toggle label="Cambios en la piel, como crecimientos, manchas, o cambios en tamaño/forma de lunares" value={data.tumorCambiosPiel} onChange={set('tumorCambiosPiel')} />
            <Toggle label="Sangrado anormal o cambios en los hábitos intestinales o urinarios" value={data.tumorSangradoAnormal} onChange={set('tumorSangradoAnormal')} />
            <Toggle label="Tos persistente o cambios en la voz" value={data.tumorTosPersistente} onChange={set('tumorTosPersistente')} />
            <Toggle label="Dificultades para tragar" value={data.tumorDificultadTragar} onChange={set('tumorDificultadTragar')} />
            <Toggle label="Bultos o masas en cualquier parte del cuerpo" value={data.tumorBultosMasas} onChange={set('tumorBultosMasas')} />
            <Toggle label="Cambios en los senos, como protuberancias o cambios en la piel" value={data.tumorCambiosSenos} onChange={set('tumorCambiosSenos')} />
            <Toggle label="Cambios en los ganglios linfáticos (inflamados, dolorosos o palpables)" value={data.tumorGanglios} onChange={set('tumorGanglios')} />
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
            <Toggle label="Fiebre" value={data.infeccionFiebre} onChange={set('infeccionFiebre')} />
            <Toggle label="Fatiga" value={data.infeccionFatiga} onChange={set('infeccionFatiga')} />
            <Toggle label="Enrojecimiento e hinchazón" value={data.infeccionEnrojecimientoHinchazon} onChange={set('infeccionEnrojecimientoHinchazon')} />
            <Toggle label="Secreciones anormales" value={data.infeccionSecrecionesAnormales} onChange={set('infeccionSecrecionesAnormales')} />
            <Toggle label="Tos, estornudos y congestión nasal" value={data.infeccionTosCongestion} onChange={set('infeccionTosCongestion')} />
            <Toggle label="Diarrea o vómitos" value={data.infeccionDiarreaVomitos} onChange={set('infeccionDiarreaVomitos')} />
            <Toggle label="Dolor al orinar" value={data.infeccionDolorOrinar} onChange={set('infeccionDolorOrinar')} />
            <Toggle label="Aumento de la frecuencia cardíaca" value={data.infeccionAumentoFrecuenciaCardiaca} onChange={set('infeccionAumentoFrecuenciaCardiaca')} />
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
            <Toggle label="Afectaciones cutáneas o membranas mucosas" value={data.reumaAfectacionesCutaneas} onChange={set('reumaAfectacionesCutaneas')} />
            {data.reumaAfectacionesCutaneas === true && (
              <>
                <Toggle label="Erupciones cutáneas (manchas, parches, pápulas, pústulas, vesículas o placas en la piel)" value={data.reumaErupcionesCutaneas} onChange={set('reumaErupcionesCutaneas')} />
                <Toggle label="Enrojecimiento de la piel (eritema) en áreas afectadas" value={data.reumaEnrojecimientoPiel} onChange={set('reumaEnrojecimientoPiel')} />
                <Toggle label="Sequedad y descamación" value={data.reumaSequedadDescamacion} onChange={set('reumaSequedadDescamacion')} />
                <Toggle label="Lesiones ulcerativas" value={data.reumaLesionesUlcerativas} onChange={set('reumaLesionesUlcerativas')} />
                <Toggle label="Ampollas / Lesiones vesiculares" value={data.reumaAmpollasVesiculares} onChange={set('reumaAmpollasVesiculares')} />
                <Toggle label="Hinchazón" value={data.reumaHinchazon} onChange={set('reumaHinchazon')} />
                <Toggle label="Lesiones escamosas" value={data.reumaLesionesEscamosas} onChange={set('reumaLesionesEscamosas')} />
                <Toggle label="Úlceras orales" value={data.reumaUlcerasOrales} onChange={set('reumaUlcerasOrales')} />
                <Toggle label="Ojos rojos o secos" value={data.reumaOjosRojosSecos} onChange={set('reumaOjosRojosSecos')} />
              </>
            )}

            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">Poliartralgia</p>
            <Toggle label="Dolor en más de una articulación (poliartralgia)" value={data.reumaPoliantalgia} onChange={set('reumaPoliantalgia')} />
            {data.reumaPoliantalgia === true && (
              <>
                <Toggle
                  label="Paciente de 20 a 40 años"
                  description="Provisional — se marca manualmente por ahora, pendiente de automatizar a partir de la fecha de nacimiento del paciente."
                  value={data.reumaEdad20a40} onChange={set('reumaEdad20a40')}
                />
                <Toggle label="Debut con sacroileítis / talalgia" value={data.reumaDebutSacroileitisTalalgia} onChange={set('reumaDebutSacroileitisTalalgia')} />
              </>
            )}
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