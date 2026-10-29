// Poori events library — 2400 unique events, engine yahi se roz ka event uthata hai
import { EVENTS_1 } from './events01.js'
import { pick } from '../../../utils/random.js'
export const ALL_EVENTS = [EVENTS_1].flat() // base pool (Pass 3.4 diet: part 01 only); parts 02-20 deepLoader stream karta hai (live array)
export function randomEvent() { return pick(ALL_EVENTS) }
export function eventsByEff(eff) { return ALL_EVENTS.filter((e) => e.eff === eff) }
export function eventById(id) { return ALL_EVENTS.find((e) => e.id === id) }
