import {
  COLORS,
  SITUATIONS,
  coordSetPrice,
  filterProducts,
  formatPrice,
  getCoordImages,
  getCoordSet,
  getProduct,
  getProductImage,
  getProductImages,
  products,
  type Colorway,
  type CoordSet,
  type Product,
  type Situation,
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
import { openSizeGuide } from './sizeGuide'
import type { SizeGuideTab } from '../data/sizeGuide'

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

/** PDP entry from a styled look - keeps attribution for conversion tracking. */
export function lookProductHref(productId: string, lookSlug: string): string {
  const q = new URLSearchParams({
    id: productId,
    from: 'look',
    look: lookSlug,
  })
  return `${pathPrefix()}product/?${q.toString()}`
}

/** Look PDP for a specific pairing. */
export function lookHref(lookSlug: string): string {
  return `${pathPrefix()}look/?set=${encodeURIComponent(lookSlug)}`
}

export function shopHref(params: Record<string, string> = {}): string {
  const q = new URLSearchParams(params).toString()
  return `${pathPrefix()}shop/${q ? `?${q}` : ''}`
}

export function accountHref(): string {
  return `${pathPrefix()}account/`
}

type IconName =
  | 'bag'
  | 'menu'
  | 'close'
  | 'search'
  | 'heart'
  | 'heart-fill'
  | 'user'
  | 'chevron-left'
  | 'chevron-right'
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'whatsapp'
  | 'pinterest'
  | 'x'
  | 'facebook'
  | 'email'

const WHATSAPP_HREF =
  'https://wa.me/916383491536?text=' + encodeURIComponent('Hi Rivlet - I need help with an order.')

const SOCIAL_LINKS = [
  { name: 'instagram' as const, href: 'https://www.instagram.com/rivletindia/', label: 'Instagram' },
  { name: 'pinterest' as const, href: 'https://pin.it/34JQaaAqP', label: 'Pinterest' },
  { name: 'linkedin' as const, href: 'https://www.linkedin.com/company/rivlet/', label: 'LinkedIn' },
  { name: 'youtube' as const, href: 'https://youtube.com/@rivletindia', label: 'YouTube' },
  { name: 'x' as const, href: 'https://x.com/RivletIndia', label: 'X' },
  { name: 'facebook' as const, href: 'https://www.facebook.com/profile.php?id=61590352977288', label: 'Facebook' },
  { name: 'whatsapp' as const, href: WHATSAPP_HREF, label: 'WhatsApp' },
  { name: 'email' as const, href: 'mailto:hello@therivlet.com', label: 'Email' },
]

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
  if (name === 'chevron-left') {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M14.5 6L8.5 12l6 6"/></svg>`
  }
  if (name === 'chevron-right') {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>`
  }
  // Solid brand marks for footer social (filled, no stroke outlines)
  const solid = 'width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"'
  if (name === 'instagram') {
    return `<svg ${solid}><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>`
  }
  if (name === 'youtube') {
    return `<svg ${solid}><path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-4.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>`
  }
  if (name === 'linkedin') {
    return `<svg ${solid}><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8.2 18.5H5.4V9.2h2.8v9.3zM6.8 8A1.6 1.6 0 1 1 6.8 4.8 1.6 1.6 0 0 1 6.8 8zM18.6 18.5h-2.8v-4.5c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.6H9.7V9.2h2.7v1.3h.04c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4v5.1z"/></svg>`
  }
  if (name === 'whatsapp') {
    return `<svg ${solid}><path d="M12.04 2a9.94 9.94 0 0 0-8.6 15.05L2 22l5.1-1.34A9.94 9.94 0 1 0 12.04 2zm5.8 14.2c-.24.68-1.4 1.24-1.93 1.32-.5.07-1.13.1-1.82-.11a13.3 13.3 0 0 1-5.9-4.1 6.1 6.1 0 0 1-1.27-2.3c-.14-.5-.02-1.05.33-1.41l.9-.98c.23-.25.56-.32.87-.2l1.25.5c.3.12.5.4.48.72l-.12 1.05c-.03.24.05.48.22.65l.4.4a8.2 8.2 0 0 0 2.45 1.8c.2.1.45.08.62-.08l.85-.95c.2-.23.52-.3.8-.18l1.3.55c.3.13.48.44.4.75l-.33 1.2z"/></svg>`
  }
  if (name === 'pinterest') {
    return `<svg ${solid}><path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2 0-2.9.2-.8 1.3-5.4 1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.8-4.2-4.3-4.2-2.9 0-4.7 2.2-4.7 4.5 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.1.2-.3.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.8-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2-.5-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 0 0 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>`
  }
  if (name === 'x') {
    return `<svg ${solid}><path d="M18.9 2H22l-6.8 7.8L23 22h-6.5l-5.1-6.7L5.7 22H2.6l7.3-8.3L1 2h6.7l4.6 6.1L18.9 2zm-1.1 18h1.8L6.3 3.9H4.4L17.8 20z"/></svg>`
  }
  if (name === 'facebook') {
    return `<svg ${solid}><path d="M22 12.1C22 6.5 17.5 2 11.9 2S2 6.5 2 12.1c0 5 3.7 9.2 8.5 9.9v-7H8.1v-2.9h2.4V9.9c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8h2.6l-.4 2.9h-2.2v7c4.8-.7 8.5-4.9 8.5-9.9z"/></svg>`
  }
  if (name === 'email') {
    return `<svg ${solid}><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 3.2-8 5.1L4 7.2V6l8 5.1L20 6v1.2z"/></svg>`
  }
  return `<svg ${common}><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></svg>`
}

