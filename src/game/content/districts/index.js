// Saare jile — Home ke Sheher section me inki kahani dikhti hai
import { DISTRICT as U } from './uttam.js'
import { DISTRICT as D } from './dwarka.js'
import { DISTRICT as L } from './laxmi.js'
import { DISTRICT as K } from './karol.js'
import { DISTRICT as C } from './connaught.js'
import { DISTRICT as G } from './gurgaon.js'
export const DISTRICT_LORE = [U, D, L, K, C, G]
export function loreOf(name) { return DISTRICT_LORE.find((d) => name.startsWith(d.name.split(' ')[0])) }
