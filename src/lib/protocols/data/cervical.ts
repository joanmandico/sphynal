// Cervical protocol definition
// Pure data — no UI, no React

import { Protocol, DiagnosisResult } from '../types'
import { cervicalDataSchema } from '../schema'

function diagnose(rawData: Record<string, unknown>): DiagnosisResult {
  const result = cervicalDataSchema.safeParse(rawData)
  const data = result.success ? result.data : cervicalDataSchema.parse({})

  const differentials: string[] = []
  const treatment: string[] = []
  const comparableSign: string[] = []

  // Myelopathy cluster
  const myelopathyCluster = [
    data.desviacionMarcha,
    data.hoffmanTest,
    data.supinadorInvertido,
    data.babinskiTest,
    data.mayorDe45,
  ].filter(Boolean).length

  if (myelopathyCluster >= 3) {
    return {
      primary: 'Sospecha de mielopatía cervical',
      confidence: 'alta',
      shouldRefer: true,
      referReason: 'Cluster Myelopathy positivo (≥3) — derivación médica urgente',
      differentials: ['Estenosis del canal cervical', 'Compresión medular'],
      treatment: [],
      comparableSign: [],
    }
  }

  // Wainner cluster
  const wainnerCluster = [
    data.ulnt1,
    data.romRotacionMenor60,
    data.testDistraccion,
    data.spurlingTest,
  ].filter(Boolean).length

  if (wainnerCluster >= 3) {
    if (data.mejoraRetraccion) comparableSign.push('Retracción activa cervical')
    if (data.mejoraMulligan) comparableSign.push('Movilización cervical Mulligan')
    return {
      primary: 'Radiculopatía cervical',
      confidence: wainnerCluster >= 4 ? 'alta' : 'moderada',
      shouldRefer: false,
      differentials: ['Hernia discal cervical', 'Cervicobraquialgia'],
      treatment: [
        'Tracción cervical manual',
        'Movilización neural (ULNT)',
        'Ejercicios de centralización (McKenzie)',
        'Educación en neurociencia del dolor',
      ],
      comparableSign,
    }
  }

  // TOS
  const tosPositive = [
    data.testRoos,
    data.testAdson,
    data.edenTest,
    data.morleyTest,
  ].filter(Boolean).length

  if (tosPositive >= 2) {
    return {
      primary: tosPositive >= 3 && data.sintomasNeurologicos
        ? 'Síndrome del estrecho torácico — derivación recomendada'
        : 'Síndrome del estrecho torácico (TOS)',
      confidence: 'moderada',
      shouldRefer: tosPositive >= 3 && data.sintomasNeurologicos,
      referReason: 'TOS con pérdida de fuerza y conducción',
      differentials: ['Compresión del plexo braquial', 'Costilla cervical'],
      treatment: [
        'Movilización costovertebral',
        'Ejercicios de apertura torácica',
        'Reeducación postural',
      ],
      comparableSign,
    }
  }

  // Cervicogenic headache
  if (data.cefalea && (data.testFlexionRotacion || data.dolorReproduceMovCervical)) {
    if (data.mejoraRetraccion) comparableSign.push('Retracción activa cervical')
    if (data.mejoraMulligan) comparableSign.push('Headache SNAG / NAG')
    return {
      primary: 'Cefalea cervicogénica',
      confidence: data.testFlexionRotacion ? 'alta' : 'moderada',
      shouldRefer: false,
      differentials: ['Cefalea tensional', 'Migraña cervicogénica'],
      treatment: [
        'SNAG de cefalea (Mulligan)',
        'NAG cervical superior',
        'Ejercicios de control motor cervical',
        'Reeducación postural cráneo-cervical',
      ],
      comparableSign,
    }
  }

  // Mobility deficit / nonspecific
  if (data.mejoraManipulacionToracica) {
    comparableSign.push('Manipulación torácica')
    treatment.push('Manipulación columna torácica')
  }
  if (data.mejoraReposicionEscapula) {
    comparableSign.push('Reposicionamiento pasivo de la escápula')
    treatment.push('Reposicionamiento escapular')
  }
  if (data.mejoraRetraccion) {
    comparableSign.push('Retracción activa cervical (doble mentón)')
    treatment.push('Ejercicio de retracción cervical activa')
    treatment.push('McKenzie — procedimiento de retracción')
  }
  if (data.mejoraMulligan) {
    comparableSign.push('Movilización cervical Mulligan (SNAG/NAG)')
    treatment.push('SNAG cervical (C3-C7)')
  }
  if (data.mejoraIsometricos) {
    comparableSign.push('Isométricos — Neck Flexion Endurance Test')
    treatment.push('Programa de control motor cervical profundo')
    treatment.push('Test FCC + ejercicios flexores profundos')
  }

  if (treatment.length === 0) {
    treatment.push('Educación postural')
    treatment.push('Ejercicios de movilidad cervical activa')
    treatment.push('Retracción cervical como autotratamiento')
  }

  const cervicalZone = data.patronContralateral
    ? 'Cervical alta (C0-C2)'
    : data.patronHomolateral
    ? 'Cervical media-baja (C2-T1)'
    : ''

  differentials.push('Síndrome postural cervical')
  differentials.push('Síndrome de disfunción cervical (McKenzie)')

  return {
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

export const cervicalProtocol: Protocol = {
  id: 'cervical',
  name: 'Columna Cervical',
  bodyArea: 'Cervical',
  diagnose,
  steps: [
    {
      id: 'presentation',
      title: 'Presentación clínica',
      sections: [
        {
          id: 'pain_scale',
          title: 'Escala de dolor',
          fields: [
            { id: 'eva', label: 'Dolor actual (Escala EVA)', type: 'scale', min: 0, max: 10, defaultValue: 0 },
          ],
        },
        {
          id: 'symptoms',
          title: 'Síntomas presentes',
          fields: [
            { id: 'dolorLocalCervical', label: 'Dolor local cervical', type: 'boolean' },
            { id: 'sintomasNeurologicos', label: 'Síntomas neurológicos', sublabel: 'Parestesias, debilidad, entumecimiento', type: 'boolean' },
            { id: 'dolorIrradiadoBrazo', label: 'Dolor irradiado al brazo', sublabel: 'Cervicobraquialgia', type: 'boolean' },
            { id: 'cefalea', label: 'Cefalea', sublabel: 'Dolor de cabeza asociado al cuello', type: 'boolean' },
            { id: 'traumatismoLatigazo', label: 'Antecedente de traumatismo / latigazo cervical', type: 'boolean' },
          ],
        },
      ],
    },
    {
      id: 'tests',
      title: 'Tests clínicos',
      sections: [
        {
          id: 'rom',
          title: 'Movimientos activos (ROM)',
          fields: [
            { id: 'limitacionFlexion', label: 'Limitación de flexión', type: 'boolean' },
            { id: 'limitacionExtension', label: 'Limitación de extensión', type: 'boolean' },
            { id: 'limitacionRotacionDerecha', label: 'Limitación rotación derecha', type: 'boolean' },
            { id: 'limitacionRotacionIzquierda', label: 'Limitación rotación izquierda', type: 'boolean' },
            { id: 'limitacionInclinacionDerecha', label: 'Limitación inclinación derecha', type: 'boolean' },
            { id: 'limitacionInclinacionIzquierda', label: 'Limitación inclinación izquierda', type: 'boolean' },
            { id: 'patronHomolateral', label: 'Rot + inclinación limitadas HOMOLATERALES', sublabel: '→ Cervical media-baja (C2-T1)', type: 'boolean' },
            { id: 'patronContralateral', label: 'Rot + inclinación limitadas CONTRALATERALES', sublabel: '→ Cervical alta (C0-C2)', type: 'boolean' },
          ],
        },
        {
          id: 'myelopathy',
          title: 'Cluster Mielopatía cervical',
          variant: 'danger',
          showIf: { field: 'sintomasNeurologicos', value: true },
          fields: [
            { id: 'desviacionMarcha', label: 'Desviación de la marcha', type: 'boolean' },
            { id: 'hoffmanTest', label: 'Hoffman test', type: 'boolean' },
            { id: 'supinadorInvertido', label: 'Signo del supinador invertido', type: 'boolean' },
            { id: 'babinskiTest', label: 'Babinski test', type: 'boolean' },
            { id: 'mayorDe45', label: 'Edad mayor de 45 años', type: 'boolean' },
          ],
        },
        {
          id: 'wainner',
          title: 'Cluster Wainner — Radiculopatía',
          showIf: { field: 'dolorIrradiadoBrazo', value: true },
          fields: [
            { id: 'ulnt1', label: 'ULNT1 — Test neurodinámico nervio mediano', type: 'boolean' },
            { id: 'romRotacionMenor60', label: 'ROM rotación cervical menor de 60º', type: 'boolean' },
            { id: 'testDistraccion', label: 'Test de distracción cervical', type: 'boolean' },
            { id: 'spurlingTest', label: 'Spurling Test', type: 'boolean' },
          ],
        },
        {
          id: 'headache',
          title: 'Cefalea cervicogénica',
          showIf: { field: 'cefalea', value: true },
          fields: [
            { id: 'testFlexionRotacion', label: 'Test de flexión-rotación cervical positivo', type: 'boolean' },
            { id: 'dolorUnilateralCabeza', label: 'Dolor de cabeza unilateral', type: 'boolean' },
            { id: 'dolorReproduceMovCervical', label: 'Cefalea se reproduce con movimiento cervical', type: 'boolean' },
          ],
        },
        {
          id: 'tos',
          title: 'TOS — Síndrome del estrecho torácico',
          showIf: { field: 'dolorIrradiadoBrazo', value: true },
          fields: [
            { id: 'testRoos', label: 'Test de Roos / Elevated Arm Stress Test', type: 'boolean' },
            { id: 'testAdson', label: 'Test de Adson', type: 'boolean' },
            { id: 'edenTest', label: 'Eden Test', type: 'boolean' },
            { id: 'morleyTest', label: 'Morley Test', type: 'boolean' },
          ],
        },
      ],
    },
    {
      id: 'comparable_sign',
      title: 'Signo comparable',
      sections: [
        {
          id: 'comparable',
          title: 'Signo comparable (CERVICALESLIDIA)',
          description: 'Selecciona qué técnicas mejoran el signo comparable del paciente',
          fields: [
            { id: 'mejoraManipulacionToracica', label: '1. Manipulación columna torácica', type: 'boolean' },
            { id: 'mejoraReposicionEscapula', label: '2. Reposicionamiento pasivo de la escápula', type: 'boolean' },
            { id: 'mejoraRetraccion', label: '3. Retracción activa del cuello (doble mentón)', type: 'boolean' },
            { id: 'mejoraMulligan', label: '4. Movilización cervical (Mulligan / SNAG / NAG)', type: 'boolean' },
            { id: 'mejoraIsometricos', label: '5. Isométricos — Neck Flexion Endurance Test', type: 'boolean' },
          ],
        },
      ],
    },
  ],
}