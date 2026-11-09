import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import {
  mountShell,
  productCardHTML,
  lookCardHTML,
  products,
  shopHref,
  assetHref,
  lookHref,
} from '../ui/shell'
import {
  COORD_SET,
  COORD_SETS,
  FABRIC_PLATFORMS,
  REVIEWS,
  SITUATIONS,
  coordSetPrice,
  formatPrice,
  getCoordImages,
  type Size,
} from '../data/products'
import { addToCart, addCoordSet } from '../cart'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const [coordMidnightFront, coordMidnightAlt] = getCoordImages(COORD_SET, 'midnight')
const [coordCardamomFront, coordCardamomAlt] = getCoordImages(COORD_SET, 'cardamom')

interface HeroLook {
  index: string
  title: string
  price: string
  mrp: number
  color: 'cardamom' | 'midnight'
  thumb: string
  type: 'photo' | 'video'
  bgDesktop?: string
  bgMobile?: string
  videoDesktop?: string
  videoMobile?: string
  badge: string
  topId: string
  bottomId: string
  lookTheme: string
}

const HERO_LOOKS: HeroLook[] = [
  {
    index: '01',
    title: 'Crop + Leggings Set • Cardamom',
    price: formatPrice(3298),
    mrp: 3298,
    color: 'cardamom',
    thumb: 'media/coords/crop-leggings-cardamom-1.png',
    type: 'photo',
    bgDesktop: 'media/hero-slide-1-master.jpg',
    bgMobile: 'media/hero-slide-1-mobile.jpg',
    badge: '01 / 05',
    topId: 'RVL-TNK-003-C',
    bottomId: 'RVL-LEG-001',
    lookTheme: 'Seated Studio Calm',
  },
  {
    index: '02',
    title: 'Sports Bra + Leggings Set • Cardamom',
    price: formatPrice(3398),
    mrp: 3398,
    color: 'cardamom',
    thumb: 'media/coords/bra-leggings-cardamom-1.png',
    type: 'photo',
    bgDesktop: 'media/hero-slide-2.jpg',
    bgMobile: 'media/hero-slide-2-mobile.jpg',
    badge: '02 / 05',
    topId: 'RVL-BRA-002',
    bottomId: 'RVL-LEG-001',
    lookTheme: 'Architectural Stucco & Palms',
  },
  {
    index: '03',
    title: 'Sports Bra + Shorts Set • Midnight',
    price: formatPrice(3198),
    mrp: 3198,
    color: 'midnight',
    thumb: 'media/coords/bra-shorts-midnight-1.png',
    type: 'photo',
    bgDesktop: 'media/hero-slide-3.jpg',
    bgMobile: 'media/hero-slide-3-mobile.jpg',
    badge: '03 / 05',
    topId: 'RVL-BRA-002',
    bottomId: 'RVL-SHT-004',
    lookTheme: 'Fluid Flow & Movement',
  },
  {
    index: '04',
    title: 'Crop + Shorts Set • Cardamom',
    price: formatPrice(3098),
    mrp: 3098,
    color: 'cardamom',
    thumb: 'media/coords/crop-shorts-cardamom-1.png',
    type: 'photo',
    bgDesktop: 'media/hero-slide-4.jpg',
    bgMobile: 'media/hero-slide-4-mobile.jpg',
    badge: '04 / 05',
    topId: 'RVL-TNK-003-C',
    bottomId: 'RVL-SHT-004',
    lookTheme: 'Sculptural Courtyard Serenity',
  },
  {
    index: '05',
    title: 'Motion Movement Set • Cardamom',
    price: formatPrice(3298),
    mrp: 3298,
    color: 'cardamom',
    thumb: 'media/coords/crop-leggings-cardamom-2.png',
    type: 'video',
    videoDesktop: 'media/hero-desktop.mp4',
    videoMobile: 'media/hero-mobile.mp4',
    badge: '05 / 05',
    topId: 'RVL-TNK-003-C',
    bottomId: 'RVL-LEG-001',
    lookTheme: 'Movement in Motion • Live Film',
  },
]

const PROMISE_FILMS = [
  {
    id: 'no-patch',
    title: 'No patch',
    spec: 'Zoned sweat-barriers',
    shortBenefit: 'Zoned barriers keep outer face dry',
    src: 'media/promise/no-patch.mp4',
    bentoClass: 'promise-bento__card--tall-left',
  },
  {
    id: 'no-smell',
    title: 'No smell',
    spec: 'Silver-ion freshness',
    shortBenefit: 'Silver-ion anti-odor at fibre level',
    src: 'media/promise/no-smell.mp4',
    bentoClass: 'promise-bento__card--center-top',
  },
  {
    id: 'no-rub',
    title: 'No rub',
    spec: 'Zero chafing',
    shortBenefit: 'Friction-free seamless construction',
    src: 'media/promise/no-rub.mp4',
    bentoClass: 'promise-bento__card--center-bottom',
  },
  {
    id: 'no-ride-up',
    title: 'No ride-up',
    spec: 'No-slip bands',
    shortBenefit: 'Stay-put bands that never roll',
    src: 'media/promise/no-ride-up.mp4',
    bentoClass: 'promise-bento__card--tall-right',
  },
] as const

