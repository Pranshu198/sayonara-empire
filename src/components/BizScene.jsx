// ============ PASS 3.6 — BUSINESS SCENE SYSTEM (visual evolution) ============
// Ek hi reusable system: category-wise SVG scene, jo evolution tier ke saath BADALTA hai —
// chhoti stall -> sign board -> lights -> badi building -> sunehra Samrajya mahal.
// 32 alag tasveerein nahi: primitives se bane 8 category scenes x 5 tier props. Halka, koi image file nahi.
import { useId } from 'react'
import { tierOf } from '../game/evolution.js'

const PALETTE = {
  Food: ['#f59e0b', '#92400e'], Retail: ['#38bdf8', '#075985'], Service: ['#a78bfa', '#5b21b6'],
  Edu: ['#34d399', '#065f46'], Health: ['#f87171', '#991b1b'], Tech: ['#22d3ee', '#155e75'],
  Industry: ['#fb923c', '#9a3412'], Energy: ['#a3e635', '#3f6212'],
}

function Glyph({ cat, cx, cy, s = 1, col = '#0b0b0d' }) {
  const g = { transform: `translate(${cx} ${cy}) scale(${s})`, fill: col, stroke: col }
  switch (cat) {
    case 'Food': return <g {...g}><path d="M-5 -6 L5 -6 L3.4 6 L-3.4 6 Z" fill={col} /><rect x="-0.7" y="-11" width="1.6" height="6" rx="0.8" /><path d="M-5 -6 Q0 -2.5 5 -6" fill="none" strokeWidth="1.4" /></g>
    case 'Retail': return <g {...g}><path d="M-5 -3 L5 -3 L4 7 L-4 7 Z" /><path d="M-2.6 -3 a2.6 2.6 0 0 1 5.2 0" fill="none" strokeWidth="1.5" /></g>
    case 'Service': return <g {...g}><path d="M0 -7 L2 -2.4 L7 -2 L3.2 1.2 L4.4 6 L0 3.4 L-4.4 6 L-3.2 1.2 L-7 -2 L-2 -2.4 Z" /></g>
    case 'Edu': return <g {...g}><path d="M0 -4 Q-4.5 -6.5 -8 -5 L-8 5 Q-4.5 3.5 0 6 Q4.5 3.5 8 5 L8 -5 Q4.5 -6.5 0 -4 Z" /><line x1="0" y1="-4" x2="0" y2="6" stroke="#00000033" strokeWidth="1" /></g>
    case 'Health': return <g {...g}><path d="M-2 -7 L2 -7 L2 -2 L7 -2 L7 2 L2 2 L2 7 L-2 7 L-2 2 L-7 2 L-7 -2 L-2 -2 Z" fill="#fff" stroke="none" /></g>
    case 'Tech': return <g {...g}><rect x="-7" y="-5" width="14" height="10" rx="1.6" fill="none" strokeWidth="1.8" /><line x1="0" y1="5" x2="0" y2="8" strokeWidth="1.8" /><line x1="-4" y1="8" x2="4" y2="8" strokeWidth="1.8" /></g>
    case 'Industry': return <g {...g}><path d="M-8 7 L-8 -2 L-3 -5 L-3 -2 L2 -5 L2 -2 L8 -5 L8 7 Z" /></g>
    case 'Energy': return <g {...g}><line x1="0" y1="8" x2="0" y2="-2" strokeWidth="1.8" /><path d="M0 -2 L0 -8 M0 -2 L-6 1 M0 -2 L6 1" strokeWidth="1.8" strokeLinecap="round" fill="none" /><circle r="1.4" fill={col} stroke="none" /></g>
    default: return <g {...g}><rect x="-6" y="-6" width="12" height="12" rx="2" /></g>
  }
}

