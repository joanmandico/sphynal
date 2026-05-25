// Red flags algorithm for shoulder evaluation
// Based on the clinical protocol document

export interface RedFlagsData {
  // 3D/5N (PAG 1)
  disartria: boolean
  disfagia: boolean
  diplopia: boolean
  discinesia: boolean
  dropAtack: boolean
  nistagmus: boolean
  nubness: boolean
  nauseas: boolean

  // Vascular (PAG 2)
  extensionRotationTest: boolean
  coloracionRojaAzul: boolean
  varicesDolorosas: boolean
  aumentoTemperatura: boolean
  // TVP
  materialVenoso: boolean
  edemaUnilateral: boolean
  dolorExtremidadSuperior: boolean
  otroDiagnosticoCardiovascular: boolean

  // Fractura EESS (PAG 4)
  fracturaDescartadaRx: boolean
  antecedenteTraumatismo: boolean
  edadMayor50: boolean
  osteoporosis: boolean
  corticoides: boolean
  dolorIntensoMovimiento: boolean
  hinchazoneInflamacion: boolean
  limitacionMovimientoHombro: boolean
  deformidad: boolean
  sensibilidadPalpacion: boolean
  hematoma: boolean
  pruebaAuscultacionDiapason: boolean

  // Fracturas vertebrales (PAG 5)
  fracturaVertebralDescartadaRx: boolean
  antecedenteTraumatismoCuello: boolean
  // Reglas canadienses
  edad65oMas: boolean
  mecanismosPeligrosos: boolean
  colisionTrasera: boolean
  puedeEstarSentado: boolean
  ambulanteDesdeAccidente: boolean
  retrasoInicioDolor: boolean
  noSignosSensibilidadLineaMedia: boolean
  noPuedeRotarCabeza45: boolean

  // Integridad ligamento (PAG 6)
  antecedenteTraumatismoCabezaCuello: boolean
  cincoD3N: boolean
  sindromeDown: boolean
  artritisReumatoide: boolean
  testCizallamientoAnterior: boolean
  testEstrésLigamentoAlar: boolean

  // Tumor/Cáncer (PAG 7)
  sintomatologiaTumor: boolean

  // Infección (PAG 8)
  sintomatologiaInfeccion: boolean

  // Reuma (PAG 9)
  afectacionesCutaneas: boolean
  poliartralgia: boolean

  // Neural grave (PAG 10)
  problemasMotores: boolean
  problemasSensitivos: boolean
  problemasCognitivos: boolean

  // Pares craneales (PAG 11-30) - solo si neural positivo
  nervioOlfatorio: boolean
  agudezaVisual: boolean
  cuadrantesVisuales: boolean
  funcionRefleja: boolean
  evaluacionPupila: boolean
  evaluacionMovimientoOcular: boolean
  evaluacionSensorial: boolean
  evaluacionReflejoCorneal: boolean
  evaluacionMotora: boolean
  evaluacionReflejoMandibula: boolean
  nervioFacial: boolean
  evaluacionAuditiva: boolean
  pruebaRinne: boolean
  pruebaWeber: boolean
  evaluacionGeneral: boolean
  evaluacionReflejoNauseoso: boolean
  nervioAccesorio: boolean
  nervioHipogloso: boolean

  // Escala Tinetti
  marchaScore: number
  equilibrioScore: number

  // Miotomas MMSS
  deltoidesIzq: number
  bicepsIzq: number
  extensoresMunecaIzq: number
  tricepsIzq: number
  flexorRadialIzq: number
  abductorPulgarIzq: number
  interoseoIzq: number
  deltoidesder: number
  bicepsDer: number
  extensoresMunecaDer: number
  tricepsDer: number
  flexorRadialDer: number
  abductorPulgarDer: number
  interosDer: number
}

export interface RedFlagResult {
  hasRedFlags: boolean
  critical: string[]
  warnings: string[]
  shouldRefer: string[]
  canContinue: boolean
}

