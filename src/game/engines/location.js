// LOCATION / ATLAS ENGINE — har sheher ka rent aur demand asar asal P&L me
// Business jis sheher me hai, wahi ke rent index se kiraya aur demand profile se bikri badalti hai
import { cityOf, demandOf, cityNameOf } from '../atlas/cityIndex.js'
export { cityOf, demandOf, cityNameOf }
export function locFactors(city, cat) {
  return { rentMult: city ? city.rent : 1, demandMult: demandOf(city, cat) }
}
