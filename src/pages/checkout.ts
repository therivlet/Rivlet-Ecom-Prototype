import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { COLORS, formatPrice, getProduct, getProductImage } from '../data/products'
import { cartSubtotal, clearCart, getCart } from '../cart'
import { assetHref, mountShell, shopHref } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

function summaryHTML(): string {
  const lines = getCart()
  if (!lines.length) {
    return `<p style="color:var(--color-ink-muted)">Your bag is empty. <a href="${shopHref()}"><strong>Explore Collection</strong></a></p>`
  }
  return `
    ${lines
      .map((line) => {
        const p = getProduct(line.productId)
        if (!p) return ''
        const photo = getProductImage(p, line.color)
        const thumb = photo
          ? `background-image:url('${assetHref(photo)}');background-size:cover;background-position:center top;`
          : `--swatch:${COLORS[line.color].hex}`
        return `<div class="cart-line" style="grid-template-columns:3.5rem 1fr;border:none;padding:0.6rem 0">
          <div class="cart-line__swatch" style="${thumb}"></div>
          <div>
            <div class="cart-line__title">${p.name}</div>
            <div class="cart-line__detail">${COLORS[line.color].name} · ${line.size} · ×${line.qty}</div>
            <div class="product-card__price">${formatPrice(p.mrp * line.qty)}</div>
          </div>
        </div>`
      })
      .join('')}
    <div class="cart-subtotal" style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--color-line)">
      <span>Subtotal</span><strong>${formatPrice(cartSubtotal())}</strong>
    </div>`
}

