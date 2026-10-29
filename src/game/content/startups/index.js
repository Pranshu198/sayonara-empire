// 900 startups — portfolio banao, exits ka intezaar karo
import { STARTUPS_1 } from './startups01.js'
import { STARTUPS_2 } from './startups02.js'
import { pick } from '../../../utils/random.js'
export const ALL_STARTUPS = [STARTUPS_1, STARTUPS_2].flat()
export function startupById(id) { return ALL_STARTUPS.find((x) => x.id === id) }
export function dealFlow(n = 5) {
  const out = []; const seen = new Set()
  while (out.length < n) { const c = pick(ALL_STARTUPS); if (!seen.has(c.id)) { seen.add(c.id); out.push(c) } }
  return out
}
