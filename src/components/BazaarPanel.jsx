import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section } from './ui.jsx'
import { fmt, bizDef } from '../game/engine.js'
import { negotiate, valuationOf } from '../game/bazaarEngine.js'

// Ready-made business bazaar — P&L dekho, mol-bhaav karo, turant kabza lo; apna business bhi bechne lagao
export function BazaarPanel({ s, upd, say }) {
  const [inspect, setInspect] = useState(null)
  const [offerPct, setOfferPct] = useState(85)
  const [negMsg, setNegMsg] = useState({})
  const [listBiz, setListBiz] = useState('')
  const [listPrice, setListPrice] = useState(100000)
  const listings = s.bazaar || []

  const buyNow = (l) => {
    if (s.biz[l.bizId]) return say('⚠️ Is type ka business tumhare paas pehle se hai')
    if (s.cash < l.ask) return say('❌ Cash kam hai — pehle negotiate try karo ya paisa jodo')
    upd((n) => {
      n.cash -= l.ask
      n.biz[l.bizId] = { lv: l.lv, price: l.priceMul, stock: l.stock, staff: l.staff, profitToday: 0, profitTotal: l.profit30.reduce((a, b) => a + b, 0), rating: l.rating, mktDays: 0 }
      n.bazaar = n.bazaar.filter((x) => x.uid !== l.uid)
      n.xp += 25
      n.story = [`Day ${n.day}: Bazaar se ${bizDef(l.bizId).name} kharida (${l.district}) — staff/rating sab saath aaya`, ...n.story].slice(0, 30)
      n.news = [{ day: n.day, text: `📰 Sheher Times: Sayonara Empire ne ${l.district} ka ${bizDef(l.bizId).name} kharid liya — bazaar me hulchul!` }, ...n.news].slice(0, 12)
    })
    say(`🎉 ${bizDef(l.bizId).name} tumhara hua — Lv${l.lv}, rating ${l.rating}, staff saath!`, true)
  }
  const doNegotiate = (l) => {
    const amt = Math.round(l.ask * offerPct / 100)
    const r = negotiate(l, amt)
    if (r.result === 'accept') {
      if (s.biz[l.bizId]) return say('⚠️ Ye business type pehle se hai tumhare paas')
      if (s.cash < amt) return say('❌ Offer kabul hua par cash kam hai!')
      upd((n) => {
        n.cash -= amt
        n.biz[l.bizId] = { lv: l.lv, price: l.priceMul, stock: l.stock, staff: l.staff, profitToday: 0, profitTotal: l.profit30.reduce((a, b) => a + b, 0), rating: l.rating, mktDays: 0 }
        n.bazaar = n.bazaar.filter((x) => x.uid !== l.uid)
        n.xp += 30
        n.story = [`Day ${n.day}: Mol-bhaav jeet kar ${bizDef(l.bizId).name} liya — ${fmt(l.ask - amt)} bachaya!`, ...n.story].slice(0, 30)
      })
      say(`🤝 Sauda pakka ${fmt(amt)} me! ${fmt(l.ask - amt)} ki bachat!`, true)
    } else if (r.result === 'counter') {
      setNegMsg((m) => ({ ...m, [l.uid]: r.msg + ` (Counter: ${fmt(r.counter)})` }))
    } else {
      setNegMsg((m) => ({ ...m, [l.uid]: r.msg }))
    }
  }
  const listMine = () => {
    if (!listBiz || !s.biz[listBiz]) return say('⚠️ Pehle business chuno')
    if ((s.myListings || []).some((x) => x.bizId === listBiz)) return say('⚠️ Ye pehle se list hai')
    upd((n) => { n.myListings = [...(n.myListings || []), { bizId: listBiz, ask: listPrice, offers: [], day: n.day }] })
    say('📋 Listing live! Boliyan aane ka intezaar karo — har din naye khariddar aayenge.')
  }
  const acceptOffer = (ml, offer) => {
    upd((n) => {
      n.cash += offer.amt
      delete n.biz[ml.bizId]
      n.myListings = n.myListings.filter((x) => x.bizId !== ml.bizId)
      n.story = [`Day ${n.day}: Apna ${bizDef(ml.bizId).name} becha ${offer.bidder} ko — ${fmt(offer.amt)}`, ...n.story].slice(0, 30)
      n.news = [{ day: n.day, text: `📰 Sheher Times: Sayonara Empire ka ${bizDef(ml.bizId).name} bika — ${offer.bidder} ne liya ${fmt(offer.amt)} me!` }, ...n.news].slice(0, 12)
    })
    say(`💰 Bik gaya! ${fmt(offer.amt)} cash aaya`, true)
  }

  return (
    <Section id="bazaar" title="🏪 Business Bazaar — Ready-made Kharid/Bech" right={listings.length + ' listings'}>
      <p className="muted">Chalte hue business bikte hain — P&L dekho, mol-bhaav karo, kabza lo (staff, rating, stock sab saath aata hai). Ghate wale saste = turnaround ka mauka; munafe wale mehnge = pakki kamaai.</p>
      {listings.map((l, i) => {
        const d = bizDef(l.bizId); const avg = Math.round(l.profit30.reduce((a, b) => a + b, 0) / 30)
        const open = inspect === l.uid
        return (
          <motion.div key={l.uid} className="biz-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <div className="row" style={{ border: 'none', padding: 0 }}>
              <b>{d.icon} {d.name} — {l.district}</b>
              <b className="gold">{fmt(l.ask)}</b>
            </div>
            <div className="muted">Malik: {l.owner} • {l.ageDays} din purana • Lv{l.lv} • ⭐{l.rating} • Staff {l.staff} • Avg munafa {fmt(avg)}/din {avg < 0 && <span className="neg">(GHATA — turnaround deal!)</span>}</div>
            <div className="muted">💬 Bechne ki wajah: {l.reason}</div>
            <div className="muted">Valuation (hamara andaz): {fmt(l.valuation || valuationOf(l))} • {l.daysLeft} din baki — warna koi aur/rival le jayega</div>
            <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
              <button className="btn small ghost" onClick={() => setInspect(open ? null : l.uid)}>{open ? 'Band karo' : '🔍 P&L Dekho'}</button>
              <button className="btn small green" onClick={() => buyNow(l)}>⚡ Turant Kharido</button>
            </div>
            {open && <>
              <div className="spark" style={{ marginTop: 10 }}>{l.profit30.map((p, j) => <i key={j} className={p < 0 ? 'neg-bar' : ''} style={{ height: Math.max(4, Math.min(38, Math.abs(p) / Math.max(1, ...l.profit30.map(Math.abs)) * 38)) + 'px', background: p < 0 ? 'var(--red)' : undefined }} />)}</div>
              <div className="muted">Pichle 30 din ka roz ka munafa (upar = munafa, laal = ghata). Kul: {fmt(l.profit30.reduce((a, b) => a + b, 0))}</div>
              <label className="muted">Tumhari offer: {offerPct}% ({fmt(Math.round(l.ask * offerPct / 100))})</label>
              <input type="range" min="50" max="100" step="5" value={offerPct} onChange={(e) => setOfferPct(parseInt(e.target.value))} />
              <button className="btn small" style={{ width: '100%' }} onClick={() => doNegotiate(l)}>🤝 Offer Do — Mol-bhaav</button>
              {negMsg[l.uid] && <p className="small" style={{ marginTop: 6 }}>{negMsg[l.uid]}</p>}
            </>}
          </motion.div>
        )
      })}

      <div style={{ borderTop: '1px solid var(--line)', marginTop: 12, paddingTop: 10 }}>
        <b>📤 Apna Business Becho</b>
        <div className="grid2" style={{ marginTop: 8 }}>
          <select value={listBiz} onChange={(e) => setListBiz(e.target.value)}>
            <option value="">Business chuno…</option>
            {Object.keys(s.biz).map((id) => <option key={id} value={id}>{bizDef(id).name} (Lv{s.biz[id].lv})</option>)}
          </select>
          <input type="number" value={listPrice} onChange={(e) => setListPrice(parseInt(e.target.value) || 0)} placeholder="Apni keemat ₹" />
        </div>
        <button className="btn ghost" style={{ width: '100%', marginTop: 8 }} onClick={listMine}>📋 Bazaar me List Karo</button>
        {(s.myListings || []).map((ml) => (
          <div className="biz-card" key={ml.bizId}>
            <div className="row" style={{ border: 'none', padding: 0 }}><b>{bizDef(ml.bizId).name}</b><b>{fmt(ml.ask)}</b></div>
            {(ml.offers || []).length === 0 && <div className="muted">Abhi koi boli nahi — har din naye khariddar aate hain.</div>}
            {(ml.offers || []).map((o, j) => (
              <div className="row" key={j}><span>{o.bidder} — <b>{fmt(o.amt)}</b></span>
                <span style={{ display: 'flex', gap: 6 }}>
                  <button className="btn small green" onClick={() => acceptOffer(ml, o)}>✔ Bech Do</button>
                  <button className="btn small red" onClick={() => upd((n) => { const t = n.myListings.find((x) => x.bizId === ml.bizId); if (t) t.offers = t.offers.filter((_, k) => k !== j) })}>✖</button>
                </span></div>
            ))}
            <button className="btn small red" onClick={() => upd((n) => { n.myListings = n.myListings.filter((x) => x.bizId !== ml.bizId) })}>Listing Hatao</button>
          </div>
        ))}
      </div>
    </Section>
  )
}
