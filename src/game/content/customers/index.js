// 3600 customer stories — engine inhi se roz ke reviews banata hai
import { CUSTOMERS_1 } from './customers01.js'
import { pick } from '../../../utils/random.js'
export const ALL_CUSTOMERS = [CUSTOMERS_1].flat() // base (Pass 3.4 diet: part 01 only); parts 02+ deepLoader se stream
export function randomCustomer(cat) {
  const pool = cat ? ALL_CUSTOMERS.filter((c) => c.cat === cat) : ALL_CUSTOMERS
  return pick(pool.length ? pool : ALL_CUSTOMERS)
}
export function customersOfCat(cat) { return ALL_CUSTOMERS.filter((c) => c.cat === cat) }