app.innerHTML = `<div data-page-content>
  <section class="hero hero--editorial" id="hero" data-hero-container>
    <div class="hero__editorial-media" aria-hidden="true" data-hero-media>
      <!-- Unified Slides Layer: 4 Editorial Looks + 1 Live Motion Film -->
      <div class="hero__slides-layer" data-hero-slides-layer>
        ${HERO_LOOKS.map((look, idx) => {
          if (look.type === 'video') {
            return `
            <div class="hero__slide-item hero__slide-item--video ${idx === 0 ? 'is-active' : ''}" data-hero-slide="${idx}">
              <video
                class="hero__video-el hero__video-el--desktop"
                muted
                playsinline
                loop
                preload="auto"
                autoplay
                data-hero-video-desktop
              >
                <source src="${assetHref(look.videoDesktop!)}" type="video/mp4" />
              </video>
              <video
                class="hero__video-el hero__video-el--mobile"
                muted
                playsinline
                loop
                preload="auto"
                autoplay
                data-hero-video-mobile
              >
                <source src="${assetHref(look.videoMobile!)}" type="video/mp4" />
              </video>
            </div>`
          }
          return `
          <picture class="hero__slide-item ${idx === 0 ? 'is-active' : ''}" data-hero-slide="${idx}">
            <source media="(max-width: 899px)" srcset="${assetHref(look.bgMobile!)}" />
            <img src="${assetHref(look.bgDesktop!)}" alt="${look.title} - ${look.lookTheme}" class="hero__slide-photo" loading="${idx === 0 ? 'eager' : 'lazy'}" />
          </picture>`
        }).join('')}
      </div>

      <div class="hero__editorial-overlay"></div>
    </div>

    <div class="hero__container">
      <div class="hero__grid">
        <!-- Left Column: Brand, Tagline, Vision & Conversion Action -->
        <div class="hero__lead">
          <div class="hero__eyebrow-wrap">
            <img src="${assetHref('brand/rivlet-mark-light.png')}" alt="" class="hero__wave-mark-icon" width="22" height="22" aria-hidden="true" />
            <p class="hero__eyebrow-ref">WOMEN'S COLLECTION</p>
          </div>

          <h1 class="hero__headline">
            <span class="sr-only">Rivlet</span>
            <img src="${assetHref('brand/rivlet-hero-wordmark.png')}" alt="Rivlet" class="hero__brand-wordmark" width="938" height="273" />
          </h1>

          <p class="hero__motto">Move like water, feel like air.</p>
          <p class="hero__support">
            A wardrobe engineered for tropical heat and long days. Zero-patch, scent-resistant, natural-craft. Indian-crafted, globally held.
          </p>

          <div class="hero__actions">
            <a class="btn-hero btn-hero--primary" href="${shopHref()}">
              <span>EXPLORE COLLECTION</span>
              <span class="btn-hero__arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          <!-- Bottom Meta Metrics & Review Proof -->
          <div class="hero__meta-row">
            <div class="hero__slide-counter" aria-label="Slide 1 of 5">
              <span class="hero__slide-curr" data-hero-curr>01</span>
              <span class="hero__slide-sep">/</span>
              <span class="hero__slide-total">05</span>
            </div>

            <a class="hero__scroll-down" href="#the-friction" data-scroll-to="#the-friction" aria-label="Scroll to discover">
              <span>SCROLL TO DISCOVER</span>
              <span class="hero__scroll-arrow" aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <!-- Right Column: Floating "SHOP THE LOOK" Frosted Glass Card -->
        <div class="hero__aside">
          <div class="shop-look-card" data-shop-look>
            <div class="shop-look-card__head">
              <span class="shop-look-card__label">SHOP THE LOOK</span>
            </div>

            <div class="shop-look-card__body">
              <div class="shop-look-card__thumb-wrap">
                <img
                  class="shop-look-card__thumb"
                  src="${assetHref(HERO_LOOKS[0].thumb)}"
                  alt="${HERO_LOOKS[0].title}"
                  data-look-thumb
                />
              </div>

              <div class="shop-look-card__details">
                <h3 class="shop-look-card__title" data-look-title>
                  ${HERO_LOOKS[0].title}
                </h3>
                <p class="shop-look-card__price" data-look-price>${HERO_LOOKS[0].price}</p>

                <!-- Interactive Size Selector Pills -->
                <div class="shop-look-card__sizes" role="radiogroup" aria-label="Select size">
                  <button type="button" class="size-pill" data-size-pill="XS" aria-label="Size XS">XS</button>
                  <button type="button" class="size-pill is-selected" data-size-pill="S" aria-label="Size S">S</button>
                  <button type="button" class="size-pill" data-size-pill="M" aria-label="Size M">M</button>
                  <button type="button" class="size-pill" data-size-pill="L" aria-label="Size L">L</button>
                </div>

                <!-- Add to Bag CTA Button -->
                <button
                  type="button"
                  class="btn-shop-look"
                  data-add-look-btn
                  aria-label="Add ${HERO_LOOKS[0].title} to bag"
                >
                  <span class="btn-shop-look__text">ADD TO BAG</span>
                  <span class="btn-shop-look__icon" aria-hidden="true">+</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Lookbook Thumbnail Selector Bar Below Card -->
          <div class="hero-carousel-bar" aria-label="Look angles switcher">
            <button
              type="button"
              class="carousel-nav-btn carousel-nav-btn--prev"
              data-look-prev
              aria-label="Previous look"
            >
              ‹
            </button>

            <div class="hero-carousel-thumbs" role="tablist">
              ${HERO_LOOKS.map(
                (look, i) => `
                <button
                  type="button"
                  class="carousel-thumb ${i === 0 ? 'is-active' : ''}"
                  data-look-index="${i}"
                  role="tab"
                  aria-selected="${i === 0 ? 'true' : 'false'}"
                  aria-label="Look ${look.index} - ${look.title}"
                  title="${look.title}"
                >
                  <img src="${assetHref(look.thumb)}" alt="${look.title}" />
                </button>`,
              ).join('')}
            </div>

            <button
              type="button"
              class="carousel-nav-btn carousel-nav-btn--next"
              data-look-next
              aria-label="Next look"
            >
              ›
            </button>
          </div>

          <!-- Live Progress Bar Indicator -->
          <div class="hero-progress-bar" aria-hidden="true" title="Auto-advance live progression">
            <div class="hero-progress-fill" data-hero-progress></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section friction-promise" id="the-friction" data-promise-section>
    <div id="the-promise" class="friction-promise__anchor" aria-hidden="true"></div>

    <!-- The 4 Promises Floating Trust Dock -->
    <aside class="promises-dock" aria-label="Rivlet four climate-engineered promises">
      <div class="promises-pill" role="region" aria-label="The 4 Rivlet Promises">
        <a class="promises-pill__item" href="#promise-no-patch" data-scroll-to="#promise-no-patch" aria-label="No patch - Zoned sweat barriers">
          <span class="promises-pill__icon-wrap" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2.8 L4.5 6 V11.8 C4.5 16.4 7.7 20.4 12 21.6 C16.3 20.4 19.5 16.4 19.5 11.8 V6 L12 2.8 Z" />
              <path d="M12 7.8 C12 7.8 9.5 11 9.5 12.8 A2.5 2.5 0 0 0 14.5 12.8 C14.5 11 12 7.8 12 7.8 Z" />
            </svg>
          </span>
          <div class="promises-pill__text">
            <strong class="promises-pill__title">NO PATCH</strong>
            <span class="promises-pill__sub">(Zoned sweat-barriers)</span>
          </div>
        </a>

        <span class="promises-pill__divider" aria-hidden="true"></span>

        <a class="promises-pill__item" href="#promise-no-smell" data-scroll-to="#promise-no-smell" aria-label="No smell - Silver-ion freshness">
          <span class="promises-pill__icon-wrap" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2.5 L13.8 8.8 L20 10.5 L13.8 12.2 L12 18.5 L10.2 12.2 L4 10.5 L10.2 8.8 Z" />
              <path d="M19 3.5 L19.6 5.5 L21.5 6.1 L19.6 6.7 L19 8.7 L18.4 6.7 L16.5 6.1 L18.4 5.5 Z" stroke-width="1.6" />
              <circle cx="5.5" cy="18.5" r="1.3" fill="currentColor" />
            </svg>
          </span>
          <div class="promises-pill__text">
            <strong class="promises-pill__title">NO SMELL</strong>
            <span class="promises-pill__sub">(Silver-ion freshness)</span>
          </div>
        </a>

        <span class="promises-pill__divider" aria-hidden="true"></span>

        <a class="promises-pill__item" href="#promise-no-rub" data-scroll-to="#promise-no-rub" aria-label="No rub - Zero chafing">
          <span class="promises-pill__icon-wrap" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.5 3.5 C13.5 9.5 8.5 15 3.5 20.5" />
              <path d="M20.5 3.5 C12 4.2 6.8 9.5 6.8 16.2 C10.8 15.5 16.2 11.8 20.5 3.5 Z" />
              <path d="M10.8 13.2 L14.8 11.5" stroke-width="1.8" />
              <path d="M8.2 16.5 L12.2 14.8" stroke-width="1.8" />
            </svg>
          </span>
          <div class="promises-pill__text">
            <strong class="promises-pill__title">NO RUB</strong>
            <span class="promises-pill__sub">(Zero chafing)</span>
          </div>
        </a>

        <span class="promises-pill__divider" aria-hidden="true"></span>

        <a class="promises-pill__item" href="#promise-no-ride-up" data-scroll-to="#promise-no-ride-up" aria-label="No ride-up - No-slip bands">
          <span class="promises-pill__icon-wrap" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="5" r="2.2" />
              <line x1="12" y1="7.2" x2="12" y2="19.5" />
              <line x1="7.5" y1="10.5" x2="16.5" y2="10.5" />
              <path d="M5.5 14 C5.5 17.8 8.4 20 12 20 C15.6 20 18.5 17.8 18.5 14" />
              <polyline points="4 15, 5.5 13.5, 7 15" />
              <polyline points="17 15, 18.5 13.5, 20 15" />
            </svg>
          </span>
          <div class="promises-pill__text">
            <strong class="promises-pill__title">NO RIDE-UP</strong>
            <span class="promises-pill__sub">(No-slip bands)</span>
          </div>
        </a>
      </div>
    </aside>

    <div class="container container--wide">
      <div class="friction-promise__grid">
        <!-- Left: Editorial Problem & Technical Promise Narrative -->
        <div class="friction-promise__content">
          <div class="friction-promise__eyebrow-wrap">
            <span class="friction-promise__badge-dot" aria-hidden="true"></span>
            <span class="friction-promise__eyebrow">THE FRICTION &amp; THE PROMISE</span>
          </div>

          <h2 class="display friction-promise__headline">Western activewear wasn’t built for this climate.</h2>

          <p class="friction-promise__lede">
            In tropical humidity, sweat spreads and synthetics cling. We engineered four non-negotiable promises so your kit stays weightless, dry, and completely invisible on skin.
          </p>

          <div class="friction-promise__pillars" role="list">
            ${PROMISE_FILMS.map(
              (f, idx) => `
              <div class="friction-promise__pillar ${idx === 0 ? 'is-active' : ''}" data-pillar="${f.id}" role="listitem" tabindex="0">
                <span class="friction-promise__pillar-idx">0${idx + 1}</span>
                <div class="friction-promise__pillar-body">
                  <strong class="friction-promise__pillar-title">${f.title}</strong>
                  <span class="friction-promise__pillar-dot" aria-hidden="true">·</span>
                  <span class="friction-promise__pillar-short">${f.shortBenefit}</span>
                </div>
                <span class="friction-promise__pillar-arrow" aria-hidden="true">↗</span>
              </div>`,
            ).join('')}
          </div>

          <div class="friction-promise__cta-row">
            <a class="btn-editorial-explore" href="${shopHref()}">
              <span>EXPLORE THE COLLECTION</span>
              <span class="btn-arrow-icon" aria-hidden="true">↗</span>
            </a>
            <a class="friction-promise__text-link" href="#situations" data-scroll-to="#situations">
              <span>SHOP BY SITUATION</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <!-- Right: Interactive Expanding Video Gallery -->
        <div class="friction-promise__gallery" role="region" aria-label="Rivlet 4 Promises demonstration films">
          <div class="friction-promise__accordion" data-promise-accordion>
            ${PROMISE_FILMS.map(
              (f, idx) => `
              <article
                class="promise-film promise-accordion__card ${idx === 0 ? 'is-expanded' : ''}"
                id="promise-${f.id}"
                data-promise-id="${f.id}"
                role="listitem"
                tabindex="0"
                aria-label="${f.title} - ${f.spec}"
              >
                <div class="promise-film__media" aria-hidden="true">
                  <video
                    class="promise-film__video"
                    muted
                    loop
                    playsinline
                    preload="metadata"
                    data-promise-video
                    data-src="${assetHref(f.src)}"
                  ></video>
                </div>
                <div class="promise-accordion__scrim" aria-hidden="true"></div>
                <div class="promise-bento__pill-badge">
                  <span class="promise-bento__badge-label">${f.title}</span>
                  <span class="promise-bento__badge-sub">${f.spec}</span>
                </div>
                <div class="promise-bento__spec-pill" aria-hidden="true">
                  <span>${f.spec}</span>
                </div>
              </article>`,
            ).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section situations" id="situations">
    <div class="container">
      <div class="section-head section-head--situations">
        <p class="eyebrow">Shop by situation</p>
        <h2 class="display">Where the day takes you.</h2>
        <p class="lede">Five moments. One wardrobe engineered for each.</p>
      </div>
    </div>
    <div class="situation-runway" role="list" data-situation-rail>
      ${SITUATIONS.map(
        (s) => `
        <a class="situation-panel" href="${shopHref({ situation: s.id })}" role="listitem">
          <img class="situation-panel__img" src="${assetHref(s.image)}" alt="" width="900" height="1200" loading="lazy" />
          <span class="situation-panel__veil" aria-hidden="true"></span>
          <span class="situation-panel__meta">
            <strong class="situation-panel__title">${s.label}</strong>
            <span class="situation-panel__blurb">${s.blurb}</span>
            <span class="situation-panel__cta">View edit</span>
          </span>
        </a>`,
      ).join('')}
    </div>
  </section>

  <section class="section split-shop-home">
    <div class="container">
      <div class="split-shop">
        <a class="split-shop__tile" href="${shopHref({ form: 'tops' })}">
          <img class="split-shop__img" src="${assetHref('media/forms/tops.png')}" alt="" width="900" height="1100" loading="lazy" />
          <span class="split-shop__copy">
            <span class="eyebrow">Form</span>
            <strong>Tops</strong>
            <span>Bras · tanks · tee</span>
          </span>
        </a>
        <a class="split-shop__tile" href="${shopHref({ form: 'bottoms' })}">
          <img class="split-shop__img" src="${assetHref('media/forms/bottoms.png')}" alt="" width="900" height="1100" loading="lazy" />
          <span class="split-shop__copy">
            <span class="eyebrow">Form</span>
            <strong>Bottoms</strong>
            <span>Leggings · shorts</span>
          </span>
        </a>
      </div>
    </div>
  </section>

  <section class="section coord-home" id="looks">
    <div class="container">
      <div class="coord-band">
        <div class="coord-visual">
          <a class="coord-visual__panel" href="${lookHref(COORD_SET.slug)}" aria-label="${COORD_SET.name} in Midnight">
            <img class="coord-visual__img" src="${assetHref(coordMidnightFront)}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
            <img class="coord-visual__img coord-visual__img--alt" src="${assetHref(coordMidnightAlt)}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
          </a>
          <a class="coord-visual__panel" href="${lookHref(COORD_SET.slug)}" aria-label="${COORD_SET.name} in Cardamom">
            <img class="coord-visual__img" src="${assetHref(coordCardamomFront)}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
            <img class="coord-visual__img coord-visual__img--alt" src="${assetHref(coordCardamomAlt)}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
          </a>
        </div>
        <div class="coord-band__copy">
          <p class="eyebrow">Looks</p>
          <h2 class="display coord-band__title">One decision. Fully dressed.</h2>
          <p class="lede coord-band__lede">
            <span class="coord-band__lede-full">Bra, crop, tank, tee - matched to shorts or leggings in Midnight and Cardamom. Tap a look to open the look checkout.</span>
            <span class="coord-band__lede-short">Matched sets in Midnight &amp; Cardamom. Tap a look to shop.</span>
          </p>
          <p class="coord-band__price">
            From ${formatPrice(Math.min(...COORD_SETS.map((s) => coordSetPrice(s))))} · featured ${COORD_SET.name} ${formatPrice(coordSetPrice(COORD_SET))}
          </p>
          <a class="btn btn--primary" href="${lookHref(COORD_SET.slug)}">Shop this look</a>
        </div>
      </div>

      <div class="section-head coord-home__gallery-head section-head--center">
        <p class="eyebrow">Walk-out ready</p>
        <h2 class="display">Pick the look. Skip the guesswork.</h2>
        <p class="lede">Every pairing is shoppable - straight to the product page.</p>
      </div>
      <div class="product-grid look-grid look-grid--home" aria-label="Walk-out ready looks">
        ${COORD_SETS.map((s) => lookCardHTML(s)).join('')}
      </div>
      <p class="looks-more">
        <a class="btn btn--primary" href="./sets/">Explore all looks</a>
      </p>
    </div>
  </section>

  <section class="section collection-home">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Collection</p>
        <h2 class="display">Six pieces. Fifteen daily problems owned.</h2>
        <p class="lede">Midnight and Cardamom. XS-2XL. Engineered for South Asian bodies and hard-water realities.</p>
      </div>
      <div class="product-grid">
        ${products.map((p) => productCardHTML(p)).join('')}
      </div>
    </div>
  </section>

  <section class="section platforms">
    <div class="container">
      <div class="section-head section-head--platforms">
        <p class="eyebrow">Fabric platforms</p>
        <h2 class="display">Named tech. Clear outcomes.</h2>
        <p class="lede">AquaFlow™ · SecondSkin™ · NeutralCore™ - shop by what the fabric does, then read the proof.</p>
      </div>
    </div>
    <div class="platform-runway" role="list">
      ${FABRIC_PLATFORMS.map(
        (f) => `
        <a class="platform-card" href="${shopHref({ platform: f.id })}" role="listitem" aria-label="${f.label}">
          <img class="platform-card__img" src="${assetHref(f.image)}" alt="" width="1200" height="1500" loading="lazy" decoding="async" />
          <span class="platform-card__veil" aria-hidden="true"></span>
          <span class="platform-card__meta">
            <span class="platform-card__label">${f.label}</span>
            <strong class="platform-card__title">${f.outcome}</strong>
            <span class="platform-card__go">Shop <span aria-hidden="true">→</span></span>
          </span>
        </a>`,
      ).join('')}
    </div>
    <div class="platforms-foot">
      <p class="platforms-foot__line">
        How AquaFlow™, SecondSkin™, and NeutralCore™ earn their names - and what that means on your body.
      </p>
      <a class="platforms-foot__btn" href="./stories/">Learn the platforms</a>
    </div>
  </section>

  <section class="section why-holds" id="why-it-holds">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Why it holds</p>
        <h2 class="display">Built for the climate you live in.</h2>
      </div>
      <div class="why-holds__grid">
        <div class="why-holds__card">
          <div class="why-holds__icon" aria-hidden="true">
            <svg width="60" height="60" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Waist & Torso Proportions -->
              <path d="M20 12 C23 22, 26 30, 22 38 C17 46, 14 54, 14 62" stroke="#140F0A" stroke-width="2.4" stroke-linecap="round"/>
              <path d="M52 12 C49 22, 46 30, 50 38 C55 46, 58 54, 58 62" stroke="#140F0A" stroke-width="2.4" stroke-linecap="round"/>
              <circle cx="36" cy="40" r="1.8" fill="#140F0A"/>
              <!-- Tape Roll / Coil on Left -->
              <ellipse cx="12" cy="38" rx="6" ry="4" stroke="#140F0A" stroke-width="2.4" fill="#FAF7F2"/>
              <path d="M7 38 C7 44, 12 48, 18 46" stroke="#140F0A" stroke-width="2.4" fill="none"/>
              <!-- Measuring Tape wrapping waist -->
              <path d="M14 40 C24 45, 48 45, 58 40 L58 47 C48 52, 24 52, 14 47 Z" stroke="#140F0A" stroke-width="2.4" fill="#FAF7F2" stroke-linejoin="round"/>
              <line x1="21" y1="42.5" x2="21" y2="47.5" stroke="#140F0A" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="28" y1="43.5" x2="28" y2="48.5" stroke="#140F0A" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="36" y1="44" x2="36" y2="49" stroke="#140F0A" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="44" y1="43.5" x2="44" y2="48.5" stroke="#140F0A" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="51" y1="42.5" x2="51" y2="47.5" stroke="#140F0A" stroke-width="1.8" stroke-linecap="round"/>
              <!-- Inward Guideline Arrow -->
              <line x1="64" y1="26" x2="53" y2="26" stroke="#140F0A" stroke-width="2.4" stroke-linecap="round"/>
              <polyline points="57 22, 53 26, 57 30" stroke="#140F0A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="why-holds__title">Proportioned for South Asian Bodies</h3>
          <p class="why-holds__copy">Graded for real proportions - including cup-inclusive support on bras and tanks.</p>
        </div>

        <div class="why-holds__card">
          <div class="why-holds__icon" aria-hidden="true">
            <svg width="60" height="60" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Center Water Droplet -->
              <path d="M36 8 C36 8, 26 21, 26 28 A10 10 0 0 0 46 28 C46 21, 36 8, 36 8 Z" stroke="#140F0A" stroke-width="2.4" stroke-linejoin="round" fill="#FAF7F2"/>
              <!-- Left Droplet -->
              <path d="M20 16 C20 16, 14 24, 14 28.5 A6.5 6.5 0 0 0 27 28.5 C27 24, 20 16, 20 16 Z" stroke="#140F0A" stroke-width="2.4" stroke-linejoin="round" fill="#FAF7F2"/>
              <!-- Right Droplet -->
              <path d="M52 16 C52 16, 45 24, 45 28.5 A6.5 6.5 0 0 0 58 28.5 C58 24, 52 16, 52 16 Z" stroke="#140F0A" stroke-width="2.4" stroke-linejoin="round" fill="#FAF7F2"/>
              <!-- Mineral Water Ripple Waves -->
              <path d="M9 44 C15 39, 21 39, 27 44 C33 49, 39 49, 45 44 C51 39, 57 39, 63 44" stroke="#140F0A" stroke-width="2.4" stroke-linecap="round"/>
              <path d="M9 52 C15 47, 21 47, 27 52 C33 57, 39 57, 45 52 C51 47, 57 47, 63 52" stroke="#140F0A" stroke-width="2.4" stroke-linecap="round"/>
              <path d="M9 60 C15 55, 21 55, 27 60 C33 65, 39 65, 45 60 C51 55, 57 55, 63 60" stroke="#140F0A" stroke-width="2.4" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="why-holds__title">Hard-Water Colorfastness</h3>
          <p class="why-holds__copy">Colourfast and shape-holding yarn chemistry for mineral-heavy laundry cycles.</p>
        </div>

        <div class="why-holds__card">
          <div class="why-holds__icon" aria-hidden="true">
            <svg width="60" height="60" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Botanical Leaf on Left -->
              <path d="M10 50 C10 30, 22 16, 36 16 C36 36, 24 50, 10 50 Z" stroke="#140F0A" stroke-width="2.4" stroke-linejoin="round" fill="#FAF7F2"/>
              <path d="M10 50 C18 42, 27 32, 36 16" stroke="#140F0A" stroke-width="2.4" stroke-linecap="round"/>
              <path d="M19 40 L26 38" stroke="#140F0A" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M23 33 L30 30" stroke="#140F0A" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M27 25 L33 22" stroke="#140F0A" stroke-width="1.8" stroke-linecap="round"/>
              <!-- Rosette Certificate Badge on Right -->
              <path d="M 65.0 30.0 Q 67.7 33.9 63.4 36.0 Q 63.7 40.7 59.0 40.4 Q 56.9 44.7 53.0 42.0 Q 49.1 44.7 47.0 40.4 Q 42.3 40.7 42.6 36.0 Q 38.3 33.9 41.0 30.0 Q 38.3 26.1 42.6 24.0 Q 42.3 19.3 47.0 19.6 Q 49.1 15.3 53.0 18.0 Q 56.9 15.3 59.0 19.6 Q 63.7 19.3 63.4 24.0 Q 67.7 26.1 65.0 30.0 Z" stroke="#140F0A" stroke-width="2.2" stroke-linejoin="round" fill="#FAF7F2"/>
              <circle cx="53" cy="30" r="9.5" stroke="#140F0A" stroke-width="2" fill="none"/>
              <!-- Checkmark inside Badge -->
              <polyline points="48 30, 51.5 33.5, 58 26" stroke="#140F0A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Ribbon Tails Below Badge -->
              <path d="M46 41 L42 58 L47.5 54 L52 58 L50.5 42.5" stroke="#140F0A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M55.5 42.5 L54 58 L58.5 54 L64 58 L60 41" stroke="#140F0A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="why-holds__title">OEKO-TEX® Standard 100</h3>
          <p class="why-holds__copy">OEKO-TEX® Standard 100 validation across the range. Gentle on skin, built to endure.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="voices">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Early voices</p>
        <h2 class="display">Why women stay in it.</h2>
      </div>
      <div class="reviews" role="list" aria-label="Customer reviews">
        ${REVIEWS.map(
          (r) => `
          <blockquote class="review-card" role="listitem">
            <p>“${r.text}”</p>
            <span>${r.name} · ${r.city} · ${'★'.repeat(r.stars)}</span>
          </blockquote>`,
        ).join('')}
      </div>
    </div>
  </section>

  <section class="section final-cta" id="community">
    <div class="final-cta__media" aria-hidden="true">
      <img
        class="final-cta__img"
        src="${assetHref('media/circle-bg.png')}"
        alt=""
        width="2048"
        height="2048"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="final-cta__veil" aria-hidden="true"></div>
    <div class="final-cta__inner">
      <p class="eyebrow final-cta__eyebrow">The circle</p>
      <h2 class="display final-cta__title">Every ocean was first fed by a rivlet.</h2>
      <p class="final-cta__lede">Be a rivlet in our ocean. Early drops, fabric notes, and the quiet circle - first.</p>
      <form class="community-join" data-community-join novalidate>
        <div class="community-join__row">
          <div class="community-join__field">
            <label class="community-join__label" for="community-email">Your email</label>
            <input
              id="community-email"
              name="email"
              type="email"
              required
              autocomplete="email"
              inputmode="email"
              placeholder="name@domain.com"
              class="community-join__input"
            />
          </div>
          <button class="community-join__btn" type="submit">
            <span>Join the ocean</span>
            <span class="community-join__arrow" aria-hidden="true">→</span>
          </button>
        </div>
        <p class="community-join__hint" data-community-hint>Private list. No noise - only the tide.</p>
      </form>
    </div>
  </section>
</div>`

