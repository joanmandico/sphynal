// Shoulder protocol definition
// Pure data — no UI, no React

import { Protocol, DiagnosisResult } from '../types'
import { shoulderDataSchema } from '../schema'

function diagnose(rawData: Record<string, unknown>): DiagnosisResult {
  const result = shoulderDataSchema.safeParse(rawData)
  const data = result.success ? result.data : shoulderDataSchema.parse({})

  const differentials: string[] = []
  const treatment: string[] = []
  let primary = ''
  let confidence: 'alta' | 'moderada' | 'baja' = 'baja'

  // Frozen shoulder
  if (data.frozenShoulder) {
    primary = 'Hombro congelado (capsulitis adhesiva)'
    confidence = 'alta'
    treatment.push('Movilización glenohumeral progresiva')
    treatment.push('Estiramientos capsulares')
    treatment.push('Termoterapia previa a la movilización')
  }

  // Rotator cuff tear
  if (data.dropArmSign || (data.infraspinatus && data.emptyCanTest)) {
    if (data.dropArmSign && data.infraspinatus && data.emptyCanTest) {
      primary = 'Lesión masiva del manguito rotador'
      confidence = 'alta'
      treatment.push('Derivación médica para imagen (ecografía/RMN)')
    } else {
      primary = primary || 'Lesión del manguito rotador'
      confidence = confidence === 'alta' ? 'alta' : 'moderada'
      differentials.push('Tendinopatía del supraespinoso')
    }
    treatment.push('Fortalecimiento excéntrico del manguito rotador')
    treatment.push('Control motor escapular')
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
    treatment.push('Corrección postural y biomecánica escapular')
    treatment.push('Ejercicios de centrado glenohumeral')
  }

  // Instability
  if (data.apprehension) {
    if (data.anteriorInstability) differentials.push('Inestabilidad anterior glenohumeral')
    if (data.inferiorInstability) differentials.push('Inestabilidad inferior')
    if (data.posteriorInstability) differentials.push('Inestabilidad posterior glenohumeral')
    treatment.push('Fortalecimiento rotadores externos y estabilizadores')
  }

  // AC joint
  if (data.acJointPain && data.crossBodyAdduction) {
    differentials.push('Lesión articulación acromioclavicular')
    treatment.push('Protección articulación AC')
  }

  // SLAP
  if (data.crankTest || data.obrienTest) {
    differentials.push('Lesión SLAP / Tendinopatía del bíceps')
  }

  // Scapular dyskinesis
  if (data.scapularAssistanceTest || data.scapularRetractionTest) {
    treatment.push('Programa de control motor escapular')
    treatment.push('Fortalecimiento trapecio y serrato anterior')
  }

  if (!primary) {
    primary = 'Disfunción del complejo del hombro — evaluación incompleta'
    confidence = 'baja'
    treatment.push('Completar evaluación clínica')
  }

  return {
    primary,
    confidence,
    shouldRefer: false,
    differentials,
    treatment,
  }
}

export const shoulderProtocol: Protocol = {
  id: 'shoulder',
  name: 'Hombro',
  bodyArea: 'Hombro',
  diagnose,
  steps: [
    {
      id: 'chief_complaint',
      title: 'Motivo de consulta',
      sections: [
        {
          id: 'pain_scale',
          title: 'Escala de dolor',
          fields: [
            {
              id: 'eva',
              label: 'Dolor actual (Escala EVA)',
              type: 'scale',
              min: 0,
              max: 10,
              defaultValue: 0,
            },
          ],
        },
        {
          id: 'chief_complaint',
          title: 'Motivo de consulta',
          fields: [
            { id: 'cannotRaiseArm', label: 'El paciente no puede levantar el brazo', type: 'boolean' },
            { id: 'pointPain', label: 'Dolor a punta de dedo (localizado)', type: 'boolean' },
          ],
        },
      ],
    },
    {
      id: 'clinical_tests',
      title: 'Pruebas clínicas',
      sections: [
        {
          id: 'cannot_raise',
          title: 'Paciente no puede levantar el brazo',
          showIf: { field: 'cannotRaiseArm', value: true },
          fields: [
            { id: 'activePain', label: 'Dolor activo', type: 'boolean' },
            { id: 'passivePain', label: 'Dolor pasivo', type: 'boolean' },
            { id: 'externalRotationPainful', label: 'Rotación externa dolorosa/restringida', type: 'boolean' },
            { id: 'frozenShoulder', label: 'Test hombro congelado positivo', type: 'boolean' },
            { id: 'dropArmSign', label: 'Signo de caída del brazo', type: 'boolean' },
            { id: 'infraspinatus', label: 'Prueba del infraespinoso', type: 'boolean' },
            { id: 'emptyCanTest', label: 'Test lata vacía / Jobe', type: 'boolean' },
            { id: 'scapularAssistanceTest', label: 'Test asistencia escapular (SAT)', type: 'boolean' },
            { id: 'scapularRetractionTest', label: 'Test retracción escapular (SRT)', type: 'boolean' },
          ],
        },
        {
          id: 'subacromial',
          title: 'Tests subacromial / manguito rotador',
          fields: [
            { id: 'neerTest', label: 'Neer test', type: 'boolean' },
            { id: 'hawkinsKennedy', label: 'Hawkins-Kennedy', type: 'boolean' },
            { id: 'painfulArcSign', label: 'Signo arco doloroso', type: 'boolean' },
            { id: 'emptyCanTest', label: 'Test lata vacía / Jobe', type: 'boolean' },
          ],
        },
        {
          id: 'instability',
          title: 'Inestabilidad',
          fields: [
            { id: 'apprehension', label: 'Aprehensión / sensación inestabilidad', type: 'boolean' },
            { id: 'anteriorInstability', label: 'Inestabilidad anterior', type: 'boolean', showIf: { field: 'apprehension', value: true } },
            { id: 'inferiorInstability', label: 'Inestabilidad inferior', type: 'boolean', showIf: { field: 'apprehension', value: true } },
            { id: 'posteriorInstability', label: 'Inestabilidad posterior', type: 'boolean', showIf: { field: 'apprehension', value: true } },
          ],
        },
        {
          id: 'ac_slap',
          title: 'Articulación AC / SLAP',
          fields: [
            { id: 'acJointPain', label: 'Dolor articulación AC', type: 'boolean' },
            { id: 'crossBodyAdduction', label: 'Aducción horizontal (cross body)', type: 'boolean' },
            { id: 'crankTest', label: 'Test de Crank', type: 'boolean' },
            { id: 'obrienTest', label: "Test O'Brien compresión activa", type: 'boolean' },
          ],
        },
      ],
    },
  ],
}