// Managers — bharti ke liye ummeedwar aur rule templates (Automation/AI-Manager engine inhi se chalta hai)
import { MANAGERS_1 } from './profiles1.js'
import { MANAGERS_2 } from './profiles2.js'
import { RULE_TEMPLATES } from './rules.js'
export const ALL_MANAGERS = [MANAGERS_1, MANAGERS_2].flat()
export { RULE_TEMPLATES }
export const MANAGER_ROLES = [
  { role: 'purchase', name: 'Purchase Manager (Auto-Stock)', icon: '', desc: 'Auto-Stock Officer: niyamo par restock, seller chunav, chahe to import bhi — stock khali nahi hone dega' },
  { role: 'inventory', name: 'Inventory Manager', icon: '', desc: 'Stock khatm hone par emergency aur wastage ki nigaah' },
  { role: 'pricing', name: 'Sales/Pricing Manager', icon: '', desc: 'Rating aur stock dekh kar daam ki chaal' },
  { role: 'marketing', name: 'Marketing Manager', icon: '', desc: 'Festival aur mauke par campaign khud chalata hai' },
  { role: 'finance', name: 'Finance Manager', icon: '', desc: 'Cash buffer, FD, EMI aur tax ki taiyari' },
  { role: 'hr', name: 'HR Manager', icon: '', desc: 'Staff bharti aur team santulan' },
  { role: 'trading', name: 'Trading Manager', icon: '', desc: 'Munafe par shares bechna, nuksan par rok' },
  { role: 'expansion', name: 'Expansion Manager', icon: '', desc: 'Naye sheher ke mauko ki khabar (khareed tum hi karoge)' },
]
export function candidatesFor(role, seedDay) {
  const pool = ALL_MANAGERS.filter((m) => m.role === role)
  const out = []; const seen = new Set()
  let i = 0
  while (out.length < 3 && i < 50) { const c = pool[(seedDay * 3 + i * 7) % pool.length]; if (!seen.has(c.id)) { seen.add(c.id); out.push(c) } i++ }
  return out
}
export function managerById(id) { return ALL_MANAGERS.find((m) => m.id === id) }
export const DEFAULT_RULES = {
  purchase: { threshold: 25, pref: 'cheapest', maxUnitPrice: 0, allowImport: false },
  inventory: { emergency: true },
  pricing: { marginPct: 20 },
  marketing: { budgetPct: 10 },
  finance: { bufferAmt: 20000, fdAbove: 100000 },
  hr: { minStaffPct: 100, autoHireCap: 0 },
  trading: { profitPct: 15, sellFrac: 50 },
  expansion: { watchOnly: true },
}
