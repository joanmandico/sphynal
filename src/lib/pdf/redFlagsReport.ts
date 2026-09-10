import { RedFlagsData } from '@/lib/algorithms/redflags'

export interface ReportLine {
  label: string
  result: string
  isPositive: boolean
}

export interface ReportSection {
  title: string
  note?: string
  lines: ReportLine[]
}

function line(label: string, value: boolean | null): ReportLine | null {
  if (value === null) return null
  return { label, result: value ? 'POSITIVO' : 'NEGATIVO', isPositive: value }
}

function lines(...items: (ReportLine | null)[]): ReportLine[] {
  return items.filter((i): i is ReportLine => i !== null)
}

export function buildRedFlagsReport(data: RedFlagsData): ReportSection[] {
  const sections: ReportSection[] = []

  // 5D/3N (Codman)
  const fiveD3N = lines(
    line('Dysarthria', data.dysarthria),
    line('Dysphagia', data.dysphagia),
    line('Diplopia', data.diplopia),
    line('Dizziness', data.dizziness),
    line('Drop attacks', data.dropAttacks),
    line('Nystagmus', data.nystagmus),
    line('Numbness', data.numbness),
    line('Nausea', data.nausea),
  )
  if (fiveD3N.length > 0) {
    sections.push({ title: '5D/3N — Signos de afectación del tronco del encéfalo (Codman)', lines: fiveD3N })
  }

  // HINTS+
  if (data.acuteVestibularSyndrome !== null) {
    const hintsLines = lines(
      line('Síndrome Vestibular Agudo', data.acuteVestibularSyndrome),
    )
    if (data.acuteVestibularSyndrome === true) {
      hintsLines.push(...lines(
        line('Head Impulse Test — normal', data.headImpulseNormal),
        line('Nistagmo vertical puro', data.nystagmusVerticalPuro),
        line('Nistagmo direction-changing', data.nystagmusCambiaDireccion),
        line('Nistagmo rotatorio puro', data.nystagmusRotatorioPuro),
        line('Test of Skew positivo', data.skewDeviation),
        line('Pérdida auditiva súbita', data.suddenHearingLoss),
        line('Ataxia severa', data.severeAtaxia),
      ))
    }
    sections.push({ title: 'HINTS+ — Vértigo periférico vs. central', lines: hintsLines })
  }

  // Vascular
  const has5D3NPositive = [
    data.dysarthria, data.dysphagia, data.diplopia, data.dizziness,
    data.dropAttacks, data.nystagmus, data.numbness, data.nausea,
  ].some(v => v === true)

  const vascularLines = lines(
    line('Coloración roja/azul', data.coloracionRojaAzul),
    line('Varices visibles dolorosas', data.varicesDolorosas),
    line('Aumento de temperatura', data.aumentoTemperatura),
  )
  if (has5D3NPositive) {
    vascularLines.push({
      label: 'Extension Rotation Test (arteria vertebral y carótida)',
      result: 'NO VALORADO — Red Flag positiva en 5D/3N ya confirmada',
      isPositive: false,
    })
  } else {
    const ert = line('Extension Rotation Test (arteria vertebral y carótida)', data.extensionRotationTest)
    if (ert) vascularLines.push(ert)
  }
  if (vascularLines.length > 0) {
    sections.push({ title: 'Vascular', lines: vascularLines })
  }

  // TVP
  const tvpLines = lines(
    line('Presencia de material venoso (catéter, marcapasos...)', data.materialVenoso),
    line('Edema unilateral EESS + signo fóvea positivo', data.edemaUnilateral),
    line('Dolor localizado en la extremidad superior', data.dolorExtremidadSuperior),
    line('Otro diagnóstico cardiovascular plausible', data.otroDiagnosticoCardiovascular),
  )
  if (tvpLines.length > 0) {
    const tvpScore =
      (data.materialVenoso === true ? 1 : 0) +
      (data.edemaUnilateral === true ? 1 : 0) +
      (data.dolorExtremidadSuperior === true ? 1 : 0) +
      (data.otroDiagnosticoCardiovascular === true ? -1 : 0)
    sections.push({
      title: `Trombosis Venosa Profunda (TVP) — Score: ${tvpScore}`,
      lines: tvpLines,
    })
  }

  // Fractura EESS
  if (data.fracturaDescartadaRx === true) {
    sections.push({
      title: 'Fractura EESS',
      note: 'Ya se han descartado fracturas con RX.',
      lines: [],
    })
  } else {
    const eessLines = lines(
      line('Antecedente de traumatismo', data.antecedenteTraumatismo),
      line('Edad > 50 años', data.edadMayor50),
      line('Diagnóstico de osteoporosis', data.osteoporosis),
      line('El paciente toma corticoides', data.corticoides),
    )
    if (data.antecedenteTraumatismo === true || data.osteoporosis === true) {
      eessLines.push(...lines(
        line('Dolor intenso que empeora con movimiento pasivo/activo', data.dolorIntensoMovimiento),
        line('Hinchazón / Inflamación', data.hinchazoneInflamacion),
        line('Limitación de movimiento del hombro', data.limitacionMovimientoHombro),
        line('Deformidad', data.deformidad),
        line('Sensibilidad a la palpación', data.sensibilidadPalpacion),
        line('Hematoma', data.hematoma),
        line('Prueba de auscultación del diapasón positiva', data.pruebaAuscultacionDiapason),
      ))
    }
    if (eessLines.length > 0) {
      sections.push({ title: 'Fractura EESS', lines: eessLines })
    }
  }

  // Fracturas Vertebrales
  if (data.fracturaVertebralDescartadaRx === true) {
    sections.push({
      title: 'Fracturas Vertebrales — Reglas Canadienses',
      note: 'Ya se han descartado fracturas con RX.',
      lines: [],
    })
  } else {
    const vertLines = lines(
      line('Antecedente de traumatismo cabeza/cuello', data.antecedenteTraumatismoCuello),
      line('Edad 65 o más', data.edad65oMas),
      line('Mecanismos peligrosos', data.mecanismosPeligrosos),
      line('Colisión trasera simple', data.colisionTrasera),
      line('Puede estar sentado durante un tiempo', data.puedeEstarSentado),
      line('Ambulante en todo momento desde el accidente', data.ambulanteDesdeAccidente),
      line('Retraso en el inicio del dolor de cuello', data.retrasoInicioDolor),
      line('No signos de sensibilidad en línea media cervical', data.noSignosSensibilidadLineaMedia),
      line('Paciente NO puede rotar cabeza >45º en alguna dirección', data.noPuedeRotarCabeza45),
    )
    if (vertLines.length > 0) {
      sections.push({ title: 'Fracturas Vertebrales — Reglas Canadienses', lines: vertLines })
    }
  }

  // Ligamento Transverso/Alar
  const ligLines = lines(
    line('Antecedente de traumatismo cabeza/cuello', data.antecedenteTraumatismoCabezaCuello),
    line('5D o 3N Red Flags presentes', data.cincoD3N),
    line('Síndrome de Down', data.sindromeDown),
    line('Artritis Reumatoide', data.artritisReumatoide),
    line('Test de cizallamiento anterior (Lig. Transverso)', data.testCizallamientoAnterior),
    line('Test de estrés del ligamento alar', data.testEstrésLigamentoAlar),
  )
  if (ligLines.length > 0) {
    sections.push({ title: 'Integridad Ligamento Transverso/Alar', lines: ligLines })
  }

  // Tumor
  const tumorLine = line('Sintomatología relacionada con tumor/cáncer', data.sintomatologiaTumor)
  if (tumorLine) sections.push({ title: 'Tumor / Cáncer', lines: [tumorLine] })

  // Infección
  const infLine = line('Sintomatología relacionada con infección', data.sintomatologiaInfeccion)
  if (infLine) sections.push({ title: 'Infección', lines: [infLine] })

  // Reuma
  const reumaLines = lines(
    line('Afectaciones cutáneas o membrana mucosas', data.afectacionesCutaneas),
    line('Poliartralgia', data.poliartralgia),
  )
  if (reumaLines.length > 0) sections.push({ title: 'Reuma', lines: reumaLines })

  // Neural Grave
  const neuralLines = lines(
    line('Problemas motores', data.problemasMotores),
    line('Problemas sensitivos', data.problemasSensitivos),
    line('Problemas cognitivos', data.problemasCognitivos),
  )
  if (neuralLines.length > 0) {
    sections.push({ title: 'Neural Grave', lines: neuralLines })

    const hasNeuralPositive = data.problemasMotores === true || data.problemasSensitivos === true || data.problemasCognitivos === true
    if (hasNeuralPositive) {
      const paresCranealesLines = lines(
        line('Nervio olfatorio (I par craneal)', data.nervioOlfatorio),
        line('Agudeza visual (II par craneal)', data.agudezaVisual),
        line('Cuadrantes visuales', data.cuadrantesVisuales),
        line('Función refleja', data.funcionRefleja),
        line('Evaluación de la pupila (III, IV, VI par)', data.evaluacionPupila),
        line('Evaluación movimiento ocular', data.evaluacionMovimientoOcular),
        line('Evaluación sensorial (V par craneal)', data.evaluacionSensorial),
        line('Evaluación reflejo corneal', data.evaluacionReflejoCorneal),
        line('Evaluación motora', data.evaluacionMotora),
        line('Evaluación reflejo de la mandíbula', data.evaluacionReflejoMandibula),
        line('Nervio facial (VII par craneal)', data.nervioFacial),
        line('Evaluación auditiva (VIII par craneal)', data.evaluacionAuditiva),
        line('Prueba de Rinne', data.pruebaRinne),
        line('Prueba de Weber', data.pruebaWeber),
        line('Evaluación general (IX, X par craneal)', data.evaluacionGeneral),
        line('Evaluación reflejo nauseoso', data.evaluacionReflejoNauseoso),
        line('Nervio accesorio/espinal (XI par craneal)', data.nervioAccesorio),
        line('Nervio hipogloso (XII par craneal)', data.nervioHipogloso),
      )
      if (paresCranealesLines.length > 0) {
        sections.push({ title: 'Pares Craneales', lines: paresCranealesLines })
      }

      const tinetti = data.marchaScore + data.equilibrioScore
      sections.push({
        title: 'Escala Tinetti',
        lines: [
          { label: 'Marcha', result: `${data.marchaScore}/12`, isPositive: false },
          { label: 'Equilibrio', result: `${data.equilibrioScore}/16`, isPositive: false },
          { label: 'Total', result: `${tinetti}/28${tinetti < 19 ? ' — Alto riesgo de caída' : ''}`, isPositive: tinetti < 19 },
        ],
      })

      sections.push({
        title: 'Miotomas MMSS — Izquierda',
        lines: [
          { label: 'Deltoides (C5)', result: `${data.deltoidesIzq}/5`, isPositive: data.deltoidesIzq < 5 },
          { label: 'Bíceps braquial (C6)', result: `${data.bicepsIzq}/5`, isPositive: data.bicepsIzq < 5 },
          { label: 'Extensores muñeca (C6)', result: `${data.extensoresMunecaIzq}/5`, isPositive: data.extensoresMunecaIzq < 5 },
          { label: 'Tríceps braquial (C7)', result: `${data.tricepsIzq}/5`, isPositive: data.tricepsIzq < 5 },
          { label: 'Flexor radial del carpo (C7)', result: `${data.flexorRadialIzq}/5`, isPositive: data.flexorRadialIzq < 5 },
          { label: 'Abductor pulgar (C8)', result: `${data.abductorPulgarIzq}/5`, isPositive: data.abductorPulgarIzq < 5 },
          { label: '1er interóseo dorsal (T1)', result: `${data.interoseoIzq}/5`, isPositive: data.interoseoIzq < 5 },
        ],
      })

      sections.push({
        title: 'Miotomas MMSS — Derecha',
        lines: [
          { label: 'Deltoides (C5)', result: `${data.deltoidesder}/5`, isPositive: data.deltoidesder < 5 },
          { label: 'Bíceps braquial (C6)', result: `${data.bicepsDer}/5`, isPositive: data.bicepsDer < 5 },
          { label: 'Extensores muñeca (C6)', result: `${data.extensoresMunecaDer}/5`, isPositive: data.extensoresMunecaDer < 5 },
          { label: 'Tríceps braquial (C7)', result: `${data.tricepsDer}/5`, isPositive: data.tricepsDer < 5 },
          { label: 'Flexor radial del carpo (C7)', result: `${data.flexorRadialDer}/5`, isPositive: data.flexorRadialDer < 5 },
          { label: 'Abductor pulgar (C8)', result: `${data.abductorPulgarDer}/5`, isPositive: data.abductorPulgarDer < 5 },
          { label: '1er interóseo dorsal (T1)', result: `${data.interosDer}/5`, isPositive: data.interosDer < 5 },
        ],
      })
    }
  }

  return sections
}