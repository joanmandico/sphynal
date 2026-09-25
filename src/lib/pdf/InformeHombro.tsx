import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import { ClinicalHistory } from '@prisma/client'
import { RedFlagsData, RedFlagResult } from '@/lib/algorithms/redflags'
import { DiagnosisResult } from '@/lib/protocols/types'
import { buildRedFlagsReport } from './redFlagsReport'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 70,
    paddingLeft: 40,
    paddingRight: 40,
    color: '#1e293b',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    backgroundColor: '#f1f5f9',
    padding: 4,
  },
  subSectionBlock: {
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 4,
    textDecoration: 'underline',
  },
  noteText: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  blockLabel: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 2,
  },
  paragraphText: {
    fontSize: 9,
    color: '#0f172a',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  label: {
    color: '#475569',
    flex: 1,
  },
  value: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  positive: {
    color: '#dc2626',
    fontFamily: 'Helvetica-Bold',
  },
  negative: {
    color: '#16a34a',
  },
  notEvaluated: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  diagnosisBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#0f172a',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  diagnosisTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  confidence: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
    paddingLeft: 8,
  },
  redFlagAlert: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  redFlagText: {
    color: '#dc2626',
    fontSize: 9,
  },
  blockedBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#dc2626',
    padding: 12,
    borderRadius: 4,
  },
  blockedText: {
    color: '#dc2626',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
})

interface Props {
  patient: {
    firstName: string
    lastName: string
    birthDate: Date
    occupation?: string | null
    sport?: string | null
  }
  evaluationDate: Date
  clinicalHistory: ClinicalHistory | null
  redFlagsData: RedFlagsData
  redFlagsResult: RedFlagResult
  shoulderData: Record<string, unknown> | null
  diagnosis: DiagnosisResult | null
  clinicianName?: string
}

function BoolRow({ label, value }: { label: string; value: boolean | null | undefined }) {
  const result = value === true ? 'POSITIVO' : value === false ? 'NEGATIVO' : 'NO VALORADO'
  const style = value === true ? styles.positive : value === false ? styles.negative : styles.notEvaluated
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={style}>{result}</Text>
    </View>
  )
}

function YesNoRow({ label, value }: { label: string; value: boolean | null | undefined }) {
  const result = value === true ? 'Sí' : value === false ? 'No' : 'No indicado'
  const style = value === null || value === undefined ? styles.notEvaluated : styles.value
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={style}>{result}</Text>
    </View>
  )
}

function ValueRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  )
}

function TextBlock({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={styles.blockLabel}>{label}</Text>
      <Text style={styles.paragraphText}>{value || '—'}</Text>
    </View>
  )
}

function painCharacterLabel(v: string | null | undefined) {
  if (v === 'PUNTUAL') return 'A punta de dedo'
  if (v === 'GENERAL') return 'General'
  return '—'
}

function painTimingLabel(v: string | null | undefined) {
  if (v === 'DIA') return 'Durante el día'
  if (v === 'NOCHE') return 'Durante la noche'
  if (v === 'AMBOS') return 'Ambos'
  return '—'
}

function evolutionLabel(v: string | null | undefined) {
  if (v === 'MEJORANDO') return 'Mejorando'
  if (v === 'EMPEORANDO') return 'Empeorando'
  if (v === 'IGUAL') return 'Se mantiene igual'
  if (v === 'ALTIBAJOS') return 'Con altibajos'
  return '—'
}

