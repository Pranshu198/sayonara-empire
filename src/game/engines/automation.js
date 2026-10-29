// AUTOMATION / AI-MANAGER ENGINE — khiladi ke niyamo par manager khud kaam karte hain
// Har action Manager Activity Report (s.managerLog) me likha jaata hai — khiladi audit kar sakta hai
// Skill zyada = galti kam; kam skill wala manager kabhi mehenga/galat order bhi kar deta hai (khabar sahi aati hai)
import { defaultItemFor } from '../procurement/index.js'
import { chooseSeller, orderCost } from './supply.js'
const totalPhases = (s) => (s.day - 1) * 4 + s.phase
function log(s, role, text, delta = 0) {
  s.managerLog = [{ day: s.day, role, text, delta }, ...(s.managerLog || [])].slice(0, 60)
  const st = (s.managerStats = s.managerStats || {})[role] = s.managerStats[role] || { actions: 0, good: 0, bad: 0, net: 0 }
  st.actions += 1; st.net += delta
}
function mistake(s, mgr) { return Math.random() < (mgr.mistakeRate || 0.1) * (1.15 - (mgr.skill || 5) / 10) }
function markBad(s, role) { const st = (s.managerStats || {})[role]; if (st) st.bad += 1 }
function markGood(s, role) { const st = (s.managerStats || {})[role]; if (st) st.good += 1 }

