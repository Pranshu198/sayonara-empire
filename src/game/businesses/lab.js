// Diagnostic Lab — Health business ki apni file: numbers, kahani, maal, upgrades sab yahi
export default {
  id: 'lab',
  name: 'Diagnostic Lab',
  icon: '🔬',
  cat: 'Health',
  cost: 500000,
  rev: 42000,
  cogs: 0.35,
  staff: 6,
  wage: 600,
  rent: 4500,
  util: 1500,
  tagline: 'Report sahi, naam sahi',
  desc: 'Doctor ki sifarish hi marketing hai. Home sample collection shuru kiya to orders dugne.',
  customerType: 'Patients, doctors ke referrals',
  riskLevel: 'Medium',
  licence: 'Diagnostic Lab trade licence + Health registration',
  supplierItems: [
    'Test reagents',
    'Sample kits',
    'Report printing',
  ],
  upgradePerks: [
    'Level badha — zyada capacity, zyada bikri',
    'Home collection — area dugna cover',
    'Premium look — rating tez upar jaati hai',
  ],
  tips: [
    'Price 1.00x ke aas-paas rakho — zyada price par demand tez girti hai.',
    'Stock 20% se neeche jane se pehle restock — khaali dukaan = aadhi bikri.',
  ],
}
