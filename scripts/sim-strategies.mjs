// Pass 3.5 Step 2 — 4 strategies x 150 din ka playtest-by-simulation.
// UI ke asal niyamo ko mirror karta hai (branch price 0.5x, restock formula, city unlock gate/cost, import landed cost).
import { initialState, phaseTick, netWorth, bizDef } from '../src/game/engine.js'
import { BUSINESSES } from '../src/game/data.js'
import { CITIES, cityOf } from '../src/game/atlas/cityIndex.js'
import { importsForCat } from '../src/game/imports/index.js'
import { landedCost, arrivalDayFor } from '../src/game/engines/logistics.js'
import { candidatesFor, DEFAULT_RULES } from '../src/game/managers/index.js'

const DAYS = 150
function buyBiz(s, bizId, cityId) {
  const d = bizDef(bizId); const key = bizId + '@' + cityId
  if (s.biz[key]) return false
  const isBranch = Object.keys(s.biz).some((k) => k.split('@')[0] === bizId)
  const price = isBranch ? Math.round(d.cost * 0.5) : d.cost
  if (s.cash < price) return false
  s.cash -= price
  s.biz[key] = { lv: 1, price: 1, stock: 100, staff: d.staff, profitToday: 0, profitTotal: 0, rating: 4.0, mktDays: 0, loc: cityId, employees: [] }
  return true
}
function restockAll(s, threshold = 30) {
  for (const [key, o] of Object.entries(s.biz)) {
    if (o.stock >= threshold) continue
    const d = bizDef(key); const miss = 100 - o.stock
    const cost = Math.round(d.rev * d.cogs * miss / 100 * 0.9) + 10
    if (s.cash >= cost) { s.cash -= cost; o.stock = 100 }
  }
}
function run(name, setup, daily) {
  let s = initialState()
  s.mode = 'manual'
  setup(s)
  let minCash = s.cash, negDays = 0, err = null
  try {
    for (let d = 0; d < DAYS; d++) {
      if (s.lastDaily !== s.day) { s.cash += 750; s.lastDaily = s.day } // daily reward claim (aam khiladi)
      daily(s)
      restockAll(s)
      for (let p = 0; p < 4; p++) s = phaseTick(s)
      if (s.cash < minCash) minCash = s.cash
      if (s.cash < 0) negDays++
      if (!Number.isFinite(s.cash) || !Number.isFinite(netWorth(s))) throw new Error('NaN/Infinity at day ' + s.day)
    }
  } catch (e) { err = e.message }
  const bizProfit = Object.values(s.biz).reduce((a, o) => a + (o.profitTotal || 0), 0)
  return { name, err, day: s.day, nw: netWorth(s), cash: Math.round(s.cash), branches: Object.keys(s.biz).length, bizProfit: Math.round(bizProfit), minCash: Math.round(minCash), negDays, lifeRev: Math.round(s.life.rev), lifeProfit: Math.round(s.life.rev - s.life.costs) }
}

const cheapestBiz = [...BUSINESSES].sort((a, b) => a.cost - b.cost)
const retailBiz = cheapestBiz.find((b) => b.cat === 'Retail') || cheapestBiz[1]

const results = []
// 1) Single stall — sirf chai, koi vistaar nahi
results.push(run('single-stall', (s) => { buyBiz(s, 'chai', 'india_delhi') }, () => {}))
// 2) Franchise spam — cash bachte hi nayi branch/sheher
results.push(run('franchise-spam', (s) => { buyBiz(s, 'chai', 'india_delhi') }, (s) => {
  for (let guard = 0; guard < 12; guard++) {
    const nw = netWorth(s)
    const locked = CITIES.filter((c) => !(s.unlockedCities || []).includes(c.id) && nw >= (c.unlock || 0) && s.cash > (c.cost || 0) + 30000).sort((a, b) => (a.cost || 0) - (b.cost || 0))
    let acted = false
    // pehle naye sheher me chai branch (0.5x), phir unlock
    for (const cid of (s.unlockedCities || ['india_delhi'])) { if (!s.biz['chai@' + cid] && s.cash > 45000) { if (buyBiz(s, 'chai', cid)) { acted = true; break } } }
    if (!acted && locked.length && s.cash > (locked[0].cost || 0) + 45000) { const c = locked[0]; s.cash -= c.cost || 0; s.unlockedCities = [...(s.unlockedCities || ['india_delhi']), c.id]; acted = true }
    if (!acted) break
  }
}))
// 3) Import-heavy — chai + retail, har 5 din import order
results.push(run('import-heavy', (s) => { buyBiz(s, 'chai', 'india_delhi'); buyBiz(s, retailBiz.id, 'india_delhi') }, (s) => {
  if (s.day % 5 !== 0) return
  const owned = Object.entries(s.biz).map(([k, o]) => ({ key: k, d: bizDef(k), o }))
  const listings = importsForCat('Retail').sort((a, b) => a.basePrice - b.basePrice)
  const target = owned.find((x) => x.d.cat === 'Retail') || owned[0]
  if (!target || !listings.length) return
  const L = listings[0]; const qty = 200
  const lc = landedCost(L, qty, s.day)
  if (s.cash < lc.total + 15000) return
  s.cash -= lc.total
  const { arriveDay } = arrivalDayFor(L, s.day, Math.random)
  s.pendingDeliveries = [...(s.pendingDeliveries || []), { bizId: target.key, qty: Math.min(100, Math.round(qty / 2)), arriveTP: arriveDay * 4, kind: 'import', item: L.item, country: L.country, cost: lc.total, payOnDelivery: false, rel: Math.round((1 - (L.delayRisk || 0)) * 100) }]
}))
// 4) Manager-heavy — 2 business + managers (purchase/finance/hr/marketing), baki haath se
results.push(run('manager-heavy', (s) => {
  buyBiz(s, 'chai', 'india_delhi'); buyBiz(s, 'momo', 'india_delhi')
  for (const role of ['purchase', 'finance', 'hr', 'marketing']) {
    const c = candidatesFor(role, 3)[0]
    if (c) s.managers[role] = { pid: c.id, role, roleName: c.roleName, name: c.name, skill: c.skill, salary: c.salary, personality: c.personality, mistakeRate: c.mistakeRate, on: true, rules: { ...(DEFAULT_RULES[role] || {}) } }
  }
}, () => {}))

for (const r of results) console.log(JSON.stringify(r))

// Tick-time benchmark: 54 branches / 216 staff par 400 phases
{
  let s = initialState()
  const cities = (s.unlockedCities = CITIES.slice(0, 12).map((c) => c.id))
  let n = 0
  for (const b of BUSINESSES) for (const cid of cities) { if (n >= 54) break; const key = b.id + '@' + cid; s.biz[key] = { lv: 3, price: 1, stock: 80, staff: b.staff, profitToday: 0, profitTotal: 0, rating: 4.2, mktDays: 0, loc: cid, employees: Array.from({ length: 4 }, () => ({ salary: 9000, skillPct: 60, effPct: 60 })) }; n++ }
  const t0 = performance.now()
  for (let i = 0; i < 400; i++) s = phaseTick(s)
  const ms = (performance.now() - t0) / 400
  console.log(JSON.stringify({ benchmark: '54 branches/216 staff, 400 phases', msPerPhase: +ms.toFixed(3), day: s.day, finite: Number.isFinite(s.cash) }))
}
