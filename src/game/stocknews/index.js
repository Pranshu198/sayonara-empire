// Per-stock khabar aur itihaas — Markets me har share ke neeche ghumti headline
import { NEWS_RELY } from './rely.js'
import { NEWS_TCSX } from './tcsx.js'
import { NEWS_HDBK } from './hdbk.js'
import { NEWS_ZOMT } from './zomt.js'
import { NEWS_ADNP } from './adnp.js'
import { NEWS_TATM } from './tatm.js'
import { NEWS_INFY } from './infy.js'
import { NEWS_SBIN } from './sbin.js'
import { NEWS_PAYT } from './payt.js'
export const STOCK_NEWS = [NEWS_RELY, NEWS_TCSX, NEWS_HDBK, NEWS_ZOMT, NEWS_ADNP, NEWS_TATM, NEWS_INFY, NEWS_SBIN, NEWS_PAYT].flat()
export function stockNewsOf(sym, day) { const pool = STOCK_NEWS.filter((n) => n.sym === sym); const hit = pool.length ? pool[(day * 7 + sym.length) % pool.length] : null; return hit ? hit.text : '' }
export function stockHistoryNote(sym, day) { const pool = STOCK_NEWS.filter((n) => n.sym === sym); const hit = pool.length ? pool[(day * 3 + 11) % pool.length] : null; return hit ? hit.text : '' }
