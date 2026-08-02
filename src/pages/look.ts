import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import {
  COLORS,
  COORD_SETS,
  REVIEWS,
  coordSetPrice,
  formatPrice,
  getCoordImages,
  getCoordSet,
  getProduct,
  getProductImage,
  type Colorway,
  type Size,
} from '../data/products'
import {
  addCoordSet,
  assetHref,
  initPageMotion,
  initReviewRails,
  lookCardHTML,
  mountShell,
  openCart,
  productHref,
} from '../ui/shell'
import { bindImageZoom } from '../ui/imageZoom'
import {
  atcLabel,
  bindSizeGuideTriggers,
  bindStickyAtc,
  lookColourThumbsHTML,
  reviewSummaryHTML,
  sizeBlockHTML,
  stickyAtcHTML,
  trustRowHTML,
} from '../ui/pdpBuy'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const params = new URLSearchParams(window.location.search)
const lookKey = params.get('set') || params.get('id') || COORD_SETS[0]!.slug
const look = getCoordSet(lookKey)

app.innerHTML = `<div data-page-content></div>`
mountShell(app)

const content = document.querySelector('[data-page-content]')
if (!content) throw new Error('content missing')

if (!look) {
  content.innerHTML = `
    <section class="section container">
      <h1 class="display">Look not found</h1>
      <p class="lede" style="margin:1rem 0 1.5rem">This pairing isn’t in the walk-out edit.</p>
      <a class="btn btn--primary" href="../sets/">Back to Looks</a>
    </section>`
  document.title = 'Look · Rivlet'
} else {
  const top = getProduct(look.topId)
  const bottom = getProduct(look.bottomId)

  if (!top || !bottom) {
    content.innerHTML = `
      <section class="section container">
        <h1 class="display">Look incomplete</h1>
        <p class="lede" style="margin:1rem 0 1.5rem">One of the pieces in this look is missing.</p>
        <a class="btn btn--primary" href="../sets/">Back to Looks</a>
      </section>`
    document.title = 'Look · Rivlet'
  } else {
    let color: Colorway = 'midnight'
    let size: Size | null = null
    let galleryTone = 0
    let motionReady = false
    let unbindZoom: (() => void) | null = null
    let unbindSticky: (() => void) | null = null

    const related = COORD_SETS.filter((s) => s.id !== look.id).slice(0, 3)

    function canZoom(): boolean {
      return window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches
    }

    function galleryForColor(c: Colorway): string[] {
      const [front, alt] = getCoordImages(look!, c)
      return [front, alt].filter(Boolean)
    }

    function bindGalleryInteractions(gallery: string[]): void {
      const stage = content!.querySelector<HTMLElement>('[data-zoom-stage]')
      const img = content!.querySelector<HTMLImageElement>('[data-hero-img]')
      const lens = content!.querySelector<HTMLElement>('[data-zoom-lens]')
      const pane = content!.querySelector<HTMLElement>('[data-zoom-pane]')
      const cover = content!.querySelector<HTMLElement>('.pdp-buy')
      if (!stage || !img) return

      const setTone = (index: number) => {
        if (!gallery.length) return
        const next = ((index % gallery.length) + gallery.length) % gallery.length
        if (next === galleryTone) return
        galleryTone = next
        img.src = assetHref(gallery[galleryTone])
        content!.querySelectorAll<HTMLElement>('[data-tone]').forEach((btn) => {
          btn.classList.toggle('is-active', Number(btn.dataset.tone) === galleryTone)
        })
        content!.querySelectorAll<HTMLElement>('[data-gallery-dot]').forEach((d, i) => {
          d.classList.toggle('is-active', i === galleryTone)
        })
      }

      content!.querySelectorAll<HTMLElement>('[data-tone]').forEach((btn) => {
        const i = Number(btn.dataset.tone)
        btn.addEventListener('click', () => setTone(i))
        btn.addEventListener('mouseenter', () => {
          if (canZoom() || window.matchMedia('(hover: hover)').matches) setTone(i)
        })
      })

      if (lens && pane && cover && gallery.length) {
        unbindZoom = bindImageZoom({ stage, img, lens, pane, cover, enabled: canZoom })
      }

      if (gallery.length > 1) {
        let startX = 0
        let dragging = false
        let locked: 'h' | 'v' | null = null

        stage.addEventListener(
          'pointerdown',
          (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return
            startX = e.clientX
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
            if (!locked && Math.abs(dx) > 8) locked = 'h'
          },
          { passive: true },
        )

        const endDrag = (e: PointerEvent) => {
          if (!dragging) return
          dragging = false
          const dx = e.clientX - startX
          if (locked === 'h' && Math.abs(dx) > 48) setTone(galleryTone + (dx < 0 ? 1 : -1))
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

    function addLook(): void {
      if (!size) return
      addCoordSet(color, size, look!.topId, look!.bottomId)
      openCart()
    }

    function paint() {
      unbindZoom?.()
      unbindZoom = null
      unbindSticky?.()
      unbindSticky = null

      const gallery = galleryForColor(color)
      galleryTone = gallery.length ? galleryTone % gallery.length : 0
      const activeSrc = gallery.length ? assetHref(gallery[galleryTone]) : ''
      const total = coordSetPrice(look!)
      const priceLabel = formatPrice(total)
      const cta = atcLabel(Boolean(size), 'Add look to bag')
      const topPhoto = getProductImage(top!, color)
      const bottomPhoto = getProductImage(bottom!, color)

      content!.innerHTML = `
      <div class="container pdp pdp--look">
        <div class="pdp-main">
          <div class="pdp-gallery">
            <div class="pdp-gallery__stage">
              <div class="pdp-gallery__hero pdp-gallery__hero--photo" data-zoom-stage data-hero>
                <img class="pdp-gallery__img" data-hero-img src="${activeSrc}" alt="${look!.name} in ${COLORS[color].name}" width="764" height="1024" draggable="false" />
                <div class="pdp-zoom-lens" data-zoom-lens hidden></div>
                ${
                  gallery.length > 1
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
              <div class="pdp-zoom-pane" data-zoom-pane hidden aria-hidden="true"></div>
            </div>
            <div class="pdp-gallery__thumbs" style="grid-template-columns: repeat(${gallery.length}, 1fr)">
              ${gallery
                .map(
                  (src, i) =>
                    `<button type="button" class="${galleryTone === i ? 'is-active' : ''}" data-tone="${i}" aria-label="View angle ${i + 1}"><img src="${assetHref(src)}" alt="" width="200" height="200" /></button>`,
                )
                .join('')}
            </div>
            ${gallery.length > 1 ? `<p class="pdp-gallery__hint">Hover to zoom · Swipe or drag for next view</p>` : ''}
          </div>

          <div class="pdp-story pdp-story--rail">
            <div class="story-block">
              <p class="eyebrow">In this look</p>
              <h2>${top!.shortName} + ${bottom!.shortName}</h2>
              <p class="lede">${look!.blurb} One size applies to both pieces. Graded together in ${COLORS[color].name}.</p>
              <div class="look-pieces">
                <a class="look-piece" href="${productHref(top!.id)}">
                  <span class="look-piece__media" aria-hidden="true">
                    ${topPhoto ? `<img src="${assetHref(topPhoto)}" alt="" width="240" height="300" loading="lazy" decoding="async" />` : ''}
                  </span>
                  <span class="look-piece__copy">
                    <strong>${top!.name}</strong>
                    <span>${formatPrice(top!.mrp)} · ${top!.platform}</span>
                  </span>
                </a>
                <a class="look-piece" href="${productHref(bottom!.id)}">
                  <span class="look-piece__media" aria-hidden="true">
                    ${bottomPhoto ? `<img src="${assetHref(bottomPhoto)}" alt="" width="240" height="300" loading="lazy" decoding="async" />` : ''}
                  </span>
                  <span class="look-piece__copy">
                    <strong>${bottom!.name}</strong>
                    <span>${formatPrice(bottom!.mrp)} · ${bottom!.platform}</span>
                  </span>
                </a>
              </div>
            </div>
            <div class="story-block">
              <p class="eyebrow">How it feels</p>
              <h2>Walk-out ready</h2>
              <p class="lede">${top!.feeling}</p>
              <p class="lede" style="margin-top:0.75rem">${bottom!.feeling}</p>
            </div>
            <div class="story-block">
              <p class="eyebrow">Problem → solution</p>
              <h2>What this look resolves</h2>
              <ul class="story-list">
                ${[...top!.problems.slice(0, 2), ...bottom!.problems.slice(0, 1)]
                  .map((p) => `<li><strong>${p.title}</strong><span>${p.solution}</span></li>`)
                  .join('')}
              </ul>
            </div>
            <div class="story-block">
              <p class="eyebrow">Technology</p>
              <h2>${top!.platform} · ${bottom!.platform}</h2>
              <ul class="tech-list">
                ${[...new Set([...top!.tech.slice(0, 3), ...bottom!.tech.slice(0, 2)])].map((t) => `<li>${t}</li>`).join('')}
              </ul>
            </div>
            <div class="story-block">
              <p class="eyebrow">Fit</p>
              <h2>Graded as one language</h2>
              <p class="lede">${top!.fitNotes} ${bottom!.fitNotes}</p>
            </div>
          </div>
        </div>

        <aside class="pdp-buy" data-pdp-buy>
          <p class="eyebrow">Look · ${COLORS[color].name}</p>
          <h1>${look!.name}</h1>
          ${reviewSummaryHTML()}
          <div class="pdp-buy__price-block">
            <p class="product-card__price">${priceLabel}</p>
            <p class="pdp-buy__tax">Inclusive of taxes</p>
          </div>
          <p class="look-pdp__meta">${top!.name} + ${bottom!.name}</p>
          <ul class="pdp-benefits">
            <li>${look!.blurb}</li>
            <li>Both pieces · one bag add</li>
            <li>${top!.benefitChip} · ${bottom!.benefitChip}</li>
          </ul>
          ${lookColourThumbsHTML(look!.id, color, (c) => getCoordImages(look!, c))}
          ${sizeBlockHTML({
            sizes: top!.sizes,
            selected: size,
            bothPieces: true,
            fitNote: 'One size for the full look · South-Asian block · XS–2XL',
            guideTab: 'bottoms',
          })}
          <button class="btn btn--primary btn--block" type="button" data-add-look ${size ? '' : 'disabled'}>${cta}</button>
          <a class="btn btn--ghost btn--block" href="../sets/">View all looks</a>
          ${trustRowHTML([
            ['Easy exchanges', 'Prototype preview · size help before you commit'],
            ['Delivery', 'Fulfilment timing confirmed at checkout'],
            ['Both pieces', `${top!.platform} + ${bottom!.platform}`],
          ])}
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
          <p class="eyebrow">More looks</p>
          <h2>Also walk-out ready</h2>
          <div class="product-grid" style="margin-top:1.5rem">
            ${related.map((s) => lookCardHTML(s)).join('')}
          </div>
          <p style="margin-top:1.5rem">
            <a class="btn btn--ghost" href="../sets/">Explore all looks</a>
          </p>
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
      content!.querySelector('[data-add-look]')?.addEventListener('click', addLook)

      bindSizeGuideTriggers(content!)
      unbindSticky = bindStickyAtc({ root: content!, onAdd: addLook })
      bindGalleryInteractions(gallery)
      initReviewRails(content!)

      if (!motionReady) {
        initPageMotion(content!)
        motionReady = true
      }
    }

    paint()
    document.title = `${look.name} · Rivlet`

    const url = new URL(window.location.href)
    if (url.searchParams.get('set') !== look.slug) {
      url.searchParams.set('set', look.slug)
      url.searchParams.delete('id')
      history.replaceState(null, '', url)
    }
  }
}
