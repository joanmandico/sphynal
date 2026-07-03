// Generic protocol types
// These types define the structure of any clinical evaluation protocol

export type FieldType =
  | 'boolean'
  | 'scale'
  | 'number'
  | 'select'

export interface ProtocolField {
  id: string
  label: string
  type: FieldType
  sublabel?: string
  min?: number
  max?: number
  options?: string[]
  defaultValue?: boolean | number | string
  showIf?: {
    field: string
    value: boolean | number | string
  }
}

export interface ProtocolSection {
  id: string
  title: string
  description?: string
  fields: ProtocolField[]
  variant?: 'default' | 'danger' | 'warning'
  showIf?: {
    field: string
    value: boolean | number | string
  }
}

export interface ProtocolStep {
  id: string
  title: string
  sections: ProtocolSection[]
  showIf?: {
    field: string
    value: boolean | number | string
  }
}

export interface DiagnosisResult {
  primary: string
  confidence: 'alta' | 'moderada' | 'baja'
  shouldRefer: boolean
  referReason?: string
  differentials: string[]
  treatment: string[]
  comparableSign?: string[]
}

export interface Protocol {
  id: string
  name: string
  bodyArea: string
  steps: ProtocolStep[]
  diagnose: (data: Record<string, unknown>) => DiagnosisResult
}

export type ProtocolData = Record<string, boolean | number | string | null>