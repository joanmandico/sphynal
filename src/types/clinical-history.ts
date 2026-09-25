// Clinical history collected during "Nueva evaluación", before Red Flags

export type PainCharacterType = 'PUNTUAL' | 'GENERAL'
export type PainTiming = 'DIA' | 'NOCHE' | 'AMBOS'
export type EvolutionType = 'MEJORANDO' | 'EMPEORANDO' | 'IGUAL' | 'ALTIBAJOS'

export interface ClinicalHistoryData {
  laborActivity: string
  sportsActivity: string
  hasPreviousDiagnosis: boolean | null
  previousDiagnosisWhat: string
  previousDiagnosisBy: string

  consultReason: string
  consultLocation: string

  painCharacterType: PainCharacterType | null
  radiatesPain: boolean | null
  radiatesTo: string
  neurologicalSigns: boolean | null
  neurologicalSignsDetail: string
  jointClicking: boolean | null
  lockingSensation: boolean | null
  apprehension: boolean | null
  painTiming: PainTiming | null
  painEVA: number
  aggravatingFactors: string
  relievingFactors: string
  onsetDescription: string
  onsetMechanism: string
  evolution: EvolutionType | null
  evolutionDetail: string

  previousTreatments: string
  relevantMedicalHistory: string
  hasMedication: boolean | null
  medicationDetail: string
  hasAllergies: boolean | null
  allergyDetail: string
}

export const initialClinicalHistoryData: ClinicalHistoryData = {
  laborActivity: '',
  sportsActivity: '',
  hasPreviousDiagnosis: null,
  previousDiagnosisWhat: '',
  previousDiagnosisBy: '',
  consultReason: '',
  consultLocation: '',
  painCharacterType: null,
  radiatesPain: null,
  radiatesTo: '',
  neurologicalSigns: null,
  neurologicalSignsDetail: '',
  jointClicking: null,
  lockingSensation: null,
  apprehension: null,
  painTiming: null,
  painEVA: 0,
  aggravatingFactors: '',
  relievingFactors: '',
  onsetDescription: '',
  onsetMechanism: '',
  evolution: null,
  evolutionDetail: '',
  previousTreatments: '',
  relevantMedicalHistory: '',
  hasMedication: null,
  medicationDetail: '',
  hasAllergies: null,
  allergyDetail: '',
}