// ---- Phase par chalne wale kaam: purchase / inventory / pricing / marketing ----
export function runManagerPhase(s, bizDef, fmt) {
  const M = s.managers || {}
  for (const [id, o] of Object.entries(s.biz)) {
    const d = bizDef(id); if (!d) continue
    // PURCHASE: stock threshold se neeche -> seller se order, delivery samay ke baad aayegi
    const pm = M.purchase
    if (pm && pm.on && o.stock < (pm.rules?.threshold ?? 25) && !(s.pendingDeliveries || []).some((x) => x.bizId === id)) {
      const item = defaultItemFor(id, d.cat)
      const seller = item ? chooseSeller(item, pm.rules?.pref || 'cheapest') : null
      const miss = Math.min(100, 100 - o.stock + 10)
      let cost = orderCost(d, miss, seller, item ? item.basePrice : 0)
      let qtyNote = ''
      if (mistake(s, pm)) { cost = Math.round(cost * 1.5); qtyNote = ' ⚠️ (galti: zyada mehenga order ho gaya)'; markBad(s, 'purchase') } else markGood(s, 'purchase')
      if (s.cash >= cost) {
        const payNow = !seller || seller.terms !== 'credit15'
        if (payNow) s.cash -= cost
        s.pendingDeliveries = [...(s.pendingDeliveries || []), { bizId: id, qty: miss, arriveTP: totalPhases(s) + (seller ? seller.deliveryDays : 0) * 4 + 1, kind: 'proc', item: item ? item.item : 'maal', seller: seller ? seller.seller : 'local', cost, payOnDelivery: !payNow, rel: seller ? seller.reliability : 90 }]
        if (!s.contracts) s.contracts = {}
        if (item && seller) s.contracts[id] = { itemId: item.id, item: item.item, sellerName: seller.seller, quality: seller.quality, unitPrice: seller.unitPrice, basePrice: item.basePrice, complaintRisk: seller.complaintRisk, reliability: seller.reliability, deliveryDays: seller.deliveryDays, terms: seller.terms }
        log(s, 'purchase', `${d.name}: stock ${Math.round(o.stock)}% par ${item ? item.item : 'maal'} order (${seller ? seller.seller : 'local'}, ${seller ? seller.quality : ''}) — ${fmt(cost)}${payNow ? '' : ', payment delivery par (credit)'}${qtyNote}`, payNow ? -cost : 0)
      }
    }
    // INVENTORY: stock bilkul khatm -> emergency kharid (mehengi, turant)
    const im = M.inventory
    if (im && im.on && o.stock <= 0) {
      const cost = Math.round(d.rev * d.cogs * 0.5) + 50
      if (s.cash >= cost) { s.cash -= cost; o.stock = 45; log(s, 'inventory', `${d.name}: stock KHATAM tha — emergency kharid ${fmt(cost)} me, stock 45% bhara`, -cost); markGood(s, 'inventory') }
    }
    // PRICING: din me ek baar — rating/stock dekh kar daam ki chaal
    const pr = M.pricing
    if (pr && pr.on && s.phase === 0 && s.mgrState?.priceDay !== s.day) {
      if (o.rating < 3.7 && o.price > 0.85) { o.price = +(o.price - 0.05).toFixed(2); log(s, 'pricing', `${d.name}: rating ${o.rating.toFixed(1)} kam — daam ghata kar ${o.price}x kiya`) ; markGood(s, 'pricing') }
      else if (o.rating > 4.4 && o.stock > 60 && o.price < 1.45) { o.price = +(o.price + 0.05).toFixed(2); log(s, 'pricing', `${d.name}: rating ${o.rating.toFixed(1)} zabardast — daam badha kar ${o.price}x kiya`); markGood(s, 'pricing') }
    }
    // MARKETING: tyohar paas ya stock bhara ho -> campaign
    const mm = M.marketing
    if (mm && mm.on && s.phase === 0 && o.mktDays <= 0 && o.stock > 50) {
      const cost = Math.round(d.rev * 1.2)
      if (s.cash > cost * 3) { s.cash -= cost; o.mktDays = 3; log(s, 'marketing', `${d.name}: campaign chalaya ${fmt(cost)} — 3 din demand +30%`, -cost); markGood(s, 'marketing') }
    }
  }
  if (s.phase === 0) { s.mgrState = { ...(s.mgrState || {}), priceDay: s.day } }
}
// ---- Din ke ant ke kaam: finance / trading / hr / expansion ----
export function runManagerDay(s, bizDef, fmt, netWorthFn) {
  const M = s.managers || {}
  const fm = M.finance
  if (fm && fm.on) {
    const buffer = fm.rules?.bufferAmt ?? 20000; const fdAbove = fm.rules?.fdAbove ?? 100000
    if (s.loan.amount > 0 && s.day % 30 >= 25 && s.cash < s.loan.emi && s.bank > 0) { const mv = Math.min(s.bank, s.loan.emi - s.cash); s.bank -= mv; s.cash += mv; log(s, 'finance', `EMI nazdeek hai — bank se ${fmt(mv)} cash me rakha, credit score surakshit`); markGood(s, 'finance') }
    if (s.cash > buffer + fdAbove) { const amt = Math.floor((s.cash - buffer) / 10000) * 10000; if (amt >= 10000) { s.cash -= amt; s.fds.push({ amt, days: 90 }); log(s, 'finance', `Fazil cash ${fmt(amt)} ki FD bana di (7%) — buffer ${fmt(buffer)} bana raha`, -amt); markGood(s, 'finance') } }
  }
  const tm = M.trading
  if (tm && tm.on && s.holdAvg) {
    const pct = (tm.rules?.profitPct ?? 15) / 100; const frac = (tm.rules?.sellFrac ?? 50) / 100
    for (const [sym, q] of Object.entries(s.holdings)) {
      const avg = s.holdAvg[sym]; const st = s.stocks.find((x) => x.sym === sym)
      if (!avg || !st || q <= 0) continue
      if (st.price >= avg * (1 + pct)) { const sellQ = Math.max(1, Math.floor(q * frac)); const gain = Math.round(sellQ * st.price); s.holdings[sym] -= sellQ; s.cash += gain; log(s, 'trading', `${sym}: +${Math.round((st.price / avg - 1) * 100)}% munafe par ${sellQ} shares beche — ${fmt(gain)} aaya`, gain); markGood(s, 'trading') }
    }
  }
  const hr = M.hr
  if (hr && hr.on) {
    for (const [id, o] of Object.entries(s.biz)) { const d = bizDef(id); if (d && o.staff < d.staff && s.cash > 50000) { o.staff += 1; log(s, 'hr', `${d.name}: ek staff bharti kiya (kul ${o.staff}) — team puri`); markGood(s, 'hr') } }
  }
  const ex = M.expansion
  if (ex && ex.on && s.day % 7 === 0 && netWorthFn) {
    log(s, 'expansion', `Vistaar report: net worth ${fmt(netWorthFn(s))} — naya sheher kholne ki taiyari ka samay ${(netWorthFn(s) > 500000) ? 'aa gaya hai, Atlas dekho' : 'abhi nahi, pehle kamaai badhao'}`)
  }
}
// Deliveries (procurement + import) ka aana — har phase check
export function processDeliveries(s, fmt) {
  const tp = totalPhases(s)
  const keep = []
  for (const dl of s.pendingDeliveries || []) {
    if (dl.arriveTP <= tp) {
      const o = s.biz[dl.bizId]
      if (o) {
        const partial = dl.rel && Math.random() * 100 > dl.rel
        const got = partial ? Math.round(dl.qty * 0.7) : dl.qty
        o.stock = Math.min(100, o.stock + got)
        if (dl.payOnDelivery) s.cash -= dl.cost
        if (dl.kind === 'import') { s.importedBoost = { ...(s.importedBoost || {}), [dl.bizId]: 14 }; s.news = [{ day: s.day, text: `🚢 Import pahuncha: ${dl.item} (${dl.country}) — 'Imported' tag 14 din demand badhayega${partial ? ' (port par kuch maal atka — 70% hi aaya)' : ''}` }, ...s.news].slice(0, 12) }
        else if (partial) s.news = [{ day: s.day, text: `⚠️ Delivery aadhi aayi: ${dl.item} ka 70% hi mila (seller reliability)` }, ...s.news].slice(0, 12)
      }
    } else keep.push(dl)
  }
  s.pendingDeliveries = keep
}