mountShell(app)

function bindCommunityJoin(): void {
  const form = document.querySelector<HTMLFormElement>('[data-community-join]')
  const hint = document.querySelector<HTMLElement>('[data-community-hint]')
  const input = document.querySelector<HTMLInputElement>('#community-email')
  if (!form || !hint || !input) return

  const KEY = 'rivlet-community-email'
  const saved = localStorage.getItem(KEY)
  if (saved) {
    form.classList.add('is-joined')
    hint.textContent = `You're in the ocean as ${saved}. Welcome, rivlet.`
    input.value = saved
    input.disabled = true
    const btn = form.querySelector<HTMLButtonElement>('.community-join__btn')
    if (btn) {
      btn.disabled = true
      btn.textContent = "You're in"
    }
    return
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = input.value.trim().toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      hint.textContent = 'Enter a valid email to join the community.'
      hint.classList.add('is-error')
      form.classList.add('is-error')
      input.focus()
      return
    }
    localStorage.setItem(KEY, email)
    form.classList.add('is-joined')
    form.classList.remove('is-error')
    hint.classList.remove('is-error')
    hint.textContent = `You're in the ocean as ${email}. Welcome, rivlet.`
    input.disabled = true
    const btn = form.querySelector<HTMLButtonElement>('.community-join__btn')
    if (btn) {
      btn.disabled = true
      btn.textContent = "You're in"
    }
  })
}

