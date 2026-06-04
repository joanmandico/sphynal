// Clinical decision algorithm for cervical spine
// Based on cervical evaluation protocol (Cervical 1.pdf + CERVICALESLIDIA.pdf)

export interface CervicalEvaluationData {
  // EVA
  eva: number

  // Paso 1 — Presentación clínica (orienta hipótesis)
  sintomasNeurologicos: boolean
  dolorIrradiadoBrazo: boolean
  cefalea: boolean
  traumatismoLatigazo: boolean
  dolorLocalCervical: boolean

  // Paso 2A — Hipótesis mielopatía cervical (Cluster Myelopathy)
  desviacionMarcha: boolean
  hoffmanTest: boolean
  supinadorInvertido: boolean
  babinskiTest: boolean
  mayorDe45: boolean

  // Paso 2B — Hipótesis radiculopatía (Cluster Wainner)
  ulnt1: boolean
  romRotacionMenor60: boolean
  testDistraccion: boolean
  spurlingTest: boolean

  // Paso 2C — Hipótesis cefalea cervicogénica
  testFlexionRotacion: boolean
  dolorUnilateralCabeza: boolean
  dolorReproduceMovCervical: boolean

  // Paso 2D — Hipótesis déficit de movilidad / mecanismo inespecífico
  limitacionFlexion: boolean
  limitacionExtension: boolean
  limitacionRotacionDerecha: boolean
  limitacionRotacionIzquierda: boolean
  limitacionInclinacionDerecha: boolean
  limitacionInclinacionIzquierda: boolean
  patronHomolateral: boolean  // rot + incl limitadas homolateral → cx media-baja
  patronContralateral: boolean // rot + incl limitadas contralateral → cx alta

  // TOS (Síndrome del estrecho torácico)
  testRoos: boolean
  testAdson: boolean
  edenTest: boolean
  morleyTest: boolean

  // Signo comparable — qué mejora el síntoma
  mejoraManipulacionToracica: boolean
  mejoraReposicionEscapula: boolean
  mejoraRetraccion: boolean
  mejoraMulligan: boolean
  mejoraIsometricos: boolean
}

export interface CervicalDiagnosisResult {
  hypothesis: 'mielopatia' | 'radiculopatia' | 'cefalea' | 'movilidad' | 'tos' | 'inespecifico'
  primary: string
  confidence: 'alta' | 'moderada' | 'baja'
  shouldRefer: boolean
  referReason?: string
  differentials: string[]
  treatment: string[]
  comparableSign: string[]
}

