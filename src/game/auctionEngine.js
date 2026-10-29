// ============ AUCTION HOUSE — boli ki jung, naam wale bidders ke saath ============
import { PROPERTIES } from './data.js'
import { dailyPicks } from './content/collectibles/index.js'
import { BUSINESSES } from './data.js'
import { rnd, pick, chance } from '../utils/random.js'

export const BIDDERS = [
  { name: 'Simran (Mall Mogul)', style: 'Aggressive', budget: 30000000, nerve: 1.25 },
  { name: 'Rohit (Stock Shark)', style: 'Sniper — aakhri pal me bolta hai', budget: 20000000, nerve: 1.15 },
  { name: 'Ananya (Property Tycoon)', style: 'Premium — pasand aaya to keemat nahi dekhti', budget: 26000000, nerve: 1.35 },
  { name: 'Kallu Collector', style: 'Bluffer — shuru me dhamki, beech me gayab', budget: 8000000, nerve: 0.9 },
  { name: 'Mrs. Batra', style: 'Steady — dheere dheere badhti hai', budget: 12000000, nerve: 1.1 },
  { name: 'Ek Gumnaam Khariddar', style: 'Rahasya — koi nahi jaanta kitna dega', budget: 50000000, nerve: 1.5 },
  { name: 'Sharma Ji (Kirana King)', style: 'Kanjoos — sirf sasta mile to', budget: 5000000, nerve: 0.8 },
]
let lotCounter = 0
export function genLot(day, phaseCount = 4) {
  lotCounter += 1
  const kind = pick(['property', 'collectible', 'business', 'surplus', 'rare'])
  let lot = { uid: 'auc_' + day + '_' + lotCounter + '_' + Math.floor(Math.random() * 1e5), kind, current: 0, leader: null, leaderIsPlayer: false, endsInPhases: phaseCount, hist: [], bornDay: day }
  if (kind === 'property') {
    const p = pick(PROPERTIES)
    lot = { ...lot, name: p.name, desc: 'Property lot — jeetne par seedha tumhare naam. Rent aur appreciation ke saath.', refId: p.id, start: Math.round(p.cost * 0.55), value: p.cost }
  } else if (kind === 'business') {
    const b = pick(BUSINESSES)
    lot = { ...lot, name: `${b.icon} Band hoti ${b.name} (poora setup)`, desc: 'Band ho rahi dukaan ka poora saaman + jagah ka adhikar. Jeetne par business Lv2 par tumhare paas aayega.', refId: b.id, start: Math.round(b.cost * 0.4), value: b.cost }
  } else if (kind === 'surplus') {
    const goods = pick(['Sarkari daftar ka furniture lot', 'Band factory ki machinein', 'Railway ka purana saaman lot', 'Bank shaka ka band setup', 'School ka purana equipment lot'])
    const val = Math.round(rnd(80000, 900000))
    lot = { ...lot, name: goods, desc: 'Sarkari surplus — andar kya niklega, andaza hi hai. Bechne par andazi keemat ke aas-paas milega.', refId: null, start: Math.round(val * 0.35), value: val }
  } else {
    const c = dailyPicks(1)[0]
    lot = { ...lot, name: `${c.kind}: ${c.name}`, desc: c.story + ' Collectible lot — keemat samay ke saath ghumti hai.', refId: c.id, start: Math.round(c.price * 0.5), value: c.price }
    if (kind === 'rare') { lot.start = Math.round(c.price * 0.7); lot.name = ' RARE: ' + lot.name }
  }
  lot.current = lot.start
  return lot
}
export function ensureAuction(s) {
  s.auction = s.auction || { lots: [], upcoming: [], hist: [] }
  while (s.auction.lots.length < 3) s.auction.lots.push(genLot(s.day, Math.round(rnd(4, 12))))
  while (s.auction.upcoming.length < 3) {
    const l = genLot(s.day + Math.round(rnd(1, 4)))
    s.auction.upcoming.push({ name: l.name, kind: l.kind, day: s.day + Math.round(rnd(1, 4)), start: l.start })
  }
  return s.auction
}
// Har phase me NPC boliyan — style ke hisaab se vyavhaar
export function auctionPhaseTick(s) {
  const news = []
  const auc = s.auction; if (!auc) return news
  for (const lot of [...auc.lots]) {
    lot.endsInPhases -= 1
    // NPC bid chance
    const bidders = BIDDERS.filter((b) => lot.current < b.budget * (lot.value ? Math.min(1.6, b.nerve) * lot.value / Math.max(1, lot.value) : 1))
    for (const b of BIDDERS) {
      const isSniper = b.style.includes('Sniper')
      const isBluff = b.style.includes('Bluffer')
      let p = 0.16
      if (isSniper) p = lot.endsInPhases <= 1 ? 0.75 : 0.05
      if (isBluff) p = lot.hist.length < 2 ? 0.4 : 0.05
      const ceiling = Math.round((lot.value || lot.start * 2) * b.nerve)
      if (lot.leader === b.name) continue
      if (lot.current >= Math.min(b.budget, ceiling)) continue
      if (chance(p)) {
        const inc = Math.max(1000, Math.round(lot.current * rnd(0.04, 0.1)))
        lot.current += inc; lot.leader = b.name; lot.leaderIsPlayer = false
        lot.hist = [...lot.hist.slice(-6), { bidder: b.name, amt: lot.current }]
      }
    }
    if (lot.endsInPhases <= 0) {
      // Tumhari lagayi lot ka settlement: boli mili to 95% cash (5% fees), na mili to cheez wapas
      if (lot.mine) {
        if (lot.leader) {
          const pay = Math.round(lot.current * 0.95)
          s.cash += pay
          news.push({ day: s.day, text: ` Tumhari lot biki: ${lot.name} — ${fmtLocal(pay)} mile (5% nilami fees kat kar).` })
        } else {
          if (lot.kind === 'property' && lot.refId && !s.props.includes(lot.refId)) s.props.push(lot.refId)
          if (lot.kind === 'collectible' && lot.refId && !(s.collectibles || []).includes(lot.refId)) s.collectibles = [...(s.collectibles || []), lot.refId]
          news.push({ day: s.day, text: ` Tumhari lot par koi boli nahi aayi — cheez wapas tumhare paas.` })
        }
        auc.hist = [{ day: s.day, name: lot.name, winner: lot.leader || '— (wapas)', amt: lot.current, playerWon: false }, ...(auc.hist || [])].slice(0, 15)
        auc.lots = auc.lots.filter((x) => x.uid !== lot.uid)
        continue
      }
      // Lot band — nateeja
      if (lot.leaderIsPlayer) {
        s.cash -= lot.current
        settleWonLot(s, lot)
        news.push({ day: s.day, text: ` Nilami jeeti tumne: ${lot.name} — boli par tumhara naam!` })
      } else if (lot.leader) {
        news.push({ day: s.day, text: ` Nilami: ${lot.name} ${lot.leader} le gaya.` })
      } else {
        news.push({ day: s.day, text: ` Nilami bina boli ke band: ${lot.name}` })
      }
      auc.hist = [{ day: s.day, name: lot.name, winner: lot.leader || '—', amt: lot.current, playerWon: !!lot.leaderIsPlayer }, ...(auc.hist || [])].slice(0, 15)
      auc.lots = auc.lots.filter((x) => x.uid !== lot.uid)
    }
  }
  while (auc.lots.length < 3) auc.lots.push(genLot(s.day, Math.round(rnd(4, 12))))
  return news
}
export function playerBid(s, lot, amt) {
  if (amt <= lot.current) return { ok: false, msg: 'Boli maujooda boli se zyada honi chahiye' }
  if (s.cash < amt) return { ok: false, msg: 'Cash kam hai itni boli ke liye' }
  // Purani khud ki boli par sirf farak rokna hai — saral: jeetne par hi kul rakam kategi, abhi sirf naam lagta hai
  lot.current = amt; lot.leader = 'TUM'; lot.leaderIsPlayer = true
  lot.hist = [...lot.hist.slice(-6), { bidder: 'TUM ', amt }]
  return { ok: true, msg: 'Boli lag gayi — tum aage ho!' }
}
// Jeetne par sampatti dena — endDay/phase settlement App/engine se: yaha sirf sampatti jodne ka kaam
export function settleWonLot(s, lot) {
  if (lot.kind === 'property' && lot.refId && !s.props.includes(lot.refId)) s.props.push(lot.refId)
  else if (lot.kind === 'business' && lot.refId && !s.biz[lot.refId + '@india_delhi']) {
    const d = BUSINESSES.find((b) => b.id === lot.refId)
    s.biz[lot.refId + '@india_delhi'] = { lv: 2, price: 1, stock: 80, staff: d.staff, profitToday: 0, profitTotal: 0, rating: 3.8, mktDays: 0, loc: 'india_delhi', employees: [] }
  } else if ((lot.kind === 'collectible' || lot.kind === 'rare') && lot.refId) {
    if (!s.collectibles.includes(lot.refId)) s.collectibles.push(lot.refId)
  } else if (lot.kind === 'surplus') {
    const resale = Math.round((lot.value || lot.current) * rnd(0.8, 1.5))
    s.cash += resale
    s.news = [{ day: s.day, text: ` Surplus lot becha — andaz se zyada mila: kul wapasi ka hissa cash me aaya.` }, ...s.news].slice(0, 12)
  }
}

function fmtLocal(n) {
  n = Math.round(n || 0)
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr'
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L'
  if (n >= 1e3) return '₹' + (n / 1e3).toFixed(1) + ' K'
  return '₹' + n
}
