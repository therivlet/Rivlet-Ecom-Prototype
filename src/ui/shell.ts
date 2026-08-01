import {
  COLORS,
  SITUATIONS,
  formatPrice,
  getProduct,
  getProductImage,
  getProductImages,
  products,
  type Colorway,
  type Product,
  type Size,
} from '../data/products'
import {
  addCoordSet,
  addToCart,
  cartCount,
  cartSubtotal,
  getCart,
  removeLine,
  setQty,
  subscribeCart,
} from '../cart'
import { isLoggedIn, getProfile, subscribeAuth, logout } from '../auth'
import {
  getWishlist,
  isWishlisted,
  removeWishlist,
  subscribeWishlist,
  toggleWishlist,
  wishlistCount,
} from '../wishlist'
import { liveSuggestions } from '../search'
import { bootMotion, initPageMotion, initReviewRails } from '../motion'

function pathPrefix(): string {
  const parts = window.location.pathname
    .replace(/\/index\.html$/i, '/')
    .split('/')
    .filter(Boolean)
  return parts.length > 0 ? '../' : './'
}

export function assetHref(path: string): string {
  return `${pathPrefix()}${path.replace(/^\//, '')}`
}

export function productHref(id: string): string {
  return `${pathPrefix()}product/?id=${encodeURIComponent(id)}`
}

export function shopHref(params: Record<string, string> = {}): string {
  const q = new URLSearchParams(params).toString()
  return `${pathPrefix()}shop/${q ? `?${q}` : ''}`
}

export function accountHref(): string {
  return `${pathPrefix()}account/`
}

type IconName = 'bag' | 'menu' | 'close' | 'search' | 'heart' | 'heart-fill' | 'user'

