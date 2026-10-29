// Bulk achievements + progress nikaalne wala helper
import { BULK_ACH } from './bulk.js'
export { BULK_ACH }
export function bulkProgress(s, a, nw, owned, level) {
  if (a.metric === 'nw') return nw
  if (a.metric === 'day') return s.day
  if (a.metric === 'own') return owned
  if (a.metric === 'level') return level
  return 0
}
