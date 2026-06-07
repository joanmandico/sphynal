// Protocol registry
// Add new protocols here to make them available in the app

import { Protocol } from './types'
import { shoulderProtocol } from './data/shoulder'
import { cervicalProtocol } from './data/cervical'

export const protocols: Record<string, Protocol> = {
  shoulder: shoulderProtocol,
  cervical: cervicalProtocol,
}

export function getProtocol(id: string): Protocol | undefined {
  return protocols[id]
}

export { shoulderProtocol, cervicalProtocol }
export * from './types'
export * from './engine'