import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { COLORS, COORD_SET, formatPrice, getProduct, type Colorway, type Size } from '../data/products'
import { addCoordSet, mountShell, openCart, productCardHTML, initPageMotion } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const top = getProduct(COORD_SET.topId)!
const bottom = getProduct(COORD_SET.bottomId)!
let color: Colorway = 'midnight'
let size: Size | null = null
let motionReady = false

app.innerHTML = `<div data-page-content></div>`
mountShell(app)

function render() {
  const content = document.querySelector('[data-page-content]')
  if (!content) return
  const total = top.mrp + bottom.mrp
  content.innerHTML = `
    <section class="container split-hero">
      <div class="coord-visual" aria-hidden="true">
        <div style="background:linear-gradient(160deg,#2a2118,${COLORS[color].hex})"></div>
        <div style="background:linear-gradient(160deg,color-mix(in srgb,${COLORS[color].hex} 70%,white),${COLORS[color].hex});margin-top:12%"></div>
      </div>
      <div>
        <p class="eyebrow">Sets</p>
        <h1 class="display" style="margin:0.75rem 0">${COORD_SET.name}</h1>
        <p class="lede">${COORD_SET.blurb}</p>
        <p style="margin:1.25rem 0;font-family:var(--font-mono)">${formatPrice(total)} · set</p>
        <div>
          <p class="eyebrow" style="margin-bottom:0.75rem">Colour · ${COLORS[color].name}</p>
          <div class="color-picker">
            ${top.colors
              .map(
                (c) =>
                  `<button type="button" class="${c.id === color ? 'is-selected' : ''}" data-color="${c.id}" style="background:${c.hex}" aria-label="${c.name}"></button>`,
              )
              .join('')}
          </div>
        </div>
        <div>
          <p class="eyebrow" style="margin-bottom:0.75rem">Size</p>
          <div class="size-grid">
            ${top.sizes
              .map(
                (s) =>
                  `<button type="button" class="${size === s ? 'is-selected' : ''}" data-size="${s}">${s}</button>`,
              )
              .join('')}
          </div>
        </div>
        <button class="btn btn--primary" type="button" data-add-set ${size ? '' : 'disabled'} style="margin-top:1rem">Add set to bag</button>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">In this set</p>
          <h2 class="display">Two pieces. One language.</h2>
        </div>
        <div class="product-grid">
          ${productCardHTML(top)}
          ${productCardHTML(bottom)}
        </div>
      </div>
    </section>`

  content.querySelectorAll<HTMLElement>('[data-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      color = btn.dataset.color as Colorway
      render()
    })
  })
  content.querySelectorAll<HTMLElement>('[data-size]').forEach((btn) => {
    btn.addEventListener('click', () => {
      size = btn.dataset.size as Size
      render()
    })
  })
  content.querySelector('[data-add-set]')?.addEventListener('click', () => {
    if (!size) return
    addCoordSet(color, size)
    openCart()
  })

  if (!motionReady) {
    initPageMotion(content)
    motionReady = true
  }
}

render()
document.title = 'Co-ord Set · Rivlet'