function icon(name: IconName): string {
  const common = 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"'
  if (name === 'bag') {
    return `<svg ${common}><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>`
  }
  if (name === 'menu') {
    return `<svg ${common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>`
  }
  if (name === 'close') {
    return `<svg ${common}><path d="M6 6l12 12M18 6L6 18"/></svg>`
  }
  if (name === 'heart') {
    return `<svg ${common}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`
  }
  if (name === 'heart-fill') {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`
  }
  if (name === 'user') {
    return `<svg ${common}><circle cx="12" cy="8" r="3.25"/><path d="M5.5 19.5c1.6-3 4-4.5 6.5-4.5s4.9 1.5 6.5 4.5"/></svg>`
  }
  return `<svg ${common}><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></svg>`
}

function currentPath(): string {
  return window.location.pathname
}

function navCurrent(match: string): string {
  return currentPath().includes(match) ? 'aria-current="page"' : ''
}

export function renderHeader(): string {
  const situationCards = SITUATIONS.map(
    (s) => `
      <a class="mega__item" href="${shopHref({ situation: s.id })}" role="menuitem">
        <span class="mega__item-label">${s.label}</span>
        <span class="mega__item-blurb">${s.blurb}</span>
      </a>`,
  ).join('')

  const brand = pathPrefix()
  const loggedIn = isLoggedIn()
  const profile = getProfile()

  return `
  <header class="site-header" data-header>
    <div class="site-header__rail">
      <p class="site-header__whisper">
        <img class="site-header__whisper-mark" src="${brand}brand/rivlet-mark.png" alt="" width="16" height="16" />
        Move like water, feel like air
      </p>
    </div>
    <div class="site-header__bar">
      <div class="site-header__inner">
        <button class="icon-btn menu-toggle" type="button" data-menu-toggle aria-label="Open menu" aria-expanded="false">${icon('menu')}</button>

        <div class="site-header__cluster">
          <a class="site-logo" href="${brand}" aria-label="Rivlet home">
            <img class="site-logo__lockup" src="${brand}brand/rivlet-lockup.png" alt="Rivlet" width="800" height="165" />
          </a>

          <nav class="site-nav" aria-label="Primary">
            <div class="site-nav__shop">
              <a class="site-nav__link" href="${shopHref()}" data-mega-trigger>
                Shop
                <span class="site-nav__chevron" aria-hidden="true"></span>
              </a>
              <div class="mega" role="menu" aria-label="Shop menu">
                <div class="mega__inner">
                  <div class="mega__col">
                    <p class="mega__eyebrow">What are you shopping for?</p>
                    <div class="mega__grid">
                      ${situationCards}
                    </div>
                  </div>
                  <div class="mega__aside">
                    <a class="mega__feature" href="${shopHref()}">
                      <span class="mega__eyebrow">Featured</span>
                      <strong>Full collection</strong>
                      <span>Six engineered pieces · Midnight &amp; Cardamom</span>
                    </a>
                    <a class="mega__feature mega__feature--soft" href="${brand}sets/">
                      <span class="mega__eyebrow">Sets</span>
                      <strong>Co-ord edit</strong>
                      <span>Eight pairings. Midnight &amp; Cardamom.</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <a class="site-nav__link" href="${shopHref()}" ${navCurrent('/shop')}>Collection</a>
            <a class="site-nav__link" href="${brand}sets/" ${navCurrent('/sets')}>Sets</a>
            <a class="site-nav__link" href="${brand}stories/" ${navCurrent('/stories')}>Stories</a>
          </nav>
        </div>

        <div class="header-actions">
          <button class="icon-btn" type="button" data-search-open aria-label="Search">${icon('search')}</button>
          <div class="account-menu account-menu--desktop" data-account-menu>
            <button
              class="icon-btn account-menu__trigger"
              type="button"
              data-account-trigger
              aria-expanded="false"
              aria-haspopup="true"
              aria-label="Account menu"
            >
              ${icon('user')}
              ${loggedIn ? `<span class="account-dot" title="${profile.name}"></span>` : ''}
            </button>
            <div class="account-menu__panel" role="menu" data-account-panel>
              ${
                loggedIn
                  ? `
                <div class="account-menu__hello">
                  <span class="eyebrow">Signed in</span>
                  <strong>${profile.name || 'Member'}</strong>
                  <span>${profile.email}</span>
                </div>
                <a class="account-menu__item" role="menuitem" href="${accountHref()}">Profile</a>
                <a class="account-menu__item" role="menuitem" href="${accountHref()}#details">Account details</a>
                <button type="button" class="account-menu__item" role="menuitem" data-wish-open>Saved</button>
                <a class="account-menu__item" role="menuitem" href="${pathPrefix()}checkout/">Orders &amp; bag</a>
                <button type="button" class="account-menu__item account-menu__item--muted" role="menuitem" data-logout>Sign out</button>
              `
                  : `
                <div class="account-menu__hello">
                  <span class="eyebrow">Account</span>
                  <strong>Welcome</strong>
                  <span>Sign in to keep your Rivlet with you.</span>
                </div>
                <a class="account-menu__item" role="menuitem" href="${accountHref()}">Sign in</a>
                <a class="account-menu__item" role="menuitem" href="${accountHref()}">Create account</a>
                <button type="button" class="account-menu__item" role="menuitem" data-wish-open>Saved</button>
                <a class="account-menu__item account-menu__item--muted" role="menuitem" href="${accountHref()}">Guest checkout tips</a>
              `
              }
            </div>
          </div>
          <button class="icon-btn" type="button" data-wish-open aria-label="Saved pieces">
            ${icon('heart')}
            <span class="cart-count wish-count" data-wish-count hidden>0</span>
          </button>
          <button class="icon-btn" type="button" data-cart-open aria-label="Open bag">
            ${icon('bag')}
            <span class="cart-count" data-cart-count hidden>0</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  <div class="mobile-nav" data-mobile-nav aria-hidden="true">
    <p class="mobile-nav__motto">Move like water, feel like air.</p>
    <nav class="mobile-nav__links" aria-label="Mobile">
      <a href="${shopHref()}">Collection</a>
      <a href="${brand}sets/">Sets</a>
      <a href="${brand}stories/">Stories</a>
    </nav>
    <div class="mobile-nav__account">
      <p class="eyebrow">Account</p>
      ${
        loggedIn
          ? `
        <a href="${accountHref()}">Profile</a>
        <a href="${accountHref()}#details">Account details</a>
        <button type="button" data-wish-open>Saved</button>
        <button type="button" data-logout>Sign out</button>
      `
          : `
        <a href="${accountHref()}">Sign in</a>
        <a href="${accountHref()}">Create account</a>
        <button type="button" data-wish-open>Saved</button>
      `
      }
    </div>
    <div class="mobile-nav__situations">
      <p class="eyebrow">Shop by situation</p>
      ${SITUATIONS.map((s) => `<a href="${shopHref({ situation: s.id })}"><span>${s.label}</span><em>${s.blurb}</em></a>`).join('')}
    </div>
  </div>`
}

export function renderFooter(): string {
  const brand = pathPrefix()
  return `
  <footer class="site-footer">
    <div class="container site-footer__top">
      <div class="site-footer__brand-block">
        <div class="site-footer__lockup">
          <img class="site-footer__lockup-img" src="${brand}brand/rivlet-lockup.png" alt="Rivlet" width="800" height="165" />
        </div>
        <p class="site-footer__motto">Move like water, feel like air.</p>
        <p class="site-footer__lede">Premium Indian-crafted activewear engineered for heat, humidity, and real days - without compromise.</p>
      </div>
      <div class="site-footer__columns">
        <div>
          <h3>Shop</h3>
          <ul>
            <li><a href="${shopHref()}">Collection</a></li>
            <li><a href="${brand}sets/">Co-ord sets</a></li>
            <li><a href="${shopHref({ form: 'tops' })}">Tops</a></li>
            <li><a href="${shopHref({ form: 'bottoms' })}">Bottoms</a></li>
          </ul>
        </div>
        <div>
          <h3>Situations</h3>
          <ul>
            <li><a href="${shopHref({ situation: 'gym' })}">Gym</a></li>
            <li><a href="${shopHref({ situation: 'yoga' })}">Yoga</a></li>
            <li><a href="${shopHref({ situation: 'office' })}">Office</a></li>
            <li><a href="${shopHref({ situation: 'travel' })}">Travel</a></li>
          </ul>
        </div>
        <div>
          <h3>Brand</h3>
          <ul>
            <li><a href="${brand}stories/">Stories</a></li>
            <li><a href="${brand}account/">Account</a></li>
            <li><a href="https://therivlet.com" target="_blank" rel="noreferrer">therivlet.com</a></li>
            <li><a href="mailto:hello@therivlet.com">hello@therivlet.com</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container site-footer__bottom">
      <span>© ${new Date().getFullYear()} Rivlet</span>
      <span class="site-footer__route">India → UK → UAE</span>
      <span>Prototype experience</span>
    </div>
  </footer>`
}

export function renderCartChrome(): string {
  return `
  <div class="cart-overlay" data-cart-overlay></div>
  <aside class="cart-drawer" data-cart-drawer aria-hidden="true" aria-label="Bag">
    <div class="cart-drawer__head">
      <h2>Your bag</h2>
      <button type="button" class="icon-btn" data-cart-close aria-label="Close bag">${icon('close')}</button>
    </div>
    <div class="cart-drawer__body" data-cart-body></div>
    <div class="cart-drawer__foot" data-cart-foot></div>
  </aside>

  <div class="cart-overlay" data-wish-overlay></div>
  <aside class="cart-drawer wish-drawer" data-wish-drawer aria-hidden="true" aria-label="Saved">
    <div class="cart-drawer__head">
      <div>
        <p class="eyebrow" style="margin-bottom:0.25rem">Saved</p>
        <h2>Your list</h2>
      </div>
      <button type="button" class="icon-btn" data-wish-close aria-label="Close saved">${icon('close')}</button>
    </div>
    <div class="cart-drawer__body" data-wish-body></div>
    <div class="cart-drawer__foot" data-wish-foot></div>
  </aside>

  <div class="search-overlay" data-search-overlay aria-hidden="true">
    <div class="search-panel" role="dialog" aria-label="Search">
      <div class="search-panel__bar">
        <span class="search-panel__icon" aria-hidden="true">${icon('search')}</span>
        <input class="search-panel__input" type="search" data-search-input placeholder="Search collection." autocomplete="off" />
        <button type="button" class="icon-btn" data-search-close aria-label="Close search">${icon('close')}</button>
      </div>
      <div class="search-panel__meta">
        <p class="eyebrow" data-search-label>Suggested</p>
        <a class="search-panel__all" href="${shopHref()}" data-search-all>View Collection</a>
      </div>
      <div class="search-panel__results" data-search-results></div>
    </div>
  </div>

  <div class="sheet-overlay" data-sheet-overlay></div>
  <div class="sheet" data-sheet aria-hidden="true"></div>`
}

function swatchStyle(hex: string): string {
  return `background:
    linear-gradient(160deg, color-mix(in srgb, ${hex} 88%, white), ${hex} 45%, color-mix(in srgb, ${hex} 75%, black)),
    ${hex};`
}

function mediaPanelHTML(product: Product, color: Colorway): string {
  const images = getProductImages(product, color)
  if (images.length) {
    const primary = images[0]!
    const alt = images[1]
    return `
      <div class="swatch-panel swatch-panel--photo" data-card-swatch data-has-photo="true">
        <img class="swatch-panel__img" src="${assetHref(primary)}" alt="" width="600" height="800" loading="lazy" decoding="async" />
      </div>
      ${
        alt
          ? `<div class="swatch-panel swatch-panel--photo swatch-panel--alt" data-alt-swatch aria-hidden="true">
        <img class="swatch-panel__img" src="${assetHref(alt)}" alt="" width="600" height="800" loading="lazy" decoding="async" />
      </div>`
          : ''
      }`
  }
  const hex = COLORS[color].hex
  return `<div class="swatch-panel" data-card-swatch style="${swatchStyle(hex)}"></div>`
}

function lineThumbStyle(product: Product, color: Colorway): string {
  const photo = getProductImage(product, color)
  if (photo) {
    return `background-image:url('${assetHref(photo)}');background-size:cover;background-position:center;`
  }
  return `--swatch:${COLORS[color].hex}`
}

function cardActiveColor(product: Product): Colorway {
  return product.colors[0].id
}

export function productCardHTML(product: Product): string {
  const primary = product.colors[0]
  const saved = isWishlisted(product.id, primary.id)
  return `
  <article class="product-card" data-product-card="${product.id}">
    <div class="product-card__media-wrap">
      <a class="product-card__media" href="${productHref(product.id)}" aria-label="${product.name}">
        ${mediaPanelHTML(product, primary.id)}
      </a>
      <button
        type="button"
        class="wish-btn ${saved ? 'is-on' : ''}"
        data-wish-toggle="${product.id}"
        data-wish-color="${primary.id}"
        aria-label="${saved ? 'Remove from saved' : 'Save for later'}"
        aria-pressed="${saved}"
      >${saved ? icon('heart-fill') : icon('heart')}</button>
    </div>
    <div class="product-card__body">
      <div class="product-card__meta">
        <span class="benefit-chip">${product.benefitChip}</span>
        <span>${product.platform}</span>
      </div>
      <a class="product-card__name" href="${productHref(product.id)}">${product.name}</a>
      <div class="product-card__meta">
        <span class="product-card__price">${formatPrice(product.mrp)}</span>
        <div class="color-dots" aria-label="Colours">
          ${product.colors
            .map(
              (c, i) =>
                `<button type="button" class="color-dot ${i === 0 ? 'is-active' : ''}" data-card-color="${c.hex}" data-card-color-id="${c.id}" style="background:${c.hex}" title="${c.name}" aria-label="${c.name}"></button>`,
            )
            .join('')}
        </div>
      </div>
      <div class="product-card__actions">
        <button class="btn btn--primary" type="button" data-quick-add="${product.id}">Quick add</button>
        <a class="btn btn--ghost" href="${productHref(product.id)}">View</a>
      </div>
    </div>
  </article>`
}

function renderCartBody(): void {
  const body = document.querySelector('[data-cart-body]')
  const foot = document.querySelector('[data-cart-foot]')
  if (!body || !foot) return

  const lines = getCart()
  if (!lines.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <p>Your bag is open water - ready for the first piece.</p>
        <a class="btn btn--primary" href="${shopHref()}">Explore Collection</a>
      </div>`
    foot.innerHTML = ''
    return
  }

  body.innerHTML = lines
    .map((line) => {
      const p = getProduct(line.productId)
      if (!p) return ''
      const color = COLORS[line.color]
      return `
      <div class="cart-line" data-line="${line.key}">
        <div class="cart-line__swatch" style="${lineThumbStyle(p, line.color)}"></div>
        <div class="cart-line__meta">
          <div class="cart-line__title">${p.name}</div>
          <div class="cart-line__detail">${color.name} · ${line.size}</div>
          <div class="cart-line__row">
            <div class="qty">
              <button type="button" data-qty-dec="${line.key}" aria-label="Decrease quantity">−</button>
              <span>${line.qty}</span>
              <button type="button" data-qty-inc="${line.key}" aria-label="Increase quantity">+</button>
            </div>
            <strong class="product-card__price">${formatPrice(p.mrp * line.qty)}</strong>
          </div>
          <button type="button" data-remove="${line.key}" style="font-size:0.75rem;color:var(--color-ink-muted);text-align:left">Remove</button>
        </div>
      </div>`
    })
    .join('')

  const hasCrop = lines.some((l) => l.productId === 'RVL-TNK-003-C')
  const hasShort = lines.some((l) => l.productId === 'RVL-SHT-004')
  const hint =
    hasCrop && !hasShort
      ? `<div class="cart-hint">Complete the co-ord with the <a href="${productHref('RVL-SHT-004')}"><strong>Matching Short</strong></a>.</div>`
      : hasShort && !hasCrop
        ? `<div class="cart-hint">Complete the co-ord with the <a href="${productHref('RVL-TNK-003-C')}"><strong>Built-in-Support Crop</strong></a>.</div>`
        : `<div class="cart-hint">Complete a co-ord - eight pairings in Midnight &amp; Cardamom.</div>`

  body.innerHTML += hint

  foot.innerHTML = `
    <div class="cart-subtotal"><span>Subtotal</span><strong>${formatPrice(cartSubtotal())}</strong></div>
    <a class="btn btn--primary btn--block" href="${pathPrefix()}checkout/">Checkout</a>
    <p class="eyebrow" style="text-align:center">Prototype - no payment charged</p>`
}

