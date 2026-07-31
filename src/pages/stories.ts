import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { mountShell, shopHref } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

app.innerHTML = `<div data-page-content>
  <section class="section fade-in">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Stories</p>
        <h1 class="display">Feeling first. Tech underneath.</h1>
        <p class="lede">Buyers don’t consciously buy SecondSkin™ — they buy no patch, no smell, no rub, no bra. The platforms prove the promise.</p>
      </div>
      <div class="fabric-cards">
        <article class="fabric-card" id="climate">
          <p class="eyebrow">01</p>
          <h3>AquaFlow™</h3>
          <p style="color:var(--color-ink-soft)">Tetra-channel wicking nylon-Lycra for leggings that stay visually dry and chafe-free in heat.</p>
        </article>
        <article class="fabric-card">
          <p class="eyebrow">02</p>
          <h3>SecondSkin™</h3>
          <p style="color:var(--color-ink-soft)">Seamless circular knit with zoned barriers, Ag⁺ freshness, and built-in support for bra, tanks, and short.</p>
        </article>
        <article class="fabric-card">
          <p class="eyebrow">03</p>
          <h3>NeutralCore™</h3>
          <p style="color:var(--color-ink-soft)">Training tee platform with bonded underarm shield — no patch, no yellow stain, all-day freshness.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--ink" id="standards">
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
        <p class="lede">South-Asian block. Cup-inclusive grading on support pieces. XS–2XL across The Edit.</p>
      </div>
      <a class="btn btn--primary" href="${shopHref()}">Shop The Edit</a>
    </div>
  </section>
</div>`

mountShell(app)
document.title = 'Stories · Rivlet'
