// Solar Plant — Energy business ki apni file: numbers, kahani, maal, upgrades sab yahi
export default {
  id: 'solar',
  name: 'Solar Plant',
  icon: '🌞',
  cat: 'Energy',
  cost: 1500000,
  rev: 70000,
  cogs: 0.02,
  staff: 3,
  wage: 600,
  rent: 6000,
  util: 800,
  tagline: 'Sooraj ugta hai, meter chalta hai',
  desc: 'Ek baar lagaya, 25 saal kamaai. Sarkari subsidy aur bijli board ka pakka khareed — sabse shaant paisa.',
  customerType: 'Bijli board (government)',
  riskLevel: 'Low',
  licence: 'Solar Plant trade licence + Energy registration',
  supplierItems: [
    'Panel cleaning',
    'Inverter maintenance',
    'Insurance',
  ],
  upgradePerks: [
    'Level badha — zyada capacity, zyada bikri',
    'Subsidy expert desk — naye plant deals',
    'Premium look — rating tez upar jaati hai',
  ],
  tips: [
    'Price 1.00x ke aas-paas rakho — zyada price par demand tez girti hai.',
    'Stock 20% se neeche jane se pehle restock — khaali dukaan = aadhi bikri.',
  ],
}
