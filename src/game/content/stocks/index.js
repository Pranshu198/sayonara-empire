// Har share ki apni profile file — Markets me dikhti hai
import { PROFILE as P_RELY } from './rely.js'
import { PROFILE as P_TCSX } from './tcsx.js'
import { PROFILE as P_HDBK } from './hdbk.js'
import { PROFILE as P_ZOMT } from './zomt.js'
import { PROFILE as P_ADNP } from './adnp.js'
import { PROFILE as P_TATM } from './tatm.js'
import { PROFILE as P_INFY } from './infy.js'
import { PROFILE as P_SBIN } from './sbin.js'
import { PROFILE as P_PAYT } from './payt.js'
export const STOCK_PROFILES = [P_RELY, P_TCSX, P_HDBK, P_ZOMT, P_ADNP, P_TATM, P_INFY, P_SBIN, P_PAYT]
export function profileOf(sym) { return STOCK_PROFILES.find((p) => p.sym === sym) }
