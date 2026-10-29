// Pass 3.5 QA harness — local dist ko serve karke headless screenshots + console-error + overflow checks.
// Usage: node scripts/qa35.mjs [outDir] [lang1,lang2...]  (default: docs/shots35, en)
import { createServer } from 'node:http'
import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { extname, join } from 'node:path'
import puppeteer from 'puppeteer-core'

const OUT = process.argv[2] || 'docs/shots36'
const LANGS = (process.argv[3] || 'en').split(',')
mkdirSync(OUT, { recursive: true })
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' }
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]).replace(/^\/sayonara-empire\//, '')
  if (p === '' || p === 'sayonara-empire') p = 'index.html'
  const f = join('dist', p)
  if (!existsSync(f)) { res.writeHead(404); res.end('nf'); return }
  res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' })
  res.end(readFileSync(f))
})
await new Promise((r) => server.listen(0, r))
const PORT = server.address().port
const BASE = `http://localhost:${PORT}/sayonara-empire/`

const exe = process.env.HOME + '/.cache/puppeteer/chrome-headless-shell'
import { readdirSync } from 'node:fs'
function findChrome() {
  const root = process.env.HOME + '/.cache/puppeteer'
  for (const d of readdirSync(root)) {
    const sub = join(root, d)
    for (const v of readdirSync(sub)) {
      const p = join(sub, v, 'chrome-headless-shell-linux64', 'chrome-headless-shell')
      if (existsSync(p)) return p
      const p2 = join(sub, v, 'chrome-linux64', 'chrome')
      if (existsSync(p2)) return p2
    }
  }
  throw new Error('chrome not found')
}
const browser = await puppeteer.launch({ executablePath: process.env.HOME + '/.cache/puppeteer/chrome-headless-shell/linux-156.0.8078.47/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-crashpad', '--disable-breakpad', '--user-data-dir=/tmp/chr36qa'] })
const TABS = ['home', 'biz', 'hq', 'stats', 'market', 'prop', 'wealth', 'bank', 'more']
let fail = 0
for (const lang of LANGS) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)) })
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 200)))
  await page.evaluateOnNewDocument((l) => {
    try {
      const seed = { settings: { lang: l }, day: 5, cash: 75000 }
      localStorage.setItem('sayonara_empire_vite_v1', JSON.stringify(seed))
      localStorage.setItem('se_install_closed', '1')
    } catch {}
  }, lang)
  for (const tab of TABS) {
    try {
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
      await page.goto(BASE + '?tab=' + tab, { waitUntil: 'load', timeout: 45000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 1700))
      const overflow = await page.evaluate(() => {
        const de = document.documentElement
        const bad = []
        if (de.scrollWidth > window.innerWidth + 1) bad.push('doc:' + de.scrollWidth)
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.width && (r.right > window.innerWidth + 2 || r.left < -2) && el.children.length === 0) bad.push(el.className.toString().slice(0, 30) + ':' + Math.round(r.right))
        })
        return bad.slice(0, 5)
      })
      await page.screenshot({ path: `${OUT}/${lang}-${tab}.png`, timeout: 20000 })
      if (overflow.length) { fail++; console.log(`OVERFLOW ${lang}/${tab}:`, overflow.join(' | ')) }
    } catch (e) { fail++; console.log(`TAB FAIL ${lang}/${tab}:`, String(e).slice(0, 120)) }
  }
  // desktop frame shot (home)
  try {
    await page.setViewport({ width: 1280, height: 900 })
    await page.goto(BASE + '?tab=home', { waitUntil: 'load', timeout: 45000 }).catch(() => {})
    await new Promise((r) => setTimeout(r, 1500))
    await page.screenshot({ path: `${OUT}/${lang}-desktop.png`, timeout: 20000 })
  } catch (e) { fail++; console.log(`DESKTOP FAIL ${lang}:`, String(e).slice(0, 120)) }
  if (errors.length) { fail++; console.log(`CONSOLE ERRORS ${lang}:`, [...new Set(errors)].slice(0, 6).join(' || ')) }
  else console.log(`OK ${lang}: no console errors`)
  await page.close()
}

// ---- Pass 3.6: evolved-business screenshots (seeded rich save) ----
try {
  const page2 = await browser.newPage()
  const errs2 = []
  page2.on('pageerror', (e) => errs2.push(String(e).slice(0, 160)))
  page2.on('console', (m) => { if (m.type() === 'error') errs2.push(m.text().slice(0, 160)) })
  await page2.evaluateOnNewDocument(() => {
    try {
      const seed = { settings: { lang: 'en' }, day: 42, cash: 900000, bank: 250000,
        biz: {
          'chai@india_delhi': { lv: 12, price: 1, stock: 82, staff: 1, profitToday: 3200, profitTotal: 148000, rating: 4.6, mktDays: 0, loc: 'india_delhi', employees: [] },
          'kirana@india_delhi': { lv: 6, price: 1.05, stock: 64, staff: 2, profitToday: 2100, profitTotal: 86000, rating: 4.3, mktDays: 1, loc: 'india_delhi', employees: [] },
          'restaurant@india_delhi': { lv: 36, price: 1.1, stock: 91, staff: 4, profitToday: 12400, profitTotal: 920000, rating: 4.9, mktDays: 0, loc: 'india_delhi', employees: [] },
        } }
      localStorage.setItem('sayonara_empire_vite_v1', JSON.stringify(seed))
      localStorage.setItem('se_install_closed', '1')
    } catch {}
  })
  await page2.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page2.goto(BASE + '?tab=biz', { waitUntil: 'load', timeout: 45000 }).catch(() => {})
  await new Promise((r) => setTimeout(r, 2200))
  await page2.screenshot({ path: OUT + '/evo-biz.png', timeout: 20000 })
  await page2.goto(BASE + '?tab=hq', { waitUntil: 'load', timeout: 45000 }).catch(() => {})
  await new Promise((r) => setTimeout(r, 2200))
  await page2.screenshot({ path: OUT + '/evo-hq.png', timeout: 20000 })
  await page2.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Lv 36')); if (b) b.click() })
  await new Promise((r) => setTimeout(r, 1600))
  await page2.evaluate(() => { const h = document.querySelector('.hq-hero'); if (h) h.scrollIntoView({ block: 'center' }) })
  await new Promise((r) => setTimeout(r, 700))
  await page2.screenshot({ path: OUT + '/evo-hq-detail.png', timeout: 20000 })
  if (errs2.length) { fail++; console.log('EVO CONSOLE ERRORS:', [...new Set(errs2)].slice(0, 5).join(' || ')) } else console.log('OK evo: no console errors')
  await page2.close()
} catch (e) { fail++; console.log('EVO FAIL:', String(e).slice(0, 160)) }
await browser.close()
server.close()
console.log(fail ? `QA FAIL (${fail})` : 'QA PASS')
process.exit(fail ? 1 : 0)
