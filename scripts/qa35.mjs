// Pass 3.5 QA harness — local dist ko serve karke headless screenshots + console-error + overflow checks.
// Usage: node scripts/qa35.mjs [outDir] [lang1,lang2...]  (default: docs/shots35, en)
import { createServer } from 'node:http'
import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { extname, join } from 'node:path'
import puppeteer from 'puppeteer-core'

const OUT = process.argv[2] || 'docs/shots35'
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
const browser = await puppeteer.launch({ executablePath: findChrome(), args: ['--no-sandbox', '--disable-dev-shm-usage'] })
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
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
    await page.goto(BASE + '?tab=' + tab, { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {})
    await new Promise((r) => setTimeout(r, 1600))
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
    await page.screenshot({ path: `${OUT}/${lang}-${tab}.png` })
    if (overflow.length) { fail++; console.log(`OVERFLOW ${lang}/${tab}:`, overflow.join(' | ')) }
  }
  // desktop frame shot (home)
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto(BASE + '?tab=home', { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {})
  await new Promise((r) => setTimeout(r, 1500))
  await page.screenshot({ path: `${OUT}/${lang}-desktop.png` })
  if (errors.length) { fail++; console.log(`CONSOLE ERRORS ${lang}:`, [...new Set(errors)].slice(0, 6).join(' || ')) }
  else console.log(`OK ${lang}: no console errors`)
  await page.close()
}
await browser.close()
server.close()
console.log(fail ? `QA FAIL (${fail})` : 'QA PASS')
process.exit(fail ? 1 : 0)
