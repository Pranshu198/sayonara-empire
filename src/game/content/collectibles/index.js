// 750 collectibles — kharido, sambhalo, sahi waqt par becho ya auction karo
import { COLLECTIBLES_1 } from './items01.js'
import { COLLECTIBLES_2 } from './items02.js'
import { pick } from '../../../utils/random.js'
export const ALL_COLLECTIBLES = [COLLECTIBLES_1, COLLECTIBLES_2].flat()
export function collectibleById(id) { return ALL_COLLECTIBLES.find((c) => c.id === id) }
export function dailyPicks(n = 6) {
  const out = []; const seen = new Set()
  while (out.length < n) { const c = pick(ALL_COLLECTIBLES); if (!seen.has(c.id)) { seen.add(c.id); out.push(c) } }
  return out
}
export function collectiblesByKind(kind) { return ALL_COLLECTIBLES.filter((c) => c.kind === kind) }
