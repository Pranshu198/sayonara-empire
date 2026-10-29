// CREDIT ENGINE — credit score ke hisaab se loan ki shartein
export function loanRateFor(credit) { return credit >= 750 ? 0.10 : credit >= 650 ? 0.13 : 0.17 }
export function maxLoanFor(nw) { return Math.max(50000, nw * 1.2) }
export function emiFor(amt, rate) { return Math.round(amt * (1 + rate) / 12) }
export function creditAfterEmi(credit, onTime) { return Math.max(300, Math.min(900, credit + (onTime ? 25 : -60))) }
