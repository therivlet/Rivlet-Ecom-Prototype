import {
  COLORS,
  COORD_SETS,
  REVIEWS,
  coordSetPrice,
  formatPrice,
  getCoordImages,
  getProduct,
  getProductImage,
  type Colorway,
  type Product,
  type Size,
} from '../data/products'
import { sizeGuideTabForCategory } from '../data/sizeGuide'
import { assetHref, lookHref, productHref } from './shell'
import { openSizeGuide } from './sizeGuide'

export function reviewSummaryHTML(): string {
  const count = REVIEWS.length
  const avg = count ? REVIEWS.reduce((s, r) => s + r.stars, 0) / count : 5
  const rounded = Math.round(avg * 10) / 10
  const full = Math.round(avg)
  const stars = '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full))
  return `
    <a class="pdp-reviews" href="#reviews">
      <span class="pdp-reviews__stars" aria-hidden="true">${stars}</span>
      <span class="pdp-reviews__meta">${rounded.toFixed(1)} · ${count} reviews</span>
    </a>`
}

export function benefitBulletsHTML(product: Product): string {
  const outcome = product.problems[0]?.solution?.split(/[.!]/)[0]?.trim()
  const bullets = [product.benefitChip, outcome, product.heroFeature]
    .filter((b, i, arr): b is string => Boolean(b) && arr.indexOf(b) === i)
    .slice(0, 3)
  return `
    <ul class="pdp-benefits">
      ${bullets.map((b) => `<li>${b}</li>`).join('')}
    </ul>`
}

export function colourThumbsHTML(product: Product, color: Colorway): string {
  return `
    <div>
      <p class="eyebrow pdp-buy__label">Colour · ${COLORS[color].name}</p>
      <div class="color-thumbs" role="list">
        ${product.colors
          .map((c) => {
            const photo = getProductImage(product, c.id)
            return `
            <button
              type="button"
              class="color-thumb ${c.id === color ? 'is-selected' : ''}"
              data-color="${c.id}"
              aria-label="${c.name}"
              aria-pressed="${c.id === color}"
              title="${c.name}"
            >
              ${
                photo
                  ? `<img src="${assetHref(photo)}" alt="" width="96" height="120" loading="lazy" decoding="async" />`
                  : `<span class="color-thumb__fallback" style="background:${c.hex}"></span>`
              }
            </button>`
          })
          .join('')}
      </div>
    </div>`
}

export function lookColourThumbsHTML(
  setId: string,
  color: Colorway,
  getImages: (c: Colorway) => [string, string],
): string {
  void setId
  return `
    <div>
      <p class="eyebrow pdp-buy__label">Colour · ${COLORS[color].name}</p>
      <div class="color-thumbs" role="list">
        ${(['midnight', 'cardamom'] as Colorway[])
          .map((c) => {
            const [front] = getImages(c)
            return `
            <button
              type="button"
              class="color-thumb ${c === color ? 'is-selected' : ''}"
              data-color="${c}"
              aria-label="${COLORS[c].name}"
              aria-pressed="${c === color}"
              title="${COLORS[c].name}"
            >
              <img src="${assetHref(front)}" alt="" width="96" height="120" loading="lazy" decoding="async" />
            </button>`
          })
          .join('')}
      </div>
    </div>`
}

export function sizeBlockHTML(opts: {
  sizes: Size[]
  selected: Size | null
  cupInclusive?: boolean
  bothPieces?: boolean
  fitNote: string
  guideTab: ReturnType<typeof sizeGuideTabForCategory> | 'tops' | 'bottoms' | 'bra'
}): string {
  const label = opts.bothPieces
    ? 'Size · both pieces'
    : `Select size${opts.cupInclusive ? ' · cup-inclusive' : ''}`
  return `
    <div>
      <div class="pdp-size-head">
        <p class="eyebrow pdp-buy__label">${label}</p>
        <button type="button" class="pdp-size-guide" data-size-guide-open data-sg-initial="${opts.guideTab}">
          Size guide
        </button>
      </div>
      <div class="size-grid">
        ${opts.sizes
          .map(
            (s) =>
              `<button type="button" class="${opts.selected === s ? 'is-selected' : ''}" data-size="${s}" aria-pressed="${opts.selected === s}">${s}</button>`,
          )
          .join('')}
      </div>
      <p class="fit-note">${opts.fitNote}</p>
    </div>`
}

export function trustRowHTML(lines: [string, string][]): string {
  return `
    <ul class="pdp-trust">
      ${lines
        .map(
          ([title, detail]) => `
        <li>
          <strong>${title}</strong>
          <span>${detail}</span>
        </li>`,
        )
        .join('')}
    </ul>`
}

function colourDotsHTML(active: Colorway = 'midnight', lookMode = false): string {
  return `
    <div class="color-dots" aria-label="Colours">
      ${(['midnight', 'cardamom'] as Colorway[])
        .map(
          (c) => `
        <button
          type="button"
          class="color-dot ${c === active ? 'is-active' : ''}"
          ${lookMode ? `data-look-color="${c}"` : `data-card-color data-card-color-id="${c}"`}
          style="background:${COLORS[c].hex}"
          title="${COLORS[c].name}"
          aria-label="${COLORS[c].name}"
        ></button>`,
        )
        .join('')}
    </div>`
}

