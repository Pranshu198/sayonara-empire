// Manager rule templates — khiladi har manager ke niyam tay karta hai
export const RULE_TEMPLATES = [
  {
   "id": "rule_restock_low",
   "mgr": "purchase",
   "label": "Stock kam ho to restock",
   "desc": "Stock X% se neeche jaye to pasandeeda seller se restock karo",
   "params": [
    "thresholdPct",
    "sellerPref"
   ]
  },
  {
   "id": "rule_quality_first",
   "mgr": "purchase",
   "label": "Quality pehle",
   "desc": "Hamesha Premium/Branded seller chuno, daam dusra",
   "params": [
    "sellerPref"
   ]
  },
  {
   "id": "rule_cash_buffer",
   "mgr": "finance",
   "label": "Cash buffer rakho",
   "desc": "Cash hamesha Z se upar rakho, zyada ho to FD banao",
   "params": [
    "bufferAmt",
    "fdAbove"
   ]
  },
  {
   "id": "rule_price_margin",
   "mgr": "pricing",
   "label": "Margin target",
   "desc": "Price is prakar rakho ki margin Y% bane, demand dekh kar",
   "params": [
    "marginPct"
   ]
  },
  {
   "id": "rule_sell_profit",
   "mgr": "trading",
   "label": "Munafe par becho",
   "desc": "Stock +Y% munafe par aadha bech do",
   "params": [
    "profitPct",
    "sellFrac"
   ]
  },
  {
   "id": "rule_mkt_festival",
   "mgr": "marketing",
   "label": "Festival marketing",
   "desc": "Festival se pehle apne aap campaign chalao",
   "params": [
    "budgetPct"
   ]
  },
  {
   "id": "rule_staff_full",
   "mgr": "hr",
   "label": "Staff pura rakho",
   "desc": "Staff kam ho to bharti, zyada ho to rok",
   "params": [
    "minStaffPct"
   ]
  },
  {
   "id": "rule_expand_watch",
   "mgr": "expansion",
   "label": "Vistaar par nazar",
   "desc": "Naya sheher sasta mile to suchna do (khareed khud nahi)",
   "params": [
    "watchOnly"
   ]
  },
  {
   "id": "rule_dead_stock",
   "mgr": "inventory",
   "label": "Dead stock saaf",
   "desc": "30 din bina bike stock par discount laga do",
   "params": [
    "discountPct"
   ]
  },
  {
   "id": "rule_emi_first",
   "mgr": "finance",
   "label": "EMI pehle",
   "desc": "EMI se pehle cash alag rakho, credit score bachao",
   "params": [
    "bufferAmt"
   ]
  },
]
