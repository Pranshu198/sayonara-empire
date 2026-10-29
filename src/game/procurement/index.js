// Procurement Engine data — har item ke kai sellers: quality, daam, slab, delivery, reliability, terms
// Khiladi har business ke liye supply contract chun sakta hai; contract P&L (COGS, wastage, rating) badalta hai
import { PROC_FOOD_1 } from './food1.js'
import { PROC_FOOD_2 } from './food2.js'
import { PROC_FOOD_3 } from './food3.js'
import { PROC_RETAIL_1 } from './retail1.js'
import { PROC_RETAIL_2 } from './retail2.js'
import { PROC_RETAIL_3 } from './retail3.js'
import { PROC_SERVICE_1 } from './service1.js'
import { PROC_SERVICE_2 } from './service2.js'
import { PROC_SERVICE_3 } from './service3.js'
import { PROC_EDU_1 } from './edu1.js'
import { PROC_EDU_2 } from './edu2.js'
import { PROC_EDU_3 } from './edu3.js'
import { PROC_HEALTH_1 } from './health1.js'
import { PROC_HEALTH_2 } from './health2.js'
import { PROC_HEALTH_3 } from './health3.js'
import { PROC_TECH_1 } from './tech1.js'
import { PROC_TECH_2 } from './tech2.js'
import { PROC_TECH_3 } from './tech3.js'
import { PROC_INDUSTRY_1 } from './industry1.js'
import { PROC_INDUSTRY_2 } from './industry2.js'
import { PROC_INDUSTRY_3 } from './industry3.js'
import { PROC_ENERGY_1 } from './energy1.js'
import { PROC_ENERGY_2 } from './energy2.js'
import { PROC_ENERGY_3 } from './energy3.js'
export const ALL_PROCUREMENT = [PROC_FOOD_1, PROC_FOOD_2, PROC_FOOD_3, PROC_RETAIL_1, PROC_RETAIL_2, PROC_RETAIL_3, PROC_SERVICE_1, PROC_SERVICE_2, PROC_SERVICE_3, PROC_EDU_1, PROC_EDU_2, PROC_EDU_3, PROC_HEALTH_1, PROC_HEALTH_2, PROC_HEALTH_3, PROC_TECH_1, PROC_TECH_2, PROC_TECH_3, PROC_INDUSTRY_1, PROC_INDUSTRY_2, PROC_INDUSTRY_3, PROC_ENERGY_1, PROC_ENERGY_2, PROC_ENERGY_3].flat()
export function itemsForCat(cat) { return ALL_PROCUREMENT.filter((i) => i.cat === cat) }
export function procItemById(id) { return ALL_PROCUREMENT.find((i) => i.id === id) }
// Kisi business ke liye default (deterministic) item — manager aur panel dono yahi se uthate hain
export function defaultItemFor(bizId, cat) {
  const pool = itemsForCat(cat); if (!pool.length) return null
  let h = 0; for (const ch of bizId) h = (h * 31 + ch.charCodeAt(0)) % 9973
  return pool[h % pool.length]
}
export function slabOff(seller, qty) { let off = 0; for (const s of seller.slabs || []) if (qty >= s.qty) off = Math.max(off, s.off); return off }
export function effectiveUnitPrice(seller, qty) { return seller.unitPrice * (1 - slabOff(seller, qty)) }
export const QUALITY_SCORE = { Local: 1, Economy: 2, Premium: 3, Branded: 4 }