bindCommunityJoin()

function bindHeroLookInteractivity(): void {
  let currentIndex = 0
  let selectedSize: Size = 'S'
  let isPaused = false
  const SLIDE_DURATION = 5500
  let slideStartTime = performance.now()
  let pausedElapsed = 0

  const slides = document.querySelectorAll<HTMLElement>('[data-hero-slide]')
  const progressFill = document.querySelector<HTMLElement>('[data-hero-progress]')
  const sizePills = document.querySelectorAll<HTMLButtonElement>('[data-size-pill]')
  const addBtn = document.querySelector<HTMLButtonElement>('[data-add-look-btn]')
  const thumbs = document.querySelectorAll<HTMLButtonElement>('[data-look-index]')
  const prevBtn = document.querySelector<HTMLButtonElement>('[data-look-prev]')
  const nextBtn = document.querySelector<HTMLButtonElement>('[data-look-next]')
  const titleEl = document.querySelector<HTMLElement>('[data-look-title]')
  const priceEl = document.querySelector<HTMLElement>('[data-look-price]')
  const thumbEl = document.querySelector<HTMLImageElement>('[data-look-thumb]')
  const currIndexEl = document.querySelector<HTMLElement>('[data-hero-curr]')
  const shopCard = document.querySelector<HTMLElement>('[data-shop-look]')
  const videoDesktop = document.querySelector<HTMLVideoElement>('[data-hero-video-desktop]')
  const videoMobile = document.querySelector<HTMLVideoElement>('[data-hero-video-mobile]')

  // Safe video playback trigger
  const playVideos = () => {
    if (videoDesktop && videoDesktop.paused) {
      videoDesktop.play().catch(() => {})
    }
    if (videoMobile && videoMobile.paused) {
      videoMobile.play().catch(() => {})
    }
  }
  playVideos()

  // Size pill selection
  sizePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      sizePills.forEach((p) => p.classList.remove('is-selected'))
      pill.classList.add('is-selected')
      selectedSize = (pill.dataset.sizePill as Size) || 'S'
    })
  })

  let previousIndex = -1
  let transitionTimeout: number | undefined

  // Look switcher: handles both photo slides and live film in the same sequence with zero-dip studio crossfade
  const selectLook = (index: number) => {
    const nextIndex = (index + HERO_LOOKS.length) % HERO_LOOKS.length
    if (nextIndex === currentIndex && previousIndex !== -1) return

    const prevIndex = currentIndex
    previousIndex = prevIndex
    currentIndex = nextIndex
    const look = HERO_LOOKS[currentIndex]
    if (!look) return

    slideStartTime = performance.now()
    pausedElapsed = 0

    if (transitionTimeout) {
      window.clearTimeout(transitionTimeout)
    }

    // Previous slide stays visible at z-index: 1 while incoming slide fades in at z-index: 2
    slides.forEach((slide) => {
      const idx = Number(slide.dataset.heroSlide)
      if (idx === currentIndex) {
        slide.classList.remove('is-previous')
        slide.classList.add('is-active')
      } else if (idx === prevIndex) {
        slide.classList.remove('is-active')
        slide.classList.add('is-previous')
      } else {
        slide.classList.remove('is-active', 'is-previous')
      }
    })

    if (look.type === 'video') {
      playVideos()
    }

    // Clean up .is-previous after crossfade duration completes (1000ms)
    transitionTimeout = window.setTimeout(() => {
      slides.forEach((slide) => {
        const idx = Number(slide.dataset.heroSlide)
        if (idx !== currentIndex) {
          slide.classList.remove('is-previous')
        }
      })
    }, 1000)

    // Switch active carousel thumbnail
    thumbs.forEach((t, i) => {
      const active = i === currentIndex
      t.classList.toggle('is-active', active)
      t.setAttribute('aria-selected', String(active))
    })

    // Update floating shop card
    if (titleEl) titleEl.textContent = look.title
    if (priceEl) priceEl.textContent = look.price
    if (thumbEl) {
      thumbEl.src = assetHref(look.thumb)
      thumbEl.alt = look.title
    }
    if (currIndexEl) currIndexEl.textContent = look.index
    if (progressFill) progressFill.style.width = '0%'
  }

  // Live Auto-Advance & Progress Loop with requestAnimationFrame
  let rafId: number
  const tick = (now: number) => {
    if (!isPaused) {
      const elapsed = (now - slideStartTime) + pausedElapsed
      const progress = Math.min(100, (elapsed / SLIDE_DURATION) * 100)
      if (progressFill) {
        progressFill.style.width = `${progress}%`
      }
      if (elapsed >= SLIDE_DURATION) {
        selectLook(currentIndex + 1)
      }
    }
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)

  // Pause auto-advance on user hover or focus on the shop card
  if (shopCard) {
    shopCard.addEventListener('mouseenter', () => {
      if (!isPaused) {
        pausedElapsed += performance.now() - slideStartTime
        isPaused = true
      }
    })
    shopCard.addEventListener('mouseleave', () => {
      if (isPaused) {
        slideStartTime = performance.now()
        isPaused = false
      }
    })
    shopCard.addEventListener('focusin', () => {
      if (!isPaused) {
        pausedElapsed += performance.now() - slideStartTime
        isPaused = true
      }
    })
    shopCard.addEventListener('focusout', () => {
      if (isPaused) {
        slideStartTime = performance.now()
        isPaused = false
      }
    })
  }

  // Thumbnails and arrow clicks
  thumbs.forEach((t, i) => {
    t.addEventListener('click', () => selectLook(i))
  })
  prevBtn?.addEventListener('click', () => selectLook(currentIndex - 1))
  nextBtn?.addEventListener('click', () => selectLook(currentIndex + 1))

  // Add to Bag CTA
  addBtn?.addEventListener('click', () => {
    const look = HERO_LOOKS[currentIndex]
    if (!look) return

    if (look.topId && look.bottomId) {
      addCoordSet(look.color, selectedSize, look.topId, look.bottomId)
    } else if (look.topId) {
      addToCart(look.topId, look.color, selectedSize, 1)
    } else if (look.bottomId) {
      addToCart(look.bottomId, look.color, selectedSize, 1)
    }

    addBtn.classList.add('is-added')
    const originalContent = addBtn.innerHTML
    addBtn.innerHTML = `
      <span class="btn-shop-look__text">ADDED TO BAG</span>
      <span class="btn-shop-look__icon" aria-hidden="true">✓</span>
    `
    setTimeout(() => {
      addBtn.classList.remove('is-added')
      addBtn.innerHTML = originalContent
    }, 2000)

    const cartOpenBtn = document.querySelector<HTMLButtonElement>('[data-cart-open]')
    if (cartOpenBtn) {
      cartOpenBtn.click()
    }
  })

  // Smooth scroll
  document.querySelectorAll<HTMLAnchorElement>('[data-scroll-to]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault()
      const targetSelector = anchor.dataset.scrollTo || anchor.getAttribute('href')
      if (targetSelector) {
        const target = document.querySelector(targetSelector)
        if (target) {
          const isSection = target.tagName === 'SECTION' || target.classList.contains('situations')
          target.scrollIntoView({ behavior: 'smooth', block: isSection ? 'start' : 'nearest', inline: 'center' })
          if (target.classList.contains('promise-film') || target.classList.contains('promise-accordion__card')) {
            target.classList.add('is-highlighted')
            setTimeout(() => target.classList.remove('is-highlighted'), 2200)
            const promiseId = (target as HTMLElement).dataset.promiseId
            if (promiseId) {
              window.dispatchEvent(new CustomEvent('expand-promise', { detail: { id: promiseId } }))
            }
          }
        }
      }
    })
  })

  // Clean up on pagehide
  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(rafId)
    },
    { once: true },
  )
}

