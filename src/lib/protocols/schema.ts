// Zod schemas for protocol validation
// Validates data before saving to database

import { z } from 'zod'

// Base field schemas
export const booleanField = z.boolean().default(false)
export const scaleField = z.number().min(0).max(10).default(0)
export const numberField = z.number().default(0)

// Generic protocol data schema
// Validates that all values are boolean, number or string
export const protocolDataSchema = z.record(
  z.string(),
  z.union([z.boolean(), z.number(), z.string()])
)

// Shoulder protocol schema
export const shoulderDataSchema = z.object({
  eva: scaleField,
  cannotRaiseArm: booleanField,
  pointPain: booleanField,
  activePain: booleanField,
  passivePain: booleanField,
  externalRotationPainful: booleanField,
  frozenShoulder: booleanField,
  dropArmSign: booleanField,
  infraspinatus: booleanField,
  emptyCanTest: booleanField,
  scapularAssistanceTest: booleanField,
  scapularRetractionTest: booleanField,
  neerTest: booleanField,
  hawkinsKennedy: booleanField,
  painfulArcSign: booleanField,
  apprehension: booleanField,
  anteriorInstability: booleanField,
  inferiorInstability: booleanField,
  posteriorInstability: booleanField,
  acJointPain: booleanField,
  crossBodyAdduction: booleanField,
  crankTest: booleanField,
  obrienTest: booleanField,
})

// Cervical protocol schema
export const cervicalDataSchema = z.object({
  eva: scaleField,
  sintomasNeurologicos: booleanField,
  dolorIrradiadoBrazo: booleanField,
  cefalea: booleanField,
  traumatismoLatigazo: booleanField,
  dolorLocalCervical: booleanField,
  desviacionMarcha: booleanField,
  hoffmanTest: booleanField,
  supinadorInvertido: booleanField,
  babinskiTest: booleanField,
  mayorDe45: booleanField,
  ulnt1: booleanField,
  romRotacionMenor60: booleanField,
  testDistraccion: booleanField,
  spurlingTest: booleanField,
  testFlexionRotacion: booleanField,
  dolorUnilateralCabeza: booleanField,
  dolorReproduceMovCervical: booleanField,
  limitacionFlexion: booleanField,
  limitacionExtension: booleanField,
  limitacionRotacionDerecha: booleanField,
  limitacionRotacionIzquierda: booleanField,
  limitacionInclinacionDerecha: booleanField,
  limitacionInclinacionIzquierda: booleanField,
  patronHomolateral: booleanField,
  patronContralateral: booleanField,
  testRoos: booleanField,
  testAdson: booleanField,
  edenTest: booleanField,
  morleyTest: booleanField,
  mejoraManipulacionToracica: booleanField,
  mejoraReposicionEscapula: booleanField,
  mejoraRetraccion: booleanField,
  mejoraMulligan: booleanField,
  mejoraIsometricos: booleanField,
})

export type ShoulderData = z.infer<typeof shoulderDataSchema>
export type CervicalData = z.infer<typeof cervicalDataSchema>