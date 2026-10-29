// ============ CARD DESIGN SYSTEM — poori app ek hi product lage, isiliye har screen inhi cards par ============
// Anatomy: [Icon slot] Title / Subtitle ......... Value zone + TrendChip, neeche Action row.
// Variants: flat | elevated | glass | glow | danger | success • Sizes: sm | md | lg
import { motion } from 'framer-motion'
import { Icon } from './icons/index.jsx'

export function TrendChip({ dir = 'flat', children }) {
  const cls = dir === 'up' ? 'trend up' : dir === 'down' ? 'trend down' : 'trend flat'
  return <span className={cls}>{dir === 'up' ? '▲' : dir === 'down' ? '▼' : '■'} {children}</span>
}
export function Card({ icon, title, subtitle, value, trend, children, actions, variant = 'flat', size = 'md', onClick, delay = 0, className = '' }) {
  return (
    <motion.div className={`dcard v-${variant} s-${size} ${onClick ? ' tappable' : ''} ${className}`}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay }}
      whileTap={onClick ? { scale: 0.985 } : undefined} onClick={onClick}>
      {(title || value) && (
        <div className="dcard-head">
          {icon && <span className="dcard-ic"><Icon name={icon} size={size === 'lg' ? 22 : 18} /></span>}
          <div className="dcard-titles">
            {title && <div className="dcard-title">{title}</div>}
            {subtitle && <div className="dcard-sub">{subtitle}</div>}
          </div>
          {(value || trend) && <div className="dcard-value">{value}{trend}</div>}
        </div>
      )}
      {children}
      {actions && <div className="dcard-actions">{actions}</div>}
    </motion.div>
  )
}
export function StatCard({ icon, label, value, trend, variant = 'flat', delay = 0 }) {
  return <Card icon={icon} variant={variant} size="sm" delay={delay} className="stat-card"
    title={<span className="stat-label">{label}</span>} value={<span className="stat-value">{value}</span>} trend={trend} />
}
export function MetricCard(props) { return <StatCard {...props} /> }
export function PersonCard({ name, roleLabel, lines = [], actions, delay = 0, badge }) {
  const initials = (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <motion.div className="dcard v-flat s-md person-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay }}>
      <div className="dcard-head">
        <span className="avatar">{initials}</span>
        <div className="dcard-titles"><div className="dcard-title">{name}</div><div className="dcard-sub">{roleLabel}</div></div>
        {badge}
      </div>
      {lines.map((l, i) => <div className="dcard-line" key={i}>{l}</div>)}
      {actions && <div className="dcard-actions">{actions}</div>}
    </motion.div>
  )
}
export function ListingCard(props) { return <Card {...props} variant="elevated" /> }
export function BusinessCard(props) { return <Card {...props} variant="flat" className="biz-card-x" /> }
export function AssetCard(props) { return <Card {...props} variant="glass" /> }
export function EmptyCard({ icon = 'spark', title, text, cta }) {
  return (
    <div className="dcard v-flat s-md empty-card">
      <span className="empty-ic"><Icon name={icon} size={30} /></span>
      <div className="dcard-title">{title}</div>
      {text && <div className="dcard-sub">{text}</div>}
      {cta}
    </div>
  )
}
export function SkeletonCard({ lines = 3 }) {
  return <div className="dcard v-flat s-md skeleton-card" aria-hidden="true"><div className="skl skl-t" />{Array.from({ length: lines }).map((_, i) => <div className="skl" key={i} style={{ width: `${88 - i * 14}%` }} />)}</div>
}