function homeHashHref(hash: string): string {
  const clean = hash.replace(/^#/, '')
  return `${pathPrefix()}#${clean}`
}

/** Card-style payment marks (visual trust only). */
function payMarksHTML(variant: 'footer' | 'checkout' = 'footer'): string {
  const cls = variant === 'checkout' ? 'pay-marks pay-marks--light' : 'pay-marks'
  return `
    <ul class="${cls}" aria-label="Accepted payment methods">
      <li class="pay-card pay-card--upi" title="UPI">
        <svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#fff"/><path d="M10 22L18 8h4l-8 14H10zm8 0l8-14h4l-8 14h-4z" fill="#097939"/><path d="M26 22l8-14h4L30 22h-4z" fill="#ED752E"/><text x="38" y="21" text-anchor="middle" font-size="6" font-family="Arial,sans-serif" font-weight="700" fill="#0C1E34">UPI</text></svg>
      </li>
      <li class="pay-card pay-card--visa" title="Visa">
        <svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#1A1F71"/><text x="24" y="20" text-anchor="middle" font-size="11" font-family="Arial,sans-serif" font-weight="700" font-style="italic" fill="#fff" letter-spacing="1">VISA</text></svg>
      </li>
      <li class="pay-card pay-card--mc" title="Mastercard">
        <svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#1A1A1A"/><circle cx="19.5" cy="16" r="7" fill="#EB001B"/><circle cx="28.5" cy="16" r="7" fill="#F79E1B"/><path d="M24 10.8a7 7 0 0 1 0 10.4 7 7 0 0 1 0-10.4z" fill="#FF5F00"/></svg>
      </li>
      <li class="pay-card pay-card--rupay" title="RuPay">
        <svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#fff"/><text x="24" y="15" text-anchor="middle" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="#097939">RuPay</text><rect x="10" y="19" width="28" height="2.5" rx="1" fill="#097939"/><rect x="10" y="19" width="9" height="2.5" rx="1" fill="#ED752E" opacity=".9"/><rect x="29" y="19" width="9" height="2.5" rx="1" fill="#1B4F9C" opacity=".9"/></svg>
      </li>
      <li class="pay-card pay-card--gpay" title="Google Pay">
        <svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#fff"/><text x="16" y="20" text-anchor="middle" font-size="12" font-family="Arial,sans-serif" font-weight="700" fill="#4285F4">G</text><text x="30" y="20" text-anchor="middle" font-size="9" font-family="Arial,sans-serif" font-weight="500" fill="#5F6368">Pay</text></svg>
      </li>
      <li class="pay-card pay-card--amex" title="American Express">
        <svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#2E77BC"/><text x="24" y="20" text-anchor="middle" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="#fff" letter-spacing="0.5">AMEX</text></svg>
      </li>
      <li class="pay-card pay-card--net" title="Netbanking">
        <svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#0C1E34"/><path d="M24 7l12 7v3H12v-3l12-7zm-9 12h4v4h-4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" fill="#F7F3EC"/></svg>
      </li>
    </ul>`
}

function currentPath(): string {
  return window.location.pathname
}

function navCurrent(match: string): string {
  return currentPath().includes(match) ? 'aria-current="page"' : ''
}

function megaProductCard(product: Product): string {
  const photo = getProductImage(product, 'midnight') ?? getProductImage(product, product.colors[0]?.id ?? 'midnight')
  const href = `${pathPrefix()}product/?id=${encodeURIComponent(product.id)}`
  return `
    <a class="mega__product" href="${href}" role="menuitem">
      <span class="mega__product-media" aria-hidden="true">
        ${
          photo
            ? `<img src="${assetHref(photo)}" alt="" width="320" height="400" loading="lazy" decoding="async" />`
            : ''
        }
      </span>
      <span class="mega__product-meta">
        <span class="mega__product-name">${product.shortName}</span>
        <span class="mega__product-price">${formatPrice(product.mrp)}</span>
      </span>
    </a>`
}

function megaSituationPanel(situationId: Situation): string {
  const s = SITUATIONS.find((x) => x.id === situationId)
  if (!s) return ''
  const pieces = filterProducts({ situation: situationId }).slice(0, 3)
  return `
    <div class="mega__panel mega__panel--situation" data-mega-panel="${s.id}" hidden>
      <div class="mega__panel-head">
        <p class="mega__eyebrow">${s.label}</p>
        <p class="mega__panel-blurb">${s.blurb}</p>
      </div>
      <div class="mega__products">
        ${pieces.map(megaProductCard).join('')}
      </div>
      <a class="mega__panel-cta" href="${shopHref({ situation: s.id })}">Shop ${s.label}</a>
    </div>`
}

export function renderHeader(): string {
  const situationCards = SITUATIONS.map(
    (s) => `
      <a class="mega__item" href="${shopHref({ situation: s.id })}" role="menuitem" data-mega-situation="${s.id}">
        <span class="mega__item-thumb" aria-hidden="true">
          <img src="${assetHref(s.image)}" alt="" width="96" height="120" loading="lazy" decoding="async" />
        </span>
        <span class="mega__item-copy">
          <span class="mega__item-label">${s.label}</span>
          <span class="mega__item-blurb">${s.blurb}</span>
        </span>
      </a>`,
  ).join('')

  const brand = pathPrefix()
  const loggedIn = isLoggedIn()
  const profile = getProfile()
  const featuredCollectionImg = assetHref('media/products/midnight-tank-2.png')
  const featuredLooksImg = assetHref('media/coords/crop-shorts-midnight-1.png')
  const situationPanels = SITUATIONS.map((s) => megaSituationPanel(s.id)).join('')

  const whatsappHref = WHATSAPP_HREF

  return `
  <header class="site-header" data-header>
    <div class="site-header__rail" data-announce aria-roledescription="carousel" aria-label="Announcements">
      <button class="announce-nav announce-nav--prev" type="button" data-announce-prev aria-label="Previous announcement">
        ${icon('chevron-left')}
      </button>
      <div class="announce-viewport">
        <div class="announce-track" data-announce-track>
          <p class="announce-slide announce-slide--motto is-active" data-announce-slide aria-hidden="false">
            <img class="announce-mark" src="${brand}brand/rivlet-mark.png" alt="" width="24" height="24" />
            <span class="announce-copy">
              <span class="announce-copy__full">Move like water, feel like air.</span>
              <span class="announce-copy__short">Move like water, feel like air.</span>
            </span>
          </p>
          <p class="announce-slide" data-announce-slide aria-hidden="true">
            <span class="announce-copy">
              <span class="announce-copy__full">
                Free shipping on prepaid orders · Easy returns in India.
                Shop <a href="${shopHref()}">Collection</a> and <a href="${brand}sets/">Looks</a>.
              </span>
              <span class="announce-copy__short">
                Free shipping · Easy returns.
                Shop <a href="${shopHref()}">Collection</a>
              </span>
            </span>
          </p>
          <p class="announce-slide" data-announce-slide aria-hidden="true">
            <span class="announce-copy">
              <span class="announce-copy__full">
                Need help? Faster support on
                <a href="${whatsappHref}" target="_blank" rel="noreferrer">WhatsApp</a>.
              </span>
              <span class="announce-copy__short">
                Help on <a href="${whatsappHref}" target="_blank" rel="noreferrer">WhatsApp</a>
              </span>
            </span>
          </p>
          <p class="announce-slide" data-announce-slide aria-hidden="true">
            <span class="announce-copy">
              <span class="announce-copy__full">
                Engineered for Indian heat.
                Shop <a href="${brand}sets/">Walk-out ready looks</a>.
              </span>
              <span class="announce-copy__short">
                For Indian heat. Shop <a href="${brand}sets/">Looks</a>
              </span>
            </span>
          </p>
        </div>
      </div>
      <button class="announce-nav announce-nav--next" type="button" data-announce-next aria-label="Next announcement">
        ${icon('chevron-right')}
      </button>
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
              <div class="mega" role="menu" aria-label="Shop menu" data-mega>
                <div class="mega__inner">
                  <div class="mega__col">
                    <p class="mega__eyebrow">What are you shopping for?</p>
                    <div class="mega__grid" data-mega-situations>
                      ${situationCards}
                    </div>
                  </div>
                  <div class="mega__aside" data-mega-aside>
                    <div class="mega__panel mega__panel--featured is-active" data-mega-panel="default">
                      <div class="mega__features">
                        <a class="mega__feature" href="${shopHref()}">
                          <img class="mega__feature-img" src="${featuredCollectionImg}" alt="" width="720" height="900" loading="lazy" decoding="async" />
                          <span class="mega__feature-veil" aria-hidden="true"></span>
                          <span class="mega__feature-copy">
                            <span class="mega__eyebrow">Featured</span>
                            <strong>Full collection</strong>
                            <span>Six engineered pieces · Midnight &amp; Cardamom</span>
                          </span>
                        </a>
                        <a class="mega__feature mega__feature--soft" href="${brand}sets/">
                          <img class="mega__feature-img" src="${featuredLooksImg}" alt="" width="720" height="900" loading="lazy" decoding="async" />
                          <span class="mega__feature-veil" aria-hidden="true"></span>
                          <span class="mega__feature-copy">
                            <span class="mega__eyebrow">Looks</span>
                            <strong>Walk-out ready</strong>
                            <span>Eight pairings. Midnight &amp; Cardamom.</span>
                          </span>
                        </a>
                      </div>
                    </div>
                    ${situationPanels}
                  </div>
                </div>
              </div>
            </div>
            <a class="site-nav__link" href="${shopHref()}" ${navCurrent('/shop')}>Collection</a>
            <a class="site-nav__link" href="${brand}sets/" ${navCurrent('/sets')}>Looks</a>
            <a class="site-nav__link" href="${brand}stories/" ${navCurrent('/stories')}>Stories</a>
          </nav>
        </div>

        <div class="header-actions">
          <button class="icon-btn header-actions__search" type="button" data-search-open aria-label="Search">${icon('search')}</button>
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
          <a class="icon-btn header-actions__account-mobile" href="${accountHref()}" aria-label="${loggedIn ? 'Account' : 'Sign in'}">
            ${icon('user')}
            ${loggedIn ? `<span class="account-dot" title="${profile.name}"></span>` : ''}
          </a>
          <button class="icon-btn header-actions__wish" type="button" data-wish-open aria-label="Saved pieces">
            ${icon('heart')}
            <span class="cart-count wish-count" data-wish-count hidden>0</span>
          </button>
          <button class="icon-btn" type="button" data-cart-open aria-label="Open bag">
            ${icon('bag')}
            <span class="cart-count" data-cart-count hidden>0</span>
          </button>
        </div>
      </div>
      <div class="site-header__search-row">
        <button type="button" class="header-search-pill" data-search-open aria-label="Search collection">
          <span class="header-search-pill__icon" aria-hidden="true">${icon('search')}</span>
          <span class="header-search-pill__text">Search Rivlet</span>
        </button>
      </div>
    </div>
  </header>
  <div class="mobile-nav" data-mobile-nav aria-hidden="true">
    <nav class="mobile-nav__links" aria-label="Mobile">
      <a href="${shopHref()}">Collection</a>
      <a href="${brand}sets/">Looks</a>
      <a href="${brand}stories/">Stories</a>
      <button type="button" data-wish-open>
        Wishlist
        <span class="cart-count wish-count" data-wish-count hidden>0</span>
      </button>
    </nav>
  </div>`
}

export function renderFooter(): string {
  const brand = pathPrefix()
  const whatsappHref = WHATSAPP_HREF
  const inCircle = typeof localStorage !== 'undefined' && Boolean(localStorage.getItem('rivlet-community-email'))
  const socialLinks = SOCIAL_LINKS.map(
    (s) =>
      `<a class="site-footer__social-link" href="${s.href}" ${s.name === 'email' ? '' : 'target="_blank" rel="noreferrer"'} aria-label="${s.label}">${icon(s.name)}</a>`,
  ).join('')

  return `
  <footer class="site-footer ocean-band">
    <div class="container site-footer__top">
      <div class="site-footer__brand-block">
        <div class="site-footer__lockup">
          <img class="site-footer__lockup-img" src="${brand}brand/rivlet-lockup.png" alt="Rivlet" width="800" height="165" />
        </div>
        <p class="site-footer__motto">Move like water, feel like air.</p>
        <p class="site-footer__lede">Premium Indian-crafted activewear engineered for heat, humidity, and real days - without compromise.</p>
        <p class="site-footer__circle-note">
          ${
            inCircle
              ? `You're in <a href="${homeHashHref('community')}">The Circle</a>.`
              : `<a href="${homeHashHref('community')}">Join The Circle</a> on the home ocean - early drops, fabric notes, quiet first.`
          }
        </p>
        <div class="site-footer__social" aria-label="Social">
          ${socialLinks}
        </div>
      </div>

      <div class="site-footer__columns">
        <details class="site-footer__col" open>
          <summary class="site-footer__col-title">Shop</summary>
          <ul>
            <li><a href="${shopHref()}">Collection</a></li>
            <li><a href="${brand}sets/">Looks</a></li>
            <li><a href="${shopHref({ form: 'tops' })}">Tops</a></li>
            <li><a href="${shopHref({ form: 'bottoms' })}">Bottoms</a></li>
            <li><a href="${shopHref({ situation: 'gym' })}">Gym</a></li>
            <li><a href="${shopHref({ situation: 'yoga' })}">Yoga</a></li>
            <li><a href="${shopHref({ situation: 'office' })}">Office</a></li>
            <li><a href="${shopHref({ situation: 'travel' })}">Travel</a></li>
            <li><a href="${shopHref({ situation: 'summer' })}">Summer</a></li>
          </ul>
        </details>
        <details class="site-footer__col">
          <summary class="site-footer__col-title">Help &amp; tools</summary>
          <ul>
            <li><button type="button" class="site-footer__text-btn" data-size-guide-open data-sg-initial="tops">Size guide</button></li>
            <li><a href="${brand}faq/">FAQs</a></li>
            <li><a href="${brand}shipping/">Shipping</a></li>
            <li><a href="${brand}returns/">Returns &amp; exchanges</a></li>
            <li><a href="${brand}track/">Track order</a></li>
            <li><a href="${brand}contact/">Contact</a></li>
            <li><a href="${whatsappHref}" target="_blank" rel="noreferrer">WhatsApp</a></li>
            <li><a href="${brand}account/">Account</a></li>
          </ul>
        </details>
        <details class="site-footer__col">
          <summary class="site-footer__col-title">About Rivlet</summary>
          <ul>
            <li><a href="${brand}about/">Our story</a></li>
            <li><a href="${brand}stories/">Fabric platforms</a></li>
            <li><a href="${homeHashHref('community')}">The Circle</a></li>
            <li><a href="${homeHashHref('voices')}">Customer voices</a></li>
            <li><a href="${brand}blog/">Blog</a></li>
            <li><a href="${brand}about/#studio">Studio Madurai</a></li>
          </ul>
        </details>
        <details class="site-footer__col">
          <summary class="site-footer__col-title">Policies</summary>
          <ul>
            <li><a href="${brand}privacy/">Privacy</a></li>
            <li><a href="${brand}terms/">Terms</a></li>
            <li><a href="${brand}shipping/">Shipping policy</a></li>
            <li><a href="${brand}returns/">Returns policy</a></li>
          </ul>
        </details>
      </div>
    </div>

    <div class="container site-footer__trust">
      <p class="site-footer__trust-label">We accept</p>
      <div class="site-footer__trust-scroller" tabindex="0" aria-label="Accepted payment methods">
        ${payMarksHTML()}
      </div>
    </div>

    <div class="container site-footer__bottom">
      <span class="site-footer__copy">© ${new Date().getFullYear()} Rivlet</span>
      <span class="site-footer__bottom-links">
        <a href="${brand}privacy/">Privacy</a>
        <a href="${brand}terms/">Terms</a>
      </span>
      <span class="site-footer__route">India → UK → UAE</span>
      <a class="site-footer__domain" href="https://therivlet.com" target="_blank" rel="noreferrer">therivlet.com</a>
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

function platformBadgeClass(platform: string): string {
  if (platform.startsWith('AquaFlow')) return 'platform-badge--aquaflow'
  if (platform.startsWith('SecondSkin')) return 'platform-badge--secondskin'
  if (platform.startsWith('NeutralCore')) return 'platform-badge--neutralcore'
  return 'platform-badge--neutralcore'
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
      <span class="platform-badge ${platformBadgeClass(product.platform)}">${product.platform}</span>
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
      <div class="product-card__meta product-card__meta--chips">
        <span class="benefit-chip">${product.benefitChip}</span>
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

function lookMediaHTML(set: CoordSet, color: Colorway): string {
  const [front, alt] = getCoordImages(set, color)
  return `
    <div class="swatch-panel swatch-panel--photo" data-look-swatch>
      <img class="swatch-panel__img" src="${assetHref(front)}" alt="" width="600" height="800" loading="lazy" decoding="async" />
    </div>
    <div class="swatch-panel swatch-panel--photo swatch-panel--alt" data-alt-swatch aria-hidden="true">
      <img class="swatch-panel__img" src="${assetHref(alt)}" alt="" width="600" height="800" loading="lazy" decoding="async" />
    </div>`
}

/** Walk-out ready look card - opens the Look PDP. */
export function lookCardHTML(set: CoordSet): string {
  const color: Colorway = 'midnight'
  const top = getProduct(set.topId)
  const bottom = getProduct(set.bottomId)
  const total = coordSetPrice(set)
  const href = lookHref(set.slug)
  const saved = isWishlisted(set.topId, color)
  const chip = top?.benefitChip ?? bottom?.benefitChip ?? 'Look'
  const platform = top?.platform ?? bottom?.platform ?? 'SecondSkin™'

  return `
  <article class="product-card look-product-card" data-look-card="${set.id}" data-look-top="${set.topId}">
    <div class="product-card__media-wrap">
      <a class="product-card__media" href="${href}" aria-label="Shop ${set.name} look">
        ${lookMediaHTML(set, color)}
      </a>
      <span class="platform-badge ${platformBadgeClass(platform)}">${platform}</span>
      <button
        type="button"
        class="wish-btn ${saved ? 'is-on' : ''}"
        data-wish-toggle="${set.topId}"
        data-wish-color="${color}"
        aria-label="${saved ? 'Remove from saved' : 'Save for later'}"
        aria-pressed="${saved}"
      >${saved ? icon('heart-fill') : icon('heart')}</button>
    </div>
    <div class="product-card__body">
      <div class="product-card__meta product-card__meta--chips">
        <span class="benefit-chip">${chip}</span>
      </div>
      <a class="product-card__name" href="${href}">${set.name}</a>
      <div class="product-card__meta">
        <span class="product-card__price">${formatPrice(total)}</span>
        <div class="color-dots" aria-label="Colours">
          ${(['midnight', 'cardamom'] as Colorway[])
            .map(
              (c) =>
                `<button type="button" class="color-dot ${c === color ? 'is-active' : ''}" data-look-color="${c}" style="background:${COLORS[c].hex}" title="${COLORS[c].name}" aria-label="${COLORS[c].name}"></button>`,
            )
            .join('')}
        </div>
      </div>
      <div class="product-card__actions">
        <a class="btn btn--primary" href="${href}">Shop look</a>
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
      ? `<div class="cart-hint">Finish the look with the <a href="${productHref('RVL-SHT-004')}"><strong>Matching Short</strong></a>.</div>`
      : hasShort && !hasCrop
        ? `<div class="cart-hint">Finish the look with the <a href="${productHref('RVL-TNK-003-C')}"><strong>Built-in-Support Crop</strong></a>.</div>`
        : `<div class="cart-hint">Build a look - eight pairings in Midnight &amp; Cardamom.</div>`

  body.innerHTML += hint

  foot.innerHTML = `
    <div class="cart-subtotal"><span>Subtotal</span><strong>${formatPrice(cartSubtotal())}</strong></div>
    <a class="btn btn--primary btn--block" href="${pathPrefix()}checkout/">Checkout</a>
    <p class="eyebrow" style="text-align:center">Secure checkout · UPI, cards &amp; more</p>`
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
  const n = wishlistCount()
  document.querySelectorAll<HTMLElement>('[data-wish-count]').forEach((el) => {
    el.hidden = n === 0
    el.textContent = String(n)
  })
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
      const thumb = s.image
        ? `<span class="search-hit__thumb" aria-hidden="true"><img src="${assetHref(s.image)}" alt="" width="64" height="80" loading="lazy" decoding="async" /></span>`
        : `<span class="search-hit__thumb search-hit__thumb--empty" aria-hidden="true"></span>`
      return `
      <a class="search-hit" href="${s.href}">
        ${thumb}
        <span class="search-hit__copy">
          <span class="search-hit__type">${typeLabel}</span>
          <span class="search-hit__label">${s.label}</span>
          ${s.blurb ? `<span class="search-hit__blurb">${s.blurb}</span>` : ''}
        </span>
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
let sheetLookId: string | null = null
let sheetColor: Colorway = 'midnight'
let sheetSize: Size | null = null

function openSheet(productId: string, preferColor?: Colorway): void {
  const product = getProduct(productId)
  const sheet = document.querySelector('[data-sheet]')
  const overlay = document.querySelector('[data-sheet-overlay]')
  if (!product || !sheet || !overlay) return

  sheetProductId = productId
  sheetLookId = null
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

function openLookSheet(lookId: string, preferColor?: Colorway): void {
  const set = getCoordSet(lookId)
  const top = set ? getProduct(set.topId) : undefined
  const bottom = set ? getProduct(set.bottomId) : undefined
  const sheet = document.querySelector('[data-sheet]')
  const overlay = document.querySelector('[data-sheet-overlay]')
  if (!set || !top || !bottom || !sheet || !overlay) return

  sheetProductId = null
  sheetLookId = set.id
  sheetColor = preferColor === 'cardamom' ? 'cardamom' : 'midnight'
  sheetSize = null
  const total = coordSetPrice(set)

  sheet.innerHTML = `
    <div class="sheet__head">
      <div>
        <p class="eyebrow">Look</p>
        <h3>${set.name}</h3>
        <p class="product-card__price" style="margin-top:0.5rem">${formatPrice(total)}</p>
        <p style="margin-top:0.35rem;font-size:0.85rem;color:var(--color-ink-muted)">${top.shortName} + ${bottom.shortName}</p>
      </div>
      <button type="button" class="icon-btn" data-sheet-close aria-label="Close">${icon('close')}</button>
    </div>
    <p class="eyebrow" style="margin-bottom:0.75rem">Colour · both pieces</p>
    <div class="color-picker" data-sheet-colors>
      ${(['midnight', 'cardamom'] as Colorway[])
        .map(
          (c) =>
            `<button type="button" class="${c === sheetColor ? 'is-selected' : ''}" data-sheet-color="${c}" style="background:${COLORS[c].hex}" aria-label="${COLORS[c].name}"></button>`,
        )
        .join('')}
    </div>
    <p class="eyebrow" style="margin-bottom:0.75rem">Size · both pieces</p>
    <div class="size-grid" data-sheet-sizes>
      ${top.sizes.map((s) => `<button type="button" data-sheet-size="${s}">${s}</button>`).join('')}
    </div>
    <button class="btn btn--primary btn--block" type="button" data-sheet-confirm disabled>Add look to bag</button>
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
  sheetLookId = null
}

function syncSheetConfirm(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-sheet-confirm]')
  if (btn) btn.disabled = !sheetSize
}

function initAnnounceRail(root: ParentNode): void {
  const rail = root.querySelector<HTMLElement>('[data-announce]')
  const slides = [...(root.querySelectorAll<HTMLElement>('[data-announce-slide]') ?? [])]
  if (!rail || slides.length < 2) return

  let index = Math.max(
    0,
    slides.findIndex((s) => s.classList.contains('is-active')),
  )
  let timer: ReturnType<typeof setInterval> | null = null
  const delay = 4500
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const show = (next: number) => {
    index = (next + slides.length) % slides.length
    slides.forEach((slide, i) => {
      const on = i === index
      slide.classList.toggle('is-active', on)
      slide.setAttribute('aria-hidden', on ? 'false' : 'true')
      slide.querySelectorAll('a').forEach((link) => {
        if (on) link.removeAttribute('tabindex')
        else link.setAttribute('tabindex', '-1')
      })
    })
  }

  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const start = () => {
    if (reduceMotion) return
    stop()
    timer = setInterval(() => show(index + 1), delay)
  }

  root.querySelector('[data-announce-prev]')?.addEventListener('click', () => {
    show(index - 1)
    start()
  })
  root.querySelector('[data-announce-next]')?.addEventListener('click', () => {
    show(index + 1)
    start()
  })

  rail.addEventListener('mouseenter', stop)
  rail.addEventListener('mouseleave', start)
  rail.addEventListener('focusin', stop)
  rail.addEventListener('focusout', (e) => {
    if (!rail.contains(e.relatedTarget as Node | null)) start()
  })

  show(index)
  start()
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

  const page = root.querySelector('.page')
  const header = root.querySelector('[data-header]')
  const hasHero = Boolean(root.querySelector('.hero, .about-hero, .contact-hero'))
  if (hasHero) {
    page?.classList.add('page--hero')
    header?.classList.add('site-header--over-hero')
  }

  initAnnounceRail(root)

  root.querySelectorAll<HTMLElement>('[data-size-guide-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const initial = (btn.dataset.sgInitial as SizeGuideTab | undefined) || 'tops'
      openSizeGuide(initial)
    })
  })

  const footerCols = root.querySelectorAll<HTMLDetailsElement>('.site-footer__col')
  const syncFooterAccordion = () => {
    const desktop = window.matchMedia('(min-width: 900px)').matches
    footerCols.forEach((col, i) => {
      if (desktop) col.open = true
      else col.open = i === 0
    })
  }
  syncFooterAccordion()
  window.matchMedia('(min-width: 900px)').addEventListener('change', syncFooterAccordion)
  footerCols.forEach((col) => {
    col.querySelector('summary')?.addEventListener('click', (e) => {
      if (window.matchMedia('(min-width: 900px)').matches) e.preventDefault()
    })
  })

  const syncHeaderSolid = () => {
    const solid = window.scrollY > 24 || document.body.classList.contains('nav-open')
    header?.classList.toggle('is-scrolled', solid)
  }
  syncHeaderSolid()
  window.addEventListener('scroll', syncHeaderSolid, { passive: true })

  const mobileNav = root.querySelector<HTMLElement>('[data-mobile-nav]')
  const menuToggle = root.querySelector<HTMLButtonElement>('[data-menu-toggle]')
  const setMobileNav = (open: boolean) => {
    mobileNav?.classList.toggle('is-open', open)
    mobileNav?.setAttribute('aria-hidden', open ? 'false' : 'true')
    menuToggle?.setAttribute('aria-expanded', String(open))
    menuToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    if (menuToggle) menuToggle.innerHTML = open ? icon('close') : icon('menu')
    document.body.classList.toggle('nav-open', open)
    syncHeaderSolid()
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
    const setMegaPanel = (id: string) => {
      mega.querySelectorAll<HTMLElement>('[data-mega-panel]').forEach((panel) => {
        const active = panel.dataset.megaPanel === id
        panel.classList.toggle('is-active', active)
        panel.hidden = !active
      })
      mega.querySelectorAll<HTMLElement>('[data-mega-situation]').forEach((item) => {
        item.classList.toggle('is-active', item.dataset.megaSituation === id)
      })
    }
    const showDefaultMegaPanel = () => setMegaPanel('default')

    shopNav.querySelector('[data-mega-trigger]')?.addEventListener('mouseenter', openMega)
    mega.addEventListener('mouseenter', openMega)
    shopNav.addEventListener('mouseleave', () => {
      scheduleCloseMega()
      showDefaultMegaPanel()
    })
    shopNav.addEventListener('focusin', openMega)
    shopNav.addEventListener('focusout', (e) => {
      if (!shopNav.contains(e.relatedTarget as Node)) {
        closeMega()
        showDefaultMegaPanel()
      }
    })
    mega.querySelectorAll<HTMLElement>('[data-mega-situation]').forEach((item) => {
      const id = item.dataset.megaSituation
      if (!id) return
      item.addEventListener('mouseenter', () => setMegaPanel(id))
      item.addEventListener('focus', () => setMegaPanel(id))
    })
    mega.querySelector('[data-mega-aside]')?.addEventListener('mouseenter', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-mega-panel="default"]') || target.closest('.mega__feature')) {
        showDefaultMegaPanel()
      }
    })
    mega.querySelector('.mega__col')?.addEventListener('mouseleave', (e) => {
      const related = (e as MouseEvent).relatedTarget as Node | null
      if (related && mega.querySelector('[data-mega-aside]')?.contains(related)) return
      showDefaultMegaPanel()
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
      if (!shopNav.contains(e.target as Node)) {
        closeMega()
        showDefaultMegaPanel()
      }
    })
    root.querySelectorAll<HTMLElement>('.site-nav > .site-nav__link').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        closeMega()
        showDefaultMegaPanel()
      })
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

    const lookColorDot = t.closest<HTMLElement>('[data-look-color]')
    if (lookColorDot?.dataset.lookColor) {
      e.preventDefault()
      e.stopPropagation()
      const card = lookColorDot.closest('[data-look-card]')
      const lookId = card?.getAttribute('data-look-card')
      const colorId = lookColorDot.dataset.lookColor as Colorway
      const media = card?.querySelector<HTMLElement>('.product-card__media, .pdp-get-look__media')
      const set = lookId ? getCoordSet(lookId) : undefined
      if (media && set) {
        if (media.classList.contains('pdp-get-look__media')) {
          const [front] = getCoordImages(set, colorId)
          media.innerHTML = `<img src="${assetHref(front)}" alt="" width="480" height="720" loading="lazy" decoding="async" />`
        } else {
          media.innerHTML = lookMediaHTML(set, colorId)
        }
      }
      card?.querySelectorAll('[data-look-color]').forEach((d) => d.classList.remove('is-active'))
      lookColorDot.classList.add('is-active')
      const wishBtn = card?.querySelector<HTMLElement>('[data-wish-toggle]')
      if (wishBtn) {
        wishBtn.dataset.wishColor = colorId
        const on = isWishlisted(wishBtn.dataset.wishToggle!, colorId)
        wishBtn.classList.toggle('is-on', on)
        wishBtn.innerHTML = on ? icon('heart-fill') : icon('heart')
      }
      return
    }

    const colorDot = t.closest<HTMLElement>('[data-card-color]')
    if (colorDot?.dataset.cardColorId || colorDot?.hasAttribute('data-card-color')) {
      e.preventDefault()
      e.stopPropagation()
      const card = colorDot.closest('[data-product-card]')
      const media = card?.querySelector<HTMLElement>('.product-card__media, .pdp-get-look__media')
      const productId = card?.getAttribute('data-product-card')
      const product = productId ? getProduct(productId) : undefined
      const colorId = (colorDot.dataset.cardColorId as Colorway) || undefined
      if (media && product && colorId) {
        if (media.classList.contains('pdp-get-look__media')) {
          const photo = getProductImage(product, colorId)
          media.innerHTML = photo
            ? `<img src="${assetHref(photo)}" alt="" width="480" height="720" loading="lazy" decoding="async" />`
            : ''
        } else {
          media.innerHTML = mediaPanelHTML(product, colorId)
        }
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
    const quickLook = t.closest<HTMLElement>('[data-quick-add-look]')
    if (quickLook?.dataset.quickAddLook) {
      const card = quickLook.closest<HTMLElement>('[data-look-card]')
      const activeDot = card?.querySelector<HTMLElement>('.color-dot.is-active')
      const prefer = activeDot?.dataset.lookColor as Colorway | undefined
      openLookSheet(quickLook.dataset.quickAddLook, prefer)
      return
    }
    const quick = t.closest<HTMLElement>('[data-quick-add]')
    if (quick?.dataset.quickAdd) {
      const card = quick.closest<HTMLElement>('[data-look-card], [data-product-card]')
      const activeDot = card?.querySelector<HTMLElement>('.color-dot.is-active')
      const prefer =
        (activeDot?.dataset.lookColor as Colorway | undefined) ||
        (activeDot?.dataset.cardColorId as Colorway | undefined)
      openSheet(quick.dataset.quickAdd, prefer)
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
    if (t.closest('[data-sheet-confirm]') && sheetSize) {
      if (sheetLookId) {
        const set = getCoordSet(sheetLookId)
        if (set) addCoordSet(sheetColor, sheetSize, set.topId, set.bottomId)
      } else if (sheetProductId) {
        addToCart(sheetProductId, sheetColor, sheetSize, 1)
      } else {
        return
      }
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
