// ============ DEEP STAFF SYSTEM — CV wale candidates, role-wise bharti, har branch ke liye ============
// Candidate pool staff content library (4200 profiles) se banta hai; har candidate ka CV:
// naam, tajurba (saal), skill %, efficiency %, maangi tankhwah (mahina), trait, purana malik.
// HR Manager ho to pool behtar (skill upar) aur shortlist value-ke-hisaab se sorted milti hai.
// Staff library (4,200 CV profiles) LAZY load hoti hai — entry bundle halka; pehli zaroorat par chunk.
let ALL_STAFF = []
export function ensureStaffLib() { return import('./content/staff/index.js').then((m) => { ALL_STAFF = m.ALL_STAFF || []; return ALL_STAFF }).catch(() => []) }
ensureStaffLib()

export const ROLE_DEFS = [
  { role: 'counter', name: 'Counter / Sales', desc: 'Grahak sambhalna, billing — bikri ki raftaar' },
  { role: 'maker', name: 'Maker / Cook / Technician', desc: 'Asli kaam ki quality — product ka star' },
  { role: 'delivery', name: 'Delivery / Runner', desc: 'Order pahunchana, bahar ke kaam' },
  { role: 'cleaner', name: 'Safai / Helper', desc: 'Safai aur madad — rating ki neev' },
  { role: 'supervisor', name: 'Supervisor', desc: 'Team ki nigaah — sab ki efficiency upar' },
  { role: 'accountant', name: 'Accountant', desc: 'Hisaab-kitab — wastage aur galti kam' },
  { role: 'guard', name: 'Guard / Security', desc: 'Chori aur nuksan se suraksha' },
  { role: 'social', name: 'Social Media', desc: 'Online prachar — demand ki lehar' },
  { role: 'stockofficer', name: 'Stock Officer (Auto-Buy)', desc: 'Niyamo par khud stock kharidega — Procurement se' },
]
export const roleName = (r) => (ROLE_DEFS.find((x) => x.role === r) || {}).name || r
// Har category ke liye upyukt roles (sab me kuch aam roles bhi)
const CAT_ROLES = {
  Food: ['counter', 'maker', 'delivery', 'cleaner', 'supervisor', 'stockofficer'],
  Retail: ['counter', 'maker', 'delivery', 'cleaner', 'supervisor', 'accountant', 'stockofficer'],
  Service: ['counter', 'maker', 'cleaner', 'supervisor', 'social', 'stockofficer'],
  Edu: ['counter', 'maker', 'cleaner', 'supervisor', 'accountant', 'social'],
  Health: ['counter', 'maker', 'cleaner', 'supervisor', 'accountant', 'guard'],
  Tech: ['counter', 'maker', 'supervisor', 'accountant', 'social', 'stockofficer'],
  Industry: ['maker', 'delivery', 'cleaner', 'supervisor', 'accountant', 'guard', 'stockofficer'],
  Energy: ['maker', 'delivery', 'supervisor', 'accountant', 'guard', 'stockofficer'],
}
export function rolesForCat(cat) { return CAT_ROLES[cat] || ROLE_DEFS.map((r) => r.role) }
// Branch me kitne named employees reh sakte hain — level/size ke saath badhta hai, chhoti cap nahi
export function staffCapacityFor(o, d) { return 6 + (o.lv || 1) * 4 + (d ? d.staff * 2 : 4) }

const PAST = ['Kirana King Stores', 'City Mall Retail', 'Sharma Enterprises', 'FreshMart Chain', 'Hotel Rajwada', 'TechHub Services', 'Apna Bazaar', 'Metro Foods', 'Star Services Group', 'Delhi Haat Traders', 'QuickServe India', 'Prime Retail Ltd']
function hash(str) { let h = 7; for (const ch of (str || '')) h = (h * 31 + ch.charCodeAt(0)) % 1000003; return h }
// Ek profile se pura CV banao (deterministic) — HR ho to skill/eff thoda upar (behtar pool)
export function cvOf(profile, hrBoost = 0) {
  const h = hash(profile.id)
  const skillPct = Math.min(99, Math.round((profile.skill || 5) * 10 + (h % 9) - 4 + hrBoost))
  const effPct = Math.min(99, Math.max(25, Math.round(skillPct * (0.82 + (h % 30) / 100))))
  const expYears = 1 + (h % 14)
  return {
    pid: profile.id, name: profile.name, roleProfile: profile.role, trait: profile.trait, story: profile.story,
    skillPct, effPct, expYears, salary: profile.wage || 12000, past: PAST[h % PAST.length],
    value: (skillPct + effPct) / Math.max(1, (profile.wage || 12000) / 1000),
  }
}
// Kisi branch+role ke liye candidates (din ke hisaab se ghumte hain); HR shortlist = value sort
export function candidatesForBranch(s, branchKey, cat, role, count = 4) {
  const hr = (s.managers || {}).hr
  const hrBoost = hr && hr.on ? Math.round((hr.skill || 5) * 1.2) : 0
  const pool = ALL_STAFF.filter((p) => p.cat === cat)
  if (!pool.length) return []
  const seed = hash(branchKey + role + 'd' + s.day)
  const hiredPids = new Set(Object.values(s.biz || {}).flatMap((o) => (o.employees || []).map((e) => e.pid)))
  const out = []; const seen = new Set()
  let i = 0
  while (out.length < count && i < 60) {
    const p = pool[(seed + i * 13) % pool.length]; i++
    if (!p || seen.has(p.id) || hiredPids.has(p.id)) continue
    seen.add(p.id); out.push({ ...cvOf(p, hrBoost), role })
  }
  if (hr && hr.on) out.sort((a, b) => b.value - a.value) // HR shortlist: CV% per salary sabse achha pehle
  return out
}
export function newEmployee(cv, role) {
  return { eid: cv.pid + '_' + Date.now().toString(36), pid: cv.pid, name: cv.name, role, skillPct: cv.skillPct, effPct: cv.effPct, expYears: cv.expYears, salary: cv.salary, trait: cv.trait, past: cv.past, morale: 70, hiredDay: 0 }
}
