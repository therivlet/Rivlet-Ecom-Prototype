import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { join } from 'path'

const out = join(process.cwd(), '.mobile-qa')
mkdirSync(out, { recursive: true })

const pages = [
  { name: 'home', path: '/' },
  { name: 'shop', path: '/shop/' },
  { name: 'product', path: '/product/?id=RVL-LEG-001' },
  { name: 'account', path: '/account/' },
  { name: 'sets', path: '/sets/' },
  { name: 'checkout', path: '/checkout/' },
]

const viewports = [
  { name: 'iphone', width: 390, height: 844 },
  { name: 'small', width: 360, height: 740 },
]

const browser = await chromium.launch()
for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  for (const p of pages) {
    await page.goto(`http://127.0.0.1:5173${p.path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    await page.screenshot({
      path: join(out, `${vp.name}-${p.name}.png`),
      fullPage: false,
    })
  }
  // home with menu open
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.click('[data-menu-toggle]')
  await page.waitForTimeout(350)
  await page.screenshot({ path: join(out, `${vp.name}-menu.png`), fullPage: false })
  // search open
  await page.click('[data-menu-close], [data-menu-toggle]')
  await page.waitForTimeout(200)
  await page.click('[data-search-open]')
  await page.waitForTimeout(350)
  await page.screenshot({ path: join(out, `${vp.name}-search.png`), fullPage: false })
  await context.close()
}
await browser.close()
console.log('Mobile QA screenshots written to .mobile-qa')
