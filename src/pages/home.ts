import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { mountShell, productCardHTML, products, shopHref } from '../ui/shell'
import { COORD_SET, FABRIC_PLATFORMS, REVIEWS, SITUATIONS, formatPrice, getProduct } from '../data/products'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const top = getProduct(COORD_SET.topId)
const bottom = getProduct(COORD_SET.bottomId)

app.innerHTML = `<div data-page-content>
  <section class="hero hero--enter">
    <div class="hero__media" aria-hidden="true"></div>
    <div class="hero__content">
      <p class="eyebrow" style="color:rgba(255,252,247,0.7);margin-bottom:1rem">Women · The Edit</p>
      <h1 class="hero__brand">Rivlet</h1>
      <p class="hero__motto">Move like water, feel like air.</p>
      <p class="hero__support">A wardrobe engineered for tropical heat and long days — no patch, no smell, no rub. Indian-crafted. Globally held.</p>
      <a class="btn btn--light" href="${shopHref()}">Shop The Edit</a>
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

  <section class="section section--ink">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">The promise</p>
        <h2 class="display">Lead with the feeling. Prove with the tech.</h2>
      </div>
      <div class="promise-grid">
        <div class="promise-item"><h3>No patch</h3><p>Zoned sweat-barriers that keep the outer face visually dry.</p></div>
        <div class="promise-item"><h3>No smell</h3><p>Silver-ion freshness engineered at fibre level.</p></div>
        <div class="promise-item"><h3>No rub</h3><p>Seamless and flatlock construction where chafe starts.</p></div>
        <div class="promise-item"><h3>No ride-up</h3><p>No-roll bands and silicone grippers that stay put.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Shop by situation</p>
        <h2 class="display">What are you shopping for today?</h2>
        <p class="lede">People think in moments — not categories.</p>
      </div>
      <div class="situation-grid">
        ${SITUATIONS.map(
          (s) => `
          <a class="situation-tile" href="${shopHref({ situation: s.id })}">
            <strong>${s.label}</strong>
            <span>${s.blurb}</span>
          </a>`,
        ).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="split-shop">
        <a class="split-shop__tile" href="${shopHref({ form: 'tops' })}" style="--tile:linear-gradient(160deg,#2a2118,#0c1e34)">
          <span class="eyebrow" style="color:rgba(255,252,247,0.7)">Form</span>
          <strong>Tops</strong>
          <span>Bras · tanks · tee</span>
        </a>
        <a class="split-shop__tile" href="${shopHref({ form: 'bottoms' })}" style="--tile:linear-gradient(160deg,#7a5c3a,#1a1208)">
          <span class="eyebrow" style="color:rgba(255,252,247,0.7)">Form</span>
          <strong>Bottoms</strong>
          <span>Leggings · shorts</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">The Edit</p>
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
    <a class="btn btn--primary" href="${shopHref()}">Shop The Edit</a>
  </section>
</div>`

mountShell(app)
