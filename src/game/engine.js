import { BUSINESSES, PHASE_W, STOCKS, COMMODITIES, PROPERTIES, RIVALS } from './data.js'
import { randomEvent } from './content/events/index.js'
import { headline } from './content/news/index.js'
import { randomCustomer } from './content/customers/index.js'
import { cardForDay } from './content/decisions/index.js'
import { missionsForDay } from './content/missions/index.js'
import { DEFAULT_SETTINGS, withDefaults, difficultyFactor, taxRateOf } from './settings.js'
import { wealthDayTick, wealthDailyIncome, wealthValue } from './wealthEngine.js'
import { bazaarDayTick, ensureBazaar } from './bazaarEngine.js'
import { auctionPhaseTick, ensureAuction } from './auctionEngine.js'
import { cityOf, demandOf } from './atlas/cityIndex.js'
import { festMultFor, festStaffLeave } from './festivals/index.js'
import { phaseDemand, seasonBoostFor } from './engines/demand.js'
import { ceilingPenalty } from './engines/elasticity.js'
import { supplierDrift, contractCogsMult } from './engines/supply.js'
import { fixedDailyCost, staffLeaveFactor } from './engines/labour.js'
import { walkMarket } from './engines/market.js'
import { dailyRent } from './engines/property.js'
import { growRivals, topRival } from './engines/rival.js'
import { ratingDrift, complaintHit } from './engines/reputation.js'
import { wastageRateFor, complaintChance } from './engines/risk.js'
import { monthEnd } from './engines/treasury.js'
import { runManagerPhase, runManagerDay, runHrDay, processDeliveries } from './engines/automation.js'
import { corporateOrder } from './engines/festival.js'

export const fmt = (n) => {
  n = Math.round(n || 0)
  const neg = n < 0; n = Math.abs(n)
  let s
  if (n >= 1e7) s = '₹' + (n / 1e7).toFixed(2) + ' Cr'
  else if (n >= 1e5) s = '₹' + (n / 1e5).toFixed(2) + ' L'
  else if (n >= 1e3) s = '₹' + (n / 1e3).toFixed(1) + ' K'
  else s = '₹' + n
  return neg ? '-' + s : s
}
const rnd = (a, b) => a + Math.random() * (b - a)
// Pass 3.4 micro-opt: bizDef har branch har phase me chalta hai — Array.find ki jagah Map lookup (key-cache ke saath)
const BIZ_BY_ID = new Map(BUSINESSES.map((b) => [b.id, b]))
const BIZ_KEY_CACHE = new Map()
const bizDef = (id) => { let d = BIZ_KEY_CACHE.get(id); if (!d) { d = BIZ_BY_ID.get((id || '').split('@')[0]); if (d) BIZ_KEY_CACHE.set(id, d) } return d }
export { bizDef }

export function netWorth(s) {
  let nw = s.cash + s.bank + s.sip + s.bonds - s.loan.amount
  for (const [id, o] of Object.entries(s.biz)) { const d = bizDef(id); nw += d.cost * (0.6 + 0.25 * o.lv) }
  const ASSET_BY_SYM = new Map([...s.stocks, ...s.commodities].map((x) => [x.sym, x])) // Pass 3.4: loop ke andar spread+find hata diya
  for (const [sym, q] of Object.entries(s.holdings)) { const st = ASSET_BY_SYM.get(sym); if (st) nw += st.price * q }
  const PROP_BY_ID = new Map(PROPERTIES.map((x) => [x.id, x]))
  for (const pid of s.props) { const p = PROP_BY_ID.get(pid); if (p) nw += p.cost * Math.pow(1.06, s.day / 365) }
  for (const f of s.fds) nw += f.amt
  nw += wealthValue(s)
  return Math.round(nw)
}