function bindFrictionPromiseInteractivity(): void {
  const pillars = document.querySelectorAll<HTMLElement>('.friction-promise__pillar')
  const cards = document.querySelectorAll<HTMLElement>('.promise-accordion__card')

  function setExpandedCard(targetId: string): void {
    cards.forEach((card) => {
      const isTarget = card.dataset.promiseId === targetId
      card.classList.toggle('is-expanded', isTarget)
      if (isTarget) {
        const vid = card.querySelector<HTMLVideoElement>('video')
        if (vid && vid.paused) {
          vid.play().catch(() => {})
        }
      }
    })
    pillars.forEach((pillar) => {
      const isTarget = pillar.dataset.pillar === targetId
      pillar.classList.toggle('is-active', isTarget)
    })
  }

  // Hover or focus cards: expanded card becomes big, other 3 become small
  cards.forEach((card) => {
    const promiseId = card.dataset.promiseId
    if (!promiseId) return

    card.addEventListener('mouseenter', () => {
      setExpandedCard(promiseId)
    })

    card.addEventListener('click', () => {
      setExpandedCard(promiseId)
    })

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setExpandedCard(promiseId)
      }
    })
  })

  // Hover or click pillars: expanding corresponding video
  pillars.forEach((pillar) => {
    const pillarId = pillar.dataset.pillar
    if (!pillarId) return

    pillar.addEventListener('mouseenter', () => {
      setExpandedCard(pillarId)
    })

    pillar.addEventListener('click', () => {
      setExpandedCard(pillarId)
      const targetCard = document.querySelector<HTMLElement>(`#promise-${pillarId}`)
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        targetCard.classList.add('is-highlighted')
        setTimeout(() => targetCard.classList.remove('is-highlighted'), 2200)
      }
    })

    pillar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setExpandedCard(pillarId)
        const targetCard = document.querySelector<HTMLElement>(`#promise-${pillarId}`)
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
          targetCard.classList.add('is-highlighted')
          setTimeout(() => targetCard.classList.remove('is-highlighted'), 2200)
        }
      }
    })
  })

  // External trigger from hero promises dock
  window.addEventListener('expand-promise', ((e: CustomEvent<{ id: string }>) => {
    if (e.detail?.id) {
      setExpandedCard(e.detail.id)
    }
  }) as EventListener)
}

bindHeroLookInteractivity()
bindFrictionPromiseInteractivity()
