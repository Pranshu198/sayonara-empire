// ============ WEALTH ENGINE — endless assets, collectibles, startups, movies, capsules ============
// Har sampatti ki keemat state me rehti hai (prices map), roz engine use badalta hai — net worth me sab judta hai.
import { investById } from './content/invest/index.js'
import { collectibleById } from './content/collectibles/index.js'
import { startupById } from './content/startups/index.js'
import { movieById } from './content/movies/index.js'
import { lifestyleById } from './content/lifestyle/index.js'
import { rnd, chance } from '../utils/random.js'

export function investPrice(s, item) {
  const p = s.investPrices && s.investPrices[item.id]
  return Math.round(p != null ? p : item.price)
}
export function investValue(s) {
  let v = 0
  for (const [id, qty] of Object.entries(s.invest || {})) {
    const item = investById(id); if (!item) continue
    v += investPrice(s, item) * qty
  }
  return Math.round(v)
}
export function collectiblePrice(s, c) {
  const p = s.collectPrices && s.collectPrices[c.id]
  return Math.round(p != null ? p : c.price)
}
export function collectiblesValue(s) {
  let v = 0
  for (const id of s.collectibles || []) {
    const c = collectibleById(id); if (!c) continue
    v += collectiblePrice(s, c)
  }
  return Math.round(v)
}
export function startupsValue(s) {
  return Object.values(s.startups || {}).reduce((a, x) => a + (x.amt || 0), 0)
}
export function moviesValue(s) {
  return Object.values(s.movies || {}).reduce((a, x) => a + (x.amt || 0), 0)
}
export function capsulesValue(s) {
  return (s.capsules || []).reduce((a, c) => a + c.amt, 0)
}
export function wealthValue(s) {
  return investValue(s) + collectiblesValue(s) + startupsValue(s) + moviesValue(s) + capsulesValue(s)
}
// Roz ki aamdani: invest classes ka income% (kiraya jaisa) saal bhar me banta hai — roz ka hissa
export function wealthDailyIncome(s) {
  let inc = 0
  for (const [id, qty] of Object.entries(s.invest || {})) {
    const item = investById(id); if (!item) continue
    inc += investPrice(s, item) * qty * (item.income || 0) / 365
  }
  return Math.round(inc)
}
// Din ke ant me keematein aur portfolio ki halchal — endDay se bulta hai, khabrein lautata hai
export function wealthDayTick(s) {
  const news = []
  s.investPrices = s.investPrices || {}
  s.collectPrices = s.collectPrices || {}
  for (const [id] of Object.entries(s.invest || {})) {
    const item = investById(id); if (!item) continue
    const cur = s.investPrices[id] != null ? s.investPrices[id] : item.price
    const ch = item.growth / 365 + rnd(-item.vol, item.vol) * 0.12
    s.investPrices[id] = Math.max(100, Math.round(cur * (1 + ch)))
  }
  for (const id of s.collectibles || []) {
    const c = collectibleById(id); if (!c) continue
    const cur = s.collectPrices[id] != null ? s.collectPrices[id] : c.price
    s.collectPrices[id] = Math.max(500, Math.round(cur * (1 + rnd(-c.vol, c.vol) * 0.2 + 0.0004)))
  }
  // collectibles jo bazaar me rakhe hain (roz ke picks ke daam bhi ghumte hain taaki kharid-bech me farak dikhe)
  for (const id of s.collectWatch || []) {
    const c = collectibleById(id); if (!c) continue
    const cur = s.collectPrices[id] != null ? s.collectPrices[id] : c.price
    s.collectPrices[id] = Math.max(500, Math.round(cur * (1 + rnd(-c.vol, c.vol) * 0.25)))
  }
  // Startups: har mahine ke aas-paas kisi ek ka faisla (exit ya fail)
  for (const [id, pos] of Object.entries(s.startups || {})) {
    const st = startupById(id); if (!st) continue
    if (s.day - pos.since > 20 && chance(0.05)) {
      if (chance(1 - st.failChance)) {
        const gain = Math.round(pos.amt * st.upside)
        s.cash += gain
        news.push({ day: s.day, text: `🚀 STARTUP EXIT! ${st.name} bik gaya — tumhare ${fmtLocal(pos.amt)} ke badle ${fmtLocal(gain)} mile!` })
        s.story = [`Day ${s.day}: ${st.name} se bada exit (${fmtLocal(gain)})`, ...s.story].slice(0, 30)
        delete s.startups[id]
      } else {
        news.push({ day: s.day, text: `💀 Startup dooba: ${st.name} band ho gaya. Angel investing ka khatra yahi hai.` })
        s.story = [`Day ${s.day}: ${st.name} dooba — sabak mila`, ...s.story].slice(0, 30)
        delete s.startups[id]
      }
    }
  }
  // Movies: release day par hit/flop
  for (const [id, pos] of Object.entries(s.movies || {})) {
    const mv = movieById(id); if (!mv) continue
    if (s.day >= pos.releaseDay) {
      if (chance(mv.hitChance)) {
        const gain = Math.round(pos.amt * mv.mult)
        s.cash += gain
        news.push({ day: s.day, text: `🎬 BLOCKBUSTER! '${mv.title}' hit — producer ko ${fmtLocal(gain)} mile!` })
        s.story = [`Day ${s.day}: Film '${mv.title}' HIT — ${fmtLocal(gain)}`, ...s.story].slice(0, 30)
      } else {
        news.push({ day: s.day, text: `🎬 Flop: '${mv.title}' doobi. Cinema ka khel aisa hi hai.` })
        s.story = [`Day ${s.day}: Film '${mv.title}' flop — paisa gaya`, ...s.story].slice(0, 30)
      }
      delete s.movies[id]
    }
  }
  // Time capsules pakne par bonus ke saath khulte hain
  const matured = (s.capsules || []).filter((c) => s.day >= c.unlockDay)
  for (const c of matured) {
    const total = Math.round(c.amt * (1 + c.bonus))
    s.cash += total
    news.push({ day: s.day, text: `⏳ Time Capsule khula! Band rakha paisa bonus ke saath ${fmtLocal(total)} mila. Sabr ka phal.` })
  }
  if (matured.length) s.capsules = s.capsules.filter((c) => s.day < c.unlockDay)
  // Treasure talaash ka nateeja
  const doneT = (s.treasuresActive || []).filter((t) => s.day >= t.doneDay)
  for (const t of doneT) {
    if (chance(t.findChance)) {
      const prize = Math.round(t.cost * t.prizeMult)
      s.cash += prize
      news.push({ day: s.day, text: `🏆 KHAZANA MILA! ${t.place} par talaash safal — ${fmtLocal(prize)} ka khazana haath laga!` })
      s.story = [`Day ${s.day}: Khazana mila ${t.place} par (${fmtLocal(prize)})`, ...s.story].slice(0, 30)
    } else {
      news.push({ day: s.day, text: `⛏️ Talaash khaali gayi: ${t.place} par kuch nahi mila — par kahani akhbaar me chhapi.` })
      s.rep = Math.min(100, (s.rep || 50) + 1)
    }
  }
  if (doneT.length) s.treasuresActive = s.treasuresActive.filter((t) => s.day < t.doneDay)
  // Predictions ka faisla (7 din baad, bazaar ki disha se)
  const dueP = (s.predictions || []).filter((p) => s.day >= p.dueDay)
  for (const p of dueP) {
    const up = (s.sentiment || 0) >= 0
    const win = (p.kind === 'stock up' && up) || (p.kind === 'stock down' && !up) || (p.kind === 'festival demand' && s.eventEff === 'boom') || (p.kind === 'supplier' && s.supplier >= (p.baseSupplier || 1)) || (p.kind === 'rain' && s.eventEff === 'rain') || (p.kind === 'rival' && chance(0.5))
    if (win) {
      const gain = Math.round(p.amt * p.payout)
      s.cash += gain
      news.push({ day: s.day, text: `🔮 Andaza sahi nikla! Prediction par ${fmtLocal(gain)} mile.` })
    } else {
      news.push({ day: s.day, text: `🔮 Andaza galat — prediction ki rakam gayi. Economy padhna seekho.` })
    }
  }
  if (dueP.length) s.predictions = s.predictions.filter((p) => s.day < p.dueDay)
  return news
}
function fmtLocal(n) {
  n = Math.round(n || 0); const neg = n < 0; n = Math.abs(n)
  let s
  if (n >= 1e7) s = '₹' + (n / 1e7).toFixed(2) + ' Cr'
  else if (n >= 1e5) s = '₹' + (n / 1e5).toFixed(2) + ' L'
  else if (n >= 1e3) s = '₹' + (n / 1e3).toFixed(1) + ' K'
  else s = '₹' + n
  return neg ? '-' + s : s
}
// Lifestyle se khushi, charity + lifestyle + projects se saakh (reputation)
export function happinessOf(s) {
  let h = 10
  for (const id of s.lifestyle || []) { const it = lifestyleById(id); if (it) h += it.happy }
  return Math.min(100, h)
}
export function legacyScore(s, nw) {
  const charityPart = Math.floor((s.charity || 0) / 100000)
  const lifePart = (s.lifestyle || []).length * 3
  const cityPart = (s.cityProjects || []).length * 5
  const wealthPart = Math.floor(Math.log10(Math.max(10, nw)) * 10)
  const dayPart = Math.floor((s.day || 1) / 10)
  return wealthPart + charityPart + lifePart + cityPart + dayPart + (s.prestige || 0) * 25
}
export function legacyTitle(score) {
  if (score >= 220) return '👑 Legend'
  if (score >= 170) return '🏰 Sheher ka Seth'
  if (score >= 120) return '🌟 Bada Naam'
  if (score >= 80) return '💼 Ubharta Seth'
  if (score >= 45) return '🏪 Pakka Vyapari'
  return '🌱 Shuruaat Wala'
}