// Lifetime stats counters (Stats tab yahi se padhta hai) — purane saves par ye ab se ginne shuru hote hain
export function freshLife(day = 1) {
  return { rev: 0, costs: 0, tax: 0, wages: 0, customers: 0, items: 0, phases: 0, bestDayProfit: null, worstDayProfit: null, bestDay: 0, worstDay: 0, biggestDayCost: 0, streak: 0, longestStreak: 0, milestones: {}, lifeStartDay: day }
}
export function initialState(savedElapsedSec = 0) {
  return {
    cash: 50000, bank: 0, day: 1, phase: 0,
    mode: 'manual', dayLen: 60, speed: 1,
    biz: {}, // id -> {lv, price, stock, staff, profitToday, profitTotal, rating, mktDays}
    stocks: STOCKS.map(x => ({ ...x, hist: [x.price] })),
    commodities: COMMODITIES.map(x => ({ ...x, hist: [x.price] })),
    holdings: {},
    props: [], fds: [], sip: 0, sipMonthly: 0, bonds: 0,
    loan: { amount: 0, emi: 0, months: 0 },
    credit: 720,
    supplier: 1.0, sentiment: 0, seasonBoost: 1,
    monthProfit: 0, lastTaxDay: 0, receivables: 0,
    dayRevenue: 0, dayCosts: 0, lastDayReport: null,
    rivals: RIVALS.map(r => ({ ...r })),
    news: [{ day: 1, text: ' Sheher Times: Naya udyami sheher me aaya — Sayonara Empire ki shuruaat!' }],
    eventEff: 'calm',
    missions: genMissions(1), missionsDone: [],
    ach: [], xp: 0,
    lastDaily: 0, lastSpin: 0, lastSaveAt: Date.now(),
    prestige: 0, prestigeMult: 1,
    settings: { ...DEFAULT_SETTINGS },
    reviews: [], decision: null, decisionDay: 0,
    bazaar: [], myListings: [], auction: null,
    invest: {}, investPrices: {}, collectibles: [], collectPrices: {}, collectWatch: [],
    startups: {}, movies: {}, capsules: [], lifestyle: [], charity: 0, rep: 50,
    cityProjects: [], happinessBonus: 0, oppDay: 0, predictions: [], treasuresActive: [],
    ach2: [], legacyBank: 0,
    story: ['Day 1: Empire ki neev rakhi gayi — ₹50K cash ke saath.'],
    unlockedCities: ['india_delhi'],
    contracts: {}, pendingDeliveries: [], importedBoost: {},
    managers: {}, managerLog: [], managerStats: {}, mgrState: {}, holdAvg: {},
    life: freshLife(1), lastBreakdown: null, bd: null,
    nwHist: [50000],
    totalEarned: 0,
  }
}

export function genMissions(day) {
  return missionsForDay(day)
}
export function missionProgress(s, m) {
  if (m.kind === 'earn') return Math.min(m.target, Math.round(s.dayRevenue))
  if (m.kind === 'own') return Object.keys(s.biz).length
  if (m.kind === 'hold') return Object.values(s.holdings).reduce((a, b) => a + b, 0)
  if (m.kind === 'bank') return Math.round(s.bank)
  return 0
}

// ---- one phase tick (Morning/Afternoon/Evening/Night) ----
export function phaseTick(prev) {
  const s = structuredClone(prev)
  if (!s.life) s.life = freshLife(s.day || 1)
  s.life.phases += 1
  if (!s.bd) s.bd = { cogs: 0, wages: 0, rent: 0, util: 0, wastage: 0 }
  processDeliveries(s, fmt)
  const phaseW = s.phase
  let phaseRev = 0, phaseCost = 0
  for (const [id, o] of Object.entries(s.biz)) {
    const d = bizDef(id)
    const w = PHASE_W[d.cat][phaseW]
    const lvMult = 1 + 0.18 * (o.lv - 1)
    const { elasticity, ratingF, mktF, eventF, stockF } = phaseDemand(d, o, s, phaseW)
    const city = cityOf(o.loc)
    const locF = demandOf(city, d.cat)
    const festF = festMultFor(s.day, city, d.cat)
    const leaveF = staffLeaveFactor(festStaffLeave(s.day, city))
    const contract = (s.contracts || {})[id]
    const ceilF = ceilingPenalty(o.price, contract)
    const impF = (s.importedBoost || {})[id] > 0 ? 1.15 : 1
    const empList = o.employees || []
    const empWagePhase = empList.reduce((a, e) => a + (e.salary || 0), 0) / 120
    const empAvgQ = empList.length ? empList.reduce((a, e) => a + ((e.skillPct || 50) + (e.effPct || 50)) / 2, 0) / empList.length / 100 : 0
    const empF = (empList.length ? Math.min(1.3, 1 + 0.28 * empAvgQ) : 1) * (s.hrMorale || 1)
    const fullRev = d.rev * w * lvMult * o.price * elasticity * ratingF * mktF * eventF * stockF * locF * festF * leaveF * ceilF * impF * empF * s.seasonBoost * rnd(0.9, 1.1) * s.prestigeMult * difficultyFactor(s.settings)
    const cogs = fullRev * d.cogs * s.supplier * contractCogsMult(contract)
    const fixed = fixedDailyCost(d, o, city) * 0.25
    const wastage = fullRev * wastageRateFor(contract)
    const costs = cogs + fixed + wastage + empWagePhase
    if (contract && Math.random() < complaintChance(contract)) complaintHit(o)
    const profit = fullRev - costs
    // ---- Stats: lifetime counters + din ka kharcha-breakdown (wages/rent/cogs/util/wastage alag-alag) ----
    const cityRent = city ? city.rent : 1
    s.bd.cogs += cogs; s.bd.wages += o.staff * d.wage * 0.25 + empWagePhase; s.bd.rent += d.rent * cityRent * 0.25; s.bd.util += d.util * 0.25; s.bd.wastage += wastage
    s.life.rev += fullRev; s.life.costs += costs; s.life.wages += o.staff * d.wage * 0.25 + empWagePhase
    const custEst = fullRev / (55 * Math.max(0.5, o.price))
    s.life.customers += custEst; s.life.items += custEst * 1.6
    // cashflow: 85% abhi, 15% udhaar (receivables, kal settle)
    s.cash += fullRev * 0.85 - costs
    s.receivables += fullRev * 0.15
    o.stock = Math.max(0, o.stock - w * 26)
    o.rating = ratingDrift(o, s, rnd)
    if (o.mktDays > 0) o.mktDays -= 0.25
    o.profitToday += profit; o.profitTotal += profit
    phaseRev += fullRev; phaseCost += costs
    s.monthProfit += profit
  }
  // Auction har phase me jeeta hai — boliyan yahi lagti hain
  ensureAuction(s)
  const aucNews = auctionPhaseTick(s)
  if (aucNews.length) s.news = [...aucNews, ...s.news].slice(0, 12)
  s.dayRevenue += phaseRev; s.dayCosts += phaseCost
  s.totalEarned += Math.max(0, phaseRev - phaseCost)
  s.xp += 2
  runManagerPhase(s, bizDef, fmt)
  if (s.phase === 3) endDay(s); else s.phase += 1
  return s
}