function renderWishBody(): void {
  const body = document.querySelector('[data-wish-body]')
  const foot = document.querySelector('[data-wish-foot]')
  if (!body || !foot) return

  const lines = getWishlist()
  if (!lines.length) {
    body.innerHTML = `
      <div class="cart-empty wish-empty">
        <p class="eyebrow" style="margin-bottom:0.75rem">Save for later</p>
        <p>Heart a piece while browsing - no account needed. Move it to your bag when you’re ready.</p>
        <a class="btn btn--primary" href="${shopHref()}">Explore Collection</a>
      </div>`
    foot.innerHTML = ''
    return
  }

  body.innerHTML = lines
    .map((line) => {
      const p = getProduct(line.productId)
      if (!p) return ''
      const color = COLORS[line.color]
      return `
      <div class="cart-line wish-line" data-wish-line="${line.key}">
        <a class="cart-line__swatch" href="${productHref(p.id)}" style="${lineThumbStyle(p, line.color)}" aria-label="${p.name}"></a>
        <div class="cart-line__meta">
          <div class="cart-line__title">${p.name}</div>
          <div class="cart-line__detail">${color.name} · ${p.platform}</div>
          <div class="cart-line__row">
            <strong class="product-card__price">${formatPrice(p.mrp)}</strong>
          </div>
          <div class="wish-line__actions">
            <button type="button" class="btn btn--primary" data-wish-to-bag="${p.id}" data-wish-color="${line.color}">Add to bag</button>
            <button type="button" class="text-link" data-wish-remove="${line.key}">Remove</button>
          </div>
        </div>
      </div>`
    })
    .join('')

  foot.innerHTML = `
    <p class="wish-foot-note">Guest list · Saved on this device${isLoggedIn() ? ` · ${getProfile().name.split(' ')[0]}` : ''}</p>
    <a class="btn btn--ghost btn--block" href="${shopHref()}">Continue shopping</a>`
}

