// Poora product catalog — 2640 products, har category ki apni file
import { PRODUCTS as P_Food } from './food.js'
import { PRODUCTS as P_Retail } from './retail.js'
import { PRODUCTS as P_Service } from './service.js'
import { PRODUCTS as P_Edu } from './edu.js'
import { PRODUCTS as P_Health } from './health.js'
import { PRODUCTS as P_Tech } from './tech.js'
import { PRODUCTS as P_Industry } from './industry.js'
import { PRODUCTS as P_Energy } from './energy.js'
export const ALL_PRODUCTS = [P_Food, P_Retail, P_Service, P_Edu, P_Health, P_Tech, P_Industry, P_Energy].flat()
export function productsOfCat(cat, n = 3) {
  const pool = ALL_PRODUCTS.filter((p) => p.cat === cat)
  return [...pool].sort((a, b) => b.pop - a.pop).slice(0, n)
}
export function topProducts(cat) { return productsOfCat(cat, 5) }
