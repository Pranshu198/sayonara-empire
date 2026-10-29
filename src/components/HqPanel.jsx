import { useMemo, useState } from 'react'
import { Section } from './ui.jsx'
import { Icon } from './icons/index.jsx'
import { fmt, bizDef } from '../game/engine.js'
import { bizIdOf, branchKey, cityOfKey } from '../game/businesses/index.js'
import { cityOf, cityNameOf } from '../game/atlas/cityIndex.js'
import { ROLE_DEFS, roleName, rolesForCat, staffCapacityFor, candidatesForBranch, newEmployee } from '../game/staffSystem.js'
import { ProcurementPanel } from './ProcurementPanel.jsx'

// ============ MY EMPIRE HQ — sirf chal rahe businesses/branches, click par pura management ============
export function HqPanel({ s, upd, say }) {
  const [openKey, setOpenKey] = useState(null)
  const [hireRole, setHireRole] = useState({})
  const entries = useMemo(() => Object.entries(s.biz || {}).map(([key, o]) => ({ key, o, d: bizDef(key) })).filter((x) => x.d), [s.biz])
  const brands = useMemo(() => {
    const m = {}
    for (const e of entries) { const id = bizIdOf(e.key); (m[id] = m[id] || { d: e.d, branches: [], profit: 0 }); m[id].branches.push(e); m[id].profit += e.o.profitTotal || 0 }
    return Object.values(m)
  }, [entries])

  const act = (key, fn, msg, celebrate) => { upd((n) => { const o = n.biz[key]; if (o) fn(n, o) }); if (msg) say(msg, celebrate) }
  const openBranch = (d, cityId) => {
    const key = branchKey(d.id, cityId)
    if (s.biz[key]) return say('Is sheher me is brand ki branch pehle se hai')
    const setup = Math.round(d.cost * 0.5)
    if (s.cash < setup) return say('Branch setup ke paise kam hai: ' + fmt(setup))
    upd((n) => { n.cash -= setup; n.biz[key] = { lv: 1, price: 1, stock: 100, staff: d.staff, profitToday: 0, profitTotal: 0, rating: 4.0, mktDays: 0, loc: cityId, employees: [] }; n.xp += 25; n.story = [`Day ${n.day}: ${d.name} ki nayi franchise branch ${cityNameOf(cityId)} me khuli — setup ${fmt(setup)}`, ...n.story].slice(0, 20) })
    say(`${d.name} ki branch ${cityNameOf(cityId)} me khul gayi`, true)
  }
  const hireEmp = (key, cv, role) => {
    const sign = Math.round(cv.salary * 0.25)
    if (s.cash < sign) return say('Hiring (signing) ke paise kam hai: ' + fmt(sign))
    upd((n) => { const o = n.biz[key]; n.cash -= sign; o.employees = [...(o.employees || []), { ...newEmployee(cv, role), hiredDay: n.day }] })
    say(`${cv.name} hire ho gaya (${roleName(role)}) — tankhwah ${fmt(cv.salary)}/mahina`, true)
  }

  if (!entries.length) return (
    <Section id="hq" title="My Empire HQ" icon="hq">
      <p className="muted">Abhi koi business chal nahi raha. Business tab se pehla business kharido — phir uski saari details, staff aur management yahi HQ me milegi.</p>
    </Section>
  )

  const open = entries.find((e) => e.key === openKey)
  return (
    <>
      <Section id="hq" title="My Empire HQ" icon="hq" right={`${entries.length} branches • ${brands.length} brands`}>
        {brands.map(({ d, branches, profit }) => (
          <div key={d.id} style={{ marginBottom: 10 }}>
            <div className="row" style={{ border: 'none', paddingBottom: 2 }}><b>{d.name}</b><span className={profit >= 0 ? 'pos' : 'neg'}>{fmt(profit)} kul munafa</span></div>
            {branches.map(({ key, o }) => (
              <button key={key} className="btn ghost" style={{ width: '100%', marginTop: 6, textAlign: 'left' }} onClick={() => setOpenKey(openKey === key ? null : key)}>
                <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span><Icon name="pin" size={14} /> {cityNameOf(o.loc || cityOfKey(key))} • Lv {o.lv} • Rating {o.rating.toFixed(1)}</span>
                  <span className={o.profitTotal >= 0 ? 'pos' : 'neg'}>{fmt(o.profitTotal)}</span>
                </span>
                <span className="muted">Stock {Math.round(o.stock)}% • Staff {(o.staff || 0) + (o.employees || []).length} • Aaj {fmt(o.profitToday)}</span>
              </button>
            ))}
          </div>
        ))}
      </Section>

      {open && (() => { const { key, o, d } = open; const cap = staffCapacityFor(o, d); const emps = o.employees || []; const role = hireRole[key] || rolesForCat(d.cat)[0]; const cands = candidatesForBranch(s, key, d.cat, role, 4); const rules = o.stockRules || { target: 30, maxPrice: 0, pref: 'cheapest', allowImport: false, on: true }; const hasOfficer = emps.some((e) => e.role === 'stockofficer')
        return (
          <Section id="hqdetail" title={`${d.name} — ${cityNameOf(o.loc || cityOfKey(key))}`} icon="building" right={`Lv ${o.lv}`}>
            <div className="row"><span>Jagah (rent asar)</span><b>{cityNameOf(o.loc || cityOfKey(key))} (rent {cityOf(o.loc || cityOfKey(key)).rent}x, demand {cityOf(o.loc || cityOfKey(key)).dem}x)</b></div>
            <div className="row"><span>Kul Munafa (P&amp;L)</span><b className={o.profitTotal >= 0 ? 'pos' : 'neg'}>{fmt(o.profitTotal)}</b></div>
            <div className="row"><span>Aaj ka Munafa</span><b className={o.profitToday >= 0 ? 'pos' : 'neg'}>{fmt(o.profitToday)}</b></div>
            <div className="row"><span>Rating / Stock</span><b>{o.rating.toFixed(1)} / {Math.round(o.stock)}%</b></div>
            <div className="bar"><i style={{ width: o.stock + '%' }} /></div>
            <label className="muted">Price: {o.price.toFixed(2)}x</label>
            <input type="range" min="0.8" max="1.5" step="0.05" value={o.price} onChange={(e) => act(key, (n, oo) => { oo.price = parseFloat(e.target.value) })} />
            <div className="grid2">
              <button className="btn small ghost" onClick={() => { const miss = 100 - o.stock; const cost = Math.round(d.rev * d.cogs * miss / 100 * 0.9) + 10; if (s.cash < cost) return say('Restock ke paise nahi'); act(key, (n, oo) => { n.cash -= cost; oo.stock = 100 }, `Restock ho gaya (${fmt(cost)})`) }}>Restock</button>
              <button className="btn small ghost" onClick={() => { const cost = Math.round(d.cost * 0.55 * o.lv); if (o.lv >= 10) return say('Max level 10'); if (s.cash < cost) return say('Cash kam hai'); act(key, (n, oo) => { n.cash -= cost; oo.lv += 1 }, `Level ${o.lv + 1} ho gaya`, true) }}>Upgrade {o.lv < 10 ? fmt(d.cost * 0.55 * o.lv) : 'MAX'}</button>
              <button className="btn small ghost" onClick={() => { const cost = Math.round(d.rev * 1.2); if (s.cash < cost) return say('Cash kam hai'); act(key, (n, oo) => { n.cash -= cost; oo.mktDays = 3 }, 'Marketing chalu — 3 din demand +30%') }}>Marketing {fmt(d.rev * 1.2)}</button>
              <button className="btn small red" onClick={() => { const val = Math.round(d.cost * (0.6 + 0.25 * o.lv)); act(key, (n) => { n.cash += val; delete n.biz[key] }); setOpenKey(null); say(`Branch bechi: ${fmt(val)}`) }}>Branch Becho</button>
            </div>
            <p className="muted">P&amp;L: Bikri = Footfall x Conversion x Price x Rating x Season x Sheher-demand x Festival x Staff-quality. Kharcha = maal (supplier/contract) + wages (aam staff + CV staff ki tankhwah) + rent (sheher) + bijli + wastage. 15% bikri udhaar — kal cash.</p>

            <Section id={'fr_' + key} title="Franchise — Nayi Branch Kholo" icon="franchise" defaultOpen={false}>
              <p className="muted">Setup cost: {fmt(Math.round(d.cost * 0.5))} (brand fee + sajawat). Branch ki apni staff, stock aur P&amp;L hogi. Limit sirf paisa hai.</p>
              <div className="time-ctrl" style={{ flexWrap: 'wrap' }}>
                {(s.unlockedCities || ['india_delhi']).filter((cid) => !s.biz[branchKey(d.id, cid)]).map((cid) => (
                  <button key={cid} className="chip" onClick={() => openBranch(d, cid)}><Icon name="pin" size={13} /> {cityNameOf(cid)}</button>
                ))}
                {!(s.unlockedCities || []).some((cid) => !s.biz[branchKey(d.id, cid)]) && <span className="muted">Saare khule shehron me branch hai — Atlas se naye sheher kholo.</span>}
              </div>
            </Section>

            <Section id={'staff_' + key} title={`Staff — CV Team (${emps.length}/${cap})`} icon="staff" defaultOpen={false}>
              {emps.map((e) => (
                <div className="biz-card" key={e.eid}>
                  <div className="row" style={{ border: 'none', padding: 0 }}><b>{e.name}</b><span className="gold">{roleName(e.role)}</span></div>
                  <div className="muted">Skill {e.skillPct}% • Efficiency {e.effPct}% • Tajurba {e.expYears} saal • Morale {Math.round(e.morale ?? 70)}%</div>
                  <div className="muted">Tankhwah {fmt(e.salary)}/mahina • {e.trait} • Purana malik: {e.past}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    <button className="btn small ghost" onClick={() => { if (s.cash < 2000) return say('Training ke ₹2,000 nahi'); act(key, (n, oo) => { n.cash -= 2000; const t = oo.employees.find((x) => x.eid === e.eid); t.effPct = Math.min(99, t.effPct + 2); t.skillPct = Math.min(99, t.skillPct + 1) }, 'Training ho gayi — efficiency +2%') }}>Train (₹2K)</button>
                    <button className="btn small ghost" onClick={() => act(key, (n, oo) => { const t = oo.employees.find((x) => x.eid === e.eid); t.role = 'supervisor'; t.salary = Math.round(t.salary * 1.2); t.skillPct = Math.min(99, t.skillPct + 5) }, `${e.name} ab Supervisor hai`, true)}>Promote</button>
                    <button className="btn small ghost" onClick={() => act(key, (n, oo) => { const t = oo.employees.find((x) => x.eid === e.eid); t.salary = Math.round(t.salary * 1.1); t.morale = Math.min(100, (t.morale ?? 70) + 10) }, 'Tankhwah +10% — morale badha')}>Raise +10%</button>
                    <button className="btn small red" onClick={() => { act(key, (n, oo) => { oo.employees = oo.employees.filter((x) => x.eid !== e.eid) }); say(`${e.name} ko hataya gaya`) }}>Hatao</button>
                  </div>
                </div>
              ))}
              <label className="muted">Role chuno, CV dekho, phir hire karo (signing = tankhwah ka 25%){(s.managers || {}).hr?.on ? ' — HR Manager ki shortlist: sabse achha CV-per-salary pehle' : ''}</label>
              <select value={role} onChange={(e) => setHireRole({ ...hireRole, [key]: e.target.value })} style={{ width: '100%', marginBottom: 8 }}>
                {rolesForCat(d.cat).map((r) => <option key={r} value={r}>{roleName(r)} — {(ROLE_DEFS.find((x) => x.role === r) || {}).desc}</option>)}
              </select>
              {emps.length >= cap ? <p className="muted">Is branch ki staff capacity full hai ({cap}) — business level badhao to capacity aur badhegi.</p> : cands.map((c) => (
                <div className="biz-card" key={c.pid}>
                  <div className="row" style={{ border: 'none', padding: 0 }}><b>{c.name}</b><span className="gold">CV Score {Math.round(c.value * 10)}</span></div>
                  <div className="muted">Skill <b>{c.skillPct}%</b> • Efficiency <b>{c.effPct}%</b> • Tajurba {c.expYears} saal • Maangi tankhwah <b>{fmt(c.salary)}/mahina</b></div>
                  <div className="muted">{c.trait} • Purana malik: {c.past}</div>
                  <button className="btn small green" style={{ marginTop: 6 }} onClick={() => hireEmp(key, c, role)}>Hire karo (signing {fmt(Math.round(c.salary * 0.25))})</button>
                </div>
              ))}
            </Section>

            {hasOfficer && (
              <Section id={'so_' + key} title="Stock Officer — Auto-Buy Niyam" icon="box" defaultOpen={false}>
                <p className="muted">Stock Officer is branch ka stock khud kharidega — Activity Report (Managers) me har order likha jayega.</p>
                <label className="muted">Target stock %: <input type="number" style={{ width: 80, display: 'inline-block' }} value={rules.target} onChange={(e) => act(key, (n, oo) => { oo.stockRules = { ...rules, target: parseFloat(e.target.value) || 30 } })} /></label>
                <label className="muted">Max unit price (0 = koi limit nahi): <input type="number" style={{ width: 90, display: 'inline-block' }} value={rules.maxPrice} onChange={(e) => act(key, (n, oo) => { oo.stockRules = { ...rules, maxPrice: parseFloat(e.target.value) || 0 } })} /></label>
                <label className="muted">Seller pasand: <select value={rules.pref} onChange={(e) => act(key, (n, oo) => { oo.stockRules = { ...rules, pref: e.target.value } })}><option value="cheapest">Sabse sasta</option><option value="quality">Best quality</option><option value="reliable">Sabse bharosemand</option></select></label>
                <label className="muted"><input type="checkbox" checked={!!rules.allowImport} onChange={(e) => act(key, (n, oo) => { oo.stockRules = { ...rules, allowImport: e.target.checked } })} /> Import ki ijazat (stock bahut kam ho to sasta import, der se aayega)</label>
                <label className="muted"><input type="checkbox" checked={rules.on !== false} onChange={(e) => act(key, (n, oo) => { oo.stockRules = { ...rules, on: e.target.checked } })} /> Auto-buy chalu</label>
              </Section>
            )}
            <ProcurementPanel s={s} upd={upd} say={say} bizId={key} cat={d.cat} d={d} />
          </Section>
        )
      })()}
    </>
  )
}
