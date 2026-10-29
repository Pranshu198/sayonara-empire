// Rivals ki baatein — Rich List me unki soch dikhti hai
import { pick } from '../../../utils/random.js'
export const ALL_DIALOGUES = [] // Pass 3.4 diet: saare dialogues deepLoader se stream hote hain (live array, splash ke peeche bharta hai)
export function dialogueOf(rivalName) {
  const pool = ALL_DIALOGUES.filter((d) => d.rival === rivalName)
  return pool.length ? pick(pool) : null
}
