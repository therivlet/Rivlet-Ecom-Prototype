import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { mountShell, shopHref, initPageMotion } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

app.innerHTML = `<div data-page-content>
  <section class="section content-page fade-in">
    <div class="container content-page__shell">
      <div class="section-head">
        <p class="eyebrow">Track order</p>
        <h1 class="display">Where is my Rivlet?</h1>
        <p class="lede">Enter your order ID and email to see courier status. Tracking goes live as soon as your parcel leaves the studio.</p>
      </div>
      <form class="track-form account-card" data-track-form>
        <div class="field">
          <label for="order-id">Order ID</label>
          <input id="order-id" name="orderId" required placeholder="RVL-12345678" autocomplete="off" />
        </div>
        <div class="field">
          <label for="track-email">Email</label>
          <input id="track-email" name="email" type="email" required placeholder="you@email.com" autocomplete="email" />
        </div>
        <button class="btn btn--primary btn--block" type="submit">Track</button>
        <p class="account-note" data-track-result hidden></p>
      </form>
      <p class="content-page__cta"><a class="btn btn--ghost" href="${shopHref()}">Continue shopping</a></p>
    </div>
  </section>
</div>`

mountShell(app)
initPageMotion(app)
document.title = 'Track order · Rivlet'

document.querySelector('[data-track-form]')?.addEventListener('submit', (e) => {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const fd = new FormData(form)
  const orderId = String(fd.get('orderId') || '').trim()
  const result = document.querySelector<HTMLElement>('[data-track-result]')
  if (!result) return
  result.hidden = false
  result.textContent = `We’re preparing tracking for ${orderId}. You’ll get courier updates by email as soon as the label is live.`
})
