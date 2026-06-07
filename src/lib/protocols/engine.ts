// Generic evaluation engine
// Processes any protocol and returns initial data and validation

import { Protocol, ProtocolData } from './types'
import { protocolDataSchema } from './schema'

// Build initial data object from protocol definition
export function buildInitialData(protocol: Protocol): ProtocolData {
  const data: ProtocolData = {}

  for (const step of protocol.steps) {
    for (const section of step.sections) {
      for (const field of section.fields) {
        if (field.defaultValue !== undefined) {
          data[field.id] = field.defaultValue
        } else if (field.type === 'boolean') {
          data[field.id] = false
        } else if (field.type === 'scale' || field.type === 'number') {
          data[field.id] = field.min ?? 0
        } else if (field.type === 'select') {
          data[field.id] = field.options?.[0] ?? ''
        }
      }
    }
  }

  return data
}

// Validate protocol data against schema
export function validateProtocolData(data: ProtocolData): boolean {
  const result = protocolDataSchema.safeParse(data)
  return result.success
}

// Check if a section should be visible given current data
export function isSectionVisible(
  section: { showIf?: { field: string; value: unknown } },
  data: ProtocolData
): boolean {
  if (!section.showIf) return true
  return data[section.showIf.field] === section.showIf.value
}

// Check if a field should be visible given current data
export function isFieldVisible(
  field: { showIf?: { field: string; value: unknown } },
  data: ProtocolData
): boolean {
  if (!field.showIf) return true
  return data[field.showIf.field] === field.showIf.value
}

// Run diagnosis for a protocol
export function runDiagnosis(protocol: Protocol, data: ProtocolData) {
  return protocol.diagnose(data)
}