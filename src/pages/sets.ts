import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import {
  COLORS,
  COORD_SETS,
  SITUATIONS,
  coordSetPrice,
  formatPrice,
  getCoordImages,
  getProduct,
  type Colorway,
  type CoordSet,
  type Situation,
} from '../data/products'
import { assetHref, initPageMotion, lookHref, mountShell } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const params = new URLSearchParams(window.location.search)
const deepLink = params.get('set') || params.get('id')
if (deepLink) {
  window.location.replace(`../look/?set=${encodeURIComponent(deepLink)}`)
} else {
  app.innerHTML = `<div data-page-content></div>`
  mountShell(app)

  type LookTop = 'bra' | 'tank' | 'crop' | 'tee'
  type LookBottom = 'shorts' | 'leggings'
  type LookSort = 'featured' | 'price-asc' | 'price-desc' | 'name'

  let situation = (params.get('situation') as Situation | null) || null
  let color = (params.get('color') as Colorway | null) || null
  let topFilter = (params.get('top') as LookTop | null) || null
  let bottomFilter = (params.get('bottom') as LookBottom | null) || null
  let sort = (params.get('sort') as LookSort) || 'featured'

  const colorBySet = new Map<string, Colorway>(
    COORD_SETS.map((s) => [s.id, color ?? 'midnight']),
  )

  const TOP_FILTERS: { id: LookTop | null; label: string }[] = [
    { id: null, label: 'All' },
    { id: 'bra', label: 'Bra' },
    { id: 'tank', label: 'Tank' },
    { id: 'crop', label: 'Crop' },
    { id: 'tee', label: 'Tee' },
  ]

  const BOTTOM_FILTERS: { id: LookBottom | null; label: string }[] = [
    { id: null, label: 'All' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'leggings', label: 'Leggings' },
  ]

  function lookTopKind(set: CoordSet): LookTop | null {
    const top = getProduct(set.topId)
    if (!top) return null
    if (top.category === 'bra') return 'bra'
    if (top.category === 'tee') return 'tee'
    if (top.id.includes('-C') || /crop/i.test(top.name) || /crop/i.test(top.shortName)) return 'crop'
    if (top.category === 'tops') return 'tank'
    return null
  }

  function lookBottomKind(set: CoordSet): LookBottom | null {
    const bottom = getProduct(set.bottomId)
    if (!bottom) return null
    if (bottom.category === 'shorts') return 'shorts'
    if (bottom.category === 'leggings') return 'leggings'
    return null
  }

  function lookMatchesSituation(set: CoordSet, s: Situation): boolean {
    const top = getProduct(set.topId)
    const bottom = getProduct(set.bottomId)
    return Boolean(top?.situations.includes(s) || bottom?.situations.includes(s))
  }

  function filterLooks(): CoordSet[] {
    let list = [...COORD_SETS]
    if (topFilter) list = list.filter((s) => lookTopKind(s) === topFilter)
    if (bottomFilter) list = list.filter((s) => lookBottomKind(s) === bottomFilter)
    if (situation) list = list.filter((s) => lookMatchesSituation(s, situation!))
    if (color) {
      // All looks offer both colours; colour filter sets the preferred preview.
      list.forEach((s) => colorBySet.set(s.id, color!))
    }

    if (sort === 'price-asc') {
      list.sort((a, b) => coordSetPrice(a) - coordSetPrice(b))
    } else if (sort === 'price-desc') {
      list.sort((a, b) => coordSetPrice(b) - coordSetPrice(a))
    } else if (sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }

  function activeFilterCount(): number {
    let n = 0
    if (situation) n++
    if (topFilter) n++
    if (bottomFilter) n++
    if (color) n++
    return n
  }

  function clearAll() {
    situation = null
    topFilter = null
    bottomFilter = null
    color = null
    sort = 'featured'
    COORD_SETS.forEach((s) => colorBySet.set(s.id, 'midnight'))
    syncUrl()
    render()
  }

  function syncUrl() {
    const next = new URLSearchParams()
    if (situation) next.set('situation', situation)
    if (topFilter) next.set('top', topFilter)
    if (bottomFilter) next.set('bottom', bottomFilter)
    if (color) next.set('color', color)
    if (sort !== 'featured') next.set('sort', sort)
    history.replaceState(null, '', `${window.location.pathname}${next.toString() ? `?${next}` : ''}`)
  }

  function setCardHTML(set: CoordSet): string {
    const preview = colorBySet.get(set.id) ?? 'midnight'
    const [front, alt] = getCoordImages(set, preview)
    const top = getProduct(set.topId)
    const bottom = getProduct(set.bottomId)
    const total = coordSetPrice(set)
    const href = lookHref(set.slug)

    return `
  <article class="coord-card look-card" data-coord-card="${set.id}">
    <a class="coord-card__media" href="${href}" aria-label="Shop ${set.name} look">
      <img class="coord-card__img" src="${assetHref(front)}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
      <img class="coord-card__img coord-card__img--alt" src="${assetHref(alt)}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
    </a>
    <div class="coord-card__body">
      <div class="coord-card__top">
        <h3 class="coord-card__name">
          <a class="coord-card__name-btn" href="${href}">${set.name}</a>
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
            class="color-dot ${c === preview ? 'is-active' : ''}"
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
        <a class="btn btn--primary btn--block look-card__cta" href="${href}">
          Shop this look
        </a>
      </div>
    </div>
  </article>`
  }

  function render() {
    const content = document.querySelector('[data-page-content]')
    if (!content) return

    const list = filterLooks()
    const filtersOn = activeFilterCount()

    content.innerHTML = `
    <section class="section coords-gallery plp">
      <div class="container">
        <div class="section-head plp-head">
          <p class="eyebrow">Looks</p>
          <h1 class="display">Walk-out ready</h1>
          <p class="lede plp-head__meta">
            <span class="plp-head__meta-full">${list.length} look${list.length === 1 ? '' : 's'} · Midnight &amp; Cardamom · graded as pairs</span>
            <span class="plp-head__meta-short">${list.length} look${list.length === 1 ? '' : 's'}</span>
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
              <span class="filter-group__label">Top</span>
              <div class="filters">
                ${TOP_FILTERS.map(
                  (t) =>
                    `<button type="button" class="filter-chip ${topFilter === t.id || (!topFilter && !t.id) ? 'is-active' : ''}" data-top="${t.id ?? ''}">${t.label}</button>`,
                ).join('')}
              </div>
            </div>
            <div class="filter-group">
              <span class="filter-group__label">Bottom</span>
              <div class="filters">
                ${BOTTOM_FILTERS.map(
                  (b) =>
                    `<button type="button" class="filter-chip ${bottomFilter === b.id || (!bottomFilter && !b.id) ? 'is-active' : ''}" data-bottom="${b.id ?? ''}">${b.label}</button>`,
                ).join('')}
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

        <div class="coord-grid">
          ${
            list.length
              ? list.map((s) => setCardHTML(s)).join('')
              : `<div class="plp-empty">
                  <p class="eyebrow">No matches</p>
                  <p>Try another top, bottom, or situation - or clear filters to see all eight looks.</p>
                  <button type="button" class="btn btn--primary" data-clear-all>Reset filters</button>
                </div>`
          }
        </div>
      </div>
    </section>`

    content.querySelectorAll<HTMLElement>('[data-situation]').forEach((btn) => {
      btn.addEventListener('click', () => {
        situation = (btn.dataset.situation as Situation) || null
        syncUrl()
        render()
      })
    })
    content.querySelectorAll<HTMLElement>('[data-top]').forEach((btn) => {
      btn.addEventListener('click', () => {
        topFilter = (btn.dataset.top as LookTop) || null
        syncUrl()
        render()
      })
    })
    content.querySelectorAll<HTMLElement>('[data-bottom]').forEach((btn) => {
      btn.addEventListener('click', () => {
        bottomFilter = (btn.dataset.bottom as LookBottom) || null
        syncUrl()
        render()
      })
    })
    content.querySelectorAll<HTMLElement>('[data-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        // Ignore per-card colour dots (they use data-coord-color + data-color)
        if (btn.hasAttribute('data-coord-color')) return
        color = (btn.dataset.color as Colorway) || null
        if (color) COORD_SETS.forEach((s) => colorBySet.set(s.id, color!))
        else COORD_SETS.forEach((s) => colorBySet.set(s.id, 'midnight'))
        syncUrl()
        render()
      })
    })
    content.querySelectorAll('[data-clear-all]').forEach((btn) => {
      btn.addEventListener('click', () => clearAll())
    })

    const onSort = (e: Event) => {
      sort = (e.target as HTMLSelectElement).value as LookSort
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

    content.querySelectorAll<HTMLElement>('[data-coord-color]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const id = btn.dataset.coordColor!
        const c = btn.dataset.color as Colorway
        colorBySet.set(id, c)
        const card = content.querySelector(`[data-coord-card="${id}"]`)
        if (!card) return
        const set = COORD_SETS.find((s) => s.id === id)!
        const [front, alt] = getCoordImages(set, c)
        const imgs = card.querySelectorAll<HTMLImageElement>('.coord-card__img')
        if (imgs[0]) imgs[0].src = assetHref(front)
        if (imgs[1]) imgs[1].src = assetHref(alt)
        card.querySelectorAll('[data-coord-color]').forEach((d) => d.classList.remove('is-active'))
        btn.classList.add('is-active')
      })
    })

    initPageMotion(content)
    document.title = 'Looks · Rivlet'
  }

  render()
}
