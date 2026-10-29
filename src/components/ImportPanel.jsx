import { useMemo, useState } from 'react'
import { Section } from './ui.jsx'
import { fmt, bizDef } from '../game/engine.js'
import { ALL_IMPORTS, importsForCat } from '../game/imports/index.js'
import { fxOf, landedCost, arrivalDayFor } from '../game/engines/logistics.js'

// Import System — Atlas ke deshon se maal: landed cost pehle poora dikhega, maal samay par aayega (plan aage ka rakho)
// Imported tag: 14 din us business ki demand/daam ko chamkata hai
export function ImportPanel({ s, upd, say }) {
  const [catF, setCatF] = useState('All')
  const [qty, setQty] = useState(100)
  const owned = Object.entries(s.biz).map(([id, o]) => ({ id, o, d: bizDef(id) }))
  const pool = useMemo(() => {
    const base = catF === 'All' ? ALL_IMPORTS : importsForCat(catF)
    return [...base].sort((a, b) => ((a.country.length * 7 + s.day) % 13) - ((b.country.length * 7 + s.day) % 13)).slice(0, 10)
  }, [catF, s.day])
  const order = (L) => {
    const target = owned.find((x) => x.d.cat === L.cat)
    if (!target) return say(` Pehle ${L.cat} category ka business kholo — import wahi lagega`)
    const lc = landedCost(L, qty, s.day)
    if (s.cash + s.bank < lc.total) return say(' Landed cost ke paise kam hai')
    const { arriveDay, delayed } = arrivalDayFor(L, s.day, Math.random)
    upd((n) => {
      const fromCash = Math.min(n.cash, lc.total); n.cash -= fromCash; n.bank -= (lc.total - fromCash)
      n.pendingDeliveries = [...(n.pendingDeliveries || []), { bizId: target.id, qty: Math.min(100, Math.round(qty / 2)), arriveTP: arriveDay * 4, kind: 'import', item: L.item, country: L.country, cost: lc.total, payOnDelivery: false, rel: Math.round((1 - L.delayRisk) * 100) }]
      n.story = [`Day ${n.day}:  ${L.country} se ${L.item} import order — ${fmt(lc.total)}`, ...n.story].slice(0, 20)
    })
    say(` Import order: ${L.item} (${L.country}) • Landed ${fmt(lc.total)} • Pohchega Day ${arriveDay}${delayed ? '  port par der ke sanket' : ''}`, true)
  }
  return (
    <Section id="imports" title="Import System — Duniya se Maal" right="Landed cost pehle dikhega" defaultOpen={false}>
      <p className="muted">Har listing: asal desh, base daam par currency (FX) ka asar, shipping, customs duty — kul landed cost confirm se pehle. Container (1000+ qty) par bada discount, par samay zyada. Maal aane par business ko 14 din 'Imported' tag milta hai.</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {['All', 'Food', 'Retail', 'Tech', 'Health', 'Energy', 'Industry', 'Edu', 'Service'].map((c) => <button key={c} className={'chip' + (catF === c ? ' on' : '')} onClick={() => setCatF(c)}>{c}</button>)}
        {[10, 100, 1000].map((n) => <button key={n} className={'chip' + (qty === n ? ' on' : '')} onClick={() => setQty(n)}>Qty {n}{n >= 1000 ? ' (container)' : ''}</button>)}
      </div>
      {pool.map((L) => { const lc = landedCost(L, qty, s.day); const target = owned.find((x) => x.d.cat === L.cat); return (
        <div className="biz-card" key={L.id}>
          <div className="row" style={{ border: 'none', padding: 0 }}><b>{L.item}</b><span className="gold">{L.country}</span></div>
          <div className="muted">Base {fmt(L.basePrice)}/unit • FX aaj {lc.fx}x • Local me yahi ~{fmt(L.localAltPrice)} • Duty {Math.round(L.dutyPct * 100)}% • Ship {L.shipDays} din • Der ka jokhim {Math.round(L.delayRisk * 100)}%</div>
          <div className="muted">Landed hisaab (qty {qty}): base {fmt(lc.base)} + shipping {fmt(lc.shipping)} + duty {fmt(lc.duty)}{lc.discount ? ` − container chhoot ${fmt(lc.discount)}` : ''} = <b>{fmt(lc.total)}</b> → {target ? `${target.d.name} ko jayega, stock +${Math.min(100, Math.round(qty / 10))}%` : `${L.cat} business nahi hai`}</div>
          <button className="btn small" style={{ width: '100%', marginTop: 6 }} disabled={!target} onClick={() => order(L)}>{target ? ` Import karo — ${fmt(lc.total)}` : 'Pehle is category ka business kholo'}</button>
        </div>) })}
      {(s.pendingDeliveries || []).filter((x) => x.kind === 'import').map((dl, i) => <div className="news-item" key={i}> Raaste me: {dl.item} ({dl.country}) — {dl.bizId} ke liye</div>)}
    </Section>
  )
}
