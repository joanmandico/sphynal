// Clinical decision algorithm for shoulder
// Based on the evaluation protocol from the clinical document

export interface ShoulderEvaluationData {
  // Chief complaint
  cannotRaiseArm: boolean
  pointPain: boolean

  // Cannot raise arm tests
  activePain: boolean
  passivePain: boolean
  externalRotationPainful: boolean

  // Frozen shoulder / arthritis
  frozenShoulder: boolean

  // Rotator cuff
  dropArmSign: boolean
  infraspinatus: boolean
  emptyCanTest: boolean

  // Scapular dyskinesis
  scapularAssistanceTest: boolean
  scapularRetractionTest: boolean

  // Subacromial
  neerTest: boolean
  hawkinsKennedy: boolean
  painfulArcSign: boolean

  // Instability
  apprehension: boolean
  anteriorInstability: boolean
  inferiorInstability: boolean
  posteriorInstability: boolean

  // AC joint
  acJointPain: boolean
  crossBodyAdduction: boolean

  // SLAP
  crankTest: boolean
  obrienTest: boolean
}

export interface DiagnosisResult {
  primary: string
  confidence: 'alta' | 'moderada' | 'baja'
  differentials: string[]
  redFlags: boolean
  recommendations: string[]
}

export function analyzeShoulderEvaluation(
  data: ShoulderEvaluationData
): DiagnosisResult {
  const differentials: string[] = []
  const recommendations: string[] = []
  let primary = ''
  let confidence: 'alta' | 'moderada' | 'baja' = 'baja'

  // Frozen shoulder / capsular pattern
  if (data.frozenShoulder) {
    primary = 'Hombro congelado (capsulitis adhesiva)'
    confidence = 'alta'
    recommendations.push('Movilización glenohumeral progresiva')
    recommendations.push('Estiramientos capsulares')
    recommendations.push('Termoterapia previa a la movilización')
  }

  // Rotator cuff tear
  if (data.dropArmSign || (data.infraspinatus && data.emptyCanTest)) {
    if (data.dropArmSign && data.infraspinatus && data.emptyCanTest) {
      primary = 'Lesión masiva del manguito rotador'
      confidence = 'alta'
      recommendations.push('Derivación médica para imagen (ecografía/RMN)')
    } else {
      primary = primary || 'Lesión del manguito rotador'
      confidence = confidence === 'alta' ? 'alta' : 'moderada'
      differentials.push('Tendinopatía del supraespinoso')
    }
    recommendations.push('Fortalecimiento excéntrico del manguito rotador')
    recommendations.push('Control motor escapular')
  }

  // Subacromial impingement
  const subacromialPositive = [
    data.neerTest,
    data.hawkinsKennedy,
    data.painfulArcSign,
    data.emptyCanTest,
  ].filter(Boolean).length

  if (subacromialPositive >= 3) {
    if (!primary) {
      primary = 'Síndrome subacromial / Tendinopatía del manguito rotador'
      confidence = 'moderada'
    } else {
      differentials.push('Síndrome subacromial')
    }
    recommendations.push('Corrección postural y biomecánica escapular')
    recommendations.push('Ejercicios de centrado glenohumeral')
  }

  // Instability
  if (data.apprehension) {
    if (data.anteriorInstability) {
      differentials.push('Inestabilidad anterior glenohumeral')
      recommendations.push('Fortalecimiento rotadores externos y estabilizadores')
    }
    if (data.inferiorInstability) {
      differentials.push('Inestabilidad inferior (Signo del surco positivo)')
    }
    if (data.posteriorInstability) {
      differentials.push('Inestabilidad posterior glenohumeral')
    }
  }

  // AC joint
  if (data.acJointPain && data.crossBodyAdduction) {
    differentials.push('Lesión articulación acromioclavicular')
    recommendations.push('Protección articulación AC')
    recommendations.push('Movilización gradual acromioclavicular')
  }

  // SLAP / Biceps tendinopathy
  if (data.crankTest || data.obrienTest) {
    differentials.push('Lesión SLAP / Tendinopatía del bíceps')
    recommendations.push('Evaluación tendinosa del bíceps')
  }

  // Scapular dyskinesis
  if (data.scapularAssistanceTest || data.scapularRetractionTest) {
    recommendations.push('Programa de control motor escapular')
    recommendations.push('Fortalecimiento trapecio y serrato anterior')
  }

  // Default if nothing found
  if (!primary) {
    primary = 'Disfunción del complejo del hombro — evaluación incompleta'
    confidence = 'baja'
    recommendations.push('Completar evaluación clínica')
  }

  return {
    primary,
    confidence,
    differentials,
    redFlags: false,
    recommendations,
  }
}