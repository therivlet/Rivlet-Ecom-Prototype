import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { COLORS, REVIEWS, formatPrice, getProduct, getProductImages, type Colorway, type Size } from '../data/products'
import {
  addToCart,
  mountShell,
  openCart,
  productCardHTML,
  products,
  initPageMotion,
  initReviewRails,
  toggleWishlist,
  isWishlisted,
  assetHref,
} from '../ui/shell'
import { bindImageZoom } from '../ui/imageZoom'
import {
  bindGalleryLightbox,
  parseMaterialHotspots,
  shortFitLabel,
} from '../ui/imageLightbox'
import {
  atcLabel,
  benefitBulletsHTML,
  bindSizeGuideTriggers,
  bindStickyAtc,
  colourThumbsHTML,
  getTheLookHTML,
  reviewSummaryHTML,
  sizeBlockHTML,
  sizeGuideTabForCategory,
  stickyAtcHTML,
  trustRowHTML,
} from '../ui/pdpBuy'

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
      <p class="lede" style="margin:1rem 0 1.5rem">This SKU isn’t in the collection.</p>
      <a class="btn btn--primary" href="../shop/">Back to shop</a>
    </section>`
} else {
  let color: Colorway = product.colors[0].id
  let size: Size | null = null
  let galleryTone = 0
  let motionReady = false
  let unbindZoom: (() => void) | null = null
  let unbindLightbox: (() => void) | null = null
  let unbindSticky: (() => void) | null = null

  const related = products
    .filter((p) => product.setWith?.includes(p.id) || (p.category === product.category && p.id !== product.id))
    .slice(0, 3)

  function swatch(hex: string, tone = 0): string {
    const shifts = [
      `linear-gradient(160deg, color-mix(in srgb, ${hex} 85%, white), ${hex} 40%, color-mix(in srgb, ${hex} 70%, black))`,
      `linear-gradient(200deg, color-mix(in srgb, ${hex} 70%, #0c1e34), ${hex})`,
      `linear-gradient(120deg, ${hex}, color-mix(in srgb, ${hex} 60%, white))`,
    ]
    return shifts[tone % shifts.length]
  }

  function canZoom(): boolean {
    return window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches
  }

  function revealProductImage(): void {
    const target = content!.querySelector<HTMLElement>('.pdp-gallery') ?? content!.querySelector<HTMLElement>('[data-hero]')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function bindGalleryInteractions(gallery: string[]): void {
    const stage = content!.querySelector<HTMLElement>('[data-zoom-stage]')
    const img = content!.querySelector<HTMLImageElement>('[data-hero-img]')
    const lens = content!.querySelector<HTMLElement>('[data-zoom-lens]')
    const pane = content!.querySelector<HTMLElement>('[data-zoom-pane]')
    const cover = content!.querySelector<HTMLElement>('.pdp-buy')
    if (!stage || !img) return

    const setTone = (index: number) => {
      if (!gallery.length) {
        galleryTone = index
        paint()
        return
      }
      const next = ((index % gallery.length) + gallery.length) % gallery.length
      if (next === galleryTone) return
      galleryTone = next
      const src = assetHref(gallery[galleryTone])
      img.src = src
      content!.querySelectorAll<HTMLElement>('[data-tone]').forEach((btn) => {
        btn.classList.toggle('is-active', Number(btn.dataset.tone) === galleryTone)
      })
      const dots = content!.querySelectorAll<HTMLElement>('[data-gallery-dot]')
      dots.forEach((d, i) => d.classList.toggle('is-active', i === galleryTone))
    }

    content!.querySelectorAll<HTMLElement>('[data-tone]').forEach((btn) => {
      const i = Number(btn.dataset.tone)
      btn.addEventListener('click', () => {
        const fromThumbs = Boolean(btn.closest('.pdp-gallery__thumbs'))
        setTone(i)
        if (fromThumbs) revealProductImage()
      })
      btn.addEventListener('mouseenter', () => {
        if (canZoom() || window.matchMedia('(hover: hover)').matches) setTone(i)
      })
    })

    if (lens && pane && cover && gallery.length) {
      unbindZoom = bindImageZoom({ stage, img, lens, pane, cover, enabled: canZoom })
    }

    if (gallery.length) {
      unbindLightbox = bindGalleryLightbox({
        stage,
        getImages: () => gallery.map((src) => assetHref(src)),
        getIndex: () => galleryTone,
        setIndex: (i) => setTone(i),
        alt: `${product!.name} in ${COLORS[color].name}`,
        fitLabel: shortFitLabel(product!.fit),
        hotspots: parseMaterialHotspots(product!.material),
      })
    }

    /* Swipe / drag to next image */
    if (gallery.length > 1) {
      let startX = 0
      let startY = 0
      let dragging = false
      let locked: 'h' | 'v' | null = null

      stage.addEventListener(
        'pointerdown',
        (e) => {
          if (e.pointerType === 'mouse' && e.button !== 0) return
          startX = e.clientX
          startY = e.clientY
          dragging = true
          locked = null
          stage.setPointerCapture?.(e.pointerId)
        },
        { passive: true },
      )

      stage.addEventListener(
        'pointermove',
        (e) => {
          if (!dragging) return
          const dx = e.clientX - startX
          const dy = e.clientY - startY
          if (!locked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
            locked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
          }
        },
        { passive: true },
      )

      const endDrag = (e: PointerEvent) => {
        if (!dragging) return
        dragging = false
        const dx = e.clientX - startX
        if (locked === 'h' && Math.abs(dx) > 48) {
          setTone(galleryTone + (dx < 0 ? 1 : -1))
        }
        locked = null
      }

      stage.addEventListener('pointerup', endDrag)
      stage.addEventListener('pointercancel', endDrag)
    }

    content!.querySelectorAll<HTMLElement>('[data-gallery-prev]').forEach((btn) => {
      btn.addEventListener('click', () => setTone(galleryTone - 1))
    })
    content!.querySelectorAll<HTMLElement>('[data-gallery-next]').forEach((btn) => {
      btn.addEventListener('click', () => setTone(galleryTone + 1))
    })
  }

  function addProduct(): void {
    if (!size) return
    addToCart(product!.id, color, size, 1)
    openCart()
  }

  function paint() {
    unbindZoom?.()
    unbindZoom = null
    unbindLightbox?.()
    unbindLightbox = null
    unbindSticky?.()
    unbindSticky = null

    const hex = COLORS[color].hex
    const gallery = getProductImages(product!, color)
    const hasPhotos = gallery.length > 0
    if (hasPhotos) galleryTone = galleryTone % gallery.length
    else galleryTone = galleryTone % 3
    const activeSrc = hasPhotos ? assetHref(gallery[galleryTone]) : ''
    const thumbCount = hasPhotos ? gallery.length : 3
    const cta = atcLabel(Boolean(size), 'Add to bag')
    const priceLabel = formatPrice(product!.mrp)

    content!.innerHTML = `
      <div class="container pdp">
        <div class="pdp-main">
          <div class="pdp-gallery">
            <div class="pdp-gallery__stage">
              <div
                class="pdp-gallery__hero ${hasPhotos ? 'pdp-gallery__hero--photo' : ''}"
                ${hasPhotos ? '' : `style="background:${swatch(hex, galleryTone)}"`}
                data-zoom-stage
                data-hero
              >
                ${
                  hasPhotos
                    ? `<img class="pdp-gallery__img" data-hero-img src="${activeSrc}" alt="${product!.name} in ${COLORS[color].name}" width="764" height="1024" draggable="false" />`
                    : ''
                }
                ${hasPhotos ? `<div class="pdp-zoom-lens" data-zoom-lens hidden></div>` : ''}
                ${
                  hasPhotos && gallery.length > 1
                    ? `
                  <div class="pdp-gallery__nav" aria-hidden="false">
                    <button type="button" class="pdp-gallery__arrow" data-gallery-prev aria-label="Previous image">‹</button>
                    <button type="button" class="pdp-gallery__arrow" data-gallery-next aria-label="Next image">›</button>
                  </div>
                  <div class="pdp-gallery__dots" role="tablist" aria-label="Image position">
                    ${gallery
                      .map(
                        (_, i) =>
                          `<button type="button" class="pdp-gallery__dot ${i === galleryTone ? 'is-active' : ''}" data-gallery-dot data-tone="${i}" aria-label="Image ${i + 1}"></button>`,
                      )
                      .join('')}
                  </div>`
                    : ''
                }
              </div>
              ${hasPhotos ? `<div class="pdp-zoom-pane" data-zoom-pane hidden aria-hidden="true"></div>` : ''}
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
            ${
              hasPhotos
                ? `<p class="pdp-gallery__hint pdp-gallery__hint--desktop">${gallery.length > 1 ? 'Click to expand · Hover to zoom · Swipe for next view' : 'Click to expand · Hover to zoom'}</p>
            <p class="pdp-gallery__hint pdp-gallery__hint--mobile">${gallery.length > 1 ? 'Tap to expand · Swipe for next view' : 'Tap to expand'}</p>`
                : ''
            }
          </div>

          <div class="pdp-story pdp-story--rail">
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
          </div>
        </div>

        <aside class="pdp-buy" data-pdp-buy>
          <p class="eyebrow">${product!.platform} · ${product!.role}</p>
          <h1>${product!.name}</h1>
          ${reviewSummaryHTML()}
          <div class="pdp-buy__price-block">
            <p class="product-card__price">${priceLabel}</p>
            <p class="pdp-buy__tax">Inclusive of taxes</p>
          </div>
          ${benefitBulletsHTML(product!)}
          ${colourThumbsHTML(product!, color)}
          ${sizeBlockHTML({
            sizes: product!.sizes,
            selected: size,
            cupInclusive: product!.cupInclusive,
            fitNote: 'Fits true to size · South-Asian block · XS–2XL',
            guideTab: sizeGuideTabForCategory(product!.category),
          })}
          <button class="btn btn--primary btn--block" type="button" data-atc ${size ? '' : 'disabled'}>${cta}</button>
          <button class="btn btn--ghost btn--block wish-pdp ${isWishlisted(product!.id, color) ? 'is-on' : ''}" type="button" data-pdp-wish>
            ${isWishlisted(product!.id, color) ? 'Saved' : 'Save for later'}
          </button>
          ${trustRowHTML([
            ['Easy exchanges', 'Prototype preview · size help before you commit'],
            ['Delivery', 'Fulfilment timing confirmed at checkout'],
            [product!.platform, 'Engineered for heat, humidity, and long days'],
          ])}
          ${getTheLookHTML(product!)}
        </aside>
      </div>

      ${stickyAtcHTML({ price: priceLabel, label: cta, disabled: !size })}

      <div class="container pdp-story pdp-story--full">
        <div class="story-block" id="reviews">
          <p class="eyebrow">Reviews</p>
          <h2>Confidence from the body</h2>
          <div class="reviews" role="list" aria-label="Customer reviews">
            ${REVIEWS.map((r) => `<blockquote class="review-card" role="listitem"><p>“${r.text}”</p><span>${r.name} · ${r.city}</span></blockquote>`).join('')}
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
        revealProductImage()
      })
    })
    content!.querySelectorAll<HTMLElement>('[data-size]').forEach((btn) => {
      btn.addEventListener('click', () => {
        size = btn.dataset.size as Size
        paint()
      })
    })
    content!.querySelector('[data-atc]')?.addEventListener('click', addProduct)
    content!.querySelector('[data-pdp-wish]')?.addEventListener('click', () => {
      toggleWishlist(product!.id, color)
      paint()
    })

    bindSizeGuideTriggers(content!)
    unbindSticky = bindStickyAtc({ root: content!, onAdd: addProduct })
    bindGalleryInteractions(gallery)
    initReviewRails(content!)

    if (!motionReady) {
      initPageMotion(content!)
      motionReady = true
    }
  }

  paint()
  document.title = `${product.name} · Rivlet`
}