export function getTheLookHTML(product: Product): string {
  const looks = COORD_SETS.filter((s) => s.topId === product.id || s.bottomId === product.id).slice(0, 2)
  if (!looks.length) {
    const mates = (product.setWith ?? [])
      .map((id) => getProduct(id))
      .filter(Boolean)
      .slice(0, 2) as Product[]
    if (!mates.length) return ''
    return `
      <div class="pdp-get-look">
        <div class="pdp-get-look__head">
          <p class="eyebrow">Complete the set</p>
          <span>${mates.length} piece${mates.length > 1 ? 's' : ''}</span>
        </div>
        <div class="pdp-get-look__row">
          ${mates
            .map((p) => {
              const color: Colorway = 'midnight'
              const photo = getProductImage(p, color)
              return `
              <article class="pdp-get-look__item" data-product-card="${p.id}">
                <a class="pdp-get-look__media" href="${productHref(p.id)}" aria-label="View ${p.name}">
                  ${photo ? `<img src="${assetHref(photo)}" alt="" width="480" height="720" loading="lazy" decoding="async" />` : ''}
                </a>
                <div class="pdp-get-look__body">
                  <a class="pdp-get-look__name" href="${productHref(p.id)}">${p.shortName}</a>
                  <div class="pdp-get-look__meta">
                    <span class="pdp-get-look__price">${formatPrice(p.mrp)}</span>
                    ${colourDotsHTML(color, false)}
                  </div>
                  <button class="btn btn--primary btn--block pdp-get-look__cta" type="button" data-quick-add="${p.id}">
                    Quick add
                  </button>
                </div>
              </article>`
            })
            .join('')}
        </div>
      </div>`
  }

  return `
    <div class="pdp-get-look">
      <div class="pdp-get-look__head">
        <p class="eyebrow">Get the look</p>
        <span>${looks.length} look${looks.length > 1 ? 's' : ''}</span>
      </div>
      <div class="pdp-get-look__row">
        ${looks
          .map((s) => {
            const color: Colorway = 'midnight'
            const [front] = getCoordImages(s, color)
            const total = coordSetPrice(s)
            return `
            <article class="pdp-get-look__item" data-look-card="${s.id}" data-look-top="${s.topId}">
              <a class="pdp-get-look__media" href="${lookHref(s.slug)}" aria-label="Shop ${s.name} look">
                <img src="${assetHref(front)}" alt="" width="480" height="720" loading="lazy" decoding="async" />
              </a>
              <div class="pdp-get-look__body">
                <a class="pdp-get-look__name" href="${lookHref(s.slug)}">${s.name}</a>
                <div class="pdp-get-look__meta">
                  <span class="pdp-get-look__price">${formatPrice(total)}</span>
                  ${colourDotsHTML(color, true)}
                </div>
                <button class="btn btn--primary btn--block pdp-get-look__cta" type="button" data-quick-add-look="${s.id}">
                  Quick add
                </button>
              </div>
            </article>`
          })
          .join('')}
      </div>
    </div>`
}

export function stickyAtcHTML(opts: { price: string; label: string; disabled: boolean }): string {
  return `
    <div class="pdp-sticky-atc" data-sticky-atc hidden>
      <div class="pdp-sticky-atc__inner">
        <span class="pdp-sticky-atc__price">${opts.price}</span>
        <button class="btn btn--primary" type="button" data-sticky-atc-btn ${opts.disabled ? 'disabled' : ''}>
          ${opts.label}
        </button>
      </div>
    </div>`
}

export function bindSizeGuideTriggers(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('[data-size-guide-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const initial = (btn.dataset.sgInitial as 'tops' | 'bottoms' | 'bra') || 'tops'
      openSizeGuide(initial)
    })
  })
}

export function bindStickyAtc(opts: {
  root: ParentNode
  buySelector?: string
  onAdd: () => void
}): () => void {
  const bar = opts.root.querySelector<HTMLElement>('[data-sticky-atc]')
  const buy = opts.root.querySelector<HTMLElement>(opts.buySelector ?? '.pdp-buy')
  if (!bar || !buy) return () => undefined

  const sync = () => {
    const mobile = window.matchMedia('(max-width: 899px)').matches
    if (!mobile) {
      bar.hidden = true
      return
    }
    const rect = buy.getBoundingClientRect()
    const out = rect.bottom < 80 || rect.top > window.innerHeight - 40
    bar.hidden = !out
  }

  const onStickyClick = () => opts.onAdd()
  bar.querySelector('[data-sticky-atc-btn]')?.addEventListener('click', onStickyClick)
  window.addEventListener('scroll', sync, { passive: true })
  window.addEventListener('resize', sync)
  sync()

  return () => {
    window.removeEventListener('scroll', sync)
    window.removeEventListener('resize', sync)
  }
}

export function atcLabel(ready: boolean, readyText: string): string {
  return ready ? readyText : 'Select a size'
}

export { sizeGuideTabForCategory }