function updateCartCount(): void {
  const el = document.querySelector<HTMLElement>('[data-cart-count]')
  if (!el) return
  const n = cartCount()
  el.hidden = n === 0
  el.textContent = String(n)
}

function updateWishCount(): void {
  const el = document.querySelector<HTMLElement>('[data-wish-count]')
  if (!el) return
  const n = wishlistCount()
  el.hidden = n === 0
  el.textContent = String(n)
}

function syncWishButtons(): void {
  document.querySelectorAll<HTMLElement>('[data-wish-toggle]').forEach((btn) => {
    const id = btn.dataset.wishToggle
    const color = (btn.dataset.wishColor as Colorway) || 'midnight'
    if (!id) return
    const on = isWishlisted(id, color)
    btn.classList.toggle('is-on', on)
    btn.setAttribute('aria-pressed', String(on))
    btn.setAttribute('aria-label', on ? 'Remove from saved' : 'Save for later')
    btn.innerHTML = on ? icon('heart-fill') : icon('heart')
  })
}

export function openCart(): void {
  closeWish()
  closeSearch()
  document.querySelector('[data-cart-overlay]')?.classList.add('is-open')
  document.querySelector('[data-cart-drawer]')?.classList.add('is-open')
  document.querySelector('[data-cart-drawer]')?.setAttribute('aria-hidden', 'false')
  renderCartBody()
}

