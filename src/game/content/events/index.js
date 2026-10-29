// Poori events library — 2400 unique events, engine yahi se roz ka event uthata hai
import { EVENTS_1 } from './events01.js'
import { EVENTS_2 } from './events02.js'
import { EVENTS_3 } from './events03.js'
import { EVENTS_4 } from './events04.js'
import { EVENTS_5 } from './events05.js'
import { EVENTS_6 } from './events06.js'
import { EVENTS_7 } from './events07.js'
import { EVENTS_8 } from './events08.js'
import { pick } from '../../../utils/random.js'
export const ALL_EVENTS = [EVENTS_1, EVENTS_2, EVENTS_3, EVENTS_4, EVENTS_5, EVENTS_6, EVENTS_7, EVENTS_8].flat()
export function randomEvent() { return pick(ALL_EVENTS) }
export function eventsByEff(eff) { return ALL_EVENTS.filter((e) => e.eff === eff) }
export function eventById(id) { return ALL_EVENTS.find((e) => e.id === id) }
