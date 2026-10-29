// ============ ICON SYSTEM — khud ke SVG icons, poori app me emoji ki jagah yahi chalenge ============
import { P, FALLBACK } from './paths.jsx'
export { P as ICON_PATHS }
export function Icon({ name, size = 18, sw = 1.8, style }) {
  const body = P[name] || FALLBACK
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-3px', flexShrink: 0, ...style }} aria-hidden="true">{body}</svg>
  )
}
// Category ke hisaab se icon
export const CAT_ICON = { Food: 'shop', Retail: 'tag', Service: 'spark', Edu: 'book', Health: 'heart', Tech: 'bolt', Industry: 'building', Energy: 'sun' }
export function CatIcon({ cat, size = 16 }) { return <Icon name={CAT_ICON[cat] || 'shop'} size={size} /> }