export function InformeHombro({
  patient,
  evaluationDate,
  clinicalHistory,
  redFlagsData,
  redFlagsResult,
  shoulderData,
  diagnosis,
  clinicianName,
}: Props) {
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear()
  const isBlocked = !shoulderData || !diagnosis
  const redFlagsReportSections = buildRedFlagsReport(redFlagsData)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Sphynal — Informe Clínico</Text>
          <Text style={styles.subtitle}>
            Evaluación de Hombro — {isBlocked ? 'Interrumpida por Red Flags' : 'Protocolo Completo'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL PACIENTE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre y apellidos</Text>
            <Text style={styles.value}>{patient.firstName} {patient.lastName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <Text style={styles.value}>
              {new Date(patient.birthDate).toLocaleDateString('es-ES')} ({age} años)
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actividad laboral</Text>
            <Text style={styles.value}>{patient.occupation || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Práctica deportiva</Text>
            <Text style={styles.value}>{patient.sport || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de evaluación</Text>
            <Text style={styles.value}>
              {new Date(evaluationDate).toLocaleDateString('es-ES')}
            </Text>
          </View>
        </View>

        {clinicalHistory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HISTORIA CLÍNICA</Text>

            <View style={styles.subSectionBlock}>
              <Text style={styles.subSectionTitle}>Datos generales</Text>
              <ValueRow label="Actividad laboral (referida en consulta)" value={clinicalHistory.laborActivity} />
              <ValueRow label="Práctica deportiva habitual" value={clinicalHistory.sportsActivity} />
            </View>

            <View style={styles.subSectionBlock}>
              <Text style={styles.subSectionTitle}>Diagnóstico previo</Text>
              <YesNoRow label="¿Diagnóstico médico previo?" value={clinicalHistory.hasPreviousDiagnosis} />
              {clinicalHistory.hasPreviousDiagnosis && (
                <>
                  <ValueRow label="¿De qué fue diagnosticado?" value={clinicalHistory.previousDiagnosisWhat} />
                  <ValueRow label="¿Por qué profesional?" value={clinicalHistory.previousDiagnosisBy} />
                </>
              )}
            </View>

            <View style={styles.subSectionBlock}>
              <Text style={styles.subSectionTitle}>Motivo de consulta</Text>
              <ValueRow label="Localización" value={clinicalHistory.consultLocation} />
              <TextBlock label="Descripción" value={clinicalHistory.consultReason} />
            </View>

            <View style={styles.subSectionBlock}>
              <Text style={styles.subSectionTitle}>Características del dolor</Text>
              <ValueRow label="Tipo de dolor" value={painCharacterLabel(clinicalHistory.painCharacterType)} />
              <YesNoRow label="¿Irradia a otra zona?" value={clinicalHistory.radiatesPain} />
              {clinicalHistory.radiatesPain && (
                <ValueRow label="¿Hacia dónde irradia?" value={clinicalHistory.radiatesTo} />
              )}
              <YesNoRow label="¿Signos neurológicos?" value={clinicalHistory.neurologicalSigns} />
              {clinicalHistory.neurologicalSigns && (
                <ValueRow label="Especificar" value={clinicalHistory.neurologicalSignsDetail} />
              )}
              <YesNoRow label="¿Chasquidos o ruidos articulares?" value={clinicalHistory.jointClicking} />
              <YesNoRow label="¿Sensación de bloqueo?" value={clinicalHistory.lockingSensation} />
              <YesNoRow label="¿Aprehensión?" value={clinicalHistory.apprehension} />
            </View>

            <View style={styles.subSectionBlock}>
              <Text style={styles.subSectionTitle}>Comportamiento temporal</Text>
              <ValueRow label="Momento del día" value={painTimingLabel(clinicalHistory.painTiming)} />
              <ValueRow
                label="Intensidad (EVA)"
                value={clinicalHistory.painEVA != null ? `${clinicalHistory.painEVA}/10` : undefined}
              />
            </View>

            <View style={styles.subSectionBlock}>
              <Text style={styles.subSectionTitle}>Factores agravantes y aliviantes</Text>
              <TextBlock label="Empeoran" value={clinicalHistory.aggravatingFactors} />
              <TextBlock label="Alivian" value={clinicalHistory.relievingFactors} />
            </View>

            <View style={styles.subSectionBlock}>
              <Text style={styles.subSectionTitle}>Inicio</Text>
              <ValueRow label="¿Cuándo comenzó?" value={clinicalHistory.onsetDescription} />
              <ValueRow label="¿Con qué coincidió?" value={clinicalHistory.onsetMechanism} />
            </View>

            <View style={styles.subSectionBlock}>
              <Text style={styles.subSectionTitle}>Evolución</Text>
              <ValueRow label="Evolución de los síntomas" value={evolutionLabel(clinicalHistory.evolution)} />
              {clinicalHistory.evolution === 'ALTIBAJOS' && (
                <ValueRow label="¿Con qué coinciden los altibajos?" value={clinicalHistory.evolutionDetail} />
              )}
            </View>

            <View style={styles.subSectionBlock}>
              <Text style={styles.subSectionTitle}>Antecedentes</Text>
              <TextBlock label="Tratamientos previos" value={clinicalHistory.previousTreatments} />
              <TextBlock label="Antecedentes médicos relevantes" value={clinicalHistory.relevantMedicalHistory} />
              <YesNoRow label="¿Toma medicación habitual?" value={clinicalHistory.hasMedication} />
              {clinicalHistory.hasMedication && (
                <ValueRow label="¿Cuál?" value={clinicalHistory.medicationDetail} />
              )}
              <YesNoRow label="¿Alergias?" value={clinicalHistory.hasAllergies} />
              {clinicalHistory.hasAllergies && (
                <ValueRow label="¿A qué?" value={clinicalHistory.allergyDetail} />
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RED FLAGS — RESUMEN</Text>
          {redFlagsResult.hasRedFlags ? (
            <>
              {redFlagsResult.critical.map((flag, i) => (
                <View key={i} style={styles.redFlagAlert}>
                  <Text style={styles.redFlagText}>⚠ {flag}</Text>
                </View>
              ))}
              {redFlagsResult.warnings.map((w, i) => (
                <View key={i} style={[styles.redFlagAlert, { backgroundColor: '#fffbeb', borderColor: '#fcd34d' }]}>
                  <Text style={[styles.redFlagText, { color: '#d97706' }]}>! {w}</Text>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.row}>
              <Text style={styles.label}>Resultado</Text>
              <Text style={styles.negative}>Sin red flags</Text>
            </View>
          )}
        </View>

        {redFlagsReportSections.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RED FLAGS — DETALLE DE PRUEBAS REALIZADAS</Text>
            {redFlagsReportSections.map((sec, i) => (
              <View key={i} style={styles.subSectionBlock}>
                <Text style={styles.subSectionTitle}>{sec.title}</Text>
                {sec.note && <Text style={styles.noteText}>{sec.note}</Text>}
                {sec.lines.map((ln, j) => (
                  <View key={j} style={styles.row}>
                    <Text style={styles.label}>{ln.label}</Text>
                    <Text style={ln.isPositive ? styles.positive : styles.negative}>{ln.result}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {isBlocked ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ESTADO DE LA EVALUACIÓN</Text>
            <View style={styles.blockedBox}>
              <Text style={styles.blockedText}>
                Evaluación no continuada — derivación médica urgente requerida
              </Text>
              <Text style={[styles.redFlagText, { textAlign: 'center', marginTop: 6 }]}>
                No se completaron las pruebas clínicas del protocolo de hombro debido a la presencia
                de Red Flags críticas detectadas durante la anamnesis.
              </Text>
            </View>
            {redFlagsResult.shouldRefer.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 8 }]}>DERIVACIONES RECOMENDADAS</Text>
                {redFlagsResult.shouldRefer.map((r, i) => (
                  <Text key={i} style={styles.listItem}>→ {r}</Text>
                ))}
              </>
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PRUEBAS CLÍNICAS</Text>
              <BoolRow label="No puede levantar el brazo" value={shoulderData.cannotRaiseArm as boolean} />
              <BoolRow label="Dolor a punta de dedo" value={shoulderData.pointPain as boolean} />
              <BoolRow label="Signo de caída del brazo" value={shoulderData.dropArmSign as boolean} />
              <BoolRow label="Prueba del infraespinoso" value={shoulderData.infraspinatus as boolean} />
              <BoolRow label="Test lata vacía / Jobe" value={shoulderData.emptyCanTest as boolean} />
              <BoolRow label="Neer test" value={shoulderData.neerTest as boolean} />
              <BoolRow label="Hawkins-Kennedy" value={shoulderData.hawkinsKennedy as boolean} />
              <BoolRow label="Signo arco doloroso" value={shoulderData.painfulArcSign as boolean} />
              <BoolRow label="Hombro congelado" value={shoulderData.frozenShoulder as boolean} />
              <BoolRow label="Aprehensión / inestabilidad" value={shoulderData.apprehension as boolean} />
              <BoolRow label="Test de Crank" value={shoulderData.crankTest as boolean} />
              <BoolRow label="Test O'Brien" value={shoulderData.obrienTest as boolean} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DIAGNÓSTICO</Text>
              <View style={styles.diagnosisBox}>
                <Text style={styles.diagnosisTitle}>{diagnosis.primary}</Text>
                <Text style={styles.confidence}>
                  Confianza: {diagnosis.confidence.toUpperCase()}
                </Text>
                {diagnosis.differentials.length > 0 && (
                  <>
                    <Text style={[styles.label, { marginBottom: 4 }]}>Diagnósticos diferenciales:</Text>
                    {diagnosis.differentials.map((d, i) => (
                      <Text key={i} style={styles.listItem}>• {d}</Text>
                    ))}
                  </>
                )}
              </View>
              {diagnosis.treatment.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 8 }]}>RECOMENDACIONES</Text>
                  {diagnosis.treatment.map((r, i) => (
                    <Text key={i} style={styles.listItem}>✓ {r}</Text>
                  ))}
                </>
              )}
            </View>
          </>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Sphynal — Motor de Decisión Clínica</Text>
          <Text style={styles.footerText}>
            {clinicianName || 'Fisioterapeuta'} — {new Date(evaluationDate).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </Page>
    </Document>
  )
}