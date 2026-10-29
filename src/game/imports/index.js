// Import System data — Atlas ke deshon se maal: landed cost = base + shipping + duty, currency asar ke saath
import { IMPORTS_AFRICA } from './africa.js'
import { IMPORTS_ASIA } from './asia.js'
import { IMPORTS_EUROPE } from './europe.js'
import { IMPORTS_EUROPE_ASIA } from './europe_asia.js'
import { IMPORTS_MIDDLE_EAST } from './middle_east.js'
import { IMPORTS_NORTH_AMERICA } from './north_america.js'
import { IMPORTS_OCEANIA } from './oceania.js'
import { IMPORTS_SOUTH_AMERICA } from './south_america.js'
export const ALL_IMPORTS = [IMPORTS_AFRICA, IMPORTS_ASIA, IMPORTS_EUROPE, IMPORTS_EUROPE_ASIA, IMPORTS_MIDDLE_EAST, IMPORTS_NORTH_AMERICA, IMPORTS_OCEANIA, IMPORTS_SOUTH_AMERICA].flat()
export function importsForCat(cat) { return ALL_IMPORTS.filter((i) => i.cat === cat) }
export function importById(id) { return ALL_IMPORTS.find((i) => i.id === id) }
export function importCountries() { return [...new Set(ALL_IMPORTS.map((i) => i.country))] }