export function closeCart(): void {
  document.querySelector('[data-cart-overlay]')?.classList.remove('is-open')
  document.querySelector('[data-cart-drawer]')?.classList.remove('is-open')
  document.querySelector('[data-cart-drawer]')?.setAttribute('aria-hidden', 'true')
}

export function openWish(): void {
  closeCart()
  closeSearch()
  document.querySelector('[data-wish-overlay]')?.classList.add('is-open')
  document.querySelector('[data-wish-drawer]')?.classList.add('is-open')
  document.querySelector('[data-wish-drawer]')?.setAttribute('aria-hidden', 'false')
  renderWishBody()
}

export function closeWish(): void {
  document.querySelector('[data-wish-overlay]')?.classList.remove('is-open')
  document.querySelector('[data-wish-drawer]')?.classList.remove('is-open')
  document.querySelector('[data-wish-drawer]')?.setAttribute('aria-hidden', 'true')
}

function renderSearchResults(query: string): void {
  const box = document.querySelector('[data-search-results]')
  const label = document.querySelector('[data-search-label]')
  const all = document.querySelector<HTMLAnchorElement>('[data-search-all]')
  if (!box) return

  const brand = pathPrefix()
  const suggestions = liveSuggestions(query, shopHref, brand)
  if (label) label.textContent = query.trim() ? 'Results' : 'Suggested for you'
  if (all) {
    all.href = query.trim() ? shopHref({ q: query.trim() }) : shopHref()
    all.textContent = query.trim() ? `See all for “${query.trim()}”` : 'View Collection'
  }

  box.innerHTML = suggestions
    .map((s) => {
      const typeLabel =
        s.type === 'product' ? 'Piece' : s.type === 'situation' ? 'Situation' : s.type === 'platform' ? 'Platform' : 'Collection'
      return `
      <a class="search-hit" href="${s.href}">
        <span class="search-hit__type">${typeLabel}</span>
        <span class="search-hit__label">${s.label}</span>
        ${s.blurb ? `<span class="search-hit__blurb">${s.blurb}</span>` : ''}
      </a>`
    })
    .join('')
}

export function openSearch(): void {
  closeCart()
  closeWish()
  const overlay = document.querySelector('[data-search-overlay]')
  const input = document.querySelector<HTMLInputElement>('[data-search-input]')
  overlay?.classList.add('is-open')
  overlay?.setAttribute('aria-hidden', 'false')
  renderSearchResults('')
  requestAnimationFrame(() => input?.focus())
}

