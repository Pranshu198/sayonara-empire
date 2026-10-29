// 3600 customer stories — engine inhi se roz ke reviews banata hai
import { CUSTOMERS_1 } from './customers01.js'
import { CUSTOMERS_2 } from './customers02.js'
import { CUSTOMERS_3 } from './customers03.js'
import { CUSTOMERS_4 } from './customers04.js'
import { CUSTOMERS_5 } from './customers05.js'
import { CUSTOMERS_6 } from './customers06.js'
import { CUSTOMERS_7 } from './customers07.js'
import { CUSTOMERS_8 } from './customers08.js'
import { pick } from '../../../utils/random.js'
export const ALL_CUSTOMERS = [CUSTOMERS_1, CUSTOMERS_2, CUSTOMERS_3, CUSTOMERS_4, CUSTOMERS_5, CUSTOMERS_6, CUSTOMERS_7, CUSTOMERS_8].flat()
export function randomCustomer(cat) {
  const pool = cat ? ALL_CUSTOMERS.filter((c) => c.cat === cat) : ALL_CUSTOMERS
  return pick(pool.length ? pool : ALL_CUSTOMERS)
}
export function customersOfCat(cat) { return ALL_CUSTOMERS.filter((c) => c.cat === cat) }