export function BizScene({ cat = 'Food', lv = 1, tier = null, height = 74, dim = false }) {
  const t = tier !== null && tier !== undefined ? tier : tierOf(lv)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [c1, c2] = PALETTE[cat] || PALETTE.Food
  const w = 32 + t * 5, h = 20 + t * 5.5, x = (120 - w) / 2, y = 56 - h
  const winCols = 2 + t, winRows = Math.max(1, Math.round(h / 11))
  const windows = []
  for (let r = 0; r < winRows; r++) for (let c = 0; c < winCols; c++) {
    if ((r * 7 + c * 3 + t) % 4 === 0) continue
    windows.push(<rect key={r + '-' + c} x={x + 4 + c * ((w - 8) / winCols)} y={y + 5 + r * 9.5} width="3.6" height="5" rx="0.8" fill="#ffd97a" opacity={0.55 + ((r + c) % 3) * 0.18} />)
  }
  return (
    <svg className={'biz-scene tier-' + t + (dim ? ' dim' : '')} viewBox="0 0 120 64" style={{ height }} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={'bg' + uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c2} /><stop offset="100%" stopColor="#050505" /></linearGradient>
        <linearGradient id={'bd' + uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1} /><stop offset="100%" stopColor={c2} /></linearGradient>
      </defs>
      <rect width="120" height="64" fill={`url(#bg${uid})`} />
      {/* door ki skyline — tier ke saath ghani hoti hai */}
      <g fill="#000" opacity="0.4">
        <rect x="2" y={34 - t * 2} width="13" height={30 + t * 2} /><rect x="100" y={30 - t * 3} width="16" height={34 + t * 3} />
        {t >= 2 && <rect x="16" y="38" width="10" height="26" />}{t >= 3 && <rect x="90" y="40" width="9" height="24" />}
      </g>
      <rect y="56" width="120" height="8" fill="#000" opacity="0.55" />
      {/* side wing — tier 4 se dusri building */}
      {t >= 3 && <rect x={x + w + 3} y={y + 10} width="13" height={56 - y - 10} rx="1.5" fill={`url(#bd${uid})`} opacity="0.75" />}
      {cat === 'Industry' && <g fill="#1c1c1e"><rect x={x + 3} y={y - 8} width="5" height="9" /><rect x={x + w - 9} y={y - 6} width="5" height="7" /><ellipse cx={x + 5.5} cy={y - 10} rx="4" ry="1.8" fill="#fff" opacity="0.35" /></g>}
      {/* main building */}
      <rect x={x} y={y} width={w} height={h} rx="2" fill={`url(#bd${uid})`} stroke={t >= 4 ? '#f5c542' : 'rgba(255,255,255,.25)'} strokeWidth={t >= 4 ? 1.4 : 0.7} />
      {windows}
      {/* door */}
      <rect x={60 - 3.4} y={56 - 10} width="6.8" height="10" rx="1" fill="#0b0b0d" opacity="0.85" />
      {/* awning — Food/Retail/Service, tier 2+ */}
      {t >= 1 && (cat === 'Food' || cat === 'Retail' || cat === 'Service') && (
        <g>{Array.from({ length: 6 }).map((_, i) => <rect key={i} x={x - 2 + i * ((w + 4) / 6)} y={y + h - 13} width={(w + 4) / 6} height="3.4" fill={i % 2 ? '#fff' : c2} opacity="0.9" />)}</g>
      )}
      {/* sign board — tier 2+ par category nishaan */}
      {t >= 1 && <g><rect x={60 - 9} y={y - 8.5} width="18" height="8" rx="2" fill="#0d0d0f" stroke={c1} strokeWidth="0.8" /><Glyph cat={cat} cx={60} cy={y - 4.4} s={0.62} col={c1} /></g>}
      {t === 0 && <Glyph cat={cat} cx={60} cy={y + h / 2 - 1} s={0.9} col="#0b0b0d" />}
      {/* string lights — tier 3+ */}
      {t >= 2 && <g>{Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={x - 1 + i * ((w + 2) / 6)} cy={y + 2.5 + Math.sin(i * 1.2) * 1.1} r="1.15" fill="#ffe9a8" opacity="0.95" />)}</g>}
      {/* Samrajya crown — tier 5 */}
      {t >= 4 && <g><path d="M52 6 L56 1.6 L60 5.4 L64 1.6 L68 6 L67 9.4 L53 9.4 Z" fill="#f5c542" stroke="#a97b06" strokeWidth="0.6" /><circle cx="60" cy="4.4" r="1" fill="#e9d5ff" /></g>}
      {t >= 4 && <g fill="#f5c542">{[[14, 12], [106, 10], [24, 6], [96, 18]].map(([sx, sy], i) => <path key={i} d={`M${sx} ${sy - 3} L${sx + 1} ${sy - 1} L${sx + 3} ${sy} L${sx + 1} ${sy + 1} L${sx} ${sy + 3} L${sx - 1} ${sy + 1} L${sx - 3} ${sy} L${sx - 1} ${sy - 1} Z`} opacity="0.9" />)}</g>}
      {t >= 4 && <rect x="1" y="1" width="118" height="62" rx="5" fill="none" stroke="#f5c542" strokeWidth="1.3" opacity="0.85" />}
    </svg>
  )
}
