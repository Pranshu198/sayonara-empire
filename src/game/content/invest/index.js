// Endless invest classes — zameen se space tak, hamesha kuch kharidne ko bacha rahega
import { ASSETS as A_land_uttam } from './land_uttam.js'
import { ASSETS as A_land_dwarka } from './land_dwarka.js'
import { ASSETS as A_land_laxmi } from './land_laxmi.js'
import { ASSETS as A_land_karol } from './land_karol.js'
import { ASSETS as A_land_cp } from './land_cp.js'
import { ASSETS as A_land_gurgaon } from './land_gurgaon.js'
import { ASSETS as A_buildings } from './buildings.js'
import { ASSETS as A_fleet } from './fleet.js'
import { ASSETS as A_goldvault } from './goldvault.js'
import { ASSETS as A_farmland } from './farmland.js'
import { ASSETS as A_warehouse } from './warehouse.js'
import { ASSETS as A_mining } from './mining.js'
import { ASSETS as A_sports } from './sports.js'
import { ASSETS as A_island } from './island.js'
import { ASSETS as A_space } from './space.js'
export const INVEST_CLASSES = [{ id: "land_uttam", name: "Zameen — Uttam Nagar Plots", kind: "Land", items: A_land_uttam }, { id: "land_dwarka", name: "Zameen — Dwarka Plots", kind: "Land", items: A_land_dwarka }, { id: "land_laxmi", name: "Zameen — Laxmi Nagar Plots", kind: "Land", items: A_land_laxmi }, { id: "land_karol", name: "Zameen — Karol Bagh Plots", kind: "Land", items: A_land_karol }, { id: "land_cp", name: "Zameen — CP Ke Paas Plots", kind: "Land", items: A_land_cp }, { id: "land_gurgaon", name: "Zameen — Gurgaon Plots", kind: "Land", items: A_land_gurgaon }, { id: "buildings", name: "Buildings & Floors", kind: "Building", items: A_buildings }, { id: "fleet", name: "Vehicle Fleet (Rental)", kind: "Fleet", items: A_fleet }, { id: "goldvault", name: "Gold Vault (Sona)", kind: "Gold", items: A_goldvault }, { id: "farmland", name: "Farmland + Fasal", kind: "Farm", items: A_farmland }, { id: "warehouse", name: "Warehouse / Godown", kind: "Warehouse", items: A_warehouse }, { id: "mining", name: "Mining Leases", kind: "Mining", items: A_mining }, { id: "sports", name: "Sports Team Shares", kind: "Sports", items: A_sports }, { id: "island", name: "Island Resort (Top Tier)", kind: "Resort", items: A_island }, { id: "space", name: "Space Venture Shares", kind: "Space", items: A_space }]
export const ALL_INVEST = INVEST_CLASSES.flatMap((c) => c.items.map((i) => ({ ...i, classId: c.id, kind: c.kind })))
export function investById(id) { return ALL_INVEST.find((x) => x.id === id) }
