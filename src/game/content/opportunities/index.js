// Roz ke naye mauke: mystery deal, khazana, prediction — sab khatm bhi hote hain, jaldi faisla karo
import { MYSTERY } from './mystery.js'
import { TREASURES } from './treasures.js'
import { PREDICTIONS } from './predictions.js'
import { pick } from '../../../utils/random.js'
export { MYSTERY, TREASURES, PREDICTIONS }
export function dailyOpportunities(day) {
  return {
    mystery: MYSTERY[day % MYSTERY.length],
    treasure: TREASURES[(day * 3) % TREASURES.length],
    prediction: PREDICTIONS[(day * 7) % PREDICTIONS.length],
  }
}
export function randomMystery() { return pick(MYSTERY) }