export function closeSearch(): void {
  const overlay = document.querySelector('[data-search-overlay]')
  overlay?.classList.remove('is-open')
  overlay?.setAttribute('aria-hidden', 'true')
  const input = document.querySelector<HTMLInputElement>('[data-search-input]')
  if (input) input.value = ''
}

let sheetProductId: string | null = null
let sheetColor: Colorway = 'midnight'
let sheetSize: Size | null = null

function openSheet(productId: string, preferColor?: Colorway): void {
  const product = getProduct(productId)
  const sheet = document.querySelector('[data-sheet]')
  const overlay = document.querySelector('[data-sheet-overlay]')
  if (!product || !sheet || !overlay) return

  sheetProductId = productId
  sheetColor = preferColor && product.colors.some((c) => c.id === preferColor) ? preferColor : product.colors[0].id
  sheetSize = null

  sheet.innerHTML = `
    <div class="sheet__head">
      <div>
        <p class="eyebrow">${product.platform}</p>
        <h3>${product.name}</h3>
        <p class="product-card__price" style="margin-top:0.5rem">${formatPrice(product.mrp)}</p>
      </div>
      <button type="button" class="icon-btn" data-sheet-close aria-label="Close">${icon('close')}</button>
    </div>
    <p class="eyebrow" style="margin-bottom:0.75rem">Colour</p>
    <div class="color-picker" data-sheet-colors>
      ${product.colors
        .map(
          (c) =>
            `<button type="button" class="${c.id === sheetColor ? 'is-selected' : ''}" data-sheet-color="${c.id}" style="background:${c.hex}" aria-label="${c.name}"></button>`,
        )
        .join('')}
    </div>
    <p class="eyebrow" style="margin-bottom:0.75rem">Size</p>
    <div class="size-grid" data-sheet-sizes>
      ${product.sizes.map((s) => `<button type="button" data-sheet-size="${s}">${s}</button>`).join('')}
    </div>
    <button class="btn btn--primary btn--block" type="button" data-sheet-confirm disabled>Add to bag</button>
  `

  overlay.classList.add('is-open')
  sheet.classList.add('is-open')
  sheet.setAttribute('aria-hidden', 'false')
}

function closeSheet(): void {
  document.querySelector('[data-sheet-overlay]')?.classList.remove('is-open')
  document.querySelector('[data-sheet]')?.classList.remove('is-open')
  document.querySelector('[data-sheet]')?.setAttribute('aria-hidden', 'true')
  sheetProductId = null
}

function syncSheetConfirm(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-sheet-confirm]')
  if (btn) btn.disabled = !sheetSize
}

