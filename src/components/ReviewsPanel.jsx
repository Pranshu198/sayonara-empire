import { Section } from './ui.jsx'
// Graahak reviews — badi customer library se roz naye chehre
export function ReviewsPanel({ s }) {
  const reviews = s.reviews || []
  return (
    <Section id="reviews" title="⭐ Graahak Reviews" defaultOpen={false} right={reviews.length ? reviews.length + ' naye' : ''}>
      {reviews.length === 0 && <p className="muted">Pehla business kharidte hi graahak apni ray dena shuru karenge — asal naam, asal bhasha.</p>}
      {reviews.map((r, i) => (
        <div className="news-item" key={i}>
          <b>{'⭐'.repeat(r.stars)}</b> <b>{r.name}</b> <span className="muted">({r.job}) • {r.cat} • Day {r.day}</span>
          <div>{r.text}</div>
        </div>
      ))}
    </Section>
  )
}
