// Arth-Gyaan Kosh — Help section me khoj kar padho
import { ENCYCLOPEDIA } from './terms.js'
export { ENCYCLOPEDIA }
export function searchTerms(q) {
  const s = (q || '').toLowerCase()
  return ENCYCLOPEDIA.filter((e) => e.term.toLowerCase().includes(s) || e.def.toLowerCase().includes(s))
}
