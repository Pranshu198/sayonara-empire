// 500 movie projects — producer bano
import { MOVIES_1 } from './movies01.js'
import { MOVIES_2 } from './movies02.js'
import { pick } from '../../../utils/random.js'
export const ALL_MOVIES = [MOVIES_1, MOVIES_2].flat()
export function movieById(id) { return ALL_MOVIES.find((m) => m.id === id) }
export function nowShowing(n = 4) {
  const out = []; const seen = new Set()
  while (out.length < n) { const c = pick(ALL_MOVIES); if (!seen.has(c.id)) { seen.add(c.id); out.push(c) } }
  return out
}
