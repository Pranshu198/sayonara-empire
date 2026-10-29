// Lifestyle, daan aur city projects — paisa ghumane ke sabse izzatdaar raaste
import { LIFESTYLE } from './items.js'
import { CHARITY } from './charity.js'
import { CITY_PROJECTS } from './cityProjects.js'
export { LIFESTYLE, CHARITY, CITY_PROJECTS }
export function lifestyleById(id) { return LIFESTYLE.find((x) => x.id === id) }
export function nextLadder(ownedIds) { return LIFESTYLE.find((x) => !ownedIds.includes(x.id)) }
