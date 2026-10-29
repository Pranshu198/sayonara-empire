import { BUSINESSES, PHASE_W, STOCKS, COMMODITIES, PROPERTIES, RIVALS, EVENTS } from './data.js'

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
const bizDef = (id) => BUSINESSES.find(b => b.id === id)
export { bizDef }

export function netWorth(s) {
  let nw = s.cash + s.bank + s.sip + s.bonds - s.loan.amount
  for (const [id, o] of Object.entries(s.biz)) { const d = bizDef(id); nw += d.cost * (0.6 + 0.25 * o.lv) }
  for (const [sym, q] of Object.entries(s.holdings)) { const st = [...s.stocks, ...s.commodities].find(x => x.sym === sym); if (st) nw += st.price * q }
  for (const pid of s.props) { const p = PROPERTIES.find(x => x.id === pid); if (p) nw += p.cost * Math.pow(1.06, s.day / 365) }
  for (const f of s.fds) nw += f.amt
  return Math.round(nw)
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
    news: [{ day: 1, text: '📰 Sheher Times: Naya udyami sheher me aaya — Sayonara Empire ki shuruaat!' }],
    eventEff: 'calm',
    missions: genMissions(1), missionsDone: [],
    ach: [], xp: 0,
    lastDaily: 0, lastSpin: 0, lastSaveAt: Date.now(),
    prestige: 0, prestigeMult: 1,
    story: ['Day 1: Empire ki neev rakhi gayi — ₹50K cash ke saath.'],
    nwHist: [50000],
    totalEarned: 0,
  }
}

export function genMissions(day) {
  const pool = [
    { id: 'm_earn', text: 'Aaj ₹2,000 kamao (revenue)', target: 2000, kind: 'earn', reward: 400 },
    { id: 'm_biz', text: 'Kam se kam 1 business own karo', target: 1, kind: 'own', reward: 300 },
    { id: 'm_stock', text: 'Market me koi 5 shares/commodity rakho', target: 5, kind: 'hold', reward: 350 },
    { id: 'm_save', text: 'Bank me ₹10,000 rakho', target: 10000, kind: 'bank', reward: 300 },
  ]
  return pool.map(m => ({ ...m, day }))
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
  const phaseW = s.phase
  let phaseRev = 0, phaseCost = 0
  for (const [id, o] of Object.entries(s.biz)) {
    const d = bizDef(id)
    const w = PHASE_W[d.cat][phaseW]
    const lvMult = 1 + 0.18 * (o.lv - 1)
    const elasticity = Math.max(0.35, 1 - (o.price - 1) * 1.15) // price up -> demand down
    const ratingF = 0.8 + (o.rating - 3) * 0.12
    const mktF = o.mktDays > 0 ? 1.3 : 1
    const eventF = s.eventEff === 'boom' && (d.cat === 'Food' || d.cat === 'Retail') ? 1.3 : s.eventEff === 'salary' && d.cat === 'Retail' ? 1.2 : s.eventEff === 'rain' ? 0.9 : s.eventEff === 'match' && phaseW === 2 ? 1.25 : 1
    const stockF = o.stock <= 0 ? 0.45 : o.stock < 20 ? 0.8 : 1
    const fullRev = d.rev * w * lvMult * o.price * elasticity * ratingF * mktF * eventF * stockF * s.seasonBoost * rnd(0.9, 1.1) * s.prestigeMult
    const cogs = fullRev * d.cogs * s.supplier
    const fixedDaily = o.staff * d.wage + d.rent + d.util + d.cost * 0.0003
    const fixed = fixedDaily * 0.25
    const wastage = fullRev * 0.02
    const costs = cogs + fixed + wastage
    const profit = fullRev - costs
    // cashflow: 85% abhi, 15% udhaar (receivables, kal settle)
    s.cash += fullRev * 0.85 - costs
    s.receivables += fullRev * 0.15
    o.stock = Math.max(0, o.stock - w * 26)
    o.rating = Math.max(3, Math.min(5, o.rating + rnd(-0.02, 0.025) + (o.price > 1.25 ? -0.02 : 0.01)))
    if (o.mktDays > 0) o.mktDays -= 0.25
    o.profitToday += profit; o.profitTotal += profit
    phaseRev += fullRev; phaseCost += costs
    s.monthProfit += profit
  }
  s.dayRevenue += phaseRev; s.dayCosts += phaseCost
  s.totalEarned += Math.max(0, phaseRev - phaseCost)
  s.xp += 2
  if (s.phase === 3) endDay(s); else s.phase += 1
  return s
}

