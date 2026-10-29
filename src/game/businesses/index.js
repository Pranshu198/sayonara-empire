// Saare 32 businesses — har ek apni file se aata hai
import chai from './chai.js'
import momo from './momo.js'
import dhaba from './dhaba.js'
import restaurant from './restaurant.js'
import kirana from './kirana.js'
import mobileshop from './mobileshop.js'
import boutique from './boutique.js'
import electronics from './electronics.js'
import salon from './salon.js'
import carwash from './carwash.js'
import repair from './repair.js'
import gym from './gym.js'
import tuition from './tuition.js'
import coaching from './coaching.js'
import playschool from './playschool.js'
import computer from './computer.js'
import pharmacy from './pharmacy.js'
import dental from './dental.js'
import lab from './lab.js'
import hospital from './hospital.js'
import appstartup from './appstartup.js'
import ytstudio from './ytstudio.js'
import gaming from './gaming.js'
import itagency from './itagency.js'
import bakeryf from './bakeryf.js'
import garment from './garment.js'
import furniture from './furniture.js'
import printing from './printing.js'
import evcharge from './evcharge.js'
import solar from './solar.js'
import petrol from './petrol.js'
import roplant from './roplant.js'
import { CATEGORIES, CAT_LABEL, CAT_BLURB } from './categories.js'
import { PHASES, PHASE_W, bestPhaseOf } from './phaseWeights.js'

export const BUSINESSES = [chai, momo, dhaba, restaurant, kirana, mobileshop, boutique, electronics, salon, carwash, repair, gym, tuition, coaching, playschool, computer, pharmacy, dental, lab, hospital, appstartup, ytstudio, gaming, itagency, bakeryf, garment, furniture, printing, evcharge, solar, petrol, roplant]
export const BIZ_BY_ID = Object.fromEntries(BUSINESSES.map((b) => [b.id, b]))
export function bizIdOf(key) { return (key || '').split('@')[0] }
export function branchKey(id, city) { return id + '@' + (city || 'india_delhi') }
export function cityOfKey(key) { const p = (key || '').split('@'); return p[1] || 'india_delhi' }
export function bizDef(id) { return BIZ_BY_ID[bizIdOf(id)] }
export function businessesOfCat(cat) { return BUSINESSES.filter((b) => b.cat === cat) }
export function cheapestBusiness() { return [...BUSINESSES].sort((a, b) => a.cost - b.cost)[0] }
export { CATEGORIES, CAT_LABEL, CAT_BLURB, PHASES, PHASE_W, bestPhaseOf }