function endDay(s) {
  s.phase = 0
  // receivables settle
  s.cash += s.receivables; s.receivables = 0
  // wealth assets ki roz ki aamdani (kiraya jaisi)
  const wInc = wealthDailyIncome(s)
  if (wInc > 0) s.cash += wInc
  // property rent (daily share) — Property Engine
  const rent = dailyRent(s, PROPERTIES)
  s.cash += rent
  // FD interest + SIP growth (daily tiny accrual)
  s.fds.forEach(f => { f.amt *= 1 + 0.07 / 365 })
  s.sip *= 1 + 0.11 / 365; s.bonds *= 1 + 0.075 / 365
  // stock random walk + sentiment — Market Engine
  walkMarket(s, rnd)
  // supplier drift + economy — Supply Engine
  const volF = (s.settings && s.settings.volatility) || 1
  const infF = (s.settings && s.settings.inflation) || 1
  s.supplier = supplierDrift(s, rnd, volF, infF)
  s.sentiment = Math.max(-3, Math.min(3, s.sentiment + rnd(-0.7, 0.7) * volF))
  s.seasonBoost = seasonBoostFor(s.day)
  // rivals grow — Rival AI Engine
  growRivals(s, rnd)
  // random event — 2400 wali badi library se, frequency setting ke hisaab se
  if (Math.random() < 0.3 * ((s.settings && s.settings.eventFreq) || 1)) {
    const ev = randomEvent()
    s.eventEff = ev.eff
    if (ev.eff === 'crash') s.sentiment = -2
    if (ev.eff === 'boom') s.sentiment = 1.5
    if (ev.eff === 'costly') s.supplier = Math.min(1.18, s.supplier + 0.06)
    s.news = [{ day: s.day + 1, text: ev.t }, ...s.news].slice(0, 12)
  } else s.eventEff = 'calm'
  if (Math.random() < 0.2) {
    const top = topRival(s)
    s.news = [{ day: s.day + 1, text: ` Sheher Times: ${top.name} abhi aage (${fmt(top.nw)}) — ${top.pers} style se badh raha hai.` }, ...s.news].slice(0, 12)
  }
  // day report + history
  s.lastDayReport = { day: s.day, revenue: Math.round(s.dayRevenue), costs: Math.round(s.dayCosts), profit: Math.round(s.dayRevenue - s.dayCosts), rent: Math.round(rent) }
  const nwNow = netWorth(s)
  s.nwHist = [...s.nwHist.slice(-59), nwNow]
  // ---- Stats: din ke records, streaks, milestones, kharcha-breakdown band karo ----
  if (!s.life) s.life = freshLife(s.day)
  const dp = s.lastDayReport.profit
  if (s.life.bestDayProfit === null || dp > s.life.bestDayProfit) { s.life.bestDayProfit = dp; s.life.bestDay = s.day }
  if (s.life.worstDayProfit === null || dp < s.life.worstDayProfit) { s.life.worstDayProfit = dp; s.life.worstDay = s.day }
  s.life.biggestDayCost = Math.max(s.life.biggestDayCost || 0, s.lastDayReport.costs)
  if (dp > 0) { s.life.streak = (s.life.streak || 0) + 1; s.life.longestStreak = Math.max(s.life.longestStreak || 0, s.life.streak) } else s.life.streak = 0
  s.life.milestones = s.life.milestones || {}
  for (const [k, t] of [['nw1L', 100000], ['nw10L', 1000000], ['nw1Cr', 10000000], ['nw10Cr', 100000000], ['nw100Cr', 1000000000]]) if (nwNow >= t && !s.life.milestones[k]) s.life.milestones[k] = s.day
  s.lastBreakdown = { ...(s.bd || { cogs: 0, wages: 0, rent: 0, util: 0, wastage: 0 }), interest: s.loan.amount > 0 ? Math.round(s.loan.emi / 30) : 0 }
  s.bd = { cogs: 0, wages: 0, rent: 0, util: 0, wastage: 0 }
  for (const o of Object.values(s.biz)) o.profitToday = 0
  s.dayRevenue = 0; s.dayCosts = 0
  s.day += 1
  s.missions = genMissions(s.day)
  // ---- MONTH END: Treasury Engine — guarded, tax ONLY on this month's accumulated profit (Day-30 fix) ----
  monthEnd(s, fmt)
  // ---- naye systems: wealth, bazaar, reviews, decision, headlines ----
  const wNews = wealthDayTick(s)
  if (wNews.length) s.news = [...wNews, ...s.news].slice(0, 12)
  ensureBazaar(s)
  const bzNews = bazaarDayTick(s)
  if (bzNews.length) s.news = [...bzNews, ...s.news].slice(0, 12)
  // Festival Engine: bade tyohar par corporate hamper order (Food/Retail maliko ko)
  const ownedCats2 = [...new Set(Object.keys(s.biz).map((id) => bizDef(id).cat))]
  const myCities = (s.unlockedCities || ['india_delhi']).map((cid) => cityOf(cid))
  const co = corporateOrder(s, myCities, ownedCats2.includes('Food') || ownedCats2.includes('Retail'), Math.random)
  if (co) { const bonus = Math.round(25000 * (0.8 + Math.random() * 0.7)); s.cash += bonus; s.news = [{ day: s.day + 1, text: ` ${co.f.name} (${co.city.name}): Corporate hamper order mila — ${fmt(bonus)} ki ek saath kamaai! Taiyari ka fayda.` }, ...s.news].slice(0, 12) }
  // Imported tag ki miyaad ghatao
  if (s.importedBoost) for (const k of Object.keys(s.importedBoost)) { s.importedBoost[k] -= 1; if (s.importedBoost[k] <= 0) delete s.importedBoost[k] }
  // AI Managers ke din-bhar ke kaam (finance/trading/hr/expansion)
  runManagerDay(s, bizDef, fmt, netWorth)
  runHrDay(s, bizDef, fmt)
  // Sheher Times ki taazi headline (badi library se)
  if (Math.random() < 0.5) {
    const topBiz = Object.keys(s.biz)[0] ? bizDef(Object.keys(s.biz)[0]).name : 'nayi dukaan'
    const txt = headline(null, { player: 'Sayonara Empire', rival: [...s.rivals].sort((a, b) => b.nw - a.nw)[0].name, biz: topBiz, stock: pickStockName(s), place: 'Uttam Nagar', fest: 'Diwali' })
    s.news = [{ day: s.day + 1, text: ' Sheher Times: ' + txt }, ...s.news].slice(0, 12)
  }
  // Graahak reviews (badi customer library se)
  const ownedCats = [...new Set(Object.keys(s.biz).map((id) => bizDef(id).cat))]
  if (ownedCats.length && Math.random() < 0.8) {
    const c = randomCustomer(ownedCats[Math.floor(Math.random() * ownedCats.length)])
    s.reviews = [{ day: s.day + 1, name: c.name, job: c.job, stars: c.stars, text: c.text, cat: c.cat }, ...(s.reviews || [])].slice(0, 10)
  }
  // Aaj ka faisla (decision card)
  const card = cardForDay(s.day + 1)
  s.decision = { id: card.id, title: card.title, story: card.story, a: card.a, b: card.b }
  s.decisionDay = s.day + 1
  s.lastSaveAt = Date.now()
}
function pickStockName(s) { return s.stocks[Math.floor(Math.random() * s.stocks.length)].sym }
