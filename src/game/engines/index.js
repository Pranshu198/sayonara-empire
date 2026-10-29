// ENGINE SUITE — Sayonara Empire ke saare simulation engines, har ek apni file me
// Har engine ke inputs/outputs uski apni file ke header me likhe hain; economy engine (engine.js) inhe jodta hai:
// Demand, Price Elasticity, Procurement/Supply, Import/Logistics, Labour/HR, Automation (AI-Manager),
// Credit, Market, Property, Festival, Location/Atlas, Rival AI, Customer/Reputation, Cashflow/Treasury, Risk
export { phaseDemand, seasonBoostFor } from './demand.js'
export { priceElasticity, priceCeilingFor, ceilingPenalty, PRICE_CEILING } from './elasticity.js'
export { supplierDrift, contractCogsMult, chooseSeller, orderCost } from './supply.js'
export { fxOf, landedCost, arrivalDayFor } from './logistics.js'
export { fixedDailyCost, staffLeaveFactor, staffCapacity } from './labour.js'
export { loanRateFor, maxLoanFor, emiFor, creditAfterEmi } from './credit.js'
export { walkMarket, dividendCalc } from './market.js'
export { dailyRent, propValue } from './property.js'
export { festMultFor, festStaffLeave, majorActive, activeFestivals, upcomingFestivals, corporateOrder } from './festival.js'
export { cityOf, demandOf, cityNameOf, locFactors } from './location.js'
export { growRivals, topRival } from './rival.js'
export { ratingDrift, complaintHit } from './reputation.js'
export { wastageRateFor, complaintChance, riskLevel, WASTAGE_BY_QUALITY } from './risk.js'
export { monthEnd } from './treasury.js'
export { runManagerPhase, runManagerDay, processDeliveries } from './automation.js'
