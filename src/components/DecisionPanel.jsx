import { Section } from './ui.jsx'
import { stripEmoji } from '../utils/text.js'
import { fmt } from '../game/engine.js'
// Roz ka faisla — 620 decision cards wali library se; asar cash + saakh (rep) par
export function DecisionPanel({ s, upd, say }) {
  const d = s.decision
  const pending = d && s.decisionDay === s.day
  const choose = (opt) => {
    upd((n) => {
      n.cash += opt.cash
      n.rep = Math.max(0, Math.min(100, (n.rep || 50) + (opt.rep || 0)))
      if (opt.cash < 0) n.cash = n.cash // cash kam ho to bhi faisla lagoo (karz jaisi halat nahi banayenge)
      n.story = [`Day ${n.day}: Faisla — ${d.title}: ${opt.label}`, ...n.story].slice(0, 30)
      n.decision = null
    })
    say(` Faisla ho gaya: ${opt.note} ${opt.cash ? '(' + (opt.cash >= 0 ? '+' : '') + fmt(opt.cash) + ')' : ''}`, opt.cash > 3000)
  }
  if (!pending) return null
  return (
    <Section id="decision" title="Aaj ka Faisla" right="1 din ke liye">
      <b>{stripEmoji(d.title)}</b>
      <p className="small">{stripEmoji(d.story)}</p>
      <div className="grid2">
        <button className="btn" onClick={() => choose(d.a)}>{stripEmoji(d.a.label)}<div className="muted" style={{ fontWeight: 400 }}>{d.a.cash ? fmt(d.a.cash) : '₹0'} • Saakh {d.a.rep >= 0 ? '+' : ''}{d.a.rep}</div></button>
        <button className="btn ghost" onClick={() => choose(d.b)}>{stripEmoji(d.b.label)}<div className="muted" style={{ fontWeight: 400 }}>{d.b.cash ? fmt(d.b.cash) : '₹0'} • Saakh {d.b.rep >= 0 ? '+' : ''}{d.b.rep}</div></button>
      </div>
      <p className="muted">Har faisla tumhari kahani (Your Story) me likha jata hai — aur saakh (reputation) aage ke saudo me kaam aati hai.</p>
    </Section>
  )
}
