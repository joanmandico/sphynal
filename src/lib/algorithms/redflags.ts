// Red flags algorithm for shoulder evaluation
// Based on the clinical protocol document

type BoolField = boolean | null

export interface RedFlagsData {
  // 5D/3N (Codman)
  dysarthria: BoolField
  dysphagia: BoolField
  diplopia: BoolField
  dizziness: BoolField
  dropAttacks: BoolField
  nystagmus: BoolField
  numbness: BoolField
  nausea: BoolField
  // Vertebrobasilar - HINTS+
  acuteVestibularSyndrome: BoolField
  headImpulseNormal: BoolField
  nystagmusVerticalPuro: BoolField
  nystagmusCambiaDireccion: BoolField
  nystagmusRotatorioPuro: BoolField
  skewDeviation: BoolField
  suddenHearingLoss: BoolField
  severeAtaxia: BoolField
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
  mecanismoCaidaAltura: BoolField
  mecanismoCargaAxial: BoolField
  mecanismoAccidenteVehiculo: BoolField
  mecanismoVehiculoRecreativo: BoolField
  mecanismoBicicleta: BoolField
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
  tumorPerdidaPeso: BoolField
  tumorFatigaDebilidad: BoolField
  tumorDolorPersistente: BoolField
  tumorCambiosPiel: BoolField
  tumorSangradoAnormal: BoolField
  tumorTosPersistente: BoolField
  tumorDificultadTragar: BoolField
  tumorBultosMasas: BoolField
  tumorCambiosSenos: BoolField
  tumorGanglios: BoolField
  // Infección
  infeccionFiebre: BoolField
  infeccionFatiga: BoolField
  infeccionEnrojecimientoHinchazon: BoolField
  infeccionSecrecionesAnormales: BoolField
  infeccionTosCongestion: BoolField
  infeccionDiarreaVomitos: BoolField
  infeccionDolorOrinar: BoolField
  infeccionAumentoFrecuenciaCardiaca: BoolField
  // Reuma
  reumaAfectacionesCutaneas: BoolField
  reumaErupcionesCutaneas: BoolField
  reumaEnrojecimientoPiel: BoolField
  reumaSequedadDescamacion: BoolField
  reumaLesionesUlcerativas: BoolField
  reumaAmpollasVesiculares: BoolField
  reumaHinchazon: BoolField
  reumaLesionesEscamosas: BoolField
  reumaUlcerasOrales: BoolField
  reumaOjosRojosSecos: BoolField
  reumaPoliartralgia: BoolField
  reumaEdad20a40: BoolField
  reumaDebutSacroileitisTalalgia: BoolField
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

  // 5D/3N (Codman)
  if (data.dysarthria === true) critical.push('Dysarthria positiva')
  if (data.dysphagia === true) critical.push('Dysphagia positiva')
  if (data.diplopia === true) critical.push('Diplopia positiva')
  if (data.dizziness === true) critical.push('Dizziness/mareo-vértigo positivo')
  if (data.dropAttacks === true) critical.push('Drop attack positivo')
  if (data.nystagmus === true) critical.push('Nystagmus positivo')
  if (data.numbness === true) warnings.push('Numbness/entumecimiento positivo')
  if (data.nausea === true) warnings.push('Nausea positiva')

  if (critical.length > 0) {
    shouldRefer.push('Derivación urgente — posible afectación del tronco del encéfalo')
  }

  // Vertebrobasilar - HINTS+ (solo aplica en síndrome vestibular agudo)
  if (data.acuteVestibularSyndrome === true) {
    const centralFindings: string[] = []
    if (data.headImpulseNormal === true) centralFindings.push('Head Impulse Test normal')
    if (data.nystagmusVerticalPuro === true) centralFindings.push('Nistagmo vertical puro')
    if (data.nystagmusCambiaDireccion === true) centralFindings.push('Nistagmo direction-changing')
    if (data.nystagmusRotatorioPuro === true) centralFindings.push('Nistagmo rotatorio puro')
    if (data.skewDeviation === true) centralFindings.push('Test of Skew positivo')
    if (data.suddenHearingLoss === true) centralFindings.push('Pérdida auditiva súbita')
    if (data.severeAtaxia === true) centralFindings.push('Ataxia severa')

    if (centralFindings.length > 0) {
      critical.push(`HINTS+ compatible con causa central: ${centralFindings.join(', ')}`)
      shouldRefer.push('Derivación urgente hospitalaria — sospecha ictus vertebrobasilar (HINTS central)')
    }
  }

  // Vascular
  const has5D3NPositive = [
    data.dysarthria, data.dysphagia, data.diplopia, data.dizziness,
    data.dropAttacks, data.nystagmus, data.numbness, data.nausea,
  ].some(v => v === true)

