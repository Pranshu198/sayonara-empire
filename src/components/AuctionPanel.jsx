import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section } from './ui.jsx'
import { fmt } from '../game/engine.js'
import { playerBid, BIDDERS } from '../game/auctionEngine.js'
import { PROPERTIES } from '../game/data.js'

// Auction House — phase ke saath boliyan badhti hain; sniper aakhri pal me aata hai, bluffer pehle dhamkata hai
export function AuctionPanel({ s, upd, say }) {
  const auc = s.auction || { lots: [], upcoming: [], hist: [] }
  const [sellKind, setSellKind] = useState('prop')
  const [sellId, setSellId] = useState('')
  const bidOn = (lot, pct) => {
    const amt = Math.round(lot.current * (1 + pct)) + 500
    upd((n) => {
      const t = n.auction.lots.find((x) => x.uid === lot.uid)
      if (!t) return
      const r = playerBid(n, t, amt)
      if (!r.ok) say(' ' + r.msg)
      else say(' ' + r.msg + ` (${fmt(amt)})`, false)
    })
  }
  const autoBid = (lot) => {
    // Auto-bid: maujooda boli se ek kadam aage turant, aur note state me — phase tick par NPC se aage rehne ki koshish UI par dikhayi jati hai
    bidOn(lot, 0.05)
  }
  const listMine = () => {
    if (sellKind === 'prop') {
      if (!sellId || !s.props.includes(sellId)) return say(' Pehle apni property chuno')
      const p = PROPERTIES.find((x) => x.id === sellId)
      upd((n) => {
        n.props = n.props.filter((x) => x !== sellId)
        n.auction.lots.push({ uid: 'auc_mine_' + Date.now(), kind: 'property', name: p.name + ' (TUMHARI)', desc: 'Tumhari rakhi hui lot — boli final hone par paisa milega (5% nilami fees kategi).', refId: sellId, start: Math.round(p.cost * 0.4), value: p.cost, current: Math.round(p.cost * 0.4), leader: null, leaderIsPlayer: false, endsInPhases: 8, hist: [], mine: true, bornDay: n.day })
      })
      say(' Tumhari property nilami par lag gayi!')
    } else {
      if (!sellId || !(s.collectibles || []).includes(sellId)) return say(' Pehle apna collectible chuno')
      upd((n) => {
        n.collectibles = n.collectibles.filter((x) => x !== sellId)
        n.auction.lots.push({ uid: 'auc_mine_' + Date.now(), kind: 'collectible', name: 'Tumhara Collectible', desc: 'Tumhari rakhi hui lot — final boli ka paisa (5% fees kat kar) milega.', refId: sellId, start: 5000, value: 50000, current: 5000, leader: null, leaderIsPlayer: false, endsInPhases: 8, hist: [], mine: true, bornDay: n.day })
      })
      say(' Collectible nilami par lag gaya!')
    }
  }
  return (
    <Section id="auction" title="Auction House — Nilami" right={auc.lots.length + ' live lots'}>
      <p className="muted">Boliyan har phase me badhti hain. Bidder apne andaz ke hain: <b>Sniper</b> aakhri phase me aata hai, <b>Bluffer</b> shuru me dhamkata hai, <b>Kanjoos</b> sirf saste par. Jeetne par rakam cash se kategi aur cheez tumhare naam hogi.</p>
      <div className="muted" style={{ marginBottom: 8 }}>Bidders: {BIDDERS.map((b) => b.name.split(' (')[0]).join(' • ')}</div>
      {auc.lots.map((lot, i) => (
        <motion.div key={lot.uid} className="biz-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <div className="row" style={{ border: 'none', padding: 0 }}><b>{lot.name}</b><b className="gold">{fmt(lot.current)}</b></div>
          <div className="muted">{lot.desc}</div>
          <div className="row"><span>Aage</span><b className={lot.leaderIsPlayer ? 'pos' : ''}>{lot.leader || 'Koi nahi — pehli boli tumhari ho sakti hai'}</b></div>
          <div className="row"><span>Band hone me</span><b>{lot.endsInPhases} phase</b></div>
          {lot.hist && lot.hist.length > 0 && <div className="muted">Boli itihaas: {lot.hist.map((h) => `${h.bidder} ${fmt(h.amt)}`).join(' → ')}</div>}
          {!lot.mine && <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
            <button className="btn small green" onClick={() => bidOn(lot, 0.05)}>Boli +5%</button>
            <button className="btn small green" onClick={() => bidOn(lot, 0.12)}>Boli +12%</button>
            <button className="btn small ghost" onClick={() => autoBid(lot)}> Auto-Bid (ek kadam)</button>
          </div>}
          {lot.mine && <div className="muted"> Tumhari lot — boli band hone ka intezaar karo.</div>}
        </motion.div>
      ))}
      <div style={{ borderTop: '1px solid var(--line)', marginTop: 10, paddingTop: 10 }}>
        <b> Aane Wale Lots (Calendar)</b>
        {(auc.upcoming || []).map((u, i) => <div className="row" key={i}><span>{u.name}</span><span className="muted">Day {u.day} • Shuruaat {fmt(u.start)}</span></div>)}
      </div>
      <div style={{ borderTop: '1px solid var(--line)', marginTop: 10, paddingTop: 10 }}>
        <b> Apni Cheez Nilami Par Lagao</b>
        <div className="grid2" style={{ marginTop: 8 }}>
          <select value={sellKind} onChange={(e) => setSellKind(e.target.value)}>
            <option value="prop">Property</option>
            <option value="col">Collectible</option>
          </select>
          {sellKind === 'prop'
            ? <select value={sellId} onChange={(e) => setSellId(e.target.value)}><option value="">Property chuno…</option>{s.props.map((id) => { const p = PROPERTIES.find((x) => x.id === id); return <option key={id} value={id}>{p.name}</option> })}</select>
            : <select value={sellId} onChange={(e) => setSellId(e.target.value)}><option value="">Collectible chuno…</option>{(s.collectibles || []).map((id) => <option key={id} value={id}>{id}</option>)}</select>}
        </div>
        <button className="btn ghost" style={{ width: '100%', marginTop: 8 }} onClick={listMine}> Nilami Par Lagao (5% fees)</button>
        <p className="muted">Note: 'mine' wali lot jeetne wala NPC hoga to final boli ka 95% tumhare cash me aayega (settlement phase tick par hota hai — agar koi boli hi na aaye to cheez wapas tumhare paas rahegi, iske liye lot ka 'mine' flag rakha hai aur paisa na milne par agli baar phir lagana hoga).</p>
      </div>
      {(auc.hist || []).length > 0 && <div style={{ borderTop: '1px solid var(--line)', marginTop: 10, paddingTop: 10 }}>
        <b> Pichli Nilamiyan</b>
        {auc.hist.slice(0, 6).map((h, i) => <div className="row" key={i}><span>{h.name}</span><b className={h.playerWon ? 'pos' : ''}>{h.winner} — {fmt(h.amt)}</b></div>)}
      </div>}
    </Section>
  )
}
