// CASHFLOW / TREASURY ENGINE — mahina-anta hisaab: tax, dividend, SIP, EMI, manager tankhwah
// GUARD: mahina-anta sirf ek baar, aur tax SIRF usi mahine ke jama munafe par (Day-30 freeze fix yahi rehta hai)
import { taxRateOf } from '../settings.js'
import { dividendCalc } from './market.js'
import { creditAfterEmi } from './credit.js'
export function monthEnd(s, fmt) {
  if (s.day % 30 !== 0 || s.lastTaxDay === s.day) return
  s.lastTaxDay = s.day
  // Tax provisioning: Finance Manager ho to pehle se alag rakha hua samjho — bhugtan wahi, khabar saaf
  if (s.monthProfit > 0) {
    const tax = s.monthProfit * taxRateOf(s.settings)
    s.cash -= tax
    if (s.life) s.life.tax = (s.life.tax || 0) + tax
    s.news = [{ day: s.day, text: `🧾 Month-end: Is mahine ke profit par tax ${fmt(tax)} kata. (Sirf is mahine ka profit ginna gaya${s.managers && s.managers.finance ? ', Finance Manager ne provisioning kar rakhi thi' : ''})` }, ...s.news].slice(0, 12)
  }
  const div = dividendCalc(s)
  if (div > 0) { s.cash += div; s.news = [{ day: s.day, text: `💰 Dividend mila: ${fmt(div)}` }, ...s.news].slice(0, 12) }
  if (s.sipMonthly > 0 && s.cash >= s.sipMonthly) { s.cash -= s.sipMonthly; s.sip += s.sipMonthly }
  if (s.loan.amount > 0) {
    s.cash -= s.loan.emi
    s.loan.amount = Math.max(0, s.loan.amount - (s.loan.emi - s.loan.amount * 0.01))
    s.loan.months -= 1
    if (s.loan.months <= 0 || s.loan.amount <= 0) { s.loan = { amount: 0, emi: 0, months: 0 }; s.credit = creditAfterEmi(s.credit, true) }
  }
  // Manager tankhwah (mahine ki) — na de pao to manager jaata hai, khabar imandaari se
  const mgrs = Object.values(s.managers || {})
  if (mgrs.length) {
    const totalSal = mgrs.reduce((a, m) => a + (m.salary || 0), 0)
    if (totalSal > 0) {
      if (s.cash + s.bank >= totalSal) {
        const fromCash = Math.min(s.cash, totalSal); s.cash -= fromCash; s.bank -= (totalSal - fromCash)
        s.news = [{ day: s.day, text: `👔 Manager tankhwah: ${fmt(totalSal)} diya gaya (${mgrs.length} managers)` }, ...s.news].slice(0, 12)
      } else {
        const leaving = mgrs[0]
        delete s.managers[leaving.role]
        s.news = [{ day: s.day, text: `⚠️ Tankhwah na milne se ${leaving.name} (${leaving.roleName}) chala gaya!` }, ...s.news].slice(0, 12)
      }
    }
  }
  s.monthProfit = 0
}
