import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { assetHref, initPageMotion, mountShell, shopHref } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const heroImg = assetHref('media/coords/crop-leggings-midnight-1.png')
const promiseImg = assetHref('media/coords/tank-shorts-cardamom-1.png')
const climateImg = assetHref('media/coords/tee-leggings-midnight-1.png')
const fabricImg = assetHref('media/platforms/aquaflow.png')

app.innerHTML = `<div data-page-content>
  <section class="about-hero ocean-band">
    <div class="about-hero__media" aria-hidden="true">
      <img src="${heroImg}" alt="" width="1200" height="1500" decoding="async" />
    </div>
    <div class="about-hero__veil" aria-hidden="true"></div>
    <div class="about-hero__row">
      <div class="about-hero__inner">
        <p class="eyebrow about-hero__eyebrow">Our story</p>
        <p class="about-hero__motto">Move like water, feel like air.</p>
        <p class="about-hero__lede">
          <span class="about-hero__lede-full">Every ocean was first fed by a rivlet. We begin at the source - Madurai, Tamil Nadu - with a wardrobe built for heat, humidity, and real days in motion.</span>
          <span class="about-hero__lede-short">Every ocean was first fed by a rivlet. We begin in Madurai.</span>
        </p>
      </div>
      <div class="about-hero__brand" aria-hidden="true">
        <img
          class="about-hero__mark"
          src="${assetHref('brand/rivlet-mark-light.png')}"
          alt=""
          width="512"
          height="512"
        />
      </div>
    </div>
  </section>

  <section class="section about-principle">
    <div class="container about-principle__inner">
      <p class="eyebrow">The Rivlet principle</p>
      <h2 class="display about-principle__quote">A small water, moving with intent.</h2>
      <p class="lede about-principle__body">A rivlet is a focused thread of water that, over time, carves into an unyielding river. We reject disposable fashion. Lasting habits and lasting clothes are built systematically - through everyday movement - and engineered around life’s real friction points.</p>
    </div>
  </section>

  <section class="section about-split about-split--scene">
    <div class="about-split__frame">
      <div class="about-split__media" aria-hidden="true">
        <img src="${promiseImg}" alt="" width="900" height="1125" loading="lazy" decoding="async" />
      </div>
      <div class="about-split__copy">
        <p class="eyebrow">Founder’s promise</p>
        <h2 class="display">When you wear Rivlet, anxiety leaves your mind.</h2>
        <p class="lede">Every stitch, stretch and textile layout resolves a real-world friction point. The garment must feel weightless - a second skin of physical security and mental ease - so you never have to think about the clothing at all.</p>
      </div>
    </div>
  </section>

  <section class="section about-split about-split--scene about-split--flip">
    <div class="about-split__frame">
      <div class="about-split__copy">
        <p class="eyebrow">Climate &amp; physiology</p>
        <h2 class="display">Engineered for the heat you actually live in.</h2>
        <p class="lede about-split__lede-full">Western sportswear is optimised for temperate climates. Rivlet is built from the fibre up for extreme heat, tropical humidity, mineral-heavy hard water, and South Asian proportions - held to global export standards, without apology for where we come from.</p>
        <p class="lede about-split__lede-short">Built from the fibre up for heat, humidity, hard water, and South Asian proportions.</p>
        <ul class="about-points">
          <li><strong>South-Asian block</strong> Cup-inclusive grading. Real proportions.</li>
          <li><strong>Hard-water ready</strong> Colourfast yarns that hold shape through mineral cycles.</li>
          <li><strong>Standards first</strong> OEKO-TEX® Standard 100 intent. Lab-validated claims.</li>
        </ul>
      </div>
      <div class="about-split__media" aria-hidden="true">
        <img src="${climateImg}" alt="" width="900" height="1125" loading="lazy" decoding="async" />
      </div>
    </div>
  </section>

  <section class="section ocean-band about-studio" id="studio">
    <div class="container about-studio__inner">
      <p class="eyebrow about-studio__eyebrow">Origin</p>
      <h2 class="display about-studio__title">Studio Madurai</h2>
      <p class="lede about-studio__lede">Fit sessions, fabric trials, and colour work happen close to the climate we serve. The supply chain is ours. The label is a promise we keep in the fitting room, on the factory floor, and after fifty washes.</p>
      <p class="about-studio__route">India → UK → UAE</p>
    </div>
  </section>

  <section class="section about-roles">
    <div class="container">
      <div class="section-head about-roles__head">
        <p class="eyebrow">One wardrobe</p>
        <h2 class="display">Four roles. No costume change.</h2>
        <p class="lede">A single engineered wardrobe for training, daily life, and the hours between.</p>
      </div>
    </div>
    <div class="about-roles__runway" role="list">
      <a class="about-role" href="${shopHref({ situation: 'gym' })}" role="listitem">
        <img class="about-role__img" src="${assetHref('media/coords/bra-leggings-midnight-1.png')}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
        <span class="about-role__veil" aria-hidden="true"></span>
        <span class="about-role__meta">
          <span class="about-role__num">01</span>
          <strong class="about-role__title">Sports</strong>
          <span class="about-role__blurb">High-impact, low-friction pieces for kinetic resilience.</span>
          <span class="about-role__cta">Shop gym</span>
        </span>
      </a>
      <a class="about-role" href="${shopHref({ situation: 'yoga' })}" role="listitem">
        <img class="about-role__img" src="${assetHref('media/coords/tank-leggings-midnight-1.png')}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
        <span class="about-role__veil" aria-hidden="true"></span>
        <span class="about-role__meta">
          <span class="about-role__num">02</span>
          <strong class="about-role__title">Performance</strong>
          <span class="about-role__blurb">Thermal control and compression for high-heat zones.</span>
          <span class="about-role__cta">Shop yoga</span>
        </span>
      </a>
      <a class="about-role" href="${shopHref({ situation: 'office' })}" role="listitem">
        <img class="about-role__img" src="${assetHref('media/coords/tee-shorts-cardamom-1.png')}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
        <span class="about-role__veil" aria-hidden="true"></span>
        <span class="about-role__meta">
          <span class="about-role__num">03</span>
          <strong class="about-role__title">Athleisure</strong>
          <span class="about-role__blurb">Gym to street to dinner - no costume change.</span>
          <span class="about-role__cta">Shop office</span>
        </span>
      </a>
      <a class="about-role" href="${shopHref({ situation: 'travel' })}" role="listitem">
        <img class="about-role__img" src="${assetHref('media/coords/tee-leggings-cardamom-1.png')}" alt="" width="900" height="1200" loading="lazy" decoding="async" />
        <span class="about-role__veil" aria-hidden="true"></span>
        <span class="about-role__meta">
          <span class="about-role__num">04</span>
          <strong class="about-role__title">Easy wear</strong>
          <span class="about-role__blurb">Air-like comfort for travel, rest, and recovery.</span>
          <span class="about-role__cta">Shop travel</span>
        </span>
      </a>
    </div>
  </section>

  <section class="section about-fabric">
    <div class="container about-fabric__grid">
      <div class="about-fabric__media" aria-hidden="true">
        <img src="${fabricImg}" alt="" width="900" height="1125" loading="lazy" decoding="async" />
      </div>
      <div class="about-fabric__copy">
        <p class="eyebrow">Fabric systems</p>
        <h2 class="display">Fabric is not a detail. It is the entire point.</h2>
        <p class="lede">AquaFlow™, SecondSkin™, NeutralCore™ - engineered so the garment disappears on the body.</p>
        <div class="about-fabric__actions">
          <a class="btn btn--primary" href="${shopHref()}">Explore Collection</a>
          <a class="btn btn--ghost" href="../stories/">Learn the platforms</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section ocean-band about-standards">
    <div class="container about-standards__inner">
      <p class="eyebrow about-standards__eyebrow">Non-negotiables</p>
      <h2 class="display about-standards__title">Five things we never compromise on.</h2>
      <ol class="about-standards__list">
        <li><span>01</span><div><strong>Move like water, feel like air.</strong> Soft hands. Quiet seams. Breath that recovers.</div></li>
        <li><span>02</span><div><strong>Honest quality, without the price theatre.</strong> Fabric we’d wear ourselves. Cuts that hold after fifty washes.</div></li>
        <li><span>03</span><div><strong>One wardrobe, every hour.</strong> Activewear through easy wear - one bar for quality.</div></li>
        <li><span>04</span><div><strong>Indian-crafted, globally worn.</strong> Rooted in Tamil Nadu. Built for export routes.</div></li>
        <li><span>05</span><div><strong>Zero compromise. Always.</strong> If a corner has to be cut, we don’t ship it.</div></li>
      </ol>
    </div>
  </section>
</div>`

mountShell(app)
initPageMotion(app)
document.title = 'Our story · Rivlet'

if (location.hash === '#studio') {
  requestAnimationFrame(() => {
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })
  })
}
