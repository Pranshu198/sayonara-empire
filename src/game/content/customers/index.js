// 3600 customer stories — engine inhi se roz ke reviews banata hai
import { CUSTOMERS_1 } from './customers01.js'
import { CUSTOMERS_2 } from './customers02.js'
import { pick } from '../../../utils/random.js'
export const ALL_CUSTOMERS = [CUSTOMERS_1, CUSTOMERS_2].flat() // base; parts 03+ deepLoader se stream
export function randomCustomer(cat) {
  const pool = cat ? ALL_CUSTOMERS.filter((c) => c.cat === cat) : ALL_CUSTOMERS
  return pick(pool.length ? pool : ALL_CUSTOMERS)
}
export function customersOfCat(cat) { return ALL_CUSTOMERS.filter((c) => c.cat === cat) }
