import { Section } from './ui.jsx'
import { stripEmoji } from '../utils/text.js'
import { Icon } from './icons/index.jsx'
// Graahak reviews — badi customer library se roz naye chehre
export function ReviewsPanel({ s }) {
  const reviews = s.reviews || []
  return (
    <Section id="reviews" title="Graahak Reviews" defaultOpen={false} right={reviews.length ? reviews.length + ' naye' : ''}>
      {reviews.length === 0 && <p className="muted">Pehla business kharidte hi graahak apni ray dena shuru karenge — asal naam, asal bhasha.</p>}
      {reviews.map((r, i) => (
        <div className="news-item" key={i}>
          <span className="gold">{Array.from({ length: r.stars }).map((_, si) => <Icon key={si} name="star" size={13} />)}</span> <b>{r.name}</b> <span className="muted">({r.job}) • {r.cat} • Day {r.day}</span>
          <div>{stripEmoji(r.text)}</div>
        </div>
      ))}
    </Section>
  )
}
