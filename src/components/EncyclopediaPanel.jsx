import { useState } from 'react'
import { Section } from './ui.jsx'
import { searchTerms } from '../game/content/encyclopedia/index.js'
// Arth-Gyaan Kosh — khoj karke koi bhi economy shabd samjho
export function EncyclopediaPanel() {
  const [q, setQ] = useState('')
  const results = searchTerms(q).slice(0, 12)
  return (
    <Section id="encyclopedia" title="Arth-Gyaan Kosh" defaultOpen={false} right="Economy ki pathshala">
      <input type="text" placeholder="Shabd khojo — profit, cashflow, EMI, valuation..." value={q} onChange={(e) => setQ(e.target.value)} />
      {results.map((e) => (
        <div className="news-item" key={e.id}>
          <b>{e.term}</b>
          <div>{e.def}</div>
          <div className="muted"> {e.example}</div>
          <div className="muted"> {e.tip}</div>
        </div>
      ))}
      {results.length === 0 && <p className="muted">Kuch nahi mila — doosra shabd try karo.</p>}
    </Section>
  )
}
