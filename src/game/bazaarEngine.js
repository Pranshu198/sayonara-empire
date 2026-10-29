// ============ BUSINESS BAZAAR — bana-banaya business kharid/bech ============
// Har listing ke asal number hain: pichle 30 din ka munafa (simulated history), valuation = munafa × multiple + sampatti hissa
import { BUSINESSES, DISTRICTS } from './data.js'
import { bizDef } from './businesses/index.js'
import { rnd, pick, chance } from '../utils/random.js'

const OWNERS = ['Rtd. Sharma Uncle', 'Mrs. Kapoor', 'Javed Bhai', 'Pinki Madam', 'Col. Rathore (Retd.)', 'Sunil Agarwal', 'Ek NRI Seller', 'Fatima Bi', 'Pandit Ji ke Bete', 'Mrs. D Souza', 'Harpreet Singh', 'Ek Purana Seth']
const REASONS = [
  { t: 'Malik retire ho raha hai — araam ki zindagi chahiye', desperation: 0.85 },
  { t: 'Ghata chal raha hai — turnaround wala khiladi chahiye', desperation: 0.6 },
  { t: 'Videsh shift ho raha hai — jaldi bechna hai', desperation: 0.7 },
  { t: 'Doosra bada business khada karna hai — paisa yaha se nikalna hai', desperation: 0.95 },
  { t: 'Parivaar me bantwara — hissa bechna pad raha hai', desperation: 0.75 },
  { t: 'Sehat kaaran — bojh kam karna hai', desperation: 0.8 },
  { t: 'Munafa pakka hai — sahi keemat mile to hi bechenge', desperation: 1.1 },
  { t: 'Rival ne area me entry li — malik himmat haar raha hai', desperation: 0.65 },
]
export function simulateProfit30(d, lv, price, rating) {
  // 30 din ka munafa itihaas — wahi P&L soch jo asal engine use karta hai (saral roop)
  const out = []
  const lvMult = 1 + 0.18 * (lv - 1)
  const elasticity = Math.max(0.35, 1 - (price - 1) * 1.15)
  for (let i = 0; i < 30; i++) {
    const rev = d.rev * lvMult * price * elasticity * (0.8 + (rating - 3) * 0.12) * rnd(0.85, 1.15)
    const costs = rev * d.cogs + (d.staff * d.wage + d.rent + d.util + d.cost * 0.0003) + rev * 0.02
    out.push(Math.round(rev - costs))
  }
  return out
}
export function valuationOf(listing) {
  const avgDaily = listing.profit30.reduce((a, b) => a + b, 0) / 30
  const d = bizDef(listing.bizId)
  const assetPart = d.cost * (0.5 + 0.2 * listing.lv)
  const profitPart = Math.max(0, avgDaily) * 240 // ~8 mahine ke munafe ka multiple (vyaparik andaz)
  return Math.round(assetPart + profitPart)
}
export function genListing(day) {
  const d = pick(BUSINESSES)
  const lv = Math.max(1, Math.min(10, Math.round(rnd(1, 7))))
  const rating = Math.round(rnd(3.2, 4.9) * 10) / 10
  const price = Math.round(rnd(0.9, 1.3) * 20) / 20
  const staff = Math.max(1, d.staff + Math.round(rnd(-1, 2)))
  const reason = pick(REASONS)
  const listing = {
    uid: 'bz_' + day + '_' + Math.floor(Math.random() * 1e6),
    bizId: d.id, owner: pick(OWNERS), reason: reason.t, desperation: reason.desperation,
    ageDays: Math.round(rnd(90, 1400)), lv, rating, priceMul: price, staff,
    district: pick(DISTRICTS).name, stock: Math.round(rnd(30, 100)),
    profit30: [], ask: 0, daysLeft: Math.round(rnd(4, 9)), bornDay: day,
  }
  listing.profit30 = simulateProfit30(d, lv, price, rating)
  const val = valuationOf(listing)
  listing.valuation = val
  listing.ask = Math.round(val * reason.desperation * rnd(0.95, 1.1))
  return listing
}
export function ensureBazaar(s) {
  s.bazaar = s.bazaar || []
  while (s.bazaar.length < 6) s.bazaar.push(genListing(s.day))
  return s.bazaar
}
// Din ke ant me: kuch listing bik jaati hain (rivals bhi kharidte hain), naye aate hain; tumhari listings par boliyan aati hain
export function bazaarDayTick(s) {
  const news = []
  s.bazaar = s.bazaar || []
  for (const l of [...s.bazaar]) {
    l.daysLeft -= 1
    if (l.daysLeft <= 0 || chance(0.10)) {
      const buyer = pick(s.rivals)
      news.push({ day: s.day, text: ` Business Bazaar: ${buyer.name} ne ${bizDef(l.bizId).name} (${l.district}) kharid liya — tumse pehle!` })
      s.bazaar = s.bazaar.filter((x) => x.uid !== l.uid)
    }
  }
  while (s.bazaar.length < 6) s.bazaar.push(genListing(s.day))
  // Tumhari apni listings par NPC boliyan
  s.myListings = s.myListings || []
  for (const ml of s.myListings) {
    ml.offers = ml.offers || []
    if (chance(0.55)) {
      const bidder = chance(0.4) ? pick(s.rivals).name : pick(OWNERS)
      const base = ml.ask
      const amt = Math.round(base * rnd(0.55, 1.05))
      if (!ml.offers.some((o) => o.bidder === bidder)) ml.offers.push({ bidder, amt, day: s.day })
      if (amt >= base * 0.9) news.push({ day: s.day, text: ` Tumhari listing (${bizDef(ml.bizId).name}) par badi boli: ${bidder} — akhbaar me charcha!` })
    }
  }
  return news
}
// Mol-bhaav: seller ka jawab — desperation aur offer ke hisaab se
export function negotiate(listing, offerAmt) {
  const ratio = offerAmt / listing.ask
  if (ratio >= 0.97) return { result: 'accept', msg: 'Seller: "Theek hai, sauda pakka! Tum jeete." ' }
  if (ratio >= listing.desperation - 0.12) {
    if (chance(0.6)) return { result: 'accept', msg: 'Seller: "Bahut socha... chalo, tumhara hua." ' }
    const counter = Math.round(listing.ask * rnd(0.93, 0.97))
    return { result: 'counter', counter, msg: `Seller: "Thoda aur badhao — ${counter} par baat banegi."` }
  }
  if (ratio >= 0.55) {
    const counter = Math.round(listing.ask * rnd(0.9, 0.98))
    return { result: 'counter', counter, msg: `Seller: "Itne kam me nahi hoga. ${counter} soch lo."` }
  }
  return { result: 'reject', msg: 'Seller: "Ye to mazak hai. Ciddi mat karo." ' }
}
