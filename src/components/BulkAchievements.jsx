import { Section } from './ui.jsx'
import { fmt } from '../game/engine.js'
import { levelOf, ownedCount } from '../game/data.js'
import { BULK_ACH, bulkProgress } from '../game/content/achievements/index.js'
// Lambe lakshya — Legacy ki seedhi (240 bulk achievements)
export function BulkAchievements({ s, nw, upd, say }) {
  const owned = ownedCount(s); const level = levelOf(s.xp)
  const claimed = s.ach2 || []
  const claim = (a) => { upd((n) => { n.cash += a.reward; n.ach2 = [...(n.ach2 || []), a.id]; n.xp += 10 }); say(`🏆 ${a.name}: +${fmt(a.reward)}`, true) }
  const visible = BULK_ACH.filter((a) => !claimed.includes(a.id)).slice(0, 14)
  return (
    <Section id="bulkach" title="🏅 Lambe Lakshya (Legacy Seedhi)" defaultOpen={false} right={claimed.length + ' poore'}>
      <p className="muted">Ye lakshya mahino ke khel ke liye hain — har jeet par inaam aur Legacy badhta hai. Poore hue: {claimed.length}/{BULK_ACH.length}</p>
      {visible.map((a) => {
        const pr = bulkProgress(s, a, nw, owned, level); const done = pr >= a.target
        return (
          <div className="row" key={a.id}>
            <div><b>{a.name}</b><div className="muted">{a.desc} • {Math.min(pr, a.target).toLocaleString('en-IN')}/{a.target.toLocaleString('en-IN')} • Inaam {fmt(a.reward)}</div>
            <div className="bar"><i style={{ width: Math.min(100, pr / a.target * 100) + '%' }} /></div></div>
            <button className="btn small green" disabled={!done} onClick={() => claim(a)}>{done ? 'Claim' : '…'}</button>
          </div>
        )
      })}
    </Section>
  )
}
