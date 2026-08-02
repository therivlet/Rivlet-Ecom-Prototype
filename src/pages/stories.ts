import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { FABRIC_PLATFORMS } from '../data/products'
import { assetHref, mountShell, shopHref } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const platformCards = FABRIC_PLATFORMS.map(
  (f, i) => `
    <article class="story-platform" id="${i === 0 ? 'climate' : f.id.replace(/™/g, '').toLowerCase()}">
      <div class="story-platform__media" aria-hidden="true">
        <img src="${assetHref(f.image)}" alt="" width="900" height="1125" loading="lazy" decoding="async" />
      </div>
      <div class="story-platform__copy">
        <p class="eyebrow">0${i + 1} · Platform</p>
        <h2 class="display story-platform__title">${f.label}</h2>
        <p class="story-platform__outcome">${f.outcome}</p>
        <p class="lede">${f.blurb}</p>
        <a class="btn btn--ghost" href="${shopHref({ platform: f.id })}">Shop ${f.label}</a>
      </div>
    </article>`,
).join('')

app.innerHTML = `<div data-page-content>
  <section class="section fade-in">
    <div class="container">
      <div class="section-head section-head--stories">
        <p class="eyebrow">Stories</p>
        <h1 class="display">Feeling first. Tech underneath.</h1>
        <p class="lede">Buyers don’t consciously buy SecondSkin™ - they buy no patch, no smell, no rub, no bra. The platforms prove the promise.</p>
      </div>
    </div>
  </section>

  <section class="section section--platforms-story" aria-label="Fabric platforms">
    <div class="container story-platforms">
      ${platformCards}
    </div>
  </section>

  <section class="section section--ink ocean-band" id="standards">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Standards</p>
        <h2 class="display">No shortcuts. No unproven claims.</h2>
        <p class="lede">OEKO-TEX® Standard 100 intent. ISO colourfastness. Authentic hardware only. Lab validation before hangtag language.</p>
      </div>
    </div>
  </section>

  <section class="section" id="fit">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Fit</p>
        <h2 class="display">Made for your body.</h2>
        <p class="lede">South-Asian block. Cup-inclusive grading on support pieces. XS-2XL across the collection.</p>
      </div>
      <a class="btn btn--primary" href="${shopHref()}">Explore Collection</a>
    </div>
  </section>
</div>`

mountShell(app)
document.title = 'Stories · Rivlet'