  if (has5D3NPositive) {
    warnings.push('Extension Rotation Test no valorado — ya existe una Red Flag positiva en 5D/3N (Codman), sospecha vertebrobasilar ya confirmada')
  } else if (data.extensionRotationTest === true) {
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
    const hasMecanismoPeligroso = [
      data.mecanismoCaidaAltura,
      data.mecanismoCargaAxial,
      data.mecanismoAccidenteVehiculo,
      data.mecanismoVehiculoRecreativo,
      data.mecanismoBicicleta,
    ].some(v => v === true)

    if (data.edad65oMas === true || hasMecanismoPeligroso) {
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
  const tumorFindings = [
    { value: data.tumorPerdidaPeso, label: 'Pérdida de peso inexplicada' },
    { value: data.tumorFatigaDebilidad, label: 'Fatiga y debilidad persistentes' },
    { value: data.tumorDolorPersistente, label: 'Dolor persistente o recurrente sin causa aparente' },
    { value: data.tumorCambiosPiel, label: 'Cambios en la piel' },
    { value: data.tumorSangradoAnormal, label: 'Sangrado anormal o cambios intestinales/urinarios' },
    { value: data.tumorTosPersistente, label: 'Tos persistente o cambios en la voz' },
    { value: data.tumorDificultadTragar, label: 'Dificultades para tragar' },
    { value: data.tumorBultosMasas, label: 'Bultos o masas' },
    { value: data.tumorCambiosSenos, label: 'Cambios en los senos' },
    { value: data.tumorGanglios, label: 'Cambios en los ganglios linfáticos' },
  ].filter(f => f.value === true)

  if (tumorFindings.length > 0) {
    warnings.push(`Sintomatología compatible con tumor/cáncer: ${tumorFindings.map(f => f.label).join(', ')}`)
    shouldRefer.push('Derivación médica — descartar proceso neoplásico')
  }

  // Infección
  const infeccionFindings = [
    { value: data.infeccionFiebre, label: 'Fiebre' },
    { value: data.infeccionFatiga, label: 'Fatiga' },
    { value: data.infeccionEnrojecimientoHinchazon, label: 'Enrojecimiento e hinchazón' },
    { value: data.infeccionSecrecionesAnormales, label: 'Secreciones anormales' },
    { value: data.infeccionTosCongestion, label: 'Tos, estornudos y congestión nasal' },
    { value: data.infeccionDiarreaVomitos, label: 'Diarrea o vómitos' },
    { value: data.infeccionDolorOrinar, label: 'Dolor al orinar' },
    { value: data.infeccionAumentoFrecuenciaCardiaca, label: 'Aumento de la frecuencia cardíaca' },
  ].filter(f => f.value === true)

  if (infeccionFindings.length > 0) {
    warnings.push(`Sintomatología compatible con infección: ${infeccionFindings.map(f => f.label).join(', ')}`)
    shouldRefer.push('Derivación médica — descartar proceso infeccioso')
  }

  // Reuma
  const reumaCutaneaFindings = [
    { value: data.reumaErupcionesCutaneas, label: 'Erupciones cutáneas (manchas, parches, pápulas, pústulas, vesículas o placas)' },
    { value: data.reumaEnrojecimientoPiel, label: 'Enrojecimiento de la piel (eritema) en áreas afectadas' },
    { value: data.reumaSequedadDescamacion, label: 'Sequedad y descamación' },
    { value: data.reumaLesionesUlcerativas, label: 'Lesiones ulcerativas' },
    { value: data.reumaAmpollasVesiculares, label: 'Ampollas / Lesiones vesiculares' },
    { value: data.reumaHinchazon, label: 'Hinchazón' },
    { value: data.reumaLesionesEscamosas, label: 'Lesiones escamosas' },
    { value: data.reumaUlcerasOrales, label: 'Úlceras orales' },
    { value: data.reumaOjosRojosSecos, label: 'Ojos rojos o secos' },
  ].filter(f => f.value === true)

  if (reumaCutaneaFindings.length > 0) {
    warnings.push(`Afectaciones cutáneas o membranas mucosas: ${reumaCutaneaFindings.map(f => f.label).join(', ')}`)
    warnings.push('Sintomatología reumática')
    shouldRefer.push('Posible patología reumática — valorar en analítica (HLA-B27, PCR, VSG)')
  }

  if (data.reumaPoliartralgia === true && data.reumaEdad20a40 === true && data.reumaDebutSacroileitisTalalgia === true) {
    warnings.push('Poliartralgias con paciente de 20 a 40 años y debut con sacroileítis/talalgia')
    warnings.push('Sintomatología reumática')
    shouldRefer.push('Posible patología reumática — alta probabilidad de Espondilitis Anquilosante, valorar en analítica (HLA-B27, PCR, VSG)')
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