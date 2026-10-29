// Petrol Pump — Energy business ki apni file: numbers, kahani, maal, upgrades sab yahi
export default {
  id: 'petrol',
  name: 'Petrol Pump',
  icon: '⛽',
  cat: 'Energy',
  cost: 2000000,
  rev: 220000,
  cogs: 0.8,
  staff: 6,
  wage: 450,
  rent: 8000,
  util: 2000,
  tagline: 'Diesel-petrol, kabhi na rukne wali nadi',
  desc: 'Maal mehenga, margin patla — par bikri din-raat, hajaro litre. Volume hi raja hai.',
  customerType: 'Gaadi wale, truck drivers',
  riskLevel: 'Medium',
  licence: 'Petrol Pump trade licence + Energy registration',
  supplierItems: [
    'Petrol-diesel stock',
    'Pump maintenance',
    'Safety & licence',
  ],
  upgradePerks: [
    'Level badha — zyada capacity, zyada bikri',
    '24x7 highway service — raat ki bikri alag',
    'Premium look — rating tez upar jaati hai',
  ],
  tips: [
    'Price 1.00x ke aas-paas rakho — zyada price par demand tez girti hai.',
    'Stock 20% se neeche jane se pehle restock — khaali dukaan = aadhi bikri.',
  ],
}