function endDay(s) {
  s.phase = 0
  // receivables settle
  s.cash += s.receivables; s.receivables = 0
  // property rent (daily share)
  let rent = 0; for (const pid of s.props) { const p = PROPERTIES.find(x => x.id === pid); rent += (p.rent || 0) / 30 }
  s.cash += rent
  // FD interest + SIP growth (daily tiny accrual)
  s.fds.forEach(f => { f.amt *= 1 + 0.07 / 365 })
  s.sip *= 1 + 0.11 / 365; s.bonds *= 1 + 0.075 / 365
  // stock random walk + sentiment
  const walk = (arr, vol) => arr.forEach(st => { const ch = rnd(-vol, vol) + s.sentiment * 0.004; st.price = Math.max(1, st.price * (1 + ch)); st.hist = [...st.hist.slice(-29), Math.round(st.price)] })
  walk(s.stocks, 0.03); walk(s.commodities, 0.018)
  s.commodities.find(c => c.sym === 'BTC').price *= 1 + rnd(-0.02, 0.02)
  // supplier drift + economy
  s.supplier = Math.max(0.88, Math.min(1.18, s.supplier + rnd(-0.015, 0.015)))
  s.sentiment = Math.max(-3, Math.min(3, s.sentiment + rnd(-0.7, 0.7)))
  s.seasonBoost = [1, 1.05, 0.95, 1.15][Math.floor(s.day / 90) % 4]
  // rivals grow
  s.rivals.forEach(r => { r.nw *= 1 + r.g * rnd(0.4, 1.6) })
  // random event
  if (Math.random() < 0.3) {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)]
    s.eventEff = ev.eff
    if (ev.eff === 'crash') s.sentiment = -2
    if (ev.eff === 'boom') s.sentiment = 1.5
    if (ev.eff === 'costly') s.supplier = Math.min(1.18, s.supplier + 0.06)
    s.news = [{ day: s.day + 1, text: ev.t }, ...s.news].slice(0, 12)
  } else s.eventEff = 'calm'
  if (Math.random() < 0.2) {
    const top = [...s.rivals].sort((a, b) => b.nw - a.nw)[0]
    s.news = [{ day: s.day + 1, text: `📰 Sheher Times: ${top.name} abhi aage (${fmt(top.nw)}) — ${top.pers} style se badh raha hai.` }, ...s.news].slice(0, 12)
  }
  // day report + history
  s.lastDayReport = { day: s.day, revenue: Math.round(s.dayRevenue), costs: Math.round(s.dayCosts), profit: Math.round(s.dayRevenue - s.dayCosts), rent: Math.round(rent) }
  s.nwHist = [...s.nwHist.slice(-59), netWorth(s)]
  for (const o of Object.values(s.biz)) o.profitToday = 0
  s.dayRevenue = 0; s.dayCosts = 0
  s.day += 1
  s.missions = genMissions(s.day)
  // ---- MONTH END: guarded, tax ONLY on this month's accumulated profit (Day-30 freeze fix by design) ----
  if (s.day % 30 === 0 && s.lastTaxDay !== s.day) {
    s.lastTaxDay = s.day
    if (s.monthProfit > 0) {
      const tax = s.monthProfit * 0.10
      s.cash -= tax
      s.news = [{ day: s.day, text: `🧾 Month-end: Is mahine ke profit par tax ${fmt(tax)} kata. (Sirf is mahine ka profit ginna gaya)` }, ...s.news].slice(0, 12)
    }
    // dividends 1.5% of stock holdings value
    let div = 0; for (const [sym, q] of Object.entries(s.holdings)) { const st = s.stocks.find(x => x.sym === sym); if (st) div += st.price * q * 0.015 }
    if (div > 0) { s.cash += div; s.news = [{ day: s.day, text: `💰 Dividend mila: ${fmt(div)}` }, ...s.news].slice(0, 12) }
    // SIP monthly invest from bank/cash
    if (s.sipMonthly > 0 && s.cash >= s.sipMonthly) { s.cash -= s.sipMonthly; s.sip += s.sipMonthly }
    // loan EMI monthly
    if (s.loan.amount > 0) {
      s.cash -= s.loan.emi; s.loan.amount = Math.max(0, s.loan.amount - (s.loan.emi - s.loan.amount * 0.01)); s.loan.months -= 1
      if (s.loan.months <= 0 || s.loan.amount <= 0) { s.loan = { amount: 0, emi: 0, months: 0 }; s.credit = Math.min(900, s.credit + 25) }
    }
    s.monthProfit = 0
  }
  s.lastSaveAt = Date.now()
}
