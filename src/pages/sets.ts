import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import {
  COLORS,
  COORD_SETS,
  coordSetPrice,
  formatPrice,
  getCoordImages,
  getProduct,
  type Colorway,
  type CoordSet,
  type Size,
} from '../data/products'
import { addCoordSet, assetHref, lookProductHref, mountShell, openCart, initPageMotion } from '../ui/shell'
import { bindImageZoom } from '../ui/imageZoom'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const params = new URLSearchParams(window.location.search)
const initialSlug = params.get('set')
let activeId =
  COORD_SETS.find((s) => s.slug === initialSlug || s.id === initialSlug)?.id ?? COORD_SETS[0]!.id
const colorBySet = new Map<string, Colorway>(COORD_SETS.map((s) => [s.id, 'midnight']))
let size: Size | null = null
let heroView = 0
let motionReady = false
let unbindZoom: (() => void) | null = null

app.innerHTML = `<div data-page-content></div>`
mountShell(app)

function activeSet(): CoordSet {
  return COORD_SETS.find((s) => s.id === activeId) ?? COORD_SETS[0]!
}

function setCardHTML(set: CoordSet): string {
  const color = colorBySet.get(set.id) ?? 'midnight'
  const [front, alt] = getCoordImages(set, color)
  const top = getProduct(set.topId)
  const bottom = getProduct(set.bottomId)
  const total = coordSetPrice(set)
  const selected = set.id === activeId

  return `
  <article class="coord-card look-card ${selected ? 'is-active' : ''}" data-coord-card="${set.id}">
    <button type="button" class="coord-card__media" data-select-set="${set.id}" aria-label="Select ${set.name} look">
      <img class="coord-card__img" src="${assetHref(front)}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
      <img class="coord-card__img coord-card__img--alt" src="${assetHref(alt)}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
    </button>
    <div class="coord-card__body">
      <div class="coord-card__top">
        <h3 class="coord-card__name">
          <button type="button" class="coord-card__name-btn" data-select-set="${set.id}">${set.name}</button>
        </h3>
        <p class="coord-card__price">${formatPrice(total)}</p>
      </div>
      <p class="coord-card__blurb">${set.blurb}</p>
      <p class="coord-card__pieces">${top?.shortName ?? 'Top'} · ${bottom?.shortName ?? 'Bottom'}</p>
      <div class="coord-card__colors" aria-label="Colour for ${set.name}">
        ${(['midnight', 'cardamom'] as Colorway[])
          .map(
            (c) => `
          <button
            type="button"
            class="color-dot ${c === color ? 'is-active' : ''}"
            data-coord-color="${set.id}"
            data-color="${c}"
            style="background:${COLORS[c].hex}"
            title="${COLORS[c].name}"
            aria-label="${COLORS[c].name}"
          ></button>`,
          )
          .join('')}
      </div>
      <div class="look-card__actions">
        <button type="button" class="btn btn--primary btn--block look-card__cta" data-select-set="${set.id}">
          Shop this look
        </button>
      </div>
    </div>
  </article>`
}

