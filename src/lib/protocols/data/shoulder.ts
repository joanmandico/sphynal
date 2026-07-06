// Shoulder protocol — COMPLETE ALGORITHM
// Based on HOMBRO.pdf + INFORMES__APLICACIÓN_HOMBRO document

import { Protocol, DiagnosisResult } from '../types'
import { shoulderDataSchema } from '../schema'

function diagnose(rawData: Record<string, unknown>): DiagnosisResult {
  const result = shoulderDataSchema.safeParse(rawData)
  const data = result.success ? result.data : shoulderDataSchema.parse({})

  const differentials: string[] = []
  const treatment: string[] = []
  let primary = ''
  let confidence: 'alta' | 'moderada' | 'baja' = 'baja'
  let shouldRefer = false
  let referReason = ''

  // RAMA 2 — Dolor general / Neural
  if (data.branchGeneralNeural) {
    if (data.myelopathyPositive) {
      shouldRefer = true
      referReason = 'Cluster mielopatía ≥3 — derivación médica urgente'
      primary = 'Sospecha de mielopatía cervical'
      confidence = 'alta'
      treatment.push('Derivación médica urgente')
    } else if (data.wainnerPositive) {
      primary = 'Radiculopatía cervical'
      confidence = 'alta'
      if (data.conductionAffected) {
        shouldRefer = true
        referReason = 'Afectación de conducción — derivar a pruebas de imagen'
      }
      treatment.push('Tracción cervical manual')
      treatment.push('Movilización neural (ULNT)')
      treatment.push('Educación en neurociencia del dolor')
      if (data.sensibilityAffected) differentials.push('Afectación dermatomal sensitiva')
      if (data.strengthAffected) differentials.push('Afectación miotómica motora')
    } else if (data.tosPositive) {
      primary = 'Síndrome del estrecho torácico (TOS)'
      confidence = 'moderada'
      shouldRefer = true
      referReason = 'TOS positivo — derivación recomendada'
      treatment.push('Movilización costovertebral')
      treatment.push('Ejercicios apertura torácica')
    } else {
      const neuralScore = [
        data.medianNerveTest, data.medianInterfaceTest, data.medianPalpation,
        data.ulnarNerveTest, data.ulnarInterfaceTest, data.ulnarPalpation,
        data.radialNerveTest, data.radialInterfaceTest, data.radialPalpation,
      ].filter(Boolean).length
      if (neuralScore >= 1) {
        primary = 'Afectación mecánica nervio periférico MMSS'
        confidence = 'moderada'
        treatment.push('Movilización neural')
        treatment.push('Tratamiento de interfases neurales')
      } else {
        primary = 'Dolor general de hombro — sin filiación neural clara'
        confidence = 'baja'
      }
    }
  }

// RAMA 3 — No puede levantar el brazo
  if (data.branchCannotRaise) {
    if (data.painType === 'Dolor activo y pasivo') {
      if (data.externalRotationPainful === true) {
        const frozenScore = [
          data.frozenLess50ExternalRotation, data.frozenLess30ExternalRotation,
          data.frozenPainForcedER, data.frozenLessHorizontalAdduction,
          data.frozenLessInternalRotation, data.frozenLessFlexion,
        ].filter(v => v === true).length
        if (frozenScore >= 1 || data.coracoidPainTest === true) {
          primary = data.age60Plus === true ? 'Posible artritis glenohumeral' : 'Hombro congelado (capsulitis adhesiva)'
          confidence = frozenScore >= 3 ? 'alta' : 'moderada'
          treatment.push('Movilización glenohumeral progresiva')
          treatment.push('Estiramientos capsulares')
          treatment.push('Termoterapia previa a la movilización')
          treatment.push('Derivación para ECO/RMN')
        } else {
          primary = 'Hombro congelado — valoración incompleta'
          confidence = 'baja'
        }
      } else if (data.externalRotationPainful === false) {
        if (data.passiveAbductionPainful === true || data.spontaneousStrongPain === true || data.noImprovementRecentrage === true) {
          primary = 'Posible calcificación / Artrosis glenohumeral'
          confidence = 'moderada'
          treatment.push('Derivación para ECO/RX')
          treatment.push('Crioterapia y analgesia')
        } else {
          primary = 'Calcificación / Artrosis — valoración incompleta'
          confidence = 'baja'
        }
      } else {
        primary = 'Dolor activo y pasivo — pendiente valorar rotación externa'
        confidence = 'baja'
      }
    } else if (data.painType === 'Dolor activo pero no pasivo') {
      const massiveScore = [
        data.dropArmSign, data.supraspinatusStrengthTest,
        data.lateralRotationLagSign, data.infraspinatus, data.internalRotationLagSign,
      ].filter(v => v === true).length

      if (massiveScore >= 3) {
        primary = 'Lesión masiva del manguito rotador'
        confidence = 'alta'
        treatment.push('Derivación para ECO/RMN')
        treatment.push('Fortalecimiento progresivo manguito rotador')
      } else if (massiveScore >= 1) {
        primary = 'Lesión del manguito rotador'
        confidence = 'moderada'
        treatment.push('Derivación para ECO/RMN')
        treatment.push('Fortalecimiento progresivo manguito rotador')
      } else {
        if (data.mobilityImprovesWithScapula === true) {
          if (data.muscleAtrophy === true) {
            primary = 'Neuropatía supraescapular / axilar'
            confidence = 'moderada'
            treatment.push('Derivación para RMN')
          } else if (data.muscleAtrophy === false) {
            primary = 'Discinesia escapular'
            confidence = 'moderada'
            treatment.push('Reeducación control motor escapular')
            treatment.push('Fortalecimiento trapecio y serrato anterior')
          } else {
            primary = 'Posible discinesia escapular — valorar atrofia muscular'
            confidence = 'baja'
          }
        } else if (data.mobilityImprovesWithScapula === false) {
          if (data.muscleAtrophy === true) {
            primary = 'Neuropatía supraescapular / axilar'
            confidence = 'moderada'
            treatment.push('Derivación para RMN')
          } else if (data.muscleAtrophy === false) {
            primary = 'Puntos gatillo miofasciales (PGM)'
            confidence = 'moderada'
            treatment.push('Técnicas de punción seca o presión isquémica')
            treatment.push('Estiramiento y fortalecimiento muscular')
          } else {
            primary = 'Manguito sin hallazgos — valorar movilidad escapular'
            confidence = 'baja'
          }
        } else {
          primary = 'Manguito sin hallazgos — valorar movilidad escapular'
          confidence = 'baja'
        }
      }
    }

  }// RAMA 4 — Dolor a punta de dedo
  if (data.branchPointPain) {
    if (data.apprehension) {
      const anteriorScore = [data.apprehensionAnterior, data.relocationTest, data.surpriseTest].filter(Boolean).length
      const inferiorScore = [data.sulcusSign, data.gageyTest].filter(Boolean).length
      const posteriorScore = [data.jerkTest, data.posteriorImpingement].filter(Boolean).length
      if (anteriorScore >= 1) differentials.push('Inestabilidad anterior glenohumeral')
      if (inferiorScore >= 1) differentials.push('Inestabilidad inferior glenohumeral')
      if (posteriorScore >= 1) differentials.push('Inestabilidad posterior glenohumeral')
      if (!primary) {
        primary = 'Inestabilidad glenohumeral'
        confidence = anteriorScore + inferiorScore + posteriorScore >= 2 ? 'alta' : 'moderada'
      }
      if (data.instabilityTUBS) { treatment.push('Valorar IQ — lesión Bankart'); treatment.push('Rehabilitación estabilizadores') }
      if (data.instabilityAMBRI) treatment.push('Rehabilitación rotadores y estabilizadores dinámicos')
      if (data.instabilityAIOS) treatment.push('Trabajo de RI y programa de estiramiento capsular posterior')
    }

    if (data.acLineTenderness) {
      const acCluster = [data.acCrossbodyAdduction, data.acResistedExtension, data.acOBrien].filter(Boolean).length
      if (acCluster >= 1) {
        differentials.push('Lesión articulación acromioclavicular')
        if (data.acTraumatic) {
          treatment.push('Cabestrillo y reposo (grado I-II)')
          if (data.acKeySign) treatment.push('Valorar IQ (grado III-VI)')
        } else {
          treatment.push('Protección AC + movilización gradual')
        }
      }
    }

    const subacromialScore = [data.neerTest, data.hawkinsKennedy, data.painfulArcSign].filter(Boolean).length
    if (subacromialScore >= 2) {
      if (!primary) { primary = 'Síndrome subacromial / Tendinopatía manguito rotador'; confidence = 'moderada' }
      else differentials.push('Síndrome subacromial')
      treatment.push('Ejercicios de centrado glenohumeral')
      treatment.push('Derivación para ECO')
    }

    if (data.abdHorizontalPainful) {
      const slapScore = [
        data.crankTest, data.anteriorSlideTest, data.obrienTest,
        data.compressionRotationTest, data.dynamicLabralShearTest,
        data.passiveCompressionTest, data.yergasonTest,
        data.bicepsLoadTest, data.passiveDistractionTest,
      ].filter(Boolean).length
      if (slapScore >= 2) {
        differentials.push('Lesión SLAP / Tendinopatía bíceps')
        treatment.push('Derivación para RMN')
      }
    }

    if (data.supraspinatusNeuropathy) {
      differentials.push('Neuropatía nervio supraescapular')
      treatment.push('Derivación RMN — valorar ganglión espinoglenoides')
    }
    if (data.axillaryNeuropathy) {
      differentials.push('Neuropatía nervio axilar')
      treatment.push('Derivación estudio neurofisiológico')
    }
    if (data.psychosocialFactors) {
      differentials.push('Factores psicosociales / Sensibilización central')
      treatment.push('Derivar especialista indicado')
    }
  }

  if (!primary) {
    primary = 'Evaluación incompleta — selecciona una rama de consulta'
    confidence = 'baja'
  }

  return { primary, confidence, shouldRefer, referReason, differentials, treatment }
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
            { id: 'eva', label: 'Dolor actual (Escala EVA)', type: 'scale', min: 0, max: 10, defaultValue: 0 },
          ],
        },
        {
          id: 'main_branch',
          title: 'Motivo principal de consulta',
          description: 'Selecciona la rama que mejor describe la presentación del paciente',
          fields: [
            { id: 'branchGeneralNeural', label: 'Dolor general / Neural', type: 'boolean' },
            { id: 'branchCannotRaise', label: 'Persona que NO puede levantar el brazo', type: 'boolean' },
            { id: 'branchPointPain', label: 'Dolor a punta de dedo', type: 'boolean' },
          ],
        },
      ],
    },
    {
      id: 'general_neural',
      title: 'Dolor general / Neural',
      showIf: { field: 'branchGeneralNeural', value: true },
      sections: [
        {
          id: 'bilateral',
          title: '¿Dolor bilateral?',
          fields: [
            { id: 'bilateralPain', label: 'Dolor bilateral de hombro', type: 'boolean' },
          ],
        },
        {
          id: 'myelopathy',
          title: 'Cluster Mielopatía cervical',
          variant: 'danger',
          description: '3 o + positivos = derivación urgente',
          fields: [
            { id: 'gaitDeviation', label: 'Desviación de la marcha', type: 'boolean' },
            { id: 'hoffmanTest', label: 'Hoffman test', sublabel: 'Flexión súbita falange distal dedo corazón. (+) flexión falange distal índice y pulgar', type: 'boolean' },
            { id: 'invertedSupinator', label: 'Signo del supinador invertido', sublabel: 'Percusión supinador largo. (+) flexión dedos = lesión espinal C5-C6', type: 'boolean' },
            { id: 'babinskiTest', label: 'Babinski test', sublabel: 'Estímulo planta del pie. (+) extensión dedo gordo o apertura dedos en abanico', type: 'boolean' },
            { id: 'over45', label: 'Edad mayor de 45 años', type: 'boolean' },
            { id: 'myelopathyPositive', label: '¿Cluster mielopatía ≥3 positivos?', sublabel: 'Confirma si hay 3 o más positivos → DERIVACIÓN URGENTE', type: 'boolean' },
          ],
        },
        {
          id: 'wainner',
          title: 'Cluster Wainner — Radiculopatía / Dolor radicular',
          description: '3 o + positivos = radiculopatía',
          fields: [
            { id: 'ulnt1Median', label: 'ULNT1 — Test neurodinámico nervio mediano', sublabel: 'ABD hombro + EXT codo + FLEX muñeca. Alivio/provocación con inclinación cervical', type: 'boolean' },
            { id: 'romRotationLess60', label: 'ROM rotación cervical <60º hacia lado afecto', type: 'boolean' },
            { id: 'distractionTest', label: 'Test de distracción cervical', sublabel: 'Mano en barbilla y occipital, tracción lenta. (+) alivio síntomas', type: 'boolean' },
            { id: 'compressionTest', label: 'Test de compresión cervical', type: 'boolean' },
            { id: 'spurlingTest', label: 'Spurling test', sublabel: 'Inclinación cabeza al lado doloroso + presión superior cabeza. (+) intensifica síntomas', type: 'boolean' },
            { id: 'wainnerPositive', label: '¿Cluster Wainner ≥3 positivos?', sublabel: 'Confirma si hay 3 o más positivos → continuar a valoración neurológica', type: 'boolean' },
          ],
        },
        {
          id: 'neuro_assessment',
          title: 'Dermatomas / Sensibilidad + Miotomas / Fuerza + Reflejos',
          showIf: { field: 'wainnerPositive', value: true },
          fields: [
            { id: 'sensibilityAffected', label: 'Sensibilidad superficial/profunda afectada', sublabel: 'Valorar dermatomos: C4 hombro / C5 cara lateral brazo / C6 cara lateral antebrazo y pulgar / C7 dedo medio / C8 dedo meñique / T1 cara medial antebrazo', type: 'boolean' },
            { id: 'strengthAffected', label: 'Fuerza muscular afectada (miotomas)', sublabel: 'C4 elevación hombro / C5 ABD hombro / C6 flex codo + ext muñeca / C7 ext codo + flex muñeca / C8 ext pulgar / T1 ABD dedos', type: 'boolean' },
            { id: 'reflexAffected', label: 'Reflejos alterados', sublabel: 'Bicipital C5 / Tricipital C6-C7 / Olecraniano C5-C6 / Estiloradial C5-C6 / Cubitopronador C7-C8 / Palmomentoneano', type: 'boolean' },
            { id: 'conductionAffected', label: 'Afectación de conducción', sublabel: 'Pérdida fuerza + déficit sensitivo → DERIVAMOS + pruebas de imagen', type: 'boolean' },
          ],
        },
        {
          id: 'tos',
          title: 'TOS — Síndrome del estrecho torácico',
          fields: [
            { id: 'roosTest', label: 'Test de Roos / Elevated Arm Stress Test', sublabel: 'Posición inicial: paciente sentado o de pie, cabeza neutra. Ambos brazos en ABD 90º + RE (palmas hacia adelante) + codos flex 90º (postura "rendición"). Abrir y cerrar manos durante 3 min. (+) dolor, debilidad, parestesias o coloración de manos durante la prueba', type: 'boolean' },
            { id: 'adsonTest', label: 'Test de Adson', sublabel: 'Rotar cabeza hacia brazo explorado + inspirar. (+) disminución pulso radial', type: 'boolean' },
            { id: 'edenTest', label: 'Eden Test', sublabel: 'Traccionar EESS y comprimir clavícula. (+) reproducción síntomas o disminución pulso', type: 'boolean' },
            { id: 'morleyTest', label: 'Morley Test', sublabel: 'Comprimir fosa supraclavicular 30 seg. (+) dolor y parestesia localizada', type: 'boolean' },
            { id: 'wrightTest', label: "Wright's Test", sublabel: 'Hombro 90º ABD y RE + flex codo 90º. (+) disminución pulso o reproducción síntomas', type: 'boolean' },
            { id: 'costoclavicularTest', label: 'Costoclavicular Maneuver / Halstead', sublabel: 'Valorar pulso radial en posiciones de elevación, descenso, aducción y abducción', type: 'boolean' },
            { id: 'tinelTest', label: 'Tinel Sign', sublabel: 'Percutir plexo braquial. (+) sensación hormigueo en distribución del nervio', type: 'boolean' },
            { id: 'tosPositive', label: '¿TOS positivo?', sublabel: 'Confirma si hay positivos → DERIVACIÓN recomendada', type: 'boolean' },
          ],
        },
        {
          id: 'median_nerve',
          title: 'Mecánica nervio mediano',
          fields: [
            { id: 'medianNerveTest', label: 'Test neurodinámico nervio mediano (ULNT1)', sublabel: 'Bloqueo cintura escapular + ext codo + RE hombro + supinación + ext muñeca y dedos + ABD hombro', type: 'boolean' },
            { id: 'medianInterfaceTest', label: 'Test de interfase nervio mediano', sublabel: 'Cara medial brazo / cara anterior codo / carpo / eminencia tenar', type: 'boolean' },
            { id: 'medianPalpation', label: 'Palpación nervio mediano', type: 'boolean' },
          ],
        },
        {
          id: 'ulnar_nerve',
          title: 'Mecánica nervio cubital',
          fields: [
            { id: 'ulnarNerveTest', label: 'Test neurodinámico nervio cubital (ULNT4)', sublabel: 'Ext muñeca y dedos + pronación + flex máxima codo + depresión cintura escapular + RE hombro + ABD hombro', type: 'boolean' },
            { id: 'ulnarInterfaceTest', label: 'Test de interfase nervio cubital', sublabel: 'Cara interna brazo / canal cubital / canal de Guyón (pisiforme) / ganche del ganchoso', type: 'boolean' },
            { id: 'ulnarPalpation', label: 'Palpación nervio cubital', type: 'boolean' },
            { id: 'flexionElbowTest', label: 'Flexion Elbow Test', sublabel: 'Flexión máxima de codo mantenida. (+) parestesias en territorio cubital', type: 'boolean' },
          ],
        },
        {
          id: 'radial_nerve',
          title: 'Mecánica nervio radial',
          fields: [
            { id: 'radialNerveTest', label: 'Test neurodinámico nervio radial (ULNT3)', sublabel: 'Bloqueo cintura escapular en depresión + ext codo + RI hombro + pronación + flex muñeca y dedos + desv cubital + ABD hombro', type: 'boolean' },
            { id: 'radialInterfaceTest', label: 'Test de interfase nervio radial', sublabel: 'Unos cm por debajo inserción deltoides / codo / zona intersección', type: 'boolean' },
            { id: 'radialPalpation', label: 'Palpación nervio radial', type: 'boolean' },
          ],
        },
      ],
    },
    {
      id: 'cannot_raise',
      title: 'No puede levantar el brazo',
      showIf: { field: 'branchCannotRaise', value: true },
      sections: [
        {
          id: 'pain_type',
          title: 'Tipo de dolor',
          fields: [
            { id: 'painType', label: 'Tipo de dolor presente', type: 'select', options: ['', 'Dolor activo y pasivo', 'Dolor activo pero no pasivo'], defaultValue: '' },
          ],
        },
        {
          id: 'external_rotation',
          title: 'Rotación externa pasiva',
          description: '¿Rotación EXT pasiva dolorosa o restringida?',
          showIf: { field: 'painType', value: 'Dolor activo y pasivo' },
          fields: [
            { id: 'externalRotationPainful', label: 'Rotación externa pasiva dolorosa o restringida', type: 'boolean' },
          ],
        },
        {
          id: 'frozen_shoulder',
          title: 'Hombro congelado / Artritis',
          description: 'RE dolorosa → valorar criterios capsulitis',
          showIf: { field: 'externalRotationPainful', value: true },
          fields: [
            { id: 'frozenLess50ExternalRotation', label: 'Menos RE que en contralateral / menos del 50% de RE', type: 'boolean' },
            { id: 'frozenLess30ExternalRotation', label: 'Menos del 30% de rotación externa (60º glenohumeral)', type: 'boolean' },
            { id: 'frozenPainForcedER', label: 'Dolor en rotación externa forzada', type: 'boolean' },
            { id: 'frozenLessHorizontalAdduction', label: 'Menos aducción horizontal (20º glenohumeral)', type: 'boolean' },
            { id: 'frozenLessInternalRotation', label: 'Menos rotación medial/interna (110º glenohumeral)', type: 'boolean' },
            { id: 'frozenLessFlexion', label: 'Menos extensión glenohumeral', type: 'boolean' },
            { id: 'coracoidPainTest', label: 'Coracoid Pain Test positivo', sublabel: 'Coracoides tiene 3+ puntos más de dolor que AC y zona subacromial', type: 'boolean' },
            { id: 'age60Plus', label: 'Paciente mayor de 60 años', sublabel: '≥60 años → posible artritis / <60 años → hombro congelado', type: 'boolean' },
          ],
        },
        {
          id: 'calcification',
          title: 'Calcificación / Posible artrosis',
          description: 'RE normal → valorar calcificación',
          showIf: { field: 'externalRotationPainful', value: false },
          fields: [
            { id: 'passiveAbductionPainful', label: 'Abducción pasiva dolorosa o restringida', type: 'boolean' },
            { id: 'spontaneousStrongPain', label: 'Dolor fuerte espontáneo', type: 'boolean' },
            { id: 'noImprovementRecentrage', label: 'No mejora con recentraje glenohumeral', type: 'boolean' },
          ],
        },
        {
          id: 'rotator_cuff',
          title: 'Lesión manguito rotador',
          description: 'Dolor activo pero NO pasivo — tests del manguito',
          showIf: { field: 'painType', value: 'Dolor activo pero no pasivo' },
          fields: [
            { id: 'dropArmSign', label: 'Drop Arm Sign', sublabel: 'Lesión supraespinoso', type: 'boolean' },
            { id: 'supraspinatusStrengthTest', label: 'Supraspinatus Strength Test', sublabel: 'Lesión supraespinoso', type: 'boolean' },
            { id: 'lateralRotationLagSign', label: 'Lateral Rotation Lag Sign', sublabel: 'Lesión infraespinoso', type: 'boolean' },
            { id: 'infraspinatus', label: 'Infraspinatus Strength Test', sublabel: 'Lesión infraespinoso', type: 'boolean' },
            { id: 'internalRotationLagSign', label: 'Internal Rotation Lag Sign', sublabel: 'Lesión subescapular', type: 'boolean' },
          ],
        },
        {
          id: 'scapular',
          title: 'Valoración escapular',
          description: '¿Movilidad mejora con ayuda de movimiento escapular?',
          showIf: { field: 'painType', value: 'Dolor activo pero no pasivo' },
          fields: [
            { id: 'mobilityImprovesWithScapula', label: 'Movilidad mejora con ayuda de movimiento escapular', type: 'boolean' },
            { id: 'pgmPresent', label: 'PGM — Puntos gatillo miofasciales', type: 'boolean', showIf: { field: 'muscleAtrophy', value: false } },
            { id: 'muscleAtrophy', label: 'Atrofia muscular presente', sublabel: 'SÍ → nervio supraescapular/axilar / NO → PGM o discinesia escapular', type: 'boolean' },
            { id: 'supraspinatusNeuropathy', label: 'Falta de fuerza ABD/RE + atrofia supraespinoso e infraespinoso', sublabel: 'Nervio supraescapular → RMN', type: 'boolean', showIf: { field: 'muscleAtrophy', value: true } },
            { id: 'axillaryNeuropathy', label: 'Signo de retraso extensión deltoides + pérdida contorno hombro', sublabel: 'Nervio axilar → RMN', type: 'boolean', showIf: { field: 'muscleAtrophy', value: true } },
            { id: 'scapularAssistanceTest', label: 'SAT — Scapular Assistance Test / Scapular Reposition Test', type: 'boolean', showIf: { field: 'mobilityImprovesWithScapula', value: true } },
            { id: 'scapularRetractionTest', label: 'SRT — Scapular Retraction Test', sublabel: 'Fijamos escápula, resistimos elevación', type: 'boolean', showIf: { field: 'mobilityImprovesWithScapula', value: true } },
            { id: 'isrt', label: 'ISRT — Infraspinatus Scapular Retraction Test', sublabel: 'Fijamos escápula, resistimos RE desde R1', type: 'boolean', showIf: { field: 'mobilityImprovesWithScapula', value: true } },
            { id: 'sdtFlexionAffected', label: 'SDT McClure — Flexión lado afecto', type: 'select', options: ['NORMAL', 'SUTIL', 'OBVIO'], defaultValue: 'NORMAL', showIf: { field: 'mobilityImprovesWithScapula', value: true } },
            { id: 'sdtAbductionAffected', label: 'SDT McClure — Abducción lado afecto', type: 'select', options: ['NORMAL', 'SUTIL', 'OBVIO'], defaultValue: 'NORMAL', showIf: { field: 'mobilityImprovesWithScapula', value: true } },
          ],
        },
      ],
    },
{
      id: 'point_pain',
      title: 'Dolor a punta de dedo',
      showIf: { field: 'branchPointPain', value: true },
      sections: [
        {
          id: 'instability',
          title: 'Inestabilidad glenohumeral',
          fields: [
            { id: 'apprehension', label: 'Aprehensión / sensación de inestabilidad por parte del paciente', type: 'boolean' },
            { id: 'apprehensionAnterior', label: 'Aprehension Shoulder Test / Anterior Shoulder Dislocation', sublabel: 'Hombro ABD y RE. Forzar la RE. (+) dolor cara anterior → impingement subacromial / dolor posterior → impingement glenoideo interno posterosuperior', type: 'boolean', showIf: { field: 'apprehension', value: true } },
            { id: 'surpriseTest', label: 'Shoulder Release / Surprise Test', sublabel: 'Brazo ABD, flex codo y RE. Compresión hacia posterior y dejar la compresión. (+) dolor y desplazamiento anterior cabeza húmero', type: 'boolean', showIf: { field: 'apprehension', value: true } },
            { id: 'relocationTest', label: 'Relocation Test', sublabel: 'Recolocación de la cabeza humeral. (+) alivio del dolor anterior', type: 'boolean', showIf: { field: 'apprehension', value: true } },
            { id: 'sulcusSign', label: 'Sulcus Test — inestabilidad INFERIOR', sublabel: 'Paciente de pie. Fijamos desde articulación del codo y traccionamos el brazo. (+) dislocación hombro = inestabilidad inferior o laxitud glenohumeral', type: 'boolean', showIf: { field: 'apprehension', value: true } },
            { id: 'gageyTest', label: 'Gagey Test — inestabilidad INFERIOR', sublabel: 'Paciente sentado. Fijamos clavícula. ABD hombro cogiendo desde codo. (+) si ABD excede 105º', type: 'boolean', showIf: { field: 'apprehension', value: true } },
            { id: 'jerkTest', label: 'Jerk Test — inestabilidad POSTERIOR', type: 'boolean', showIf: { field: 'apprehension', value: true } },
            { id: 'posteriorImpingement', label: 'Impingement posterointerno', sublabel: 'Pinchazo zona posterosuperior al realizar 90-110º ABD + ligera EXT y máxima RE', type: 'boolean', showIf: { field: 'apprehension', value: true } },
          ],
        },
        {
          id: 'instability_type',
          title: 'Tipo de inestabilidad',
          showIf: { field: 'apprehension', value: true },
          fields: [
            { id: 'instabilityTUBS', label: 'TUBS', sublabel: 'Traumático / Unilateral / Bankart / IQ anterior', type: 'boolean' },
            { id: 'instabilityAMBRI', label: 'AMBRI', sublabel: 'Atraumático / Multidireccional / Bilateral / Rehab / Inferior', type: 'boolean' },
            { id: 'instabilityAIOS', label: 'AIOS (GIRD/lanzadores)', sublabel: 'Suma RI+RE <180º o pérdida ≥20º de RI + Test de aducción horizontal con fijación escapular', type: 'boolean' },
          ],
        },
        {
          id: 'frozen_shoulder_dpd',
          title: 'Hombro congelado',
          fields: [
            { id: 'frozenLess50ExternalRotation', label: 'Menos RE que en contralateral / menos del 50% de RE', type: 'boolean' },
            { id: 'frozenLess30ExternalRotation', label: 'Menos del 30% de rotación externa (60º glenohumeral)', type: 'boolean' },
            { id: 'frozenPainForcedER', label: 'Dolor en rotación externa forzada', type: 'boolean' },
            { id: 'frozenLessHorizontalAdduction', label: 'Menos aducción horizontal (20º glenohumeral)', type: 'boolean' },
            { id: 'frozenLessInternalRotation', label: 'Menos rotación medial/interna (110º glenohumeral)', type: 'boolean' },
            { id: 'frozenLessFlexion', label: 'Menos extensión glenohumeral', type: 'boolean' },
            { id: 'coracoidPainTest', label: 'Coracoid Pain Test positivo', sublabel: 'Coracoides tiene 3+ puntos más de dolor que AC y zona subacromial', type: 'boolean' },
            { id: 'age60Plus', label: 'Paciente mayor de 60 años', sublabel: '≥60 años → posible artritis (RMN) / <60 años → hombro congelado (ECO)', type: 'boolean' },
          ],
        },
        {
          id: 'ac_joint',
          title: 'Articulación acromioclavicular (AC)',
          fields: [
            { id: 'acLineTenderness', label: 'AC Joint Line Tenderness', sublabel: 'Sensibilidad a la palpación en línea articular AC', type: 'boolean' },
            { id: 'acCrossbodyAdduction', label: 'Cross Body Adduction Test', sublabel: 'ADH horizontal pasiva. (+) dolor en articulación AC', type: 'boolean' },
            { id: 'acResistedExtension', label: 'AC Resisted Extension Test', sublabel: 'Flexión brazo con RI a 90º. Resistimos ADD. (+) dolor en AC', type: 'boolean' },
            { id: 'acOBrien', label: "O'Brien / Active Compression Test", sublabel: '90º flex + 10-15º ADD + RI y luego RE. (+) dolor en RI, alivia en RE', type: 'boolean' },
            { id: 'acPaxino', label: "Paxino's Sign", sublabel: 'Pinzar acromion desde posterior y anterior. Comprimir. (+) genera dolor. Si negativo → Hawkins Kennedy', type: 'boolean' },
            { id: 'acHawkins', label: 'Hawkins Kennedy Test (Krill)', sublabel: 'Si Paxino negativo. Brazo 90º flex + RI pasiva. (+) dolor en AC', type: 'boolean' },
            { id: 'acTraumatic', label: '¿Lesión traumática?', type: 'boolean' },
            { id: 'acKeySign', label: 'Signo de la tecla', sublabel: 'Clasificación Rockwood: I-II → cabestrillo y reposo / III-VI → valorar IQ', type: 'boolean', showIf: { field: 'acTraumatic', value: true } },
          ],
        },
        {
          id: 'subacromial',
          title: 'Muscular / Tendinoso / Subacromial — Manguito rotadores',
          fields: [
            { id: 'neerTest', label: 'Neer Test', sublabel: 'Fijamos escápula desde posterior. Flex máxima pasiva del brazo. (+) dolor en AC', type: 'boolean' },
            { id: 'hawkinsKennedy', label: 'Hawkins-Kennedy Test', sublabel: 'Brazo 90º flex + codo. Pasar brazo proximal por debajo y presión hombro contra. RI pasiva. (+) dolor en AC', type: 'boolean' },
            { id: 'painfulArcSign', label: 'Painful Arc Syndrome', sublabel: 'ABD palmas al frente hasta final del recorrido. Dolor 45-60º = glenohumeral / 170-180º = AC', type: 'boolean' },
          ],
        },
        {
          id: 'biceps_bursitis',
          title: 'Tenosinovitis / Inestabilidad cabeza larga bíceps / Bursitis',
          description: 'Valorar si subacromial negativo → ECO',
          fields: [
            { id: 'bicepsTendinopathy', label: 'Tenosinovitis cabeza larga bíceps', sublabel: 'Sin afectación subescapular / Con afectación subescapular', type: 'boolean' },
            { id: 'bicepsInstability', label: 'Inestabilidad cabeza larga bíceps', type: 'boolean' },
            { id: 'bursitis', label: 'Bursitis', type: 'boolean' },
          ],
        },
        {
          id: 'slap',
          title: 'Lesiones SLAP sintomáticas',
          fields: [
            { id: 'abdHorizontalPainful', label: 'ABD horizontal / RI o RE / Extensión dolorosa', type: 'boolean' },
            { id: 'crankTest', label: 'Crank Test', sublabel: '160º ABD. Compresión + RE y RI pasiva. (+) dolor o chasquido en RE', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
            { id: 'anteriorSlideTest', label: 'Anterior Slide Test', sublabel: 'Mano paciente en cintura. Presión desde codo hacia húmero. (+) dolor', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
            { id: 'obrienTest', label: "O'Brien Test", sublabel: '90º flex + 10-15º ADD. Resistimos en RI y RE. (+) dolor en RI, alivia en RE', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
            { id: 'compressionRotationTest', label: 'Compression Rotation Test', sublabel: '90º ABD. Compresión + RE y RI pasiva. (+) dolor o chasquido', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
            { id: 'dynamicLabralShearTest', label: 'Dynamic Labral Shear Test', sublabel: 'Presión posterior hacia anterior. Flex pasiva 90º a 150º. (+) reproduce dolor', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
            { id: 'passiveCompressionTest', label: 'Passive Compression Test', sublabel: 'DL. Fijamos hombro desde AC. RE + 30º ABD + compresión + ext. (+) dolor o chasquido', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
            { id: 'jerkTestSlap', label: 'Jerk Test', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
            { id: 'yergasonTest', label: 'Yergason Test', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
            { id: 'bicepsLoadTest', label: 'Biceps Load Test I y II', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
            { id: 'passiveDistractionTest', label: 'Passive Distraction Test', type: 'boolean', showIf: { field: 'abdHorizontalPainful', value: true } },
          ],
        },
        {
          id: 'reactive_tendinopathy',
          title: 'Tendinopatía reactiva',
          description: 'Si SLAP negativo → ECO. Mejora con trabajo activo (isométricos), progresión de cargas, ondas de choque e infiltración',
          fields: [
            { id: 'reactiveTendinopathy', label: 'Tendinopatía reactiva', type: 'boolean' },
          ],
        },
        {
          id: 'neuropathy_end',
          title: 'Neuropatía / Sensibilización central',
          fields: [
            { id: 'supraspinatusNeuropathy', label: 'Neuropatía nervio supraescapular', sublabel: 'Falta fuerza ABD/RE + atrofia supraespinoso e infraespinoso → RMN', type: 'boolean' },
            { id: 'axillaryNeuropathy', label: 'Neuropatía nervio axilar', sublabel: 'Signo de retraso en extensión deltoides + pérdida de contorno del hombro (atrofia deltoides) → RMN', type: 'boolean' },
            { id: 'psychosocialFactors', label: 'Factores psicosociales / Sensibilización central', sublabel: 'SÍ → Derivar especialista indicado / NO → Revisar banderas rojas → Derivar médico', type: 'boolean' },
          ],
        },
      ],
    },
  ],
}