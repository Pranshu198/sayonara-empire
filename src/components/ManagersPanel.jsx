import { useState } from 'react'
import { Section } from './ui.jsx'
import { fmt } from '../game/engine.js'
import { MANAGER_ROLES, candidatesFor, DEFAULT_RULES } from '../game/managers/index.js'

// AI Managers — bharti karo, niyam (rules) tay karo, har action ki report audit karo
// Manager khud kaam karta hai: restock, daam, marketing, FD/EMI, trading — galti bhi sakti hai, khabar imandaari se aati hai
export function ManagersPanel({ s, upd, say }) {
  const [openRole, setOpenRole] = useState(null)
  const hire = (role, c) => {
    upd((n) => { n.managers = { ...(n.managers || {}), [role]: { pid: c.id, role, roleName: c.roleName, name: c.name, skill: c.skill, salary: c.salary, personality: c.personality, mistakeRate: c.mistakeRate, on: true, rules: { ...(DEFAULT_RULES[role] || {}) } } }; n.story = [`Day ${n.day}: 👔 ${c.name} ko ${c.roleName} rakha — tankhwah ${fmt(c.salary)}/mahina`, ...n.story].slice(0, 20) })
    say(`👔 ${c.name} (${c.roleName}) team me! Tankhwah ${fmt(c.salary)}/mahina, skill ${c.skill}/10`, true)
  }
  const fire = (role) => { const m = (s.managers || {})[role]; upd((n) => { delete n.managers[role] }); say(`👋 ${m ? m.name : 'Manager'} ko hataya gaya`) }
  const toggle = (role) => upd((n) => { n.managers[role].on = !n.managers[role].on })
  const setRule = (role, key, val) => upd((n) => { n.managers[role].rules = { ...(n.managers[role].rules || {}), [key]: val } })
  const numRule = (role, m, key, label) => (
    <label className="muted" key={key}>{label}: <input type="number" style={{ width: 90, display: 'inline-block' }} value={m.rules?.[key] ?? ''} onChange={(e) => setRule(role, key, parseFloat(e.target.value) || 0)} /></label>
  )
  return (
    <Section id="managers" title="🤖 AI Managers — Automation" right={`${Object.keys(s.managers || {}).length}/8 bharti`} defaultOpen={false}>
      <p className="muted">Manager tumhare niyamo par khud kaam karta hai — har kaam neeche Activity Report me likha jaata hai. Skill zyada = galti kam. Tankhwah har mahine Treasury se katti hai; na de pao to manager chala jayega.</p>
      {MANAGER_ROLES.map(({ role, name, icon, desc }) => { const m = (s.managers || {})[role]; const st = (s.managerStats || {})[role]; return (
        <div className="biz-card" key={role}>
          <div className="row" style={{ border: 'none', padding: 0 }}><b>{icon} {name}</b>{m ? <span className="gold">{m.on ? '🟢 Kaam par' : '⏸️ Ruka hua'}</span> : <span className="muted">khali</span>}</div>
          <div className="muted">{desc}</div>
          {m ? <>
            <div className="muted">👤 <b>{m.name}</b> • Skill {m.skill}/10 • {fmt(m.salary)}/mahina • {m.personality}</div>
            {st && <div className="muted">📊 Performance: {st.actions} actions • sahi {st.good} • galti {st.bad} • kul asar {fmt(st.net)}</div>}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8, alignItems: 'center' }}>
              <button className="btn small ghost" onClick={() => toggle(role)}>{m.on ? '⏸️ Pause' : '▶️ Chalu'}</button>
              <button className="btn small red" onClick={() => fire(role)}>🔥 Hatao</button>
              {role === 'purchase' && <>
                {numRule(role, m, 'threshold', 'Stock % se neeche')}
                <select value={m.rules?.pref || 'cheapest'} onChange={(e) => setRule(role, 'pref', e.target.value)}>
                  <option value="cheapest">Sabse sasta seller</option><option value="quality">Best quality seller</option><option value="reliable">Sabse bharosemand</option>
                </select>
              </>}
              {role === 'finance' && <>{numRule(role, m, 'bufferAmt', 'Cash buffer ₹')}{numRule(role, m, 'fdAbove', 'FD isse upar cash par')}</>}
              {role === 'trading' && <>{numRule(role, m, 'profitPct', 'Munafa % par becho')}{numRule(role, m, 'sellFrac', 'Kitna % becho')}</>}
              {role === 'pricing' && <span className="muted">Niyam: rating &lt;3.7 par daam ghatana, &gt;4.4 par badhana (din me ek baar)</span>}
              {role === 'marketing' && <span className="muted">Niyam: stock bhara + cash surakshit ho to campaign</span>}
              {role === 'hr' && <span className="muted">Niyam: team adhoori ho to bharti (cash suraksha ke saath)</span>}
              {role === 'inventory' && <span className="muted">Niyam: stock 0 = emergency kharid</span>}
              {role === 'expansion' && <span className="muted">Niyam: har 7 din vistaar report (khareed tum karoge)</span>}
            </div>
          </> : <>
            <button className="btn small ghost" style={{ marginTop: 6 }} onClick={() => setOpenRole(openRole === role ? null : role)}>{openRole === role ? 'Ummeedwar chhupao' : '👀 Ummeedwar dekho (3)'}</button>
            {openRole === role && candidatesFor(role, s.day).map((c) => (
              <div className="row" key={c.id}><div><b>{c.name}</b><div className="muted">Skill {c.skill}/10 • {c.xpYears} saal tajurba • {c.personality} • galti dar {Math.round(c.mistakeRate * 100)}%</div></div>
                <button className="btn small green" onClick={() => hire(role, c)}>Rakho {fmt(c.salary)}/mo</button></div>
            ))}
          </>}
        </div>) })}
      <Section id="mgrlog" title="📋 Manager Activity Report" defaultOpen={false}>
        {(s.managerLog || []).length ? (s.managerLog || []).map((l, i) => <div className="news-item" key={i}><span className="muted">Day {l.day} • {l.role}</span> {l.text}{l.delta ? ` (${l.delta > 0 ? '+' : ''}${fmt(l.delta)})` : ''}</div>) : <p className="muted">Abhi koi manager kaam par nahi — pehla manager rakho, uski har harkat yaha likhi jayegi.</p>}
      </Section>
    </Section>
  )
}