function render() {
  const content = document.querySelector('[data-page-content]')
  if (!content) return

  unbindZoom?.()
  unbindZoom = null

  const set = activeSet()
  const color = colorBySet.get(set.id) ?? 'midnight'
  const [heroFront, heroAlt] = getCoordImages(set, color)
  const top = getProduct(set.topId)!
  const bottom = getProduct(set.bottomId)!
  const total = coordSetPrice(set)

  content.innerHTML = `
    <section class="section coords-hero">
      <div class="container coords-hero__grid">
        <div class="coords-hero__main">
          <div class="coords-hero__stage">
            <div class="coords-hero__media is-zoomable" data-zoom-stage>
              <img
                class="coords-hero__img"
                data-hero-img
                src="${assetHref(heroView === 0 ? heroFront : heroAlt)}"
                alt="${set.name} in ${COLORS[color].name}"
                width="1200"
                height="1600"
                draggable="false"
              />
              <div class="pdp-zoom-lens" data-zoom-lens hidden></div>
              <div class="coords-hero__nav">
                <button type="button" class="pdp-gallery__arrow" data-hero-prev aria-label="Previous view">‹</button>
                <button type="button" class="pdp-gallery__arrow" data-hero-next aria-label="Next view">›</button>
              </div>
              <div class="pdp-gallery__dots" role="tablist" aria-label="Set views">
                <button type="button" class="pdp-gallery__dot ${heroView === 0 ? 'is-active' : ''}" data-hero-view="0" aria-label="Front view"></button>
                <button type="button" class="pdp-gallery__dot ${heroView === 1 ? 'is-active' : ''}" data-hero-view="1" aria-label="Second view"></button>
              </div>
            </div>
            <div class="coords-zoom-pane" data-zoom-pane hidden aria-hidden="true"></div>
            <p class="pdp-gallery__hint">Hover to zoom · Use arrows for the second view</p>
          </div>
          <div class="coords-hero__details">
            <p class="eyebrow">In this set</p>
            <h2 class="coords-hero__pieces-title">${top.name} + ${bottom.name}</h2>
            <p class="coords-hero__details-copy">${set.blurb} One size applies to both pieces. Graded together in ${COLORS[color].name}.</p>
            <ul class="coords-hero__list">
              <li><strong>${top.shortName}</strong><span>${formatPrice(top.mrp)} · ${top.platform}</span></li>
              <li><strong>${bottom.shortName}</strong><span>${formatPrice(bottom.mrp)} · ${bottom.platform}</span></li>
            </ul>
          </div>
        </div>
        <aside class="coords-hero__copy">
          <p class="eyebrow">Looks</p>
          <h1 class="display">${set.name}</h1>
          <p class="lede">${set.blurb}</p>
          <p class="coords-hero__meta">${top.name} + ${bottom.name}</p>
          <p class="coords-hero__price">${formatPrice(total)} · look</p>
          <div>
            <p class="eyebrow" style="margin-bottom:0.75rem">Colour · ${COLORS[color].name}</p>
            <div class="color-picker">
              ${(['midnight', 'cardamom'] as Colorway[])
                .map(
                  (c) =>
                    `<button type="button" class="${c === color ? 'is-selected' : ''}" data-hero-color="${c}" style="background:${COLORS[c].hex}" aria-label="${COLORS[c].name}"></button>`,
                )
                .join('')}
            </div>
          </div>
          <div>
            <p class="eyebrow" style="margin:1.25rem 0 0.75rem">Size · both pieces</p>
            <div class="size-grid">
              ${top.sizes
                .map(
                  (s) =>
                    `<button type="button" class="${size === s ? 'is-selected' : ''}" data-size="${s}">${s}</button>`,
                )
                .join('')}
            </div>
          </div>
          <button class="btn btn--primary btn--block" type="button" data-add-set ${size ? '' : 'disabled'} style="margin-top:1.25rem">
            Add look to bag
          </button>
          <a class="btn btn--ghost btn--block look-card__cta" href="${lookProductHref(set.topId, set.slug)}" style="margin-top:0.75rem">
            Shop this look
          </a>
        </aside>
      </div>
    </section>

    <section class="section coords-gallery" id="coord-suggestions">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Walk-out ready</p>
          <h2 class="display">Eight looks. Two colours.</h2>
          <p class="lede">Tap a look to style both pieces - colour, size, and add the look to bag.</p>
        </div>
        <div class="coord-grid">
          ${COORD_SETS.map((s) => setCardHTML(s)).join('')}
        </div>
      </div>
    </section>`

  const stage = content.querySelector<HTMLElement>('[data-zoom-stage]')
  const heroImg = content.querySelector<HTMLImageElement>('[data-hero-img]')
  const lens = content.querySelector<HTMLElement>('[data-zoom-lens]')
  const pane = content.querySelector<HTMLElement>('[data-zoom-pane]')
  const cover = content.querySelector<HTMLElement>('.coords-hero__copy')
  if (stage && heroImg && lens && pane && cover) {
    unbindZoom = bindImageZoom({ stage, img: heroImg, lens, pane, cover })
  }

  const setHeroView = (view: number) => {
    heroView = view === 0 ? 0 : 1
    if (!heroImg) return
    heroImg.src = assetHref(heroView === 0 ? heroFront : heroAlt)
    content.querySelectorAll<HTMLElement>('[data-hero-view]').forEach((d) => {
      d.classList.toggle('is-active', Number(d.dataset.heroView) === heroView)
    })
  }

  content.querySelector('[data-hero-prev]')?.addEventListener('click', () => setHeroView(heroView === 0 ? 1 : 0))
  content.querySelector('[data-hero-next]')?.addEventListener('click', () => setHeroView(heroView === 0 ? 1 : 0))
  content.querySelectorAll<HTMLElement>('[data-hero-view]').forEach((btn) => {
    btn.addEventListener('click', () => setHeroView(Number(btn.dataset.heroView)))
  })

  /* Swipe hero between front / second view */
  if (stage && heroImg) {
    let startX = 0
    let dragging = false
    stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      startX = e.clientX
      dragging = true
      stage.setPointerCapture?.(e.pointerId)
    })
    stage.addEventListener('pointerup', (e) => {
      if (!dragging) return
      dragging = false
      const dx = e.clientX - startX
      if (Math.abs(dx) > 48) setHeroView(dx < 0 ? 1 : 0)
    })
  }

  content.querySelectorAll<HTMLElement>('[data-select-set]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeId = btn.dataset.selectSet!
      heroView = 0
      const url = new URL(window.location.href)
      const slug = COORD_SETS.find((s) => s.id === activeId)?.slug
      if (slug) url.searchParams.set('set', slug)
      history.replaceState(null, '', url)
      render()
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
    })
  })

  content.querySelectorAll<HTMLElement>('[data-coord-color]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const id = btn.dataset.coordColor!
      const c = btn.dataset.color as Colorway
      colorBySet.set(id, c)
      if (id === activeId) render()
      else {
        const card = content.querySelector(`[data-coord-card="${id}"]`)
        if (!card) return
        const set = COORD_SETS.find((s) => s.id === id)!
        const [front, alt] = getCoordImages(set, c)
        const imgs = card.querySelectorAll<HTMLImageElement>('.coord-card__img')
        if (imgs[0]) imgs[0].src = assetHref(front)
        if (imgs[1]) imgs[1].src = assetHref(alt)
        card.querySelectorAll('[data-coord-color]').forEach((d) => d.classList.remove('is-active'))
        btn.classList.add('is-active')
      }
    })
  })

  content.querySelectorAll<HTMLElement>('[data-hero-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      colorBySet.set(activeId, btn.dataset.heroColor as Colorway)
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
    const current = activeSet()
    addCoordSet(colorBySet.get(current.id) ?? 'midnight', size, current.topId, current.bottomId)
    openCart()
  })

  if (!motionReady) {
    initPageMotion(content)
    motionReady = true
  }
}

render()
document.title = 'Looks · Rivlet'
