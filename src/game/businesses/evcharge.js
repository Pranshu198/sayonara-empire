// EV Charging Station — Energy business ki apni file: numbers, kahani, maal, upgrades sab yahi
export default {
  id: 'evcharge',
  name: 'EV Charging Station',
  icon: '',
  cat: 'Energy',
  cost: 400000,
  rev: 30000,
  cogs: 0.45,
  staff: 1,
  wage: 350,
  rent: 3000,
  util: 500,
  tagline: 'Bijli becho, bhavishya banao',
  desc: 'EV badh rahi hai, charging point kam hain. Highway ke paas jagah mili to gaadiyon ki line lagegi.',
  customerType: 'EV owners',
  riskLevel: 'Medium',
  licence: 'EV Charging Station trade licence + Energy registration',
  supplierItems: [
    'Bijli (commercial rate)',
    'Charger maintenance',
    'Payment app fees',
  ],
  upgradePerks: [
    'Level badha — zyada capacity, zyada bikri',
    'Fast charger upgrade — per-hour kamaai up',
    'Premium look — rating tez upar jaati hai',
  ],
  tips: [
    'Price 1.00x ke aas-paas rakho — zyada price par demand tez girti hai.',
    'Stock 20% se neeche jane se pehle restock — khaali dukaan = aadhi bikri.',
  ],
}
