// Rivals ki baatein — Rich List me unki soch dikhti hai
import { DIALOGUES as D1 } from './simran.js'
import { DIALOGUES as D2 } from './vikram.js'
import { DIALOGUES as D3 } from './ananya.js'
import { DIALOGUES as D4 } from './rohit.js'
import { DIALOGUES as D5 } from './priya.js'
import { DIALOGUES as D6 } from './sharma.js'
import { pick } from '../../../utils/random.js'
export const ALL_DIALOGUES = [D1, D2, D3, D4, D5, D6].flat()
export function dialogueOf(rivalName) {
  const pool = ALL_DIALOGUES.filter((d) => d.rival === rivalName)
  return pool.length ? pick(pool) : null
}