app.innerHTML = `<div data-page-content>
  <section class="container checkout fade-in">
    <div>
      <div class="section-head">
        <p class="eyebrow">Checkout</p>
        <h1 class="display">Almost there.</h1>
        <p class="lede">Enter your details and choose how you’d like to pay. Your Rivlet ships once the order is confirmed.</p>
      </div>
      <form data-checkout-form>
        <h2 style="font-size:var(--text-lg);margin-bottom:1rem">Contact</h2>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@email.com" autocomplete="email" />
        </div>
        <h2 style="font-size:var(--text-lg);margin:1.5rem 0 1rem">Shipping</h2>
        <div class="field-row">
          <div class="field">
            <label for="first">First name</label>
            <input id="first" name="first" required autocomplete="given-name" />
          </div>
          <div class="field">
            <label for="last">Last name</label>
            <input id="last" name="last" required autocomplete="family-name" />
          </div>
        </div>
        <div class="field">
          <label for="address">Address</label>
          <input id="address" name="address" required autocomplete="street-address" />
        </div>
        <div class="field-row">
          <div class="field">
            <label for="city">City</label>
            <input id="city" name="city" required autocomplete="address-level2" />
          </div>
          <div class="field">
            <label for="pin">PIN</label>
            <input id="pin" name="pin" required autocomplete="postal-code" />
          </div>
        </div>
        <h2 style="font-size:var(--text-lg);margin:1.5rem 0 1rem">Shipping method</h2>
        <div class="radio-stack" style="margin-bottom:1.5rem">
          <label class="radio-card">
            <input type="radio" name="shipping" value="standard" checked />
            <span><strong>Standard</strong><br /><span style="color:var(--color-ink-muted);font-size:0.875rem">4-6 days · Free over ₹2,999</span></span>
          </label>
          <label class="radio-card">
            <input type="radio" name="shipping" value="express" />
            <span><strong>Express</strong><br /><span style="color:var(--color-ink-muted);font-size:0.875rem">2-3 days · ₹149</span></span>
          </label>
        </div>
        <h2 style="font-size:var(--text-lg);margin:0 0 1rem">Payment</h2>
        <div class="pay-method-row" aria-hidden="true">
          <!-- reused card marks via static markup for checkout light surface -->
          <ul class="pay-marks pay-marks--light">
            <li class="pay-card" title="UPI"><svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#fff"/><path d="M10 22L18 8h4l-8 14H10zm8 0l8-14h4l-8 14h-4z" fill="#097939"/><path d="M26 22l8-14h4L30 22h-4z" fill="#ED752E"/><text x="38" y="21" text-anchor="middle" font-size="6" font-family="Arial,sans-serif" font-weight="700" fill="#0C1E34">UPI</text></svg></li>
            <li class="pay-card" title="Visa"><svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#1A1F71"/><text x="24" y="20" text-anchor="middle" font-size="11" font-family="Arial,sans-serif" font-weight="700" font-style="italic" fill="#fff" letter-spacing="1">VISA</text></svg></li>
            <li class="pay-card" title="Mastercard"><svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#1A1A1A"/><circle cx="19.5" cy="16" r="7" fill="#EB001B"/><circle cx="28.5" cy="16" r="7" fill="#F79E1B"/><path d="M24 10.8a7 7 0 0 1 0 10.4 7 7 0 0 1 0-10.4z" fill="#FF5F00"/></svg></li>
            <li class="pay-card" title="RuPay"><svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#fff"/><text x="24" y="15" text-anchor="middle" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="#097939">RuPay</text><rect x="10" y="19" width="28" height="2.5" rx="1" fill="#097939"/></svg></li>
            <li class="pay-card" title="Google Pay"><svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#fff"/><text x="16" y="20" text-anchor="middle" font-size="12" font-family="Arial,sans-serif" font-weight="700" fill="#4285F4">G</text><text x="30" y="20" text-anchor="middle" font-size="9" font-family="Arial,sans-serif" font-weight="500" fill="#5F6368">Pay</text></svg></li>
            <li class="pay-card" title="American Express"><svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true"><rect width="48" height="32" rx="4" fill="#2E77BC"/><text x="24" y="20" text-anchor="middle" font-size="8" font-family="Arial,sans-serif" font-weight="700" fill="#fff" letter-spacing="0.5">AMEX</text></svg></li>
          </ul>
        </div>
        <div class="radio-stack" style="margin-bottom:1.25rem" data-pay-methods>
          <label class="radio-card">
            <input type="radio" name="payment" value="upi" checked />
            <span><strong>UPI</strong><br /><span style="color:var(--color-ink-muted);font-size:0.875rem">GPay, PhonePe, BHIM &amp; more</span></span>
          </label>
          <label class="radio-card">
            <input type="radio" name="payment" value="card" />
            <span><strong>Cards</strong><br /><span style="color:var(--color-ink-muted);font-size:0.875rem">Visa, Mastercard, RuPay</span></span>
          </label>
          <label class="radio-card">
            <input type="radio" name="payment" value="netbanking" />
            <span><strong>Netbanking</strong><br /><span style="color:var(--color-ink-muted);font-size:0.875rem">All major Indian banks</span></span>
          </label>
          <label class="radio-card">
            <input type="radio" name="payment" value="cod" />
            <span><strong>Cash on delivery</strong><br /><span style="color:var(--color-ink-muted);font-size:0.875rem">Pay when your Rivlet arrives</span></span>
          </label>
        </div>
        <div class="pay-panel" data-pay-panel="upi">
          <div class="field">
            <label for="upi">UPI ID</label>
            <input id="upi" name="upi" placeholder="name@upi" autocomplete="off" />
          </div>
        </div>
        <div class="pay-panel" data-pay-panel="card" hidden>
          <div class="field">
            <label for="card">Card number</label>
            <input id="card" name="card" inputmode="numeric" placeholder="•••• •••• •••• ••••" autocomplete="cc-number" />
          </div>
          <div class="field-row">
            <div class="field">
              <label for="exp">Expiry</label>
              <input id="exp" name="exp" placeholder="MM/YY" autocomplete="cc-exp" />
            </div>
            <div class="field">
              <label for="cvc">CVC</label>
              <input id="cvc" name="cvc" placeholder="•••" autocomplete="cc-csc" />
            </div>
          </div>
        </div>
        <div class="pay-panel" data-pay-panel="netbanking" hidden>
          <div class="field">
            <label for="bank">Bank</label>
            <select id="bank" name="bank">
              <option value="">Select your bank</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>SBI</option>
              <option>Axis Bank</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div class="pay-panel" data-pay-panel="cod" hidden>
          <p class="pay-panel__note">Have the exact amount ready. Our courier will confirm before handover.</p>
        </div>
        <!-- Payment submit is simulated locally; no gateway charge. -->
        <button class="btn btn--primary btn--block" type="submit" ${getCart().length ? '' : 'disabled'}>Place order</button>
      </form>
    </div>
    <aside class="checkout-summary">
      <h2>Order summary</h2>
      <div data-summary>${summaryHTML()}</div>
    </aside>
  </section>
</div>`

mountShell(app)

const form = document.querySelector<HTMLFormElement>('[data-checkout-form]')
const syncPayPanel = () => {
  const method = form?.querySelector<HTMLInputElement>('input[name="payment"]:checked')?.value || 'upi'
  form?.querySelectorAll<HTMLElement>('[data-pay-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.payPanel !== method
  })
}
form?.querySelectorAll('input[name="payment"]').forEach((input) => {
  input.addEventListener('change', syncPayPanel)
})
syncPayPanel()

form?.addEventListener('submit', (e) => {
  e.preventDefault()
  if (!getCart().length) return
  const data = new FormData(form)
  const orderId = `RVL-${Date.now().toString().slice(-8)}`
  sessionStorage.setItem(
    'rivlet-last-order',
    JSON.stringify({
      orderId,
      email: data.get('email'),
      total: cartSubtotal(),
      payment: data.get('payment'),
      lines: getCart(),
    }),
  )
  clearCart()
  window.location.href = '../confirmation/'
})

document.title = 'Checkout · Rivlet'
