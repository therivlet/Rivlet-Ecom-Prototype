import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { assetHref, initPageMotion, mountShell } from '../ui/shell'

const WHATSAPP =
  'https://wa.me/916383491536?text=' + encodeURIComponent('Hi Rivlet - I need help with an order.')

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

app.innerHTML = `<div data-page-content>
  <section class="contact-hero ocean-band">
    <div class="contact-hero__media" aria-hidden="true">
      <img src="${assetHref('media/coords/tank-shorts-midnight-1.png')}" alt="" width="1200" height="1500" decoding="async" />
    </div>
    <div class="contact-hero__veil" aria-hidden="true"></div>
    <div class="contact-hero__row">
      <div class="contact-hero__inner">
        <p class="eyebrow contact-hero__eyebrow">Contact</p>
        <h1 class="contact-hero__title">Write to the studio.</h1>
        <p class="contact-hero__lede">Orders, fit, shipping, or partnership - a human replies within one business day from Madurai.</p>
      </div>
      <div class="contact-hero__brand" aria-hidden="true">
        <img
          class="contact-hero__mark"
          src="${assetHref('brand/rivlet-mark-light.png')}"
          alt=""
          width="512"
          height="512"
        />
      </div>
    </div>
  </section>

  <section class="section contact-page">
    <div class="container contact-page__shell">
      <div class="contact-page__grid">
        <div class="contact-page__main">
          <header class="contact-page__intro">
            <p class="eyebrow">Message</p>
            <h2 class="display contact-page__form-title">Tell us what you need.</h2>
          </header>

          <form class="contact-form" data-contact-form novalidate>
            <div class="field-row">
              <div class="field contact-field">
                <label for="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" required autocomplete="name" placeholder="Your name" />
              </div>
              <div class="field contact-field">
                <label for="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" required autocomplete="email" placeholder="you@email.com" />
              </div>
            </div>
            <div class="field contact-field">
              <label for="contact-topic">Topic</label>
              <select id="contact-topic" name="topic" required>
                <option value="">Select a topic</option>
                <option value="order">Order help</option>
                <option value="fit">Fit &amp; sizing</option>
                <option value="shipping">Shipping &amp; returns</option>
                <option value="product">Product question</option>
                <option value="press">Press &amp; partnership</option>
                <option value="other">Something else</option>
              </select>
            </div>
            <div class="field contact-field">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" name="message" required rows="6" placeholder="How can we help?"></textarea>
            </div>
            <div class="contact-form__foot">
              <button class="btn btn--primary" type="submit">Send message</button>
              <p class="contact-form__hint">We read every note. No bots. No ticket theatre.</p>
            </div>
            <p class="contact-form__status" data-contact-status hidden role="status"></p>
          </form>
        </div>

        <aside class="contact-aside" aria-label="Other ways to reach us">
          <p class="eyebrow contact-aside__eyebrow">Direct lines</p>
          <div class="contact-aside__list">
            <a class="contact-channel" href="mailto:hello@therivlet.com">
              <span class="contact-channel__num">01</span>
              <span class="contact-channel__body">
                <span class="contact-channel__label">Email</span>
                <span class="contact-channel__value">hello@therivlet.com</span>
                <span class="contact-channel__note">Include your order ID when you have one.</span>
              </span>
            </a>
            <a class="contact-channel" href="${WHATSAPP}" target="_blank" rel="noreferrer">
              <span class="contact-channel__num">02</span>
              <span class="contact-channel__body">
                <span class="contact-channel__label">WhatsApp</span>
                <span class="contact-channel__value">+91 63834 91536</span>
                <span class="contact-channel__note">Sizing help and shipping updates.</span>
              </span>
            </a>
            <div class="contact-channel contact-channel--static">
              <span class="contact-channel__num">03</span>
              <span class="contact-channel__body">
                <span class="contact-channel__label">Studio</span>
                <span class="contact-channel__value">Madurai, Tamil Nadu</span>
                <span class="contact-channel__note">Visits by appointment. Press welcome.</span>
              </span>
            </div>
          </div>
          <a class="btn btn--ghost contact-aside__wa" href="${WHATSAPP}" target="_blank" rel="noreferrer">WhatsApp Rivlet</a>
        </aside>
      </div>
    </div>
  </section>
</div>`

mountShell(app)
initPageMotion(app)
document.title = 'Contact · Rivlet'

const form = document.querySelector<HTMLFormElement>('[data-contact-form]')
const status = document.querySelector<HTMLElement>('[data-contact-status]')

form?.addEventListener('submit', (e) => {
  e.preventDefault()
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }
  const fd = new FormData(form)
  const name = String(fd.get('name') || '').trim()
  if (status) {
    status.hidden = false
    status.textContent = `Thank you${name ? `, ${name}` : ''}. Your note is with Studio Madurai - we’ll reply within one business day.`
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
  form.reset()
})
