import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import {
  FABRIC_PLATFORMS,
  filterProducts,
  SITUATIONS,
  type Category,
  type Colorway,
  type FabricPlatform,
  type Situation,
} from '../data/products'
import { mountShell, productCardHTML, initPageMotion } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const params = new URLSearchParams(window.location.search)
let situation = (params.get('situation') as Situation | null) || null
let color = (params.get('color') as Colorway | null) || null
let category = (params.get('category') as Category | null) || null
let platform = (params.get('platform') as FabricPlatform | null) || null
let form = (params.get('form') as 'tops' | 'bottoms' | null) || null
let q = params.get('q') || ''
let sort = (params.get('sort') as 'featured' | 'price-asc' | 'price-desc' | 'name') || 'featured'

const categories: { id: Category | null; label: string }[] = [
  { id: null, label: 'All' },
  { id: 'leggings', label: 'Leggings' },
  { id: 'bra', label: 'Bra' },
  { id: 'tops', label: 'Tops' },
  { id: 'shorts', label: 'Shorts' },
  { id: 'tee', label: 'Tee' },
]

function title(): string {
  if (q.trim()) return `Results for “${q.trim()}”`
  if (platform) return platform
  if (form === 'tops') return 'Tops'
  if (form === 'bottoms') return 'Bottoms'
  if (situation) {
    const s = SITUATIONS.find((x) => x.id === situation)
    return s ? s.label : 'Collection'
  }
  if (category) {
    const c = categories.find((x) => x.id === category)
    return c?.label ?? 'Collection'
  }
  return 'Collection'
}

function activeFilterCount(): number {
  let n = 0
  if (situation) n++
  if (platform) n++
  if (category) n++
  if (color) n++
  if (form) n++
  if (q.trim()) n++
  return n
}

function clearAll() {
  situation = null
  platform = null
  category = null
  color = null
  form = null
  q = ''
  sort = 'featured'
  syncUrl()
  render()
}