export function analyzeCervicalEvaluation(
  data: CervicalEvaluationData
): CervicalDiagnosisResult {
  const differentials: string[] = []
  const treatment: string[] = []
  const comparableSign: string[] = []

  // Mielopatía cervical — Cluster (3 o +) → DERIVAR
  const myelopathyCluster = [
    data.desviacionMarcha,
    data.hoffmanTest,
    data.supinadorInvertido,
    data.babinskiTest,
    data.mayorDe45,
  ].filter(Boolean).length

  if (myelopathyCluster >= 3) {
    return {
      hypothesis: 'mielopatia',
      primary: 'Sospecha de mielopatía cervical',
      confidence: 'alta',
      shouldRefer: true,
      referReason: 'Cluster Myelopathy positivo (≥3) — derivación médica urgente',
      differentials: ['Estenosis del canal cervical', 'Compresión medular'],
      treatment: [],
      comparableSign: [],
    }
  }

  // Radiculopatía — Cluster Wainner (3 o +)
  const wainnerCluster = [
    data.ulnt1,
    data.romRotacionMenor60,
    data.testDistraccion,
    data.spurlingTest,
  ].filter(Boolean).length

  if (wainnerCluster >= 3) {
    treatment.push('Tracción cervical manual')
    treatment.push('Movilización neural (ULNT)')
    treatment.push('Ejercicios de centralización (McKenzie)')
    treatment.push('Educación en neurociencia del dolor')

    if (data.mejoraRetraccion) comparableSign.push('Retracción activa cervical (doble mentón)')
    if (data.mejoraMulligan) comparableSign.push('Movilización cervical Mulligan (SNAG)')

    return {
      hypothesis: 'radiculopatia',
      primary: 'Radiculopatía cervical',
      confidence: wainnerCluster >= 4 ? 'alta' : 'moderada',
      shouldRefer: false,
      differentials: ['Hernia discal cervical', 'Cervicobraquialgia'],
      treatment,
      comparableSign,
    }
  }

  // TOS — Síndrome del estrecho torácico
  const tosPositive = [
    data.testRoos,
    data.testAdson,
    data.edenTest,
    data.morleyTest,
  ].filter(Boolean).length

  if (tosPositive >= 2) {
    treatment.push('Movilización costovertebral')
    treatment.push('Ejercicios de apertura torácica')
    treatment.push('Reeducación postural')

    if (tosPositive >= 3 && data.sintomasNeurologicos) {
      return {
        hypothesis: 'tos',
        primary: 'Síndrome del estrecho torácico — derivación recomendada',
        confidence: 'moderada',
        shouldRefer: true,
        referReason: 'TOS con pérdida de fuerza y conducción — valorar derivación',
        differentials: ['Compresión neurovascular', 'Costilla cervical'],
        treatment,
        comparableSign,
      }
    }

    return {
      hypothesis: 'tos',
      primary: 'Síndrome del estrecho torácico (TOS)',
      confidence: 'moderada',
      shouldRefer: false,
      differentials: ['Compresión del plexo braquial'],
      treatment,
      comparableSign,
    }
  }

  // Cefalea cervicogénica
  if (data.cefalea && (data.testFlexionRotacion || data.dolorReproduceMovCervical)) {
    treatment.push('SNAG de cefalea (Mulligan)')
    treatment.push('NAG cervical superior')
    treatment.push('Ejercicios de control motor cervical')
    treatment.push('Reeducación postural cráneo-cervical')

    if (data.mejoraRetraccion) comparableSign.push('Retracción activa cervical')
    if (data.mejoraMulligan) comparableSign.push('Headache SNAG / NAG')

    return {
      hypothesis: 'cefalea',
      primary: 'Cefalea cervicogénica',
      confidence: data.testFlexionRotacion ? 'alta' : 'moderada',
      shouldRefer: false,
      differentials: ['Cefalea tensional', 'Migraña cervicogénica'],
      treatment,
      comparableSign,
    }
  }

  // Déficit de movilidad / mecanismo inespecífico
  // Orientación cx alta vs cx media-baja
  let cervicalZone = ''
  if (data.patronContralateral) {
    cervicalZone = 'Cervical alta (C0-C2)'
    differentials.push('Disfunción articular C0-C1-C2')
  } else if (data.patronHomolateral) {
    cervicalZone = 'Cervical media-baja (C2-T1)'
    differentials.push('Disfunción articular facetaria C2-T1')
  }

  // Algoritmo CERVICALESLIDIA — signo comparable
  if (data.mejoraManipulacionToracica) {
    comparableSign.push('Manipulación torácica')
    treatment.push('Manipulación columna torácica')
  }
  if (data.mejoraReposicionEscapula) {
    comparableSign.push('Reposicionamiento pasivo de la escápula')
    treatment.push('Reposicionamiento escapular + ejercicios escápulo-torácicos')
  }
  if (data.mejoraRetraccion) {
    comparableSign.push('Retracción activa cervical (doble mentón)')
    treatment.push('Ejercicio de retracción cervical activa en casa')
    treatment.push('McKenzie — procedimiento de retracción')
  }
  if (data.mejoraMulligan) {
    comparableSign.push('Movilización cervical Mulligan (SNAG/NAG)')
    treatment.push('SNAG cervical (C3-C7)')
    treatment.push('NAG cervical')
  }
  if (data.mejoraIsometricos) {
    comparableSign.push('Isométricos — Neck Flexion Endurance Test')
    treatment.push('Programa de control motor cervical profundo')
    treatment.push('Test FCC (flexión cráneo-cervical) + ejercicios')
    treatment.push('Nota: evaluar control sensoriomotor cervical')
  }

  if (treatment.length === 0) {
    treatment.push('Educación postural')
    treatment.push('Ejercicios de movilidad cervical activa')
    treatment.push('Retracción cervical como autotratamiento')
  }

  differentials.push('Síndrome postural cervical')
  differentials.push('Síndrome de disfunción cervical (McKenzie)')

  const hasLimitation = [
    data.limitacionFlexion,
    data.limitacionExtension,
    data.limitacionRotacionDerecha,
    data.limitacionRotacionIzquierda,
  ].some(Boolean)

  return {
    hypothesis: hasLimitation ? 'movilidad' : 'inespecifico',
    primary: cervicalZone
      ? `Disfunción cervical — ${cervicalZone}`
      : 'Dolor cervical de mecanismo inespecífico',
    confidence: comparableSign.length > 0 ? 'moderada' : 'baja',
    shouldRefer: false,
    differentials,
    treatment,
    comparableSign,
  }
}