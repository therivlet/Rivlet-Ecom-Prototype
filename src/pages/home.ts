import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { mountShell, productCardHTML, products, shopHref, assetHref } from '../ui/shell'
import { COORD_SET, FABRIC_PLATFORMS, REVIEWS, SITUATIONS, formatPrice, getProduct } from '../data/products'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const top = getProduct(COORD_SET.topId)
const bottom = getProduct(COORD_SET.bottomId)

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
      >
        <source src="${assetHref('media/hero.mp4')}" type="video/mp4" />
      </video>
      <video
        class="hero__video"
        muted
        playsinline
        preload="auto"
        data-hero-video
      >
        <source src="${assetHref('media/hero.mp4')}" type="video/mp4" />
      </video>
    </div>
    <div class="hero__content">
      <p class="eyebrow" style="color:rgba(255,252,247,0.7);margin-bottom:1rem">Women · Collection</p>
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
      <p class="hero__support">A wardrobe engineered for tropical heat and long days — no patch, no smell, no rub. Indian-crafted. Globally held.</p>
      <a class="btn btn--light hero__cta" href="${shopHref()}">Explore Collection</a>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">The friction</p>
        <h2 class="display">Western activewear wasn’t built for this climate.</h2>
        <p class="lede">In humidity, sweat doesn’t leave — it spreads. Waistbands stay damp. Underarms yellow. Anxiety stays on the body all day.</p>
      </div>
    </div>
  </section>

  <section class="section section--ink promise">
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
    <div class="situation-runway" role="list">
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

  <section class="section" style="padding-top:0">
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

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Collection</p>
        <h2 class="display">Six pieces. Fifteen daily problems owned.</h2>
        <p class="lede">Midnight and Cardamom. XS–2XL. Engineered for South Asian bodies and hard-water realities.</p>
      </div>
      <div class="product-grid">
        ${products.map((p) => productCardHTML(p)).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--color-canvas-deep)">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Fabric platforms</p>
        <h2 class="display">Named tech. Clear outcomes.</h2>
        <p class="lede">Shop by what the fabric does — not by a sale badge.</p>
      </div>
      <div class="platform-grid">
        ${FABRIC_PLATFORMS.map(
          (f) => `
          <a class="platform-card" href="${shopHref({ platform: f.id })}">
            <p class="eyebrow">${f.label}</p>
            <h3>${f.outcome}</h3>
            <p>${f.blurb}</p>
            <span class="platform-card__cta">Shop platform</span>
          </a>`,
        ).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0;background:var(--color-canvas-deep)">
    <div class="container coord-band">
      <div class="coord-visual" aria-hidden="true">
        <div></div>
        <div></div>
      </div>
      <div>
        <p class="eyebrow">The co-ord</p>
        <h2 class="display" style="margin:0.75rem 0 1rem">${COORD_SET.name}</h2>
        <p class="lede" style="margin-bottom:1.5rem">${COORD_SET.blurb}</p>
        <p style="margin-bottom:1.5rem;color:var(--color-ink-soft)">
          ${top?.name ?? 'Crop'} ${formatPrice(top?.mrp ?? 0)} + ${bottom?.name ?? 'Short'} ${formatPrice(bottom?.mrp ?? 0)}
        </p>
        <a class="btn btn--primary" href="./sets/">Shop the set</a>
      </div>
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
          <p>Graded for real proportions — including cup-inclusive support on bras and tanks.</p>
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

  <section class="section section--ink" style="padding-block:clamp(3rem,6vw,4.5rem)">
    <div class="container fabricology-cta">
      <div>
        <p class="eyebrow">Fabric platforms</p>
        <h2 class="display" style="margin:0.75rem 0 1rem">How Rivlet is engineered.</h2>
        <p class="lede">AquaFlow™ · SecondSkin™ · NeutralCore™ — feeling first, proof underneath.</p>
      </div>
      <a class="btn btn--light" href="./stories/">Learn the platforms</a>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Early voices</p>
        <h2 class="display">Why women stay in it.</h2>
      </div>
      <div class="reviews">
        ${REVIEWS.map(
          (r) => `
          <blockquote class="review-card">
            <p>“${r.text}”</p>
            <span>${r.name} · ${r.city} · ${'★'.repeat(r.stars)}</span>
          </blockquote>`,
        ).join('')}
      </div>
    </div>
  </section>

  <section class="section final-cta">
    <p class="eyebrow">Begin</p>
    <h2 class="display">Every ocean was first fed by a rivlet.</h2>
    <a class="btn btn--primary" href="${shopHref()}">Explore Collection</a>
  </section>
</div>`

mountShell(app)

/** Dual-buffer crossfade — avoids the black gap native `loop` leaves between cycles. */
function bindSeamlessHeroLoop(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const videos = [...document.querySelectorAll<HTMLVideoElement>('[data-hero-video]')]
  if (videos.length < 2) return

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

  playSafe(active)
  if (active.readyState < 2) {
    active.addEventListener('loadeddata', () => playSafe(active), { once: true })
  }
  raf = requestAnimationFrame(tick)
  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(raf)
    },
    { once: true },
  )
}

bindSeamlessHeroLoop()
