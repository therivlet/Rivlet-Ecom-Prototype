import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { COLORS, REVIEWS, formatPrice, getProduct, getProductImages, type Colorway, type Size } from '../data/products'
import { addCoordSet, addToCart, mountShell, openCart, productCardHTML, products, initPageMotion, toggleWishlist, isWishlisted, assetHref } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const id = new URLSearchParams(window.location.search).get('id') || 'RVL-LEG-001'
const product = getProduct(id)

app.innerHTML = `<div data-page-content></div>`
mountShell(app)

const content = document.querySelector('[data-page-content]')
if (!content) throw new Error('content missing')

if (!product) {
  content.innerHTML = `
    <section class="section container">
      <h1 class="display">Piece not found</h1>
      <p class="lede" style="margin:1rem 0 1.5rem">This SKU isn’t in The Edit.</p>
      <a class="btn btn--primary" href="../shop/">Back to shop</a>
    </section>`
} else {
  let color: Colorway = product.colors[0].id
  let size: Size | null = null
  let galleryTone = 0

  const related = products.filter((p) => product.setWith?.includes(p.id) || (p.category === product.category && p.id !== product.id)).slice(0, 3)

  function swatch(hex: string, tone = 0): string {
    const shifts = [
      `linear-gradient(160deg, color-mix(in srgb, ${hex} 85%, white), ${hex} 40%, color-mix(in srgb, ${hex} 70%, black))`,
      `linear-gradient(200deg, color-mix(in srgb, ${hex} 70%, #0c1e34), ${hex})`,
      `linear-gradient(120deg, ${hex}, color-mix(in srgb, ${hex} 60%, white))`,
    ]
    return shifts[tone % shifts.length]
  }

  let motionReady = false

  function paint() {
    const hex = COLORS[color].hex
    const gallery = getProductImages(product!, color)
    const hasPhotos = gallery.length > 0
    const activeSrc = hasPhotos ? assetHref(gallery[galleryTone % gallery.length]) : ''
    const thumbCount = hasPhotos ? gallery.length : 3

    content!.innerHTML = `
      <div class="container pdp">
        <div class="pdp-gallery">
          <div class="pdp-gallery__hero ${hasPhotos ? 'pdp-gallery__hero--photo' : ''}" ${hasPhotos ? '' : `style="background:${swatch(hex, galleryTone)}"`} data-hero>
            ${hasPhotos ? `<img src="${activeSrc}" alt="${product!.name} in ${COLORS[color].name}" width="764" height="1024" />` : ''}
          </div>
          <div class="pdp-gallery__thumbs" style="grid-template-columns: repeat(${thumbCount}, 1fr)">
            ${Array.from({ length: thumbCount }, (_, i) => {
              if (hasPhotos) {
                const src = assetHref(gallery[i])
                return `<button type="button" class="${galleryTone === i ? 'is-active' : ''}" data-tone="${i}" aria-label="View angle ${i + 1}"><img src="${src}" alt="" width="200" height="200" /></button>`
              }
              return `<button type="button" class="${galleryTone === i ? 'is-active' : ''}" data-tone="${i}" style="background:${swatch(hex, i)}" aria-label="View angle ${i + 1}"></button>`
            }).join('')}
          </div>
        </div>
        <div class="pdp-buy">
          <p class="eyebrow">${product!.platform} · ${product!.role}</p>
          <h1>${product!.name}</h1>
          <p class="product-card__price">${formatPrice(product!.mrp)}</p>
          <p style="color:var(--color-ink-soft)">${product!.feeling}</p>
          <div>
            <p class="eyebrow" style="margin-bottom:0.75rem">Colour · ${COLORS[color].name}</p>
            <div class="color-picker">
              ${product!.colors
                .map(
                  (c) =>
                    `<button type="button" class="${c.id === color ? 'is-selected' : ''}" data-color="${c.id}" style="background:${c.hex}" aria-label="${c.name}"></button>`,
                )
                .join('')}
            </div>
          </div>
          <div>
            <p class="eyebrow" style="margin-bottom:0.75rem">Size ${product!.cupInclusive ? '· cup-inclusive' : ''}</p>
            <div class="size-grid">
              ${product!.sizes
                .map(
                  (s) =>
                    `<button type="button" class="${size === s ? 'is-selected' : ''}" data-size="${s}" aria-pressed="${size === s}">${s}</button>`,
                )
                .join('')}
            </div>
            <p class="fit-note">Fits true to size · South-Asian block · XS–2XL</p>
          </div>
          <button class="btn btn--primary btn--block" type="button" data-atc ${size ? '' : 'disabled'}>Add to bag</button>
          <button class="btn btn--ghost btn--block wish-pdp ${isWishlisted(product!.id, color) ? 'is-on' : ''}" type="button" data-pdp-wish>
            ${isWishlisted(product!.id, color) ? 'Saved' : 'Save for later'}
          </button>
          ${
            product!.id === 'RVL-TNK-003-C' || product!.id === 'RVL-SHT-004'
              ? `<button class="btn btn--ghost btn--block" type="button" data-add-set ${size ? '' : 'disabled'}>Add co-ord set</button>`
              : ''
          }
          <ul class="trust-strip">
            <li>Easy exchanges · prototype preview</li>
            <li>${product!.platform} engineered</li>
            <li>${product!.heroFeature}</li>
          </ul>
        </div>
      </div>

      <div class="container pdp-story">
        <div class="story-block">
          <p class="eyebrow">How it feels</p>
          <h2>${product!.benefitChip}</h2>
          <p class="lede">${product!.feeling}</p>
        </div>
        <div class="story-block">
          <p class="eyebrow">Problem → solution</p>
          <h2>What this piece resolves</h2>
          <ul class="story-list">
            ${product!.problems.map((p) => `<li><strong>${p.title}</strong><span>${p.solution}</span></li>`).join('')}
          </ul>
        </div>
        <div class="story-block">
          <p class="eyebrow">Technology</p>
          <h2>${product!.platform}</h2>
          <p style="color:var(--color-ink-soft);margin-bottom:1rem">${product!.material} · ${product!.gsm}</p>
          <ul class="tech-list">
            ${product!.tech.map((t) => `<li>${t}</li>`).join('')}
          </ul>
        </div>
        <div class="story-block">
          <p class="eyebrow">Fit</p>
          <h2>${product!.fit}</h2>
          <p class="lede">${product!.fitNotes}</p>
          ${product!.support ? `<p class="eyebrow" style="margin-top:1rem">Support · ${product!.support}</p>` : ''}
        </div>
        <div class="story-block">
          <p class="eyebrow">Reviews</p>
          <h2>Confidence from the body</h2>
          <div class="reviews">
            ${REVIEWS.map((r) => `<blockquote class="review-card"><p>“${r.text}”</p><span>${r.name} · ${r.city}</span></blockquote>`).join('')}
          </div>
        </div>
        <div class="story-block" style="max-width:none">
          <p class="eyebrow">Complete the set</p>
          <h2>You may also need</h2>
          <div class="product-grid" style="margin-top:1.5rem">
            ${related.map((p) => productCardHTML(p)).join('')}
          </div>
        </div>
      </div>`

    content!.querySelectorAll<HTMLElement>('[data-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        color = btn.dataset.color as Colorway
        galleryTone = 0
        paint()
      })
    })
    content!.querySelectorAll<HTMLElement>('[data-size]').forEach((btn) => {
      btn.addEventListener('click', () => {
        size = btn.dataset.size as Size
        paint()
      })
    })
    content!.querySelectorAll<HTMLElement>('[data-tone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        galleryTone = Number(btn.dataset.tone)
        paint()
      })
    })
    content!.querySelector('[data-atc]')?.addEventListener('click', () => {
      if (!size) return
      addToCart(product!.id, color, size, 1)
      openCart()
    })
    content!.querySelector('[data-add-set]')?.addEventListener('click', () => {
      if (!size) return
      addCoordSet(color, size)
      openCart()
    })
    content!.querySelector('[data-pdp-wish]')?.addEventListener('click', () => {
      toggleWishlist(product!.id, color)
      paint()
    })

    if (!motionReady) {
      initPageMotion(content!)
      motionReady = true
    }
  }

  paint()
  document.title = `${product.name} · Rivlet`
}
