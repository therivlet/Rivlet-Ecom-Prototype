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
} from '../data/products'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const [coordMidnightFront, coordMidnightAlt] = getCoordImages(COORD_SET, 'midnight')
const [coordCardamomFront, coordCardamomAlt] = getCoordImages(COORD_SET, 'cardamom')

const PROMISE_FILMS = [
  {
    id: 'no-patch',
    title: 'No patch',
    blurb: 'Zoned sweat-barriers. Outer face stays dry.',
    src: 'media/promise/no-patch.mp4',
  },
  {
    id: 'no-smell',
    title: 'No smell',
    blurb: 'Silver-ion freshness engineered at fibre level.',
    src: 'media/promise/no-smell.mp4',
  },
  {
    id: 'no-rub',
    title: 'No rub',
    blurb: 'Seamless where chafe starts.',
    src: 'media/promise/no-rub.mp4',
  },
  {
    id: 'no-ride-up',
    title: 'No ride-up',
    blurb: 'No-roll bands. Stay put.',
    src: 'media/promise/no-ride-up.mp4',
  },
] as const

app.innerHTML = `<div data-page-content>
  <section class="hero hero--enter">
    <div class="hero__media" aria-hidden="true">
      <video
        class="hero__video is-active"
        muted
        playsinline
        preload="auto"
        data-hero-video
      ></video>
      <video
        class="hero__video"
        muted
        playsinline
        preload="auto"
        data-hero-video
      ></video>
    </div>
    <div class="hero__content">
      <p class="eyebrow hero__eyebrow" style="color:rgba(255,252,247,0.7);margin-bottom:1rem">Women · Collection</p>
      <h1 class="hero__brand">
        <img
          class="hero__brand-mark"
          src="${assetHref('brand/rivlet-hero-wordmark.png')}"
          alt="Rivlet"
          width="938"
          height="273"
        />
      </h1>
      <p class="hero__motto">Move like water, feel like air.</p>
      <p class="hero__support">A wardrobe engineered for tropical heat and long days - no patch, no smell, no rub. Indian-crafted. Globally held.</p>
      <a class="btn btn--light hero__cta" href="${shopHref()}">Explore Collection</a>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head section-head--friction">
        <p class="eyebrow">The friction</p>
        <h2 class="display">Western activewear wasn’t built for this climate.</h2>
        <p class="lede">In humidity, sweat doesn’t leave - it spreads. Waistbands stay damp. Underarms yellow. Anxiety stays on the body all day.</p>
      </div>
    </div>
  </section>

  <section class="section section--ink promise ocean-band">
    <div class="container">
      <div class="section-head section-head--promise">
        <p class="eyebrow">The promise</p>
        <h2 class="display">Lead with the feeling. Prove with the tech.</h2>
      </div>
    </div>
    <div class="promise-runway" role="list">
      ${PROMISE_FILMS.map(
        (f) => `
        <article class="promise-film" role="listitem" aria-label="${f.title}">
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
          <div class="promise-film__meta">
            <h3 class="promise-film__title">${f.title}</h3>
            <p class="promise-film__blurb">${f.blurb}</p>
          </div>
        </article>`,
      ).join('')}
    </div>
  </section>

  <section class="section situations">
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

      <div class="section-head coord-home__gallery-head">
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
      <div class="section-head">
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

  <section class="section">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Why it holds</p>
        <h2 class="display">Built for the climate you actually live in.</h2>
      </div>
      <div class="trust-grid">
        <div class="trust-item">
          <h3>South-Asian block</h3>
          <p>Graded for real proportions - including cup-inclusive support on bras and tanks.</p>
        </div>
        <div class="trust-item">
          <h3>Hard-water ready</h3>
          <p>Colourfast and shape-holding yarn chemistry for mineral-heavy laundry cycles.</p>
        </div>
        <div class="trust-item">
          <h3>Standards first</h3>
          <p>OEKO-TEX® Standard 100 intent across the range. Claims validated before print.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
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

/** Dual-buffer crossfade - avoids the black gap native `loop` leaves between cycles. */
function bindSeamlessHeroLoop(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const videos = [...document.querySelectorAll<HTMLVideoElement>('[data-hero-video]')]
  if (videos.length < 2) return

  const mobileMq = window.matchMedia('(max-width: 899px)')
  const heroSrc = () =>
    assetHref(mobileMq.matches ? 'media/hero-mobile.mp4' : 'media/hero-desktop.mp4')

  let active = videos[0]!
  let standby = videos[1]!
  let swapping = false
  let raf = 0
  const LEAD = 0.35

  const prep = (v: HTMLVideoElement) => {
    v.muted = true
    v.defaultMuted = true
    v.playsInline = true
    v.loop = false
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
  }
  prep(active)
  prep(standby)

  const applySrc = (v: HTMLVideoElement, src: string) => {
    if (v.dataset.heroSrc === src && v.currentSrc) return
    v.dataset.heroSrc = src
    v.pause()
    v.querySelectorAll('source').forEach((s) => s.remove())
    const source = document.createElement('source')
    source.src = src
    source.type = 'video/mp4'
    v.appendChild(source)
    v.load()
  }

  const syncSources = () => {
    const src = heroSrc()
    applySrc(active, src)
    applySrc(standby, src)
  }

  const playSafe = (v: HTMLVideoElement) => {
    void v.play().catch(() => {
      /* muted autoplay usually allowed */
    })
  }

  const swap = () => {
    if (swapping) return
    swapping = true
    try {
      standby.currentTime = 0.001
    } catch {
      /* ignore seek errors before metadata */
    }
    playSafe(standby)
    standby.classList.add('is-active')
    active.classList.remove('is-active')
    const prev = active
    active = standby
    standby = prev
    window.setTimeout(() => {
      standby.pause()
      try {
        standby.currentTime = 0.001
      } catch {
        /* ignore */
      }
      swapping = false
    }, 450)
  }

  const tick = () => {
    if (Number.isFinite(active.duration) && active.duration > 0) {
      if (!swapping && active.currentTime >= Math.max(0, active.duration - LEAD)) {
        swap()
      }
    }
    raf = requestAnimationFrame(tick)
  }

  syncSources()
  playSafe(active)
  if (active.readyState < 2) {
    active.addEventListener('loadeddata', () => playSafe(active), { once: true })
  }
  raf = requestAnimationFrame(tick)

  const onViewportChange = () => {
    syncSources()
    swapping = false
    active.classList.add('is-active')
    standby.classList.remove('is-active')
    try {
      active.currentTime = 0.001
    } catch {
      /* ignore */
    }
    playSafe(active)
  }
  mobileMq.addEventListener('change', onViewportChange)

  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(raf)
      mobileMq.removeEventListener('change', onViewportChange)
    },
    { once: true },
  )
}

bindSeamlessHeroLoop()
