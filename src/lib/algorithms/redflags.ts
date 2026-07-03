// Red flags algorithm for shoulder evaluation
// Based on the clinical protocol document

type BoolField = boolean | null

export interface RedFlagsData {
  // 3D/5N
  disartria: BoolField
  disfagia: BoolField
  diplopia: BoolField
  discinesia: BoolField
  dropAtack: BoolField
  nistagmus: BoolField
  nubness: BoolField
  nauseas: BoolField
  // Vascular
  extensionRotationTest: BoolField
  coloracionRojaAzul: BoolField
  varicesDolorosas: BoolField
  aumentoTemperatura: BoolField
  materialVenoso: BoolField
  edemaUnilateral: BoolField
  dolorExtremidadSuperior: BoolField
  otroDiagnosticoCardiovascular: BoolField
  // Fractura EESS
  fracturaDescartadaRx: BoolField
  antecedenteTraumatismo: BoolField
  edadMayor50: BoolField
  osteoporosis: BoolField
  corticoides: BoolField
  dolorIntensoMovimiento: BoolField
  hinchazoneInflamacion: BoolField
  limitacionMovimientoHombro: BoolField
  deformidad: BoolField
  sensibilidadPalpacion: BoolField
  hematoma: BoolField
  pruebaAuscultacionDiapason: BoolField
  // Fracturas vertebrales
  fracturaVertebralDescartadaRx: BoolField
  antecedenteTraumatismoCuello: BoolField
  edad65oMas: BoolField
  mecanismosPeligrosos: BoolField
  colisionTrasera: BoolField
  puedeEstarSentado: BoolField
  ambulanteDesdeAccidente: BoolField
  retrasoInicioDolor: BoolField
  noSignosSensibilidadLineaMedia: BoolField
  noPuedeRotarCabeza45: BoolField
  // Ligamento
  antecedenteTraumatismoCabezaCuello: BoolField
  cincoD3N: BoolField
  sindromeDown: BoolField
  artritisReumatoide: BoolField
  testCizallamientoAnterior: BoolField
  testEstrésLigamentoAlar: BoolField
  // Tumor
  sintomatologiaTumor: BoolField
  // Infección
  sintomatologiaInfeccion: BoolField
  // Reuma
  afectacionesCutaneas: BoolField
  poliartralgia: BoolField
  // Neural grave
  problemasMotores: BoolField
  problemasSensitivos: BoolField
  problemasCognitivos: BoolField
  // Pares craneales
  nervioOlfatorio: BoolField
  agudezaVisual: BoolField
  cuadrantesVisuales: BoolField
  funcionRefleja: BoolField
  evaluacionPupila: BoolField
  evaluacionMovimientoOcular: BoolField
  evaluacionSensorial: BoolField
  evaluacionReflejoCorneal: BoolField
  evaluacionMotora: BoolField
  evaluacionReflejoMandibula: BoolField
  nervioFacial: BoolField
  evaluacionAuditiva: BoolField
  pruebaRinne: BoolField
  pruebaWeber: BoolField
  evaluacionGeneral: BoolField
  evaluacionReflejoNauseoso: BoolField
  nervioAccesorio: BoolField
  nervioHipogloso: BoolField
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
  if (data.disartria === true) critical.push('Disartria positiva')
  if (data.disfagia === true) critical.push('Disfagia positiva')
  if (data.diplopia === true) critical.push('Diplopia positiva')
  if (data.discinesia === true) critical.push('Discinesia positiva')
  if (data.dropAtack === true) critical.push('Drop attack positivo')
  if (data.nistagmus === true) critical.push('Nistagmus positivo')
  if (data.nubness === true) warnings.push('Nubness/entumecimiento positivo')
  if (data.nauseas === true) warnings.push('Náuseas positivas')

  if (critical.length > 0) {
    shouldRefer.push('Derivación urgente — posible afectación del tronco del encéfalo')
  }

  // Vascular
  if (data.extensionRotationTest === true) {
    critical.push('Extension Rotation Test positivo — posible afectación vertebrobasilar')
    shouldRefer.push('Derivación urgente — insuficiencia vertebrobasilar')
  }

  // TVP score
  const tvpScore =
    (data.materialVenoso === true ? 1 : 0) +
    (data.edemaUnilateral === true ? 1 : 0) +
    (data.dolorExtremidadSuperior === true ? 1 : 0) +
    (data.otroDiagnosticoCardiovascular === true ? -1 : 0)

  if (tvpScore >= 2) {
    critical.push(`Score TVP: ${tvpScore} — Alta sospecha trombosis venosa profunda`)
    shouldRefer.push('Derivación urgente — sospecha TVP')
  }

  // Fractura EESS
  if (data.fracturaDescartadaRx !== true) {
    if (data.antecedenteTraumatismo === true || data.osteoporosis === true) {
      const signos = [
        data.dolorIntensoMovimiento,
        data.hinchazoneInflamacion,
        data.limitacionMovimientoHombro,
        data.deformidad,
        data.sensibilidadPalpacion,
        data.hematoma,
        data.pruebaAuscultacionDiapason,
      ].filter(v => v === true).length

      if (signos >= 2) {
        warnings.push(`${signos} signos de fractura EESS positivos`)
        shouldRefer.push('Derivación para radiografía — sospecha fractura EESS')
      }
    }
  }

  // Fracturas vertebrales
  if (data.fracturaVertebralDescartadaRx !== true) {
    if (data.edad65oMas === true || data.mecanismosPeligrosos === true) {
      critical.push('Factor de alto riesgo fractura cervical — edad ≥65 o mecanismo peligroso')
      shouldRefer.push('Derivación urgente — sospecha fractura cervical')
    }
    if (data.noPuedeRotarCabeza45 === true) {
      warnings.push('No puede rotar cabeza >45º — posible fractura cervical')
      shouldRefer.push('Derivación para radiografía — reglas canadienses')
    }
  }

  // Ligamento
  if (data.testCizallamientoAnterior === true || data.testEstrésLigamentoAlar === true) {
    critical.push('Test ligamento transverso/alar positivo — inestabilidad C1-C2')
    shouldRefer.push('Derivación urgente — inestabilidad atlantoaxoidea')
  }

  // Tumor
  if (data.sintomatologiaTumor === true) {
    warnings.push('Sintomatología compatible con tumor/cáncer')
    shouldRefer.push('Derivación médica — descartar proceso neoplásico')
  }

  // Infección
  if (data.sintomatologiaInfeccion === true) {
    warnings.push('Sintomatología compatible con infección')
    shouldRefer.push('Derivación médica — descartar proceso infeccioso')
  }

  // Reuma
  if (data.afectacionesCutaneas === true || data.poliartralgia === true) {
    warnings.push('Posible afectación reumática')
    shouldRefer.push('Derivación reumatología — descartar enfermedad reumática')
  }

  // Neural grave
  if (data.problemasMotores === true || data.problemasSensitivos === true || data.problemasCognitivos === true) {
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