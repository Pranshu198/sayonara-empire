import { useMemo, useState } from 'react'
import { fmt } from '../game/engine.js'
import { itemsForCat, procItemById } from '../game/procurement/index.js'
import { orderCost } from '../game/engines/supply.js'
import { riskLevel } from '../game/engines/risk.js'

// Procurement — har business ke liye kai sellers aamne-saamne: quality, daam, slab, delivery, reliability, terms
// चुna hua seller = supply contract: COGS, wastage aur rating par asal asar (P&L engine me)
export function ProcurementPanel({ s, upd, say, bizId, cat, d }) {
  const o = s.biz[bizId]
  const contract = (s.contracts || {})[bizId]
  const items = useMemo(() => itemsForCat(cat), [cat])
  const [itemId, setItemId] = useState(contract ? contract.itemId : null)
  const item = useMemo(() => (itemId ? procItemById(itemId) : null) || items[0], [itemId, items])
  if (!o || !item) return null
  const miss = Math.max(10, Math.round(100 - o.stock))
  const totalPhases = (s.day - 1) * 4 + s.phase
  const order = (seller) => {
    const cost = orderCost(d, miss, seller, item.basePrice)
    const payNow = seller.terms !== 'credit15'
    if (payNow && s.cash < cost) return say('❌ Cash kam hai is order ke liye')
    upd((n) => {
      if (payNow) n.cash -= cost
      n.contracts = { ...(n.contracts || {}), [bizId]: { itemId: item.id, item: item.item, sellerName: seller.seller, quality: seller.quality, unitPrice: seller.unitPrice, basePrice: item.basePrice, complaintRisk: seller.complaintRisk, reliability: seller.reliability, deliveryDays: seller.deliveryDays, terms: seller.terms } }
      n.pendingDeliveries = [...(n.pendingDeliveries || []), { bizId, qty: miss, arriveTP: totalPhases + seller.deliveryDays * 4 + 1, kind: 'proc', item: item.item, seller: seller.seller, cost, payOnDelivery: !payNow, rel: seller.reliability }]
    })
    say(`🛒 Order pakka: ${item.item} (${seller.quality}) — ${fmt(cost)}${payNow ? '' : ' (credit: paisa delivery par)'} • ${seller.deliveryDays === 0 ? 'turant milega' : seller.deliveryDays + ' din me aayega'}`)
  }
  return (
    <div style={{ marginTop: 10 }}>
      <div className="row"><span>🛒 Procurement — {item.item}</span><b className="muted">{riskLevel(contract)}</b></div>
      {contract && <div className="muted">Abhi ka contract: {contract.item} • {contract.sellerName} • {contract.quality} • COGS asar {(contract.unitPrice / contract.basePrice).toFixed(2)}x</div>}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '6px 0' }}>
        {items.slice(0, 6).map((it) => <button key={it.id} className={'chip' + (item.id === it.id ? ' on' : '')} onClick={() => setItemId(it.id)}>{it.item}</button>)}
      </div>
      {item.sellers.map((sl, i) => { const cost = orderCost(d, miss, sl, item.basePrice); return (
        <div className="biz-card" key={i} style={{ padding: 10 }}>
          <div className="row" style={{ border: 'none', padding: 0 }}><b>{sl.seller}</b><span className="gold">{sl.quality}</span></div>
          <div className="muted">Daam {fmt(sl.unitPrice)}/unit (base {fmt(item.basePrice)}) • Min {sl.minQty} • Slab chhoot: {(sl.slabs || []).map((x) => `${x.qty}+ par ${Math.round(x.off * 100)}%`).join(', ')}</div>
          <div className="muted">🚚 {sl.deliveryDays === 0 ? 'Turant' : sl.deliveryDays + ' din'} • Bharosa {sl.reliability}% • Payment: {sl.terms === 'credit15' ? '15-din credit' : sl.terms} • Shikayat jokhim {Math.round(sl.complaintRisk * 100)}%</div>
          <button className="btn small" style={{ width: '100%', marginTop: 6 }} onClick={() => order(sl)}>Order karo (stock +{miss}%) — {fmt(cost)}{sl.terms === 'credit15' ? ' • paisa delivery par' : ''}</button>
        </div>) })}
      <p className="muted">Quality ka asar: Branded/Premium = COGS zyada par wastage kam, daam ki chhat (ceiling) zyada, rating surakshit. Local sasta = COGS kam par wastage/shikayat zyada — P&L me saaf dikhega.</p>
    </div>
  )
}
