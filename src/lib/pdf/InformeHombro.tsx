// PDF Report generator for shoulder evaluation
// Uses @react-pdf/renderer to generate clinical reports

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import { ShoulderEvaluationData, DiagnosisResult } from '@/lib/algorithms/shoulder'
import { RedFlagsData, RedFlagResult } from '@/lib/algorithms/redflags'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
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
  redFlagsData: RedFlagsData
  redFlagsResult: RedFlagResult
  shoulderData: ShoulderEvaluationData
  diagnosis: DiagnosisResult
  clinicianName?: string
}

function BoolRow({ label, value }: { label: string; value: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={value ? styles.positive : styles.negative}>
        {value ? 'POSITIVO' : 'NEGATIVO'}
      </Text>
    </View>
  )
}

export function InformeHombro({
  patient,
  evaluationDate,
  redFlagsData,
  redFlagsResult,
  shoulderData,
  diagnosis,
  clinicianName,
}: Props) {
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sphynal — Informe Clínico</Text>
          <Text style={styles.subtitle}>Evaluación de Hombro — Protocolo Completo</Text>
        </View>

        {/* Patient info */}
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

        {/* Red Flags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RED FLAGS</Text>
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

        {/* Clinical tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRUEBAS CLÍNICAS</Text>
          <BoolRow label="No puede levantar el brazo" value={shoulderData.cannotRaiseArm} />
          <BoolRow label="Dolor a punta de dedo" value={shoulderData.pointPain} />
          <BoolRow label="Signo de caída del brazo" value={shoulderData.dropArmSign} />
          <BoolRow label="Prueba del infraespinoso" value={shoulderData.infraspinatus} />
          <BoolRow label="Test lata vacía / Jobe" value={shoulderData.emptyCanTest} />
          <BoolRow label="Neer test" value={shoulderData.neerTest} />
          <BoolRow label="Hawkins-Kennedy" value={shoulderData.hawkinsKennedy} />
          <BoolRow label="Signo arco doloroso" value={shoulderData.painfulArcSign} />
          <BoolRow label="Hombro congelado" value={shoulderData.frozenShoulder} />
          <BoolRow label="Aprehensión / inestabilidad" value={shoulderData.apprehension} />
          <BoolRow label="Test de Crank" value={shoulderData.crankTest} />
          <BoolRow label="Test O'Brien" value={shoulderData.obrienTest} />
        </View>

        {/* Diagnosis */}
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
          {diagnosis.recommendations.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 8 }]}>RECOMENDACIONES</Text>
              {diagnosis.recommendations.map((r, i) => (
                <Text key={i} style={styles.listItem}>✓ {r}</Text>
              ))}
            </>
          )}
        </View>

        {/* Footer */}
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