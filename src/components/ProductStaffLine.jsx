import { useMemo } from 'react'
import { productsOfCat } from '../game/content/products/index.js'
import { staffForBiz } from '../game/content/staff/index.js'
// Business card ke andar: top products + asal staff ke naam (badi libraries se)
export function ProductStaffLine({ bizId, cat, staffCount, fmt }) {
  const products = useMemo(() => productsOfCat(cat, 3), [cat])
  const staff = useMemo(() => staffForBiz(bizId, cat, Math.max(1, staffCount)), [bizId, cat, staffCount])
  return (
    <>
      <div className="muted" style={{ marginTop: 6 }}>🏆 Top Products: {products.map((p) => `${p.name} (${fmt(p.price)})`).join(' • ')}</div>
      <div className="muted">👥 Team: {staff.map((p) => `${p.name} (${p.role}, skill ${p.skill})`).join(' • ')}</div>
    </>
  )
}
