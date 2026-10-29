// 182 missions — engine roz din ke hisaab se chunta hai
import { MISSIONS_1 } from './missions01.js'
import { sample } from '../../../utils/random.js'
export const ALL_MISSIONS = [MISSIONS_1].flat()
export function missionsForDay(day) {
  const scaled = ALL_MISSIONS.filter((m) => (m.kind === 'earn' || m.kind === 'bank') ? m.target <= 3000 + day * 2500 : true)
  return sample(scaled.length ? scaled : ALL_MISSIONS, 4).map((m) => ({ ...m, day }))
}