export function analyzeRedFlags(data: RedFlagsData): RedFlagResult {
  const critical: string[] = []
  const warnings: string[] = []
  const shouldRefer: string[] = []

  // 3D/5N
  if (data.disartria) critical.push('Disartria positiva')
  if (data.disfagia) critical.push('Disfagia positiva')
  if (data.diplopia) critical.push('Diplopia positiva')
  if (data.discinesia) critical.push('Discinesia positiva')
  if (data.dropAtack) critical.push('Drop attack positivo')
  if (data.nistagmus) critical.push('Nistagmus positivo')
  if (data.nubness) warnings.push('Nubness/entumecimiento positivo')
  if (data.nauseas) warnings.push('Náuseas positivas')

  if (critical.length > 0 || warnings.some(w => w.includes('3D/5N'))) {
    shouldRefer.push('Derivación urgente — posible afectación del tronco del encéfalo')
  }

  // Vascular
  if (data.extensionRotationTest) {
    critical.push('Extension Rotation Test positivo — posible afectación vertebrobasilar')
    shouldRefer.push('Derivación urgente — insuficiencia vertebrobasilar')
  }

  // TVP score
  const tvpScore =
    (data.materialVenoso ? 1 : 0) +
    (data.edemaUnilateral ? 1 : 0) +
    (data.dolorExtremidadSuperior ? 1 : 0) +
    (data.otroDiagnosticoCardiovascular ? -1 : 0)

  if (tvpScore >= 2) {
    critical.push(`Score TVP: ${tvpScore} — Alta sospecha trombosis venosa profunda`)
    shouldRefer.push('Derivación urgente — sospecha TVP')
  }

  // Fractura EESS
  if (!data.fracturaDescartadaRx) {
    if (data.antecedenteTraumatismo || data.osteoporosis) {
      const signos = [
        data.dolorIntensoMovimiento,
        data.hinchazoneInflamacion,
        data.limitacionMovimientoHombro,
        data.deformidad,
        data.sensibilidadPalpacion,
        data.hematoma,
        data.pruebaAuscultacionDiapason,
      ].filter(Boolean).length

      if (signos >= 2) {
        warnings.push(`${signos} signos de fractura EESS positivos`)
        shouldRefer.push('Derivación para radiografía — sospecha fractura EESS')
      }
    }
  }

  // Fracturas vertebrales - Reglas canadienses
  if (!data.fracturaVertebralDescartadaRx) {
    if (data.edad65oMas || data.mecanismosPeligrosos) {
      critical.push('Factor de alto riesgo fractura cervical — edad ≥65 o mecanismo peligroso')
      shouldRefer.push('Derivación urgente — sospecha fractura cervical')
    }
    if (data.noPuedeRotarCabeza45) {
      warnings.push('No puede rotar cabeza >45º — posible fractura cervical')
      shouldRefer.push('Derivación para radiografía — reglas canadienses')
    }
  }

  // Ligamento transverso/alar
  if (data.testCizallamientoAnterior || data.testEstrésLigamentoAlar) {
    critical.push('Test ligamento transverso/alar positivo — inestabilidad C1-C2')
    shouldRefer.push('Derivación urgente — inestabilidad atlantoaxoidea')
  }

  // Tumor
  if (data.sintomatologiaTumor) {
    warnings.push('Sintomatología compatible con tumor/cáncer')
    shouldRefer.push('Derivación médica — descartar proceso neoplásico')
  }

  // Infección
  if (data.sintomatologiaInfeccion) {
    warnings.push('Sintomatología compatible con infección')
    shouldRefer.push('Derivación médica — descartar proceso infeccioso')
  }

  // Reuma
  if (data.afectacionesCutaneas || data.poliartralgia) {
    warnings.push('Posible afectación reumática')
    shouldRefer.push('Derivación reumatología — descartar enfermedad reumática')
  }

  // Neural grave
  if (data.problemasMotores || data.problemasSensitivos || data.problemasCognitivos) {
    warnings.push('Afectación neurológica grave detectada')
    shouldRefer.push('Derivación neurología — afectación neural grave')
  }

  // Tinetti
  const tinetti = data.marchaScore + data.equilibrioScore
  if (tinetti < 19) {
    warnings.push(`Escala Tinetti: ${tinetti}/28 — Alto riesgo de caída`)
  }

  const hasRedFlags = critical.length > 0 || warnings.length > 0
  const canContinue = critical.length === 0

  return {
    hasRedFlags,
    critical,
    warnings,
    shouldRefer: [...new Set(shouldRefer)],
    canContinue,
  }
}