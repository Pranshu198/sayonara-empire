// 620 decision cards — har din ek naya faisla
import { CARDS_1 } from './cards01.js'
import { pick } from '../../../utils/random.js'
export const ALL_CARDS = [CARDS_1].flat() // base (Pass 3.4 diet: part 01 only); cards02+ deepLoader se stream
export function randomCard() { return pick(ALL_CARDS) }
export function cardForDay(day) { return ALL_CARDS[day % ALL_CARDS.length] }
