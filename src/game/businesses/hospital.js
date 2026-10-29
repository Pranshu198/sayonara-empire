// Hospital — Health business ki apni file: numbers, kahani, maal, upgrades sab yahi
export default {
  id: 'hospital',
  name: 'Hospital',
  icon: '',
  cat: 'Health',
  cost: 2500000,
  rev: 260000,
  cogs: 0.4,
  staff: 25,
  wage: 800,
  rent: 20000,
  util: 8000,
  tagline: 'Sheher ka sabse bada ilaaj ghar',
  desc: 'Beds, OT, ICU — kharcha vishaal, aamdani usse bhi vishaal. Insurance panel me aate hi patients ki line nahi rukti.',
  customerType: 'Poora sheher',
  riskLevel: 'High',
  licence: 'Hospital trade licence + Health registration',
  supplierItems: [
    'Medicines bulk',
    'Surgical consumables',
    'Oxygen & utilities',
  ],
  upgradePerks: [
    'Level badha — zyada capacity, zyada bikri',
    'Insurance panel tie-up — patient flow x2',
    'Premium look — rating tez upar jaati hai',
  ],
  tips: [
    'Price 1.00x ke aas-paas rakho — zyada price par demand tez girti hai.',
    'Stock 20% se neeche jane se pehle restock — khaali dukaan = aadhi bikri.',
  ],
}
