// FESTIVAL ENGINE — Global Festivals calendar se P&L tak ka raasta
// Sakriya tyohar: us sheher ki matching categories ki mang badhti hai; bade tyohar par corporate order bhi
import { activeFestivals, festMultFor, festStaffLeave, majorActive, upcomingFestivals } from '../festivals/index.js'
export { festMultFor, festStaffLeave, majorActive, activeFestivals, upcomingFestivals }
// Corporate gift/hamper order: bade tyohar ke din Food/Retail maliko ko ek bada order mil sakta hai
export function corporateOrder(s, cityList, hasFoodRetail, rnd) {
  if (!hasFoodRetail || rnd() > 0.4) return null
  for (const c of cityList) { const ms = majorActive(s.day, c); if (ms.length) return { f: ms[0], city: c } }
  return null
}
