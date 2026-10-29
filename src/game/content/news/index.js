// 2400 headline templates — Sheher Times inhi se akhbaar banata hai
import { NEWS_1 } from './news01.js'
import { NEWS_2 } from './news02.js'
import { pick } from '../../../utils/random.js'
export const ALL_NEWS = [NEWS_1, NEWS_2].flat() // base; parts 03+ deepLoader se stream
export function headline(kind, fill) {
  const pool = kind ? ALL_NEWS.filter((n) => n.kind === kind) : ALL_NEWS
  let t = pick(pool.length ? pool : ALL_NEWS).tpl
  for (const [k, v] of Object.entries(fill || {})) t = t.split('{' + k + '}').join(v)
  return t
}
export function newsByKind(kind) { return ALL_NEWS.filter((n) => n.kind === kind) }