function render() {
  const list = filterProducts({ situation, color, category, platform, form, q, sort })
  const content = document.querySelector('[data-page-content]')
  if (!content) return
  const filtersOn = activeFilterCount()

  content.innerHTML = `
    <section class="section plp" style="padding-bottom:0">
      <div class="container">
        <div class="section-head plp-head">
          <p class="eyebrow">Women · Collection</p>
          <h1 class="display">${title()}</h1>
          <p class="lede plp-head__meta">
            <span class="plp-head__meta-full">${list.length} piece${list.length === 1 ? '' : 's'} · Midnight &amp; Cardamom · XS-2XL</span>
            <span class="plp-head__meta-short">${list.length} piece${list.length === 1 ? '' : 's'}</span>
          </p>
        </div>

        <div class="plp-bar">
          <div class="plp-mobile-tools">
            <button type="button" class="plp-filter-toggle" data-filter-toggle aria-expanded="false">
              Filter${filtersOn ? ` · ${filtersOn}` : ''}
            </button>
            <label class="sort-label">
              <span class="eyebrow">Sort</span>
              <select data-sort>
                <option value="featured" ${sort === 'featured' ? 'selected' : ''}>Featured</option>
                <option value="price-asc" ${sort === 'price-asc' ? 'selected' : ''}>Price · Low to high</option>
                <option value="price-desc" ${sort === 'price-desc' ? 'selected' : ''}>Price · High to low</option>
                <option value="name" ${sort === 'name' ? 'selected' : ''}>Name</option>
              </select>
            </label>
          </div>

          <div class="plp-bar__filters" data-filter-panel>
            ${
              q.trim()
                ? `<button type="button" class="filter-chip is-active" data-clear-q>“${q.trim()}” ×</button>`
                : ''
            }
            <div class="filter-group">
              <span class="filter-group__label">Situation</span>
              <div class="filters">
                <button type="button" class="filter-chip ${!situation ? 'is-active' : ''}" data-situation="">All</button>
                ${SITUATIONS.map(
                  (s) =>
                    `<button type="button" class="filter-chip ${situation === s.id ? 'is-active' : ''}" data-situation="${s.id}">${s.label}</button>`,
                ).join('')}
              </div>
            </div>
            <div class="filter-group">
              <span class="filter-group__label">Platform</span>
              <div class="filters">
                <button type="button" class="filter-chip ${!platform ? 'is-active' : ''}" data-platform="">All</button>
                ${FABRIC_PLATFORMS.map(
                  (f) =>
                    `<button type="button" class="filter-chip ${platform === f.id ? 'is-active' : ''}" data-platform="${f.id}">${f.label}</button>`,
                ).join('')}
              </div>
            </div>
            <div class="filter-group">
              <span class="filter-group__label">Category</span>
              <div class="filters">
                ${categories
                  .map(
                    (c) =>
                      `<button type="button" class="filter-chip ${category === c.id || (!category && !c.id) ? 'is-active' : ''}" data-category="${c.id ?? ''}">${c.label}</button>`,
                  )
                  .join('')}
              </div>
            </div>
            <div class="filter-group">
              <span class="filter-group__label">Colour</span>
              <div class="filters">
                <button type="button" class="filter-chip ${!color ? 'is-active' : ''}" data-color="">Both</button>
                <button type="button" class="filter-chip filter-chip--swatch ${color === 'midnight' ? 'is-active' : ''}" data-color="midnight"><span class="swatch-mini" style="background:#1A1208"></span>Midnight</button>
                <button type="button" class="filter-chip filter-chip--swatch ${color === 'cardamom' ? 'is-active' : ''}" data-color="cardamom"><span class="swatch-mini" style="background:#7A5C3A"></span>Cardamom</button>
              </div>
            </div>
            ${
              filtersOn
                ? `<button type="button" class="text-link plp-clear-mobile" data-clear-all>Clear all filters</button>`
                : ''
            }
          </div>

          <div class="plp-bar__sort plp-bar__sort--desktop">
            ${filtersOn ? `<button type="button" class="text-link" data-clear-all>Clear (${filtersOn})</button>` : ''}
            <label class="sort-label">
              <span class="eyebrow">Sort</span>
              <select data-sort-desktop>
                <option value="featured" ${sort === 'featured' ? 'selected' : ''}>Featured</option>
                <option value="price-asc" ${sort === 'price-asc' ? 'selected' : ''}>Price · Low to high</option>
                <option value="price-desc" ${sort === 'price-desc' ? 'selected' : ''}>Price · High to low</option>
                <option value="name" ${sort === 'name' ? 'selected' : ''}>Name</option>
              </select>
            </label>
          </div>
        </div>

        <div class="product-grid">
          ${
            list.length
              ? list.map((p) => productCardHTML(p)).join('')
              : `<div class="plp-empty">
                  <p class="eyebrow">No matches</p>
                  <p>Try clearing a filter or search another feeling - gym, yoga, no patch, SecondSkin.</p>
                  <button type="button" class="btn btn--primary" data-clear-all>Reset filters</button>
                </div>`
          }
        </div>

        <div class="faq">
          <p class="eyebrow" style="margin-bottom:1rem">Fit & fabric</p>
          <details>
            <summary>Will light Cardamom show through?</summary>
            <p>Opacity is density-mapped. We validate Cardamom under damp + bright-light + squat tests before any consumer claim print.</p>
          </details>
          <details>
            <summary>Is this graded for South Asian bodies?</summary>
            <p>Yes. The collection uses a South-Asian block across XS-2XL, with cup-inclusive grading on the bra and built-in-support tanks.</p>
          </details>
          <details>
            <summary>Hard water - will it pill or fade?</summary>
            <p>Yarn chemistry and colourfast finishing are specified for mineral-heavy laundering and UV. Care labels will follow lab-validated wash protocols.</p>
          </details>
        </div>
      </div>
    </section>
  `

  content.querySelectorAll<HTMLElement>('[data-situation]').forEach((btn) => {
    btn.addEventListener('click', () => {
      situation = (btn.dataset.situation as Situation) || null
      syncUrl()
      render()
    })
  })
  content.querySelectorAll<HTMLElement>('[data-platform]').forEach((btn) => {
    btn.addEventListener('click', () => {
      platform = (btn.dataset.platform as FabricPlatform) || null
      syncUrl()
      render()
    })
  })
  content.querySelectorAll<HTMLElement>('[data-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      category = (btn.dataset.category as Category) || null
      form = null
      syncUrl()
      render()
    })
  })
  content.querySelectorAll<HTMLElement>('[data-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      color = (btn.dataset.color as Colorway) || null
      syncUrl()
      render()
    })
  })
  content.querySelectorAll('[data-clear-all]').forEach((btn) => {
    btn.addEventListener('click', () => clearAll())
  })
  content.querySelector('[data-clear-q]')?.addEventListener('click', () => {
    q = ''
    syncUrl()
    render()
  })
  const onSort = (e: Event) => {
    sort = (e.target as HTMLSelectElement).value as typeof sort
    syncUrl()
    render()
  }
  content.querySelectorAll<HTMLSelectElement>('[data-sort], [data-sort-desktop]').forEach((el) => {
    el.addEventListener('change', onSort)
  })
  content.querySelector('[data-filter-toggle]')?.addEventListener('click', () => {
    const panel = content.querySelector('[data-filter-panel]')
    const btn = content.querySelector<HTMLButtonElement>('[data-filter-toggle]')
    const open = panel?.classList.toggle('is-open')
    btn?.setAttribute('aria-expanded', String(!!open))
    if (btn) btn.textContent = open ? 'Hide filters' : `Filter${filtersOn ? ` · ${filtersOn}` : ''}`
  })

  initPageMotion(content)
  document.title = `${title()} · Rivlet`
}

function syncUrl() {
  const next = new URLSearchParams()
  if (situation) next.set('situation', situation)
  if (category) next.set('category', category)
  if (platform) next.set('platform', platform)
  if (form) next.set('form', form)
  if (color) next.set('color', color)
  if (q.trim()) next.set('q', q.trim())
  if (sort !== 'featured') next.set('sort', sort)
  history.replaceState(null, '', `${window.location.pathname}${next.toString() ? `?${next}` : ''}`)
}

app.innerHTML = `<div data-page-content></div>`
mountShell(app)
render()