export function mountShell(root: HTMLElement): void {
  const main = root.querySelector('[data-page-content]')
  const content = main?.innerHTML ?? ''
  root.innerHTML = `
    <div class="page">
      ${renderHeader()}
      <main class="page__main" data-page-content>${content}</main>
      ${renderFooter()}
      ${renderCartChrome()}
    </div>`

  const header = root.querySelector('[data-header]')
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  const mobileNav = root.querySelector<HTMLElement>('[data-mobile-nav]')
  const menuToggle = root.querySelector<HTMLButtonElement>('[data-menu-toggle]')
  const setMobileNav = (open: boolean) => {
    mobileNav?.classList.toggle('is-open', open)
    mobileNav?.setAttribute('aria-hidden', open ? 'false' : 'true')
    menuToggle?.setAttribute('aria-expanded', String(open))
    menuToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    if (menuToggle) menuToggle.innerHTML = open ? icon('close') : icon('menu')
    document.body.classList.toggle('nav-open', open)
  }
  menuToggle?.addEventListener('click', () => {
    setMobileNav(!mobileNav?.classList.contains('is-open'))
  })
  root.querySelector('[data-menu-close]')?.addEventListener('click', () => setMobileNav(false))
  mobileNav?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setMobileNav(false))
  })

  const shopNav = root.querySelector<HTMLElement>('.site-nav__shop')
  const mega = shopNav?.querySelector<HTMLElement>('.mega')
  let megaCloseTimer: ReturnType<typeof setTimeout> | null = null
  const openMega = () => {
    if (megaCloseTimer) {
      clearTimeout(megaCloseTimer)
      megaCloseTimer = null
    }
    shopNav?.classList.add('is-open')
  }
  const closeMega = () => {
    if (megaCloseTimer) {
      clearTimeout(megaCloseTimer)
      megaCloseTimer = null
    }
    shopNav?.classList.remove('is-open')
  }
  const scheduleCloseMega = () => {
    if (megaCloseTimer) clearTimeout(megaCloseTimer)
    megaCloseTimer = setTimeout(closeMega, 120)
  }
  if (shopNav && mega) {
    const megaTrigger = shopNav.querySelector<HTMLElement>('[data-mega-trigger]')
    shopNav.querySelector('[data-mega-trigger]')?.addEventListener('mouseenter', openMega)
    mega.addEventListener('mouseenter', openMega)
    shopNav.addEventListener('mouseleave', scheduleCloseMega)
    shopNav.addEventListener('focusin', openMega)
    shopNav.addEventListener('focusout', (e) => {
      if (!shopNav.contains(e.relatedTarget as Node)) closeMega()
    })
    megaTrigger?.addEventListener('click', (e) => {
      // Keep link usable; open mega on intentional click without leaving yet on desktop hover devices
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        openMega()
        return
      }
      e.preventDefault()
      if (shopNav.classList.contains('is-open')) closeMega()
      else openMega()
    })
    document.addEventListener('click', (e) => {
      if (!shopNav.contains(e.target as Node)) closeMega()
    })
    root.querySelectorAll<HTMLElement>('.site-nav > .site-nav__link').forEach((link) => {
      link.addEventListener('mouseenter', closeMega)
    })
  }

  // Account hover menu
  const accountMenu = root.querySelector<HTMLElement>('[data-account-menu]')
  const accountTrigger = root.querySelector<HTMLElement>('[data-account-trigger]')
  let accountCloseTimer: ReturnType<typeof setTimeout> | null = null
  const openAccountMenu = () => {
    if (accountCloseTimer) {
      clearTimeout(accountCloseTimer)
      accountCloseTimer = null
    }
    accountMenu?.classList.add('is-open')
    accountTrigger?.setAttribute('aria-expanded', 'true')
  }
  const closeAccountMenu = () => {
    if (accountCloseTimer) {
      clearTimeout(accountCloseTimer)
      accountCloseTimer = null
    }
    accountMenu?.classList.remove('is-open')
    accountTrigger?.setAttribute('aria-expanded', 'false')
  }
  const scheduleCloseAccountMenu = () => {
    if (accountCloseTimer) clearTimeout(accountCloseTimer)
    accountCloseTimer = setTimeout(closeAccountMenu, 160)
  }
  if (accountMenu && accountTrigger) {
    accountMenu.addEventListener('mouseenter', openAccountMenu)
    accountMenu.addEventListener('mouseleave', scheduleCloseAccountMenu)
    accountTrigger.addEventListener('click', (e) => {
      e.preventDefault()
      if (accountMenu.classList.contains('is-open')) closeAccountMenu()
      else openAccountMenu()
    })
    accountMenu.addEventListener('focusin', openAccountMenu)
    accountMenu.addEventListener('focusout', (e) => {
      if (!accountMenu.contains(e.relatedTarget as Node)) closeAccountMenu()
    })
  }

  const handleLogout = () => {
    logout()
    closeAccountMenu()
    setMobileNav(false)
    window.location.href = accountHref()
  }
  root.querySelectorAll('[data-logout]').forEach((el) => {
    el.addEventListener('click', handleLogout)
  })

  root.querySelectorAll('[data-search-open]').forEach((el) => {
    el.addEventListener('click', () => {
      setMobileNav(false)
      closeAccountMenu()
      openSearch()
    })
  })
  root.querySelector('[data-search-close]')?.addEventListener('click', () => closeSearch())
  root.querySelector('[data-search-overlay]')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSearch()
  })
  const searchInput = root.querySelector<HTMLInputElement>('[data-search-input]')
  searchInput?.addEventListener('input', () => renderSearchResults(searchInput.value))
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch()
    if (e.key === 'Enter') {
      e.preventDefault()
      const q = searchInput.value.trim()
      window.location.href = q ? shopHref({ q }) : shopHref()
    }
  })

  root.querySelectorAll('[data-wish-open]').forEach((el) => {
    el.addEventListener('click', () => {
      setMobileNav(false)
      closeAccountMenu()
      openWish()
    })
  })
  root.querySelector('[data-wish-close]')?.addEventListener('click', () => closeWish())
  root.querySelector('[data-wish-overlay]')?.addEventListener('click', () => closeWish())

  root.querySelector('[data-cart-open]')?.addEventListener('click', () => openCart())
  root.querySelector('[data-cart-close]')?.addEventListener('click', () => closeCart())
  root.querySelector('[data-cart-overlay]')?.addEventListener('click', () => closeCart())
  root.querySelector('[data-sheet-overlay]')?.addEventListener('click', () => closeSheet())

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch()
      closeWish()
      closeCart()
      closeSheet()
      closeAccountMenu()
      setMobileNav(false)
    }
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      openSearch()
    }
  })

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement

    const wishToggle = t.closest<HTMLElement>('[data-wish-toggle]')
    if (wishToggle?.dataset.wishToggle) {
      e.preventDefault()
      e.stopPropagation()
      const id = wishToggle.dataset.wishToggle
      const color = (wishToggle.dataset.wishColor as Colorway) || cardActiveColor(getProduct(id)!)
      toggleWishlist(id, color)
      return
    }

    const wishRemove = t.closest<HTMLElement>('[data-wish-remove]')
    if (wishRemove?.dataset.wishRemove) {
      removeWishlist(wishRemove.dataset.wishRemove)
      return
    }

    const wishToBag = t.closest<HTMLElement>('[data-wish-to-bag]')
    if (wishToBag?.dataset.wishToBag) {
      closeWish()
      openSheet(wishToBag.dataset.wishToBag, wishToBag.dataset.wishColor as Colorway)
      return
    }

    const colorDot = t.closest<HTMLElement>('[data-card-color]')
    if (colorDot?.dataset.cardColor) {
      e.preventDefault()
      e.stopPropagation()
      const card = colorDot.closest('[data-product-card]')
      const media = card?.querySelector<HTMLElement>('.product-card__media')
      const productId = card?.getAttribute('data-product-card')
      const product = productId ? getProduct(productId) : undefined
      const colorId = (colorDot.dataset.cardColorId as Colorway) || undefined
      if (media && product && colorId) {
        media.innerHTML = mediaPanelHTML(product, colorId)
      }
      card?.querySelectorAll('[data-card-color]').forEach((d) => d.classList.remove('is-active'))
      colorDot.classList.add('is-active')
      const wishBtn = card?.querySelector<HTMLElement>('[data-wish-toggle]')
      if (wishBtn && colorDot.dataset.cardColorId) {
        wishBtn.dataset.wishColor = colorDot.dataset.cardColorId
        const on = isWishlisted(wishBtn.dataset.wishToggle!, colorDot.dataset.cardColorId as Colorway)
        wishBtn.classList.toggle('is-on', on)
        wishBtn.innerHTML = on ? icon('heart-fill') : icon('heart')
      }
      return
    }
    const quick = t.closest<HTMLElement>('[data-quick-add]')
    if (quick?.dataset.quickAdd) {
      openSheet(quick.dataset.quickAdd)
      return
    }
    if (t.closest('[data-sheet-close]')) {
      closeSheet()
      return
    }
    const colorBtn = t.closest<HTMLElement>('[data-sheet-color]')
    if (colorBtn?.dataset.sheetColor) {
      sheetColor = colorBtn.dataset.sheetColor as Colorway
      root.querySelectorAll('[data-sheet-color]').forEach((b) => b.classList.remove('is-selected'))
      colorBtn.classList.add('is-selected')
      return
    }
    const sizeBtn = t.closest<HTMLElement>('[data-sheet-size]')
    if (sizeBtn?.dataset.sheetSize) {
      sheetSize = sizeBtn.dataset.sheetSize as Size
      root.querySelectorAll('[data-sheet-size]').forEach((b) => {
        b.classList.remove('is-selected')
        b.setAttribute('aria-pressed', 'false')
      })
      sizeBtn.classList.add('is-selected')
      sizeBtn.setAttribute('aria-pressed', 'true')
      syncSheetConfirm()
      return
    }
    if (t.closest('[data-sheet-confirm]') && sheetProductId && sheetSize) {
      addToCart(sheetProductId, sheetColor, sheetSize, 1)
      closeSheet()
      openCart()
      return
    }
    const inc = t.closest<HTMLElement>('[data-qty-inc]')
    if (inc?.dataset.qtyInc) {
      const line = getCart().find((l) => l.key === inc.dataset.qtyInc)
      if (line) setQty(line.key, line.qty + 1)
      return
    }
    const dec = t.closest<HTMLElement>('[data-qty-dec]')
    if (dec?.dataset.qtyDec) {
      const line = getCart().find((l) => l.key === dec.dataset.qtyDec)
      if (line) setQty(line.key, line.qty - 1)
      return
    }
    const rem = t.closest<HTMLElement>('[data-remove]')
    if (rem?.dataset.remove) {
      removeLine(rem.dataset.remove)
    }
  })

  updateCartCount()
  updateWishCount()
  subscribeCart(() => {
    updateCartCount()
    if (document.querySelector('[data-cart-drawer]')?.classList.contains('is-open')) {
      renderCartBody()
    }
  })
  subscribeWishlist(() => {
    updateWishCount()
    syncWishButtons()
    if (document.querySelector('[data-wish-drawer]')?.classList.contains('is-open')) {
      renderWishBody()
    }
  })
  subscribeAuth(() => {
    /* Account page handles its own paint; header refreshed on next navigation */
  })

  bootMotion(root)
}

export {
  products,
  addToCart,
  addCoordSet,
  openSheet,
  formatPrice,
  getProduct,
  COLORS,
  initPageMotion,
  initReviewRails,
  toggleWishlist,
  isWishlisted,
}
