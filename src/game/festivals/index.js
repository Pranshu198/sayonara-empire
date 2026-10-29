// Global Festivals — saari duniya ke tyohar, game calendar (360 din = 12 mahine x 30 din) par
// Engine yahi se har sheher ke liye sakriya tyohar aur demand asar nikalta hai
import { FESTIVALS_INDIA } from './india.js'
import { FESTIVALS_INDIA_2 } from './india2.js'
import { FESTIVALS_WORLD } from './world.js'
import { FESTIVALS_WORLD_2 } from './world2.js'
export const ALL_FESTIVALS = [FESTIVALS_INDIA, FESTIVALS_INDIA_2, FESTIVALS_WORLD, FESTIVALS_WORLD_2].flat()
export const dayOfYear = (day) => ((Math.max(1, day) - 1) % 360) + 1
export const monthOfDay = (day) => Math.floor((dayOfYear(day) - 1) / 30) + 1
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export function festivalMatches(f, city) {
  if (!city) return f.scope === 'global' || (f.scope === 'country' && f.region === 'India')
  if (f.scope === 'global') return true
  if (f.scope === 'city') return f.region === city.name
  if (f.scope === 'state') return f.region === city.state
  if (f.scope === 'country') return f.region === city.country
  return false
}
export function isActiveOn(f, day) { const d = (dayOfYear(day) - f.start + 360) % 360; return d < f.days }
export function activeFestivals(day, city) { return ALL_FESTIVALS.filter((f) => isActiveOn(f, day) && festivalMatches(f, city)) }
// Kisi category ke liye sabse bada sakriya festival multiplier (1 = koi asar nahi)
export function festMultFor(day, city, cat) {
  let m = 1
  for (const f of activeFestivals(day, city)) { const b = (f.cats || {})[cat]; if (b && b > m) m = b }
  return m
}
export function festStaffLeave(day, city) { return activeFestivals(day, city).some((f) => f.staffLeave) }
export function majorActive(day, city) { return activeFestivals(day, city).filter((f) => f.major) }
// Aane wale tyohar — taiyari ke liye (stock, price, marketing pehle se set karo)
export function upcomingFestivals(day, cities, within = 30) {
  const out = []
  for (const f of ALL_FESTIVALS) {
    const inDays = (f.start - dayOfYear(day) + 360) % 360
    if (inDays === 0 || inDays > within) continue
    const hits = (cities || []).filter((c) => festivalMatches(f, c))
    if (hits.length) out.push({ f, inDays, cities: hits.map((c) => c.name) })
  }
  return out.sort((a, b) => a.inDays - b.inDays)
}
export function festivalsByMonth(month, cities) {
  return ALL_FESTIVALS.filter((f) => Math.floor((f.start - 1) / 30) + 1 === month && (!cities || cities.some((c) => festivalMatches(f, c))))
}
// Season — engine ke seasonBoost [1, 1.05, 0.95, 1.15] ke hisaab se varsh ko 4 hisso me
const SEASONS = [
  { name: 'Vasant — Halki Garmi', boost: 1, tip: 'Aam din, santulan ka season' },
  { name: 'Garmi — Tez Dhoop', boost: 1.05, tip: 'Thande aur Energy ki mang zyada' },
  { name: 'Barsaat — Monsoon', boost: 0.95, tip: 'Footfall dheemi, delivery aur zaroori cheezein tez' },
  { name: 'Tyohar — Sardi Shuruaat', boost: 1.15, tip: 'Saal ka sabse bada kamaai season' },
]
export function seasonOf(day) { return SEASONS[Math.floor((dayOfYear(day) - 1) / 90) % 4] }
