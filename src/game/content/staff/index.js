// 1750 staff profiles — business card par team yahi se banti hai (deterministic per business)
import { STAFF_1 } from './staff01.js'
import { STAFF_2 } from './staff02.js'
import { STAFF_3 } from './staff03.js'
import { STAFF_4 } from './staff04.js'
import { STAFF_5 } from './staff05.js'
export const ALL_STAFF = [STAFF_1, STAFF_2, STAFF_3, STAFF_4, STAFF_5].flat()
export function staffForBiz(bizId, cat, count) {
  const pool = ALL_STAFF.filter((p) => p.cat === cat)
  let h = 0; for (const ch of bizId) h = (h * 31 + ch.charCodeAt(0)) % 9973
  const out = []
  for (let i = 0; i < count; i++) out.push(pool[(h + i * 7) % pool.length])
  return out
}
