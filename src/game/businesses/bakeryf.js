// Bakery Factory — Industry business ki apni file: numbers, kahani, maal, upgrades sab yahi
export default {
  id: 'bakeryf',
  name: 'Bakery Factory',
  icon: '',
  cat: 'Industry',
  cost: 600000,
  rev: 68000,
  cogs: 0.5,
  staff: 10,
  wage: 450,
  rent: 5000,
  util: 2500,
  tagline: 'Bun-biscuit, har dukaan tak',
  desc: 'Khud ki dukaan nahi — sau dukaanon ko supply. Order pakka, payment weekly, growth steady.',
  customerType: 'Kirana dukaanen, canteens',
  riskLevel: 'Medium',
  licence: 'Bakery Factory trade licence + Industry registration',
  supplierItems: [
    'Maida, cheeni, tel (bulk)',
    'Packaging',
    'Gas & oven fuel',
  ],
  upgradePerks: [
    'Level badha — zyada capacity, zyada bikri',
    'Whole-city supply route — orders x2',
    'Premium look — rating tez upar jaati hai',
  ],
  tips: [
    'Price 1.00x ke aas-paas rakho — zyada price par demand tez girti hai.',
    'Stock 20% se neeche jane se pehle restock — khaali dukaan = aadhi bikri.',
  ],
}
